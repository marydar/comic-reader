"use client"
import React from 'react'
import { BookCheck, BookTextIcon, History, LibraryBig, User, UserCheck, Users } from 'lucide-react'
import { RiPlayListFill, RiPlayListLine } from 'react-icons/ri'
import { MdFeaturedPlayList, MdLibraryAddCheck } from 'react-icons/md'
import { useRouter } from 'next/navigation';
import { useUserId } from '@/hooks/use-user-id';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'


export default function UserPageNavbar() {
    const userId = useUserId();
    const pathname = usePathname();
    
        // map routes to isActive values
        const getActive = (path: string) => {
            if (path === `/user/${userId}/account`) return "account";
            if (path.startsWith(`/user/${userId}/recent`)) return "recent";
            if (path.startsWith(`/user/${userId}/publishedComics`)) return "publishedComics";
            if (path.startsWith(`/user/${userId}/subscribedComics`)) return "subscribedComics";
            if (path.startsWith(`/user/${userId}/comicLists`)) return "comicLists";
            if (path.startsWith(`/user/${userId}/savedComicLists`)) return "savedComicLists";
            if (path.startsWith(`/user/${userId}/followers`)) return "followers";
            if (path.startsWith(`/user/${userId}/followings`)) return "followings";
            
            return null;
        };
    
        const isActive = getActive(pathname);
    const router = useRouter();
  return (
    <div className='flex w-[350px] md:w-[800px] lg:w-[1200px]  bg-background rounded-2xl border-primary border-1 my-4 md:my-10'>
                {/* profile */}
                <div className='flex gap-8 w-full items-center justify-start p-2 overflow-scroll scroll-auto scrollbar'>
                    <div onClick={()=>router.push(`/user/${userId}/account`)} className={cn('flex flex-col md:flex-row  gap-2 items-center justify-center text-primary hover:bg-primary/40 cursor-pointer p-2 rounded-lg hover:border-1 hover:border-primary', isActive === "account" && "bg-primary text-primary-foreground")}>
                        <User className='text-2xl'/>
                        <p className='text-[12px] md:text-[14px]'>Account Information</p>
                    </div>
                    <div className={cn('flex flex-col md:flex-row  gap-2 items-center justify-center text-primary hover:bg-primary/40 cursor-pointer p-2 rounded-lg hover:border-1 hover:border-primary', isActive === "recent" && "bg-primary text-primary-foreground")}>
                        <History className=' text-2xl'/>
                        <p className='text-[12px] md:text-[14px] '>Recent Reads</p>
                    </div>
                    <div onClick={()=>router.push(`/user/${userId}/publishedComics`)} className={cn('flex flex-col md:flex-row  gap-2 items-center justify-center text-primary hover:bg-primary/40 cursor-pointer p-2 rounded-lg hover:border-1 hover:border-primary', isActive === "publishedComics" && "bg-primary text-primary-foreground")}>
                        <BookTextIcon className=' text-2xl text-center '/>
                        <p className='text-[12px] md:text-[14px] '>Published Comics</p>
                    </div>
                    <div onClick={()=>router.push(`/user/${userId}/subscribedComics`)} className={cn('flex flex-col md:flex-row  gap-2 items-center justify-center text-primary hover:bg-primary/40 cursor-pointer p-2 rounded-lg hover:border-1 hover:border-primary', isActive === "subscribedComics" && "bg-primary text-primary-foreground")}>
                        <BookCheck className=' text-2xl'/>
                        <p className='text-[12px] md:text-[14px] '>Subscribed Comics</p>
                    </div>
                    <div onClick={()=>router.push(`/user/${userId}/comicLists`)} className={cn('flex flex-col md:flex-row  gap-2 items-center justify-center text-primary hover:bg-primary/40 cursor-pointer p-2 rounded-lg hover:border-1 hover:border-primary', isActive === "comicLists" && "bg-primary text-primary-foreground")}>
                        <LibraryBig className=' text-2xl'/>
                        <p className='text-[12px] md:text-[14px] '>your Comic Lists</p>
                    </div>
                    <div onClick={()=>router.push(`/user/${userId}/savedComicLists`)} className={cn('flex flex-col md:flex-row  gap-2 items-center justify-center text-primary hover:bg-primary/40 cursor-pointer p-2 rounded-lg hover:border-1 hover:border-primary', isActive === "savedComicLists" && "bg-primary text-primary-foreground")}>
                        <MdLibraryAddCheck className=' text-2xl'/>
                        <p className='text-[12px] md:text-[14px] '>Saved Comic Lists</p>
                    </div>
                    <div className={cn('flex flex-col md:flex-row  gap-2 items-center justify-center text-primary hover:bg-primary/40 cursor-pointer p-2 rounded-lg hover:border-1 hover:border-primary', isActive === "followers" && "bg-primary text-primary-foreground")}>
                        <UserCheck className=' text-2xl'/>
                        <p className='text-[12px] md:text-[14px] '>Followed users</p>
                    </div>
                    <div className={cn('flex flex-col md:flex-row  gap-2 items-center justify-center text-primary hover:bg-primary/40 cursor-pointer p-2 rounded-lg hover:border-1 hover:border-primary', isActive === "followings" && "bg-primary text-primary-foreground")}>
                        <Users className=' text-2xl'/>
                        <p className='text-[12px] md:text-[14px]  '>Following users</p>
                    </div>
                </div>
            </div>
  )
}
