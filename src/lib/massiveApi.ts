// Utility to fetch real-time stock prices from Massive.com API
// Usage: getStockPrice(symbol)

const API_KEY = "d4h6p51r01qgvvc6bb6gd4h6p51r01qgvvc6bb70";

// Fetch real-time price for a symbol using Finnhub API
export async function getStockPrice(symbol: string) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch stock price");
  const data = await res.json();
  if (typeof data.c === "number" && !isNaN(data.c)) {
    return data.c;
  }
  throw new Error("Price not found in Finnhub response");
}

// For historical price, you may need another endpoint. This is a stub for future use.
export async function getHistoricalPrices(symbol: string) {
  // Placeholder: not implemented
  return [];
}
