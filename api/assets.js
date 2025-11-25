export default async function handler(req, res) {
  try {
    // TEK API: Truncgil v4
    const response = await fetch("https://finans.truncgil.com/v4/today.json");
    const data = await response.json();

    // GRAM ALTIN (GRA -> Selling)
    const goldTry = data?.GRA?.Selling;
    if (typeof goldTry !== "number") {
      throw new Error("Gram altın fiyatı (GRA.Selling) bulunamadı");
    }

    // USD/TL (USD -> Selling)
    const usdTry = data?.USD?.Selling;
    if (typeof usdTry !== "number") {
      throw new Error("USD/TL kuru (USD.Selling) bulunamadı");
    }

    // BTC/TRY (BTC -> TRY_Price veya Selling)
    const btcTry =
      typeof data?.BTC?.TRY_Price === "number"
        ? data.BTC.TRY_Price
        : data?.BTC?.Selling;

    if (typeof btcTry !== "number") {
      throw new Error("BTC fiyatı (BTC.TRY_Price / BTC.Selling) bulunamadı");
    }

    // Flutter için temiz JSON dön
    return res.status(200).json({
      success: true,
      assets: {
        gram_altin: goldTry,
        usd: usdTry,
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
