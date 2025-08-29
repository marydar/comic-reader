"use client"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import {Button} from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Search } from "lucide-react"
import { useState } from "react"



import  Link  from "next/link"
import { UserButton } from "../features/auth/components/user-button"
 
export function Navbar() {
    const [open, setOpen] = useState(false)
    return (
        <div className="bg-primary text-primary-foreground text-center h-[70px] w-full flex justify-around items-center">
            <div className="flex justify-center items-center px-4 gap-2">
                <Link className="text-[24px] px-2 " href="/">MarComics</Link>
                <Link className="text-[14px] px-5  py-2 bg-white/25 cursor-pointer rounded-xl " href="/">Home </Link>
                <Link className="text-[14px] px-2" href="/">Browse</Link>
                <Button onClick={()=>{setOpen(true)}} className="bg-background text-primary-foreground w-sm h-[35px] justify-start hover:bg-background/90 cursor-pointer rounded-3xl" size="sm">
                    <Search className="mr-2 text-primary" />
                    <span className="text-primary">Search</span>
                </Button>
                <CommandDialog open={open} onOpenChange={setOpen} >
                    <CommandInput placeholder="Search" />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            <CommandItem>Comic 1</CommandItem>
                            <CommandItem>Comic 2</CommandItem>
                            <CommandItem>Comic 3</CommandItem>
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
            </div>
            {/* <div>
                <NavigationMenu>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-[14px] px-2 text-primary-foreground">Publish</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <NavigationMenuLink asChild>
                            <Link href="/">Publish new Comic </Link>
                        </NavigationMenuLink>
                        <NavigationMenuLink asChild>
                            <Link href="/">Publish new Chapter </Link>
                        </NavigationMenuLink>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                </NavigationMenu>
            </div> */}
            <div>
                <Link className="text-[14px] px-2" href="/">Publish </Link>
                <UserButton/>
                {/* <Link className="text-[14px] px-5  py-3 text-primary bg-background hover:bg-background/90 cursor-pointer rounded-xl " href="/">Login</Link> */}
            </div>
        </div>
    )
}