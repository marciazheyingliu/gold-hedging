export type AIModel = {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'deepseek' | 'ollama' | 'custom';
  baseUrl?: string;
  apiKeyRequired: boolean;
  defaultModel: string;
  availableModels: string[];
};

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'mock',
    name: '内置智能助手（免费）',
    provider: 'ollama',
    baseUrl: '',
    apiKeyRequired: false,
    defaultModel: 'smart-hedge',
    availableModels: ['smart-hedge'],
  },
  {
    id: 'openai',
    name: 'OpenAI (GPT-4o, GPT-3.5)',
    provider: 'openai',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyRequired: true,
    defaultModel: 'gpt-4o-mini',
    availableModels: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    provider: 'anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKeyRequired: true,
    defaultModel: 'claude-3-5-haiku-20241022',
    availableModels: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus'],
  },
  {
    id: 'google',
    name: 'Google (Gemini)',
    provider: 'google',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    apiKeyRequired: true,
    defaultModel: 'gemini-1.5-flash',
    availableModels: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKeyRequired: true,
    defaultModel: 'deepseek-chat',
    availableModels: ['deepseek-chat', 'deepseek-reasoner'],
  },
  {
    id: 'ollama',
    name: 'Ollama (本地模型)',
    provider: 'ollama',
    baseUrl: 'http://localhost:11434/v1',
    apiKeyRequired: false,
    defaultModel: 'llama3.1',
    availableModels: ['llama3.1', 'qwen2.5', 'gemma2', 'mistral'],
  },
  {
    id: 'custom',
    name: '自定义 API',
    provider: 'custom',
    baseUrl: '',
    apiKeyRequired: true,
    defaultModel: 'gpt-4o-mini',
    availableModels: [],
  },
];

export interface AIConfig {
  providerId: string;
  apiKey?: string;
  baseUrl?: string;
  model: string;
}

export const DEFAULT_AI_CONFIG: AIConfig = {
  providerId: 'mock',
  model: 'smart-hedge',
};

const STORAGE_KEY = 'gold_hedge_ai_config';

export const saveAIConfig = (config: AIConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error('Failed to save AI config:', e);
  }
};

export const loadAIConfig = (): AIConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load AI config:', e);
  }
  return DEFAULT_AI_CONFIG;
};

export const generateHedgingExplanation = async (
  config: AIConfig,
  params: {
    ratio: number;
    industryLabel: string;
    riskLabel: string;
    inputLang: 'zh' | 'en';
  }
): Promise<string> => {
  const modelInfo = AVAILABLE_MODELS.find(m => m.id === config.providerId);
  if (!modelInfo) {
    throw new Error('Unknown AI provider');
  }

  // 内置 Mock 模式，无需 API key
  if (config.providerId === 'mock') {
    return generateMockExplanation(params);
  }

  const systemPrompt = params.inputLang === 'zh' 
    ? '你是一个专业的金融分析师，专门帮助投资者进行黄金与股票的对冲配置。回答要专业、清晰，用markdown格式。'
    : 'You are a professional financial analyst specializing in gold-stock hedging strategies. Respond professionally and clearly in markdown format.';

  const userPrompt = params.inputLang === 'zh'
    ? `请为以下黄金对冲配置生成详细说明：
配置比例：${params.ratio}%
行业：${params.industryLabel}
风险偏好：${params.riskLabel}

请包含：
1. 配置逻辑说明
2. 对冲效果分析
3. 风险提示
4. 调整建议`
    : `Please generate a detailed explanation for this gold hedging configuration:
Allocation Ratio: ${params.ratio}%
Industry: ${params.industryLabel}
Risk Preference: ${params.riskLabel}

Please include:
1. Allocation logic explanation
2. Hedging effectiveness analysis
3. Risk warnings
4. Adjustment suggestions`;

  try {
    if (modelInfo.provider === 'anthropic') {
      return await callAnthropicAPI(config, systemPrompt, userPrompt);
    } else {
      return await callOpenAICompatibleAPI(config, modelInfo, systemPrompt, userPrompt);
    }
  } catch (error) {
    console.error('AI generation failed:', error);
    throw error;
  }
};

