import { SlUser, SlMenu } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import './ProfileButton.css'
import '../Navigation/Navigation.css';
import { logOutUserThunk } from "../../store/session";
import OpenModalButton from '../OpenModalButton/OpenModalButton.jsx'
import LoginFormModal from "../LoginFormModal/LoginFormModal.jsx";
import SignUpFormModal from "../SignUpModal/SignUpModal.jsx";

export function ProfileButton({user}){

    const dispatch = useDispatch()

    const [hidden,setHidden] = useState(true)
    const userInfo = 'userInfo' + (hidden ? ' hidden' : " visable")
    const menuRef = useRef()

    const logout = (e) => {
        e.preventDefault();
        toggleMenu(e)
        dispatch(logOutUserThunk())
    }
    
    const toggleMenu = (e) => {
        e.stopPropagation()
        setHidden(!hidden)
    }
    const closeMenu = () => setHidden(!hidden)

    useEffect(()=>{

        if(hidden) return

        const closeMenu = (e) => {
            if(menuRef.current && !menuRef.current.contains(e.target)){
                setHidden(true)
            }
        } 

        document.addEventListener('click', closeMenu)

        return () => document.addEventListener('click', closeMenu)
    },[hidden])

    return (
        <>
            <div id='button_div'>
                <button
                    type="button"
                    onClick={toggleMenu}
                    title="profile"
                    id='profile_button'
                >
                    <SlMenu size={40} color='#5eaf5e'id='menu'/>
                    <SlUser size={40} color="#5eaf5e"/>
                </button>
            </div>
            <div id='userInfo_div'>
                <ul className={userInfo} ref={menuRef}>
                    {user ? (
                        <>
                            <li>{user.username}</li>
                            <li>{user.email}</li>
                            <li>{user.firstName} {user.lastName}</li>
                            <li>
                                <button
                                    onClick={logout}
                                >
                                    Log out
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li id='signup_button_li'>
                                <OpenModalButton
                                    buttonText="Sign Up"
                                    modalComponent={<SignUpFormModal/>}
                                    onButtonClick={closeMenu}
                                    id='signup_button'
                                />
                            </li>
                            <li id='login_button'>
                                <OpenModalButton
                                    buttonText="Log in"
                                    modalComponent={<LoginFormModal/>}
                                    onButtonClick={closeMenu}
                                />
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </>
    );
}
