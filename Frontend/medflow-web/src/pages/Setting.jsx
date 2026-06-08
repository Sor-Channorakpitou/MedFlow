import React, { useState } from "react";
import SettingTabs from "../components/settings/SettingTabs";
import ProfileForm from "../components/settings/ProfileForm";
import ProfileSummary from "../components/settings/ProfileSummary";
import NotificationSettings from "../components/settings/NotificationSettings";
import AboutMedFlow from "../components/settings/AboutMedFlow";

import { Save } from "lucide-react";

function Setting() {
  // Controlled tab string state: 'Profile' | 'Notifications' | 'AboutMedFlow'
  const [activeTab, setActiveTab] = useState("Profile");

  // State 1: Client Editable Input Data States (Profile Tab)
  const [formData, setFormData] = useState({
    fullName: "Dr. Sarah Chen",
    email: "s.chen@medflow-clinical.com",
    phone: "+1 (555) 942-0348",
    dob: "1982-05-14",
    staffId: "MF-CH-000921",
    department: "Medical Leadership",
  });

  // State 2: System Controlled Account Metadata (Profile Side-Card)
  const [profileMetadata] = useState({
    name: "Dr. Sarah Chen",
    title: "Chief Medical Officer",
    status: "ACTIVE",
    lastLogin: "Oct 24, 08:14 AM",
    location: "Central Campus - Admin Wing",
    metrics: {
      patientReviewsToday: 14,
      approvalsPending: 3,
    },
  });

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

  // Handler for text inputs inside ProfileForm
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for toggle triggers inside NotificationSettings
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

  // Centralized submission handler structured for RESTful endpoint operations
  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (activeTab === "Profile") {
      console.log("PATCH /api/v1/user/profile payload:", formData);
      alert("Profile Settings Saved!");
    } else if (activeTab === "Notifications") {
      console.log("PUT /api/v1/user/notifications payload:", notifications);
      alert("Notification Settings Saved!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Dynamic Header Frame Area matching layout view specs */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {activeTab === "Notifications" && "Notification Settings"}
            {activeTab === "Profile" && "Profile Settings"}
            {activeTab === "AboutMedFlow" && "System Information"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === "Profile" &&
              "Manage your professional administrative clinical profile."}
            {activeTab === "Notifications" &&
              "Configure how and when you receive clinical and system alerts."}
            {activeTab === "AboutMedFlow" &&
              "System runtime diagnostics and legal documentation compliance profiles."}
          </p>
        </div>

        {/* Conditional rendering for header action buttons */}
        {activeTab !== "AboutMedFlow" && (
          <button
            onClick={handleSaveChanges}
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium tracking-wide shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        )}
      </div>

      {/* Navigation Tab Switching Rail Component */}
      <SettingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Conditional Core Body View Routing */}

      {/* 1. Profile Workspace Wrapper View */}
      {activeTab === "Profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProfileForm
              formData={formData}
              onChange={handleInputChange}
              onSave={handleSaveChanges}
            />
          </div>
          <div>
            <ProfileSummary profileMetadata={profileMetadata} />
          </div>
        </div>
      )}

      {/* 2. Notification Toggle Matrix Control View */}
      {activeTab === "Notifications" && (
        <NotificationSettings
          config={notifications}
          onToggle={handleNotificationToggle}
        />
      )}

      {/* 3. Static Diagnostic Informational About Grid View */}
      {activeTab === "AboutMedFlow" && <AboutMedFlow />}
    </div>
  );
}

export default Setting;
