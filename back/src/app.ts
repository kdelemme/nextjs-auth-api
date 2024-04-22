import bcrypt from "bcrypt";
import cors from "cors";
import crypto from "crypto";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { v4 as uuidv4 } from "uuid";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ credentials: true, origin: "*" }));
app.use(express.json());

const port = process.env.PORT || 5000;
const router = express.Router();

// Using in memory storage: replace with db client
const FAKE_USERS_DB: Record<string, { password: string; accessToken: string }> =
  {};

router.post(
  "/auth/register",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Add extra validation on the body payload
    // and check for user existence
    const sanitizedEmail = email.toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 12);
    const accessToken = crypto
      .createHash("sha256")
      .update(uuidv4())
      .digest("hex");

    // 2. Using in memory storage: replace with db client
    FAKE_USERS_DB[sanitizedEmail] = {
      password: hashedPassword,
      accessToken: accessToken,
    };

    // 3. return the session object upon registering to avoid need for signin
    // Could add extra information, e.g. roles, ...
    res.json({
      accessToken: accessToken,
      email: sanitizedEmail,
    });
  })
);

router.post(
  "/auth/credentials-signin",
  asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // 1. Add extra validation on the body payload and user existence
    const sanitizedEmail = email.toLowerCase();
    const user = FAKE_USERS_DB[sanitizedEmail];
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // 2. return the session object.
    // Could generate a new token upon login if needed
    // Could add extra information, e.g. roles, ...
    res.json({
      email: sanitizedEmail,
      accessToken: user.accessToken,
    });
  })
);

// Checks if the accessToken is still valid
// Could return a new accessToken when valid to avoid session expiration
router.post(
  "/auth/session",
  asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authorization.split(" ")[1];
    const user = Object.values(FAKE_USERS_DB).find(
      (user) => user.accessToken === token
    );
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.status(200).json({});
  })
);

// Protected routes: require a valid accessToken
router.get(
  "/secure",
  asyncHandler(async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authorization.split(" ")[1];
    const user = Object.values(FAKE_USERS_DB).find(
      (user) => user.accessToken === token
    );
    if (!user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    res.status(200).json({ message: "Protected response" });
  })
);

function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      return await handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
}

app.use(router);

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
