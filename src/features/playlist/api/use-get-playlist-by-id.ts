import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetPlaylistByIdProps {
    playlistId: Id<"playlists">;
}
export const useGetPlaylistById=({playlistId}:useGetPlaylistByIdProps)=>{
    const data = useQuery(api.playlists.getPlaylistById, {playlistId});
    const isLoading = data === undefined;
    return {data, isLoading};

}