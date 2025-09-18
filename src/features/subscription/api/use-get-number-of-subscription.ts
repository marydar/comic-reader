import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetNumberOfSubscriptionsProps {
    comicId: Id<"comics">;
}
export const useGetNumberOfSubscriptions=({comicId}:useGetNumberOfSubscriptionsProps)=>{
    const data = useQuery(api.subscriptions.getNumberOfSubscriptions, {comicId});
    const isLoading = data === undefined;
    return {data, isLoading};

}