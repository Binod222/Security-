// import { Outlet } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Navigation from "./pages/Auth/Navigation";

// const App = () => {
//   return (
//     <>
//       <ToastContainer />
//       <Navigation />
//       <main className="py-3">
//         <Outlet />
//       </main>
//     </>
//   );
// };

// export default App;


// import { Outlet } from "react-router-dom";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Navigation from "./pages/Auth/Navigation";

// import { useDispatch } from "react-redux";
// import { useProfileQuery } from "./api/users";
// import { setCredentials } from "./features/auth/authSlice";
// import { useEffect } from "react";

// const App = () => {
//   const dispatch = useDispatch();
//   const { data, isError } = useProfileQuery();

//   useEffect(() => {
//     if (data) {
//       dispatch(setCredentials(data));
//     }
//   }, [data, dispatch]);

//   return (
//     <>
//       <ToastContainer />
//       <Navigation />
//       <main className="py-3">
//         <Outlet />
//       </main>
//     </>
//   );
// };

// export default App;


import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navigation from "./pages/Auth/Navigation";

import { useDispatch } from "react-redux";
import { useGetProfileQuery } from "./redux/api/users";  // Import profile query hook
import { setCredentials } from "./redux/features/auth/authSlice";
import { useEffect } from "react";

const App = () => {
  const dispatch = useDispatch();
  const { data, error, isLoading } = useGetProfileQuery();

  useEffect(() => {
    if (data) {
      // Update redux auth state with user profile data
      dispatch(setCredentials(data));
    }
  }, [data, dispatch]);

  // Optional: You can handle loading or error states here if you want

  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="py-3">
        <Outlet />
      </main>
    </>
  );
};

export default App;
