
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'

import Header from "./components/custom/Header";
import Home from "./pages/home";
import CreateTrip from "./pages/createTrip";
import ViewTrip from "./viewTrip/[tripId]";
import MyTrips from "./my-trips";

function App() {
  return (
    <>
    
    <Header/>
    
    <Routes>

     
      <Route path="/" element={<Home/>} />
      <Route path="/create-trip" element={<CreateTrip/>} />

      <Route path="/view-trip/:tripId" element={<ViewTrip/>}/>
      <Route path="/my-trips" element={<MyTrips/>}/>

    </Routes>
    </>
  
  )
}

export default App