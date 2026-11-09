import { useEffect, useState } from "react";
import axios from "axios";

import { states, citiesByState } from "../data/indiaLocations";

function Profile({ user, profilePic, selectedAvatar }) {


  const profile = user || {};
  const displayName = profile.fullName || profile.name || profile.email || "Your account";
  const [isEditing, setIsEditing] = useState(false);
  
  const [newSkill, setNewSkill] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);

const [formData, setFormData] = useState({
  phone: profile.phone || "",
  countryCode: profile.countryCode || "+91",
  country: profile.country || "India",
  state: profile.state || "",
  city: profile.city || "",
  skills: profile.skills || [],
});



  useEffect(() => {
  setFormData({
    phone: profile.phone || "",
    countryCode: profile.countryCode || "+91",
    country: profile.country || "India",
    state: profile.state || "",
    city: profile.city || "",
    skills: profile.skills || [],
  });
}, [profile]);



  useEffect(() => {
    console.log("Profile edit state changed:", isEditing);
  }, [isEditing]);

  const handleEditToggle = () => {
    console.log("Edit Profile button clicked");
    setIsEditing((currentState) => !currentState);
  };
const handleSaveProfile = async () => {

  if (!/^\d{10}$/.test(formData.phone)) {

  return;
}

  try {
    await axios.put(
      `http://localhost:5000/api/auth/profile/${profile.email}`,
       {
         phone: formData.phone,
            countryCode: formData.countryCode,
             country: formData.country,
            state: formData.state,
     city: formData.city,
     skills: formData.skills,
}
    );

    setIsEditing(false);
  } catch (error) {
    console.error(error);
  }
};

const countryCodes = {
  India: "+91",
  "United States": "+1",
  "United Kingdom": "+44",
  Canada: "+1",
  Australia: "+61",
  Germany: "+49",
  Singapore: "+65",
  UAE: "+971",
};

const isProfileComplete =
  displayName &&
  formData.phone &&
  formData.country &&
  formData.state &&
  formData.city;


const fields = [
  ["Full name", displayName],
  ["Email address", profile.email || "Not provided"],
  ["Employee ID", profile.employeeId || "Not provided"],
  ["Department", profile.department || "Not provided"],
  ["Designation", profile.designation || "Not assigned"],
];

  return (
    <section className="profile-module">
      <div className="profile-module-hero">
        <div className="profile-module-avatar">{profilePic ? <img src={profilePic} alt="" /> : selectedAvatar}</div>
         
        <div className="profile-module-identity">
          <p className="workspace-eyebrow">YOUR PROFILE</p>
          <h2>{displayName}</h2>
          <p>{profile.designation || "OnboardX member"}</p>
          <div className="profile-module-progress"><span /></div>
        </div>

        <div className="profile-module-actions">
        <div
  style={{
    display: "flex",
    gap: "8px",
    alignItems: "center",
  }}
>

  <button
    className="edit-profile-btn"
    type="button"
    onClick={handleEditToggle}
  >
    {isEditing ? "Cancel" : "Edit Profile"}
  </button>

{isEditing && (
  <button
    className="edit-profile-btn"
    type="button"
    onClick={handleSaveProfile}
  >
    Save
  </button>
)}
        
        </div>
        
        </div>


      </div>

      <div className="profile-module-grid">
        <section className="profile-information-card">
  <h3>Personal information</h3>

  <div className="profile-information-list">

    <div className="profile-data-point">
      <span>Full Name</span>
      <strong>{displayName}</strong>
    </div>

    <div className="profile-data-point">
      <span>Email Address</span>
      <strong>{profile.email || "Not provided"}</strong>
    </div>

 <div className="profile-data-point">
  <span>Phone</span>

  {isEditing ? (
   <div
  style={{
    display: "flex",
    gap: "10px",
  }}
>
  <input
    type="text"
    value={formData.countryCode}
    readOnly
    style={{
      width: "80px",
      background: "#f8fafc",
      fontWeight: "600",
      textAlign: "center",
    }}
  />

  <input
    type="text"
    maxLength="10"
    placeholder="Enter phone number"
    value={formData.phone}
    onChange={(e) =>
      setFormData({
        ...formData,
        phone: e.target.value.replace(/\D/g, ""),
      })
    }
  />
</div>
  ) : (
    <strong>
  {formData.countryCode} {formData.phone || "Not provided"}
</strong>

  )}
</div>


<div className="profile-data-point">
  <span>Country</span>

  {isEditing ? (
    <select
      value={formData.country || "India"}
      onChange={(e) =>
        setFormData({
          ...formData,
          country: e.target.value,

          countryCode: countryCodes[e.target.value] || "+91",

        })
      }
    >
      <option value="India">India</option>
      <option value="United States">United States</option>
      <option value="United Kingdom">United Kingdom</option>
      <option value="Canada">Canada</option>
      <option value="Australia">Australia</option>
      <option value="Germany">Germany</option>
      <option value="Singapore">Singapore</option>
      <option value="UAE">UAE</option>
    </select>
  ) : (
    <strong>{formData.country || "India"}</strong>
  )}
</div>



<div className="profile-data-point">
  <span>State</span>

  {isEditing ? (
    <select
      value={formData.state || ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          state: e.target.value,
          city: "",

        })
      }
    >
      <option value="">Select State</option>

      {states.map((state) => (
        <option key={state} value={state}>
          {state}
        </option>
      ))}
    </select>
  ) : (
    <strong>{formData.state || "Not provided"}</strong>
  )}
