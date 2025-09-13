import {useParams} from "next/navigation"
import {Id} from "../../convex/_generated/dataModel"

export const usePlaylistId = () => {
    const params = useParams()
    return params.comicListId as Id<"playlists">   
}