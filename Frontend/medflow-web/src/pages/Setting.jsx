// src/pages/Setting.jsx
import React, { useState, useEffect } from "react";
import SettingTabs from "../components/settings/SettingTabs";
import ProfileForm from "../components/settings/ProfileForm";
import ProfileSummary from "../components/settings/ProfileSummary";
import NotificationSettings from "../components/settings/NotificationSettings";
import { uploadProfileImage } from "../services/userAPI"
import { Save } from "lucide-react";

import { useAuth } from "../hooks/useAuth";

function Setting() {
  const { user, updateCurrentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState("Profile");

  // State 1: Client Editable Input Data States (Profile Tab)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    id: "",
    role: "",
    profile: ""
  });

  // State 2: System Controlled Account Metadata (Profile Side-Card)
  const [profileMetadata, setProfileMetadata] = useState({
    name: "",
    title: "",
    status: "ACTIVE",
    metrics: { patientReviewsToday: 0, approvalsPending: 0 },
  });

  // Whenever the active worker identity changes in the context, re-populate the inputs dynamically
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.name,
        email: user.email,
        phone: user.phone,
        dob: user.dateOfBirth,
        id: user.id,
        role: user.role.name,
        profile: user.profileImage,
      });

      setProfileMetadata(prev => ({
        ...prev,
        name: user.name,
        title: user.role.name,
        metrics: { patientReviewsToday: 3, approvalsPending: 12 }
      }));
    }
  }, [user]);

  // State 3: Notification Toggles Configuration Matrix (Notifications Tab)
  const [notifications, setNotifications] = useState({
    patientUpdates: {
      newCheckIn: { email: true, inApp: true },
      queueChanges: { email: false, inApp: true },
      statusUpdates: { email: true, inApp: true },
    },
    appointmentNotifications: {
      created: { email: true, inApp: true },
      cancelled: { email: true, inApp: true },
      reminder: { email: false, inApp: true },
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (section, eventType, channel) => {
    setNotifications((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [eventType]: {
          ...prev[section][eventType],
          [channel]: !prev[section][eventType][channel],
        },
      },
    }));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Dynamic Header Frame Area */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {activeTab === "Notifications" && "Notification Settings"}
            {activeTab === "Profile" && "Profile Settings"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === "Profile" && `Manage your professional administrative clinical profile as a ${profileMetadata.title}.`}
            {activeTab === "Notifications" && "Configure how and when you receive clinical and system alerts."}
          </p>
        </div>

      </div>

      <SettingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfileForm
              user={formData}
              onUpload={uploadProfileImage}
              onUpdateUser={updateCurrentUser}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <ProfileSummary profileMetadata={profileMetadata} />
          </div>
        </div>
      )}

      {activeTab === "Notifications" && (
        <NotificationSettings
          config={notifications}
          onToggle={handleNotificationToggle}
          role={profileMetadata.title} 
        />
      )}

    </div>
  );
}

export default Setting;