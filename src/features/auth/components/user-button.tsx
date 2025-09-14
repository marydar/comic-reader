"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem,  DropdownMenuTrigger} from '@/components/ui/dropdown-menu'
import { useCurrentUser } from '../api/use-current-user'
import { Loader, LogOut, UserCircle, LogIn } from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export const UserButton = ({variant}: {variant?: "primary" | "background"}) => {
    const {signOut} = useAuthActions();
    const router = useRouter();
    const {data, isLoading} = useCurrentUser();
    // const [userImage, setImage] = useState<string>("")
    // const [userName, setName] = useState<string>("Anonymous")
    let userImage = "" 
    let userName = "Anonymous"
    // if (isLoading) {
    //     return <Loader className='size-4 animate-spin text-muted-foreground'/>
    // };
    if(data){
        const {image, name} = data;
        if(image){
            userImage = image
        }
        if(name){
            userName = name
        }
        // setName(name)
    }
    
    
    const avavtarFallback = userName!.charAt(0).toUpperCase();
    const handleLogin = ()=>{
        router.push("/auth")
    }
    const handleProfile = ()=>{
        console.log("profile")
        console.log(data?._id)
        if(data){
            router.push(`/user/${data._id}`)
        }
        else{
            toast.error("no user found")
        }
    }
    return (
        
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none relative'>
                <Avatar className='size-10 hover:opacity-75 transition hover:cursor-pointer'>
                    <AvatarImage src={userImage} alt={userName}/>
                    <AvatarFallback className={cn('bg-background text-primary', variant === "primary" ? "bg-primary text-primary-foreground" : "bg-background text-primary")}>
                        {avavtarFallback}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="bottom" className='w-60 bg-background text-primary'>
                <DropdownMenuItem onClick={()=>{handleProfile()}} className='h-10 bg-background text-primary cursor-pointer'>
                    <UserCircle className='size-4 mr-2 text-center'/>{userName}
                </DropdownMenuItem>
                
                    {!data && (
                    <DropdownMenuItem onClick={()=>{handleLogin()}} className='h-10 bg-background text-primary'>
                        <LogIn className='size-4 mr-2'/>Log in
                    </DropdownMenuItem>
                    )}
                    {data &&(
                        <DropdownMenuItem onClick={()=>{signOut()}} className='h-10 bg-background text-primary'>
                            <LogOut className='size-4 mr-2'/>Log out
                        </DropdownMenuItem>
                    )}
                    
                    
                    
                    
                    
                
            </DropdownMenuContent>
        </DropdownMenu>
    )
}