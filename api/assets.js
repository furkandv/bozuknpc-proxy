export default async function handler(req, res) {
  try {
    // ---- ALTIN (GenelPara) ----
    const goldRes = await fetch("https://api.genelpara.com/embed/altin.json");
    const goldJson = await goldRes.json();

    const gram = goldJson.GA;
    const goldPrice = parseFloat(
      gram.satis.replace(".", "").replace(",", ".")
    );

    // ---- USD ----
    const usdRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const usdJson = await usdRes.json();
    const usdPrice = usdJson.rates.TRY;

    // ---- BTC ----
    const btcRes = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const btcJson = await btcRes.json();
    const btcUsd = parseFloat(btcJson.price);
    const btcTry = btcUsd * usdPrice;

    return res.status(200).json({
      success: true,
      assets: {
        gram_altin: goldPrice,
        usd: usdPrice,
        btc: btcTry,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
}
