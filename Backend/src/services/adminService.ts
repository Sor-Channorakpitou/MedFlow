import prisma from "../lib/prisma.js";

export const getAdminAnalytics = async (startDate?: string, endDate?: string) => {
  const dateFilter: any = {};
  if (startDate || endDate) {
    if (startDate) dateFilter.gte = new Date(startDate);
    if (endDate) dateFilter.lte = new Date(endDate);
  }

  const appointmentWhere = Object.keys(dateFilter).length ? { appointmentDate: dateFilter } : {};

  const invoiceWhere = Object.keys(dateFilter).length ? { issuedDate: dateFilter } : {};

  // Total Revenue (paid invoices in range) 
  const revenueAgg = await prisma.invoice.aggregate({
    _sum: { totalAmount: true },
    where: { ...invoiceWhere, paymentStatus: "PAID" },
  });
  const totalRevenue = Number(revenueAgg._sum.totalAmount ?? 0);

  // Appointment volume (daily counts) 
  const appointments = await prisma.appointment.findMany({
    where: appointmentWhere,
    select: { appointmentDate: true },
    orderBy: { appointmentDate: "asc" },
  });

  const appointmentVolume: Record<string, number> = {};
  for (const app of appointments) {
    const key = app.appointmentDate.toISOString().slice(0, 10);
    appointmentVolume[key] = (appointmentVolume[key] ?? 0) + 1;
  }

  // Revenue trend (daily sums, paid only)
  const paidInvoices = await prisma.invoice.findMany({
    where: { ...invoiceWhere, paymentStatus: "PAID" },
    select: { issuedDate: true, totalAmount: true },
    orderBy: { issuedDate: "asc" },
  });

  const revenueTrend: Record<string, number> = {};
  for (const inv of paidInvoices) {
    const key = inv.issuedDate.toISOString().slice(0, 10);
    revenueTrend[key] = (revenueTrend[key] ?? 0) + Number(inv.totalAmount);
  }

  // Live queue metrics 
  const activeQueues = await prisma.queue.findMany({
    where: {
      status: { notIn: ["COMPLETED", "CANCELLED"] },
    },
    include: {
      appointment: { 
        include: 
        { 
          triage: true 
        } 
      },
      patient: { 
        select: { 
          id: true 
        } 
      },
    },
  });

  const totalPatients = new Set(activeQueues.map((q) => q.patientId)).size;
  const triageBacklog = activeQueues.filter((q) => q.stage === "TRIAGE" && q.status === "WAITING").length;
  const activeConsultations = activeQueues.filter((q) => q.stage === "DOCTOR" && q.status === "PROCESSING").length;
  const criticalAlerts = activeQueues.filter((q) => q.appointment?.triage?.urgencyLevel === "CRITICAL").length;
  const pendingBilling = activeQueues.filter((q) => q.stage === "BILLING").length;

  // Stage breakdown 
  const stages = ["TRIAGE", "DOCTOR", "PHARMACY", "BILLING"];
  const totalActive = activeQueues.length || 1;
  const stageBreakdown = stages.map((stage) => {
    const count = activeQueues.filter((q) => q.stage === stage).length;
    return { stage, count, pct: Math.round((count / totalActive) * 100) };
  });

  // Service breakdown 
  const invoiceItems = await prisma.invoiceItem.findMany({
    where: { 
      invoice: invoiceWhere 
    },
    select: { 
      description: true, 
      unitPrice: true, 
      quantity: true 
    },
  });

  const serviceMap: Record<string, { count: number; revenue: number }> = {};
  for (const item of invoiceItems) {
    const name = item.description || "Unknown Service";

    if (!serviceMap[name]) serviceMap[name] = { count: 0, revenue: 0 };
    serviceMap[name].count += item.quantity || 1;
    serviceMap[name].revenue += Number(item.unitPrice) * (item.quantity || 1);
  }

  const serviceBreakdown = Object.entries(serviceMap)
    .map(([service, data]) => ({
      service,
      count: data.count,
      revenue: data.revenue,
    })).sort((a, b) => b.revenue - a.revenue);

  return {
    totalRevenue,
    appointmentVolume,
    revenueTrend,
    liveMetrics: {
      totalPatients,
      triageBacklog,
      activeConsultations,
      criticalAlerts,
      pendingBilling,
      totalRevenue,
    },
    stageBreakdown,
    serviceBreakdown,
  };
};
