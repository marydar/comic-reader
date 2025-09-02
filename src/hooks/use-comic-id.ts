import {useParams} from "next/navigation"
import {Id} from "../../convex/_generated/dataModel"

export const useComicId = () => {
    const params = useParams()
    return params.comicId as Id<"comics">   
}