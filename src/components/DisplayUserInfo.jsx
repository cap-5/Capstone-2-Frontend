import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../shared"; // Update this to match your config

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    profilePicture: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/users/me`, {
          withCredentials: true,
        });

        const data = res.data.userInfo;

        setUser(data);
        setForm({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          email: data.email || "",
          profilePicture: data.profilePic || "",
        });
      } catch (err) {
        setError("Failed to load user info");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      const res = await axios.patch(
        `${API_URL}/api/users/${user.id}`,
        form,
        { withCredentials: true }
      );

      setUser(res.data.user);
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update user.");
    }
  };

  const handleCancel = () => {
    if (!user) return;

    setForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      profilePicture: user.profilePic || "",
    });
    setIsEditing(false);
  };

  if (loading) return <p>Loading user info...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>User Profile</h2>

      <div>
        <label>
          First Name:
          {isEditing ? (
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          ) : (
            <span> {user.firstName}</span>
          )}
        </label>
      </div>

      <div>
        <label>
          Last Name:
          {isEditing ? (
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          ) : (
            <span> {user.lastName}</span>
          )}
        </label>
      </div>

      <div>
        <label>
          Email:
          {isEditing ? (
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          ) : (
            <span> {user.email}</span>
          )}
        </label>
      </div>

      <div>
        <label>
          Profile Picture URL:
          {isEditing ? (
            <input
              name="profilePicture"
              value={form.profilePicture}
              onChange={handleChange}
            />
          ) : (
            <span> {user.profilePic}</span>
          )}
        </label>
      </div>

      {form.profilePicture && (
        <img
          src={form.profilePicture}
          alt="Profile Preview"
          style={{ maxWidth: 150, marginTop: "1rem" }}
        />
      )}

      <div style={{ marginTop: "1rem" }}>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Edit</button>
        ) : (
          <>
            <button onClick={handleSave} style={{ marginRight: 10 }}>
              Save
            </button>
            <button onClick={handleCancel}>Cancel</button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
