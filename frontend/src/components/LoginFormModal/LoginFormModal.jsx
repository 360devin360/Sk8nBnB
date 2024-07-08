import { useState } from "react"
import {useDispatch} from 'react-redux'
import './LoginFormModal.css';
import { logInUserThunk } from "../../store/session";
import {useModal} from '../../context/Modal'

export default function LoginFormModal(){
    const dispatch = useDispatch()
    const [credential,setCredential] = useState('')
    const [password,setPassword] = useState('')
    const [errors,setErrors] = useState({})
    const {closeModal} = useModal()

    function handleSubmit(e){
        e.preventDefault();
        const userInfo = {
            credential:credential,
            password:password
        }
        setErrors({})
        dispatch(logInUserThunk(userInfo))
            .then(closeModal)
            .catch(err=>{
                setErrors(err)
                setCredential('')
                setPassword('')
                console.log({errors})
            })
    }

// console.logs -----------------------------------console.logs
    // console.log({...errors})
    // console.log(user)
// console.logs -----------------------------------console.logs

    return (
        <>
            <h1>Log In</h1>
            <form
                className='inputForm'
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
                <button>Log In</button>
            </form>   
        </>
    )
}