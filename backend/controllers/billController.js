import { createBillInDb, addBillSplit, getBillsByTripId } from '../models/billModel.js';


export const createBill = async (req, res) => {
    try {
      const { tripId, description, amount, paidBy, splitType, splits } = req.body;
      if (!tripId || !description || !amount || !paidBy || !splitType || !splits || splits.length === 0) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      const bill = await createBill({ tripId, description, amount, paidBy, splitType });
      for (const split of splits) {
        await addBillSplit({ billId: bill.id, userId: split.userId, amount: split.amount });
      }
      res.status(201).json({ message: 'Bill created successfully', bill });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create bill' });
    }
  };

export const getTripBills = async (req, res) => {
    try {
        const { tripId } = req.params;
        const bills = await getBillsByTripId(tripId);
        res.status(200).json(bills);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get bills' });
    }
};

