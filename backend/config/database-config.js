import dns from "dns";
import mongoose from "mongoose";

// Prefer public DNS to resolve Atlas SRV records if corporate DNS blocks SRV
dns.setServers(["8.8.8.8", "1.1.1.1"]);
// Optional: prefer IPv4 if your network has IPv6 issues
// require('dns').setDefaultResultOrder?.('ipv4first');

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Add it to backend/.env (see .env.example).",
    );
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected — new DB calls will buffer until reconnected.");
  });
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30_000,
      socketTimeoutMS: 45_000,
      maxPoolSize: 10,
      family: 4,
      // tls: true, // usually implied by mongodb+srv
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    throw err;
  }
};