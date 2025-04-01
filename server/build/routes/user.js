"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = exports.verifyToken = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_1 = require("../models/user");
const errors_1 = require("../models/errors");
const router = express_1.default.Router();
exports.userRouter = router;

// ✅ Register Route (With Type Safety)
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_1.UserModel.findOne({ username });
        if (user) {
            res.status(400).json({ type: errors_1.UserErrors.USERNAME_ALREADY_EXISTS });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = new user_1.UserModel({ username, password: hashedPassword });
        yield newUser.save();
        res.json({ message: "User registered successfully" });
    }
    catch (err) {
        res.status(500).json({ error: "Error registering user" });
    }
}));

// ✅ Login Route (With Type Safety)
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield user_1.UserModel.findOne({ username });
        if (!user) {
            res.status(400).json({ type: errors_1.UserErrors.NO_USER_FOUND });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ type: errors_1.UserErrors.WRONG_CREDENTIALS });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id }, "secret", { expiresIn: "1h" });
        res.json({ token, userID: user._id });
    }
    catch (err) {
        res.status(500).json({ error: "Error logging in" });
    }
}));

// ✅ Token Verification Middleware
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: "No token provided" });
        return;
    }
    jsonwebtoken_1.default.verify(authHeader, "secret", (err, decoded) => {
        if (err) {
            res.status(403).json({ error: "Invalid token" });
            return;
        }
        req.body.userID = decoded.id;
        next();
    });
};
exports.verifyToken = verifyToken;