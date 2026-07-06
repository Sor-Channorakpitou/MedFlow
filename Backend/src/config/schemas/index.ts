import user from "./user.schema.js";
import patient from "./patient.schema.js";
import appointment from "./appointment.schema.js";
import medicalRecord from "./medicalRecord.schema.js";
import invoice from "./invoice.schema.js";
import invoiceItem from "./invoiceItem.schema.js";
import queue from "./queue.schema.js";

export default {
  ...user,
  ...patient,
  ...appointment,
  ...medicalRecord,
  ...invoice,
  ...invoiceItem,
  ...queue,
};