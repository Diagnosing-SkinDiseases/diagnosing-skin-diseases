import React from "react";

/**
 * Renders a button with customizable content, including text and children elements, 
 * and triggers an action when clicked.
 *
 * @param {string} [props.label] The text label to display on the button. 
 * @param {Function} props.onClick The callback function to execute when the button is clicked.
 * @param {string} [props.className] CSS class names to apply to the button for styling. 
 * @param {React.ReactNode} [props.children] Custom elements or components to display inside the button, such as icons.
 * @returns {JSX.Element} A button element with applied props and content.
 */
const Button = ({ label, onClick, className, children }) => (
  <button onClick={onClick} className={className}>
    {children}
    {label}
  </button>
);

export default Button;