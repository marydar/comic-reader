"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem,  DropdownMenuTrigger} from '@/components/ui/dropdown-menu'
// import { useCurrentUser } from '../api/use-current-user'
import { Loader, LogOut, UserCircle, LogIn } from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'

export const UserButton = () => {
    const {signOut} = useAuthActions();
    // const {data, isLading} = useCurrentUser();
    // if (isLading) {
    //     return <Loader className='size-4 animate-spin text-muted-foreground'/>
    // };
    // if(!data){
    //     return null;
    // }
    // const{image, name} = data;
    // const image = "https://avatars.githubusercontent.com/u/10199126?v=4"
    const image = ""
    const name = "Anonimos"
    const avavtarFallback = name!.charAt(0).toUpperCase();
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none relative'>
                <Avatar className='size-10 hover:opacity-75 transition hover:cursor-pointer'>
                    <AvatarImage src={image} alt={name}/>
                    <AvatarFallback className='bg-background text-primary'>
                        {avavtarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="bottom" className='w-60 bg-background text-primary'>
                <DropdownMenuItem onClick={()=>{}} className='h-10 bg-background text-primary'>
                    <UserCircle className='size-4 mr-2 text-center'/>{name}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={()=>{}} className='h-10 bg-background text-primary'>
                    <LogIn className='size-4 mr-2'/>Log in
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}