import { useParams, NavLink } from "react-router-dom"
import './SpotById.css'
import { useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { getOneSpotThunk } from "../../store/spots";
import Sk8nBnB_Logo from '../../../../images/Sk8nBnB_Logo.png'
import { ProfileButton } from "../Navigation/ProfileButton";
import { restoreUserThunk } from "../../store/session";

export default function SpotById(){
    const {id} = useParams();
    const dispatch = useDispatch()
    
    useEffect(()=>{
        dispatch(getOneSpotThunk(id))
        dispatch(restoreUserThunk())
    },[dispatch,id])

    const user = useSelector(state=>state.session.user)
    const spot = useSelector(state=>state.spots)
    return (
        <>
          <header id='header'>
          <div id='nav'>
            <div
                id='logo_div'
            >
                <NavLink to='/' id='logo_button'>
                    <img src={Sk8nBnB_Logo} id='logo'/>
                </NavLink>
            </div>
                <ProfileButton user={user}/>
        </div>
          </header>
          <main id='main'>
            <div id='name_location'>
              <h1 id='name'>{spot?.object[id]?.name}</h1>
              <h2 id='location'>{spot?.object[id]?.city}, {spot.object[id]?.state}, {spot.object[id]?.country}</h2>
            </div>
            <div id='spot_images'>
              <div id='preview_image'>
              </div>
            </div>
          </main>
        </>
      )
}