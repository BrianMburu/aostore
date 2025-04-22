import { Pagination } from "@/types/pagination";

export async function fetchAllPages<T>(fetchFn: (page: number) => Promise<{ data: T[], pagination: Pagination }>) {
    let page = 1;
    let totalPages = 1;
    const allData: T[] = [];

    do {
        const { data, pagination } = await fetchFn(page);
        allData.push(...data);
        totalPages = pagination.totalPages;
        page++;
    } while (page <= totalPages);

    return allData;
}