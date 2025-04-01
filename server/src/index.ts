import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/user";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/auth", userRouter);

// ✅ Use environment variables for security
const mongoURI = "mongodb+srv://fmp:v-v@fmp.txkwl.mongodb.net/vision-vogue-db?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Fix Port Issue (Use Dynamic Port)
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));