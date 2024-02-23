import React, { useState } from "react";
import firebase from "firebase/compat/app";

const CompleteProfile = () => {
  const [fullName, setFullName] = useState("");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [error, setError] = useState("");

  const handleUpdate = async () => {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        await user.updateProfile({
          displayName: fullName,
          photoURL: profilePhotoUrl,
        });
        alert("User details updated successfully");
      } else {
        setError("User not found");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Contact Details</h2>
      <div>
        <label>Full Name: </label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div>
        <label>Profile Photo Url: </label>
        <input
          type="text"
          value={profilePhotoUrl}
          onChange={(e) => setProfilePhotoUrl(e.target.value)}
        />
      </div>
      <button onClick={handleUpdate}>Update</button>
      {error && <div className="error-message">{error}</div>}
      <button>Cancel</button>
    </div>
  );
};

export default CompleteProfile;
