import { createContext, useState, useEffect, useContext } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../shared/api/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (auth, email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = '/todo';
        } catch (error) {
            console.error('Ошибка при входе:', error);
            throw error;
        }
    };

    const signUp = async (auth, email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            window.location.href = '/todo';
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await auth.signOut();
            setUser(null);

            window.location.href = '/';
        } catch (error) {
            console.error('Ошибка при выходе:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    );
};

// Хук для доступа к контексту
export const useAuth = () => {
    return useContext(AuthContext);
};