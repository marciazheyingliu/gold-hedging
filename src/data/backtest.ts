// EXPORTS: BACKTEST_KPIS, generateBacktestCurveData, INFLATION_DISTRIBUTION, VIX_DISTRIBUTION

export interface KpiData {
  adaptive: number;
  static: number;
  stock: number;
}

export interface BacktestKpis {
  annualReturn: KpiData;
  maxDrawdown: KpiData;
  sharpe: KpiData;
  downsideProtection: number; // 自适应策略下行保护率（相对纯股票）
}

// 回测 KPI（mock 数据，基于合理金融假设）
export const BACKTEST_KPIS: BacktestKpis = {
  annualReturn: { adaptive: 11.8, static: 9.2, stock: 10.5 },
  maxDrawdown: { adaptive: -12.4, static: -18.6, stock: -28.3 },
  sharpe: { adaptive: 1.42, static: 0.98, stock: 0.76 },
  downsideProtection: 56.2, // 自适应策略相比纯股票减少了 56.2% 的最大回撤
};

/**
 * 生成模拟的累计收益曲线数据（2015-2024，月度数据）
 * 三条曲线：自适应策略 / 静态对冲 / 纯股票
 */
export function generateBacktestCurveData(): {
  dates: string[];
  adaptive: number[];
  static: number[];
  stock: number[];
} {
  const dates: string[] = [];
  const adaptive: number[] = [];
  const staticH: number[] = [];
  const stock: number[] = [];

  // 起点
  let a = 1;
  let s = 1;
  let st = 1;

  // 模拟 2015-2024 共 120 个月
  const startYear = 2015;
  const months = 120;

  // 关键事件（用于构造非对称特征）
  // 2015 股灾、2018 贸易战、2020 新冠、2022 加息通胀、2024 AI 行情
  const crisisMonths = [6, 7, 8, 42, 43, 60, 61, 62, 85, 86, 87]; // 危机月份索引（0-based）
  const rallyMonths = [12, 24, 36, 72, 100, 108, 115]; // 上涨月份

  for (let i = 0; i < months; i++) {
    const year = startYear + Math.floor(i / 12);
    const month = (i % 12) + 1;
    dates.push(`${year}-${String(month).padStart(2, '0')}`);

    // 基础月收益率
    const stockBase = 0.008; // 纯股票基础月收益约 0.8%
    const noise = (Math.sin(i * 1.3) + Math.cos(i * 0.7)) * 0.01;

    // 纯股票
    let stockRet = stockBase + noise * 0.5;
    // 危机月份：大跌
    if (crisisMonths.includes(i)) {
      stockRet -= 0.04 + Math.random() * 0.04;
    }
    // 上涨月份：大涨
    if (rallyMonths.includes(i)) {
      stockRet += 0.03 + Math.random() * 0.02;
    }

    // 静态对冲（10% 黄金固定配置）
    const goldRet = crisisMonths.includes(i)
      ? 0.025 + Math.random() * 0.02 // 危机时黄金上涨
      : rallyMonths.includes(i)
        ? -0.005 - Math.random() * 0.01 // 大涨时黄金微跌
        : 0.004 + noise * 0.2; // 平时黄金温和

    const staticRet = stockRet * 0.9 + goldRet * 0.1;

    // 自适应策略（根据市场状态动态调整黄金比例 5%-20%）
    const isHighStress = crisisMonths.includes(i) || crisisMonths.some((m) => Math.abs(m - i) <= 2);
    const goldWeight = isHighStress ? 0.2 : 0.05;
    const adaptiveRet = stockRet * (1 - goldWeight) + goldRet * goldWeight;

    st *= 1 + stockRet;
    s *= 1 + staticRet;
    a *= 1 + adaptiveRet;

    stock.push(Number((st * 100 - 100).toFixed(2)));
    staticH.push(Number((s * 100 - 100).toFixed(2)));
    adaptive.push(Number((a * 100 - 100).toFixed(2)));
  }

  return { dates, adaptive, static: staticH, stock };
}

// 市场状态分布（饼图数据）
export const INFLATION_DISTRIBUTION = [
  { name: 'high', value: 38 }, // 高通胀 38%
  { name: 'low', value: 62 }, // 低通胀 62%
];

export const VIX_DISTRIBUTION = [
  { name: 'high', value: 27 }, // 高VIX 27%
  { name: 'low', value: 73 }, // 低VIX 73%
];
