const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const BOOKINGS_FILE = path.join(DATA_DIR, "bookings.json");

let writeQueue = Promise.resolve();

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(BOOKINGS_FILE);
  } catch {
    await fs.writeFile(BOOKINGS_FILE, "[]", "utf8");
  }
}

async function readBookings() {
  await ensureDataFile();
  const raw = await fs.readFile(BOOKINGS_FILE, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeBookings(bookings) {
  writeQueue = writeQueue.then(() =>
    fs.writeFile(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), "utf8")
  );
  return writeQueue;
}

module.exports = {
  readBookings,
  writeBookings,
  BOOKINGS_FILE,
};
