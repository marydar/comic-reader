import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import  {useConvex} from "convex/react"
import { keepPreviousData } from "@tanstack/react-query";
import { genreEnum } from "../../../../convex/genres";

export type Genre = typeof genreEnum.type;

interface useGetComicsProps{
    page: number;
    pageSize: number;
    searchedName?: string;
    sortBy?: "views" | "date" | "subscriptions" | "names";
    genres?: Genre[];
    playlistId?: Id<"playlists">;
    subscriberId?: Id<"users">;
    creatorId?: Id<"users">;
}

export function useGetComics(args: useGetComicsProps) {
    const convex = useConvex();
    if(!args.sortBy) args.sortBy = "views";
    // const enabled = !!args.subscriberId && !!comicId;

  return useQuery({
    queryKey: ["comics", args],
    queryFn: () => convex.query(api.comics.getComics, args),
    placeholderData: keepPreviousData, 
  });
}
