// EXPORTS: INDUSTRY_LIST, INDUSTRY_FACTORS, RISK_BASE_RATIOS, calculateGoldRatio, detectLanguage, parseQueryFallback, type IndustryKey, type RiskLevel, type MarketVolatility, type MarketInflation, type MarketPanic, type StrategyResult

export type IndustryKey =
  | 'energy'
  | 'utilities'
  | 'staples'
  | 'healthcare'
  | 'financials'
  | 'industrials'
  | 'materials'
  | 'discretionary'
  | 'tech'
  | 'communication'
  | 'realestate'
  | 'conglomerates'
  | 'broader';

export type RiskLevel = 'conservative' | 'moderate' | 'aggressive';
export type MarketVolatility = 'low' | 'normal' | 'high';
export type MarketInflation = 'low' | 'high';
export type MarketPanic = 'low' | 'high';

export interface StrategyResult {
  industry: IndustryKey;
  riskLevel: RiskLevel;
  marketState: {
    volatility: MarketVolatility;
    inflation: MarketInflation;
    panic: MarketPanic;
  };
  goldRatio: number;
  calculation: {
    baseRatio: number;
    industryFactor: number;
    marketAdjustment: number;
    finalRatio: number;
  };
}

// 13 个行业（中英名称 + key）
export const INDUSTRY_LIST: Array<{ key: IndustryKey; zh: string; en: string }> = [
  { key: 'energy', zh: '能源', en: 'Energy' },
  { key: 'utilities', zh: '公用事业', en: 'Utilities' },
  { key: 'staples', zh: '必需消费', en: 'Consumer Staples' },
  { key: 'healthcare', zh: '医药', en: 'Healthcare' },
  { key: 'financials', zh: '金融', en: 'Financials' },
  { key: 'industrials', zh: '工业', en: 'Industrials' },
  { key: 'materials', zh: '材料', en: 'Materials' },
  { key: 'discretionary', zh: '可选消费', en: 'Consumer Discretionary' },
  { key: 'tech', zh: '科技', en: 'Technology' },
  { key: 'communication', zh: '通信', en: 'Communication' },
  { key: 'realestate', zh: '地产', en: 'Real Estate' },
  { key: 'conglomerates', zh: '综合', en: 'Conglomerates' },
  { key: 'broader', zh: '大盘', en: 'Broader Market' },
];

// 行业系数
export const INDUSTRY_FACTORS: Record<IndustryKey, number> = {
  energy: 1.2,
  utilities: 1.15,
  staples: 1.1,
  healthcare: 1.05,
  financials: 1.0,
  industrials: 0.95,
  materials: 0.95,
  discretionary: 0.9,
  tech: 0.85,
  communication: 0.85,
  realestate: 0.8,
  conglomerates: 0.9,
  broader: 1.0,
};

// 基准比例（按风险偏好）
export const RISK_BASE_RATIOS: Record<RiskLevel, number> = {
  conservative: 15,
  moderate: 10,
  aggressive: 5,
};

/**
 * 计算黄金配置比例
 * 公式：基准 × 行业系数 × (1 + 市场调整累加)，clamp 到 [0, 25]
 */
export function calculateGoldRatio(params: {
  industry: IndustryKey;
  riskLevel: RiskLevel;
  volatility: MarketVolatility;
  inflation: MarketInflation;
  panic: MarketPanic;
}): StrategyResult {
  const baseRatio = RISK_BASE_RATIOS[params.riskLevel];
  const industryFactor = INDUSTRY_FACTORS[params.industry];

  // 市场状态调整（累加）
  let marketAdj = 0;
  if (params.volatility === 'high') marketAdj += 0.2;
  if (params.inflation === 'high') marketAdj += 0.3;
  if (params.panic === 'high') marketAdj += 0.25;

  const beforeClamp = baseRatio * industryFactor * (1 + marketAdj);
  const finalRatio = Math.max(0, Math.min(25, beforeClamp));

  return {
    industry: params.industry,
    riskLevel: params.riskLevel,
    marketState: {
      volatility: params.volatility,
      inflation: params.inflation,
      panic: params.panic,
    },
    goldRatio: Number(finalRatio.toFixed(1)),
    calculation: {
      baseRatio,
      industryFactor,
      marketAdjustment: Number(marketAdj.toFixed(2)),
      finalRatio: Number(finalRatio.toFixed(1)),
    },
  };
}

/**
 * 简单语言检测：中文字符占比 > 30% 判定为中文
 */
export function detectLanguage(text: string): 'zh' | 'en' {
  if (!text) return 'zh';
  const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const ratio = chineseChars / text.length;
  return ratio > 0.3 ? 'zh' : 'en';
}

/**
 * 规则兜底解析：从用户提问中提取行业、风险偏好、市场状态
 * AI 插件失败时使用
 */
export function parseQueryFallback(query: string): {
  industry: IndustryKey;
  riskLevel: RiskLevel;
  volatility: MarketVolatility;
  inflation: MarketInflation;
  panic: MarketPanic;
} {
  const q = query.toLowerCase();

  // 行业识别
  let industry: IndustryKey = 'broader';
  const industryMap: Array<{ key: IndustryKey; patterns: string[] }> = [
    { key: 'energy', patterns: ['能源', 'energy', '石油', 'oil', 'gas', '天然'] },
    { key: 'utilities', patterns: ['公用事业', 'utility', '电力', '水电', '燃气'] },
    { key: 'staples', patterns: ['必需消费', 'staple', '消费必选', '食品饮料', '必选消费'] },
    { key: 'healthcare', patterns: ['医药', 'health', '医疗', '药', '生物'] },
    { key: 'financials', patterns: ['金融', 'finance', '银行', '保险', '券商', 'bank'] },
    { key: 'industrials', patterns: ['工业', 'industrial', '制造', '机械'] },
    { key: 'materials', patterns: ['材料', 'material', '化工', '有色', '钢铁'] },
    { key: 'discretionary', patterns: ['可选消费', 'discretionary', '可选', '零售', '汽车', '家电'] },
    { key: 'tech', patterns: ['科技', 'tech', '科技股', '互联网', '半导体', 'ai', '人工智能', '芯片'] },
    { key: 'communication', patterns: ['通信', 'communicat', '电信', '传媒', '5g'] },
    { key: 'realestate', patterns: ['地产', 'real estate', '房地产', '房产', 'reits'] },
    { key: 'conglomerates', patterns: ['综合', 'conglomerate'] },
  ];
  for (const item of industryMap) {
    if (item.patterns.some((p) => q.includes(p))) {
      industry = item.key;
      break;
    }
  }

  // 风险偏好
  let riskLevel: RiskLevel = 'moderate';
  if (/保守|conservative|稳健偏保守|低风险/.test(q)) riskLevel = 'conservative';
  else if (/激进|aggressive|进取|高风险/.test(q)) riskLevel = 'aggressive';
  else if (/稳健|moderate|平衡/.test(q)) riskLevel = 'moderate';

  // 市场状态
  let volatility: MarketVolatility = 'normal';
  if (/高波动|波动大|剧烈波动|high volat/.test(q)) volatility = 'high';
  else if (/低波动|平稳|low volat/.test(q)) volatility = 'low';

  let inflation: MarketInflation = 'low';
  if (/高通胀|通胀高|inflation high|通胀上升|通胀上涨/.test(q)) inflation = 'high';

  let panic: MarketPanic = 'low';
  if (/高恐慌|恐慌|panic|危机|crash|暴跌|大跌/.test(q)) panic = 'high';

  return { industry, riskLevel, volatility, inflation, panic };
}
