"use client"
import {Button} from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Moon, Search, Sun } from "lucide-react"
import { use, useState } from "react"
import { MenuIcon } from "lucide-react"
import { ChevronDownCircle } from "lucide-react"
import { ChevronDown } from "lucide-react"
import { useCurrentUser } from "@/features/auth/api/use-current-user"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"


import  Link  from "next/link"
import { UserButton } from "../features/auth/components/user-button"
import { Separator } from "./ui/separator"
import SearchModal from "./search"
import { useEffect } from "react"
import {useTheme} from "next-themes";


export function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted , setMounted] = useState(false);
    const [open, setOpen] = useState(false)
    const {data, isLoading} = useCurrentUser();
    useEffect(() => {
        setMounted(true);
    }, []);
    if(!mounted) return null
    // const body = document.body;
    // const [theme, setTheme] = useState("dark");
    // useEffect(() => {
    //     if (theme === "dark") {
    //         body.classList.add("dark");
    //     } else {
    //         body.classList.remove("dark");
    //     }
    // }, [theme]);

    // map routes to isActive values
    const getActive = (path: string) => {
        if (path === "/home") return "home";
        if (path.startsWith("/browse")) return "browse";
        if (path.startsWith("/publishComic")) return "publishComic";
        return null;
    };
    const isActive = getActive(pathname);
    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    };
    
    
    return (
        <div className="bg-primary text-primary-foreground text-center h-[70px] w-full flex justify-around items-center ">
            <SearchModal open={open} onOpenChange={setOpen}/>
            <div className="flex  px-8 w-full">
            <div className="flex justify-left items-center gap-2 w-full ">
                <Link className="text-[24px] px-2 " href="/">MarComics</Link>
                <div className=" justify-center items-center px-4 gap-2 hidden md:flex">
                    <Link className={cn("text-[14px] px-5  py-2  cursor-pointer rounded-xl ", isActive === "home" && "bg-white/25")} href="/home">Home </Link>
                    <Link className={cn("text-[14px] px-5  py-2  cursor-pointer rounded-xl", isActive === "browse" && "bg-white/25")} href="/browse">Browse</Link>
                    <Button onClick={()=>{setOpen(true)}} className="bg-background text-primary-foreground lg:w-sm md:w-[200px] h-[35px] justify-start hover:bg-background/90 cursor-pointer rounded-3xl" size="sm">
                        <Search className="mr-2 text-primary" />
                        <span className="text-primary">Search</span>
                    </Button>
                    
                </div>
            </div>
            <div className="hidden md:flex justify-center items-center px-4 gap-4 ">
                {data &&
                        <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className='outline-none relative '>
                        <div className={cn ("flex items-center cursor-pointer px-5  py-2 rounded-xl", isActive === "publishComic" && "bg-white/25")}>
                            <ChevronDown className="text-primary-foreground cursor-pointer text-xl" />
                            <p className="text-[14px] px-2">Publish </p>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" side="bottom" className='w-40 mr-4 mt-4 bg-background text-primary'>
                        <DropdownMenuItem className='h-10 bg-background text-primary flex flex-col'>
                            <Link className="text-[12px] p-2" href="/publishComic">Publish new Comic</Link>
                            <Separator/>
                        </DropdownMenuItem>
                        <DropdownMenuItem className='h-10 bg-background text-primary flex flex-col'>
                            <Link className="text-[12px] p-2" href="/publishChapter">Publish new chapter</Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                }
                <Sun className={cn("text-primary-foreground text-[24px] cursor-pointer flex", resolvedTheme === "light" && "hidden")} onClick={toggleTheme}/>
                <Moon className={cn("text-primary-foreground text-[24px] cursor-pointer flex", resolvedTheme === "dark" && "hidden")} onClick={toggleTheme}/>
                <UserButton variant="background"/>
                {/* <Link className="text-[14px] px-5  py-3 text-primary bg-background hover:bg-background/90 cursor-pointer rounded-xl " href="/">Login</Link> */}
            </div>
            <div className="md:hidden flex items-center justify-center">
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
                    <Link className="text-[14px] px-2" href="/browse">Browse</Link>
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
                    {data &&
                <DropdownMenuItem className='h-10 bg-background text-primary flex flex-col'>
                        <DropdownMenu modal={false}>
                        <DropdownMenuTrigger className='outline-none relative'>
                            <div className="flex items-center cursor-pointer">
                                <ChevronDown className="text-primary-foreground cursor-pointer text-xl" />
                                <p className="text-[14px] px-2">Publish </p>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="center" side="bottom" className='w-40 mr-4 mt-4 bg-background text-primary'>
                            <DropdownMenuItem className='h-10 bg-background text-primary flex flex-col'>
                                <Link className="text-[12px] p-2" href="/publishComic">Publish new Comic</Link>
                                <Separator/>
                            </DropdownMenuItem>
                            <DropdownMenuItem className='h-10 bg-background text-primary flex flex-col'>
                                <Link className="text-[12px] p-2" href="/">Publish new chapter</Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </DropdownMenuItem>
}               
                    <Separator/>
                <DropdownMenuItem className='h-14 bg-background text-primary flex justify-left'>
                    <UserButton variant="primary" />
                    <p className="px-2">User</p>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        </div> 
        </div>
        </div>
    )
}