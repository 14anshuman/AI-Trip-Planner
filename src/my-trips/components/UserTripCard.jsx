import React, { useEffect, useState } from "react";
import { GetPlaceDetails, PHOTO_REF_URL } from "../../service/Global";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowUpCircle, Trash2 } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../service/firebaseConfig";

const UserTripCard = ({ trip, onDelete }) => {
  const [photoUrl, setPhotoUrl] = useState();
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (trip) getPlacePhoto();

    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trip]);

  const getPlacePhoto = async () => {
    try {
      const data = { textQuery: trip?.userSelection?.destination };
      const res = await GetPlaceDetails(data);
      const PhotoUrl = PHOTO_REF_URL.replace(
        "{NAME}",
        res.data.places[0].photos[0].name
      );
      setPhotoUrl(PhotoUrl);
    } catch (err) {
      console.error("Error fetching photo:", err);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (e) => {
    e.stopPropagation(); // don’t trigger navigation
    if (window.confirm("🗑️ Are you sure you want to delete this trip?")) {
      try {
        await deleteDoc(doc(db, "AITrips", trip.id));
        onDelete(trip.id); // ✅ notify parent to update list
        alert("Trip deleted successfully 🚀");
      } catch (err) {
        console.error("Error deleting trip:", err);
        alert("Failed to delete trip ❌");
      }
    }
  };

  return (
    <>
      {/* Trip Card */}
      <div
        onClick={() => navigate(`/view-trip/${trip?.id}`)}
        className="group relative rounded-2xl shadow-sm 
                   hover:shadow-2xl  transition-all duration-300 
                   overflow-hidden cursor-pointer h-[350px]"
      >
        {/* Image + Overlay + Content */}
        <div className="relative h-full w-full">
          <img
            src={photoUrl || "/placeholder.jpg"}
            alt={trip?.userSelection?.destination}
            className="object-cover h-full w-full rounded-2xl transition-transform duration-300"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent 
                          opacity-100 group-hover:opacity-90 transition-opacity"></div>

          {/* Content inside image */}
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            {/* Delete button (top-right) */}
            <motion.button
              onClick={handleDelete}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="self-end p-2 rounded-full 
                         bg-red-500/80 hover:bg-red-600 text-white 
                         shadow-md transition cursor-pointer"
            >
              <Trash2 className="h-5 w-5" />
            </motion.button>

            {/* Destination & trip info (bottom-left) */}
            <div>
              <h3 className="text-white font-bold text-xl drop-shadow-md">
                {trip?.userSelection?.destination}
              </h3>
              <p className="text-gray-200 text-sm">📅 {trip?.userSelection?.days} Days</p>
              <p className="text-gray-200 text-sm">🧍 {trip?.userSelection?.companion}</p>
              {trip?.userSelection?.budget && (
                <p className="text-gray-200 text-sm">💰 {trip?.userSelection?.budget}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showButton && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-14 right-8 p-3 rounded-full 
                     bg-gradient-to-r from-blue-500 to-blue-700 
                     text-white shadow-lg hover:scale-110 transition"
        >
          <ArrowUpCircle className="h-7 w-7" />
        </motion.button>
      )}
    </>
  );
};

export default UserTripCard;
