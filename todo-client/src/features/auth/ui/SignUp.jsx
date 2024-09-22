import { useState } from 'react';
import './Authorization.css';
import Button from '../../../shared/ui/button/Button';
import { Input } from '../../../shared/ui/input/Input';
import { useAuth } from '../model/AuthContext';
import { auth } from '../../../shared/api/firebase';

/**
 * Компонент регистрации пользователя
 * @component
 */
function SignUp({ onClose }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { signUp } = useAuth();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleSignUp = async (e) => {
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
            await signUp(auth, email, password);
            setError('');
            onClose();
        } catch (err) {
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