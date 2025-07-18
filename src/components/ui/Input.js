import React from 'react';
import '../../styles/components/ui/Input.css';

const Input = ({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  onKeyPress,
  onFocus,
  onBlur,
  className = '',
  focused = false,
  ...props 
}) => {
  return (
    <div className={`input-container ${focused ? 'focused' : ''} ${className}`}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onFocus={onFocus}
        onBlur={onBlur}
        className="input-field"
        {...props}
      />
    </div>
  );
};

export default Input;