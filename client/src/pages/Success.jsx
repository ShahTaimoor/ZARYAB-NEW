import React from 'react'
import { Link } from 'react-router-dom'

const Success = () => {
  return (
    <div className='flex flex-col mt-50 text-bold text-5xl justify-center items-center'>
    <p>Order Successful</p>
    <Link className='text-xs' to={`/`}>Click Here To Homepage</Link>
  </div>
  )
}

export default Success