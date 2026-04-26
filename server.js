const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");
const JsConfuser = require("js-confuser");
const { webcrack } = require("webcrack"); // Pastikan 'npm install webcrack'

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.static(path.join(__dirname, "public")));

// ==========================================
// 🛡️ ANTI BYPASS & SECURITY MIDDLEWARE 🛡️
// ==========================================
const enableBypassProtection = (req, res, next) => {
  const { env } = process;
  const headers = req.headers;
  
  if (headers["x-forwarded-for"] && headers["via"]) {
    console.warn("[SECURITY] Suspicious Proxy Traffic Detected");
  }
  
  ["NODE_OPTIONS", "NODE_TLS_REJECT_UNAUTHORIZED"].forEach((key) => {
    if (env[key] && env[key] !== "1") {
      console.error(`[SECURITY] ENV ${key} tampered!`);
      return res.status(403).send("Security Violation - Halt");
    }
  });
  next();
};

// ==========================================
// 📝 FUNGSI ENKRIPSI HTML (SESUAI REQUEST)
// ==========================================
function encryptHTML(html) {
  let encrypted = "";
  for (let i = 0; i < html.length; i++) {
    encrypted += String.fromCharCode(html.charCodeAt(i) + 1);
  }
  const base64Encoded = Buffer.from(encrypted).toString("base64");
  
  return `<!DOCTYPE html>
<html>
<head>
<title>Andri nih boss</title>
<script>
function decrypt() {
    var encrypted = "${base64Encoded}";
    var decoded = atob(encrypted);
    var decrypted = "";
    for (var i = 0; i < decoded.length; i++) {
        decrypted += String.fromCharCode(decoded.charCodeAt(i) - 1);
    }
    document.write(decrypted);
}
</script>
</head>
<body onload="decrypt()">
<!-- KIW KIW MEWW-->
</body>
</html>`;
}

function decryptHTML(code) {
  const match = code.match(/var encrypted = "(.*?)";/);
  if (!match) throw new Error("Format HTML bukan milik Andri Systems.");
  const decoded = Buffer.from(match[1], "base64").toString("utf-8");
  let decrypted = "";
  for (let i = 0; i < decoded.length; i++) {
    decrypted += String.fromCharCode(decoded.charCodeAt(i) - 1);
  }
  return decrypted;
}

// ==========================================
// ⚙️ KONFIGURASI JS CONFUSER LENGKAP
// ==========================================

// 1. ANDRI CUSTOM (Request Utama)
const getAndriConfig = () => ({
  target: "node",
  preset: "high",
  compact: true,
  minify: true,
  flatten: true,
  identifierGenerator: function () {
    const originalString = "素晴座素晴難ANDRI素晴座素晴難" + "素晴座素晴難ANDRI素晴座素晴";
    function removeUnwantedChars(input) { return input.replace(/[^a-zA-Z座XemzzDev素ANNBotz素晴]/g, ''); }
    function randomString(length) {
      let result = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
      return result;
    }
    return removeUnwantedChars(originalString) + randomString(2);
  },
  renameVariables: true,
  renameGlobals: true,
  stringEncoding: true,
  stringSplitting: 0.0,
  stringConcealing: true,
  stringCompression: true,
  duplicateLiteralsRemoval: 1.0,
  shuffle: { hash: 0.0, true: 0.0 },
  stack: true,
  controlFlowFlattening: 1.0,
  opaquePredicates: 0.9,
  deadCode: 0.0,
  dispatcher: true,
  rgf: false,
  calculator: true,
  hexadecimalNumbers: true,
  movedDeclarations: true,
  objectExtraction: true,
  globalConcealing: true
});

// 2. Quantum Vortex
const getQuantumConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: () => "qV_" + crypto.randomBytes(3).toString("hex"),
  stringCompression: true, stringEncoding: true, controlFlowFlattening: 0.85,
  flatten: true, shuffle: true, rgf: true, opaquePredicates: { count: 8, complexity: 5 },
  dispatcher: true, globalConcealing: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true },
  duplicateLiteralsRemoval: true
});

// 3. Siu + Calcrick
const getSiuConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: () => "气CalceKarik和SiuSiu无" + crypto.randomBytes(3).toString("hex"),
  stringCompression: true, stringEncoding: true, stringSplitting: true,
  controlFlowFlattening: 0.95, shuffle: true, flatten: true, duplicateLiteralsRemoval: true,
  deadCode: true, calculator: true, opaquePredicates: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
});

// 4. Nebula
const getNebulaConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: () => "NX" + crypto.randomBytes(2).toString("hex").toUpperCase(),
  stringCompression: true, stringEncoding: true, controlFlowFlattening: 0.75,
  flatten: true, shuffle: true, rgf: true, deadCode: true, opaquePredicates: true,
  dispatcher: true, globalConcealing: true, objectExtraction: true, duplicateLiteralsRemoval: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
});

// 5. Nova
const getNovaConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: () => `nova_${crypto.createHash('sha256').update(crypto.randomBytes(8)).digest('hex').slice(0,6)}`,
  stringCompression: true, stringConcealing: true, stringEncoding: true,
  controlFlowFlattening: 0.5, flatten: true, shuffle: true, opaquePredicates: true,
  dispatcher: true, globalConcealing: true, objectExtraction: true, duplicateLiteralsRemoval: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
});

// 6. X Style
const getXConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: () => "xZ" + crypto.randomUUID().slice(0, 4),
  stringCompression: true, stringEncoding: true, controlFlowFlattening: 0.5,
  flatten: true, shuffle: true, rgf: true, dispatcher: true, objectExtraction: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
});

