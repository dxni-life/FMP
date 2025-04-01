import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user"; 
import { UserErrors } from "../models/errors";

const router = express.Router();

// ✅ Register Route (With Type Safety)
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });
    if (user) {
      res.status(400).json({ type: UserErrors.USERNAME_ALREADY_EXISTS });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new UserModel({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error registering user" });
  }
});

// ✅ Login Route (With Type Safety)
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      res.status(400).json({ type: UserErrors.NO_USER_FOUND });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ type: UserErrors.WRONG_CREDENTIALS });
      return;
    }
    const token = jwt.sign({ id: user._id }, "secret", { expiresIn: "1h" });
    res.json({ token, userID: user._id });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// ✅ Token Verification Middleware
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  jwt.verify(authHeader, "secret", (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Invalid token" });
      return;
    }
    req.body.userID = (decoded as { id: string }).id;
    next();
  });
};

// ✅ Protected Route Example
router.get("/available-money/:userID", verifyToken, async (req: Request, res: Response): Promise<void> => {
  const { userID } = req.params;
  try {
    const user = await UserModel.findById(userID);
    if (!user) {
      res.status(400).json({ type: UserErrors.NO_USER_FOUND });
      return;
    }
    res.json({ availableMoney: user.availableMoney || 0 });
  } catch (err) {
    res.status(500).json({ error: "Error retrieving available money" });
  }
});

export { router as userRouter };