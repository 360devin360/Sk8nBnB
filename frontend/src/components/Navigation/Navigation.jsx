import {useSelector} from 'react-redux';
import { ProfileButton } from './ProfileButton';
import '../Navigation/Navigation.css'
import { NavLink } from 'react-router-dom';
import Sk8nBnB_Logo from '../../../../images/Sk8nBnB_Logo.png'

export function Navigation({isLoaded}){
    const user = useSelector(state=>state.session.user)

    return (
        <div id='navigation'>
            <div
                id='logo_div'
            >
                <NavLink to='/' id='logo_button'>
                    <img src={Sk8nBnB_Logo} id='logo'/>
                </NavLink>
            </div>
            {isLoaded && (
                <ProfileButton user={user}/>
            )}
        </div>
    )
}