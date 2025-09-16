import React from 'react'
import { Button } from '@/components/ui/button'
import ComicGridRowSkeleton from '@/features/comic/components/comic-grid-row-skeleton'

export default function ComicPageSkeleton() {
  return (
    <div>
        <div className='flex flex-col  w-[350px] md:w-[800px] lg:w-[1200px]  bg-background rounded-2xl  my-4 md:my-10'>
        <div className='flex w-full flex-col md:flex-row gap-4'>
            <div className='rounded-3xl w-[400px] md:w-[300px] lg:w-[300px] p-4 bg-primary/40  h-[500px]'></div>
          <div className='flex flex-col px-4 gap-2  '>
                <p className='text-[18px] md:text-[28px] text-foreground w-full bg-primary/40 rounded-2xl h-[30px]'></p>
                <p className='text-[18px] md:text-[28px] text-foreground w-full bg-primary/40 rounded-2xl h-[30px]'></p>
                <p className='text-[18px] md:text-[28px] text-foreground w-full bg-primary/40 rounded-2xl h-[30px]'></p>
                <p className='text-[18px] md:text-[28px] text-foreground w-full bg-primary/40 rounded-2xl h-[30px]'></p>
                <p className='text-[18px] md:text-[28px] text-foreground w-full bg-primary/40 rounded-2xl h-[30px]'></p>
                <p className='text-foreground text-[12px] md:text-[16px] px-1 w-full bg-primary/40 rounded-2xl h-[250px]'></p>
                
                <div className='flex w-full justify-baseline items-center gap-4 py-4 flex-col md:flex-row'>
                <Button className='bg-primary/40 md:w-[200px] w-full cursor-pointer'></Button>
                <Button className='bg-primary/40 md:w-[200px] w-full cursor-pointer' ></Button>
                <Button className='bg-primary/40 md:w-[200px] w-full cursor-pointer'></Button>
                </div>
              </div>
        </div>
        <div className='flex flex-col  w-[350px] md:w-[800px] lg:w-[1200px]  bg-background rounded-2xl border-primary/40 border-1 my-4 md:my-10 max-h-[500px] md:max-h-[800px] '>
            <div className=' bg-primary/40 rounded-t-2xl text-center text-[12px] md:text-[18px] text-foreground p-4 md:p-4 flex justify-between items-center '>
             

           
            </div>
            
            <div className='flex flex-col gap-4 mt-4 justify-center items-center px-4  scollbar'>              
               {Array(7).fill(0).map((_, index) => (
                    <div key={index} className='w-full h-[70px]  md:h-[70px] bg-primary/40 rounded-2xl cursor-grab'>
                    </div>
                ))}
            </div>
        </div>
        <div className=' py-1 md:py-8 flex flex-col  h-[300px] md:h-[600px]'>
            <p className='md:px-12 px-4  text-foreground text-l md:text-2xl text-left w-[100px] md:w-[200px] lg:w-[300px] bg-primary/40 rounded-2xl h-[30px]'></p>
            <div className='p-1 md:p-4 flex justify-center'>
              <ComicGridRowSkeleton/>
                
            </div>
        </div>
        <div className=' py-1 md:py-8 flex flex-col  h-[300px] md:h-[600px]'>
          <div className='flex justify-between items-center'>
            <p className='md:px-12 px-4  text-foreground text-l md:text-2xl text-left w-[100px] md:w-[200px] lg:w-[300px] bg-primary/40 rounded-2xl h-[30px]'></p>
          </div>
            <div className='p-1 md:p-4 flex justify-center'>
                <ComicGridRowSkeleton/>
            </div>
        </div>

      </div>
    </div>
  )
}
