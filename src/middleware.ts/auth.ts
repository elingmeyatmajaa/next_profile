import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken, getTokenFromHeader } from "../lib/auth";

export const authMiddleware = (handler: Function) => async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = verifyToken(token);
    (req as any).user = decoded;
    return handler(req, res);
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
