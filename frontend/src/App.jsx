import LandingPage from './pages/landingPage.jsx';
<<<<<<< HEAD
import { Routes, Route, NavLink } from 'react-router-dom';
import React from 'react';
import Signup from './pages/signupPage.jsx';
import Dashboard from './pages/dashboardPage.jsx';
=======
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Signup from './pages/signupPage.jsx';
import Dashboard from './pages/dashboardPage.jsx';
import AddEventPage from './pages/addEventPage.jsx';
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
import Layout from "./components/ui/layout.jsx"; 
import Login from "./pages/loginPage.jsx"; 
import TripDetails from "./pages/tripDetails.jsx";
import QuickSplit from './pages/quickSplit.jsx';
import AddHouse from "./pages/addHousePage.jsx"
import HouseDashboard from './pages/houseDashboard.jsx';
<<<<<<< HEAD
import JoinHouse from './pages/joinHousePage.jsx'; 
import MyHouse from './pages/myHousePage.jsx'; 
import MyProfile from "./pages/myProfilePage.jsx";

=======
import ProtectedRoute from './pages/protectedRoute.jsx';
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


<<<<<<< HEAD
=======

>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
function App()
{
  return (
    <>
      <Routes>
<<<<<<< HEAD

=======
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

<<<<<<< HEAD

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addHouse" element={<AddHouse />} />
          <Route path="/joinHouse" element={<JoinHouse />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/house" element={<HouseDashboard />} />
          <Route path="/myHouse" element={<MyHouse />} />
          <Route path="/myProfile" element={<MyProfile />} />


=======
      {/* secure banners for logged in only */}
        <Route 
          element={
            <ProtectedRoute> 
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addHouse" element={<AddHouse />} />
          <Route path="/addEvent" element={<AddEventPage />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/quicksplit" element={<QuickSplit />} />
          <Route path="/house" element={<HouseDashboard />} />
>>>>>>> bcf2f07dd586d7e049c78dd997b95b0726a6acce
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
    
  );
}

export default App; 
