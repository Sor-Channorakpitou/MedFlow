import React, { useState, useMemo, useEffect } from 'react';
import AppointmentsTable from '../components/receptionist/AppointmentsTable';
import NewPatientRegistration from '../components/receptionist/NewPatientRegistration';
import PatientCheckout from '../components/receptionist/PatientCheckout';
import ReceptionSidePanel from '../components/receptionist/ReceptionSidePanel';
import Header from '../components/Header';
import { getAllAppointments } from '../services/appointmentAPI';
import { getAllQueues } from '../services/queueAPI';

function ReceptionistDash() {

  const [appointmentList, setAppointmentList] = useState([]);
  const [queueList, setQueueList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAppointment = async () => {
      try {
          setLoading(true);
          setError('');
          const data = await getAllAppointments();
          setAppointmentList(data);
      } catch (err) {
          if (err.response?.status === 404) {
              setAppointmentList([]);
          } else {
              setError('Failed to load appointments.');
              console.error(err);
          }
      } finally {
          setLoading(false);
      }
  };

  const fetchQueue = async () => {
      try {
          setLoading(true);
          setError('');
          const data = await getAllQueues();
          setQueueList(data);
      } catch (err) {
          if (err.response?.status === 404) {
              setQueueList([]);
          } else {
              setError('Failed to load queues.');
              console.error(err);
          }
      } finally {
          setLoading(false);
      }
  }
  
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [appointments, queues] = await Promise.all([
          getAllAppointments(),
          getAllQueues(),
        ]);

        setAppointmentList(appointments);
        setQueueList(queues);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const [subView, setSubView] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCheckoutAppId, setSelectedCheckoutAppId] = useState('');

  const activeAppointmentsList = useMemo(() => {

    const getPriorityWeight = (reasonText) => {
    if (!reasonText) return 1;
      const normalized = reasonText.toLowerCase();
      if (normalized.includes('emergency') || normalized.includes('acute') || normalized.includes('pain')) {
        return 2; // High Priority
      }
      return 1; // Standard FCFS
    };

    return appointmentList.filter(a => new Date(a.appointmentDate) >= new Date()) // this is for testing (= means today)
      .map(app => ({
          id: app.id,
          patientName: app.patient.fullName,
          doctor: app.user.name,
          reason: app.reason,
          startTime: app.startTime,
          endTime: app.endTime,
          patientId: app.patientId,
          invoice: app.invoice,
          status: app.status,
          date: app.appointmentDate
      }))
      // THE QUEUE ENGINE: Highest Priority jumps ahead. If equal, oldest timestamp takes precedence (FCFS)
      .sort((a, b) => {
        if (b.priorityWeight !== a.priorityWeight) {
          return b.priorityWeight - a.priorityWeight;
        }
        return a.rawTime - b.rawTime;
      })
      .filter(apt => apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()));

  }, [appointmentList, searchQuery]);


  const financialMetrics = useMemo(() => {
    const checkoutQueue = queueList.filter(q => q.stage === 'BILLING');
    console.log(appointmentList);

    // const latestTransaction = [...appointmentList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    // console.log(latestTransaction);

    return {
      pendingInvoices: checkoutQueue.length,
      collectionsToday: `$${appointmentList
        .reduce((sum, app) => sum + app.invoice ? app.invoice?.totalAmount : 0, 0)
        .toFixed(2)}`,
      transactions: [
        // { name: latestTransaction.patientName ,  type: latestTransaction.invoice.paymentMethod , amount: latestTransaction.invoice.totalAmount }
      ]
    };
  }, [queueList]);

  const handleCheckInAction = (apt) => {
    if (apt.status === "Checked In") return;
    checkInPatient(apt.id);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] overflow-hidden">
      <Header
        searchPlaceholder="Search arriving patient manifests..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex-1 flex p-6 gap-5 min-h-0 overflow-hidden">
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          
          {/* Subview Nav Switcher Links */}
          <div className="flex items-center gap-3 mb-4 text-xs font-semibold">
            <button onClick={() => setSubView('list')} className={`pb-1 border-b-2 transition-all ${subView === 'list' ? 'border-teal-700 text-teal-800 font-bold' : 'border-transparent text-slate-400'}`}>
              Arrival Manifest
            </button>
            <button onClick={() => setSubView('register')} className={`pb-1 border-b-2 transition-all ${subView === 'register' ? 'border-teal-700 text-teal-800 font-bold' : 'border-transparent text-slate-400'}`}>
              New Registration Form
            </button>
            <button onClick={() => setSubView('checkout')} className={`pb-1 border-b-2 transition-all ${subView === 'checkout' ? 'border-teal-700 text-teal-800 font-bold' : 'border-transparent text-slate-400'}`}>
              Billing Cashier Ledger
            </button>
          </div>

          <div className="flex-1 flex min-h-0">
            {subView === 'list' && (
              <AppointmentsTable appointments={activeAppointmentsList} onCheckIn={handleCheckInAction} />
            )}
            {subView === 'register' && (
              <NewPatientRegistration onCompleteRegistration={() => setSubView('list')} />
            )}
            {subView === 'checkout' && (
              <PatientCheckout selectedAppId={selectedCheckoutAppId} onSelectAppId={setSelectedCheckoutAppId} onFinalizeCheckout={finalizePatientCheckout} />
            )}

            <div className='pl-10'>
              <ReceptionSidePanel setSubView={setSubView} stats={financialMetrics} /> 
            </div>

          </div>
        </div> 
      </div>
    </div>
  );
}

export default ReceptionistDash;