</div>


<div className="profile-data-point">
  <span>City</span>

  {isEditing ? (
    <select
      value={formData.city || ""}
      onChange={(e) =>
        setFormData({
          ...formData,
          city: e.target.value,
        })
      }
    >
      <option value="">Select City</option>

      {(citiesByState[formData.state] || []).map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  ) : (
    <strong>{formData.city || "Not provided"}</strong>
  )}
</div>

</div>
</section>
        
        
        <section className="profile-information-card"><h3>Work information</h3><div className="profile-information-list">{fields.slice(4).map(([label, value]) => <div className="profile-data-point" key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>
       
        <section className="profile-information-card profile-skills-card">
  <h3>Skills and interests</h3>

<div className="profile-skill-list">
  {(formData.skills || []).map((skill) => (
    <span
      className="profile-skill"
      key={skill}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {skill}

      {isEditing && (
        <button
          type="button"
          onClick={() =>
            setFormData({
              ...formData,
              skills: formData.skills.filter(
                (s) => s !== skill
              ),
            })
          }
          style={{
            border: "none",
            background: "transparent",
            color: "#ef4444",
            cursor: "pointer",
            fontWeight: "700",
          }}
        >
          ✕
        </button>
      )}
    </span>
  ))}
</div>

  {isEditing && (
  <>
    <button
      type="button"
      className="edit-profile-btn"
      onClick={() => setShowSkillInput(!showSkillInput)}
      style={{ marginTop: "12px" }}
    >
      + Add Skill
    </button>

    {showSkillInput && (
  <div
    style={{
      marginTop: "15px",
      display: "flex",
      gap: "10px",
      alignItems: "center",
    }}
  >
    <input
      type="text"
      placeholder="Enter skill"
      value={newSkill}
      onChange={(e) => setNewSkill(e.target.value)}
      style={{
        flex: 1,
      }}
    />

   <button
  type="button"
  className="edit-profile-btn"
  onClick={() => {
    if (!newSkill.trim()) return;

    setFormData({
      ...formData,
      skills: [...formData.skills, newSkill.trim()],
    });

    setNewSkill("");
    setShowSkillInput(false);
  }}
>
  Add
</button>

  </div>
)}
  </>
)}

</section>
      </div>
    </section>
  );
}

export default Profile;