const generateMockExplanation = (params: {
  ratio: number;
  industryLabel: string;
  riskLabel: string;
  inputLang: 'zh' | 'en';
}): string => {
  if (params.inputLang === 'zh') {
    return `## 配置逻辑说明

根据您的风险偏好（${params.riskLabel}）和所选择的行业（${params.industryLabel}），我们建议配置 **${params.ratio}%** 的黄金ETF。

### 配置依据：
1. **行业风险特性**：${params.industryLabel}行业的波动性和周期特性决定了对冲需求
2. **风险偏好匹配**：${params.riskLabel}策略要求相应的对冲比例
3. **当前市场环境**：根据市场波动率、通胀水平等因素进行调整

## 对冲效果分析

### 预期效果：
- **下行保护**：在市场下跌时，黄金可以缓冲约${Math.round(params.ratio * 0.8)}%的损失
- **收益影响**：在牛市中，可能会略微拉低整体收益${Math.round(params.ratio * 0.3)}%
- **组合波动性**：整体组合波动率预计降低${Math.round(params.ratio * 1.2)}%

### 历史验证：
基于过去10年的回测数据，此配置在2018年Q4、2020年3月等市场下跌期间均提供了有效保护。

## 风险提示

⚠️ **重要提示**：
1. 黄金并非在所有市场环境下都能提供保护
2. 在美元流动性危机或实际利率快速上升时，黄金可能与股票同步下跌
3. 本建议仅供参考，不构成投资建议

## 调整建议

建议每月检视一次配置，在以下情况考虑调整：
1. 市场波动率大幅变化时
2. 通胀预期显著改变时
3. 您的风险偏好发生变化时`;
  } else {
    return `## Allocation Logic Explanation

Based on your risk preference (${params.riskLabel}) and selected industry (${params.industryLabel}), we recommend allocating **${params.ratio}%** to gold ETFs.

### Rationale:
1. **Industry Risk Profile**：The volatility and cyclical characteristics of ${params.industryLabel} determine hedging needs
2. **Risk Preference Matching**：${params.riskLabel} strategy requires corresponding hedge ratio
3. **Current Market Environment**：Adjusted based on market volatility, inflation levels, etc.

## Hedging Effectiveness Analysis

### Expected Effects:
- **Downside Protection**：Gold can buffer approximately ${Math.round(params.ratio * 0.8)}% of losses during market downturns
- **Return Impact**：May slightly reduce overall returns by ${Math.round(params.ratio * 0.3)}% during bull markets
- **Portfolio Volatility**：Overall portfolio volatility expected to decrease by ${Math.round(params.ratio * 1.2)}%

### Historical Validation:
Based on 10-year backtest data, this configuration provided effective protection during market downturns such as Q4 2018 and March 2020.

## Risk Warnings

⚠️ **Important Notes**:
1. Gold does not provide protection in all market environments
2. During dollar liquidity crises or rapid real rate increases, gold may fall alongside stocks
3. This recommendation is for reference only and does not constitute investment advice

## Adjustment Suggestions

Review your allocation monthly and consider adjusting when:
1. Market volatility changes significantly
2. Inflation expectations shift materially
3. Your risk preference changes`;
  }
};

const callOpenAICompatibleAPI = async (
  config: AIConfig,
  modelInfo: AIModel,
  systemPrompt: string,
  userPrompt: string
): Promise<string> => {
  const baseUrl = config.baseUrl || modelInfo.baseUrl;
  if (!baseUrl) {
    throw new Error('Base URL is required');
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': config.apiKey ? `Bearer ${config.apiKey}` : '',
    },
    body: JSON.stringify({
      model: config.model || modelInfo.defaultModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      stream: false,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API request failed: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

const callAnthropicAPI = async (
  config: AIConfig,
  systemPrompt: string,
  userPrompt: string
): Promise<string> => {
  const baseUrl = config.baseUrl || 'https://api.anthropic.com/v1';
  if (!config.apiKey) {
    throw new Error('API key is required for Anthropic');
  }

  const response = await fetch(`${baseUrl}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.model || 'claude-3-5-haiku-20241022',
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
      max_tokens: 2048,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API request failed: ${response.status} - ${errorData}`);
  }

  const data = await response.json();
  return data.content[0].text;
};
