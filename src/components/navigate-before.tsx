import React from 'react'
import { MdNavigateBefore } from 'react-icons/md'
import { cn } from '@/lib/utils'
interface NavigateBeforeProps {
    variant?: "header" | "body"
}

const NavigateBefore = ({variant}: NavigateBeforeProps) => {
  return (
    <div className={cn(' cursor-pointer text-[8px] md:text-[24px] rounded-full bg-primary/30 border-primary border-1 w-[20px] h-[20px] md:w-[60px] md:h-[60px] text-center flex items-center justify-center', variant === "header" ? "bg-primary/60 " : "bg-primary/30")}>
        <MdNavigateBefore className={cn('text-primary', variant === "header" ? "text-foreground" : "text-primary")}/>
    </div>
  )
}

export default NavigateBefore