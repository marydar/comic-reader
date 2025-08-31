import React from 'react'
import { MdNavigateNext } from 'react-icons/md'

const NavigateNext = () => {
  return (
     <div className='cursor-pointer text-[8px] md:text-[24px] rounded-full bg-primary/30 border-primary border-1 w-[20px] h-[20px] md:w-[60px] md:h-[60px] text-center flex items-center justify-center'>
        <MdNavigateNext className='text-primary'/>
    </div>
  )
}

export default NavigateNext