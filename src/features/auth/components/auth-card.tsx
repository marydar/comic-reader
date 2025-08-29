"use client"
import React from 'react'
import { useState } from 'react'
import SignInCard from './sign-in-card'
import SignUpCard from './sign-up-card'

export default function AuthCard() {
    const [isSignIn, setIsSignIn] = useState<boolean>(true);
  return (
    <div className='h-full flex items-center justify-center bg-primary text-primary-foreground'>
        <div className='md:h-auto md:w-[420px] bg-primary text-primary-foreground p-10 rounded-xl'>
            {isSignIn ? <SignInCard  setIsSignIn={setIsSignIn}/> : <SignUpCard setIsSignIn={setIsSignIn}/>}
        </div>
    </div>
  )
}
