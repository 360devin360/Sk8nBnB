import { SlUser } from "react-icons/sl";
import { useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import './ProfileButton.css'
import '../Navigation/Navigation.css';
import { logOutUserThunk } from "../../store/session";

export function ProfileButton({user}){

    const dispatch = useDispatch()

    const [hidden,setHidden] = useState(true)
    const userInfo = 'userInfo' + (hidden ? ' hidden' : "")
    const menuRef = useRef()

    const logout = (e) => {
        e.preventDefault();
        dispatch(logOutUserThunk())
    }
    
    const toggleMenu = (e) => {
        e.stopPropagation()
        setHidden(!hidden)
    }
   
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
            <button
                type="button"
                onClick={toggleMenu}
                title="profile"
            >
                <SlUser/>
            </button>
            <ul className={userInfo} ref={menuRef}>
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
            </ul>
        </>
    );
}
