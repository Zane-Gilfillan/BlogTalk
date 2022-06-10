import React from 'react'
import Link from 'next/link'

function Header() {
  return (
    <header className='flex justify-between p-5 max-w-7xl mx-auto'>
        
        <div className='flex items-center space-x-5'>
            <Link href='/'>
                <h1 className='text-2xl font:bold italic cursor-pointer tracking-wide'>blogtalk.</h1>
            </Link>
            <div className='hidden md:inline-flex items-center space-x-5'>
                <h3>about</h3>
                <h3>contact</h3>
                {/* <h3 className='text-white bg-blue-600 px-4 py-1 rounded-full'>follow</h3> */}
            </div>
        </div>

        <div className='flex items-center space-x-5 text-blue-600'>
            <h3 className='border px-4 py-1 rounded-full border-blue-600'>sign in</h3>
        </div>
    </header>
  )
}

export default Header