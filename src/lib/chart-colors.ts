// 图表配色（金色 + 深蓝主题，hex 字面量喂给 ECharts）
export const CHART_COLORS = {
  gold: '#D4AF37',
  goldDark: '#B8860B',
  goldLight: '#E8C96A',
  navy: '#1a2332',
  navyLight: '#2a3a52',
  navyLighter: '#3d5273',
  white: '#ffffff',
  muted: '#8b9bb4',
  accent: '#4ECDC4',
  danger: '#E74C3C',
};

// ECharts 折线图三条曲线配色
export const CURVE_COLORS = {
  adaptive: CHART_COLORS.gold, // 自适应策略 - 金色
  static: CHART_COLORS.navyLighter, // 静态对冲 - 浅蓝
  stock: CHART_COLORS.danger, // 纯股票 - 红色
};

// 饼图配色
export const PIE_COLORS = {
  high: CHART_COLORS.gold,
  low: CHART_COLORS.navyLighter,
};
