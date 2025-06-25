import express from "express";
import symbolMap from "../utils/symbolMap";

const router = express.Router();

router.get("/symbol-map", (req, res) => {
  res.json(symbolMap);
});

export default router;
