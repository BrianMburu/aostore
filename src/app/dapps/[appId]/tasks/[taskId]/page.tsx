import { TaskDetailsMain } from '@/app/ui/Dapps/Tasks/TaskDetailsMain';
import { TaskReplyParams } from '@/services/ao/taskService';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

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
        <div>
            <div className="mb-8">
                <Link
                    href={`/dapps/${appId}/tasks`}
                    className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300"
                >
                    <ArrowLeftIcon className="h-5 w-5 mr-2" />
                    Back to Tasks
                </Link>
            </div>
            <TaskDetailsMain taskId={taskId} appId={appId} searchParams={searchParams} />
        </div>
    )
}