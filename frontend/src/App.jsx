import LoginFormPage from "./components/LoginFormPage/LoginFormPage";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import '../src/testing.css';
const router = createBrowserRouter([  
  {
    element:<Layout/>,
    children:[
      {
        path:'/',
        element:(
          <>
            <h1>Welcome from App Academy</h1>
            {/* <button><NavLink to='/'>Log In</NavLink></button> */}
          </>
        )
      },
      {
        path:'/login',
        element:<LoginFormPage/>
      }
    ]
  }
])

function App() {
  return <RouterProvider router={router}/>
}

function Layout(){
    return (
        <>
          <h6 style={{margin:0}}>header area for nav and such</h6>
          <main>
            <Outlet/>
          </main>
        </>
      )
    }
    
    // function App() {
    //   return <h1>hello</h1>
    // }
    export default App;
