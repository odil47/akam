import React from 'react'

const Header = () => {
  return (
    <>
      <header className='py-[30px] bg-[#00fff2d0]'>
        <div id="container" className='max-w-full w-[85%] mx-auto'>
            <div id="header_wrapper" className=' flex justify-between items-center '>
                <p className='font-[700] text-[35px] text-[#fff]'>Project for my brother</p>
                <nav className='flex gap-[50px] '>
                    <p className=' font-[700] text-[25px] text-[#fff] hover:text-[#1100ffad] duration-300 ease-out  '>New Massage</p>
                    <p className=' font-[700] text-[25px] text-[#fff] hover:text-[#1100ffad] duration-300 ease-out '>Old Info</p>
                    <p className=' font-[700] text-[25px] text-[#fff] hover:text-[#1100ffad] duration-300 ease-out '>History</p>
                </nav>
            </div>
        </div>
      </header>

    </>
  )
}

export default Header
