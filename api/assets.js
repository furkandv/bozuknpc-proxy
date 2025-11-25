export default async function handler(req, res) {
  try {
    // TRUNCGIL
    const goldRes = await fetch("https://finans.truncgil.com/v4/today.json");
    const goldJson = await goldRes.json();

    const gram = goldJson["gram-altin"];
    if (!gram || !gram.selling) {
      throw new Error("Gram altın verisi bulunamadı");
    }

    const goldPrice = parseFloat(String(gram.selling).replace(",", "."));

    // USD
    const usdRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const usdJson = await usdRes.json();
    const usdPrice = usdJson.rates.TRY;

    // BTC
    const btcRes = await fetch("https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT");
    const btcJson = await btcRes.json();
    const btcTry = parseFloat(btcJson.price) * usdPrice;

    return res.status(200).json({
      success: true,
      assets: {
        "gram-altin": goldPrice,
        "usd": usdPrice,
        "btc": btcTry,
      }
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
}
