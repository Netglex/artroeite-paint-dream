import { ButtonHTMLAttributes } from 'react';

type TextProps = ButtonHTMLAttributes<HTMLButtonElement>;

function Button({ children, ...htmlProps }: TextProps) {
  return (
    <button className="text-red-800" {...htmlProps}>
      {children}
    </button>
  );
}

export default Button;
