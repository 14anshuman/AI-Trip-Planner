import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetPlaceDetails } from "../../service/Global";
import { PHOTO_REF_URL } from "../../service/Global";

const HotelCard = ({ item, index }) => {
  const [photoUrl, setPhotoUrl] = useState();

  useEffect(() => {
    item && getPlacePhoto();
  }, [item]);

  const getPlacePhoto = async () => {
    const data = {
      textQuery: item?.hotelName,
    };
    const result = await GetPlaceDetails(data)
      .then((res) => {
        const PhotoUrl = PHOTO_REF_URL.replace(
          "{NAME}",
          res.data.places[0].photos[0].name
        );
        //  console.log(PhotoUrl);
        setPhotoUrl(PhotoUrl);
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Link
        to={`https://www.google.com/maps/search/?api=1&query=${
          item?.hotelName + item?.hotelAddress
        }`}
        target="_blank"
      >
        <div
          key={index}
          className="rounded-2xl  overflow-hidden shadow-md hover:shadow-xl bg-gradient-to-r from-slate-100 to-gray-200 transition-shadow duration-300 cursor-pointer  "
        >
          <img
            src={photoUrl} // fallback to placeholder if missing
            className="h-[230px] w-full object-cover rounded-lg"
            alt={item?.hotelName || `Hotel ${index + 1}`}
          />
          <div className="p-2 my-3 flex flex-col ">
            <h3 className="font-semibold text-sm mb-1 ">{item?.hotelName}</h3>
            <p className="text-xs text-gray-500 mb-1">📍{item?.hotelAddress}</p>
            <p className="text-sm font-medium text-blue-600">
              {typeof item?.price === "string" && item.price.trim() !== ""
                ? `💰 ${item.price} per night`
                : "💰 Not Available"}
            </p>
            <p className="text-sm font-medium text-blue-600">
              ⭐{item?.rating} star
            </p>
          </div>
        </div>
      </Link>
    </>
  );
};

export default HotelCard;
