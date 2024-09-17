import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';
import './SignIn.css';

/**
 * Компонент для входа в систему
 * @component
 */
function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignIn = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setError('');
        } catch (err) {
            switch (err.code) {
                case 'auth/invalid-email':
                    setError('Некорректный формат email.');
                    break;
                case 'auth/user-disabled':
                    setError('Этот пользователь был отключен.');
                    break;
                case 'auth/user-not-found':
                    setError('Пользователь с таким email не найден.');
                    break;
                case 'auth/wrong-password':
                    setError('Неверный пароль.');
                    break;
                case 'auth/invalid-credential':
                    setError('Неверные учетные данные.');
                    break;
                default:
                    setError('Ошибка при входе: ' + err.message);
            }
        }
    };

    return (
        <div className="signin-container">
            <div className="signin-form">
                <h2>Вход</h2>
                <form onSubmit={handleSignIn}>
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
                    <button type="submit">Войти</button>
                </form>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
}

export default SignIn;