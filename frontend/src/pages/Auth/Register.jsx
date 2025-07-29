// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import Loader from "../../component/Loader";
// import { setCredentials } from "../../redux/features/auth/authSlice";
// import { useRegisterMutation } from "../../redux/api/users";
// import { toast } from "react-toastify";

// const Register = () => {
//   const [username, setUsername] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [passwordStrength, setPasswordStrength] = useState("");

//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [register, { isLoading }] = useRegisterMutation();

//   const { userInfo } = useSelector((state) => state.auth);

//   const { search } = useLocation();
//   const sp = new URLSearchParams(search);
//   const redirect = sp.get("redirect") || "/";

//   useEffect(() => {
//     if (userInfo) {
//       navigate(redirect);
//     }
//   }, [navigate, redirect, userInfo]);

//   const checkPasswordStrength = (pwd) => {
//     let strength = 0;
//     if (pwd.length >= 8) strength++;
//     if (/[A-Z]/.test(pwd)) strength++;
//     if (/[a-z]/.test(pwd)) strength++;
//     if (/[0-9]/.test(pwd)) strength++;
//     if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;

//     if (strength <= 2) {
//       setPasswordStrength("Weak");
//     } else if (strength === 3 || strength === 4) {
//       setPasswordStrength("Medium");
//     } else if (strength === 5) {
//       setPasswordStrength("Strong");
//     } else {
//       setPasswordStrength("");
//     }
//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       toast.error("Passwords do not match");
//     } else {
//       try {
//         const res = await register({ username, email, password }).unwrap();
//         dispatch(setCredentials({ ...res }));
//         navigate(redirect);
//         toast.success("User successfully registered.");
//       } catch (err) {
//         console.log(err);
//         toast.error(err.data.message || "Registration failed");
//       }
//     }
//   };

//   return (
//     <div className="pl-[10rem] flex flex-wrap">
//       <div className="mr-[4rem] mt-[5rem]">
//         <h1 className="text-2xl font-semibold mb-4">Register</h1>

//         <form onSubmit={submitHandler} className="container w-[40rem]">
//           <div className="my-[2rem]">
//             <label htmlFor="name" className="block text-sm font-medium text-white">
//               Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               className="mt-1 p-2 border rounded w-full"
//               placeholder="Enter Name"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </div>

//           <div className="my-[2rem]">
//             <label htmlFor="email" className="block text-sm font-medium text-white">
//               Email Address
//             </label>
//             <input
//               type="email"
//               id="email"
//               className="mt-1 p-2 border rounded w-full"
//               placeholder="Enter Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <div className="my-[2rem]">
//             <label htmlFor="password" className="block text-sm font-medium text-white">
//               Password
//             </label>
//             <input
//               type="password"
//               id="password"
//               className="mt-1 p-2 border rounded w-full"
//               placeholder="Enter Password"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 checkPasswordStrength(e.target.value);
//               }}
//             />
//             {password && (
//               <p className={`mt-1 text-sm ${
//                 passwordStrength === "Weak"
//                   ? "text-red-500"
//                   : passwordStrength === "Medium"
//                   ? "text-yellow-500"
//                   : "text-green-500"
//               }`}>
//                 Strength: {passwordStrength}
//               </p>
//             )}
//           </div>

//           <div className="my-[2rem]">
//             <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
//               Confirm Password
//             </label>
//             <input
//               type="password"
//               id="confirmPassword"
//               className="mt-1 p-2 border rounded w-full"
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//           </div>

//           <button
//             disabled={isLoading}
//             type="submit"
//             className="bg-teal-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
//           >
//             {isLoading ? "Registering..." : "Register"}
//           </button>

//           {isLoading && <Loader />}
//         </form>

//         <div className="mt-4">
//           <p className="text-white">
//             Already have an account?{" "}
//             <Link
//               to={redirect ? `/login?redirect=${redirect}` : "/login"}
//               className="text-teal-500 hover:underline"
//             >
//               Login
//             </Link>
//           </p>
//         </div>
//       </div>

//       <img
//         src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
//         alt=""
//         className="h-[65rem] w-[55%] xl:block md:hidden sm:hidden rounded-lg"
//       />
//     </div>
//   );
// };

// export default Register;


import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../component/Loader";
// import { setCredentials } from "../../redux/features/auth/authSlice"; // You can remove this import if it's only used for immediate login after register
import { useRegisterMutation } from "../../redux/api/users"; // Assuming this is your RTK Query hook
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    // This useEffect needs adjustment if you want unverified users not to be redirected immediately
    // If userInfo exists and they are already verified (and logged in), then redirect.
    // If userInfo exists but they are NOT verified, they should stay on the register page
    // or be specifically prompted to verify.
    // For now, let's assume if userInfo exists AND they are verified, redirect them.
    if (userInfo && userInfo.isVerified) { // Assuming userInfo might have an isVerified property
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const checkPasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength++;

    if (strength <= 2) {
      setPasswordStrength("Weak");
    } else if (strength === 3 || strength === 4) {
      setPasswordStrength("Medium");
    } else if (strength === 5) {
      setPasswordStrength("Strong");
    } else {
      setPasswordStrength("");
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();

        // ✅ IMPORTANT CHANGE: Do NOT set credentials here.
        // The user is not yet logged in; they need to verify their email first.
        // dispatch(setCredentials({ ...res })); // REMOVE OR COMMENT OUT THIS LINE

        toast.success(res.message); // This will show "Account created. A verification code has been sent to your email."

        // ✅ Navigate to the /verify page, passing the email as a query parameter
        navigate(`/verify?email=${encodeURIComponent(email)}`);

      } catch (err) {
        console.log(err);
        toast.error(err.data.message || "Registration failed");
      }
    }
  };

  return (
    <div className="pl-[10rem] flex flex-wrap">
      <div className="mr-[4rem] mt-[5rem]">
        <h1 className="text-2xl font-semibold mb-4">Register</h1>

        <form onSubmit={submitHandler} className="container w-[40rem]">
          <div className="my-[2rem]">
            <label htmlFor="name" className="block text-sm font-medium text-white">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="my-[2rem]">
            <label htmlFor="email" className="block text-sm font-medium text-white">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-[2rem]">
            <label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
            />
            {password && (
              <p className={`mt-1 text-sm ${
                  passwordStrength === "Weak"
                    ? "text-red-500"
                    : passwordStrength === "Medium"
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}>
                Strength: {passwordStrength}
              </p>
            )}
          </div>

          <div className="my-[2rem]">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 p-2 border rounded w-full"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="bg-teal-500 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>

          {isLoading && <Loader />}
        </form>

        <div className="mt-4">
          <p className="text-white">
            Already have an account?{" "}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : "/login"}
              className="text-teal-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      <img
        src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt=""
        className="h-[65rem] w-[55%] xl:block md:hidden sm:hidden rounded-lg"
      />
    </div>
  );
};

export default Register;