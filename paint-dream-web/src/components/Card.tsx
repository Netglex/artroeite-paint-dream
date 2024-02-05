import { HTMLAttributes } from 'react';

type TextProps = HTMLAttributes<HTMLDivElement>;

function Card({ children, ...htmlProps }: TextProps) {
  return (
    <div className="text-blue-800" {...htmlProps}>
      {children}
    </div>
  );
}

export default Card;
