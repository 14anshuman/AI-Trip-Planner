import React from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import DaysCard from "./DaysCard";

const Itinerary = ({ trip }) => {
  return (
    <div className="my-10">
      <h2 className="font-bold text-xl mt-4">Places To Visit</h2>

      {/* Iterate over days dynamically */}
      {Object.entries(trip?.tripData?.itinerary || {})
        .filter(([key]) => key.startsWith("day")) // only include day1, day2, ...
        .map(([dayKey, dayData], dayIndex) => (
          <div key={dayKey} className="mb-10">
            <h2 className="text-xl font-medium text-gray-500 mb-4 mt-3.5">
              Day {dayIndex + 1}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 cursor-pointer gap-6">
              {Object.values(dayData?.plan|| {}).map((place, index) => (
                <DaysCard
                  place={place}
                  index={index}
                  dayIndex={dayIndex}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default Itinerary;
