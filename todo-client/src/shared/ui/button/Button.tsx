import './Button.css';

interface ButtonProps {
    onClick?: () => void;
    children: React.ReactNode;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({ onClick, children, type, className = '' }) => {
    return (
        <button type={type} className={`shared-button ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;