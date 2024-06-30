import {NavLink} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { ProfileButton } from './ProfileButton';
import '../Navigation/Navigation.css'

export function Navigation({isLoaded}){
    const user = useSelector(state=>state.session.user)

    const userLinks = user ? (
        <li>
            <ProfileButton user={user}/>
        </li> 
    ) : (
        <>
            <li>
                <NavLink to='/login'>Log In</NavLink>   
            </li>
            <li>
                <NavLink to='/signup'>Sign Up</NavLink>   
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