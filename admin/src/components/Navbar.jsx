import React from 'react'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
      <p
            style={{
              backgroundImage:
                "linear-gradient(90deg, #f5d76e, #ffd700, #f9a602)",
              WebkitBackgroundClip: "text",
              fontWeight: "bold",
              fontSize: "1.875rem", // equivalent to text-3xl
              textAlign: "center",
              textShadow:
                "0 0 8px rgba(255, 215, 0, 0.6), 0 0 15px rgba(255, 215, 0, 0.4)",
              fontFamily: '"Times New Roman", sans-serif',
              width: "9rem", // equivalent to w-36
            }}
          >
            RAMINDER
          </p>
      <button onClick={()=>setToken('')} type='button' className='bg-gray-600 text-white px-5 py2 sm:px-7 sm:py-2 rounded-full '>Logout</button>
    </div>
  )
}
 
export default Navbar
