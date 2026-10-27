import { ComponentProps } from 'react';
import './style.css';

type ButtonProps = ComponentProps<'button'>;

function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button className={`shared-button ${className}`} {...props}>{children}</button>
  );
}

export default Button;
