import express from "express";
import { reviewCodeWithAI } from "../services/codeReviewService";

const router = express.Router();

router.post("/", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ message: "Code is required" });
  }

  try {
    const review = await reviewCodeWithAI(code);
    res.json({ aiReview: review });
  } catch (error) {
    console.error("Review Error:", error);
    res.status(500).json({ message: "Failed to review code" });
  }
});

export default router;
