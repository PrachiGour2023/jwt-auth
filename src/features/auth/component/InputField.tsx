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
                    <div className={`${error ? 'border-red-400' : 'border-gray-400'} border-1 rounded-sm w-full overflow-hidden`}>
                        <input
                            name={name}
                            type={type}
                            value={value}
                            placeholder={placeholder}
                            onChange={handleChange}
                            onBlur={onBlur}
                            className={`w-full p-1.5 outline-0 text-sm ${className || ''}`}
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