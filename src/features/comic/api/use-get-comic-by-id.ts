import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

interface useGetComicByIdProps {
    comicId: Id<"comics">;
}
export const useGetComicById=({comicId}:useGetComicByIdProps)=>{
    const data = useQuery(api.comics.getComicById, {comicId});
    const isLoading = data === undefined;
    return {data, isLoading};

}