import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { BsFillSendFill } from "react-icons/bs";
import { MdPictureAsPdf } from "react-icons/md";
import { GetPlaceDetails } from "../../service/Global";



const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key="+
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

const Information = ({ trip }) => {
  const [photoUrl, setPhotoUrl] = useState();
  const pageRef = useRef(null); // 🔗 ref for whole page

  useEffect(() => {
    trip && getPlacePhoto();
  }, [trip]);

  const getPlacePhoto = async () => {
    const data = {
      textQuery: trip?.userSelection?.destination,
    };
    await GetPlaceDetails(data)
      .then((res) => {
        const PhotoUrl = PHOTO_REF_URL.replace(
          "{NAME}",
          res.data.places[0].photos[0].name
        );
        setPhotoUrl(PhotoUrl);
      })
      .catch((err) => console.log(err));
  };

  // 🔗 Share Handler
  const handleShare = () => {
    const tripDetails = `
🌍 Destination: ${trip?.userSelection?.destination}
📅 Days: ${trip?.userSelection?.days}
💰 Budget: ${trip?.userSelection?.budget}
🧍 Travelers: ${
      typeof trip?.userSelection?.companion === "number"
        ? `${trip?.userSelection?.companion} people`
        : trip?.userSelection?.companion
    }
    `;

    if (navigator.share) {
      navigator
        .share({
          title: "My Travel Itinerary",
          text: tripDetails,
          url: window.location.href,
        })
        .catch((err) => console.log("Error sharing:", err));
    } else {
      navigator.clipboard.writeText(tripDetails);
      alert("Trip details copied to clipboard! 🚀");
    }
  };

  // 📄 Export Whole Page as PDF
  

  

  return (
    <div ref={pageRef} className="bg-white p-4 rounded-xl shadow-md">
      <img
        src={photoUrl}
        className="h-[350px] w-full object-cover bg-gradient-to-t from-black/70 to-transparent 
                          opacity-90 group-hover:opacity-90 transition-opacity rounded-xl"
      />
      <div className="flex justify-between items-center">
        <div className="my-5 gap-2 flex flex-col">
          <h2 className="font-bold text-2xl">
            {trip?.userSelection?.destination}
          </h2>
          <div className="flex gap-5 flex-wrap">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              📅 {trip?.userSelection?.days} Days
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              💰 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md">
              🧍🏻 Travelers:{" "}
              {typeof trip?.userSelection?.companion === "number"
                ? `${trip?.userSelection?.companion} people`
                : trip?.userSelection?.companion}
            </h2>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleShare}
            className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <BsFillSendFill size={18} />
          </Button>
          
        </div>
      </div>
      

        </div>
      
  );
};

export default Information;
