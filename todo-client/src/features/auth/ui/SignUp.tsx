import { useState, FormEvent } from 'react';
import './Authorization.css';
import Button from '../../../shared/ui/button/Button';
import { Input } from '../../../shared/ui/input/Input';
import { useAuth } from '../model/AuthContext';

interface SignUpProps {
    onClose: () => void;
}

/**
 * Компонент регистрации пользователя
 * @component
 */
function SignUp({ onClose }: SignUpProps) {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const { signUp } = useAuth();

    const validateEmail = (email: string): boolean => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    const handleSignUp = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateEmail(email)) {
            setError('Invalid email');
            return;
        }
        if (!validatePassword(password)) {
            setError('Password must be at least 6 characters');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await signUp(email, password);
            setError('');
            onClose();
        } catch (err: any) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('This email is already in use.');
                    break;
                case 'auth/invalid-email':
                    setError('Invalid email.');
                    break;
                case 'auth/operation-not-allowed':
                    setError('Email registration is temporarily disabled.');
                    break;
                case 'auth/weak-password':
                    setError('Password is too weak.');
                    break;
                default:
                    setError('An error occurred during registration. Please try again.');
            }
        }
    };

    return (
        <div className="authorization-form-wrapper">
            <h2 className='authorization-title'>Sign Up</h2>
            <form onSubmit={handleSignUp} className='authorization-form'>
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
                <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className='authorization-input'
                />
                <Button type="submit" className='authorization-button'>Sign Up</Button>
            </form>
            {error && <p className='authorization-error'>{error}</p>}
        </div>
    );
}

export default SignUp;