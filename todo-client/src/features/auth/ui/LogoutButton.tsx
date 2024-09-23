import { useAuth } from "../model/AuthContext";
import Button from "../../../shared/ui/button/Button";

export const LogoutButton: React.FC = () => {
    const { signOut } = useAuth();

    return (
        <Button onClick={signOut} className="logout-button">Sign out</Button>
    );
}