import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import { Toaster } from 'react-hot-toast'
import { UserProvider } from './hooks/useUser.jsx'
import CenterPage from './pages/CenterPage.jsx'
import ReportPage from './pages/ReportPage.jsx'
import IntroPage from './pages/IntroPage.jsx'
import AppointnmentViewPage from './pages/patient/AppointmentViewPage.jsx'
import CreatePatient from './pages/patient/CreatePatient.jsx'
import PatientListPage from "./pages/patient/PatientListPage.jsx"
import PatientTransferPage from './pages/patient/PatientlistTransferPage.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/regsiter",
        element: <RegisterPage />
      },
        {
        path: "/login",
        element: <LoginPage />
      },
       {
        path: "/create",
        element: <CreatePatient />
      },
       {
        path: "/intro",
        element: <IntroPage />
      },
       {
        path: "/patients",
        element: <PatientListPage />
      },
       {
        path: "/center",
        element: <CenterPage />
      }
   ,
    
    
   
       {
        path: "/report",
        element: <ReportPage />
      },
   
       {
        path: "/appointment",
        element: <AppointnmentViewPage/>
      },
   {
        path: "/transfer",
        element: <PatientTransferPage/>
      },

   
      
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
<UserProvider>

    <Toaster/>
  <RouterProvider router={router} />

</UserProvider>

 </React.StrictMode>,
)