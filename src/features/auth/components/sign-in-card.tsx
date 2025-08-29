import React from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@radix-ui/react-dropdown-menu'

interface SignInCardProps {
    setIsSignIn: (isSignIn: boolean) => void
}
export default function SignInCard({setIsSignIn}: SignInCardProps) {
    const {signIn} = useAuthActions();
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const handleGithubSignIn = ()=>{
        setPending(true);
        signIn("github")
        .catch((e)=>{
            setError(e.message);
            console.log(error);
        })
        .finally(()=>{
            setPending(false);
        })
    }
  return (
    <Card className='w-full h-full bg-background text-foreground border-primary p-0 rounded-2xl'>
        <CardHeader className='flex flex-col p-4 items-center justify-between bg-primary text-primary-foreground rounded-t-2xl'>
            <CardTitle className='text-2xl font-bold'>Sign in</CardTitle>
            <CardDescription className='text-xs text-primary-foreground/80'>
                Sign in with your Github account
            </CardDescription>
        </CardHeader>
        <CardContent className='p-4 flex flex-col gap-4'>
            <form onSubmit={()=>{}} className='space-y-2.5  '>
                <Input 
                    disabled={pending}
                    // value={""}
                    // onChange={(e) =>{setEmail(e.target.value)}}
                    placeholder="Email"
                    type="email"
                    className='bg-background text-foreground border-primary'
                    // required
                />
                <Input 
                    disabled={pending}
                    // value={""}
                    // onChange={(e) =>{setPassword(e.target.value)}}
                    placeholder="Password"
                    type="password"
                    autoFocus
                    // required
                />
                <Button type='submit' className='w-full cursor-pointer' size='lg' disabled={pending}>
                    continue
                </Button>
            </form>
            <Separator/>
            <div className='flex flex-col gap-y-2.5'>
                <Button
                disabled={pending}
                onClick={()=>{}}
                // variant="outline"
                size="lg"
                className='w-full relative bg-background border-primary text-foreground border-1 cursor-pointer'
                >
                    <FcGoogle className='size-5 absolute top-2.5 left-2.5'/>
                    continue with google
                </Button>
                <Button
                disabled={pending}
                onClick={()=>handleGithubSignIn()}
                // variant="outline"
                size="lg"
                className='w-full relative bg-background border-primary text-foreground border-1 cursor-pointer'
                >
                    <FaGithub className='size-5 absolute top-2.5 left-2.5'/>
                    continue with Github
                </Button>
            </div>
            <p className='text-xs text-foreground'>
                Don't have an account? <span onClick={()=> setIsSignIn(false)} className='text-primary hover:text-foreground cursor-pointer'>Sign up</span>
            </p>
        </CardContent>
    </Card>
  )
}
