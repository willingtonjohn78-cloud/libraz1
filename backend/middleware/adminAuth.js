const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "librazadmin";

function requireAdmin(req, res, next) {
  const pass = req.headers["x-admin-password"];
  if (pass !== ADMIN_PASSWORD) {
    return res.status(401).json({ message: "Unauthorized admin access." });
  }
  next();
}

module.exports = {
  requireAdmin,
  ADMIN_PASSWORD,
};
