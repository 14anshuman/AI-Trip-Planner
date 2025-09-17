import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../service/firebaseConfig";
import UserTripCard from "./components/UserTripCard";

const MyTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserTrips();
  }, []);

  const getUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }
    setTrips([]);
    setLoading(true);

    const q = query(
      collection(db, "AITrips"),
      where("userEmail", "==", user?.email)
    );
    const querySnapshot = await getDocs(q);

    const tripList = [];
    querySnapshot.forEach((doc) => {
      tripList.push({ id: doc.id, ...doc.data() });
    });

    setTrips(tripList);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 py-16 relative space-y-16">
      <h2 className="font-bold -mt-2 text-4xl  ">My Trips 🧳</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-5">
        {loading ? (
          // Skeleton loader
          [1, 2, 3, 4].map((item, index) => (
            <div key={index} className="animate-pulse space-y-3">
              <div className="bg-gray-300 h-70 w-full rounded-lg"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded-lg"></div>
              <div className="h-4 w-1/2 bg-gray-300 rounded-lg"></div>
              <div className="h-4 w-1/4 bg-gray-300 rounded-lg"></div>
            </div>
          ))
        ) : trips.length > 0 ? (
          // Show trips
          trips.map((trip, index) => (
            <UserTripCard
              trip={trip}
              onDelete={(id) => setTrips(trips.filter((t) => t.id !== id))}
              key={index}
            />
          ))
        ) : (
          // Simple message
          <p className="col-span-full text-center text-gray-600 text-lg">
            No trip found
          </p>
        )}
      </div>
    </div>
  );
};

export default MyTrips;
