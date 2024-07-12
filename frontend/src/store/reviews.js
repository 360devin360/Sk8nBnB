import { csrfFetch } from "./csrf"

const initialState = {object:{},array:[]}

const GET_ALL_REVIEWS_FOR_ONE_SPOT = 'reviews/GET_ALL_REVIEWS_FOR_ONE_SPOT'

// create action for getting reviews for a spot
function getAllReviewsForOneSpot(reviews){
    return {
        type:GET_ALL_REVIEWS_FOR_ONE_SPOT,
        payload:reviews
    }
}

// create thunk to get reviews for one spot
export function getAllReviewsForOneSpotThunk(spotId){
    return async function(dispatch){
        const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
        if(response.status>=400){
            const body = await response.json()
            const err = new Error()
            err.status = response.status
            err.response = {...body}
            throw err
        }
        const reviews = await response.json()
        dispatch(getAllReviewsForOneSpot(reviews))
    }
}

export default function reviewReducer(state = initialState, { type, payload }){
  switch (type) {
  case GET_ALL_REVIEWS_FOR_ONE_SPOT:{
      const newState = {...state}
      newState.object = {}
      payload.Reviews.forEach(review=>{
          newState.object[review.id] = review
      })
      newState.array = [...payload.Reviews]
      return newState
  }

  default:
    return state
  }
}
