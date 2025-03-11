// app/dapps/page.tsx
import { DAppsList } from "../ui/Dapps/DappsList";
import { Suspense } from "react";
import DappCardsSkeleton from "../ui/Dapps/Skeletons/DappCardsSkeleton";
import { FavoriteDAppsList } from "../ui/Dapps/FavoritesDApsList";
import { DAppFilter } from "../ui/Dapps/DappFilter";

export default async function DAppsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {

  const params = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <DAppFilter />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Favorites Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Your Favorites
          </h2>
          <Suspense fallback={<DappCardsSkeleton n={3} />}>
            <FavoriteDAppsList params={params} />
          </Suspense>
        </section>

        {/* Top DApps Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Top DApps
          </h2>
          <Suspense fallback={<DappCardsSkeleton n={8} />}>
            <DAppsList params={params} />
          </Suspense>
        </section>
      </main>
    </div>
  );
}
