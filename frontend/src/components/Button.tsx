import "../styles/buttons.css";

import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, className }) => {
  return (
    <button className={`btn ${className}`} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
