import React, { useState } from "react";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";

// eslint-disable-next-line react/prop-types
export default function Register({setUser}) {
  const [signIn, setSignIn] = useState(false);

  return <div>{signIn ? <SignUp setSignIn={setSignIn} setUser={setUser}/>:<SignIn setSignIn={setSignIn} setUser={setUser}/> }</div>;
}
     

// import React, { useState } from "react";
// import SignIn from "../components/SignIn";
// import SignUp from "../components/SignUp";

// export default function Register() {
//   const [signIn, setSignIn] = useState(false);

//   return <div>{signIn ? <SignIn setSignIn={setSignIn}/> : <SignUp setSignIn={setSignIn}/>}</div>;
// }
