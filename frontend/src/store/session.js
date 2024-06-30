import { csrfFetch } from "./csrf";

const initialState = {user: null}

const LOG_IN_USER = '/session/logInUser';
const LOG_OUT_USER = '/session/CLEAR_USER_INFO';

// action to update current user slice of state
export function logInUser(userInfo){
    return {
        type: LOG_IN_USER,
        payload:userInfo
    }
}

// action to update current user to null
function logOutUser(){
    return {
        type: LOG_OUT_USER
    }
}

//thunk to get user information
export const singUpUserThunk = (signUpInfo) => async (dispatch) => {
    const response = await csrfFetch('/api/users',{
        "method":"POST",
        "body":JSON.stringify(signUpInfo)
    })
    if(response.status>=400){
        const body = await response.json()
        const err = new Error()
        err.status = response.status
        err.response = {...body}
        throw err
    }
    const userInfo = await response.json()
    dispatch(logInUser(userInfo))
}

export const logInUserThunk = (credentials) => async (dispatch) => {
    const response = await csrfFetch('/api/session',{
        "method":"POST",
        "body":JSON.stringify(credentials)
    })
    if(response.status>=400){
        const body = await response.json()
        const err = new Error()
        err.status = response.status,
        err.response = {...body}
        throw err
    }
    const userInfo = await response.json()
    dispatch(logInUser(userInfo))
}

export const restoreUserThunk = () => async (dispatch) => {
    const response = await fetch('/api/session')
    const data = await response.json()
    dispatch(logInUser(data))
}


export const logOutUserThunk = () => async (dispatch) => {
    try{
        const response = await csrfFetch('/api/session',{
            "method":"DELETE"
        })
        if(response.ok){
            dispatch(logOutUser())
        }
    }catch(error){
        const err = {
            message:'error in logoutUser thunk in frontend/store/session.js',
            error:error
        }
        throw err
    }
}



// reducer to update current users session information
  const sessionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case LOG_IN_USER:
        return {
            ...state,
            ...payload
        }
    case LOG_OUT_USER:
        return {
            ...state,
            ...initialState
        }
    default:
        return state
    }
}

export default sessionReducer;