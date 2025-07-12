import LandingPage from './pages/landingPage.jsx';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Signup from './pages/signupPage.jsx';
import Dashboard from './pages/dashboardPage.jsx';
import AddEventPage from './pages/addEventPage.jsx';
import Layout from "./components/ui/layout.jsx"; 
import Login from "./pages/loginPage.jsx"; 
import TripDetails from "./pages/tripDetails.jsx";
import QuickSplit from './pages/quickSplit.jsx';
import AddHouse from "./pages/addHousePage.jsx"
import HouseDashboard from './pages/houseDashboard.jsx';
import ProtectedRoute from './pages/protectedRoute.jsx';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App()
{
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

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
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
    
  );
}

export default App; 
