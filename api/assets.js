export default async function handler(req, res) {
  try {
    const goldRes = await fetch("https://finans.truncgil.com/v4/today.json");
    const goldJson = await goldRes.json();

    const gram = goldJson["Gram Altın"];

    // "Satış" veya "Satis" olabilir → IKISINI DE DESTEKLE
    const rawGold =
      gram["Satış"] ??
      gram["Satis"] ??
      gram["satis"] ??
      gram["satış"];

    if (!rawGold) {
      throw new Error("ALTIN fiyatı JSON içinde bulunamadı");
    }

    const goldPrice = parseFloat(rawGold.replace(/\./g, "").replace(",", "."));

    // USD
    const usdRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const usdJson = await usdRes.json();
    const usdPrice = usdJson.rates.TRY;

    // BTC
    const btcRes = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    const btcJson = await btcRes.json();
    const btcUsd = parseFloat(btcJson.price);
    const btcTry = btcUsd * usdPrice;

    res.status(200).json({
      success: true,
      assets: {
        gram_altin: goldPrice,
        usd: usdPrice,
        btc: btcTry
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString()
    });
  }
}
