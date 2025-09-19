import { useParams } from "next/navigation";
import { Id } from "../../convex/_generated/dataModel";


export function isComicId(value: string): value is Id<"comics"> {
    
  return value.startsWith("comic_"); // or use a stricter check if you like
}