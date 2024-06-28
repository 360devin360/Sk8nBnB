import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import '../src/testing.css';
import * as sessionActions from './store/session'
import {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import { SignUpFormPage } from "./components/SignUpForm/SignUpForm";

const router = createBrowserRouter([  
  {
    element:<Layout/>,
    children:[
      {
        path:'/',
        element:(
          <>
            <h1>Welcome from App Academy</h1>
          </>
        )
      },
      {
        path:'/login',
        element:<LoginFormPage/>
      },
      {
        path:'/signup',
        element:<SignUpFormPage/>
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router}/>
}

function Layout(){
  // create custom hook to use
  const dispatch = useDispatch()
  // creat controll variable to check if user is loaded
  const [isLoaded, setIsLoaded] = useState(false)

  // useEffect to check for valid user
  useEffect(()=>{
    dispatch(sessionActions.restoreUserThunk())
      .then(()=>setIsLoaded(true))
  },[dispatch])

  return (
    <>
      <h6 style={{margin:0}}>header area for nav and such</h6>
      <main>
        {isLoaded && <Outlet/>}
      </main>
    </>
  )
}

export default App;
