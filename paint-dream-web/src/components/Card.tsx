import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

type TextProps = HTMLAttributes<HTMLDivElement>;

function Card({ className, children, ...htmlProps }: TextProps) {
  return (
    <div className={twMerge(className)} {...htmlProps}>
      {children}
    </div>
  );
}

export default Card;
