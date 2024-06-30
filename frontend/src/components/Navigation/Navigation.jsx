import {NavLink} from 'react-router-dom';
import {useSelector} from 'react-redux';
import { ProfileButton } from './ProfileButton';
import '../Navigation/Navigation.css'
import { SlHome } from "react-icons/sl"

export function Navigation({isLoaded}){
    const user = useSelector(state=>state.session.user)

    return (
        <div>
            <ul className='navigation_list_div'>
                <li id='home_button'>
                    <button><NavLink to='/'>{SlHome}</NavLink></button>
                </li>
                {isLoaded && (
                    <li id="profile_button">
                        <ProfileButton user={user}/>
                    </li> 
                )}
            </ul>
        </div>
    )
}