import { useState, useEffect } from "react";
import SettingTabs from "../components/settings/SettingTabs";
import ProfileForm from "../components/settings/ProfileForm";
import ProfileSummary from "../components/settings/ProfileSummary";
import NotificationSettings from "../components/settings/NotificationSettings";
import { uploadProfileImage } from "../services/userAPI";
import { useAuth } from "../hooks/useAuth";

function Setting() {
  const { user, updateCurrentUser } = useAuth();

  const [activeTab, setActiveTab] = useState("Profile");

  const isSameDay = (date) => {
    const d = new Date(date);
    const today = new Date();

    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const todayApproval = user.appointments.filter(
    (a) => a.status === "PENDING" && isSameDay(a.appointmentDate)
  ).length;
  const todayConfirmed = user.appointments.filter(
    (a) => a.status === "CONFIRMED" && isSameDay(a.appointmentDate)
  ).length;
  const todayPatient = user.appointments.filter((a) =>
    isSameDay(a.appointmentDate)
  ).length;

  // State 1: Client Editable Input Data States (Profile Tab)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
    id: "",
    role: "",
    profile: "",
  });

  // State 2: System Controlled Account Metadata (Profile Side-Card)
  const [profileMetadata, setProfileMetadata] = useState({
    name: "",
    title: "",
    status: "ACTIVE",
    metrics: {
      patientReviewsToday: 0,
      approvalsPending: 0,
      totalConfirmed: 0,
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

      setProfileMetadata((prev) => ({
        ...prev,
        name: user.name,
        title: user.role.name,
        metrics: {
          patientReviewsToday: todayPatient,
          approvalsPending: todayApproval,
          totalConfirmed: todayConfirmed,
        },
      }));
    }
  }, [user]);

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
    <div className="min-h-screen bg-gray-50">
      {/* Page Container with Responsive Padding */}
      <div className="px-4 sm:px-6 lg:px-8 2xl:px-10 py-6 sm:py-8 lg:py-10">
        {/* Responsive Content Wrapper */}
        <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          {/* Page Header Section */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              {activeTab === "Notifications" && "Notification Settings"}
              {activeTab === "Profile" && "Profile Settings"}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {activeTab === "Profile" &&
                `Manage your professional administrative clinical profile as a ${profileMetadata.title}.`}
              {activeTab === "Notifications" &&
                "Configure how and when you receive clinical and system alerts."}
            </p>
            {/* Divider */}
            <div className="pt-4 border-t border-gray-200" />
          </div>

          {/* Tabs Navigation */}
          <div className="pb-2">
            <SettingTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Profile Tab Content */}
          {activeTab === "Profile" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
              {/* Main Form Area - Spans 2 columns on md and up */}
              <div className="md:col-span-2">
                <ProfileForm
                  user={formData}
                  onUpload={uploadProfileImage}
                  onUpdateUser={updateCurrentUser}
                  onChange={handleInputChange}
                />
              </div>

              {/* Sidebar Summary - Stacks on mobile, fixes on md and up */}
              <div className="md:col-span-1">
                <div className="sticky top-6">
                  <ProfileSummary profileMetadata={profileMetadata} />
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab Content */}
          {activeTab === "Notifications" && (
            <div className="pb-8 sm:pb-12">
              <NotificationSettings
                config={notifications}
                onToggle={handleNotificationToggle}
                role={profileMetadata.title}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Setting;