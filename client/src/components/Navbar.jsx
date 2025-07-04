import React, { useContext, useState, useRef, useEffect } from 'react';
import { assets } from "../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.jsx";
import {
    CheckCircleIcon,
    ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

import axios from "axios";
import { toast } from "react-hot-toast";


const Navbar = () => {
    const { user, setUser, setIsLoggedIn } = useContext(UserContext);
    const [dropDown, setDropDown] = useState(false);
    const dropdownRef = useRef();

    const toggleDropDown = () => setDropDown(prev => !prev);

    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropDown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const URI = import.meta.env.VITE_BACKEND_URI;


    const logout = async () => {
        try {

            const { data } = await axios.get(URI + "/api/v1/auth/logout", { withCredentials: true });

            if (data.success) {
                setUser(null);
                setIsLoggedIn(false);
                toast.success(data.message);
            }

        } catch (err) {
            toast.error(err.response.data.message)
        }
    }

    const sendVerifyEmailOTP = async () => {
        try {

            const { data } = await axios.get(URI + "/api/v1/auth/send-verify-otp", { withCredentials: true });

            if (data.success) {
                toast.success(data.message);
                setTimeout(() => {
                    navigate("/email-verify")
                }, 1000)
            }
        } catch (err) {
            toast.error(err.response.data.message)
        }
    }

    return (
        <div className="w-full flex justify-between items-center px-6 sm:px-24 py-4 fixed top-0 left-0 z-50 bg-white shadow-md">
            {/* Logo */}
            <Link to="/">
                <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />
            </Link>

            {/* Right Side */}
            {user ? (
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={toggleDropDown}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 text-white font-semibold text-lg shadow-md hover:scale-105 transition-transform duration-200"
                    >
                        {user?.name?.charAt(0).toUpperCase()}
                    </button>

                    {dropDown && (
                        <div className="absolute right-0 mt-3 w-56 bg-gradient-to-br from-white to-blue-50 border border-gray-200 rounded-lg shadow-2xl py-2 animate-fade-in text-sm space-y-1 z-50">
                            {
                                !user?.isAccountVerified && <button onClick={sendVerifyEmailOTP} className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all rounded-md">
                                    <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                                    Verify Email
                                </button>
                            }
                            <button onClick={logout} className="flex items-center gap-3 w-full text-left px-4 py-2 text-gray-800 hover:bg-red-100 hover:text-red-600 transition-all rounded-md">
                                <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-500" />
                                Logout
                            </button>
                        </div>

                    )}
                </div>
            ) : (
                <Link
                    to="/login"
                    className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2 text-gray-800 hover:bg-gray-100 transition-all shadow-sm"
                >
                    Login
                    <img src={assets.arrow_icon} alt="Arrow" className="w-4 h-4" />
                </Link>
            )}
        </div>
    );
};

export default Navbar;
