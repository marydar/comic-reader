import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetComicByIdProps {
    comicId: string
}
export const useGetComicById=({comicId}:useGetComicByIdProps)=>{
    const enabled = !!comicId;
    let data;
try {
  data = useQuery(api.comics.getComicById, { comicId: comicId as Id<"comics"> });
} catch (e) {
  // Convex throws ArgumentValidationError if rawId isn't a comics Id
  data = null;
}
    // const data = useQuery(api.comics.getComicById, enabled ? {comicId} : "skip");
    const isLoading = enabled && data === undefined;
    return { data: data ?? null, isLoading };
}