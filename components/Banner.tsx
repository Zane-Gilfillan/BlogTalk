import React from 'react'

function Banner() {
  return (
    <div>
        <div className='flex justify-between items-center border-y border-black py-10 lg:py-0'>
        <div className='px-10 space-y5'>
          <div>
            <h1 className='text-6xl max-w-xl font-serif'><span className='underline decoration-red-500 decoration-5'>blogtalk</span> is a place to write, read, and connect</h1>
            <h2>Lorem ipsum dolor sit amet consectetur adipisicing elit. Exercitationem culpa est dolore vitae expedita, ut velit itaque?</h2>
          </div>
          
        </div>
        <img className='hidden md:inline-flex h-64 lg:h-64' src='https://i.pinimg.com/736x/59/d9/2b/59d92b8d917c0fc6d1bc847f056dce5b.jpg'></img>
      </div>
    </div>
    
  )
}

export default Banner