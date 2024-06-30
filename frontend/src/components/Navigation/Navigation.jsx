import {NavLink} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { ProfileButton } from './ProfileButton';
import '../Navigation/Navigation.css'
import OpenModalButton from '../OpenModalButton/OpenModalButton.jsx'
import LoginFormModal from '../LoginFormModal/LoginFormModal.jsx';
import SignUpFormModal from '../SignUpModal/SignUpModal.jsx';

export function Navigation({isLoaded}){
    const user = useSelector(state=>state.session.user)

    const userLinks = user ? (
        <li>
            <ProfileButton user={user}/>
        </li> 
    ) : (
        <>
            <li>
                <OpenModalButton
                    buttonText="Log In"
                    modalComponent={<LoginFormModal/>}
                />   
            </li>
            <li>
                <OpenModalButton
                    buttonText="Sign Up"
                    modalComponent={<SignUpFormModal/>}
                />   
            </li>
        </>
    )

    return (
        <ul>
            <li>
                <NavLink to='/'>Home</NavLink>
            </li>
            {isLoaded && userLinks}
        </ul>
    )
}