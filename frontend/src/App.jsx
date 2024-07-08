// import LoginFormPage from "./components/LoginFormModal/LoginFormModal";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import * as sessionActions from './store/session'
import {useEffect, useState} from 'react'
import {useDispatch} from 'react-redux'
import { Navigation } from "./components/Navigation/Navigation";
import HomePage from './components/HomePage/HomePage'
import SpotById from "./components/SpotById/SpotById";

const router = createBrowserRouter([  
  {
    element:<Layout/>,
    children:[
      {
        path:'/',
        element: <HomePage />
      },
    ]
  },
  {
    path:'/spots/:id',
    element: <SpotById />
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
      <header>
        <Navigation isLoaded={isLoaded}/>
      </header>
      <main>
        {isLoaded && <Outlet/>}
      </main>
    </>
  )
}

export default App;
