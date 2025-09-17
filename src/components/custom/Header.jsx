import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { Menu, X } from "lucide-react"; // icons for hamburger & close
import axios from "axios";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";

const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        navigate("/");
      });
  };

  return (
    <header className="w-full  bg-white/10  backdrop-blur-xl shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="App Logo" className="h-9 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/my-trips">
                <button className="rounded-full cursor-pointer h-10 px-5 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-xl active:scale-95 transition-all">
                  My Trips
                </button>
              </Link>

              <Link to="/create-trip">
                <button className="rounded-full cursor-pointer h-10 px-5 py-1.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold shadow-md hover:shadow-xl active:scale-95 transition-all">
                  Create Trip
                </button>
              </Link>

              {/* User Profile */}
              <Popover>
                <PopoverTrigger>
                  <img
                    src={user?.picture}
                    alt="User Profile"
                    className="h-11 w-11 rounded-full border shadow-sm hover:scale-105 transition-transform duration-200 cursor-pointer"
                  />
                </PopoverTrigger>
                <PopoverContent className="w-78 p-4 mr-3 mt-3 rounded-xl shadow-xl bg-white/90 backdrop-blur-xl border">
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <img
                      src={user?.picture}
                      alt="User Avatar"
                      className="h-14 w-14 rounded-full border"
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-xl text-gray-800">
                        {user?.name || "User"}
                      </h3>
                      <p className="text-sm text-gray-600 break-all">
                        {user?.email}
                      </p>
                    </div>
                  </div>

                  <hr className="my-3 border-gray-200" />

                  <button
                    className="w-full py-2 cursor-pointer rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium hover:scale-[1.02] transition-all"
                    onClick={() => {
                      googleLogout();
                      localStorage.clear();
                      navigate("/");
                    }}
                  >
                    Log Out
                  </button>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <button
              className="rounded-full h-10 cursor-pointer px-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md hover:shadow-xl active:scale-95 transition-all"
              onClick={() => setOpenDialog(true)}
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex items-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-300 backdrop-blur-xl shadow-lg px-6 py-4 space-y-4">
          {user ? (
            <>
              <Link
                to="/my-trips"
                className="block text-gray-800 text-center font-medium hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Trips
              </Link>
              <Link
                to="/create-trip"
                className="block text-center text-gray-800 font-medium hover:text-indigo-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Trip
              </Link>
              <button
                className="w-full cursor-pointer py-2 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white font-medium hover:scale-[1.02] transition-all hover:text-black"
                onClick={() => {
                  googleLogout();
                  localStorage.clear();
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              className="w-full py-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium"
              onClick={() => {
                setOpenDialog(true);
                setMobileMenuOpen(false);
              }}
            >
              Sign In
            </button>
          )}
        </div>
      )}

      {/* Dialog */}
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
                  className="mt-5 w-full rounded-full h-12 flex items-center justify-center gap-3 bg-black shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  <FcGoogle className="h-7 w-7" />
                  <span className="text-lg cursor-pointer text-white font-medium">
                    Sign In With Google
                  </span>
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
