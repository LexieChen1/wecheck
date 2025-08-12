import LandingPage from './pages/landingPage.jsx';
import { Routes, Route } from 'react-router-dom';
import React from 'react';
import Signup from './pages/signupPage.jsx';
import Dashboard from './pages/dashboardPage.jsx';
import Layout from "./components/ui/layout.jsx";
import Login from "./pages/loginPage.jsx";
import TripDetails from "./pages/tripDetails.jsx";
import AddHouse from "./pages/addHousePage.jsx";
import HouseDashboard from './pages/houseDashboard.jsx';
import JoinHouse from './pages/joinHousePage.jsx';
import MyHouse from './pages/myHousePage.jsx';
import MyProfile from "./pages/myProfilePage.jsx";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addHouse" element={<AddHouse />} />
          <Route path="/joinHouse" element={<JoinHouse />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/house" element={<HouseDashboard />} />
          <Route path="/myHouse" element={<MyHouse />} />
          <Route path="/myProfile" element={<MyProfile />} />
        </Route>
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
}

export default App;
