import React from 'react'
import { cn } from '@/lib/utils'
interface Props {
    variant: "active" | "not-active" | "show"
    genre: string
    // onClick?: () => void
}

export default function GenreButton({variant, genre}: Props) {
  return (
    <div className={cn(' cursor-pointer px-2 py-4 md:py-2 text-center text-[10px] md:text-[12px] border-1 border-primary rounded-4xl  h-[20px] md:w-[100px] md:h-[30px] flex items-center justify-center', variant === "active" ? "bg-primary text-primary-foreground" : variant === "not-active" ? "bg-background text-foreground" : "bg-primary/40 text-foreground/80  h-[5px]  md:h-[20px] text-[8px] md:text-[10px] px-1 py-3 md:py-3")}>
        {genre}
    </div>
  )
}
