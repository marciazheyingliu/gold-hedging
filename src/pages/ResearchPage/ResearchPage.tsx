import { motion } from 'framer-motion';
import { BookOpen, Layers, Activity, ArrowUpDown, ShieldAlert } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLangKey } from '@/lib/lang-utils';

const findings = [
  {
    key: 'f1',
    icon: Layers,
    stat: '0.367',
    statLabel: {
      zh: '能源行业对冲Beta，全行业最强',
      en: 'Energy sector hedge Beta — highest across all industries',
    },
  },
  {
    key: 'f2',
    icon: Activity,
    stat: '+30%',
    statLabel: {
      zh: '高通胀环境下对冲效率提升',
      en: 'Hedge efficiency boost in high-inflation regimes',
    },
  },
  {
    key: 'f3',
    icon: ArrowUpDown,
    stat: '2.3x',
    statLabel: {
      zh: '下跌保护 vs 上涨损耗 非对称比',
      en: 'Asymmetric ratio: downside protection vs upside drag',
    },
  },
  {
    key: 'f4',
    icon: ShieldAlert,
    stat: '18%',
    statLabel: {
      zh: '极端流动性危机中对冲失效概率',
      en: 'Hedge failure probability in extreme liquidity crises',
    },
  },
];

export default function ResearchPage() {
  const { t, lang } = useLanguage();
  const langKey = getLangKey(lang);

  const cards = [
    {
      key: 'f1',
      icon: Layers,
      title: t('research.f1.title'),
      desc: t('research.f1.desc'),
      stat: '0.367',
      statLabel: langKey === 'zh' ? '能源行业对冲Beta，全行业最强' : 'Energy sector hedge Beta — highest across industries',
      accent: 'from-[#D4AF37] to-[#E8C96A]',
    },
    {
      key: 'f2',
      icon: Activity,
      title: t('research.f2.title'),
      desc: t('research.f2.desc'),
      stat: '+30%',
      statLabel: langKey === 'zh' ? '高通胀环境下对冲效率提升幅度' : 'Hedge efficiency uplift in high-inflation regimes',
      accent: 'from-[#4ECDC4] to-[#44A08D]',
    },
    {
      key: 'f3',
      icon: ArrowUpDown,
      title: t('research.f3.title'),
      desc: t('research.f3.desc'),
      stat: '2.3x',
      statLabel: langKey === 'zh' ? '下跌保护 / 上涨损耗 非对称比' : 'Asymmetric ratio of downside protection to upside drag',
      accent: 'from-[#B8860B] to-[#D4AF37]',
    },
    {
      key: 'f4',
      icon: ShieldAlert,
      title: t('research.f4.title'),
      desc: t('research.f4.desc'),
      stat: '18%',
      statLabel: langKey === 'zh' ? '极端流动性危机中对冲失效概率' : 'Hedge failure probability in extreme liquidity crises',
      accent: 'from-[#E74C3C] to-[#C0392B]',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge
            variant="outline"
            className="mb-4 border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5"
          >
            <BookOpen className="size-3.5 mr-1.5" />
            {langKey === 'zh' ? '实证研究' : 'Empirical Research'}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t('research.title')}
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">{t('research.subtitle')}</p>
        </motion.div>

        {/* Findings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
              >
                <Card className="h-full bg-[#0f1622]/80 border-white/10 hover:border-[#D4AF37]/30 transition-colors group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`size-11 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center text-[#1a2332]`}>
                        <Icon className="size-5" strokeWidth={2.2} />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-white/10 text-gray-400 text-xs"
                      >
                        {langKey === 'zh' ? `发现 ${i + 1}` : `Finding ${i + 1}`}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-[#D4AF37] transition-colors">
                      {card.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Data stat */}
                    <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                      <div className={`text-3xl font-bold bg-gradient-to-r ${card.accent} bg-clip-text text-transparent tabular-nums mb-1`}>
                        {card.stat}
                      </div>
                      <p className="text-xs text-gray-400">{card.statLabel}</p>
                    </div>
                    {/* Description */}
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {card.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Methodology note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-gray-600 max-w-2xl mx-auto">
            {lang === 'zh'
              ? '* 以上结论基于 2014-2024 年美股行业 ETF 与黄金 ETF 的日频数据回测，使用滚动窗口法估计动态对冲比率。过往表现不代表未来收益，仅供研究参考。'
              : '* Findings are based on backtesting of US sector ETFs and gold ETF daily data from 2014-2024, using rolling window estimation of dynamic hedge ratios. Past performance does not guarantee future returns. For research purposes only.'}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
