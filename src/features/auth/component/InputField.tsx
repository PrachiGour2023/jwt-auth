import React from 'react'

interface InputFieldProps {
    name: string;
    value: string;
    placeholder?: string;
    className?: string;
    type?: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
    name,
    value,
    placeholder,
    className,
    type = 'text',
    handleChange
}) => {
    return (
        <div>
            {type !== "checkbox" ? (
                <div className='border-gray-400 border-1 rounded-sm p-1.5 w-full my-5'>
                    <input
                        name={name}
                        type={type}
                        value={value}
                        placeholder={placeholder}
                        onChange={handleChange}
                        className={`outline-0 text-sm ${className || ''}`}
                    />
                </div>) : (
                <div className='flex items-center gap-2'>
                    <input type={type} id="terms" name={name} />
                    <span className="text-sm">I agree to the Connectly <a href='/terms' className='text-blue-600'>Terms of Service</a></span>
                </div>)}
        </div>
    )
}

export default InputField