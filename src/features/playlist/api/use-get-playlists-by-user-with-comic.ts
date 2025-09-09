import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

// interface useGetPlaylistsByUserWithComicProps {
//     userId: Id<"users">;
//     comicId: Id<"comics">;
// }
// export const useGetPlaylistsByUserWithComic=({userId, comicId}:useGetPlaylistsByUserWithComicProps)=>{
//     const data = useQuery(api.playlists.getUserPlaylistsForComic, {userId,comicId});
//     const isLoading = data === undefined;
//     return {data, isLoading};

// }

interface UseGetPlaylistsByUserWithComicProps {
  userId?: Id<"users">;
  comicId?: Id<"comics">;
}

export const useGetPlaylistsByUserWithComic = ({
  userId,
  comicId,
}: UseGetPlaylistsByUserWithComicProps) => {
  const enabled = !!userId && !!comicId; // only run query if both exist

  const data = useQuery(
    api.playlists.getUserPlaylistsForComic,
    enabled ? { userId, comicId } : "skip"
  );

  const isLoading = enabled && data === undefined;
  return { data: data ?? [], isLoading };
};
