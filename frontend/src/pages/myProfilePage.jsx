import React, { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [houseInfo, setHouseInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        console.log("Current user:", user);
        
        if (!user) {
          console.log("No user found, redirecting to login");
          setError("No user logged in");
          return;
        }
        
        const token = await user.getIdToken();
        console.log("Got token:", token ? "Token exists" : "No token");
        
        // Fetch profile data
        const profileRes = await fetch("http://localhost:5001/api/profile/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Profile API response status:", profileRes.status);
        
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          console.log("Profile data:", profileData);
          setProfile(profileData);
          
          // If user has a house, fetch house details
          if (profileData.house_id) {
            await fetchHouseInfo(token, profileData.house_id);
          }
        } else {
          const errorData = await profileRes.json();
          console.error("Profile API error:", errorData);
          setError(`Failed to load profile: ${errorData.message}`);
        }
      } catch (err) {
        console.error("Error in useEffect:", err);
        setError(`Error: ${err.message}`);
      }
    })();
  }, []);

  const fetchHouseInfo = async (token, houseId) => {
    try {
      const houseRes = await fetch(`http://localhost:5001/api/houses/${houseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (houseRes.ok) {
        const houseData = await houseRes.json();
        console.log("House data:", houseData);
        setHouseInfo(houseData);
      } else {
        console.error("Failed to fetch house info:", houseRes.status);
      }
    } catch (err) {
      console.error("Error fetching house info:", err);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    
    try {
      // For now, we'll convert the image to a data URL
      // In production, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target.result;
        
        // Update the profile with the new avatar
        setProfile(prev => ({ ...prev, avatar_url: dataUrl }));
        
        // Save to backend
        await saveProfile({ ...profile, avatar_url: dataUrl });
        
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
      setUploading(false);
      alert('Failed to upload image');
    }
  };

  const saveProfile = async (profileData) => {
    try {
      setSaving(true);
      const auth = getAuth();
      const token = await auth.currentUser.getIdToken();
      
      const res = await fetch("http://localhost:5001/api/profile/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: profileData.first_name,
          lastName: profileData.last_name,
          avatarUrl: profileData.avatar_url,
          houseId: profileData.house_id ?? null,
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to save profile');
      }
      
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
      
    } catch (err) {
      console.error('Save error:', err);
      alert('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    await saveProfile(profile);
  };

  if (error) return <p className="mt-10 text-red-500">Error: {error}</p>;
  if (!profile) return <p className="mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-8 space-y-4">
      {/* Success Notification */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Profile saved successfully!
        </div>
      )}

      {/* Avatar Section with Drag & Drop */}
      <div className="flex flex-col items-center">
        <div
          className={`relative w-32 h-32 rounded-full border-2 border-dashed transition-colors ${
            isDragging ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
          } ${profile.avatar_url ? 'border-solid' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {profile.avatar_url ? (
            <img 
              className="w-full h-full rounded-full object-cover cursor-pointer" 
              src={profile.avatar_url} 
              alt="Profile"
              onError={(e) => {
                console.error('Image failed to load:', e.target.src);
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center cursor-pointer">
              <span className="text-gray-500 text-sm">Drop image here or click to upload</span>
            </div>
          )}
          
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="text-white text-sm">Uploading...</div>
            </div>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <p className="text-xs text-gray-500 mt-2 text-center">
          Drag & drop an image here or click to select
        </p>
      </div>

      {/* Profile Form */}
      <div className="space-y-2 text-left">
        <label className="block text-sm font-medium text-gray-700">First name</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          value={profile.first_name || ""}
          onChange={e => setProfile({ ...profile, first_name: e.target.value })}
        />

        <label className="block text-sm font-medium text-gray-700 mt-3">Last name</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          value={profile.last_name || ""}
          onChange={e => setProfile({ ...profile, last_name: e.target.value })}
        />

        <label className="block text-sm font-medium text-gray-700 mt-3">Avatar URL</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          value={profile.avatar_url || ""}
          onChange={e => setProfile({ ...profile, avatar_url: e.target.value })}
          placeholder="Or paste an image URL here"
        />
      </div>

      {/* House Information */}
      {houseInfo && (
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-lg font-medium text-black mb-3">🏡 My House Information</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-light text-black">House Name:</span>
              <span className="font-light text-black">{houseInfo.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-light text-black">House ID:</span>
              <span className="font-light text-black">{profile.house_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-light text-black">Join Code:</span>
              <span className="font-light text-black bg-red-100 px-2 py-1 rounded">
                {houseInfo.invite_code || 'N/A'}
              </span>
            </div>
            {houseInfo.start_date && (
              <div className="flex justify-between items-center">
                <span className="font-light text-black">Lease Start:</span>
                <span className="font-light text-black">{new Date(houseInfo.start_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            )}
            {houseInfo.end_date && (
              <div className="flex justify-between items-center">
                <span className="font-light text-black">Lease End:</span>
                <span className="font-light text-black">{new Date(houseInfo.end_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No House Message */}
      {!profile.house_id && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
          <p className="text-gray-600 mb-2">You're not currently in a house</p>
          <button
            onClick={() => navigate("/joinHouse")}
            className="text-blue-600 hover:text-blue-800 underline text-sm"
          >
            Join a house
          </button>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={saving || uploading}
          onClick={handleSave}
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>

        {profile.house_id && houseInfo && (
          <button
            className="text-black underline hover:text-black"
            onClick={() => navigate("/myHouse")}
          >
            Go to my house
          </button>
        )}
      </div>

      {/* House Actions */}
      {profile.house_id && houseInfo && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Share this join code with others:</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(houseInfo.invite_code);
                alert('Join code copied to clipboard!');
              }}
              className="text-sm text-white bg-black hover:bg-grey text-blue-800 px-3 py-1 rounded-md transition-colors"
            >
              Copy Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}