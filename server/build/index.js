"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./routes/user");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/auth", user_1.userRouter);
const mongoURI = "mongodb+srv://fmp:v-v@fmp.txkwl.mongodb.net/vision-vogue-db?retryWrites=true&w=majority";
mongoose_1.default.connect(mongoURI)
    .then(() => console.log(" MongoDB Connected Successfully"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server started on port ${PORT}`));
