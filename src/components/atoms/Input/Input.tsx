import * as styles from './Input.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'password'
}

export function Input({ variant = 'default', className = '', type, ...props }: InputProps) {
  return (
    <input
      type={type || (variant === 'password' ? 'password' : 'text')}
      className={`${styles.base} ${styles.variants[variant]} ${className}`}
      {...props}
    />
  )
}
