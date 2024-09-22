import React, { forwardRef } from 'react';
import './Input.css';

export const Input = forwardRef(({ value, onChange, placeholder, rows, checked, size = 'm', type = "text", min = 0, className = '' }, ref) => {
    const getSize = () => {
        if (size === 'l') {
            return '--large';
        }
        if (size === 'm') {
            return '--medium';
        }
        if (size === 's') {
            return '--small';
        }
    };

    if (type === "textarea") {
        return (
            <textarea
                ref={ref}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`shared-input shared-input${getSize()} ${className}`}
                rows={rows}
            />
        );
    }

    if (type === "checkbox") {
        return (
            <input
                ref={ref}
                type={type}
                checked={checked}
                onChange={onChange}
                className={`shared-input-checkbox shared-input-checkbox${getSize()} ${className}`}
            />
        );
    }

    return (
        <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            className={`shared-input shared-input${getSize()} ${className}`}
        />
    );
});