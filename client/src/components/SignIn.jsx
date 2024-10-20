// import React, { useState } from "react";
// import Alert from "./Alert";
// import OAuth from "./OAuth";

// export default function SignIn({ setSignIn }) {
//   const [signInData, setSignInData] = useState({ username: "", password: "" });
//   const [errMsg, setErrMsg] = useState("");
//   const [successMsg, setSuccessMsg] = useState(""); // State to hold success message
//   const [loading, setLoading] = useState(false);


//   async function handleSubmit(e) {
//     e.preventDefault(); // Prevent default form submission
//     setErrMsg(""); // Reset error message on each submission
//     setSuccessMsg(""); // Reset success message

//     const url = "http://localhost:9100/crossOriginService/signin"; // Update to call 'signin' endpoint
//     setLoading(true); // Set loading to true when starting request

//     try {
//       const res = await fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(signInData),
//       });

//       const isAuthenticated = await res.json();
//       if (res.ok) {
//         if (isAuthenticated) {
//           // Handle successful response (authenticated)
//           setSignInData({
//             username: "",
//             password: "",
//           });
//           setSuccessMsg("Sign-in successful!"); // Set success message
//         } else {
//           setErrMsg("Invalid username or password"); // Authentication failed
//         }
//       } else {
//         setErrMsg("Sign-in failed");
//       }
//     } catch (error) {
//       setErrMsg("An error occurred during sign-in");
//       console.error("Error during sign-in:", error);
//     } finally {
//       setLoading(false); // Reset loading state
//     }
//   }

//   return (
//     <div className="flex-col justify-between items-center max-w-5xl mx-auto p-3 text-center mt-20 mb-28">
//       <h1 className="font-bold text-5xl mb-5">Sign In</h1>
//       {successMsg && <Alert type="success" message={successMsg} />} Display success message
//       {errMsg && <Alert type="error" message={errMsg} />} {/* Display error message */}

//       <form className="flex flex-col p-3 items-center" onSubmit={handleSubmit}>
//         <input
//           type="text"
//           placeholder="Username"
//           value={signInData.username}
//           onChange={(e) =>
//             setSignInData({ ...signInData, username: e.target.value })
//           }
//           className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={signInData.password}
//           onChange={(e) =>
//             setSignInData({ ...signInData, password: e.target.value })
//           }
//           className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
//         />
//         <button
//           type="submit"
//           className="bg-yellow-500 rounded-3xl w-full max-w-xl text-white p-2 m-3"
//           disabled={loading}
//         >
//           {loading ? "Signing In..." : "SIGN IN"}
//         </button>
//       </form>

//       <OAuth/>

//       <p className="font-bold">
//         Dont have an account?
//         <span
//           className="text-blue-600 mx-3 cursor-pointer"
//           onClick={() => setSignIn(false)}
//         >
//           Sign Up
//         </span>
//       </p>
//     </div>
//   );
// }





import React, { useState } from "react";
import Alert from "./Alert";
import { useNavigate } from "react-router-dom";

export default function SignIn({
  // eslint-disable-next-line react/prop-types
  setSignIn,
  // eslint-disable-next-line react/prop-types
  setUser,
}) {
  const [message, setMessage] = useState(""); // Single state for messages
  const [loading, setLoading] = useState(false);
  const [signInData, setSignInData] = useState({ username: "", password: "" });
  const navigate = useNavigate(); // Call useNavigate at the top level

  async function setCookie() {
    // Cookie options
    const cookieName = "username"; // Name of the cookie
    const cookieValue = signInData.username; // Replace with actual token value from sign-in response
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
    setMessage(""); // Reset message on each submission
    setLoading(true);

    const url = "http://localhost:9100/crossOriginService/signin";
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInData),
      });

      const isAuthenticated = await res.json();
      if (res.ok && isAuthenticated) {
        setMessage("Sign-in successful!");
        await setCookie(); // Set the cookie on successful sign-in
        setUser(true);
        // Wait for 1 second before navigating to the home page
        setTimeout(() => {
          navigate("/"); // Navigate to home after 1 second
        }, 1000);
      } else {
        setMessage("Invalid username or password");
      }
    } catch (error) {
      setMessage("An error occurred during sign-in");
      console.error("Error during sign-in:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-col justify-between items-center max-w-5xl mx-auto p-3 text-center mt-20 mb-28">
      <h1 className="font-bold text-5xl mb-5">Sign In</h1>
      {message && <Alert type={message.includes("success") ? "success" : "error"} message={message} />}
      <form className="flex flex-col p-3 items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={signInData.username}
          onChange={(e) =>
            setSignInData({ ...signInData, username: e.target.value })
          }
          className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={signInData.password}
          onChange={(e) =>
            setSignInData({ ...signInData, password: e.target.value })
          }
          className="bg-slate-300 focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
        />
        <button
          type="submit"
          className="bg-yellow-500 rounded-3xl w-full max-w-xl text-white p-2 m-3"
          disabled={loading}
        >
          {loading ? "Signing In..." : "SIGN IN"}
        </button>
      </form>
      <button className="bg-orange-500 rounded-3xl w-full max-w-xl text-white p-2 m-3">
        CONTINUE WITH GOOGLE
      </button>
      <p className="font-bold">
        Dont have an account?
        <span
          className="text-blue-600 mx-3 cursor-pointer"
          onClick={() => {setSignIn(true);console.log(true);}}
        >
          Sign Up
        </span>
      </p>
    </div>
  );
}
