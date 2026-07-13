import type { Lang } from '@/contexts/LanguageContext';

export function getLangKey(lang: Lang): 'zh' | 'en' {
  return lang.startsWith('zh') ? 'zh' : 'en';
}
