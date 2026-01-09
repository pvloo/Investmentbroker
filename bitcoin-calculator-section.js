    // <!-- ================== JAVASCRIPT FUNCTION ================== -->

const btcInput = document.getElementById("btc-value");
const currencyInput = document.getElementById("currency-value");
const currencySelect = document.getElementById("currency-select");

let currentPrice = 0;

// Fetch Bitcoin price
async function fetchBitcoinPrice() {
  const currency = currencySelect.value;

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${currency}`
    );
    const data = await response.json();
    currentPrice = data.bitcoin[currency];
    convertFromBTC(); // Update immediately when fetched
  } catch (error) {
    console.error("Error fetching BTC price:", error);
  }
}

// Convert from BTC to selected currency
function convertFromBTC() {
  const btcValue = parseFloat(btcInput.value) || 0;
  const total = btcValue * currentPrice;
  currencyInput.value = total.toFixed(2);
}

// Convert from currency to BTC
function convertFromCurrency() {
  const currencyValue = parseFloat(currencyInput.value) || 0;
  const btcAmount = currencyValue / currentPrice;
  btcInput.value = btcAmount.toFixed(8);
}

// Event listeners
btcInput.addEventListener("input", convertFromBTC);
currencyInput.addEventListener("input", convertFromCurrency);
currencySelect.addEventListener("change", fetchBitcoinPrice);

// Initial fetch
fetchBitcoinPrice();