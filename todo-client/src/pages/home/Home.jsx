import React, { useState } from 'react';
import SignIn from '../../features/auth/ui/SignIn';
import SignUp from '../../features/auth/ui/SignUp';
import Modal from '../../shared/ui/modal/Modal';
import Button from '../../shared/ui/button/Button';
import './Home.css';

function Home() {
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);

    const openSignInModal = () => {
        setIsSignInOpen(true);
    }
    const closeSignInModal = () => {
        setIsSignInOpen(false);
    }

    const openSignUpModal = () => {
        setIsSignUpOpen(true);
    }
    const closeSignUpModal = () => {
        setIsSignUpOpen(false);
    }

    return (
        <div className="home-container">
            <Button className="home-button" onClick={openSignInModal}>Sign in</Button>
            <Button className="home-button" onClick={openSignUpModal}>Sign up</Button>

            <Modal isOpen={isSignInOpen} onClose={closeSignInModal}>
                <SignIn onClose={closeSignInModal} />
            </Modal>

            <Modal isOpen={isSignUpOpen} onClose={closeSignUpModal}>
                <SignUp onClose={closeSignUpModal} />
            </Modal>
        </div>
    );
}

export default Home;