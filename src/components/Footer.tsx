import { useLanguage } from '@/contexts/LanguageContext';
import { getLangKey } from '@/lib/lang-utils';

export default function Footer() {
  const { lang } = useLanguage();
  const langKey = getLangKey(lang);
  return (
    <footer className="w-full bg-[#1a2332] border-t border-[#D4AF37]/20 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-[#1a2332] font-bold text-xs">
              Au
            </div>
            <span className="text-gray-400 text-sm">
              {langKey === 'zh'
                ? '黄金-股票跨资产自适应对冲策略平台'
                : 'Gold-Stock Cross-Asset Adaptive Hedging Platform'}
            </span>
          </div>
          <div className="text-gray-500 text-xs">
            {langKey === 'zh'
              ? '© 2024 仅供研究参考，不构成投资建议'
              : '© 2024 For research purposes only, not investment advice'}
          </div>
        </div>
      </div>
    </footer>
  );
}
