import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { getNotifications } from '../services/notificationAPI';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative text-slate-600 hover:text-slate-900 transition-colors"
      >
        <Bell className="w-5 h-5" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b font-semibold">
            Notifications
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-3 text-sm text-slate-500">No notifications</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => markAsRead(n.id)}
                  className={`p-3 text-sm border-b cursor-pointer hover:bg-slate-50 ${
                    !n.read ? "bg-blue-50" : ""
                  }`}
                >
                  <p className="font-medium">{n.title}</p>
                  <p className="text-xs text-slate-500">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}