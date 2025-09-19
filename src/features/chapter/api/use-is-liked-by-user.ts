import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useIsLikedByUserProps {
    chapterId?: Id<"chapters">;
}
export const useIsLikedByUser=({chapterId}:useIsLikedByUserProps)=>{
    const enabled = !!chapterId;
    
    const data = useQuery(
        api.chapter.getIsLiked,
        enabled ? { chapterId } : "skip"
        );
    const isLoading = enabled && data === undefined;
    return {data: data ?? null, isLoading};

}