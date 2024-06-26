import { csrfFetch } from "./csrf";

const initialState = {user: null}

const GET_USER_INFO = '/session/GET_USER_INFO';
const CLEAR_USER_INFO = '/session/CLEAR_USER_INFO';

// action to update current user slice of state
export function getUserInfo(userInfo){
    return {
        type: GET_USER_INFO,
        payload:userInfo
    }
}

// action to update current user to null
function clearUserInfo(){
    return {
        type: CLEAR_USER_INFO
    }
}

//thunk to get user information
export const loginUser = (credentials) => async (dispatch) => {
    try{
        const response = await csrfFetch('/api/session',{
            "method":"POST",
            "body":JSON.stringify(credentials)
        })
        if(response.ok){
            const user = await response.json()
            dispatch(getUserInfo(user))
        }
    }catch(error){
        let err = {
            message:"error in loginUser thunk at frontend/store/session.js",
            error:error
        }
        console.log(err)
    }
}

export const logoutUser = () => async (dispatch) => {
    try{
        const response = await csrfFetch('/api/session',{
            "method":"DELETE"
        })
        if(response.ok){
            // await response.json()
            dispatch(clearUserInfo())
        }
    }catch(error){
        const err = {
            message:'error in logoutUser thunk in frontend/store/session.js',
            error:error
        }
        console.log(err) 
    }
}

// reducer to update current users session information
  const sessionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_USER_INFO:
        return {
            ...state,
            user:{
                ...payload.user
            }
        }
    case CLEAR_USER_INFO:
        return {
            ...state,
            user:{...initialState}
        }
    default:
        return state
    }
}

export default sessionReducer;