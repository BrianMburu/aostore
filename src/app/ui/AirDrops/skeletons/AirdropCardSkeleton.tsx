// export function AirdropSkeleton() {
//     return (
//         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
//             <div className="animate-pulse">
//                 <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-3/4 mb-4" />
//                 <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/2 mb-6" />
//                 <div className="space-y-3">
//                     <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full" />
//                     <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-5/6" />
//                     <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-4/6" />
//                 </div>
//                 <div className="mt-6 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full w-1/3" />
//             </div>
//         </div>
//     );
// }

export function AirdropCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6" />
                </div>
                <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                </div>
            </div>
        </div>
    );
}