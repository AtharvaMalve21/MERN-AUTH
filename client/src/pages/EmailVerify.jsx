import React, { useContext } from 'react'
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { assets } from "../assets/assets.js"

const EmailVerify = () => {

  const inputRefs = React.useRef([]);

  const { setUser } = useContext(UserContext);

  const URI = import.meta.env.VITE_BACKEND_URI;

  const navigate = useNavigate();

  const verifyAccount = async (ev) => {
    try {

      ev.preventDefault();

      const otpArray = inputRefs.current.map(e => e.value);

      const otp = otpArray.join('');

      const { data } = await axios.post(URI + '/api/v1/auth/verify-account', { otp },
        {
          headers: {
            "Content-Type": "application/json"
          },
          withCredentials: true
        }
      );
      if (data.success) {
        setUser(data.data);
        toast.success(data.message);
        navigate("/");
      }

    } catch (err) {
      toast.error(err.response.data.message)
    }
  }

  const resendOTP = async () => {
    try {

      const { data } = await axios.get(URI + "/api/v1/auth/send-verify-otp", { withCredentials: true });

      if (data.success) {
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.response.data.message)
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

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400'>
      <img className='absolute left-5 sm:left-20 top-5 w-28sm:w-32 cursor-pointer' src={assets.logo} onClick={() => navigate("/")} alt="" />
      <form className='bg-slate-900 p-8 rounded-lg w-96 text-sm' onSubmit={verifyAccount}>
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
        <p className='float-right mb-8 cursor-pointer hover:underline active:text-red-900 text-purple-800 text-xs' onClick={resendOTP}>Resend OTP ?</p>
        <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full' type='submit'>Verify Email</button>
      </form>
    </div>
  )
}

export default EmailVerify
