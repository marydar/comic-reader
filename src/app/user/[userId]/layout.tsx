import React from 'react'
import UserPageNavbar from './navbar'


export default function UserPagelayout({children}:{children:React.ReactNode}) {
  return (
    <div className='flex flex-col items-center justify-center w-full'>
        <UserPageNavbar/>
        {children}
    </div>
  )
}
