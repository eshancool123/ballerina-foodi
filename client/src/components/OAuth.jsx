import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function OAuth() {
  const navigate = useNavigate(); // Hook should be called at the top level

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider(); // Correct usage
      const auth = getAuth(app);

      // Sign in with a popup window
      const result = await signInWithPopup(auth, provider);
      console.log('User signed in: ', result.user);

      // Navigate to the home page after successful sign-in
      navigate('/'); 

    } catch (error) {
      console.log('Could not sign in with Google:', error);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'
      className="bg-red-500 rounded-3xl w-full max-w-xl text-white p-2 m-3"
    >
      Continue with Google
    </button>
  );
}
