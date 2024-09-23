import { LogoutButton } from '../../../features/auth/ui/LogoutButton';
import { useAuth } from '../../../features/auth/model/AuthContext';
import './AppHeader.css';

const AppHeader: React.FC = () => {
    const { user } = useAuth();
    return (
        <header className="app-header">
            <h1 className='header-title'>To Do List</h1>
            {user && <LogoutButton />}
        </header>
    );
};

export default AppHeader;