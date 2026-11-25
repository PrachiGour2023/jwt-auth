import { useState } from 'react';
import { Frame } from '../../../assets';
import InputField from '../component/InputField';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@tanstack/react-query';

const SignupForm = () => {

    const [input, setInput] = useState({
        username: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [error, setError] = useState<Record<string, string>>({});
    const navigate = useNavigate();
    const { signup } = useAuth();

    const { mutate, isPending, isError, error: apiError } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            navigate('/login')
        }
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleValidation = (): boolean => {
        const err: Record<string, string> = {};

        if (!input.username.trim()) {
            err.username = 'username is required';
        } else if (!/^[a-zA-Z0-9_]{3,16}$/.test(input.username)) {
            err.username = 'username must be of 3 - 16 character'
        }
        if (!input.email.trim()) {
            err.email = 'email is required';
        } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.email)) {
            err.email = 'email format is not valid'
        }
        if (!input.password.trim()) {
            err.password = 'password is required';
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(input.password)) {
            err.password = 'password must contain min 8 char including uppercase, lowercase, number and special character'
        }

        setError(err);
        return Object.keys(err).length === 0;
    };

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!handleValidation()) return;
        mutate(input)
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Left Side: Cover Image (Hidden on mobile) */}
            <div className="hidden lg:block lg:w-1/2">
                <img
                    src={Frame}
                    alt="Sign up illustration"
                    loading='lazy'
                    className="h-screen w-full object-cover"
                />
            </div>

            {/* Right Side: Sign Up Form */}
            <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
                <div className="w-full max-w-md rounded-2xl border border-blue-200 bg-white p-8 shadow-sm">
                    <h4 className="font-sans text-2xl font-bold text-gray-900">
                        Create account
                    </h4>
                    <p className="mt-1.5 text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-blue-700 hover:underline"
                        >
                            Login
                        </Link>
                    </p>

                    {/* Error Message */}
                    {isError && (
                        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                            {apiError.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                        <InputField
                            name="username"
                            type="text"
                            value={input.username}
                            placeholder="Username"
                            handleChange={handleInputChange}
                            onBlur={handleValidation}
                            error={error.username}
                        />
                        
                        <InputField
                            name="email"
                            type="email"
                            value={input.email}
                            placeholder="Email"
                            handleChange={handleInputChange}
                            onBlur={handleValidation}
                            error={error.email}
                        />

                        <InputField
                            name="password"
                            type="password"
                            value={input.password}
                            placeholder="Password"
                            handleChange={handleInputChange}
                            onBlur={handleValidation}
                            error={error.password}
                        />

                        {/* Terms & Conditions Checkbox */}
                        <label className="flex cursor-pointer items-center gap-2.5 pt-1 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                name="terms"
                                // checked={Boolean(input.terms)}
                                onChange={handleInputChange}
                                className="h-4 w-4 rounded border-gray-300 text-blue-900 focus:ring-blue-500"
                            />
                            <span>
                                I agree to the{" "}
                                <span className="font-medium text-blue-700 hover:underline">
                                    Terms &amp; Conditions
                                </span>
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="mt-2 flex w-full items-center justify-center rounded-lg bg-blue-900 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center gap-4">
                        <hr className="flex-1 border-gray-200" />
                        <span className="text-xs font-medium uppercase text-gray-400">or</span>
                        <hr className="flex-1 border-gray-200" />
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                        >
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SignupForm