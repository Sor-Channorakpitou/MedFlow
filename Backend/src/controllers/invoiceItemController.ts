import type { Request, Response, NextFunction } from "express";
import {createInvoiceItem, getInvoiceItemsByInvoice, updateInvoiceItem, deleteInvoiceItem } from "../services/invoiceItemService.js";

export const createInvoiceItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { invoiceId, unitPrice, description, type, quantity } = req.body;

    const item = await createInvoiceItem({
      invoiceId,
      unitPrice,
      description,
      type,
      quantity,
    });

    return res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const getInvoiceItemsByInvoiceController = async (req: Request, res: Response,next: NextFunction) => {
  try {
    const invoiceId = Number(req.params.invoiceId);

    if (isNaN(invoiceId)) {
      return res.status(400).json({ message: "Invalid invoice ID" });
    }

    const items = await getInvoiceItemsByInvoice(invoiceId);

    if (items.length === 0) {
      return res.status(404).json({ message: "No invoice items found" });
    }

    return res.json(items);
  } catch (error) {
    next(error);
  }
};

export const updateInvoiceItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    const { unitPrice, description, type, quantity } = req.body;

    const item = await updateInvoiceItem(id, {
        unitPrice,
        description,
        type,
        quantity,
    });

    return res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteInvoiceItemController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid item ID" });
    }

    await deleteInvoiceItem(id);

    return res.json({ message: "Invoice item deleted successfully" });
  } catch (error) {
    next(error);
  }
};