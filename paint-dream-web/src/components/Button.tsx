import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type TextProps = ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ className, children, ...htmlProps }: TextProps) {
  return (
    <button className={twMerge(className)} {...htmlProps}>
      {children}
    </button>
  );
}

export default Button;
