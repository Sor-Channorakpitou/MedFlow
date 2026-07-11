import { useState, useEffect, useMemo, useCallback } from 'react';
import { ListOrdered, DollarSign, Activity, CreditCard, Clock, ChevronDown, Loader2, Plus, Trash2, FileText, CheckCircle2 } from 'lucide-react';
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

  // Socket listeners
  useEffect(() => {
    if (!socket) return;
    const refresh = () => { fetchInvoices(); };
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
    setNewItemPrice();
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

  return (
    <div className="flex flex-1 gap-5 min-h-0 items-start text-left w-full h-full">

      {/* COLUMN 1: Billing Queue */}
      <div className="w-full xl:w-64 bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col h-full shrink-0 overflow-hidden">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <ListOrdered className="w-3.5 h-3.5 text-slate-400" />
          Billing Queue ({queueCards.length})
        </h4>
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {queueCards.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectQueueId(p.id)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                activeQueueId === p.id
                  ? 'bg-teal-400/10 border-teal-300 text-teal-900 font-bold'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start font-bold">
                <p className="truncate max-w-[120px]">{p.name}</p>
                <span className="text-[10px] text-slate-400 font-mono font-medium shrink-0 ml-1">{p.time}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 truncate">ID: {p.patientId}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-white/80 border border-teal-200 text-teal-700">
                <Clock className="w-2.5 h-2.5" /> In Queue
              </span>
            </div>
          ))}
          {queueCards.length === 0 && (
            <p className="text-slate-400 text-xs text-center mt-8">
              No patients waiting at cashier.
            </p>
          )}
        </div>
      </div>

      {activeInvoice ? (
        <>
          {/* COLUMN 2: Invoice Ledger or Builder */}
          <div className="flex-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/40 text-xs grid grid-cols-2 gap-4 shrink-0">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Patient</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">{activeInvoice.patientName}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide font-mono">
                  Patient ID: {activeInvoice.patientId}
                </p>
                {activeInvoice.appointmentId && (
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    Appt: #{activeInvoice.appointmentId}
                  </p>
                )}
              </div>
            </div>

            {activeInvoice.needsFollowUp && (
              <div className="border-t border-amber-200 bg-amber-50/50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-semibold text-xs">
                  Follow-up appointment recommended
                </div>
                {!showFollowUpForm ? (
                  <button
                    onClick={() => setShowFollowUpForm(true)}
                    className="text-xs bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-lg"
                  >
                    Create Follow-up Appointment
                  </button>
                ) : (
                  <div className="space-y-2 text-xs">
                    <input
                      type="date"
                      value={followUpDate}
                      onChange={e => setFollowUpDate(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <select
                      value={followUpDoctor}
                      onChange={e => setFollowUpDoctor(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value="">Select doctor</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={followUpReason}
                      onChange={e => setFollowUpReason(e.target.value)}
                      placeholder="Reason for follow-up"
                      className="w-full border rounded-lg px-3 py-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateFollowUp}
                        disabled={creatingFollowUp}
                        className="bg-teal-700 text-white font-bold px-4 py-2 rounded-lg"
                      >
                        {creatingFollowUp ? 'Creating...' : 'Create'}
                      </button>
                      <button
                        onClick={() => setShowFollowUpForm(false)}
                        className="text-slate-500 font-semibold px-4 py-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeInvoice.invoice ? (
              <>
                {activeInvoice.isPaid && (
                  <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 text-xs text-emerald-700 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Invoice already marked as PAID
                  </div>
                )}

                <div className="flex-1 overflow-y-auto min-h-0">
                  {invoicesLoading ? (
                    <div className="flex items-center justify-center py-12 text-slate-400 text-xs gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading invoice...
                    </div>
                  ) : activeInvoice.items.length > 0 ? (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/60 sticky top-0">
                          <th className="px-6 py-2.5">Description</th>
                          <th className="px-6 py-2.5 text-center">Qty</th>
                          <th className="px-6 py-2.5 text-right">Unit Price</th>
                          <th className="px-6 py-2.5 text-right">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {activeInvoice.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-3.5">{item.description}</td>
                            <td className="px-6 py-3.5 text-center">{item.quantity}</td>
                            <td className="px-6 py-3.5 text-right font-mono">${Number(item.unitPrice).toFixed(2)}</td>
                            <td className="px-6 py-3.5 text-right font-mono font-semibold">${Number(item.subTotal).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex items-center justify-center py-12 text-slate-400 text-xs gap-2">
                      <Activity className="w-4 h-4" />
                      Invoice has no line items yet.
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Balance Due</span>
                  <span className="text-xl font-black text-slate-900 font-mono">
                    ${activeInvoice.total.toFixed(2)}
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Invoice Builder */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" /> Build Invoice
                  </h4>

                  {invoiceError && (
                    <div className="text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                      {invoiceError}
                    </div>
                  )}

                  {activeInvoice.diagnosis && (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</p>
                      <p className="font-medium text-slate-700">{activeInvoice.diagnosis}</p>
                      {activeInvoice.prescribedMeds.length > 0 && (
                        <>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-2 mb-1">Prescribed Medications</p>
                          <div className="space-y-1">
                            {activeInvoice.prescribedMeds.map((m, i) => (
                              <div key={i} className="flex justify-between items-center">
                                <span className="font-medium text-slate-700">{m.name} — {m.dosage}mg x{m.frequency}/day</span>
                                <span className="font-mono text-slate-500">${m.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Add item row */}
                  <div className="grid grid-cols-2 gap-2 text-xs items-end">
                    <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Description</label>
                      <input type="text" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} placeholder="e.g. Consultation, Medication, Lab, Procedure" className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-teal-600" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Type</label>
                      <select value={newItemType} onChange={e => setNewItemType(e.target.value)} className="w-full border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50/50 text-slate-700 focus:outline-none focus:border-teal-600">
                        {ITEM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Qty</label>
                      <input type="number" min="1" value={newItemQty} onChange={e => setNewItemQty(Number(e.target.value))} className="w-full border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-teal-600" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-500">Price</label>
                      <div className="flex gap-1">
                        <input type="number" min="0" step="0.01" value={newItemPrice} onChange={e => setNewItemPrice(Number(e.target.value))} className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 bg-slate-50/50 text-slate-800 focus:outline-none focus:border-teal-600" />
                        <button type="button" onClick={handleAddItem} className="px-2 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shrink-0">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Pending items list */}
                  {pendingItems.length > 0 && (
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                      <table className="w-full text-left border-collapse text-[11px]">
                        <thead>
                          <tr className="text-[10px] font-bold uppercase text-slate-400 bg-slate-50">
                            <th className="px-3 py-2">Description</th>
                            <th className="px-3 py-2">Type</th>
                            <th className="px-3 py-2 text-center">Qty</th>
                            <th className="px-3 py-2 text-right">Price</th>
                            <th className="px-3 py-2 text-right">Subtotal</th>
                            <th className="px-3 py-2"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {pendingItems.map(item => (
                            <tr key={item.id} className="text-slate-700">
                              <td className="px-3 py-2 font-medium">{item.description}</td>
                              <td className="px-3 py-2 text-slate-500">{item.type}</td>
                              <td className="px-3 py-2 text-center">{item.quantity}</td>
                              <td className="px-3 py-2 text-right font-mono">${item.unitPrice.toFixed(2)}</td>
                              <td className="px-3 py-2 text-right font-mono font-semibold">${item.subTotal.toFixed(2)}</td>
                              <td className="px-3 py-2 text-right">
                                <button onClick={() => handleRemoveItem(item.id)} className="text-rose-400 hover:text-rose-600">
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Total: <span className="text-slate-900 font-mono text-sm">${totalPending.toFixed(2)}</span>
                    </span>
                  </div>

                  <button
                      onClick={handleGenerateInvoice}
                      disabled={pendingItems.length === 0 || generating}
                      className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded-lg text-xs transition shadow-sm"
                    >
                      {generating ? (
                        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                      ) : (
                        <><FileText className="w-3.5 h-3.5" /> Generate Invoice</>
                      )}
                    </button>
                </div>
              </>
            )}
          </div>

          {/* COLUMN 3: Payment Processing */}
          <div className="w-full xl:w-80 bg-white border border-slate-200 rounded-xl p-4 shadow-sm text-xs space-y-4 shrink-0 h-full">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> Payment Processing
              </h4>
            </div>

            {paymentError && (
              <div className="text-[11px] font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                {paymentError}
              </div>
            )}

            {success && (
              <div className="text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3 h-3" /> {success}
              </div>
            )}

            {activeInvoice.invoice ? (
              <>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-600">Payment Method</label>
                  <div className="relative">
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50/50 text-slate-700 font-medium focus:outline-none focus:border-slate-300 appearance-none"
                      disabled={activeInvoice.isPaid}
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m} value={m}>{m.replace('_', ' ')}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-600">Amount Due</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={activeInvoice.total.toFixed(2)}
                      readOnly
                      className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 bg-slate-50 text-slate-500 font-mono text-base font-bold"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCompleteCheckout}
                  disabled={processing || activeInvoice.isPaid}
                  className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition shadow-sm uppercase tracking-wide"
                >
                  {processing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                  ) : activeInvoice.isPaid ? (
                    <><CheckCircle2 className="w-4 h-4" /> Already Paid</>
                  ) : (
                    <><CreditCard className="w-4 h-4" /> Complete Checkout</>
                  )}
                </button>
              </>
            ) : (
              <div className="text-center text-slate-400 py-6 text-xs">
                Generate an invoice first to enable payment processing.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 font-medium shadow-sm">
          {queueCards.length > 0
            ? 'Select a patient from the billing queue.'
            : 'No transactions pending settlement at this time.'}
        </div>
      )}
    </div>
  );
}