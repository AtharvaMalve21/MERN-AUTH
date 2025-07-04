import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets.js"

const ResetPassword = () => {

  const inputRefs = React.useRef([]);

  const [email, setEmail] = useState('');

  const [otp, setOtp] = useState('');

  const [newPassword, setNewPassword] = useState('');

  const URI = import.meta.env.VITE_BACKEND_URI;

  const navigate = useNavigate();

  //create some state variables to display the forms

  const [isEmailSent, setIsEmailSent] = useState(false);

  const [isOtpSent, setIsOtpSent] = useState(false);


  const forgotPassword = async (ev) => {
    try {

      ev.preventDefault();
      const { data } = await axios.post(URI + "/api/v1/auth/forgot-password", { email }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      }

    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  const handleInput = (ev, index) => {
    if (ev.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (ev, index) => {
    if (ev.key === 'Backspace' && ev.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (ev) => {
    const paste = ev.clipboardData.getData('text');
    const pasteArray = paste.split('');
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char
      }
    })
  }

  const onSubmitOTP = (ev) => {
    ev.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSent(true)
  }


  const resetPassword = async (ev) => {
    try {
      ev.preventDefault();
      const { data } = await axios.post(URI + "/api/v1/auth/reset-password", { email, otp, newPassword }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img className='absolute left-5 sm:left-20 top-5 w-28sm:w-32 cursor-pointer' src={assets.logo} onClick={() => navigate("/")} alt="" />


      {/* Email  */}
      {
        !isEmailSent && <form className='bg-slate-900 p-8 rounded-lg w-96 text-sm' onSubmit={forgotPassword}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your registered email address</p>
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input type="email" placeholder='Email id' value={email} onChange={(ev) => setEmail(ev.target.value)} className='bg-transparent outline-none text-white' />
          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full' type='submit'>Submit</button>
        </form>
      }

      {/* OTP Input Form  */}
      {
        !isOtpSent && isEmailSent && <form onSubmit={onSubmitOTP} className='bg-slate-900 p-8 rounded-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Email Verify OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the 6-digit code sent to your email id</p>
          <div className='flex justify-between mb-2' onPaste={handlePaste}>
            {
              Array(6).fill(0).map((_, index) => (
                <input ref={e => inputRefs.current[index] = e}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' type="text" maxLength={'1'} key={index} />
              ))
            }
          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full' type='submit'>Submit</button>
        </form>
      }

      {/* Reset Password Form  */}
      {
        isEmailSent && isOtpSent && <form className='bg-slate-900 p-8 rounded-lg w-96 text-sm' onSubmit={resetPassword}>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter the new password below</p>
          <div className='flex mb-6 items-center gap-3 w-full px-5 py-3 rounded-full bg-[#2f3650] focus-within:ring-2 ring-indigo-500 transition-all'>
            <img src={assets.lock_icon} alt="Lock Icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className='bg-transparent outline-none w-full placeholder-indigo-400 text-white'
              name='password'
              value={newPassword}
              onChange={(ev) => setNewPassword(ev.target.value)}
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
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full' type='submit'>Submit</button>
        </form>
      }

    </div>
  )
}

export default ResetPassword
