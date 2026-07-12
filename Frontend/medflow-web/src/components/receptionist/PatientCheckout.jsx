import { useState, useEffect, useMemo, useCallback } from 'react';
import { ListOrdered, DollarSign, Activity, CreditCard, Clock, ChevronDown, Loader2, Plus, Trash2, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { getAllInvoices, createInvoice, updateInvoiceById, issuePayment } from '../../services/billingAPI';
import { createInvoiceItem } from '../../services/invoiceItemAPI';
import { updateQueue } from '../../services/queueAPI';
import { updateAppointment } from '../../services/appointmentAPI';
import { useSocket } from '../../hooks/useSocket';
import { SOCKET_EVENTS } from '../../sockets/socketEvents';
import { createAppointment } from '../../services/appointmentAPI';
import api from '../../services/api';

const PAYMENT_METHODS = ['CASH', 'CREDIT_CARD', 'INSURANCE'];
const ITEM_TYPES = ['Service', 'Medication', 'Procedure', 'Lab'];

export default function PatientCheckout({ billingQueue = [], selectedQueueId, onSelectQueueId, onPaymentComplete }) {
  const socket = useSocket();
  const [invoices, setInvoices] = useState([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [processing, setProcessing] = useState(false);
  const [invoiceError, setInvoiceError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpDoctor, setFollowUpDoctor] = useState('');
  const [followUpReason, setFollowUpReason] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [creatingFollowUp, setCreatingFollowUp] = useState(false);

  // Invoice builder state
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemType, setNewItemType] = useState('Service');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemPrice, setNewItemPrice] = useState(0);
  const [pendingItems, setPendingItems] = useState([]);
  const [generating, setGenerating] = useState(false);

  // Mobile view state
  const [mobileView, setMobileView] = useState('queue'); // 'queue', 'invoice', 'payment'

  const fetchInvoices = useCallback(async () => {
    setInvoicesLoading(true);
    try {
      const data = await getAllInvoices();
      setInvoices(Array.isArray(data) ? data : []);
    } catch {
      setInvoices([]);
    } finally {
      setInvoicesLoading(false);
    }
  }, []);

  useEffect(() => {
    api.get('/users/doctors')
      .then(res => setDoctors(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (billingQueue.length > 0) fetchInvoices();
  }, [billingQueue, fetchInvoices]);

  useEffect(() => {
    if (!socket) return;
    const refresh = () => {
      fetchInvoices();
    };
    socket.on(SOCKET_EVENTS.PATIENT_MOVED_STAGE, refresh);
    socket.on(SOCKET_EVENTS.QUEUE_UPDATED, refresh);
    socket.on(SOCKET_EVENTS.BILL_GENERATED, refresh);
    return () => {
      socket.off(SOCKET_EVENTS.PATIENT_MOVED_STAGE, refresh);
      socket.off(SOCKET_EVENTS.QUEUE_UPDATED, refresh);
      socket.off(SOCKET_EVENTS.BILL_GENERATED, refresh);
    };
  }, [socket, fetchInvoices]);

  useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(''), 3000);
      return () => clearTimeout(t);
    }
  }, [success]);

  const activeQueueId = selectedQueueId || billingQueue[0]?.id || null;

  const queueCards = useMemo(() => {
    return billingQueue.map((q) => ({
      id: q.id,
      name: q.patient?.fullName ?? 'Unknown Patient',
      patientId: q.patientId,
      appointmentId: q.appointmentId,
      time: new Date(q.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  }, [billingQueue]);

  const activeInvoice = useMemo(() => {
    if (!activeQueueId) return null;
    const queueEntry = billingQueue.find((q) => q.id === activeQueueId);
    if (!queueEntry) return null;
    const invoice = invoices.find((inv) => inv.appointmentId === queueEntry.appointmentId);
    return {
      queueId: queueEntry.id,
      appointmentId: queueEntry.appointmentId,
      patientId: queueEntry.patientId,
      patientName: queueEntry.patient?.fullName ?? 'Unknown Patient',
      invoice,
      items: invoice?.invoiceItem ?? [],
      total: invoice ? Number(invoice.totalAmount) : 0,
      isPaid: invoice?.paymentStatus === 'PAID',
      needsFollowUp: queueEntry?.appointment?.medicalRecord?.needsFollowUp ?? false,
      diagnosis: queueEntry?.appointment?.medicalRecord?.diagnosis ?? '',
      prescribedMeds: (queueEntry?.appointment?.prescriptions ?? [])
        .flatMap(p => p.prescriptionMedications ?? [])
        .map(pm => ({
          name: pm.medication.name,
          dosage: pm.dosage,
          frequency: pm.frequency,
          price: Number(pm.medication.unitPrice),
        })),
    };
  }, [activeQueueId, billingQueue, invoices]);

  const handleAddItem = () => {
    if (!newItemDesc.trim() || newItemQty < 1 || newItemPrice <= 0) return;
    setPendingItems(prev => [...prev, {
      id: Date.now(),
      description: newItemDesc.trim(),
      type: newItemType,
      quantity: newItemQty,
      unitPrice: newItemPrice,
      subTotal: newItemQty * newItemPrice,
    }]);
    setNewItemDesc('');
    setNewItemType('Service');
    setNewItemQty(1);
    setNewItemPrice(0);
  };

  const handleRemoveItem = (itemId) => {
    setPendingItems(prev => prev.filter(i => i.id !== itemId));
  };

  const totalPending = useMemo(() => {
    return pendingItems.reduce((sum, i) => sum + i.subTotal, 0);
  }, [pendingItems]);

  const handleGenerateInvoice = async () => {
    if (!activeInvoice || pendingItems.length === 0) return;
    setGenerating(true);
    setInvoiceError('');

    try {
      const inv = await createInvoice({
        paymentMethod: 'CASH',
        issuedDate: new Date().toISOString(),
        totalAmount: totalPending,
        appointmentId: activeInvoice.appointmentId,
        patientId: activeInvoice.patientId,
        userId: billingQueue.find(q => q.id === activeQueueId)?.currentUserId || 1,
      });

      for (const item of pendingItems) {
        await createInvoiceItem({
          invoiceId: inv.id,
          unitPrice: item.unitPrice,
          description: item.description,
          type: item.type,
          quantity: item.quantity,
        });
      }

      setPendingItems([]);
      setSuccess('Invoice generated successfully.');
      setMobileView('payment');
      await fetchInvoices();
    } catch (err) {
      setInvoiceError(err?.response?.data?.message || 'Failed to generate invoice.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCompleteCheckout = async () => {
    if (!activeInvoice || processing) return;
    setPaymentError('');
    setSuccess('');
    setProcessing(true);

    try {
      if (activeInvoice.invoice) {
        await issuePayment(activeInvoice.invoice.id);

        await updateInvoiceById(activeInvoice.invoice.id, {
          paymentMethod,
        });
      }

      await updateQueue(activeInvoice.queueId, {
        status: 'COMPLETED',
        stage: 'COMPLETED',
      });

      if (activeInvoice.appointmentId) {
        await updateAppointment(activeInvoice.appointmentId, { status: 'COMPLETED' });
      }

      setSuccess('Payment completed successfully.');
      onPaymentComplete?.();
    } catch (err) {
      console.error('Checkout failed:', err);
      setPaymentError(err?.response?.data?.message ?? 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateFollowUp = async () => {
    if (!followUpDate || !followUpDoctor) return;
    setCreatingFollowUp(true);
    try {
      const start = new Date(followUpDate);
      start.setHours(9, 0, 0, 0);
      const end = new Date(start);
      end.setHours(9, 30, 0, 0);

      await createAppointment({
        patientId: activeInvoice.patientId,
        userId: Number(followUpDoctor),
        appointmentDate: followUpDate,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        reason: followUpReason || 'Follow-up',
        status: 'PENDING',
      });

      setShowFollowUpForm(false);
      setSuccess('Follow-up appointment created successfully.');
    } catch (err) {
      setError('Failed to create follow-up appointment.');
    } finally {
      setCreatingFollowUp(false);
    }
  };

  // Empty State
  if (queueCards.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 mb-4">
            <CreditCard className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No transactions pending
          </h3>
          <p className="text-sm text-gray-600">
            There are no patients waiting at the cashier at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-gray-50 overflow-hidden">
      {/* Mobile Tab Navigation */}
      <div className="md:hidden flex-shrink-0 border-b border-gray-200 bg-white">
        <div className="flex gap-1 px-4 overflow-x-auto -mb-px">
          <button
            onClick={() => setMobileView('queue')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              mobileView === 'queue'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Queue
          </button>
          <button
            onClick={() => setMobileView('invoice')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              mobileView === 'invoice'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Invoice
          </button>
          <button
            onClick={() => setMobileView('payment')}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
              mobileView === 'payment'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Payment
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 sm:gap-5 lg:gap-6 min-h-0 overflow-hidden p-4 sm:p-5 lg:p-6 2xl:p-8">
        
        {/* Queue Column */}
        <div
          className={`${
            mobileView === 'queue' ? 'block' : 'hidden md:block'
          } flex-shrink-0 w-full md:w-72 lg:w-80 flex flex-col bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm min-h-0`}
        >
          <div className="flex-shrink-0 px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-gray-600" />
              Queue ({queueCards.length})
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 p-4 sm:p-5 min-h-0">
            {queueCards.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  onSelectQueueId(p.id);
                  setMobileView('invoice');
                }}
                className={`w-full text-left p-3 sm:p-4 rounded-lg border-2 transition-all ${
                  activeQueueId === p.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                    {p.name}
                  </h4>
                  <span className="text-xs text-gray-500 font-mono flex-shrink-0">
                    {p.time}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-mono mb-2">
                  ID: {p.patientId}
                </p>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full px-2.5 py-1">
                  <Clock className="w-3 h-3" />
                  In Queue
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Invoice/Payment Area */}
        {activeInvoice ? (
          <div className={`${
            mobileView !== 'queue' ? 'flex' : 'hidden md:flex'
          } flex-1 flex-col gap-4 sm:gap-5 lg:gap-6 min-h-0 overflow-hidden`}
          >
            {/* Invoice Section */}
            <div
              className={`${
                mobileView === 'payment' ? 'hidden md:flex' : 'flex'
              } flex-1 flex-col bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm min-h-0 overflow-hidden`}
            >
              {/* Patient Header */}
              <div className="flex-shrink-0 px-4 sm:px-5 lg:px-6 py-4 sm:py-5 border-b border-gray-100 bg-gray-50/50">
                <div className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    {activeInvoice.patientName}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 font-mono">
                    Patient ID: {activeInvoice.patientId}
                    {activeInvoice.appointmentId && ` • Appt: #${activeInvoice.appointmentId}`}
                  </p>
                </div>
              </div>

              {/* Follow-up Section */}
              {activeInvoice.needsFollowUp && (
                <div className="flex-shrink-0 border-b border-amber-200 bg-amber-50 p-4 sm:p-5 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
                    Follow-up appointment recommended
                  </div>

                  {!showFollowUpForm ? (
                    <button
                      onClick={() => setShowFollowUpForm(true)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm"
                    >
                      Create Follow-up
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="date"
                          value={followUpDate}
                          onChange={e => setFollowUpDate(e.target.value)}
                          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <select
                          value={followUpDoctor}
                          onChange={e => setFollowUpDoctor(e.target.value)}
                          className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        >
                          <option value="">Select doctor</option>
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                          ))}
                        </select>
                      </div>
                      <input
                        type="text"
                        value={followUpReason}
                        onChange={e => setFollowUpReason(e.target.value)}
                        placeholder="Reason for follow-up"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleCreateFollowUp}
                          disabled={creatingFollowUp || !followUpDate || !followUpDoctor}
                          className="flex-1 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors"
                        >
                          {creatingFollowUp ? 'Creating...' : 'Create'}
                        </button>
                        <button
                          onClick={() => setShowFollowUpForm(false)}
                          className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg text-sm hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Invoice Content */}
              <div className="flex-1 overflow-y-auto min-h-0">
                {activeInvoice.invoice ? (
                  <>
                    {activeInvoice.isPaid && (
                      <div className="flex-shrink-0 px-4 sm:px-5 lg:px-6 py-3 bg-emerald-50 border-b border-emerald-200 text-sm font-semibold text-emerald-700 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Invoice marked as PAID
                      </div>
                    )}

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="px-4 sm:px-5 lg:px-6 py-3 font-bold text-xs uppercase tracking-wide text-gray-600">
                              Description
                            </th>
                            <th className="px-4 sm:px-5 lg:px-6 py-3 font-bold text-xs uppercase tracking-wide text-gray-600 text-center">
                              Qty
                            </th>
                            <th className="px-4 sm:px-5 lg:px-6 py-3 font-bold text-xs uppercase tracking-wide text-gray-600 text-right">
                              Price
                            </th>
                            <th className="px-4 sm:px-5 lg:px-6 py-3 font-bold text-xs uppercase tracking-wide text-gray-600 text-right">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {activeInvoice.items.map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-4 sm:px-5 lg:px-6 py-3 text-gray-900 font-medium">
                                {item.description}
                              </td>
                              <td className="px-4 sm:px-5 lg:px-6 py-3 text-gray-600 text-center">
                                {item.quantity}
                              </td>
                              <td className="px-4 sm:px-5 lg:px-6 py-3 text-gray-600 font-mono text-right">
                                ${Number(item.unitPrice).toFixed(2)}
                              </td>
                              <td className="px-4 sm:px-5 lg:px-6 py-3 text-gray-900 font-bold font-mono text-right">
                                ${Number(item.subTotal).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex-shrink-0 px-4 sm:px-5 lg:px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                      <span className="font-bold text-gray-900 text-sm">Total Due</span>
                      <span className="text-2xl sm:text-3xl font-black text-gray-900 font-mono">
                        ${activeInvoice.total.toFixed(2)}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    {invoiceError && (
                      <div className="flex-shrink-0 mx-4 sm:mx-5 mt-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg text-sm font-semibold text-red-700">
                        {invoiceError}
                      </div>
                    )}

                    {/* Diagnosis Section */}
                    {activeInvoice.diagnosis && (
                      <div className="p-4 sm:p-5 space-y-4 border-b border-gray-100">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-2">
                            Diagnosis
                          </p>
                          <p className="font-semibold text-gray-900 text-sm">
                            {activeInvoice.diagnosis}
                          </p>
                        </div>

                        {activeInvoice.prescribedMeds.length > 0 && (
                          <div className="space-y-2 pt-3 border-t border-gray-100">
                            <p className="text-xs font-bold uppercase tracking-wide text-gray-600 mb-3">
                              Prescribed Medications
                            </p>
                            <div className="space-y-2">
                              {activeInvoice.prescribedMeds.map((m, i) => (
                                <div
                                  key={i}
                                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 text-sm">
                                      {m.name}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-0.5">
                                      {m.dosage}mg × {m.frequency}/day
                                    </p>
                                  </div>
                                  <span className="font-mono font-semibold text-gray-900">
                                    ${m.price.toFixed(2)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Invoice Builder */}
                    <div className="p-4 sm:p-5 space-y-5">
                      <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        Build Invoice
                      </h4>

                      {/* Add Item Form */}
                      <div className="space-y-4 p-4 sm:p-5 bg-gray-50 border border-gray-200 rounded-lg">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            Description
                          </label>
                          <input
                            type="text"
                            value={newItemDesc}
                            onChange={e => setNewItemDesc(e.target.value)}
                            placeholder="e.g. Consultation, Lab test"
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                              Type
                            </label>
                            <select
                              value={newItemType}
                              onChange={e => setNewItemType(e.target.value)}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              {ITEM_TYPES.map(t => (
                                <option key={t} value={t}>{t}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                              Qty
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={newItemQty}
                              onChange={e => setNewItemQty(Number(e.target.value))}
                              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            Unit Price
                          </label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={newItemPrice || ''}
                                onChange={e => setNewItemPrice(Number(e.target.value))}
                                className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleAddItem}
                              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                              <Plus className="w-4 h-4" />
                              <span className="hidden sm:inline">Add</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Pending Items */}
                      {pendingItems.length > 0 && (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-200 bg-gray-50">
                                  <th className="px-4 py-3 font-bold text-xs uppercase tracking-wide text-gray-600 text-left">
                                    Description
                                  </th>
                                  <th className="px-4 py-3 font-bold text-xs uppercase tracking-wide text-gray-600 text-center">
                                    Qty
                                  </th>
                                  <th className="px-4 py-3 font-bold text-xs uppercase tracking-wide text-gray-600 text-right">
                                    Price
                                  </th>
                                  <th className="px-4 py-3 font-bold text-xs uppercase tracking-wide text-gray-600 text-right">
                                    Total
                                  </th>
                                  <th className="px-4 py-3 w-10" />
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                {pendingItems.map(item => (
                                  <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-900 font-medium">
                                      {item.description}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 text-center">
                                      {item.quantity}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600 font-mono text-right">
                                      ${item.unitPrice.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-gray-900 font-bold font-mono text-right">
                                      ${item.subTotal.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                      <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="px-4 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                            <span className="font-bold text-gray-900">
                              Total: <span className="font-mono text-lg">${totalPending.toFixed(2)}</span>
                            </span>
                            <button
                              onClick={handleGenerateInvoice}
                              disabled={pendingItems.length === 0 || generating}
                              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg text-sm transition-colors shadow-sm"
                            >
                              {generating ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <FileText className="w-4 h-4" />
                                  Generate Invoice
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Payment Panel */}
            <div
              className={`${
                mobileView === 'payment' ? 'flex' : 'hidden md:flex'
              } flex-col md:w-80 lg:w-96 bg-white border border-gray-200 rounded-lg sm:rounded-xl shadow-sm`}
            >
              <div className="flex-shrink-0 px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-600" />
                  Payment
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 sm:py-5 space-y-5 min-h-0">
                {paymentError && (
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-red-700">{paymentError}</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-start gap-3 p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-semibold text-emerald-700">{success}</p>
                  </div>
                )}

                {activeInvoice.invoice ? (
                  <>
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Payment Method
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={activeInvoice.isPaid}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        {PAYMENT_METHODS.map((m) => (
                          <option key={m} value={m}>
                            {m.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Amount Due
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={activeInvoice.total.toFixed(2)}
                          readOnly
                          className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm font-mono font-bold bg-gray-50"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleCompleteCheckout}
                      disabled={processing || activeInvoice.isPaid}
                      className="w-full py-3 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : activeInvoice.isPaid ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Already Paid
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Complete Checkout
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">
                      Generate an invoice to enable payment processing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500 px-4">
              <p className="text-sm">
                {queueCards.length > 0
                  ? 'Select a patient from the queue to get started.'
                  : 'No patients in the billing queue.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}