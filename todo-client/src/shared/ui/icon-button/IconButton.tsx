import './IconButton.css';

interface IconButtonProps {
    onClick: () => void;
    icon: string;
    title?: string;
    className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, title = '', className = '' }) => {
    return (
        <button className={`shared-icon-button ${className}`} onClick={onClick} title={title}>
            <i className={icon}></i>
        </button>
    );
};

export default IconButton;