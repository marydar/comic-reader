import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetNumberOfSubscriptionsProps {
    comicId?: Id<"comics">;
}
export const useGetNumberOfSubscriptions=({comicId}:useGetNumberOfSubscriptionsProps)=>{
    const enabled = !!comicId;

    const data = useQuery(api.subscriptions.getNumberOfSubscriptions,
        enabled ? {comicId} : "skip"
    );
    const isLoading = enabled && data === undefined;
    return {data: data ?? null, isLoading};

}