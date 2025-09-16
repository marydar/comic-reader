import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";

const BATCH_SIZE = 10;
interface useGetChaptersProps{
    comicId: Id<"comics">;
    sortOption?: "asc" | "desc";
}

export type GetChaptersReturnType = typeof api.chapter.getChapters._returnType["page"]  
export const useGetChapters=({comicId, sortOption}:useGetChaptersProps)=>{
    const { results, status, loadMore } = usePaginatedQuery(
        api.chapter.getChapters,
    { 
        comicId:comicId,
        sortOption: sortOption,
     },
    { initialNumItems: BATCH_SIZE },
  );
    return {
        results,
        status,
        loadMore: () => loadMore(BATCH_SIZE),
        };

}