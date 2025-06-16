import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OtpPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('OTP verified successfully!');
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-richblack-900 via-richblack-800 to-richblack-900 p-6">
      <div className="bg-white rounded-3xl max-w-md w-full p-10 shadow-xl border-2 border-black">
        <h2 className="text-black font-extrabold text-4xl mb-5 text-center tracking-wide">
          Verify OTP
        </h2>
        <p className="text-black mb-8 text-center text-lg">
          Enter the OTP sent to <strong className="underline">{email}</strong>
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            inputMode="numeric"
            pattern="\d{6}"
            className="w-full rounded-xl bg-white text-black text-2xl font-semibold px-6 py-4 placeholder-gray-400 border-2 border-black
              focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-70 transition duration-300 ease-in-out"
          />
          {error && (
            <p className="text-red-600 text-center font-semibold animate-shake">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-semibold text-white text-xl tracking-wide transition 
              ${loading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>

      {/* Extra CSS for shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default OtpPage;
