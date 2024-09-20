import React, { useState } from 'react';
import SignIn from '../sign-in/SignIn';
import SignUp from '../sign-up/SignUp';
import './Home.css';

function Home() {
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    const openSignInModal = () => setIsSignInOpen(true);
    const closeSignInModal = () => setIsSignInOpen(false);

    const openSignUpModal = () => setIsSignUpOpen(true);
    const closeSignUpModal = () => setIsSignUpOpen(false);

    return (
        <div className="home-container">
            <button className="home-button" onClick={openSignInModal}>Sign in</button>
            <button className="home-button" onClick={openSignUpModal}>Sign up</button>

            {isSignInOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-button" onClick={closeSignInModal}>&times;</button>
                        <SignIn />
                    </div>
                </div>
            )}

            {isSignUpOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <button className="close-button" onClick={closeSignUpModal}>&times;</button>
                        <SignUp />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;