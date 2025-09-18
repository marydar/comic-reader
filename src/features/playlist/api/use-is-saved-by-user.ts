import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";


interface useIsSavedByUserProps {
  userId?: Id<"users">;
  playlistId?: Id<"playlists">;
}

export const useIsSavedByUser = ({
  userId,
  playlistId,
}: useIsSavedByUserProps) => {
  const enabled = !!userId && !!playlistId; // only run query if both exist

  const data = useQuery(
    api.playlistSaves.getIsSavedByUser,
    enabled ? { userId, playlistId } : "skip"
  );

  const isLoading = enabled && data === undefined;
  return { data: data ?? [], isLoading };
};