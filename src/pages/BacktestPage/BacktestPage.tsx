import { useMemo } from 'react';
import { useTheme } from 'next-themes';
import ReactECharts from 'echarts-for-react';
import { LineChart, TrendingUp, TrendingDown, Target, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLangKey } from '@/lib/lang-utils';
import {
  BACKTEST_KPIS,
  generateBacktestCurveData,
  INFLATION_DISTRIBUTION,
  VIX_DISTRIBUTION,
} from '@/data/backtest';
import { CURVE_COLORS, CHART_COLORS, PIE_COLORS } from '@/lib/chart-colors';

const kpiIcons = {
  annual: TrendingUp,
  drawdown: TrendingDown,
  sharpe: Target,
  protection: Shield,
};

export default function BacktestPage() {
  const { t, lang } = useLanguage();
  const langKey = getLangKey(lang);

  const curveData = useMemo(() => generateBacktestCurveData(), []);

  // 收益曲线 option
  const curveOption = useMemo(() => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(26, 35, 50, 0.95)',
        borderColor: 'rgba(212, 175, 55, 0.3)',
        textStyle: { color: '#fff', fontSize: 12 },
        valueFormatter: (v: number) => `${v.toFixed(2)}%`,
      },
      legend: {
        data: [
          langKey === 'zh' ? '自适应策略' : 'Adaptive',
          langKey === 'zh' ? '静态对冲' : 'Static Hedge',
          langKey === 'zh' ? '纯股票' : 'Pure Stocks',
        ],
        textStyle: { color: '#8b9bb4', fontSize: 12 },
        top: 0,
        right: 0,
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: 40,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: curveData.dates,
        axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
        axisLabel: {
          color: '#8b9bb4',
          fontSize: 11,
          formatter: (value: string) => value.slice(0, 7),
        },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: {
          color: '#8b9bb4',
          fontSize: 11,
          formatter: '{value}%',
        },
        splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } },
      },
      series: [
        {
          name: langKey === 'zh' ? '自适应策略' : 'Adaptive',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2.5, color: CURVE_COLORS.adaptive },
          itemStyle: { color: CURVE_COLORS.adaptive },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(212, 175, 55, 0.25)' },
                { offset: 1, color: 'rgba(212, 175, 55, 0)' },
              ],
            },
          },
          data: curveData.adaptive,
        },
        {
          name: langKey === 'zh' ? '静态对冲' : 'Static Hedge',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: CURVE_COLORS.static },
          itemStyle: { color: CURVE_COLORS.static },
          data: curveData.static,
        },
        {
          name: langKey === 'zh' ? '纯股票' : 'Pure Stocks',
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: CURVE_COLORS.stock, type: 'dashed' },
          itemStyle: { color: CURVE_COLORS.stock },
          data: curveData.stock,
        },
      ],
    };
  }, [curveData, lang]);

  // 饼图 option 工厂
  const makePieOption = (data: Array<{ name: string; value: number }>, labels: { high: string; low: string }) => {
    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(26, 35, 50, 0.95)',
        borderColor: 'rgba(212, 175, 55, 0.3)',
        textStyle: { color: '#fff', fontSize: 12 },
        formatter: '{b}: {c}%',
      },
      legend: {
        bottom: 0,
        textStyle: { color: '#8b9bb4', fontSize: 12 },
      },
      series: [
        {
          type: 'pie',
          radius: ['55%', '75%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: 'transparent',
            borderWidth: 2,
          },
          label: {
            show: true,
            position: 'center',
            formatter: () => {
              const highItem = data.find((d) => d.name === 'high');
              return `{a|${highItem?.value ?? 0}%}\n{b|${labels.high}}`;
            },
            rich: {
              a: {
                fontSize: 28,
                fontWeight: 'bold',
                color: CHART_COLORS.gold,
                lineHeight: 36,
              },
              b: {
                fontSize: 12,
                color: '#8b9bb4',
                lineHeight: 20,
              },
            },
          },
          labelLine: { show: false },
          data: data.map((d) => ({
            value: d.value,
            name: d.name === 'high' ? labels.high : labels.low,
            itemStyle: {
              color: d.name === 'high' ? PIE_COLORS.high : PIE_COLORS.low,
            },
          })),
        },
      ],
    };
  };

  const inflationOption = useMemo(
    () =>
      makePieOption(INFLATION_DISTRIBUTION, {
        high: langKey === 'zh' ? '高通胀' : 'High Inflation',
        low: langKey === 'zh' ? '低通胀' : 'Low Inflation',
      }),
    [langKey],
  );

  const vixOption = useMemo(
    () =>
      makePieOption(VIX_DISTRIBUTION, {
        high: langKey === 'zh' ? '高VIX' : 'High VIX',
        low: langKey === 'zh' ? '低VIX' : 'Low VIX',
      }),
    [langKey],
  );

  const kpiCards = [
    {
      key: 'annual',
      label: t('backtest.kpi.annual'),
      icon: kpiIcons.annual,
      adaptive: BACKTEST_KPIS.annualReturn.adaptive,
      static: BACKTEST_KPIS.annualReturn.static,
      stock: BACKTEST_KPIS.annualReturn.stock,
      format: (v: number) => `${v > 0 ? '+' : ''}${v.toFixed(1)}%`,
      positiveIsGood: true,
    },
    {
      key: 'drawdown',
      label: t('backtest.kpi.drawdown'),
      icon: kpiIcons.drawdown,
      adaptive: BACKTEST_KPIS.maxDrawdown.adaptive,
      static: BACKTEST_KPIS.maxDrawdown.static,
      stock: BACKTEST_KPIS.maxDrawdown.stock,
      format: (v: number) => `${v.toFixed(1)}%`,
      positiveIsGood: false,
    },
    {
      key: 'sharpe',
      label: t('backtest.kpi.sharpe'),
      icon: kpiIcons.sharpe,
      adaptive: BACKTEST_KPIS.sharpe.adaptive,
      static: BACKTEST_KPIS.sharpe.static,
      stock: BACKTEST_KPIS.sharpe.stock,
      format: (v: number) => v.toFixed(2),
      positiveIsGood: true,
    },
    {
      key: 'protection',
      label: t('backtest.kpi.protection'),
      icon: kpiIcons.protection,
      adaptive: BACKTEST_KPIS.downsideProtection,
      static: null,
      stock: null,
      format: (v: number) => `${v.toFixed(1)}%`,
      positiveIsGood: true,
      singleValue: true,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
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
            <LineChart className="size-3.5 mr-1.5" />
            {langKey === 'zh' ? '历史回测' : 'Historical Backtest'}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t('backtest.title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('backtest.subtitle')}</p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {kpiCards.map((kpi, i) => {
            const Icon = kpi.icon;
            const isBest =
              !kpi.singleValue &&
              (kpi.positiveIsGood
                ? kpi.adaptive === Math.max(kpi.adaptive, kpi.static!, kpi.stock!)
                : kpi.adaptive === Math.min(kpi.adaptive, kpi.static!, kpi.stock!));
            return (
              <Card
                key={kpi.key}
                className={`bg-[#0f1622]/80 border ${
                  isBest ? 'border-[#D4AF37]/40' : 'border-white/10'
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={`size-4 ${isBest ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                    <span className="text-sm text-gray-400">{kpi.label}</span>
                    {isBest && (
                      <Badge className="ml-auto text-[10px] h-5 bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30">
                        {langKey === 'zh' ? '最优' : 'Best'}
                      </Badge>
                    )}
                  </div>
                  {kpi.singleValue ? (
                    <div className="text-2xl md:text-3xl font-bold text-[#D4AF37] tabular-nums">
                      {kpi.format(kpi.adaptive)}
                    </div>
                  ) : (
                    <>
                      <div className="text-2xl md:text-3xl font-bold text-white tabular-nums mb-3">
                        {kpi.format(kpi.adaptive)}
                      </div>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            {langKey === 'zh' ? '静态对冲' : 'Static'}
                          </span>
                          <span className="text-gray-400 tabular-nums">
                            {kpi.format(kpi.static!)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">
                            {langKey === 'zh' ? '纯股票' : 'Stocks'}
                          </span>
                          <span className="text-gray-400 tabular-nums">
                            {kpi.format(kpi.stock!)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <Card className="bg-[#0f1622]/80 border-white/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">
                {t('backtest.chart.curve')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={curveOption}
                style={{ height: 400 }}
                opts={{ renderer: 'canvas' }}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Pie Charts Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <Card className="bg-[#0f1622]/80 border-white/10">
            <CardHeader className="pb-0">
              <CardTitle className="text-base text-white">
                {t('backtest.chart.inflation')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={inflationOption}
                style={{ height: 260 }}
                opts={{ renderer: 'canvas' }}
              />
            </CardContent>
          </Card>
          <Card className="bg-[#0f1622]/80 border-white/10">
            <CardHeader className="pb-0">
              <CardTitle className="text-base text-white">
                {t('backtest.chart.vix')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReactECharts
                option={vixOption}
                style={{ height: 260 }}
                opts={{ renderer: 'canvas' }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
