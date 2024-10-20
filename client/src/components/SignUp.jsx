// import React, { useState } from "react";
// import Alert from "./Alert";

// export default function SignUp({ setSignIn }) {
//   const [signUpData, setSignUpData] = useState({
//     username: "",
//     email: "",
//     password: "",
//     confirm_password: "",
//   });
//   const [errMsg, setErrMsg] = useState("");
//   const [successMsg, setSuccessMsg] = useState(""); // State to hold success message
//   const [loading, setLoading] = useState(false);

//   //   async function handleSubmit(e) {
//   //     e.preventDefault();
//   //     setErrMsg("");

//   //     const url = "http://localhost:9092/crossOriginService/signup"; // Call the 'signup' endpoint
//   //     setLoading(true);

//   //     try {
//   //       const res = await fetch(url, {
//   //         method: "POST",
//   //         headers: {
//   //           "Content-Type": "application/json",
//   //         },
//   //         body: JSON.stringify(signUpData),
//   //       });

//   //       const data = await res.json();
//   //       if (res.ok) {
//   //         setSignUpData({
//   //           username: "",
//   //           email: "",
//   //           password: "",
//   //           confirm_password: ""
//   //         });
//   //         setSuccessMsg("Sign-in successful!");
//   //  // Go to sign-in page after successful sign-up
//   //       } else {
//   //         setErrMsg("Sign-up failed");
//   //       }
//   //     } catch (error) {
//   //       setErrMsg("An error occurred during sign-up");
//   //       console.error("Error during sign-up:", error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setErrMsg("");
//     setSuccessMsg("");

//     const url = "http://localhost:9100/crossOriginService/signup"; // Call the 'signup' endpoint
//     setLoading(true);

//     try {
//       const res = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(signUpData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         if (data.error) {
//           setErrMsg(data.error); // Handle the "Username already exists" error
//         } else {
//           setSignUpData({
//             username: "",
//             email: "",
//             password: "",
//             confirm_password: "",
//           });
//           setSuccessMsg("Sign-up successful!");
//           // Optionally, navigate to the sign-in page after successful sign-up
//         }
//       } else {
//         setErrMsg("Sign-up failed");
//       }
//     } catch (error) {
//       setErrMsg("An error occurred during sign-up");
//       console.error("Error during sign-up:", error);
//     } finally {
//       setLoading(false);
//     }
//   }
//   return (
//     <div className="flex-col justify-between items-center max-w-5xl mx-auto p-3 text-center mt-20 mb-28">
//       <h1 className="font-bold text-5xl mb-5">Sign Up</h1>
//       {successMsg && <Alert type="success" message={successMsg} />}{" "}
//       {/* Display success message */}
//       {errMsg && <Alert type="error" message={errMsg} />}{" "}
//       {/* Display error message */}
//       <form className="flex flex-col p-3 items-center" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={signUpData.username}
//           onChange={(e) =>
//             setSignUpData({ ...signUpData, username: e.target.value })
//           }
//           className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           value={signUpData.email}
//           onChange={(e) =>
//             setSignUpData({ ...signUpData, email: e.target.value })
//           }
//           className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={signUpData.password}
//           onChange={(e) =>
//             setSignUpData({ ...signUpData, password: e.target.value })
//           }
//           className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
//         />
//         <input
//           type="password"
//           placeholder="Confirm Password"
//           value={signUpData.confirm_password}
//           onChange={(e) =>
//             setSignUpData({ ...signUpData, confirm_password: e.target.value })
//           }
//           className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
//         />
//         <button
//           type="submit"
//           className="bg-yellow-500 rounded-3xl w-full max-w-xl text-white p-2 m-3"
//           disabled={loading}
//         >
//           {loading ? "Signing Up..." : "SIGN UP"}
//         </button>
//       </form>
//       {errMsg && <p className="text-red-500">{errMsg}</p>}
//       <p className="font-bold">
//         Already have an account?
//         <span
//           className="text-blue-600 mx-3 cursor-pointer"
//           onClick={() => setSignIn(true)}
//         >
//           Sign In
//         </span>
//       </p>
//     </div>
//   );
// }



import React, { useState } from "react";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function SignUp({ setSignIn, setUser }) {
  const [signUpData, setSignUpData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    user_image_url:"default",

  });
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // State to hold success message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function setCookie() {
    // Cookie options
    const cookieName = "username"; // Name of the cookie
    const cookieValue = signUpData.username; // Replace with actual token value from sign-in response
    const expirationDays = 7; // Set cookie to expire in 7 days
  
    // Calculate the expiration date
    const date = new Date();
    date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000); // Days to milliseconds
    const expires = "expires=" + date.toUTCString();
  
    // Set the cookie with the name, value, and expiration
    document.cookie = `${cookieName}=${cookieValue};${expires};path=/;SameSite=Lax;Secure`;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setSuccessMsg("");
    if (signUpData.confirm_password != signUpData.password) {
      setErrMsg("Both password are not mach!");
    }
    const url = "http://localhost:9100/crossOriginService/signup"; // Call the 'signup' endpoint
    setLoading(true);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signUpData),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.error) {
          setErrMsg(data.error); // Handle the "Username already exists" error
        } else {
          setSignUpData({
            username: "",
            email: "",
            password: "",
            confirm_password: "",
          });
          setSuccessMsg("Sign-up successful!");
          await setCookie(); // Set the cookie on successful sign-in
        setUser(true);
        // Wait for 1 second before navigating to the home page
        setTimeout(() => {
          navigate("/"); // Navigate to home after 1 second
        }, 1000);
          // Optionally, navigate to the sign-in page after successful sign-up
        }
      } else {
        setErrMsg("Sign-up failed");
      }
    } catch (error) {
      setErrMsg("An error occurred during sign-up");
      console.error("Error during sign-up:", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="flex-col justify-between items-center max-w-5xl mx-auto p-3 text-center mt-20 mb-28">
      <h1 className="font-bold text-5xl mb-5">Sign Up</h1>
      {successMsg && <Alert type="success" message={successMsg} />}{" "}
      {/* Display success message */}
      {errMsg && <Alert type="error" message={errMsg} />}{" "}
      {/* Display error message */}
      <form className="flex flex-col p-3 items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={signUpData.username}
          onChange={(e) =>
            setSignUpData({ ...signUpData, username: e.target.value })
          }
          className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
        />
        <input
          type="email"
          placeholder="Email"
          value={signUpData.email}
          onChange={(e) =>
            setSignUpData({ ...signUpData, email: e.target.value })
          }
          className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={signUpData.password}
          onChange={(e) =>
            setSignUpData({ ...signUpData, password: e.target.value })
          }
          className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={signUpData.confirm_password}
          onChange={(e) =>
            setSignUpData({ ...signUpData, confirm_password: e.target.value })
          }
          className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
        />
        <button
          type="submit"
          className="bg-yellow-500 rounded-3xl w-full max-w-xl text-white p-2 m-3"
          disabled={loading}
        >
          {loading ? "Signing Up..." : "SIGN UP"}
        </button>
      </form>
      {errMsg && <p className="text-red-500">{errMsg}</p>}
      <p className="font-bold">
        Already have an account?
        <span
          className="text-blue-600 mx-3 cursor-pointer"
          onClick={() => setSignIn(false)}
        >
          Sign In
        </span>
      </p>
    </div>
  );
}
