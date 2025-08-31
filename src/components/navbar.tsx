"use client"
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Search } from "lucide-react"
import { useState } from "react"
import { MenuIcon } from "lucide-react"
import { ChevronDownCircle } from "lucide-react"
import { ChevronDown } from "lucide-react"



import  Link  from "next/link"
import { UserButton } from "../features/auth/components/user-button"
import { Separator } from "./ui/separator"
 
export function Navbar() {
    const [open, setOpen] = useState(false)
    return (
        <div className="bg-primary text-primary-foreground text-center h-[70px] w-full flex justify-around items-center">
            <div className="flex justify-center items-center px-4 gap-2 ">
                <Link className="text-[24px] px-2 " href="/">MarComics</Link>
                <div className=" justify-center items-center px-4 gap-2 hidden md:flex">
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
            <div className="hidden md:flex justify-center items-center px-4 gap-4 ">
                <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none relative'>
                <div className="flex items-center cursor-pointer">
                    <ChevronDown className="text-primary-foreground cursor-pointer text-xl" />
                    <p className="text-[14px] px-2">Publish </p>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="bottom" className='w-40 mr-4 mt-4 bg-background text-primary'>
                <DropdownMenuItem className='h-10 bg-background text-primary flex flex-col'>
                    <Link className="text-[12px] p-2" href="/">Publish new Comic</Link>
                    <Separator/>
                </DropdownMenuItem>
                <DropdownMenuItem className='h-10 bg-background text-primary flex flex-col'>
                    <Link className="text-[12px] p-2" href="/">Publish new chapter</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
                
                <UserButton variant="background"/>
                {/* <Link className="text-[14px] px-5  py-3 text-primary bg-background hover:bg-background/90 cursor-pointer rounded-xl " href="/">Login</Link> */}
            </div>
            <div className="md:hidden">
            <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none relative'>
                <MenuIcon className="text-primary-foreground text-[24px] cursor-pointer md:hidden" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="bottom" className='w-40 mr-4 mt-4 bg-background text-primary'>
                <DropdownMenuItem className='h-10 bg-background text-primary flex flex-col'>
                    <Link className="text-[14px] px-2" href="/">Home</Link>
                </DropdownMenuItem>
                    <Separator/>
                <DropdownMenuItem className='h-10 bg-background text-primary flex flex-col'>
                    <Link className="text-[14px] px-2" href="/">Browse</Link>
                </DropdownMenuItem>
                    <Separator/>
                <DropdownMenuItem className='h-10 bg-background text-primary flex justify-left ' onClick={()=>{setOpen(true)}}>
                    {/* <div className="flex justify-between  bg-background text-primary" onClick={()=>{setOpen(true)}}> */}
                        {/* <div className="flex text-left bg-amber-700 pr-2"> */}
                        <Search className=" text-primary"/>
                        {/* </div> */}
                        
                        <p className="text-primary px-5">Search</p>
                    {/* </div> */}
                </DropdownMenuItem>
                    <Separator/>
                <DropdownMenuItem className='h-10 bg-background text-primary flex flex-col'>
                    <Link className="text-[14px] px-2" href="/">Publish</Link>
                </DropdownMenuItem>
                    <Separator/>
                <DropdownMenuItem className='h-14 bg-background text-primary flex justify-left'>
                    <UserButton variant="primary" />
                    <p className="px-2">User</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </div> 
        </div>
    )
}