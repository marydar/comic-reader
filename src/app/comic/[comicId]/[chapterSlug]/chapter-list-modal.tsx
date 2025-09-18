import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import  {useCreatePlaylist} from "@/features/playlist/api/use-create-playlist"
import { toast } from "sonner"
import { Id } from "../../../../../convex/_generated/dataModel"
import { useGetPlaylistsByUserWithComic } from "@/features/playlist/api/use-get-playlists-by-user-with-comic"
import { useCurrentUser } from "@/features/auth/api/use-current-user"
import { useComicId}from "@/hooks/use-comic-id"
import { useCreatePlaylistItem } from "@/features/playlist/api/use-create-playlist-item"
import { useRemovePlaylistItem } from "@/features/playlist/api/use-remove-playlist-item"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { useGetNumberOfChapters } from "@/features/comic/api/use-get-comic-numberOf-chapters"
import { useGetChapters } from "@/features/chapter/api/use-get-chapters"  
import ChapterList from "@/features/chapter/components/chapter-list"



export default function ChapterListModal({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) {
  const comicId = useComicId()
  const {data:numberOfChapters, isLoading:isLoadingNumberOfChapters} = useGetNumberOfChapters({comicId})
  const [sortOption, setSortOption] = useState<"asc" | "desc">("desc");
  const {results:comicChapters, status, loadMore} = useGetChapters({comicId, sortOption})
  const chapters = (comicChapters ?? []).map((chapter) => ({
    _id: chapter._id,
    title: chapter.title,
    thumbnail: chapter.thumbnail, // safe fallback
    createdAt: chapter._creationTime,
    likes: chapter.likes,
    views: chapter.views,
    order: chapter.order,
    isSeen: chapter.isSeen,
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-bars/60 backdrop-blur-lg">
        <DialogHeader>
          <DialogTitle>Chapters</DialogTitle>
        </DialogHeader>
        <ChapterList chapters={chapters}  numberOfChapters={numberOfChapters} handleAddNewChapter={()=>{}} userIsCreator={false} sortOption={sortOption} setSortOption={setSortOption} loadMore={loadMore} isLoadingMore={status === "LoadingMore"} canLoadMore={status === "CanLoadMore"} comicId={comicId} isModal={true}/>
      </DialogContent>
     
    </Dialog>
  )
}
