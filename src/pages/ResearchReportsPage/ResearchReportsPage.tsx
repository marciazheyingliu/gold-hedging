import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Download, ExternalLink, Sparkles, Clock, BarChart3, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLangKey } from "@/lib/lang-utils";

// 研报数据
interface ResearchReport {
  id: string;
  title: { zh: string; en: string };
  description: { zh: string; en: string };
  category: "gold" | "equity" | "macro" | "strategy";
  date: string;
  source: string;
  sourceUrl: string;
  tags: string[];
  featured?: boolean;
}

const researchReports: ResearchReport[] = [
  {
    id: "1",
    title: { zh: "2024年黄金投资策略报告", en: "2024 Gold Investment Strategy Report" },
    description: { zh: "全面分析当前宏观经济环境下的黄金投资价值与配置建议", en: "Comprehensive analysis of gold investment value and allocation recommendations in the current macroeconomic environment" },
    category: "gold",
    date: "2024-06-15",
    source: "World Gold Council",
    sourceUrl: "https://www.gold.org/",
    tags: ["黄金", "策略", "宏观"],
    featured: true
  },
  {
    id: "2",
    title: { zh: "大类资产配置研究：黄金的角色", en: "Asset Allocation Research: The Role of Gold" },
    description: { zh: "深入探讨黄金在多资产投资组合中的对冲和分散风险作用", en: "Deep dive into gold's hedging and diversification role in multi-asset portfolios" },
    category: "strategy",
    date: "2024-05-20",
    source: "BlackRock Investment Institute",
    sourceUrl: "https://www.blackrock.com/institutions/en-us/insights/investment-institute",
    tags: ["资产配置", "对冲"]
  },
  {
    id: "3",
    title: { zh: "全球宏观经济展望Q2", en: "Global Macro Economic Outlook Q2" },
    description: { zh: "2024年第二季度全球经济分析，包含通胀、利率与地缘政治风险分析", en: "Q2 2024 global economic analysis including inflation, interest rates and geopolitical risk" },
    category: "macro",
    date: "2024-04-10",
    source: "IMF Research",
    sourceUrl: "https://www.imf.org/en/research",
    tags: ["宏观", "经济", "利率"]
  },
  {
    id: "4",
    title: { zh: "黄金与股市：相关性分析", en: "Gold and Equities: Correlation Analysis" },
    description: { zh: "历史数据分析黄金与股市在不同市场环境下的相关性变化", en: "Historical data analysis of gold-equity correlation changes across different market regimes" },
    category: "equity",
    date: "2024-03-28",
    source: "Bloomberg Intelligence",
    sourceUrl: "https://www.bloomberg.com/professional/solutions/bloomberg-intelligence/",
    tags: ["股市", "量化"]
  },
  {
    id: "5",
    title: { zh: "大宗商品市场年度回顾", en: "Commodity Markets Annual Review" },
    description: { zh: "包括黄金、原油、铜等主要大宗商品的年度市场回顾与展望", en: "Annual market review and outlook for major commodities including gold, oil, copper and more" },
    category: "gold",
    date: "2024-02-14",
    source: "World Bank Commodities",
    sourceUrl: "https://www.worldbank.org/en/research/commodity-markets",
    tags: ["大宗商品", "市场回顾"]
  },
  {
    id: "6",
    title: { zh: "地缘政治风险下的资产表现", en: "Asset Performance Under Geopolitical Risk" },
    description: { zh: "研究黄金、美元、国债等避险资产在地缘政治紧张时期的表现", en: "Study of safe-haven assets like gold, USD and treasuries during geopolitical tensions" },
    category: "strategy",
    date: "2024-01-20",
    source: "JPMorgan Research",
    sourceUrl: "https://www.jpmorgan.com/insights/research",
    tags: ["避险", "地缘政治"]
  }
];

const categories = [
  { value: "all", label: { zh: "全部", en: "All" } },
  { value: "gold", label: { zh: "黄金专题", en: "Gold Focus" } },
  { value: "equity", label: { zh: "股市相关", en: "Equities" } },
  { value: "macro", label: { zh: "宏观经济", en: "Macro" } },
  { value: "strategy", label: { zh: "投资策略", en: "Strategy" } }
];

export default function ResearchReportsPage() {
  const { lang } = useLanguage();
  const langKey = getLangKey(lang);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredReports = researchReports.filter((report) => {
    const matchesCategory = category === "all" || report.category === category;
    const matchesSearch =
      report.title[langKey].toLowerCase().includes(search.toLowerCase()) ||
      report.description[langKey].toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "gold": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "equity": return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "macro": return "bg-purple-500/10 text-purple-400 border-purple-500/30";
      case "strategy": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/30";
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case "gold": return langKey === "zh" ? "黄金" : "Gold";
      case "equity": return langKey === "zh" ? "股市" : "Equity";
      case "macro": return langKey === "zh" ? "宏观" : "Macro";
      case "strategy": return langKey === "zh" ? "策略" : "Strategy";
      default: return cat;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 border-[#D4AF37]/40 text-[#D4AF37] bg-[#D4AF37]/5">
            <Sparkles className="size-3.5 mr-1.5" />
            {langKey === "zh" ? "免费研报" : "Free Research"}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#E8C96A] to-[#D4AF37] bg-clip-text text-transparent">
              {langKey === "zh" ? "研究报告库" : "Research Reports"}
            </span>
          </h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            {langKey === "zh" 
              ? "精选全球权威机构的免费研究报告，助力您的投资决策" 
              : "Curated free research reports from leading global institutions to support your investment decisions"}
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 size-4" />
            <Input
              type="text"
              placeholder={langKey === "zh" ? "搜索报告标题或内容..." : "Search reports..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-[#0f1622] border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48 bg-[#0f1622] border-white/10 text-white">
              <SelectValue placeholder={langKey === "zh" ? "分类" : "Category"} />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2332] border-[#D4AF37]/20 text-white">
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value} className="focus:bg-[#D4AF37]/10 focus:text-[#D4AF37]">
                  {cat.label[langKey]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Reports Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            >
              <Card className={`bg-[#0f1622]/80 border-[#D4AF37]/20 backdrop-blur-sm hover:border-[#D4AF37]/50 transition-all h-full flex flex-col ${report.featured ? 'border-[#D4AF37]/50 ring-1 ring-[#D4AF37]/30' : ''}`}>
                {report.featured && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0f1622] border-none">
                      <Sparkles className="size-3 mr-1" />
                      {langKey === "zh" ? "精选" : "Featured"}
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-2">
                      <Badge variant="outline" className={`${getCategoryColor(report.category)}`}>
                        {getCategoryLabel(report.category)}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg text-white mt-2 leading-tight">
                    {report.title[langKey]}
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    {report.description[langKey]}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 pb-3">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {report.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1 text-gray-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FileText className="size-3" />
                    <span>{report.source}</span>
                    <span className="mx-1">•</span>
                    <Clock className="size-3" />
                    <span>{report.date}</span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a2332] font-semibold hover:opacity-90"
                  >
                    <a href={report.sourceUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="size-4 mr-2" />
                      {langKey === "zh" ? "查看报告" : "View Report"}
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText className="size-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {langKey === "zh" ? "没有找到相关报告" : "No reports found"}
            </h3>
            <p className="text-gray-400">
              {langKey === "zh" ? "尝试更换搜索关键词或分类" : "Try changing search keywords or category"}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
