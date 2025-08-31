import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";

export const useGetAllComics=()=>{
    const data = useQuery(api.comics.getAllComics);
    const isLoading = data === undefined;
    return {data, isLoading};

}