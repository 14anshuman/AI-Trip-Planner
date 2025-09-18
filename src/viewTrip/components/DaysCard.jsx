import React, { useEffect, useState } from "react";
import { FaMapLocationDot } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/Global";
import { motion } from "framer-motion";

const DaysCard = ({ place, index }) => {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    if (place?.placeName) {
      getPlacePhoto();
    }
  }, [place?.placeName]);

  const getPlacePhoto = async () => {
    try {
      const data = { textQuery: place?.placeName };
      const res = await GetPlaceDetails(data);
      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        res.data.places[0].photos[1].name
      );
      setPhotoUrl(PhotoUrl);
    } catch (err) {
      console.error("Error fetching photo:", err);
    }
  };

  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "linear" }}
      viewport={{ once: false, amount: 0.1 }} // 👈 every time it enters viewport
      className="rounded-2xl overflow-hidden shadow-md border border-gray-300 
                 hover:shadow-xl transition-transform duration-300 
                 bg-gradient-to-r from-slate-100 to-gray-200 flex flex-row h-[280px] my-4"
    >
      {/* Left: Image */}
      <div className="w-1/3 h-full">
        <img
          src={photoUrl || "/placeholder.jpg"}
          alt={place?.placeName || `Place ${index + 1}`}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Right: Content */}
      <div className="p-3 flex flex-col flex-1">
        <h3 className="font-semibold text-lg">📍 {place?.placeName}</h3>
        <p className="text-xs text-gray-500 mb-1">{place?.timeTravel}</p>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">
          {place?.placeDetails}
        </p>
        <p className="text-sm font-medium text-blue-500">
          ⏳Opening time: {place?.openingHours || "Not Available"}
        </p>
        <p className="text-sm font-medium">
          {typeof place?.ticketPricing === "string" &&
          place?.ticketPricing?.length > 0
            ? `🎟 Ticket Price: ${place?.ticketPricing}`
            : "🎟 Ticket Price: Not Available"}
        </p>
        <p className="text-sm font-medium">⭐Rating: {place?.rating}</p>

        {/* Button bottom-right */}
        <div className="mt-auto flex justify-end">
          <a
            href={`https://www.google.com/maps?q=${place?.placeName},${place?.geoCoordinates?.latitude},${place?.geoCoordinates?.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              size="sm"
            >
              <FaMapLocationDot className="mr-1" />
              Map
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
};

export default DaysCard;
