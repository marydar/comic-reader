"use client"
import React from 'react'
import { useUserId } from '@/hooks/use-user-id'
import { Button } from '@/components/ui/button'
import { BookCheck, BookTextIcon, History, LibraryBig, User, UserCheck, Users } from 'lucide-react'
import { RiPlayListFill, RiPlayListLine } from 'react-icons/ri'
import { MdFeaturedPlayList, MdLibraryAddCheck } from 'react-icons/md'

export default function UserAccountPage() {
    const userId = useUserId()
  return (
      <div className='flex  w-[350px] md:w-[800px] lg:w-[1200px]  bg-background rounded-2xl border-primary border-1 my-4 md:my-10'>
            {/* profile */}
            <div className='flex gap-4 w-full items-center justify-center p-4'>
                <div className='flex flex-col gap-6'>
                    {/* personal information */}
                    <div className='flex flex-col items-center justify-center'>
                        <img src="https://avatars.githubusercontent.com/u/101927351?v=4" alt="profile" className='object-cover  h-full rounded-full w-[200px] md:w-[200px] lg:w-[200px] p-2'/>
                        <p className='text-[14px] md:text-[22px] text-foreground text-center'>MaryDar</p>
                    </div>
                    

                    {/* comics and followers */}
                    <div className='flex gap-8 items-center justify-center'>
                        <div className='flex flex-col gap-1'>
                            <p className='text-[12px] md:text-[14px] text-foreground text-center'>23</p>
                            <p className='text-[12px] md:text-[14px] text-primary text-center'>Comics</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-[12px] md:text-[14px] text-forground text-center'>23M</p>
                            <p className='text-[12px] md:text-[14px] text-primary text-center'>Followers</p>
                        </div>
                    </div>
                    {/* follow button */}
                    <Button className='bg-primary text-primary-foreground p-4  justify-center hover:bg-primary/90 cursor-pointer rounded-3xl' size="sm">
                        Follow
                    </Button>

                </div>

            </div>
            <div>

            </div>
        </div>
    
  )
}
