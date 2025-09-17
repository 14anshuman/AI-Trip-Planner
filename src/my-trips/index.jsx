import React,{useEffect, useState} from 'react'
import { useNavigate } from 'react-router';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../service/firebaseConfig';
import UserTripCard from './components/UserTripCard';

const MyTrips = () => {

    const navigate=useNavigate();
    const [trips,setTrips]=useState([]);
    
    useEffect(() => {
      getUserTrips();
    }, [])
    


  const getUserTrips = async() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(!user){
         navigate("/");
        return;
    }
    setTrips([]);
    const q = query(collection(db, "AITrips"), where("userEmail", "==", user?.email));
    const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
//   console.log(doc.id, " => ", doc.data());
    setTrips((prev)=>[...prev,doc.data()]);
});
    }


  return (
    <>
    
    <div className=' className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 py-16 relative space-y-16"'>
           
          <h2 className='font-bold text-3xl'>My Trips🧳</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-6'>
            {trips.length>0?
            trips.map((trip,index)=>(
              <UserTripCard trip={trip}  onDelete={(id) => setTrips(trips.filter(t => t.id !== id))} key={index}/>

              )):
              [1,2,3,4].map((item,index)=>(
                <div key={index} className='animate-pulse space-y-3'>
                  <div className='bg-gray-300 h-70 w-full rounded-lg'></div>  
                  <div className='h-4 w-3/4 bg-gray-300 rounded-lg'></div>
                  <div className='h-4 w-1/2 bg-gray-300 rounded-lg'></div>
                  <div className='h-4 w-1/4 bg-gray-300 rounded-lg'></div>
                </div>
              ))
              
              }
          </div>
    </div>
    </>
  )
}

export default MyTrips