import { useState, useEffect } from "react"; // Add useEffect
import { useNavigate, useSearchParams } from "react-router-dom"; // Add useSearchParams
import { toast } from "react-toastify";
import axios from "axios";

const Verify = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // Hook to read URL query parameters

  useEffect(() => {
    // Attempt to pre-fill email from URL query parameter
    const emailFromUrl = searchParams.get('email');
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
    // You could also add logic here to redirect if a user is already logged in and verified.
  }, [searchParams]); // Depend on searchParams to re-run if URL query changes

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Please provide both email and verification code.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const { data } = await axios.post("/api/v1/users/verify", {
        email,
        code: otp,
      });

      toast.success(data.message || "Email verified successfully!");
      
      // ✅ CRITICAL CHANGE: Redirect to homepage because the user is now logged in by the backend
      navigate("/"); // Redirect to your homepage
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || "Verification failed. Try again."
      );
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded shadow-md w-[400px]">
        <h1 className="text-2xl font-bold mb-4 text-white">Verify Your Email</h1>
        <p className="text-gray-300 mb-4 text-sm">
          A verification code has been sent to your email. Please enter it below to activate your account.
        </p>
        <form onSubmit={handleVerify}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full p-2 border rounded text-gray-900" // Added text-gray-900 for visibility
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!!email} // Make it read-only if email is pre-filled
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-white mb-1">
              Verification Code
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded text-gray-900" // Added text-gray-900
              placeholder="Enter verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6" // OTPs are usually 6 digits
              pattern="\d{6}" // Ensures only 6 digits are entered
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-600 disabled:opacity-50"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;