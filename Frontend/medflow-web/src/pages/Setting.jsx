// src/pages/Setting.jsx
import React, { useState, useEffect } from "react";
import SettingTabs from "../components/settings/SettingTabs";
import ProfileForm from "../components/settings/ProfileForm";
import ProfileSummary from "../components/settings/ProfileSummary";
import NotificationSettings from "../components/settings/NotificationSettings";
import AboutMedFlow from "../components/settings/AboutMedFlow";

import { Save } from "lucide-react";
import { useWorkflow } from "../context/WorkflowContext"; // Import pipeline engine link

function Setting() {
  const { currentUser } = useWorkflow(); // Gather current logged in profile dataset
  
  const [activeTab, setActiveTab] = useState("Profile");

  // State 1: Client Editable Input Data States (Profile Tab)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    staffId: "",
    department: "",
  });

  // State 2: System Controlled Account Metadata (Profile Side-Card)
  const [profileMetadata, setProfileMetadata] = useState({
    name: "",
    title: "",
    status: "ACTIVE",
    lastLogin: "",
    location: "",
    metrics: { patientReviewsToday: 0, approvalsPending: 0 },
  });

  // Whenever the active worker identity changes in the context, re-populate the inputs dynamically
  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone,
        dob: currentUser.dob,
        staffId: currentUser.staffId,
        department: currentUser.department,
      });

      setProfileMetadata({
        name: currentUser.fullName,
        title: currentUser.title,
        status: currentUser.status,
        lastLogin: currentUser.lastLogin,
        location: currentUser.location,
        metrics: currentUser.metrics,
      });
    }
  }, [currentUser]);

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

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (activeTab === "Profile") {
      console.log(`PATCH /api/v1/staff/${formData.staffId}/profile payload:`, formData);
      alert(`Profile configuration changes updated for ${formData.fullName}!`);
    } else if (activeTab === "Notifications") {
      console.log(`PUT /api/v1/staff/${formData.staffId}/notifications payload:`, notifications);
      alert("Notification rules updated successfully!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Dynamic Header Frame Area */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {activeTab === "Notifications" && "Notification Settings"}
            {activeTab === "Profile" && "Profile Settings"}
            {activeTab === "AboutMedFlow" && "System Information"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeTab === "Profile" && `Manage your professional administrative clinical profile as a ${profileMetadata.title}.`}
            {activeTab === "Notifications" && "Configure how and when you receive clinical and system alerts."}
            {activeTab === "AboutMedFlow" && "System runtime diagnostics and legal documentation compliance profiles."}
          </p>
        </div>

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

      <SettingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

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

      {activeTab === "Notifications" && (
        <NotificationSettings
          config={notifications}
          onToggle={handleNotificationToggle}
          role={profileMetadata.title} // Optional: pass down if child elements alter layouts base on role
        />
      )}

      {activeTab === "AboutMedFlow" && <AboutMedFlow />}
    </div>
  );
}

export default Setting;