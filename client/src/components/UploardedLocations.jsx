import React from 'react';

// eslint-disable-next-line react/prop-types
export default function UploardedLocations({ image, name, uid, setSuccessMsg, setErrMsg, refreshLocations }) {
  const deleetFunc = async () => {
    console.log("Id:" + uid)
    setErrMsg("");
    setSuccessMsg("");
    const url = "http://localhost:9100/crossOriginService/deleteLocation";

    const requestBody = { id: uid };

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
        setSuccessMsg(typeof data === "string" ? data : "Location deleted successfully!");
        refreshLocations(); // Call this function to trigger a refresh
      } else {
        setErrMsg("Delete failed: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      setErrMsg("An error occurred during location deletion");
      console.error("Error during location deletion:", error);
    }
  }

  return (
    <div className='flex justify-between items-center w-full max-w-6xl mx-auto bg-slate-200 p-2 rounded-lg mb-2'>
      <img src={image} alt={name} className='w-32 h-24 rounded-3xl hidden sm:inline p-2 m-0' />
      <h1 className='flex-1 text-center font-bold'>{name}</h1>
      <button 
        className='text-red-500 p-2 rounded-lg mx-1 font-bold'
        onClick={deleetFunc}
      >
        Delete
      </button>
    </div>
  );
}
