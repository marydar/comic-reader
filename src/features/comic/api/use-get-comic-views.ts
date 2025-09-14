import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetViewsProps {
    comicId: Id<"comics">;
}
export const useGetViews=({comicId}:useGetViewsProps)=>{
    const data = useQuery(api.comics.getNumberOfViews, {comicId});
    const isLoading = data === undefined;
    return {data, isLoading};

}