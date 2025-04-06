import { PROCESS_ID_TASKS_TABLE } from "@/config/ao";
import { TaskService } from "@/services/ao/taskService";
import { TokenService } from "@/services/ao/tokenService";
import { AppTokenData } from "@/types/dapp";
import { Rank } from "@/types/rank";
import { Task, TaskReply } from "@/types/task";
import { User } from "@/types/user";
import * as z from "zod";

export type TaskState = {
    message?: string | null;
    errors?: {
        title?: string[],
        amount?: string[],
        task?: string[],
        description?: string[],
        taskerCount?: string[],
        link?: string[],
    };
    task?: Task | null
};

export const taskSchema = z
    .object({
        title: z.string().min(3, { message: "Name must be at least 3 characters" }),
        amount: z.number().gt(0, { message: "Amount must be greater than 0" }),
        task: z.string().min(10, { message: "Task must be at least 10 characters" }),
        description: z.string().min(10, { message: "Description must be at least 10 characters" }),
        taskerCount: z.number().gt(0, { message: "Taskers count must be greater than 0" }),
        link: z.string().url({ message: "Link is not a valid url" }),
    })

export async function createTask(appId: string, prevState: TaskState, formData: FormData) {
    // Fetch raw form data.
    const title = formData.get("title");
    const amount = formData.get("amount");
    const task = formData.get("task");
    const description = formData.get("description");
    const taskerCount = formData.get("taskerCount");
    const link = formData.get("link");

    // Build our data object. Note: amount should be a number.
    const data = {
        title,
        task,
        amount: Number(amount),
        taskerCount: Number(taskerCount),
        description,
        link
    };

    const validatedFields = taskSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to submit Airdrop.',
        };
    }
    try {
        // console.log(validatedFields.data)
        // Fetch Token Data
        const tokenData: AppTokenData = await TokenService.fetchTokenDetails(appId);

        // Transfer to our main Process.
        const amount = validatedFields.data.amount
        await TokenService.transferToken(tokenData.tokenId, PROCESS_ID_TASKS_TABLE, amount * tokenData.tokenDenomination);

        // Confirm Deposit.
        const taskId = await TaskService.confirmTaskTokenDeposit(appId, tokenData, amount);

        // Create Airdrop
        const newTask = await TaskService.createTask(appId, taskId, validatedFields.data);

        return { message: 'success', task: newTask };

    } catch (error) {
        return { message: `AO Error: failed to submit Airdrop: ${error}` };
    }
}

export type TaskReplyState = {
    message?: string | null;
    errors?: {
        url?: string[],
    };
    reply?: TaskReply | null
};

export const taskReplySchema = z
    .object({
        url: z.string().url({ message: "Link is not a valid url" }),
    })

export async function sendReply(appId: string, taskId: string, user: User | null, rank: Rank, prevState: TaskReplyState, formData: FormData) {
    const validatedFields = taskReplySchema.safeParse({
        url: formData.get('url'),
    });

    if (!user) {
        return { message: 'Invalid Session: User not Found!' }
    }

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Form has errors. Failed to send reply.',
        };
    }

    try {

        const reply = await TaskService.submitReply(appId, taskId, user, rank, validatedFields.data);

        return { message: 'success', reply: reply };

    } catch {
        return { message: 'AO Error: failed to send reply.' };
    }
}
