import { CanvasHTMLAttributes, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

type CanvasProps = CanvasHTMLAttributes<HTMLCanvasElement>;

function Canvas({ className, children, ...htmlProps }: CanvasProps) {
  const canvasRef = useRef(null);

  return (
    <canvas ref={canvasRef} className={twMerge(className)} {...htmlProps}>
      {children}
    </canvas>
  );
}

export default Canvas;
