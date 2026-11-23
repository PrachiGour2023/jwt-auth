import React, { useEffect } from 'react'
import { Frame } from '../../../assets'
import { useAuth } from '../context/AuthContext'
import { useLocation, useParams } from 'react-router'

const EmailVerification = () => {
    const location = useLocation()
    const email = location?.state?.email;

    console.log(email)
    return (
        <div className='flex flex-row justify-between'>
            <div className='bg-black w-full'>
                <img src={Frame} alt='frame' className='w-full h-screen object-contain' />
            </div>
            <div className="p-8 w-full mx-20 flex flex-col justify-center">
                <h4 className='font-bold font-sans text-2xl'>Verify your Email</h4>
                <p className='text-sm'>we have sent a verification email to {email}</p>

                <p className='text-sm mt-18'>Didn't receive the email? Check spam or promotion folder or</p>
                <button type='submit' className='bg-blue-800 text-white w-full py-2 rounded-sm mt-5'>Resend Email</button>
            </div>
        </div>
    )
}

export default EmailVerification