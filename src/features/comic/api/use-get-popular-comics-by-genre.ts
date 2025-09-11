import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { genreEnum } from "../../../../convex/genres";
type Genre = typeof genreEnum.type;

interface useGetPoplularComicsByGenreProps{
    genre: Genre;
}
export const useGetPoplularComicsByGenre=({genre}:useGetPoplularComicsByGenreProps)=>{
    const data = useQuery(api.comics.getPopularComicsByGenre, {genre});
    const isLoading = data === undefined;
    return {data, isLoading};

}