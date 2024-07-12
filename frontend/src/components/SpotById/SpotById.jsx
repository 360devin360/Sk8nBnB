import { useParams, NavLink } from "react-router-dom"
import './SpotById.css'
import { useEffect } from "react";
import { useDispatch, useSelector} from "react-redux";
import { getOneSpotThunk } from "../../store/spots";
import Sk8nBnB_Logo from '../../../../images/Sk8nBnB_Logo.png'
import { ProfileButton } from "../Navigation/ProfileButton";
import { restoreUserThunk } from "../../store/session";
import { IoIosStar } from "react-icons/io";
import {getAllReviewsForOneSpotThunk} from "../../store/reviews";

export default function SpotById(){
    const {id} = useParams();
    const dispatch = useDispatch()
    
    useEffect(()=>{
        dispatch(getOneSpotThunk(id))
        dispatch(restoreUserThunk())
        dispatch(getAllReviewsForOneSpotThunk(id))
    },[dispatch,id])

    const user = useSelector(state=>state.session.user)
    const spot = useSelector(state=>state.spots)
    const previewImage = spot.object[id]?.SpotImages?.filter(spot=>{
      return spot.preview === true
    })
    const otherImages = spot.object[id]?.SpotImages?.filter(spot=>{
      return spot.preview === false
    })
    const reviews = useSelector(state=>state.reviews)
    console.log(reviews)
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
              <h2 id='location'>{spot?.object[id]?.city}, {spot?.object[id]?.state}, {spot.object[id]?.country}</h2>
            </div>
            <div id='spot_images'>
              <div id='preview_image'>
                {
                  previewImage?.map(info=>{
                    return <img key={info.id} src={info.url}/>
                  })
                }
              </div>
              <div id='other_images'>
                {
                  otherImages?.map(info=>{
                    return <img key={info.id} src={info.url}/>
                  })
                }
              </div>
            </div>
            <div id='spot_info_and_review_div'>
                <div id='spot_info'>
                  <h2 id='owner'>Hosted by</h2>
                  <p id='description'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi perspiciatis dignissimos illum, esse odio nesciunt at id. Dolorum blanditiis ab vero quae quibusdam accusamus totam ut nesciunt. Quo, doloremque suscipit.</p>
                </div>
                <div id='price_rating_reserve_div'>
                  <div id='price_rating_reserve_card'>
                    <div id='price_rating_div'>
                      <p id='price'><b id='cost'>$12343</b> night</p>
                      <p id='rating'><IoIosStar/> 4.5 . 1 review</p>
                    </div>
                    <div id='reserve_button_div'>
                      <button id='reserve_button'>Reserve</button>
                    </div>
                  </div>
                </div>
              </div>
          </main>
        </>
      )
}