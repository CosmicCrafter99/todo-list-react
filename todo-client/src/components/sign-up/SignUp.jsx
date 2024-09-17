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
            setError('Некорректный email');
            return;
        }
        if (!validatePassword(password)) {
            setError('Пароль должен быть не менее 6 символов');
            return;
        }
        if (password !== confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setError('');
        } catch (err) {
            switch (err.code) {
                case 'auth/email-already-in-use':
                    setError('Этот email уже используется.');
                    break;
                case 'auth/invalid-email':
                    setError('Некорректный email.');
                    break;
                case 'auth/operation-not-allowed':
                    setError('Регистрация с email временно отключена.');
                    break;
                case 'auth/weak-password':
                    setError('Пароль слишком слабый.');
                    break;
                default:
                    setError('Произошла ошибка при регистрации. Попробуйте еще раз.');
            }
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2>Регистрация</h2>
                <form onSubmit={handleSignUp}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="submit">Зарегистрироваться</button>
                </form>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}

export default SignUp;