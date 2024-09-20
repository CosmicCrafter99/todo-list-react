import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './SignUp.css';

/**
 * Компонент регистрации пользователя
 * @component
 */
function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

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
            await createUserWithEmailAndPassword(auth, email, password);
            setError('');
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
        <div className="signup-container">
            <div className="signup-form">
                <h2>Sign Up</h2>
                <form onSubmit={handleSignUp}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit">Sign Up</button>
                </form>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}

export default SignUp;