export default async function handler(req, res) {
  try {
    // --- TRUNCGIL API ---
    const goldRes = await fetch("https://finans.truncgil.com/v4/today.json");
    const goldJson = await goldRes.json();

    // 1) Öncelik: "GRA" anahtarı
    let goldKey = Object.keys(goldJson).find(
      (k) => k.toLowerCase() === "gra"
    );

    // 2) GRA yoksa: gram / altın içeren anahtar bul
    if (!goldKey) {
      goldKey = Object.keys(goldJson).find(
        (k) =>
          k.toLowerCase().includes("gram") ||
          k.toLowerCase().includes("alt")
      );
    }

    if (!goldKey) {
      throw new Error("Gram altın verisi bulunamadı");
    }

    const gram = goldJson[goldKey];

    if (!gram || !gram.Selling) {
      throw new Error("Gram altın 'Selling' fiyatı bulunamadı");
    }

    // SELLING fiyatını al
    const goldPrice = parseFloat(String(gram.Selling).replace(",", "."));

    // --- USD (TRY) ---
    const usdRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const usdJson = await usdRes.json();
    const usdPrice = usdJson.rates.TRY;

    // --- BTC fiyatı ---
    const btcRes = await fetch(
      "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT"
    );
    const btcJson = await btcRes.json();
    const btcTry = parseFloat(btcJson.price) * usdPrice;

    // --- RESPONSE ---
    return res.status(200).json({
      success: true,
      assets: {
        "gram-altin": goldPrice, // burada SELLING yansıyor
        usd: usdPrice,
        btc: btcTry,
      },
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString(),
    });
  }
}
