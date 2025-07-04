import React, { useContext, useState } from 'react'
import axios from "axios";
import { toast } from "react-hot-toast";
import { UserContext } from "../context/UserContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import { assets } from "../assets/assets.js";

const Register = () => {

    const { setIsLoggedIn } = useContext(UserContext);
    const URI = import.meta.env.VITE_BACKEND_URI;

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const toggleShowPassword = () => setShowPassword((prev) => !prev);

    const changeHandler = (ev) => {
        let { name, value } = ev.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const navigate = useNavigate();

    const register = async (ev) => {
        try {
            ev.preventDefault();
            const { data } = await axios.post(URI + "/api/v1/auth/register", formData, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            });

            if (data.success) {
                setIsLoggedIn(true);
                toast.success(data.message);
                navigate("/")
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        }
    };

    const sendResetPasswordOTP = () => toast.success("OTP is sent!");

    return (
        <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 relative' >
            <img src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' alt="Logo" />
            <div className='bg-slate-900 p-10 sm:p-12 rounded-3xl shadow-2xl w-full sm:w-96 text-indigo-300 text-sm'>
                <h2 className='text-3xl font-bold text-white text-center mb-2 tracking-tight'>Create Account</h2>
                <p className='text-center text-sm text-indigo-400 mb-6'>Start your journey with us</p>

                <form onSubmit={register} className='space-y-4'>

                    {/* Name */}
                    <div className='flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#2f3650] focus-within:ring-2 ring-indigo-500 transition-all'>
                        <img src={assets.person_icon} alt="Name Icon" />
                        <input
                            type="text"
                            placeholder='Full Name'
                            className='bg-transparent outline-none w-full placeholder-indigo-400 text-white'
                            name='name'
                            value={formData.name}
                            onChange={changeHandler}
                        />
                    </div>

                    {/* Email */}
                    <div className='flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#2f3650] focus-within:ring-2 ring-indigo-500 transition-all'>
                        <img src={assets.mail_icon} alt="Email Icon" />
                        <input
                            type="email"
                            placeholder='@example.com'
                            className='bg-transparent outline-none w-full placeholder-indigo-400 text-white'
                            name='email'
                            value={formData.email}
                            onChange={changeHandler}
                        />
                    </div>

                    {/* Password */}
                    <div className='flex items-center gap-3 w-full px-5 py-3 rounded-full bg-[#2f3650] focus-within:ring-2 ring-indigo-500 transition-all'>
                        <img src={assets.lock_icon} alt="Lock Icon" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className='bg-transparent outline-none w-full placeholder-indigo-400 text-white'
                            name='password'
                            value={formData.password}
                            onChange={changeHandler}
                        />
                        <span onClick={toggleShowPassword} className='text-purple-400 hover:text-purple-300 transition cursor-pointer'>
                            {
                                showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                )
                            }
                        </span>
                    </div>
                    <button
                        className='w-full py-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold hover:opacity-90 transition-all shadow-md'
                        type='submit'>
                        Sign up
                    </button>
                </form>

                <Link to="/login" className='text-center block text-xs mt-6 text-indigo-300 hover:text-indigo-200 transition'>
                    Already have an account? <span className='underline text-indigo-400'>Login here</span>
                </Link>
            </div>
        </div>
    )
};

export default Register;
