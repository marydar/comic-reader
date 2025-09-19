import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetViewsProps {
    comicId?: Id<"comics">;
}
export const useGetViews=({comicId}:useGetViewsProps)=>{
    const enabled = !!comicId;
    const data = useQuery(api.comics.getNumberOfViews,
        enabled ? {comicId} : "skip"
    );
    const isLoading = enabled && data === undefined;
    return { data: data ?? null, isLoading };

}