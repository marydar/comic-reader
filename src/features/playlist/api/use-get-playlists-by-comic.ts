import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetPlaylistsByComicIdProps {
    comicId?: Id<"comics">;
}
export const useGetPlaylistsByComicId=({comicId}:useGetPlaylistsByComicIdProps)=>{
    const enabled = !!comicId;
    const data = useQuery(api.playlists.getPlaylistsByComic, 
        enabled ? {comicId} : "skip"
    );
    
    const isLoading = enabled && data === undefined;
    return {data, isLoading};

}
