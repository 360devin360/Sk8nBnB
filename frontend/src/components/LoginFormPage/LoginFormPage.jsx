import { useEffect, useState } from "react"
import {useDispatch, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import './LoginFormPage.css';
import { loginUser } from "../../store/session";

export default function LoginFormPage(){
    const dispatch = useDispatch()
    const [credential,setCredential] = useState('')
    const [password,setPassword] = useState('')
    const navigate = useNavigate()
    
    
    
    function handleSubmit(e){
        e.preventDefault();
        const userInfo = {
            credential:credential,
            password:password
        }
        dispatch(loginUser(userInfo))
        setCredential('')
        setPassword('')
        navigate('/')
    }
    const user = useSelector(state=>state.session.user)
    
    useEffect(()=>{
        if(user!==null){
            navigate('/')
        }
    })
    return (
        <>
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
                <br/>
                <input
                    id='password'
                    type='text'
                    value={password}
                    placeholder='password'
                    name='password'
                    onChange={(e)=>setPassword(e.target.value)}
                >
                </input>
                <button>Submit</button>
            </form>   
        </>
    )
    
}