// 7. Max Style
const getMaxConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: () => "mX" + crypto.randomBytes(3).toString("hex"),
  stringCompression: true, stringConcealing: true, stringEncoding: true, stringSplitting: true,
  controlFlowFlattening: 1.0, flatten: true, shuffle: true, rgf: true, calculator: true,
  deadCode: true, opaquePredicates: true, dispatcher: true, globalConcealing: true, objectExtraction: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
});

// 8. Strong Style
const getStrongConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: "randomized", stringEncoding: true, stringSplitting: true,
  controlFlowFlattening: 0.75, duplicateLiteralsRemoval: true, calculator: true,
  dispatcher: true, deadCode: true, opaquePredicates: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
});

// 9. Big Style
const getBigConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: () => crypto.randomBytes(4).toString("hex"),
  stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.75,
  shuffle: true, duplicateLiteralsRemoval: true, deadCode: true, opaquePredicates: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
});

// 10. Invis Style
const getInvisConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: () => "___" + Math.random().toString(36).substring(2, 5),
  stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.95,
  shuffle: true, duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
});

// 11. Stealth Style
const getStealthConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: () => String.fromCharCode(97 + Math.floor(Math.random() * 26)),
  stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.75,
  shuffle: true, duplicateLiteralsRemoval: true, deadCode: true, opaquePredicates: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
});

// 12. Mandarin
const getMandarinConfig = () => {
  const chars = ["龙", "虎", "风", "云", "山", "河", "天", "地", "雷", "电", "火", "水"];
  return {
    target: "node", compact: true, renameVariables: true, renameGlobals: true,
    identifierGenerator: () => Array.from({length: 4}, () => chars[Math.floor(Math.random()*chars.length)]).join(''),
    stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.95, shuffle: true,
    duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
    lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
  };
};

// 13. Arab
const getArabConfig = () => {
  const chars = ["أ", "ب", "ت", "ث", "ج", "ح", "خ", "د", "ذ", "ر", "ز", "س", "ش"];
  return {
    target: "node", compact: true, renameVariables: true, renameGlobals: true,
    identifierGenerator: () => Array.from({length: 4}, () => chars[Math.floor(Math.random()*chars.length)]).join(''),
    stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.95, shuffle: true,
    duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
    lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
  };
};

// 14. Japan x Arab
const getJapanxArabConfig = () => {
  const chars = ["あ", "い", "う", "أ", "ب", "ت", "ث", "ら", "り"];
  return {
    target: "node", compact: true, renameVariables: true, renameGlobals: true,
    identifierGenerator: () => Array.from({length: 5}, () => chars[Math.floor(Math.random()*chars.length)]).join(''),
    stringCompression: true, stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.95,
    flatten: true, shuffle: true, dispatcher: true, deadCode: true, calculator: true, opaquePredicates: true,
    lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
  };
};

// 15. Ultra
const getUltraConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: () => `z${Math.floor(Math.random()*10)}` + crypto.randomBytes(2).toString("hex"),
  stringCompression: true, stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.9,
  flatten: true, shuffle: true, rgf: true, deadCode: true, opaquePredicates: true, dispatcher: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
});

// 16. Japan
const getJapanConfig = () => {
  const chars = ["あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ"];
  return {
    target: "node", compact: true, renameVariables: true, renameGlobals: true,
    identifierGenerator: () => Array.from({length: 4}, () => chars[Math.floor(Math.random()*chars.length)]).join(''),
    stringEncoding: true, stringSplitting: true, controlFlowFlattening: 0.9, flatten: true, shuffle: true,
    duplicateLiteralsRemoval: true, deadCode: true, calculator: true, opaquePredicates: true,
    lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
  };
};

// 17. New Style
const getNewConfig = () => ({
  target: "node", compact: true, renameVariables: true, renameGlobals: true,
  identifierGenerator: "mangled", stringEncoding: true, stringSplitting: true,
  controlFlowFlattening: 0.95, shuffle: true, duplicateLiteralsRemoval: true, deadCode: true,
  calculator: true, opaquePredicates: true,
  lock: { selfDefending: true, antiDebug: true, integrity: true, tamperProtection: true }
});

// ==========================================
// 🚀 API ENDPOINT
// ==========================================
app.post("/api/process", enableBypassProtection, async (req, res) => {
  const { code, mode, type, action } = req.body;

  try {
    let result = "";

    if (mode === "html") {
      result = action === "encrypt" ? encryptHTML(code) : decryptHTML(code);
    } else {
      if (action === "decrypt") {
        // Dekripsi menggunakan webcrack (sangat kuat untuk decode obfuscation)
        const cracked = await webcrack(code);
        result = cracked.code;
      } else {
        let config;
        switch (type) {
          case "andri": config = getAndriConfig(); break;
          case "quantum": config = getQuantumConfig(); break;
          case "siu": config = getSiuConfig(); break;
          case "nebula": config = getNebulaConfig(); break;
          case "nova": config = getNovaConfig(); break;
          case "x": config = getXConfig(); break;
          case "max": config = getMaxConfig(); break;
          case "strong": config = getStrongConfig(); break;
          case "big": config = getBigConfig(); break;
          case "invis": config = getInvisConfig(); break;
          case "stealth": config = getStealthConfig(); break;
          case "custom": config = getAndriConfig(); break; // Custom default
          case "mandarin": config = getMandarinConfig(); break;
          case "arab": config = getArabConfig(); break;
          case "japanxarab": config = getJapanxArabConfig(); break;
          case "ultra": config = getUltraConfig(); break;
          case "japan": config = getJapanConfig(); break;
          case "new": config = getNewConfig(); break;
          default: config = getAndriConfig();
        }

        const obfuscated = await JsConfuser.obfuscate(code, config);
        result = obfuscated.code || obfuscated;
      }
    }

    res.json({ success: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Front-End Route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server aktif di port ${PORT}`));

module.exports = app;