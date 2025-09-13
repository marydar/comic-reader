import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import  {useConvex} from "convex/react"
import { keepPreviousData } from "@tanstack/react-query";




interface useGetPlaylistsPaginationProps{
    page: number;
    pageSize: number;
    searchedName?: string;
    sortBy?: "numberOfComics" | "date" | "saves" | "names";
    comicId?: Id<"comics">;
    creatorId?: Id<"users">;
    savedByUserId?: Id<"users">;
}

export function useGetPlaylistsPagination(args: useGetPlaylistsPaginationProps) {
    const convex = useConvex();
    if(!args.sortBy) args.sortBy = "saves";
    // const enabled = !!args.subscriberId && !!comicId;

  return useQuery({
    queryKey: ["playlists", args],
    queryFn: () => convex.query(api.playlists.getPlaylistsPagination, args),
    placeholderData: keepPreviousData, 
  });
}
