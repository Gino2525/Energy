import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BASE_URL from './config';
import { jwtDecode } from 'jwt-decode';
import './styles/UpdateProfileImage.css';

const UpdateProfileImage = () => {
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const decoded = jwtDecode(token);
      setUserId(decoded.user_id);

      axios
        .get(`${BASE_URL}/api/user/${decoded.user_id}/profile/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          if (res.data.profile_image) {
            const rawUrl = res.data.profile_image.startsWith('http')
              ? res.data.profile_image
              : `${BASE_URL}${res.data.profile_image}`;
            setProfileImageUrl(`${rawUrl}?${new Date().getTime()}`);
          } else {
            setProfileImageUrl(null);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch profile image', err);
        });
    }
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setMessage('Please select an image first.');
      return;
    }

    const formData = new FormData();
    formData.append('profile_image', image);

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.put(
        `${BASE_URL}/api/user/${userId}/update-image/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage(response.data.message || 'Image uploaded successfully.');

      if (response.data.profile_image) {
        const rawUrl = response.data.profile_image.startsWith('http')
          ? response.data.profile_image
          : `${BASE_URL}${response.data.profile_image}`;
        setProfileImageUrl(`${rawUrl}?${new Date().getTime()}`);
      }
    } catch (error) {
      console.error(error);
      setMessage('Failed to upload image.');
    }
  };

  return (
    <div className="update-image-container">
      <div className="profile-card">
        <h2 className="title">Update Profile Image</h2>

        {message && <div className="message">{message}</div>}

        {profileImageUrl && (
          <div className="image-preview">
            <img src={profileImageUrl} alt="Profile" className="profile-image" />
          </div>
        )}

        <form onSubmit={handleSubmit} className="upload-form">
          <input
            type="file"
            onChange={handleImageChange}
            className="file-input"
            accept="image/*"
          />
          <button type="submit" className="upload-btn">Upload</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileImage;
