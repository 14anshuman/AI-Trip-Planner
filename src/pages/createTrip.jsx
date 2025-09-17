import React, { useState} from "react";
import { useLoadScript } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { AI_PROMPT } from "../constants/options";
import { Chat, Models } from "@google/genai";
import { generateTripPlan } from "../service/AIModel";
import { db } from "../service/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

const libraries = ["places"];

export default function CreateTrip() {
  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();

  const [formData, setFormData] = useState({});

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const budgetArray = [
    { label: "Cheap", value: 'Cheap', icon: "🏕️" },
    { label: "Moderate", value: 'Moderate', icon: "🏨" },
    { label: "Luxury", value: 'Luxury', icon: "🏰" },
  ];

  const travelCompanion = [
    { label: "Solo", value: 1, icon: "🧍🏻", desc: "Just me" },
    { label: "Couple", value: 2, icon: "💕", desc: "Romantic getaway" },
    { label: "Family", value: "family", icon: "👨‍👩‍👧‍👦", desc: "Family fun" },
    { label: "Friends", value: "friends", icon: "🎉", desc: "Squad goals" },
  ];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
    libraries,
  });

  const fetchSuggestions = async (inputValue) => {
    if (!inputValue || !window.google) {
      setSuggestions([]);
      return;
    }

    try {
      const { AutocompleteSuggestion } = await window.google.maps.importLibrary(
        "places"
      );

      const { suggestions } =
        await AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: inputValue,
        });

      setSuggestions(suggestions || []);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setDestination(inputValue);
    handleInputChange("destination", inputValue);
    fetchSuggestions(inputValue);
    setSelectedPlace(null);
  };

  const handleSelect = async (s) => {
    try {
      const placeId = s.placePrediction.placeId;

      const { Place } = await window.google.maps.importLibrary("places");
      const place = new Place({ id: placeId });

      const result = await place.fetchFields({
        fields: ["id", "displayName", "formattedAddress", "location"],
      });

      const selected = {
        name: result.place?.displayName || "",
        address: result.place?.formattedAddress || "",
        lat: result.place?.location?.lat?.() ?? null,
        lng: result.place?.location?.lng?.() ?? null,
        placeId: result.place?.id || placeId,
      };

      setDestination(selected.name || selected.address);
      setSuggestions([]);
      setSelectedPlace(selected);

      handleInputChange("destination", selected.name || selected.address);

      console.log("✅ Selected Place (local):", selected);
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: (codeResp) => getUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const getUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        onGenerateTrip();
      });
  };

  const saveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    // const cleanedData = TripData.replace(/```json/g, ""); 
    // console.log("Value of TripData:", TripData);
    const raw = TripData;
    const match = raw.match(/```json([\s\S]*?)```/);
    if (match) {
      const jsonString = match[1]; // only the JSON
      // console.log(jsonString);
      
      const data = JSON.parse(jsonString);
        console.log("Value of TripData:", data);
       await setDoc(doc(db, "AITrips", docId), {
      userSelection: formData,
      tripData: data,
      userEmail: user?.email,
      id: docId,
    });
    }
  
    
    setLoading(false);
    navigate('/view-trip/'+docId);
  };

  

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }

    if (
      !formData.destination ||
      !formData.companion ||
      !formData.days ||
      !formData.budget
    ) {
      toast("Please enter all details.");
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData.destination)
      .replace("{days}", formData?.days)
      .replace("{companion}", formData?.companion)
      .replace("{budget}", formData?.budget);
    // console.log("🚀 Final Form Data:", formData);
    //  console.log("🚀 Final Form Data:", FINAL_PROMPT);
    // const result=await  generateTripPlan(FINAL_PROMPT);
    // console.log(result?.response?.text);
    try {
      const result = await generateTripPlan(FINAL_PROMPT);
      // console.log("🚀 Gemini Output:", result);
      setLoading(false);
      saveAiTrip(result);
      // if needed, parse here:
      // const parsed = JSON.parse(result);
    } catch (err) {
      console.error("❌ Error generating trip:", err);
      toast.error("Something went wrong while generating your trip.");
    }
  };

  if (!isLoaded) return (<div className="flex flex-col items-center space-y-16 animate-pulse p-6">
      {/* Title */}
      <div className="h-14 w-1/2 bg-gray-300 dark:bg-gray-200 rounded-lg"></div>
      {/* Subtitle */}
      <div className="h-7 w-2/4 bg-gray-300 dark:bg-gray-200 rounded-lg"></div>

      {/* Input Card */}
      <div className="w-full max-w-xl bg-white dark:bg-gray-200 p-6 rounded-2xl shadow-md space-y-4">
        {/* Icon + Label */}
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 bg-gray-300 dark:bg-gray-300 rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-300 rounded-lg"></div>
            <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-300 rounded-lg"></div>
          </div>
        </div>

        {/* Input field placeholder */}
        <div className="h-50 w-full bg-gray-300 dark:bg-gray-300 rounded-xl"></div>
      </div>
    </div>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 py-16 relative space-y-16">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="font-black text-5xl md:text-6xl bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent leading-tight">
          Tell us your travel{" "}
          <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            preferences ✈️
          </span>
        </h1>
        <p className="mt-6 text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
          Provide basic info, and our AI planner will build a{" "}
          <span className="font-semibold text-indigo-600">
            {" "}
            custom itinerary{" "}
          </span>{" "}
          just for you
        </p>
      </div>

      {/* Destination */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative bg-white/70 backdrop-blur-lg p-8 rounded-2xl border border-white/50 shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                🌍
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Your destination
                </h2>
                <p className="text-gray-600">
                  Where would you like to explore?
                </p>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={destination}
                onChange={handleChange}
                placeholder="Type a destination (e.g., Paris, Tokyo, Bali)"
                className="w-full border-2 border-gray-200 bg-white/80 backdrop-blur-sm p-4 rounded-xl text-lg placeholder-gray-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-200 outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
              />

              {suggestions.length > 0 && (
                <div className="mt-3 z-50">
                  <ul className="bg-white backdrop-blur-lg border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                    {suggestions.map((s, i) => (
                      <li
                        key={i}
                        className="px-6 py-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleSelect(s)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-lg flex items-center justify-center text-white text-sm">
                            📍
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">
                              {s.placePrediction.mainText.text}
                            </div>
                            {s.placePrediction.secondaryText && (
                              <div className="text-sm text-gray-500 mt-1">
                                {s.placePrediction.secondaryText.text}
                              </div>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trip Duration */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative bg-white/70 backdrop-blur-lg p-8 rounded-2xl border border-white/50 shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                📅
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Trip duration
                </h2>
                <p className="text-gray-600">
                  How many days will you be traveling?
                </p>
              </div>
            </div>

            <div className="max-w-xs">
              <Input
                type="number"
                placeholder="Ex. 7"
                onChange={(e) => handleInputChange("days", e.target.value)}
                min="1"
                max="10"
                className="w-full border-2   border-gray-200 bg-white/80 backdrop-blur-sm p-6 rounded-xl text-lg placeholder-gray-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none transition-all duration-300 shadow-lg hover:shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Budget */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative bg-white/70 backdrop-blur-lg p-8 rounded-2xl border border-white/50 shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                💰
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Budget range
                </h2>
                <p className="text-gray-600">
                  What's your budget for this adventure?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {budgetArray.map((b) => (
                <button
                  key={b.value}
                  onClick={() => handleInputChange("budget", b.value)}
                  className={`group/btn relative overflow-hidden p-6 border-2 cursor-pointer rounded-xl transition-all duration-300 text-center ${
                    formData.budget === b.value
                      ? "border-emerald-500 shadow-xl bg-emerald-50"
                      : "border-gray-200 bg-white/60 hover:border-emerald-400 hover:shadow-xl"
                  }`}
                >
                  <div className="relative">
                    <div className="text-3xl mb-2">{b.icon}</div>
                    <div
                      className={`font-bold ${
                        formData.budget === b.value
                          ? "text-emerald-600"
                          : "text-black"
                      }`}
                    >
                      {b.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Companions */}
      <div className="group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative bg-white/70 backdrop-blur-lg p-8 rounded-2xl border border-white/50 shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg">
                👥
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Travel companions
                </h2>
                <p className="text-gray-600">
                  Who's joining you on this journey?
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {travelCompanion.map((c) => (
                <button
                  key={c.value}
                  onClick={() => handleInputChange("companion", c.value)}
                  className={`group/btn relative overflow-hidden p-5 border-2 cursor-pointer rounded-xl transition-all duration-300 text-center ${
                    formData.companion === c.value
                      ? "border-orange-500 shadow-xl bg-orange-50"
                      : "border-gray-200 bg-white/60 hover:border-orange-400 hover:shadow-xl"
                  }`}
                >
                  <div className="relative">
                    <div className="text-4xl mb-3">{c.icon}</div>
                    <div
                      className={`font-bold ${
                        formData.companion === c.value
                          ? "text-orange-600"
                          : "text-black"
                      }`}
                    >
                      {c.label}
                    </div>
                    <div className="text-xs text-black mt-1">{c.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <button
          disabled={loading}
          onClick={onGenerateTrip}
          className="group relative w-full overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 px-3 rounded-3xl transition-all cursor-pointer duration-500 shadow-2xl hover:shadow-3xl hover:scale-[1] text-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative flex items-center justify-center gap-3">
            {loading ? (
              <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
            ) : (
              <span>✨ Generate My Dream Trip</span>
            )}
            <svg
              className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7l5 5-5 5M6 12h12"
              ></path>
            </svg>
          </div>
        </button>
       <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                 <DialogContent className="rounded-2xl shadow-2xl bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
                   <DialogHeader>
                     <DialogDescription>
                       <div className="flex flex-col items-center text-center">
                         <img src="/logo.svg" className="h-12 w-auto mb-4" />
                         <h2 className="font-bold text-lg text-gray-800">
                           Welcome to AI Travel Planner!
                         </h2>
                         <p className="text-sm text-gray-600 mt-1">
                           Sign in securely with Google
                         </p>
       
                         <button
                           onClick={login}
                           className="mt-5 cursor-pointer w-full rounded-full h-12 flex items-center justify-center gap-3 text-gray-700 bg-black shadow-md hover:shadow-lg active:scale-95 transition-all"
                         >
                           <FcGoogle className="h-7 w-7" />
                           <span className=" text-lg text-white font-medium">
                             Sign In With Google
                           </span>
                         </button>
                       </div>
                     </DialogDescription>
                   </DialogHeader>
                 </DialogContent>
               </Dialog>

        <p className="text-center text-gray-500 mt-4 text-sm">
          🔒 Your data is secure • ⚡ Results in seconds • 🎯 Personalized just
          for you
        </p>
      </div>
    </div>
  );
}
