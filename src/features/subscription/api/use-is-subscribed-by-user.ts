import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// interface useIsSubscribedByUserProps {
//     comicId: Id<"comics">;
// }
// export const useIsSubscribedByUser=({comicId}:useIsSubscribedByUserProps)=>{
//     const data = useQuery(api.subscriptions.isComicSubscribed, {comicId});
//     const isLoading = data === undefined;
//     return {data, isLoading};

// }
interface useIsSubscribedByUserProps {
  userId?: Id<"users">;
  comicId?: Id<"comics">;
}

export const useIsSubscribedByUser = ({
  userId,
  comicId,
}: useIsSubscribedByUserProps) => {
  const enabled = !!userId && !!comicId; // only run query if both exist

  const data = useQuery(
    api.subscriptions.isComicSubscribed,
    enabled ? { userId, comicId } : "skip"
  );

  const isLoading = enabled && data === undefined;
  return { data: data ?? [], isLoading };
};