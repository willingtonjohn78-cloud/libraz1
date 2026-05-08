const express = require("express");
const { readBookings, writeBookings } = require("../lib/bookingStore");
const { requireAdmin } = require("../middleware/adminAuth");

const router = express.Router();

const ALLOWED_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

function isValidPhone(phone) {
  return /^[0-9+\s-]{7,20}$/.test(phone || "");
}

function sanitizeOptional(value) {
  if (!value || !String(value).trim()) return null;
  return String(value).trim();
}

function sanitizeSelectedServices(input) {
  if (!Array.isArray(input)) return [];
  return input
    .map((item) => ({
      category: String(item?.category || "").trim(),
      service: String(item?.service || "").trim(),
      rateLabel: String(item?.rateLabel || "").trim(),
      amount: Number.isFinite(Number(item?.amount)) ? Number(item.amount) : null,
    }))
    .filter((item) => item.category && item.service);
}

function parseLbsNumber(id) {
  const match = /^LBS-(\d{5})$/.exec(String(id || ""));
  return match ? Number(match[1]) : null;
}

function generateBookingId(existingIds) {
  let max = 0;
  existingIds.forEach((id) => {
    const parsed = parseLbsNumber(id);
    if (parsed !== null && parsed > max) max = parsed;
  });
  const next = Math.min(max + 1, 99999);
  return `LBS-${String(next).padStart(5, "0")}`;
}

router.post("/", async (req, res) => {
  const name = String(req.body.name || "").trim();
  const phone = String(req.body.phone || "").trim();
  const email = sanitizeOptional(req.body.email);
  const promoCode = sanitizeOptional(req.body.promoCode);
  const selectedServices = sanitizeSelectedServices(req.body.selectedServices);
  const totalBill = Number.isFinite(Number(req.body.totalBill)) ? Number(req.body.totalBill) : 0;

  if (!name) {
    return res.status(400).json({ message: "Name is required." });
  }
  if (!phone || !isValidPhone(phone)) {
    return res.status(400).json({ message: "Valid phone number is required." });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }
  if (selectedServices.length === 0) {
    return res.status(400).json({ message: "Please select at least one service." });
  }

  try {
    const bookings = await readBookings();
    const existingIds = new Set(bookings.map((booking) => booking.id).filter(Boolean));
    const booking = {
      id: generateBookingId(existingIds),
      name,
      phone,
      email,
      promoCode,
      selectedServices,
      totalBill,
      status: "Pending",
      createdAt: new Date().toISOString(),
    };
    bookings.push(booking);
    await writeBookings(bookings);
    return res.status(201).json({ message: "Booking created.", booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to save booking." });
  }
});

router.get("/", requireAdmin, async (req, res) => {
  try {
    const bookings = await readBookings();
    bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json({ bookings });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch bookings." });
  }
});

router.patch("/:id/status", requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  try {
    const bookings = await readBookings();
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) {
      return res.status(404).json({ message: "Booking not found." });
    }

    bookings[index].status = status;
    await writeBookings(bookings);
    return res.json({ message: "Status updated.", booking: bookings[index] });
  } catch (error) {
    return res.status(500).json({ message: "Failed to update status." });
  }
});

module.exports = router;
