const axios = require("axios");

async function predictMentalHealth(features) {
  const response = await axios.post(
    "https://mental-health-model-z4uu.onrender.com/predict",
    features
  );
  return response.data;
}
module.exports = predictMentalHealth;
