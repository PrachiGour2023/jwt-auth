import { useState } from 'react';
import { Frame } from '../../../assets';
import InputField from '../component/InputField';
import { authServices } from '../../../services/authServices';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const SignupForm = () => {

    const [input, setInput] = useState({
        username: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const { signup } = useAuth();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setLoading(true)
        try {
            const response = await signup(input)
            console.log(response);
            
            navigate('/login')
        } catch (error: any) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                'Signup failed. Please try again';
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-row justify-between'>
            <div className='w-full'>
                <img src={Frame} alt='frame' className='w-full h-screen' />
            </div>
            <div className="p-8 w-full mx-20">
                <h4 className='font-bold font-sans text-2xl'>Create account</h4>
                <p className='text-sm'>Already have an account? 
                    <Link to={'/login'} className='text-blue-600'> Login</Link></p>
                <p className='text-red-500'>{error}</p>
                <div className='mt-10'>
                    <InputField
                        name='username'
                        type="text"
                        value={input.username}
                        placeholder='Username'
                        handleChange={handleInputChange}
                    />

                    <InputField
                        name='email'
                        type="email"
                        value={input.email}
                        placeholder='Email'
                        handleChange={handleInputChange}
                    />

                    <InputField
                        name='password'
                        type="password"
                        value={input.password}
                        placeholder='Password'
                        handleChange={handleInputChange}
                    />

                    <InputField
                        name='terms'
                        type='checkbox'
                        value={'checked'}
                        handleChange={handleInputChange}
                    />

                    <button type='submit' className='bg-blue-800 text-white w-full py-2 rounded-sm mt-5 flex justify-center' disabled={loading} onClick={handleSubmit}>
                        {loading ? (
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
                        ) : 'Create Account'}
                        </button>
                    <div className="flex items-center gap-4 w-full my-6">
                        <hr className="flex-1 border-gray-300" />
                        <span className="text-sm text-gray-900 font-medium">
                            or
                        </span>
                        <hr className="flex-1 border-gray-300" />
                    </div>

                    <button className='border-black border-1 text-black font-medium w-full py-2 rounded-sm'>Continue with Google</button>

                    <button className='border-black border-1 text-black font-medium w-full py-2 rounded-sm mt-5'>Continue with Github</button>



                </div>
            </div>
        </div>
    )
}

export default SignupForm