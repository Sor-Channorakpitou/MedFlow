import { useEffect, useRef, useState } from 'react';
import { Bell, X, CheckCheck } from 'lucide-react';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';

const MAX_NOTIFICATIONS = 50;

// Human-readable labels for each socket event
const ROLE_EVENTS = {
  NURSE:        ['patient:registered', 'patient:triaged', 'queue:updated', 'nurse:availability_updated'],
  DOCTOR:       ['patient:moved_stage', 'queue:updated', 'consultation:diagnosis_added'],
  RECEPTIONIST: ['patient:moved_stage', 'queue:updated', 'billing:generated', 'prescription:dispensed'],
  PHARMACIST:   ['prescription:created', 'prescription:dispensed'],
  ADMIN:        ['queue:updated', 'patient:moved_stage', 'patient:triaged', 'patient:registered'],
};

const EVENT_LABELS = {
  'patient:registered':         { title: 'Patient Registered',         color: 'bg-green-50 border-green-300' },
  'patient:triaged':            { title: 'Patient Triaged',            color: 'bg-blue-50 border-blue-300' },
  'patient:moved_stage':        { title: 'Stage Updated',              color: 'bg-amber-50 border-amber-300' },
  'queue:updated':              { title: 'Queue Updated',              color: 'bg-slate-50 border-slate-300' },
  'billing:generated':          { title: 'Bill Generated',             color: 'bg-purple-50 border-purple-300' },
  'nurse:availability_updated': { title: 'Nurse Availability Changed', color: 'bg-cyan-50 border-cyan-300' },
  'consultation:diagnosis_added': { title: 'Diagnosis Added',          color: 'bg-indigo-50 border-indigo-300' },
  'prescription:created':       { title: 'Prescription Created',       color: 'bg-pink-50 border-pink-300' },
  'prescription:dispensed':     { title: 'Prescription Dispensed',     color: 'bg-teal-50 border-teal-300' },
};



// Extract a meaningful detail line from the event payload
function extractDetail(eventName, payload) {
  if (!payload) return null;
  const queue = payload.queue ?? payload.triage?.appointment ?? null;
  const patient =
    payload.patient?.fullName ??
    payload.queue?.patient?.fullName ??
    payload.triage?.appointment?.patient?.fullName ??
    payload.prescription?.patient?.fullName ??
    payload.record?.patientId ??
    null;

  if (patient) return `Patient: ${patient}`;
  if (queue?.queueNumber) return `Queue #${queue.queueNumber}`;
  return null;
}

let _notifIdCounter = 0;

export default function NotificationBell() {
  const socket = useSocket();
  const { user } = useAuth();
  const role = user?.role?.name || user?.role || '';
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Push a new notification into state
  const push = (eventName, payload) => {
    const meta = EVENT_LABELS[eventName] ?? { title: eventName, color: 'bg-slate-50 border-slate-200' };
    const detail = extractDetail(eventName, payload);

    setNotifications((prev) => [
      {
        id: ++_notifIdCounter,
        title: meta.title,
        detail,
        color: meta.color,
        read: false,
        time: new Date(),
      },
      ...prev.slice(0, MAX_NOTIFICATIONS - 1),
    ]);
  };


  useEffect(() => {
    if (!socket) return;

    const allowedEvents = ROLE_EVENTS[role] || Object.keys(EVENT_LABELS);

    const handlers = allowedEvents
      .filter((event) => EVENT_LABELS[event])
      .map((event) => {
        const handler = (payload) => push(event, payload);
        socket.on(event, handler);
        return { event, handler };
      });

    return () => {
      handlers.forEach(({ event, handler }) => socket.off(event, handler));
    };
  }, [socket, role]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  const clear = () => setNotifications([]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative text-slate-600 hover:text-slate-900 transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50">
            <span className="text-sm font-bold text-slate-800">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </span>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" /> Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clear}
                  className="text-[11px] text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-xs">
                <Bell className="w-6 h-6 mx-auto mb-2 opacity-30" />
                No notifications yet
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                    !n.read ? 'border-l-2 border-teal-500' : 'border-l-2 border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-xs font-semibold ${!n.read ? 'text-slate-900' : 'text-slate-500'}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">
                      {n.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  {n.detail && (
                    <p className="text-[11px] text-slate-400 mt-0.5">{n.detail}</p>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 text-center">
              Live events only — not persisted
            </div>
          )}
        </div>
      )}
    </div>
  );
}
