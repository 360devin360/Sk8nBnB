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
  const dispatch = useDispatch()
  const {id} = useParams();
  
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
              <h2 id='owner'>Hosted by {spot?.object[id]?.Owner?.firstName} {spot?.object[id]?.Owner?.lastName}</h2>
              <p id='description'>{spot?.object[id]?.description}</p>
            </div>
            <div id='price_rating_reserve_div'>
              <div id='price_rating_reserve_card'>
                <div id='price_rating_div'>
                  <div id='price_div'>
                    <p id='price'><b id='cost'>${spot?.object[id]?.price}</b>&nbsp;night</p>
                  </div>
                  <div id='star_rating_div'>
                    <div id='star_rating'>
                      <div id='star_div'>
                        <IoIosStar size={23}/> 
                      </div>
                      {
                        spot?.object[id]?.avgRating ?
                            <div id='rating_div'>
                              &nbsp;{spot?.object[id]?.avgRating}&nbsp;<span id='dot'>•</span>&nbsp;{spot?.object[id]?.numReviews}&nbsp;reviews
                            </div>
                          :
                            <div id='rating_div'>
                              &nbsp;New
                            </div>
                      }
                    {/* <p id='rating'><span id='star'>&#9733;</span> {spot.object[id].avgRating} <span id='dot'>•</span> {spot.object[id].numReviews} review</p> */}
                    </div>
                  </div>
                </div>
                <div id='reserve_button_div'>
                  <button id='reserve_button'
                    onClick={()=>alert("Feature Coming Soon...")}
                  >Reserve</button>
                </div>
              </div>
            </div>
          </div>
          <div id='reviews_div'>
            <div id='average_rating_num_reviews_div'>
              {
                spot?.object[id]?.avgRating ?
                    <p id='average_rating_num_reveiws'><IoIosStar size={35}/>&nbsp;{spot?.object[id]?.avgRating}&nbsp;<span id='dot'>•</span>&nbsp;{spot?.object[id]?.numReviews}&nbsp;reviews</p>
                  :
                    <p id='average_rating_num_reveiws'><IoIosStar size={35}/>&nbsp;New</p>
              }
            </div>
            <div id='reviews'>
              {
                reviews.array?.map(review=>{
                  const months = {"01":"January","02":"February","03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September","10":"October","11":"November","12":"December"}
                  const reviewDate = review?.updatedAt.split(' ')[0]
                  const reviewDateMonth = reviewDate.split('-')[1]
                  const reviewDateYear = reviewDate.split('-')[0]
                  const month = months[reviewDateMonth]
                  return (
                    <div key={review?.id}>
                      <h3 id='review_owner_firstName'>{review?.User?.firstName}</h3>
                      <p id='date_of_review'>{month}&nbsp;{reviewDateYear}</p>
                      <p id='review'>{review?.review}</p>
                    </div>
                  )
                })
              }
            </div>
          </div>
      </main>
    </>
  )
}