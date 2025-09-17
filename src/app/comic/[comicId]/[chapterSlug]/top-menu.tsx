import React from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { FaBars, FaFileLines, FaRegComment } from 'react-icons/fa6';
import { GrCaretNext } from 'react-icons/gr';
import { GoZoomIn } from 'react-icons/go';
import { BiMouse } from 'react-icons/bi';
import { Heart } from 'lucide-react';   

interface Props {
    autoScrollDown: () => void;
}
export default function TopMenu({autoScrollDown}: Props) {
  return (
   <div className="md:hidden flex items-center justify-center">
            <DropdownMenu modal={false}>
            <DropdownMenuTrigger className='outline-none relative'>
                <MenuIcon className="text-primary text-[24px] cursor-pointer md:hidden" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" side="bottom" className='w-40 mr-4 mt-8 bg-bars/90 text-bars-foreground backdrop-blur-sm  md:hidden'>
                <DropdownMenuItem className='h-10  flex '>
                    <Heart className='text-bars-foreground text-4xl text-center cursor-pointer hover:scale-120 hover:text-foreground' /> 
                    <span>Like</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='h-10  flex '>
                    <FaRegComment className='text-bars-foreground text-2xl text-center cursor-pointer hover:scale-120 hover:text-foreground' />
                    <span>Comment</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem className='h-10  flex flex-col'>
                   <GrCaretNext   className='text-bars-foreground text-3xl cursor-pointer rotate-180 hover:scale-120 hover:text-foreground' />
                </DropdownMenuItem> */}
                {/* <DropdownMenuItem className='h-10  flex flex-col'>
                    <FaBars className='text-bars-foreground text-4xl text-center cursor-pointer hover:scale-120 hover:text-foreground' />
                </DropdownMenuItem>
                <DropdownMenuItem className='h-10  flex flex-col'>
                    <GrCaretNext  className='text-bars-foreground text-3xl text-center cursor-pointer hover:scale-120 hover:text-foreground' />
                </DropdownMenuItem> */}
                <DropdownMenuItem className='h-10  flex '>
                    <GoZoomIn className='text-bars-foreground text-2xl text-center cursor-pointer hover:scale-120 hover:text-foreground' />
                    <span>Zoom</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='h-10  flex ' onClick={autoScrollDown}>
                    <BiMouse className='text-bars-foreground text-2xl text-center cursor-pointer hover:scale-120 hover:text-foreground' />
                    <span>Autoscroll</span>
                </DropdownMenuItem>
                <DropdownMenuItem className='h-10  flex '>
                    <FaFileLines className='text-bars-foreground text-[24px] cursor-pointer hover:scale-120 hover:text-foreground' />
                    <span>Preview</span>
                </DropdownMenuItem>
                    
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}
