"use client"
import React from 'react'
import { useUserId } from '@/hooks/use-user-id';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';

export default function UserPage() {
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
