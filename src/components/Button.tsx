import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
}

export function Button({ variant = 'primary', className, ...rest }: ButtonProps) {
  const classes = ['kf-button', `kf-button--${variant}`, className].filter(Boolean).join(' ')
  return <button type="button" className={classes} {...rest} />
}
