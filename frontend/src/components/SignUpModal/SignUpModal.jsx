import { useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import { singUpUserThunk } from '../../store/session'
// import { Navigate} from 'react-router-dom'
import {useModal} from '../../context/Modal';

export default function SignUpFormModal(){

    const dispatch = useDispatch()
    const [email,setEmail]=useState('')
    const [username,setUsername]=useState('')
    const [firstName,setFirstName] = useState('')
    const [lastName,setLastName] = useState('')
    const [password,setPassword] = useState('')
    const [password2,setPassword2] = useState('')
    const [errors,setErrors] = useState({})
    const [disableButton, setDisableButton] = useState(false)
    const {closeModal} = useModal()

    function handleSubmit(e){
        e.preventDefault()
        const userInfo = {
            email:email,
            username:username,
            firstName:firstName,
            lastName:lastName,
            password:password,
            password2:password2
        }
        if(password!==password2){
            setErrors({passwords:'Passwords Do Not Match'})
            setPassword2('')
            // console.log(errors)
        }else{
            setErrors({})
            dispatch(singUpUserThunk(userInfo))
            .then(closeModal)
            .catch(error=>{
                setErrors(error)
                if(error?.response?.errors?.username) setUsername('')
                if(error?.response?.errors?.username) setUsername('')
                if(error?.response?.errors?.firstName) setFirstName('')
                if(error?.response?.errors?.lastName) setLastName('')
                
                })
        }
    }
    useEffect(()=>{
        let disable = false
        if(email===''||username===''||firstName===''||lastName===''|| password===''||password2===''){
            disable = true
        }
        setDisableButton(disable)

    },[email,firstName,lastName,username,password,password2,disableButton])
    // const user = useSelector(state=>state.session.user)
    // if(user){
    //     return <Navigate to="/" replace={true}/>
    // }

// console.logs------------------------------------console.logs
    // console.log({...errors})
// console.logs------------------------------------console.logs
    
    return (
        <>
            <h1>Sign Up</h1>
            <form
                className='inputForm'
                onSubmit={handleSubmit}
            >
                <input
                    type='text'
                    value={email}
                    placeholder="Email"
                    name='email'
                    onChange={(e)=>setEmail(e.target.value)}
                >
                </input>
                {errors?.response?.errors?.email ? <p>{errors?.response?.errors?.email}</p> : <br/>}
                <input
                    type='text'
                    value={username}
                    placeholder="username"
                    onChange={(e)=>setUsername(e.target.value)}
                    name='username'
                >
                </input>
                {errors?.response?.errors?.username ? <p>{errors?.response?.errors?.username}</p> : <br/>}
                <input
                    type='text'
                    value={firstName}
                    placeholder="First name"
                    onChange={(e)=>setFirstName(e.target.value)}
                >
                </input>
                {errors?.response?.errors?.firstName ? <p>{errors?.response?.errors?.firstName}</p> : <br/>}
                <input
                    type='text'
                    value={lastName}
                    placeholder="Last Name"
                    onChange={(e)=>setLastName(e.target.value)}
                >
                </input>
                {errors?.response?.errors?.lastName ? <p>{errors?.response?.errors?.lastName}</p> : <br/>}
                <input
                    type='password'
                    value={password}
                    placeholder="Password"
                    onChange={(e)=>setPassword(e.target.value)}
                >
                </input>
                <br/>
                <input
                    type='password'
                    value={password2}
                    placeholder="Password2"
                    onChange={(e)=>setPassword2(e.target.value)}
                >
                </input>
                {errors.passwords ? <p>{errors.passwords}</p> : <br/>}
                <button
                    disabled={disableButton}
                >
                    Sign Up
                </button>
            </form>
        </>
    )
}