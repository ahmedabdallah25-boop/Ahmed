// The figures Part 15 puts on screen, checked against the amortisation itself.
// $30,000 at 7% APR, income-driven payment of $150/month for 5 years.
const P = 30000;
const APR = 0.07;
const PMT = 150;
const r = APR / 12;

let balance = P;
for (let m = 0; m < 60; m++) balance = balance * (1 + r) + -PMT;

console.log('interest billed, month 1 :', (P * r).toFixed(2)); // 175.00
console.log('paid over 60 months      :', (PMT * 60).toFixed(2)); // 9000.00
console.log('balance after 60 months  :', balance.toFixed(2)); // 31789.82 → 31,790 on screen
console.log('monthly shortfall        :', (P * r - PMT).toFixed(2)); // 25.00
