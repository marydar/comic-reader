import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetViewsProps {
    comicId: Id<"comics">;
    order?: number;
}
export const useGetChapterAdjacent=({comicId, order}:useGetViewsProps)=>{    
    const enabled = !!comicId && !!order;
    const data = useQuery(
        api.chapter.adjacent,
         enabled ? { comicId, order } : "skip"
        );
    const isLoading = enabled && data === undefined;
    return {data: data ?? null, isLoading};

}