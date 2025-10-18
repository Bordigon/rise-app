import React from 'react';
import PropTypes from 'prop-types';


export default function Button({
  children,       
  onClick,        
  type = "button", 
  variant = "primary", 
  size = "md",       
  fullWidth = false, 
  disabled = false, 
  className = "",    
}) {
  
  const classes = [
    "rise-btn", 
    `rise-btn--${variant}`, 
    `rise-btn--${size}`, 
    fullWidth ? "rise-btn--block" : "", 
    className 
  ]
    .filter(Boolean) 
    .join(" ") 
    .trim(); 

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  variant: PropTypes.string,
  size: PropTypes.oneOf(["md", "lg"]),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};