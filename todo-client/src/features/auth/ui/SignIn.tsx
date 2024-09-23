import { useState, FormEvent } from 'react';
import './Authorization.css';
import { Input } from '../../../shared/ui/input/Input';
import { useAuth } from '../model/AuthContext';
import Button from '../../../shared/ui/button/Button';

interface SignInProps {
    onClose: () => void;
}

/**
 * Компонент для входа в систему
 * @component
 */
function SignIn({ onClose }: SignInProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const { signIn } = useAuth();

    const handleSignIn = async (e: FormEvent) => {
        e.preventDefault();
        try {
            await signIn(email, password);
            setError('');
            onClose();
        } catch (err: any) {
            switch (err.code) {
                case 'auth/invalid-email':
                    setError('Invalid email format.');
                    break;
                case 'auth/user-disabled':
                    setError('This user has been disabled.');
                    break;
                case 'auth/user-not-found':
                    setError('No user found with this email.');
                    break;
                case 'auth/wrong-password':
                    setError('Incorrect password.');
                    break;
                case 'auth/invalid-credential':
                    setError('Invalid credentials.');
                    break;
                case 'auth/missing-password':
                    setError('Password is missing.');
                    break;
                default:
                    setError('Sign-in error: ' + err.message);
            }
        }
    };

    return (
        <div className="authorization-form-wrapper">
            <h2 className='authorization-title'>Sign In</h2>
            <form onSubmit={handleSignIn} className='authorization-form'>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='authorization-input'
                />
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='authorization-input'
                />
                <Button type="submit" className='authorization-button'>Sign In</Button>
            </form>
            {error && <p className='authorization-error'>{error}</p>}
        </div>
    );
}

export default SignIn;