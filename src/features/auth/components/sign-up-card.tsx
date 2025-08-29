import React from 'react'
import { useAuthActions } from '@convex-dev/auth/react'
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import { TriangleAlert } from 'lucide-react'
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

interface SignUpCardProps {
    setIsSignIn: (isSignIn: boolean) => void
}
export default function SignInCard({setIsSignIn}: SignUpCardProps) {
    const {signIn} = useAuthActions();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const handleGithubSignUp = ()=>{
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
    const handlePasswordSignUp = (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        if(password !== confirmPassword){
          setError("passwords do not match");
          return;
        }
        setPending(true);
        signIn("password", {name,email, password, flow:"signUp"})
        .catch(()=>{
            setError("Invalid email or password");
        })
        .finally(()=>{
            setPending(false);
        })
    }
  return (
    <Card className='w-full h-full bg-background text-foreground border-primary p-0 rounded-2xl'>
        <CardHeader className='flex flex-col p-4 items-center justify-between bg-primary text-primary-foreground rounded-t-2xl'>
            <CardTitle className='text-2xl font-bold'>Sign up</CardTitle>
            <CardDescription className='text-xs text-primary-foreground/80'>
                use your email or another service to continue
            </CardDescription>
        </CardHeader>
        {!!error && (
            <div className='bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6'>
                <TriangleAlert className='size-4'/>
                <p>{error}</p>
            </div>
        )}
        <CardContent className='p-4 flex flex-col gap-4'>
            <form onSubmit={handlePasswordSignUp} className='space-y-2.5  '>
                <Input 
                    disabled={pending}
                    value={name}
                    onChange={(e) =>{setName(e.target.value)}}
                    placeholder="Name"
                    className='bg-background text-foreground border-primary'
                    required
                />
                <Input 
                    disabled={pending}
                    value={email}
                    onChange={(e) =>{setEmail(e.target.value)}}
                    placeholder="Email"
                    type="email"
                    className='bg-background text-foreground border-primary'
                    required
                />
                <Input 
                    disabled={pending}
                    value={password}
                    onChange={(e) =>{setPassword(e.target.value)}}
                    placeholder="Password"
                    type="password"
                    required
                />
                <Input 
                    disabled={pending}
                    value={confirmPassword}
                    onChange={(e) =>{setConfirmPassword(e.target.value)}}
                    placeholder="confirm password"
                    type="password"
                    required
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
                onClick={()=>handleGithubSignUp()}
                // variant="outline"
                size="lg"
                className='w-full relative bg-background border-primary text-foreground border-1 cursor-pointer'
                >
                    <FaGithub className='size-5 absolute top-2.5 left-2.5'/>
                    continue with Github
                </Button>
            </div>
            <p className='text-xs text-foreground'>
                Already have an account? <span onClick={()=> setIsSignIn(true)} className='text-primary hover:text-foreground cursor-pointer'>Sign In</span>
            </p>
        </CardContent>
    </Card>
  )
}
