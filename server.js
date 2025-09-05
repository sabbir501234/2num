const express = require("express");
const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const app = express();
const port = 3000;

// Serve dashboard HTML
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.use(express.json());

// Initialize WhatsApp client
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on("qr", (qr) => {
    console.log("QR received, scan it in the website dashboard");
});

client.on("ready", () => {
    console.log("WhatsApp client is ready!");
});

client.initialize();

// Minimal API for number check
app.post("/api/check-number", async (req, res) => {
    const { number } = req.body;
    try {
        const registered = await client.isRegisteredUser(number);
        res.json({ number, registered });
    } catch (err) {
        res.status(500).json({ error: "Check failed", details: err.message });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});
