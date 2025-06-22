const express = require("express");
const Mentalrouter = express.Router();
const predictMentalHealth = require("../utils/predictMentalHealth");

Mentalrouter.post("/predict-mental-health", async (req, res) => {
  try {
    const features = req.body;
    const prediction = await predictMentalHealth(features);
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: "Prediction failed", details: err.message });
  }
});

module.exports = Mentalrouter;
