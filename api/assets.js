export default async function handler(req, res) {
  try {
    // ---- ALTIN (Truncgil Finans) ----
    const goldRes = await fetch("https://finans.truncgil.com/v4/today.json");
    const goldJson = await goldRes.json();

    const goldRaw = goldJson["Gram Altın"]["Satış"]; // "2.377,88"
    const goldPrice = parseFloat(goldRaw.replace(/\./g, "").replace(",", "."));

    // ---- USD ----
    const usdRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const usdJson = await usdRes.json();
    const usdPrice = usdJson.rates.TRY;

    // ---- BTC ----
    const btcRes = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    const btcJson = await btcRes.json();
    const btcUsd = parseFloat(btcJson.price);
    const btcTry = btcUsd * usdPrice;

    return res.status(200).json({
      success: true,
      assets: {
        gram_altin: goldPrice,
        usd: usdPrice,
        btc: btcTry
      }
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message
    });
  }
}
