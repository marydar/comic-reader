import React from 'react'
import {    
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { useGetAllComics } from "@/features/comic/api/use-get-all-comics"
import { Loader } from 'lucide-react'
import { useRouter } from "next/navigation"

const SearchModal = ({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) => {
    const router = useRouter()
    const {data, isLoading} = useGetAllComics()
    if(isLoading) return (
        <Loader/>
    )
    if(!data) return <div>no data</div>
    const handleComicClick = (id: string) => {
        console.log("clicked")
        onOpenChange(false)
        router.push(`/comic/${id}`)
    }
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} >
                        <CommandInput placeholder="Search" />
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {data?.map((comic) => (
                                    <div onClick={()=>handleComicClick(comic._id)} key={comic._id}>

                                        <CommandItem key={comic._id}>{comic.title}</CommandItem>
                                    </div>
                                ))}
                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup>
                                <CommandItem>Comic 4</CommandItem>
                                <CommandItem>Comic 5</CommandItem>
                                <CommandItem>Comic 6</CommandItem>
                            </CommandGroup>
                        </CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {/* <CommandEmpty>No results found.</CommandEmpty> */}
                        <CommandEmpty>No results found.</CommandEmpty>

                    </CommandDialog>
  )
}

export default SearchModal