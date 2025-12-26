import React from 'react'
import { Spinner } from './Spinner'

const LoadingPage = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen relative z-1 bg-[#f9f9ff]'>
        <p className='mb-2 text-xl'>Your image will be ready soon</p>
        <Spinner/>

    </div>
  )
}

export default LoadingPage