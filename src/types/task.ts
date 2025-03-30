export interface Task {
    taskId: string;
    title: string;
    task: string;
    description: string;
    link: string;
    taskerCount: number;
    tasksAmount: number;
    amountPerTask: number;
    completedRate: { completeCount: number, remainingTasks: number };
    tokenId: string;
    tokenDenomination: number;
    createdTime: number;
    replies: Record<string, TaskReply>;
}

export interface TaskReply {
    replyId: string;
    url: string;
    createdTime: number;
    completedTasks: { amount: number, completedTime: number, proof: string };
    user: string;
    username: string;
    profileUrl: string;
    status: string;
    rank: string;
}