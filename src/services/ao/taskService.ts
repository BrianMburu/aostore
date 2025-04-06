import { PROCESS_ID_TASKS_TABLE } from '@/config/ao';
import { DEFAULT_PAGE_SIZE } from '@/config/page';
import { AppTokenData } from '@/types/dapp';
import { Rank } from '@/types/rank';
import { Task, TaskReply } from '@/types/task';
import { Tip } from '@/types/tip';
import { User } from '@/types/user';
import { cleanAoJson, fetchAOmessages } from '@/utils/ao';

export interface TaskFilterParams {
    tokenId?: string;
    search?: string;
    page?: string;
}
export interface TaskReplyParams {
    status?: string;
    page?: string;
}

export const TaskService = {
    async fetchTasks(appId: string, params: TaskFilterParams, useInfiniteScroll: boolean = false): Promise<{ tasks: Task[], total: number }> {
        let fetchedTasks: Task[] = [];
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchAppTasks" },
                { name: "appId", value: appId }

            ], PROCESS_ID_TASKS_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Requests Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                fetchedTasks = Object.values(messageData.data);
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch tasks, ${error}`)
        }

        const filtered = fetchedTasks.filter(task => {
            const matchesTokenId = !params.tokenId || task.tokenId === params.tokenId
            const matchesSearch = !params.search || task.title.toLowerCase().includes(params.search.toLowerCase());

            return matchesSearch && matchesTokenId;
        });

        // Pagination
        const page = Number(params?.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort and slice the data for the current page
        const sortedData = filtered
            .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())

        const tasks = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        return {
            tasks,
            total: filtered.length
        }
    },

    async fetchTask(appId: string, taskId: string): Promise<Task> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FetchTaskInfo" },
                { name: "appId", value: appId },
                { name: "taskId", value: taskId }

            ], PROCESS_ID_TASKS_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Feature Requests Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const forumPost = messageData.data;

                return forumPost
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to get task data, ${error}`)
        }
    },

    async createTask(appId: string, taskId: string, taskData:
        { title: string, task: string, taskerCount: number, description: string, link: string }): Promise<Task> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "FinalizeTask" },
                { name: "appId", value: appId },
                { name: "taskId", value: taskId },
                { name: "title", value: taskData.title },
                { name: "task", value: taskData.task },
                { name: "taskerCount", value: String(taskData.taskerCount) },
                { name: "description", value: taskData.description },
                { name: "link", value: taskData.link }

            ], PROCESS_ID_TASKS_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const newTask: Task = messageData.data;
                // console.log("New Task Data: => ", newTask)
                return newTask;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to submit Question, ${error}`)
        }
    },

    async confirmTaskTokenDeposit(appId: string, tokenData: AppTokenData, amount: number): Promise<string> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "DepositConfirmedAddNewTask" },
                { name: "appId", value: appId },
                { name: "tokenId", value: String(tokenData.tokenId) },
                { name: "tokenName", value: String(tokenData.tokenName) },
                { name: "tokenTicker", value: String(tokenData.tokenTicker) },
                { name: "tokenDenomination", value: String(tokenData.tokenDenomination) },
                { name: "amount", value: String(amount) },

            ], PROCESS_ID_TASKS_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data)

            const messageData = JSON.parse(cleanedData);

            // console.log("Dapps Messages Data => ", messageData);

            if (messageData && messageData.code == 200) {
                const airdropId = messageData.data;
                return airdropId

            } else {
                throw new Error(messageData.message)
            }

        } catch (error) {
            console.error(error);
            throw new Error(`Failed to fetch Data, ${error}`)
        }

    },

    async submitReply(appId: string, taskId: string, user: User, rank: Rank, replyData: { url: string }): Promise<TaskReply> {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "AddTaskReply" },
                { name: "appId", value: appId },
                { name: "taskId", value: taskId },
                { name: "url", value: replyData.url },
                { name: "username", value: user.username },
                { name: "profileUrl", value: user.avatar || "" },
                { name: "rank", value: rank.rank }

            ], PROCESS_ID_TASKS_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);
            // console.log("Task Reply Data: => ", cleanedData)

            const messageData = JSON.parse(cleanedData);

            if (messageData.code === 200) {
                const replyData: TaskReply = messageData.data;
                return replyData;
            }
            else {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to send task reply, ${error}`)
        }
    },

    async RewardTask(appId: string, taskId: string, replyId: string) {
        try {
            const messages = await fetchAOmessages([
                { name: "Action", value: "RewardTask" },
                { name: "appId", value: appId },
                { name: "taskId", value: taskId },
                { name: "replyId", value: replyId },

            ], PROCESS_ID_TASKS_TABLE);

            if (!messages || messages.length === 0) {
                throw new Error("No messages were returned from ao. Please try later.");
            }

            // Fetch the last message
            const lastMessage = messages[messages.length - 1];

            // Parse the Messages
            const cleanedData = cleanAoJson(lastMessage.Data);

            const messageData = JSON.parse(cleanedData);

            if (!messageData || messageData.code !== 200) {
                throw new Error(messageData.message)
            }
        } catch (error) {
            console.error(error);
            throw new Error(`Failed to submit Task Reward, ${error}`)
        }
    },

    async tip(tipData: Tip) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Add Ao handler

        const newTip = tipData;
        return newTip
    },

    processTaskReplies(taskReplies: TaskReply[], params: TaskReplyParams, useInfiniteScroll: boolean = false): { replies: TaskReply[], total: number } {

        const filtered = taskReplies.filter(reply => {
            const matchesreplyStatus = !params.status || reply.status === params.status

            return matchesreplyStatus;
        });

        // Pagination
        const page = Number(params?.page) || 1;
        const itemsPerPage = DEFAULT_PAGE_SIZE; // Ensure DEFAULT_PAGE_SIZE is defined

        // Sort and slice the data for the current page
        const sortedData = filtered
            .sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime())

        const replies = useInfiniteScroll
            ? sortedData.slice(0, page * itemsPerPage)
            : sortedData.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        return {
            replies,
            total: filtered.length
        }
    },
}