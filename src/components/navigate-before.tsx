import React from 'react'
import { MdNavigateBefore } from 'react-icons/md'

const NavigateBefore = () => {
  return (
    <div className=' cursor-pointer text-[8px] md:text-[24px] rounded-full bg-primary/10 border-primary border-1 w-[20px] h-[20px] md:w-[60px] md:h-[60px] text-center flex items-center justify-center'>
        <MdNavigateBefore className='text-primary'/>
    </div>
  )
}

export default NavigateBefore