import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import  {useCreatePlaylist} from "@/features/playlist/api/use-create-playlist"
import { toast } from "sonner"
import { Id } from "../../../../convex/_generated/dataModel"
import { useGetPlaylistsByUserWithComic } from "@/features/playlist/api/use-get-playlists-by-user-with-comic"
import { useCurrentUser } from "@/features/auth/api/use-current-user"
import { useComicId}from "@/hooks/use-comic-id"
import { useCreatePlaylistItem } from "@/features/playlist/api/use-create-playlist-item"
import { useRemovePlaylistItem } from "@/features/playlist/api/use-remove-playlist-item"
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"

type Playlist = {
    _id:Id<"playlists">
    name:string
    hasThisComic:boolean
}
export default function AddToPlaylistModal({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) {
const [playlists, setPlaylists] = useState< Playlist []>([])
const {mutate:createPlaylist, isPending:isPendingCreatePlaylist} = useCreatePlaylist()

const currentUser = useCurrentUser()
const comicId = useComicId()
const {data:playlistsWithComic, isLoading:isLoadingPlaylistsWithComic} = useGetPlaylistsByUserWithComic({userId:currentUser.data?._id, comicId})

const {mutate:createPlaylistItem, isPending:isPendingCreatePlaylistItem} = useCreatePlaylistItem()
const {mutate:removePlaylistItem, isPending:isPendingRemovePlaylistItem} = useRemovePlaylistItem()

const [selected, setSelected] = useState<Id<"playlists">[]>([])
const [removed, setRemoved] = useState<Id<"playlists">[]>([]);
const [newPlaylistName, setNewPlaylistName] = useState("")

useEffect(() => {
  if (!playlistsWithComic) return;

  setPlaylists(prev => {
    // shallow compare: same length + same ids
    const isSame =
      prev.length === playlistsWithComic.length &&
      prev.every((p, i) => p._id === playlistsWithComic[i]._id && p.hasThisComic === playlistsWithComic[i].hasThisComic);

    return isSame ? prev : playlistsWithComic;
  });
}, [playlistsWithComic]);

console.log("curent user", currentUser)
if(!currentUser.data) return 
if(isLoadingPlaylistsWithComic) return <div>loading playlists</div>
if(!playlistsWithComic) return <div>no playlists</div>



  const toggleSelect = (pl: Playlist) => {

    const alreadySelected = selected.includes(pl._id);
    const alreadyRemoved = removed.includes(pl._id);

    if (pl.hasThisComic) {
    // originally had this comic
    if (alreadyRemoved) {
      // user re-checked → undo removal
      setRemoved(prev => prev.filter(id => id !== pl._id));
    } else {
      // user unchecked → mark for removal
      setRemoved(prev => [...prev, pl._id]);
    }
  } else {
    // originally did not have this comic
    if (alreadySelected) {
      // user unchecked → undo add
      setSelected(prev => prev.filter(id => id !== pl._id));
    } else {
      // user checked → mark for add
      setSelected(prev => [...prev, pl._id]);
    }
  }
    // setSelected(prev =>
    //   prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    // )
  }

  const handleAdd = async () => {
    console.log("Adding to playlists:", selected)
    console.log("removing from playlists:", removed)

    if (!selected.length && !removed.length) return;

    for (const id of selected) {
      await createPlaylistItem({
        playlistId: id,
        comicId,
      },{
        onSuccess: (data)=>{
          toast.success("comic added to playlist")
          setSelected([])
        },
        onError: (error)=>{
          toast.error("could not add to playlist")
        },
      }
    )}
    for (const id of removed) {
      await removePlaylistItem({
        playlistId: id,
        comicId,
      },{
        onSuccess: (data)=>{
          toast.success("comic removed from playlist")
          setRemoved([])
        },
        onError: (error)=>{
          toast.error("could not remove from playlist")
        },
      }
    )}

    onOpenChange(false)
    setSelected([])
    setRemoved([])
  }

  const handleCreatePlaylist = async () => {
    if (newPlaylistName.trim() !== "") {
    await createPlaylist({
      name: newPlaylistName,
      
    }, {
      onSuccess: (data)=>{
        toast.success("playlist created " + data)
        const newPlaylist: Playlist = {
            _id: crypto.randomUUID() as Id<"playlists">, // temporary id until saved
            name: newPlaylistName,
            hasThisComic: false, // new playlists start without this comic
        };

        setPlaylists(prev => [...prev, newPlaylist]);
        setNewPlaylistName("")
      },
      onError: (error)=>{
        toast.error("could not create playlist")
      },
    })
      
    }
  }

  // <CommandDialog open={open} onOpenChange={onOpenChange} >
  //                       <CommandInput placeholder="Search" />
  //                       <CommandList>
  //                           <CommandEmpty>No results found.</CommandEmpty>
  //                           <CommandGroup>
  //                               {data?.map((comic) => (
  //                                   <div onClick={()=>handleComicClick(comic._id)} key={comic._id}>

  //                                       <CommandItem key={comic._id}>{comic.title}</CommandItem>
  //                                   </div>
  //                               ))}
  //                           </CommandGroup>
  //                           <CommandSeparator />
  //                           <CommandGroup>
  //                               <CommandItem>Comic 4</CommandItem>
  //                               <CommandItem>Comic 5</CommandItem>
  //                               <CommandItem>Comic 6</CommandItem>
  //                           </CommandGroup>
  //                       </CommandList>
  //                       <CommandEmpty>No results found.</CommandEmpty>
  //                       <CommandEmpty>No results found.</CommandEmpty>
  //                       {/* <CommandEmpty>No results found.</CommandEmpty> */}
  //                       <CommandEmpty>No results found.</CommandEmpty>

  //                   </CommandDialog>

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
       <CommandDialog open={open} onOpenChange={onOpenChange} >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Playlist</DialogTitle>
          <CommandInput placeholder="Search playlists" />
        </DialogHeader>

        <div className="space-y-3 max-h-[200px] overflow-y-auto scrollbar">
        {playlists?.length === 0 && (
          <div className="text-left text-foreground/80 text-[12px] md:text-[14px]">
            You have no playlists yet. Create one to get started.
          </div>
        )}
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup >
            {playlists?.map(pl => (
              <div key={pl._id} className="flex items-center space-x-2 w-full">
                
                <CommandItem className="hover:bg-foreground/10 cursor-pointer" onClick={()=>toggleSelect(pl)}>
                <div className="flex w-[100vh] items-center justify-start gap-2">
                  <Checkbox
                  checked={
                      (pl.hasThisComic && !removed.includes(pl._id)) || 
                      selected.includes(pl._id)
                  }
                  onCheckedChange={() => toggleSelect(pl)}
                />
                  {pl.name}
                </div>
                  
                </CommandItem>
                {/* <span>{pl.name}</span> */}
              </div>
            ))}
            </CommandGroup>
        </CommandList>

        </div>
        <div className="flex gap-2 mt-4">
            <Input
              placeholder="New playlist name"
              value={newPlaylistName}
              onChange={e => setNewPlaylistName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter") {
                e.preventDefault() // prevent form submit or accidental dialog close
                handleCreatePlaylist()
                }
            }}
              
            />
            <Button onClick={handleCreatePlaylist} className="cursor-pointer">Create</Button>
          </div>

        <DialogFooter>
          <Button onClick={handleAdd} className="w-full cursor-pointer">Apply changes</Button>
        </DialogFooter>
      </DialogContent>
      </CommandDialog>
    </Dialog>
  )
}
