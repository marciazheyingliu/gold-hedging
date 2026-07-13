// ---- plugin:user_query_parameter_classification_1 ----
// ============================================================
// 插件 user_query_parameter_classification_1 (用户查询参数分类识别) 的类型定义
// 由 get_plugin_ai_json 自动生成
// ============================================================

export interface UserQueryParameterClassificationOneInput {
  /** 用户的自然语言提问内容 */
  user_query: string;
}

/**
 * capabilityClient.load('user_query_parameter_classification_1').call<UserQueryParameterClassificationOneOutput>('aiCategorize', input)
 * 直接返回此类型，无 .data 包装，直接解构使用：
 * const { categories } = result;
 */
export interface UserQueryParameterClassificationOneOutput {
  /** [object Object] */
  categories: string[];
}
// ---- end:user_query_parameter_classification_1 ----

// ---- plugin:gold_hedging_config_explanation_generator_1 ----
// ============================================================
// 插件 gold_hedging_config_explanation_generator_1 (黄金对冲配置说明生成器) 的类型定义
// 由 get_plugin_ai_json 自动生成
// ============================================================

export interface GoldHedgingConfigExplanationGeneratorOneInput {
  /** 基于策略参数计算得出的结果数据，包括预期收益、最大回撤、对冲效率等 */
  calculation_results: string;
  /** 用户的风险偏好等级，如保守型、稳健型、进取型等（可选） */
  user_risk_preference?: string;
  /** 黄金对冲策略的相关参数，包括资产配置比例、对冲周期、风险阈值等 */
  strategy_params: string;
}

/**
 * capabilityClient.load('gold_hedging_config_explanation_generator_1').call<GoldHedgingConfigExplanationGeneratorOneOutput>('textGenerate', input)
 * 直接返回此类型，无 .data 包装，直接解构使用：
 * const { content, response } = result;
 */
export interface GoldHedgingConfigExplanationGeneratorOneOutput {
  /** [object Object] */
  content: string;
  /** [object Object] */
  response?: string;
}
// ---- end:gold_hedging_config_explanation_generator_1 ----