"use client"
import  UserPageNavbar  from './navbar'
import React from 'react'
import { useUserId } from '@/hooks/use-user-id';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function UserPage({children}:{children:React.ReactNode}) {
    const userId = useUserId();
    const router = useRouter();
    if(!userId) return <div>no user id</div>
    router.push(`/user/${userId}/account`)
    
  return (
    <div className='flex justify-center items-center w-full'>
        <Loader/>
    </div>
  )
}
