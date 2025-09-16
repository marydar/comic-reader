import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetViewsProps {
    comicId: Id<"comics">;
    order: number;
}
export const useGetChapterByOrder=({comicId, order}:useGetViewsProps)=>{    
    const data = useQuery(api.chapter.adjacent, {comicId, order});
    const isLoading = data === undefined;
    return {data, isLoading};

}