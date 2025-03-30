import { TaskDetailsMain } from '@/app/ui/Dapps/Tasks/TaskDetailsMain';
import { TaskReplyParams } from '@/services/ao/taskService';

interface Props {
    params: Promise<{ appId: string, taskId: string }>;
    searchParams: Promise<TaskReplyParams>;
}

export default async function TaskDetailsPage(props: Props) {
    const currParams = await props.params;
    const appId = currParams.appId as string;
    const taskId = currParams.taskId as string;
    const searchParams = await props.searchParams

    return (
        <TaskDetailsMain taskId={taskId} appId={appId} searchParams={searchParams} />
    )
}