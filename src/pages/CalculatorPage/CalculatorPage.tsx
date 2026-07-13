import { useState, useMemo, useEffect } from 'react';
import { Calculator as CalcIcon, TrendingDown, Shield, Info, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMarketData } from '@/hooks/useMarketData';
import {
  INDUSTRY_LIST,
  calculateGoldRatio,
  type IndustryKey,
  type RiskLevel,
  type MarketVolatility,
  type MarketInflation,
  type MarketPanic,
} from '@/data/strategy';

const getLangKey = (lang: 'zh-CN' | 'zh-TW' | 'en') => (lang.startsWith('zh') ? 'zh' : 'en');

export default function CalculatorPage() {
  const { t, lang } = useLanguage();
  const langKey = getLangKey(lang);
  const { data: marketData, getMarketState } = useMarketData();
  
  const [industry, setIndustry] = useState<IndustryKey>('tech');
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('moderate');
  const [volatility, setVolatility] = useState<MarketVolatility>('normal');
  const [inflation, setInflation] = useState<MarketInflation>('low');
  const [panic, setPanic] = useState<MarketPanic>('low');
  
  // Auto-fill market data from real-time data
  useEffect(() => {
    if (marketData) {
      const state = getMarketState();
      setVolatility(state.volatility);
      setInflation(state.inflation);
      setPanic(state.panic);
    }
  }, [marketData, getMarketState]);

  const result = useMemo(
    () =>
      calculateGoldRatio({
        industry,
        riskLevel,
        volatility,
        inflation,
        panic,
      }),
    [industry, riskLevel, volatility, inflation, panic],
  );

  const riskSliderValue = riskLevel === 'conservative' ? 0 : riskLevel === 'moderate' ? 1 : 2;
  const volSliderValue = volatility === 'low' ? 0 : volatility === 'normal' ? 1 : 2;

  const industryLabel = langKey === 'zh'
    ? INDUSTRY_LIST.find((i) => i.key === industry)?.zh ?? ''
    : INDUSTRY_LIST.find((i) => i.key === industry)?.en ?? '';

  // 对冲效果评级
  const hedgeEffect =
    result.goldRatio >= 18
      ? { level: langKey === 'zh' ? '强' : 'Strong', color: 'text-emerald-400', pct: 90 }
      : result.goldRatio >= 10
        ? { level: langKey === 'zh' ? '中' : 'Medium', color: 'text-[#D4AF37]', pct: 65 }
        : { level: langKey === 'zh' ? '弱' : 'Weak', color: 'text-gray-400', pct: 35 };

  // 下行保护强度
  const protectionPct = Math.round(result.goldRatio * 3.5);
  
  // 自动填充市场状态按钮文案
  const autoFillLabel = langKey === 'zh' ? '自动匹配市场状态' : 'Auto-fill Market State';

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <Badge
            variant="outline"
            className="mb-4 border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5"
          >
            <CalcIcon className="size-3.5 mr-1.5" />
            {langKey === 'zh' ? '实时计算' : 'Real-time Calculation'}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t('calc.title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('calc.subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Industry Select */}
            <Card className="bg-[#0f1622]/80 border-[#D4AF37]/15">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('calc.industry')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={industry} onValueChange={(v) => setIndustry(v as IndustryKey)}>
                  <SelectTrigger className="bg-[#1a2332] border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a2332] border-[#D4AF37]/20 text-white max-h-80">
                    {INDUSTRY_LIST.map((ind) => (
                      <SelectItem
                        key={ind.key}
                        value={ind.key}
                        className="focus:bg-[#D4AF37]/10 focus:text-[#D4AF37]"
                      >
                        {langKey === 'zh' ? ind.zh : ind.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Risk Preference */}
            <Card className="bg-[#0f1622]/80 border-[#D4AF37]/15">
              <CardHeader>
                <CardTitle className="text-lg text-white">{t('calc.risk')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Slider
                  value={[riskSliderValue]}
                  min={0}
                  max={2}
                  step={1}
                  onValueChange={(vals) => {
                    const v = vals[0];
                    setRiskLevel(v === 0 ? 'conservative' : v === 1 ? 'moderate' : 'aggressive');
                  }}
                  className="[&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37] [&_[data-orientation=horizontal]]:bg-white/10"
                />
                <div className="flex justify-between text-sm">
                  <span className={riskLevel === 'conservative' ? 'text-[#D4AF37] font-medium' : 'text-gray-500'}>
                    {t('calc.risk.conservative')}
                  </span>
                  <span className={riskLevel === 'moderate' ? 'text-[#D4AF37] font-medium' : 'text-gray-500'}>
                    {t('calc.risk.moderate')}
                  </span>
                  <span className={riskLevel === 'aggressive' ? 'text-[#D4AF37] font-medium' : 'text-gray-500'}>
                    {t('calc.risk.aggressive')}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Market Conditions */}
            <Card className="bg-[#0f1622]/80 border-[#D4AF37]/15">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg text-white">{t('calc.market')}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (marketData) {
                      const state = getMarketState();
                      setVolatility(state.volatility);
                      setInflation(state.inflation);
                      setPanic(state.panic);
                    }
                  }}
                  className="text-[#D4AF37] hover:text-[#D4AF37] hover:bg-[#D4AF37]/10"
                >
                  <Sparkles className="size-3.5 mr-1.5" />
                  {autoFillLabel}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Volatility */}
                <div>
                  <div className="flex justify-between mb-3">
                    <Label className="text-gray-300 text-sm">{t('calc.volatility')}</Label>
                    <Badge variant="outline" className="border-white/10 text-gray-400 text-xs">
                      {volatility === 'low'
                        ? t('calc.volatility.low')
                        : volatility === 'high'
                          ? t('calc.volatility.high')
                          : t('calc.volatility.normal')}
                    </Badge>
                  </div>
                  <Slider
                    value={[volSliderValue]}
                    min={0}
                    max={2}
                    step={1}
                    onValueChange={(vals) => {
                      const v = vals[0];
                      setVolatility(v === 0 ? 'low' : v === 1 ? 'normal' : 'high');
                    }}
                    className="[&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37] [&_[data-orientation=horizontal]]:bg-white/10"
                  />
                </div>

                {/* Inflation Switch */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-gray-300 text-sm">{t('calc.inflation')}</Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {langKey === 'zh' ? '开启后配置比例 +30%' : '+30% allocation when high'}
                    </p>
                  </div>
                  <Switch
                    checked={inflation === 'high'}
                    onCheckedChange={(checked) => setInflation(checked ? 'high' : 'low')}
                    className="data-[state=checked]:bg-[#D4AF37]"
                  />
                </div>

                {/* Panic Switch */}
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label className="text-gray-300 text-sm">{t('calc.panic')}</Label>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {langKey === 'zh' ? '开启后配置比例 +25%' : '+25% allocation when high'}
                    </p>
                  </div>
                  <Switch
                    checked={panic === 'high'}
                    onCheckedChange={(checked) => setPanic(checked ? 'high' : 'low')}
                    className="data-[state=checked]:bg-[#D4AF37]"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right: Result */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Main Result */}
            <Card className="bg-gradient-to-br from-[#D4AF37]/15 to-[#B8860B]/5 border-[#D4AF37]/30 sticky top-24">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Shield className="size-5 text-[#D4AF37]" />
                  {t('calc.result.title')}
                </CardTitle>
                <CardDescription className="text-gray-400 text-sm">
                  {industryLabel}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Big number */}
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm mb-1">{t('calc.result.ratio')}</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-6xl font-bold bg-gradient-to-r from-[#D4AF37] to-[#E8C96A] bg-clip-text text-transparent tabular-nums">
                      {result.goldRatio}
                    </span>
                    <span className="text-2xl text-[#D4AF37]/70">%</span>
                  </div>
                </div>

                {/* Hedge effect */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <TrendingDown className="size-3.5" />
                        {t('calc.result.effect')}
                      </span>
                      <span className={`font-medium ${hedgeEffect.color}`}>
                        {hedgeEffect.level}
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#D4AF37] to-[#E8C96A] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${hedgeEffect.pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <Shield className="size-3.5" />
                        {t('calc.result.protection')}
                      </span>
                      <span className="font-medium text-emerald-400">{protectionPct}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(protectionPct, 100)}%` }}
                        transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formula Breakdown */}
            <Card className="bg-[#0f1622]/80 border-[#D4AF37]/15">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Info className="size-4 text-[#D4AF37]" />
                  {t('calc.formula.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('calc.formula.base')}</span>
                  <span className="text-white font-mono">{result.calculation.baseRatio}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('calc.formula.industry')}</span>
                  <span className="text-white font-mono">×{result.calculation.industryFactor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">{t('calc.formula.market')}</span>
                  <span className="text-white font-mono">
                    ×{(1 + result.calculation.marketAdjustment).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/5 mt-2">
                  <span className="text-[#D4AF37] font-medium">{t('calc.formula.result')}</span>
                  <span className="text-[#D4AF37] font-bold font-mono">
                    {result.calculation.finalRatio}%
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
