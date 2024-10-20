import React, { useCallback, useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import demouser from "../Asserts/demouser.png";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import UploardedLocations from "../components/UploardedLocations";
import ScrollIndicator from "../components/ScollIndicator";

// eslint-disable-next-line react/prop-types
export default function Profile({ setUser }) {

  const [countOne, setcountOne] = useState(4);
  const [countTwo, setcountTwo] = useState(4);

  const [displayLocations, setDisplayLocations] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(demouser);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const fileRef = useRef(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshLocations = () => {
  setRefreshTrigger(prev => prev + 1);
};

  const [UpdateData, setUpdateData] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "111",
    user_image: "default",
  });

  const handleFileChange = useCallback((e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsUploadComplete(false);
    }
  }, []);

  const uploadFileToFirebase = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve("default");  // Return "default" if no file is selected
        return;
      }

      const storage = getStorage();
      const storageRef = ref(storage, `profile_images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(Math.round(progress));
        },
        (error) => {
          console.error("File upload error:", error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setAvatarUrl(downloadURL);
            setIsUploadComplete(true);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
}, [file]);

  const deleteCookie = () => {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUser(true);
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setUpdateData({ ...UpdateData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
        // First upload the file to Firebase if there is one
        const imageUrl = await uploadFileToFirebase();
        
        // Update the data object with the new image URL
        const updatedData = {
            ...UpdateData,
            user_image_url: imageUrl || "default"  // Use default if no URL is returned
        };

        const url = "http://localhost:9100/crossOriginService/updateUser";
        const res = await fetch(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        });

        const data = await res.json();
        if (res.ok) {
            setUpdateData({
                username: "",
                email: "",
                password: "",
                confirm_password: "111",
                user_image_url: "default",
            });
            setSuccessMsg("Profile updated successfully!");
            setFile(null);
            setFileUploadProgress(0);
        } else {
            setErrMsg("Update failed: " + (data.message || "Unknown error"));
        }
    } catch (error) {
        setErrMsg("An error occurred during profile update");
        console.error("Error during profile update:", error);
    } finally {
        setLoading(false);
    }
}

  const checkUserCookie = () => {
    const cookie = document.cookie
      .split(";")
      .find((item) => item.trim().startsWith("username="));
    return cookie ? cookie.split("=")[1] : null;
  };

  async function DeleetAccount(e) {
    e.preventDefault();
    setErrMsg("");
    setSuccessMsg("");
    const url = "http://localhost:9100/crossOriginService/deleteUser";
    setLoading(true);
  
    const username = checkUserCookie();
  
    if (!username) {
      setErrMsg("No user logged in to delete.");
      setLoading(false);
      return;
    }
  
    const requestBody = { username };
  
    try {
      const res = await fetch(url, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
  
      const contentType = res.headers.get("Content-Type");
  
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }
  
      if (res.ok) {
        setUpdateData({
          username: "",
          email: "",
          password: "",
          confirm_password: "111",
          user_image_url: "default",
        });
        setSuccessMsg(typeof data === "string" ? data : "Profile deleted successfully!");
      } else {
        setErrMsg("Delete failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      setErrMsg("An error occurred during profile deletion");
      console.error("Error during profile deletion:", error);
    } finally {
      setLoading(false);
      deleteCookie();
    }
  }

  useEffect(() => {
    const username = checkUserCookie();
    console.log("Fetching data for cookie:", username);

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:9100/crossOriginService/location');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();

        console.log('Fetched data:', jsonData);

        const filteredData = jsonData.filter(item => item.user === username);
        if (filteredData.length > 0) {
          setData(filteredData);
        } else {
          console.log("Available users:", jsonData.map(item => item.user));
          setError('No data found for the username: ' + username);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchData();
    } else {
      setError('No username cookie found');
    }
  }, [refreshTrigger]);

  return (
    <div className="flex-col justify-between items-center max-w-5xl mx-auto p-3 text-center my-10">
      <h1 className="font-bold text-5xl mb-5">Profile</h1>

      <input
        onChange={handleFileChange}
        type="file"
        ref={fileRef}
        hidden
        accept="image/*"
      />
      <div className="flex justify-center items-center h-full">
        <img
          onClick={() => fileRef.current.click()}
          src={avatarUrl}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer mt-2"
        />
        {fileUploadProgress > 0 && (
          <div className="w-full max-w-xl my-2">
            <p>Upload progress: {fileUploadProgress}%</p>
          </div>
        )}
      </div>

      {errMsg && <p className="text-red-500">{errMsg}</p>}
      {successMsg && <p className="text-green-500">{successMsg}</p>}

      <form className="flex flex-col p-3 items-center" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={UpdateData.username}
          onChange={handleInputChange}
          className="bg-slate-300   focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
        />
        <input
          type="email"
          name="email"
          placeholder="Update E-Mail"
          value={UpdateData.email}
          onChange={handleInputChange}
          className="bg-slate-300   focus:outline-none  w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
        />
        <input
          type="password"
          name="password"
          placeholder="Update Password"
          value={UpdateData.password}
          onChange={handleInputChange}
          className="bg-slate-300   focus:outline-none w-full max-w-xl p-2 m-3 rounded-3xl placeholder:text-lg"
        />
        <button
          type="submit"
          className="bg-yellow-500 rounded-3xl w-full max-w-xl text-white p-2 m-3"
          disabled={loading}
        >
          {loading ? "Updating..." : "UPDATE"}
        </button>
      </form>

      <div className="flex flex-col items-center w-full max-w-xl mx-auto">
        <Link
          to={"/addlocation"}
          className="bg-orange-500 rounded-3xl w-full text-white p-2 m-3"
        >
          Add Location
        </Link>

        <div className="sm:flex justify-between items-center w-full">
          <p className="cursor-pointer" onClick={DeleetAccount}>Delete Account</p>
          <p className="cursor-pointer" onClick={deleteCookie}>
            Sign Out
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center mt-5">
        <button
          className="text-slate-700 p-2 m-2"
          onClick={() => setDisplayLocations(!displayLocations)}
        >
          Your Locations
        </button>

        {displayLocations && (
          <div className="flex flex-col items-center mt-5 w-2/3">
            {data.map((location, index) => (
              <UploardedLocations 
                key={index}
                uid={location.uid}
                image={location.images[0]} 
                name={location.name} 
                setErrMsg={setErrMsg} 
                setSuccessMsg={setSuccessMsg}
                refreshLocations={refreshLocations}
              />
            ))}
          </div>
        )}
      </div>
      <ScrollIndicator />
    </div>
  );
}









