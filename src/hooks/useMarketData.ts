import { useState, useEffect, useCallback } from 'react';

export interface MarketData {
  goldPrice: number;
  goldPriceChange: number;
  vix: number;
  vixChange: number;
  inflation: number;
  interestRate: number; // 联邦基金利率/10年期国债收益率
  oilPrice: number; // WTI原油价格
  oilPriceChange: number;
  usdCny: number; // 美元兑人民币汇率
  usdEur: number; // 美元兑欧元汇率
  sp500: number; // 标普500
  sp500Change: number;
  lastUpdated: Date;
}

// 模拟真实市场数据获取
const fetchMarketData = async (): Promise<MarketData> => {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 生成真实感的模拟数据
  const baseGold = 2350; // 黄金基础价格
  const goldChange = (Math.random() - 0.5) * 50; // ±25美元波动
  const goldPrice = baseGold + goldChange;
  
  const baseVix = 18;
  const vixChange = (Math.random() - 0.5) * 8; // ±4点波动
  const vix = Math.max(10, baseVix + vixChange); // VIX 最小 10
  
  const inflation = 3.2 + (Math.random() - 0.5) * 1.5; // 2.45% - 3.95%
  
  // 利率 (10年期国债收益率)
  const interestRate = 4.2 + (Math.random() - 0.5) * 0.8; // 3.8% - 4.6%
  
  // 原油价格
  const baseOil = 78;
  const oilChange = (Math.random() - 0.5) * 8;
  const oilPrice = baseOil + oilChange;
  
  // 汇率
  const usdCny = 7.2 + (Math.random() - 0.5) * 0.1; // 7.15 - 7.25
  const usdEur = 0.93 + (Math.random() - 0.5) * 0.04; // 0.91 - 0.95
  
  // 标普500
  const baseSP500 = 5100;
  const sp500Change = (Math.random() - 0.5) * 100;
  const sp500 = baseSP500 + sp500Change;
  
  return {
    goldPrice: Number(goldPrice.toFixed(2)),
    goldPriceChange: Number(goldChange.toFixed(2)),
    vix: Number(vix.toFixed(2)),
    vixChange: Number(vixChange.toFixed(2)),
    inflation: Number(inflation.toFixed(2)),
    interestRate: Number(interestRate.toFixed(2)),
    oilPrice: Number(oilPrice.toFixed(2)),
    oilPriceChange: Number(oilChange.toFixed(2)),
    usdCny: Number(usdCny.toFixed(4)),
    usdEur: Number(usdEur.toFixed(4)),
    sp500: Math.round(sp500),
    sp500Change: Math.round(sp500Change),
    lastUpdated: new Date(),
  };
};

export function useMarketData() {
  const [data, setData] = useState<MarketData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchMarketData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch market data');
    } finally {
      setLoading(false);
    }
  }, []);

  // 判断市场状态
  const getMarketState = useCallback(() => {
    if (!data) return { volatility: 'normal', inflation: 'low', panic: 'low' };
    
    return {
      volatility: data.vix > 25 ? 'high' : data.vix < 15 ? 'low' : 'normal',
      inflation: data.inflation > 3 ? 'high' : 'low',
      panic: data.vix > 30 ? 'high' : 'low',
    };
  }, [data]);

  useEffect(() => {
    refreshData();
    
    // 每 60 秒刷新一次数据
    const interval = setInterval(refreshData, 60000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    data,
    loading,
    error,
    refreshData,
    getMarketState,
  };
}
