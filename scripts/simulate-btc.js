class Market {
  constructor(initPrice=100, liquidity=1000, alpha=0.1){
    this.price = initPrice;
    this.liquidity = liquidity;
    this.alpha = alpha;
    this.history = [];
  }

  step(buyers, sellers){
    const netDemand = buyers - sellers;
    const change = this.alpha * (netDemand / this.liquidity);
    this.price *= (1 + change);
    this.history.push({buyers, sellers, price: this.price});
    return this.price;
  }
}

// Example usage:
const m = new Market(100, 500, 0.5);

const buyersTable = [10, 20, 30, 40, 50, 60, 100, 80, 90, 400]
const sellersTable = [10, 90, 80, 70, 60, 0, 0, 30, 20, 10]

for(let t=0;t<10;t++){
  // you can decide buyers/sellers however you want:
  const buyers = buyersTable[t];
  const sellers = sellersTable[t];

  const price = m.step(buyers, sellers);
  console.log(`t=${t}, buyers=${buyers}, sellers=${sellers}, price=${price.toFixed(2)}`);
}
