import { useEffect } from 'react'
import {getAllSpotsThunk} from '../../store/spots'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import './HomePage.css'
import { IoStar } from "react-icons/io5";
import { NavLink } from 'react-router-dom'

export default function Homepage(){
    // const user = useSelector(state=>state.session.user)
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getAllSpotsThunk())
    },[dispatch])

    const spots = useSelector(state=>state.spots.array)

    // console.log(spots)
    // return the JSX needed for rendering the spots on the page
    // create divs for each spot and include the image, name, price, rating, ect
    return (
        <div id='spots'>
            {
                spots?.map(spot=>{
                    return (
                        <div key={spot.id} className='spot' >
                            <NavLink to={`/spots/${spot.id}`}>
                            <div className='image_div'>
                                <img className='image'src={spot.previewImage} title={spot.name}/>
                            </div>
                            <div className='spot_info'>
                                <div className='name_price'>
                                    <p className='location'>{spot.city}, {spot.state}</p>
                                    <p className='price'><b>${spot.price}</b> night</p>
                                </div>
                                <div className='rating'>
                                    <p className='star_icon'><IoStar/>&nbsp;</p>
                                    {spot.avgRating ? <p className='score'>{spot.avgRating}</p>:<p className='score'>New</p>}    
                                </div>
                            </div>
                            </NavLink>
                        </div>
                    )
                })
            }
        </div>
    )
}

