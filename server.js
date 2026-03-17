const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 8097);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT_DIR = __dirname;
const STATIC_DIR = path.join(ROOT_DIR, "public");
const DATA_DIR = path.join(ROOT_DIR, "data");
const DATA_FILE = path.join(DATA_DIR, "submissions.json");
const MAX_BODY_SIZE_BYTES = 1024 * 1024; // 1MB

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

let writeQueue = Promise.resolve();

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]\n", "utf8");
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function setSecurityHeaders(res) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
}

function normalizeText(input) {
  return String(input || "")
    .replace(/\s+/g, " ")
    .trim();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d+\-() ]{7,20}$/.test(phone);
}

function validateCommonFields(payload) {
  const name = normalizeText(payload.name);
  const email = normalizeText(payload.email).toLowerCase();
  const phone = normalizeText(payload.phone);
  const message = normalizeText(payload.message);

  const errors = [];
  if (name.length < 2) errors.push("Please enter a valid name.");
  if (!isValidEmail(email)) errors.push("Please enter a valid email.");
  if (!isValidPhone(phone)) errors.push("Please enter a valid phone number.");
  if (message.length < 10) errors.push("Please enter a longer message.");

  return { name, email, phone, message, errors };
}

function validateContactPayload(payload) {
  const common = validateCommonFields(payload);
  const subject = normalizeText(payload.subject || "General Enquiry");
  return {
    ...common,
    subject,
  };
}

function validateAdmissionPayload(payload) {
  const common = validateCommonFields(payload);
  const course = normalizeText(payload.course);
  const educationLevel = normalizeText(payload.educationLevel);

  const errors = [...common.errors];
  if (course.length < 3) errors.push("Please select a course.");
  if (educationLevel.length < 2) errors.push("Please select your education level.");

  return {
    ...common,
    course,
    educationLevel,
    errors,
  };
}

async function appendSubmission(submission) {
  writeQueue = writeQueue.then(async () => {
    await ensureDataFile();
    let rows = [];
    try {
      const raw = await fs.readFile(DATA_FILE, "utf8");
      rows = JSON.parse(raw);
      if (!Array.isArray(rows)) rows = [];
    } catch {
      rows = [];
    }
    rows.unshift(submission);
    await fs.writeFile(DATA_FILE, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
  });
  return writeQueue;
}

async function readJsonBody(req) {
  const contentType = req.headers["content-type"] || "";
  if (!contentType.includes("application/json")) {
    throw new Error("Unsupported content type");
  }

  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (Buffer.byteLength(body) > MAX_BODY_SIZE_BYTES) {
      throw new Error("Payload too large");
    }
  }

  try {
    return JSON.parse(body || "{}");
  } catch {
    throw new Error("Invalid JSON");
  }
}

function createSubmission(type, payload, req) {
  return {
    id: crypto.randomUUID(),
    type,
    ...payload,
    createdAt: new Date().toISOString(),
    ip:
      req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "",
    userAgent: req.headers["user-agent"] || "",
  };
}

async function serveStatic(req, res) {
  const requestedPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
  const safePath = path.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, "");
  let filePath = path.join(STATIC_DIR, safePath);

  if (requestedPath === "/") {
    filePath = path.join(STATIC_DIR, "index.html");
  }

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
  } catch {
    // No-op. We fallback below.
  }

  try {
    const data = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    setSecurityHeaders(res);
    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400",
    });
    res.end(data);
    return;
  } catch {
    // For pretty URLs in static SPA mode, return index.html.
    if (!path.extname(filePath)) {
      try {
        const indexData = await fs.readFile(path.join(STATIC_DIR, "index.html"));
        setSecurityHeaders(res);
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        });
        res.end(indexData);
        return;
      } catch {
        // fall through
      }
    }
  }

  sendJson(res, 404, { ok: false, error: "Not found" });
}

const server = http.createServer(async (req, res) => {
  try {
    setSecurityHeaders(res);

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      });
      res.end();
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === "GET" && url.pathname === "/api/health") {
      sendJson(res, 200, { ok: true, service: "trauma-rehab-centre-site" });
      return;
    }

    if (req.method === "GET" && url.pathname === "/api/submissions") {
      await ensureDataFile();
      const type = normalizeText(url.searchParams.get("type"));
      const limit = Math.max(1, Math.min(200, Number(url.searchParams.get("limit") || 50)));
      const raw = await fs.readFile(DATA_FILE, "utf8");
      let rows = [];
      try {
        rows = JSON.parse(raw);
      } catch {
        rows = [];
      }
      if (!Array.isArray(rows)) rows = [];
      const filtered = type ? rows.filter((entry) => entry.type === type) : rows;
      sendJson(res, 200, { ok: true, total: filtered.length, submissions: filtered.slice(0, limit) });
      return;
    }

     if (req.method === "POST" && url.pathname === "/api/contact") {
      const body = await readJsonBody(req);
      const parsed = validateContactPayload(body);
      if (parsed.errors.length > 0) {
        sendJson(res, 400, { ok: false, errors: parsed.errors });
        return;
      }
      const { errors: _errors, ...cleanPayload } = parsed;

      const submission = createSubmission("contact", cleanPayload, req);
      await appendSubmission(submission);
      sendJson(res, 201, {
        ok: true,
        message: "Thank you. Your message has been submitted successfully.",
        id: submission.id,
      });
      return;
    }

    if (req.method === "POST" && url.pathname === "/api/admissions") {
      const body = await readJsonBody(req);
      const parsed = validateAdmissionPayload(body);
      if (parsed.errors.length > 0) {
        sendJson(res, 400, { ok: false, errors: parsed.errors });
        return;
      }
      const { errors: _errors, ...cleanPayload } = parsed;

      const submission = createSubmission("admission", cleanPayload, req);
      await appendSubmission(submission);
      sendJson(res, 201, {
        ok: true,
        message: "Application submitted. Our admissions team will contact you soon.",
        id: submission.id,
      });
      return;
    }

    if (req.method === "GET" || req.method === "HEAD") {
      await serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { ok: false, error: "Method not allowed" });
  } catch (error) {
    if (String(error.message).includes("Payload too large")) {
      sendJson(res, 413, { ok: false, error: "Payload too large" });
      return;
    }
    if (String(error.message).includes("Unsupported content type")) {
      sendJson(res, 415, { ok: false, error: "Content-Type must be application/json" });
      return;
    }
    if (String(error.message).includes("Invalid JSON")) {
      sendJson(res, 400, { ok: false, error: "Invalid JSON payload" });
      return;
    }

    console.error("Server error:", error);
    sendJson(res, 500, { ok: false, error: "Internal server error" });
  }
});

server.listen(PORT, HOST, async () => {
  await ensureDataFile();
  console.log(`Trauma & Rehabilitation Centre site running on http://${HOST}:${PORT}`);
});
