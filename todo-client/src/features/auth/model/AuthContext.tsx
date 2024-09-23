import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from 'firebase/auth';
import { auth } from '../../../shared/api/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * AuthProvider component that provides authentication context to its children.
 *
 * @component
 * @param {AuthProviderProps} props - The properties for the AuthProvider component.
 * @param {React.ReactNode} props.children - The child components that will have access to the authentication context.
 *
 * @returns {JSX.Element} The AuthProvider component with authentication context.
 *
 * @example
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 *
 * @remarks
 * This component uses Firebase authentication to manage user sign-in, sign-up, and sign-out processes.
 * It also listens for authentication state changes and updates the context accordingly.
 *
 * @function
 * @name signIn
 * @async
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @throws Will throw an error if sign-in fails.
 *
 * @function
 * @name signUp
 * @async
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @throws Will throw an error if sign-up fails.
 *
 * @function
 * @name signOut
 * @async
 * @throws Will throw an error if sign-out fails.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = '/todo';
        } catch (error) {
            console.error('Ошибка при входе:', error);
            throw error;
        }
    };

    const signUp = async (email: string, password: string) => {
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
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};