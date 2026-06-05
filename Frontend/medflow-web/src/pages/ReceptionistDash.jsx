import React from 'react'
import { useNavigate } from "react-router-dom";
import AsideLeft from '../components/layout/AsideLeft'; 


const ReceptionistDash = () => { 
  const navigate = useNavigate();


  return ( 
    <>
      <div className='flex justify-evenly items-center h-screen w-full gap-4 p-4 bg-gray-100'>
          <section className='w-3/4 h-full bg-white rounded-lg shadow-md p-6 border border-gray-300'>
            <h1 className='text-3xl font-bold mb-4'>Receptionist Dashboard</h1>
          </section>
          
      </div>
    </>
  )
}

export default ReceptionistDash