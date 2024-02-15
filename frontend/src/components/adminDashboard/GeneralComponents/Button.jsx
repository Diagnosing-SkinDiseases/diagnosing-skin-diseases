import React from "react";

const Button = ({ label, onClick, className, children }) => (
  <button onClick={onClick} className={className}>
    {children}
    {label}
  </button>
);

export default Button;