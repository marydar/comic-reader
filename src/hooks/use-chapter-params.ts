
import {useParams} from "next/navigation"
import {Id} from "../../convex/_generated/dataModel"

export const useChapterSlug = () => {
    const params = useParams()
    return params.chapterSlug as string  
}