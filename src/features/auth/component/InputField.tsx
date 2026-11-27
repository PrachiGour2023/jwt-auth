import React from 'react'

interface InputFieldProps {
    name: string;
    value: string;
    placeholder?: string;
    className?: string;
    type?: string;
    error?: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
    name,
    value,
    placeholder,
    className,
    type = 'text',
    error,
    handleChange,
    onBlur
}) => {
    return (
        <div>
            {type !== "checkbox" ? (
                <>
                    <div
                        className={`w-full rounded-xl border bg-gray-50/50 transition overflow-hidden focus-within:bg-white focus-within:ring-2 ${error
                            ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-100'
                            : 'border-gray-200 focus-within:border-blue-400 focus-within:ring-blue-100'
                            }`}
                    >
                        <input
                            name={name}
                            type={type}
                            value={value}
                            placeholder={placeholder}
                            onChange={handleChange}
                            onBlur={onBlur}
                            className={`w-full bg-transparent px-4 py-2.5 text-sm text-gray-800 outline-none ${className || ''}`}
                        />
                    </div>
                    {error && <span className='text-red-500 text-xs'>{error}</span>}
                </>
            ) : (
                <div className='flex items-center gap-2'>
                    <input type={type} id="terms" name={name} />
                    <span className="text-sm">I agree to the Connectly <a href='/terms' className='text-blue-600'>Terms of Service</a></span>
                </div>)}
        </div>
    )
}

export default InputField