import { csrfFetch } from "./csrf"

const initialState = {object:{},array:[]}
const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS'
const GET_ONE_SPOT = 'spots/GET_ONE_SPOT'

// action
function getAllSpots(spots){
    return {
        type:GET_ALL_SPOTS,
        payload:spots
    }
}
function getOneSpot(spot){
    return {
        type: GET_ONE_SPOT,
        payload: spot
    }
}

// get all spots thunk
export function getAllSpotsThunk(){
    return async function (dispatch){
        const response = await csrfFetch('/api/spots')
        if(response.status>=400){
            const body = await response.json()
            const err = new Error()
            err.status = response.status
            err.response = {...body}
            throw err
        }
        const spots = await response.json()
        // console.log(spots)
        dispatch(getAllSpots(spots))
    }
}

// get one spot thunk
export function getOneSpotThunk(spotId){
    return async function (dispatch){
        const response = await csrfFetch(`/api/spots/${spotId}`)
        if(response.status >= 400){
            const body = await response.json()
            const err = new Error()
            err.status = response.status
            err.response = {...body}
            throw err
        }
        const spot = await response.json()
        dispatch(getOneSpot(spot))
    }
}

export default function spotReducer(state=initialState,{type,payload}){
    switch(type){
        case GET_ALL_SPOTS:{
            const newState = {...state}
            const array = payload.Spots
            newState.array = array
            const object = {}
            array.forEach(spot=>{
                object[spot.id]=spot
            })
            // console.log('object',object)
            newState.object = object
            return newState
        }
        case GET_ONE_SPOT:{
            const newState = {...state}
            const array = payload.Spots
            newState.array = array
            const object = {}
            array.forEach(spot=>{
                object[spot.id]=spot
            })
            newState.object = object
            return newState
        }
        default:
            return state
    }
}

