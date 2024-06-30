import { useState } from "react"
import {useDispatch, useSelector} from 'react-redux'
import {Navigate} from 'react-router-dom'
import './LoginFormPage.css';
import { logInUserThunk } from "../../store/session";

export default function LoginFormPage(){
    const dispatch = useDispatch()
    const [credential,setCredential] = useState('')
    const [password,setPassword] = useState('')
    const [errors,setErrors] = useState({})

    function handleSubmit(e){
        e.preventDefault();
        const userInfo = {
            credential:credential,
            password:password
        }
        
        dispatch(logInUserThunk(userInfo))
            .then(()=>setErrors({}))
            .catch(err=>{
                setErrors(err)
                setCredential('')
                setPassword('')
            })
    }
    
    const user = useSelector(state=>state.session.user)
    if(user){
        return <Navigate to='/' replace={true}/>
    }
    console.log({...errors})
    // console.log(user)
    return (
        <>
            <h1>Log In</h1>
            <form
                id='inputForm'
                onSubmit={handleSubmit}
            >
                <input
                    id='credential'
                    type='text'
                    value={credential}   
                    placeholder='username'
                    name='username'
                    onChange={(e)=>setCredential(e.target.value)}
                >
                </input>
                {errors?.response?.errors?.credential ? <p>{errors?.response?.errors?.credential}</p> : <br/>}
                <input
                    id='password'
                    type='text'
                    value={password}
                    placeholder='password'
                    name='password'
                    onChange={(e)=>setPassword(e.target.value)}
                >
                </input>
                {errors?.response?.message && errors?.response?.message !== "Bad Request" && <p>{errors?.response?.message}</p>}
                {errors?.response?.errors?.password ? <p>{errors?.response?.errors?.password}</p> : <br/>}
                <button>Submit</button>
            </form>   
        </>
    )
}