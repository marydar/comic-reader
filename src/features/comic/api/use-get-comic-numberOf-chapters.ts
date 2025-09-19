import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetNumberOfChaptersProps {
    comicId?: Id<"comics">;
}
export const useGetNumberOfChapters=({comicId}:useGetNumberOfChaptersProps)=>{
    const enabled = !!comicId;
    const data = useQuery(api.comics.getNumberOfChapters,
        enabled ? {comicId} : "skip"
    );
    const isLoading = enabled && data === undefined;
    return { data: data ?? null, isLoading };

}