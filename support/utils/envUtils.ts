import path from 'path';
import fs from 'fs';
import { Browser, BrowserContext, Page, chromium, firefox, webkit } from 'playwright';

// Função para capturar variáveis de ambiente com valor padrão
export const getEnvVariable = (variable: string, defaultValue: string = ''): string => {
  return process.env[variable] || defaultValue;
};

export type BrowserType = 'chromium' | 'firefox' | 'webkit';

// Função para capturar o tipo de navegador
export const getBrowserType = (): BrowserType => {
  const browserArg = getEnvVariable('BROWSER', 'chromium');
  if (['firefox', 'webkit', 'chromium'].includes(browserArg.toLowerCase())) {
    return browserArg.toLowerCase() as BrowserType;
  }
  return 'chromium';
};

// Função para capturar o tipo de ambiente
export const getEnvType = (): string => {
  return getEnvVariable('ENV', 'hml');
};

// Função para verificar se o modo headless está ativado
export const isHeadless = (): boolean => {
  return getEnvVariable('HEADLESS', 'false') === 'true';
};

// Função para verificar se o site está ativado
export const getSite = (): string => {
  return getEnvVariable('SITE', 'MASSAS');
};

// Função para capturar a funcionalidade
export const getFuncionalidade = (): string => {
  return getEnvVariable('FUNCIONALIDADE', 'plataforma');
};

// Função para carregar configurações e dados de massa
export const loadConfigAndMassData = (() => {
  let cache: { config: any; massData: any } | null = null;

  return (envType: string, funcionalidadeType: string) => {
    if (cache) return cache;

    const siteType = getSite();
    const browserType = getBrowserType();

    console.log(`🌐 Current environment: ${envType}`);
    console.log(`🔧 Current site: ${funcionalidadeType}`);
    console.log(`🧪 Current browser: ${browserType}`);

    const configPath = path.resolve(__dirname, `../../support/configEnv.json`);
    const massDataPath = path.resolve(__dirname, '../../support/massasEnv.json');

    const allConfigs = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const config = allConfigs;

    const allMassData = JSON.parse(fs.readFileSync(massDataPath, 'utf8'));
    const massData = allMassData[siteType][envType];

    cache = { config, massData };
    return cache;
  };
})();

// Função para configurar o navegador
export const setupBrowser = async (browserType: BrowserType, headless: boolean): Promise<{ browser: Browser, context: BrowserContext, page: Page }> => {
  let browser: Browser;
  let context: BrowserContext;
  let page: Page;

  switch (browserType) {
    case 'firefox':
      browser = await firefox.launch({ headless });
      break;
    case 'webkit':
      browser = await webkit.launch({ headless });
      break;
    case 'chromium':
    default:
      browser = await chromium.launch({
        headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-http2']
      });
      break;
  }

  context = await browser.newContext();
  page = await context.newPage();

  return { browser, context, page };
};