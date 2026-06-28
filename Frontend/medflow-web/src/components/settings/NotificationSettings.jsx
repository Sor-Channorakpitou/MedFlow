import React from 'react';
import { Users, Calendar, Info } from 'lucide-react';

function NotificationSettings({ config, onToggle }) {
  
  const sections = [
    {
      id: 'patientUpdates',
      title: 'Patient Updates',
      icon: <Users className="w-5 h-5 text-teal-600" />,
      rows: [
        { id: 'newCheckIn', label: 'New Check-In', desc: 'Alert when a patient arrives for their scheduled appointment.' },
        { id: 'queueChanges', label: 'Queue Changes', desc: 'Notifications regarding priority shifts in the emergency waitlist.' },
        { id: 'statusUpdates', label: 'Status Updates', desc: 'Vital sign alerts and critical recovery milestones.' }
      ]
    },
    {
      id: 'appointmentNotifications',
      title: 'Appointment Notifications',
      icon: <Calendar className="w-5 h-5 text-teal-600" />,
      rows: [
        { id: 'created', label: 'Created', desc: 'When a new appointment is booked in your calendar.' },
        { id: 'cancelled', label: 'Cancelled', desc: 'Immediate alerts for patient cancellations or rescheduling.' },
        { id: 'reminder', label: 'Reminder', desc: 'Daily summary of upcoming clinical rounds and sessions.' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Section Sub-Header Row */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            {section.icon}
            <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
          </div>

          {/* Grid Layout Headers */}
          <div className="grid grid-cols-12 px-6 py-2 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-8">Event Type</div>
            <div className="col-span-2 text-center">Email</div>
            <div className="col-span-2 text-center">In-App</div>
          </div>

          {/* Configuration Rows */}
          <div className="divide-y divide-gray-100">
            {section.rows.map((row) => (
              <div key={row.id} className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-8">
                  <h4 className="text-sm font-semibold text-gray-900">{row.label}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{row.desc}</p>
                </div>
                
                {/* Email Channel Toggle */}
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => onToggle(section.id, row.id, 'email')}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-200 ease-in-out ${
                      config[section.id][row.id].email ? 'bg-teal-600 justify-end' : 'bg-gray-200 justify-start'
                    }`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-md transform duration-200" />
                  </button>
                </div>

                {/* In-App Channel Toggle */}
                <div className="col-span-2 flex justify-center">
                  <button
                    onClick={() => onToggle(section.id, row.id, 'inApp')}
                    className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all duration-200 ease-in-out ${
                      config[section.id][row.id].inApp ? 'bg-teal-600 justify-end' : 'bg-gray-200 justify-start'
                    }`}
                  >
                    <div className="bg-white w-4 h-4 rounded-full shadow-md transform duration-200" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Compliance Callout Banner */}
      <div className="bg-aquamarine-alt bg-emerald-100 rounded-xl p-5 border border-emerald-200 flex items-start gap-4">
        <div className="bg-teal-800 p-2.5 rounded-xl text-white">
          <Info className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-teal-900">Need help with alerts?</h3>
          <p className="text-xs text-teal-800 mt-1 max-w-2xl leading-relaxed">
            Security alerts cannot be disabled to ensure platform compliance. For emergency SMS alerts, please update your profile contact information.
          </p>
        </div>
        <button className="bg-teal-950 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-teal-900 whitespace-nowrap transition-all shadow-sm">
          Contact IT Support
        </button>
      </div>
    </div>
  );
}

export default NotificationSettings;