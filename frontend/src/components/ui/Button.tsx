import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  isLoading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

const Button = ({ 
  children, 
  isLoading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${className} px-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition duration-200
        ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}

export default Button