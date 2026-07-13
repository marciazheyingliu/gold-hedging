import { useMarketData } from '@/hooks/useMarketData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Globe, Fuel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLangKey } from '@/lib/lang-utils';

// 市场数据翻译配置
const marketTranslations = {
  'zh-CN': {
    title: '实时市场数据',
    gold: '黄金价格',
    vix: '恐慌指数 VIX',
    inflation: '通胀预期',
    interestRate: '10年期国债',
    oil: '原油价格',
    usdCny: 'USD/CNY',
    usdEur: 'USD/EUR',
    sp500: '标普500',
    high: '高',
    low: '低',
    normal: '正常',
    updated: '更新于',
    refresh: '刷新',
  },
  'zh-TW': {
    title: '實時市場數據',
    gold: '黃金價格',
    vix: '恐慌指數 VIX',
    inflation: '通脹預期',
    interestRate: '10年期國債',
    oil: '原油價格',
    usdCny: 'USD/CNY',
    usdEur: 'USD/EUR',
    sp500: '標普500',
    high: '高',
    low: '低',
    normal: '正常',
    updated: '更新於',
    refresh: '刷新',
  },
  'en': {
    title: 'Live Market Data',
    gold: 'Gold Price',
    vix: 'VIX Index',
    inflation: 'Inflation Exp',
    interestRate: '10Y Treasury',
    oil: 'Oil Price',
    usdCny: 'USD/CNY',
    usdEur: 'USD/EUR',
    sp500: 'S&P 500',
    high: 'High',
    low: 'Low',
    normal: 'Normal',
    updated: 'Updated',
    refresh: 'Refresh',
  },
};

export function MarketDataCard() {
  const { data, loading, refreshData } = useMarketData();
  const { lang } = useLanguage();
  const langKey = getLangKey(lang);
  const t = marketTranslations[lang as keyof typeof marketTranslations];

  const getStateLabel = (value: string) => {
    if (value === 'high') return t.high;
    if (value === 'low') return t.low;
    return t.normal;
  };

  const getStateColor = (value: string) => {
    if (value === 'high') return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (value === 'low') return 'text-green-400 bg-green-500/10 border-green-500/20';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  };

  const marketState = data ? {
    volatility: data.vix > 25 ? 'high' : data.vix < 15 ? 'low' : 'normal',
    inflation: data.inflation > 3 ? 'high' : 'low',
    panic: data.vix > 30 ? 'high' : 'low',
  } : null;

  return (
    <Card className="bg-[#0f1622]/80 border-[#D4AF37]/20 backdrop-blur-sm">
      <CardHeader className="pb-4 flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <BarChart3 className="size-5 text-[#D4AF37]" />
          {t.title}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshData}
          disabled={loading}
          className="text-gray-400 hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
        >
          <RefreshCw className={`size-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {t.refresh}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <Skeleton className="h-4 w-24 bg-white/10" />
                <Skeleton className="h-6 w-32 bg-white/10" />
              </div>
            ))}
          </div>
        ) : data ? (
          <>
            {/* 第一行：黄金 + 原油 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between py-2 bg-white/5 rounded-lg px-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-[#B8860B]/20 flex items-center justify-center">
                    <DollarSign className="size-3.5 text-[#D4AF37]" />
                  </div>
                  <span className="text-gray-400 text-xs">{t.gold}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm">
                    ${data.goldPrice.toLocaleString()}
                  </div>
                  <div className={`text-xs flex items-center justify-end gap-1 ${
                    data.goldPriceChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {data.goldPriceChange >= 0 ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {data.goldPriceChange >= 0 ? '+' : ''}{data.goldPriceChange.toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 bg-white/5 rounded-lg px-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <Fuel className="size-3.5 text-orange-400" />
                  </div>
                  <span className="text-gray-400 text-xs">{t.oil}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm">
                    ${data.oilPrice.toFixed(2)}
                  </div>
                  <div className={`text-xs flex items-center justify-end gap-1 ${
                    data.oilPriceChange >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {data.oilPriceChange >= 0 ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {data.oilPriceChange >= 0 ? '+' : ''}{data.oilPriceChange.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* 第二行：VIX + 标普500 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between py-2 bg-white/5 rounded-lg px-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                    <Activity className="size-3.5 text-orange-400" />
                  </div>
                  <span className="text-gray-400 text-xs">{t.vix}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm">{data.vix.toFixed(2)}</div>
                  <div className="flex items-center justify-end gap-1">
                    <Badge variant="outline" className={getStateColor(marketState?.volatility || 'normal')}>
                      {getStateLabel(marketState?.volatility || 'normal')}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 bg-white/5 rounded-lg px-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-gradient-to-br from-green-500/20 to-teal-500/20 flex items-center justify-center">
                    <BarChart3 className="size-3.5 text-green-400" />
                  </div>
                  <span className="text-gray-400 text-xs">{t.sp500}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm">
                    {data.sp500.toLocaleString()}
                  </div>
                  <div className={`text-xs flex items-center justify-end gap-1 ${
                    data.sp500Change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {data.sp500Change >= 0 ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {data.sp500Change >= 0 ? '+' : ''}{data.sp500Change}
                  </div>
                </div>
              </div>
            </div>

            {/* 第三行：通胀 + 利率 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between py-2 bg-white/5 rounded-lg px-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                    <BarChart3 className="size-3.5 text-purple-400" />
                  </div>
                  <span className="text-gray-400 text-xs">{t.inflation}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm">{data.inflation.toFixed(2)}%</div>
                  <div className="flex items-center justify-end gap-1">
                    <Badge variant="outline" className={getStateColor(marketState?.inflation || 'low')}>
                      {getStateLabel(marketState?.inflation || 'low')}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 bg-white/5 rounded-lg px-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                    <Activity className="size-3.5 text-blue-400" />
                  </div>
                  <span className="text-gray-400 text-xs">{t.interestRate}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm">{data.interestRate.toFixed(2)}%</div>
                </div>
              </div>
            </div>

            {/* 第四行：汇率 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between py-2 bg-white/5 rounded-lg px-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <Globe className="size-3.5 text-cyan-400" />
                  </div>
                  <span className="text-gray-400 text-xs">{t.usdCny}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm">{data.usdCny.toFixed(4)}</div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2 bg-white/5 rounded-lg px-3">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                    <Globe className="size-3.5 text-cyan-400" />
                  </div>
                  <span className="text-gray-400 text-xs">{t.usdEur}</span>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold text-sm">{data.usdEur.toFixed(4)}</div>
                </div>
              </div>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-gray-500 text-right pt-2">
              {t.updated}: {data.lastUpdated.toLocaleTimeString()}
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
