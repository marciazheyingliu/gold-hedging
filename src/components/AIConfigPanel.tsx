import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Bot, Save, Key, Link } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLangKey } from '@/lib/lang-utils';
import {
  AIConfig,
  AVAILABLE_MODELS,
  saveAIConfig,
  loadAIConfig,
} from '@/services/aiService';

const translations = {
  'zh-CN': {
    title: 'AI 助手配置',
    provider: '选择供应商',
    model: '选择模型',
    apiKey: 'API 密钥',
    baseUrl: 'API 地址 (可选)',
    save: '保存配置',
    saved: '已保存!',
  },
  'zh-TW': {
    title: 'AI 助手配置',
    provider: '選擇供應商',
    model: '選擇模型',
    apiKey: 'API 金鑰',
    baseUrl: 'API 位址 (可選)',
    save: '保存配置',
    saved: '已保存!',
  },
  'en': {
    title: 'AI Assistant Setup',
    provider: 'Select Provider',
    model: 'Select Model',
    apiKey: 'API Key',
    baseUrl: 'API URL (Optional)',
    save: 'Save Config',
    saved: 'Saved!',
  },
};

export function AIConfigPanel() {
  const { lang } = useLanguage();
  const langKey = getLangKey(lang);
  const t = translations[lang as keyof typeof translations];
  
  const [config, setConfig] = useState<AIConfig>(loadAIConfig());
  const [saved, setSaved] = useState(false);

  const currentProvider = AVAILABLE_MODELS.find(m => m.id === config.providerId);

  const handleSave = () => {
    saveAIConfig(config);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleProviderChange = (providerId: string) => {
    const provider = AVAILABLE_MODELS.find(m => m.id === providerId);
    if (provider) {
      setConfig({
        ...config,
        providerId,
        model: provider.defaultModel,
        baseUrl: provider.baseUrl,
      });
    }
  };

  return (
    <Card className="bg-[#0f1622]/80 border-[#D4AF37]/20 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Settings className="size-5 text-[#D4AF37]" />
          {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Provider Selection */}
        <div className="space-y-2">
          <Label className="text-gray-300 text-sm flex items-center gap-2">
            <Bot className="size-4" />
            {t.provider}
          </Label>
          <Select
            value={config.providerId}
            onValueChange={handleProviderChange}
          >
            <SelectTrigger className="bg-[#1a2332] border-white/10 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#1a2332] border-[#D4AF37]/20 text-white">
              {AVAILABLE_MODELS.map(provider => (
                <SelectItem
                  key={provider.id}
                  value={provider.id}
                  className="focus:bg-[#D4AF37]/10 focus:text-[#D4AF37]"
                >
                  {provider.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Model Selection */}
        {currentProvider && currentProvider.availableModels.length > 0 && (
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm">{t.model}</Label>
            <Select
              value={config.model}
              onValueChange={(model) => setConfig({ ...config, model })}
            >
              <SelectTrigger className="bg-[#1a2332] border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#D4AF37]/20 text-white">
                {currentProvider.availableModels.map(model => (
                  <SelectItem
                    key={model}
                    value={model}
                    className="focus:bg-[#D4AF37]/10 focus:text-[#D4AF37]"
                  >
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* API Key */}
        {currentProvider?.apiKeyRequired && (
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm flex items-center gap-2">
              <Key className="size-4" />
              {t.apiKey}
            </Label>
            <Input
              type="password"
              value={config.apiKey || ''}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder="sk-..."
              className="bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
        )}

        {/* Base URL (Custom) */}
        {(currentProvider?.provider === 'custom' || currentProvider?.id === 'ollama') && (
          <div className="space-y-2">
            <Label className="text-gray-300 text-sm flex items-center gap-2">
              <Link className="size-4" />
              {t.baseUrl}
            </Label>
            <Input
              value={config.baseUrl || ''}
              onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
              placeholder={currentProvider?.id === 'ollama' ? 'http://localhost:11434/v1' : 'https://api.example.com/v1'}
              className="bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
        )}

        {/* Save Button */}
        <Button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#1a2332] font-semibold hover:opacity-90"
        >
          {saved ? (
            <>
              <Save className="size-4 mr-2" />
              {t.saved}
            </>
          ) : (
            <>
              <Save className="size-4 mr-2" />
              {t.save}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
