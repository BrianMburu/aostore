
import { ForumFilters } from "@/app/ui/MyDapps/Forum/ForumFilters";
import { QuestionsList } from "@/app/ui/MyDapps/Forum/QuestionsList"

export default async function ForumPage() {

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <h2 className="text-xl font-bold dark:text-white mb-4 md:mb-0">Forum Questions</h2>
                <ForumFilters />
            </div>

            <QuestionsList />
        </div>
    )
}