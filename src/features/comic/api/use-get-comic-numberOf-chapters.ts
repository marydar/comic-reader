import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetNumberOfChaptersProps {
    comicId: Id<"comics">;
}
export const useGetNumberOfChapters=({comicId}:useGetNumberOfChaptersProps)=>{
    const data = useQuery(api.comics.getNumberOfChapters, {comicId});
    const isLoading = data === undefined;
    return {data, isLoading};

}