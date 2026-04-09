import * as styles from './Button.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'icon-only' | 'back' | 'style-select'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.base} ${styles.variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
