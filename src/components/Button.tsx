import React from "react";

interface ButtonProps {
  styles?: any;
  children: string;
  onClick: () => void;
  text?: string;
}

const SimpleButton: React.FC<ButtonProps> = ({
  styles,
  onClick,
  children,
  text,
}) => {
  return (
    <button
      type="button"
      className={`py-4 px-6 font-poppins font-medium text-[18px] text-white bg-button rounded-[10px] outline-none ${styles}`}
      onClick={onClick}
    >
      {text ? text : children ? children : "Get Started"}
    </button>
  );
};

export const SmallButton: React.FC<ButtonProps> = ({
  styles,
  onClick,
  children,
  text,
}) => {
  return (
    <button
      type="button"
      className={`py-1 px-4 font-poppinstext-[12px] text-white bg-button rounded-[10px] outline-none ${styles}`}
      onClick={onClick}
    >
      {text ? text : children ? children : "Get Started"}
    </button>
  );
};

export default SimpleButton;
