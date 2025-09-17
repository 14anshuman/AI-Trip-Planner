import React from "react";
import { Link } from "react-router";
import HotelCard from "./HotelCard";

const Hotels = ({ trip }) => {
  return (
    <div>
      <h2 className="font-bold text-xl mt-3">Hotel Recommendations</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4 mt-5 ">
  {trip?.tripData?.hotelOptions?.map((item, index) => (
    <HotelCard item={item} index={index} />
  ))}
  
</div>
    </div>
  );
};

export default Hotels;
