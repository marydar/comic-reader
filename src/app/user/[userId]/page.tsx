"use client"
import React from 'react'
import { useUserId } from '@/hooks/use-user-id';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { useEffect } from 'react'

export default function UserPage() {
    const userId = useUserId();
    const router = useRouter();
   useEffect(() => {
    if (userId) {
      router.push(`/user/${userId}/account`)
    }
  }, [userId, router])

  if (!userId) {
    return <div>no user id</div>
  }
    
  return (
    <div className='flex justify-center items-center w-full'>
        <Loader/>
    </div>
  )
}
