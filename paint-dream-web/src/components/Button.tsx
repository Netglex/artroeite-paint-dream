import { ButtonHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type ButtonProps = { highlighted: boolean } & ButtonHTMLAttributes<HTMLButtonElement>;

function ToggleButton({ highlighted, className, style, children, ...htmlProps }: ButtonProps) {
  return (
    <button
      className={twMerge('rounded outline-amber-600 hover:brightness-75 transition-all', highlighted ? 'outline-none ' : 'outline-2', className)}
      style={style}
      {...htmlProps}
    >
      {children}
    </button>
  );
}

export default ToggleButton;
