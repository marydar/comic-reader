import React from 'react'
import { MdNavigateNext } from 'react-icons/md'
import { cn } from '@/lib/utils'

interface NavigateNextProps {
    variant?: "header" | "body"
}

const NavigateNext = ({variant}: NavigateNextProps) => {
  return (
     <div className={cn(' cursor-pointer text-[8px] md:text-[24px] rounded-full bg-primary/30 border-primary border-1 w-[20px] h-[20px] md:w-[60px] md:h-[60px] text-center flex items-center justify-center', variant === "header" ? "bg-primary/60 " : "bg-primary/30")}>
             <MdNavigateNext className={cn('text-primary', variant === "header" ? "text-foreground" : "text-primary")}/>
         </div>
  )
}

export default NavigateNext