import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetPlaylistsByComicIdProps {
    comicId: Id<"comics">;
}
export const useGetPlaylistsByComicId=({comicId}:useGetPlaylistsByComicIdProps)=>{
    const data = useQuery(api.playlists.getPlaylistsByComic, {comicId});
    const isLoading = data === undefined;
    return {data, isLoading};

}