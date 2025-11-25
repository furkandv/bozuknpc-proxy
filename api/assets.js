import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const goldRes = await fetch("https://hasanadiguzel.com.tr/api/altin");
    const goldJson = await goldRes.json();
    const gram = goldJson.result.data.find(x => x.name === "Gram Altın");
    const goldPrice = parseFloat(gram.selling.replace(/\./g, '').replace(',', '.'));

    const usdRes = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    const usdJson = await usdRes.json();
    const usdPrice = usdJson.rates.TRY;

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
      error: err.toString()
    });
  }
}
