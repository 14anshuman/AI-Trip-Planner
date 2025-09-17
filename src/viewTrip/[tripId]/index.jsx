import React, { useEffect, useState } from "react";
import { db } from "../../service/firebaseConfig";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import Information from "../components/Information";
import Hotels from "../components/Hotels";
import Itinerary from "../components/Itinerary";
import Footer from "../components/Footer;
import { motion } from "framer-motion";
import { ArrowUpCircle } from "lucide-react";


const ViewTrip = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    tripId && getTripData();

    // show back-to-top button after scrolling 300px
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tripId]);

  const getTripData = async () => {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log(docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No data found");
      toast("No Trip Found");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <div className="p-8 md:px-20 lg:px-44 xl:px-56 ">
        {/* Information Section */}
        <Information trip={trip} />

        {/* Hotels */}
        <Hotels trip={trip} />

        {/* Daily Plan */}
        <Itinerary trip={trip} />
        
       
        {/* Footer */}
        <Footer/>
      </div>
      

      {/* Back to Top Button */}
      {showButton && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-14 right-8 p-3 cursor-pointer rounded-full bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg hover:scale-110 transition"
        >
          <ArrowUpCircle className="h-7 w-7" />
        </motion.button>
      )}
    </>
  );
};

export default ViewTrip;
