import React, { forwardRef, ChangeEvent } from 'react';
import './Input.css';

interface InputProps {
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    checked?: boolean;
    size?: 's' | 'm' | 'l';
    type?: 'text' | 'textarea' | 'checkbox' | 'date' | 'time' | 'email' | 'password';
    min?: string | number;
    className?: string;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({
    value,
    onChange,
    placeholder,
    rows,
    checked,
    size = 'm',
    type = 'text',
    min = 0,
    className = ''
}, ref) => {
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

    if (type === 'textarea') {
        return (
            <textarea
                ref={ref as React.Ref<HTMLTextAreaElement>}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`shared-input shared-input${getSize()} ${className}`}
                rows={rows}
            />
        );
    }

    if (type === 'checkbox') {
        return (
            <input
                ref={ref as React.Ref<HTMLInputElement>}
                type={type}
                checked={checked}
                onChange={onChange}
                className={`shared-input-checkbox shared-input-checkbox${getSize()} ${className}`}
            />
        );
    }

    return (
        <input
            ref={ref as React.Ref<HTMLInputElement>}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            min={min}
            className={`shared-input shared-input${getSize()} ${className}`}
        />
    );
});