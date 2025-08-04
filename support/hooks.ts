import { Before, After, AfterAll, AfterStep, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import { getBrowserType, getEnvType, isHeadless, loadConfigAndMassData, setupBrowser, getFuncionalidade } from './utils/envUtils';
import { generateReport } from './utils/reportUtils';
import fs from 'fs';
import path from 'path';

const debug = process.env.DEBUG === 'true';
const defaultTimeout = debug ? -1 : 12000;
setDefaultTimeout(defaultTimeout);

let browser: Browser;
let context: BrowserContext;
let page: Page;
let config: any;
let massData: any;

declare global {
  var page: Page;
  var config: any;
  var massData: any;
  var delay: (seconds: number) => Promise<void>;
}

global.delay = (seconds: number) => new Promise(resolve => setTimeout(resolve, seconds * 1000));

const browserType = getBrowserType();
const envType = getEnvType();
const headless = isHeadless();
const funcionalidade = getFuncionalidade();

const { config: loadedConfig, massData: loadedMassData } = loadConfigAndMassData(envType, funcionalidade);
config = loadedConfig;
massData = loadedMassData;

Before(async function (cenario) {
  console.log('\n' + '='.repeat(80));
  console.log(`Iniciando cenario: "${cenario.pickle.name}"`);
  console.log('='.repeat(80) + '\n');

  const browserSetup = await setupBrowser(browserType, headless);
  browser = browserSetup.browser;
  context = browserSetup.context;
  page = browserSetup.page;

  global.page = page;
  global.config = config;
  global.massData = massData;
});

AfterStep(async function (step) {
  const featureName = step.gherkinDocument?.feature?.name || 'Funcionalidade Indefinida';
  const cenarioName = step.pickle.name;
  const stepText = step.pickleStep.text;

  if (step.result.status === Status.PASSED) {
    console.log(` .   Passo concluido: "${stepText}"  \n`);
  } else if (step.result.status === Status.FAILED) {
    console.error(` .   Falha no passo: "${stepText}"  \n`);
    
    const now = new Date();
    const formattedDate = now
      .toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })
      .replace(/\//g, '-')
      .replace(/:/g, '')
      .replace(',', '')
      .replace(' ', '_');

    const screenshotFileName = `${formattedDate}-[FAIL]-${featureName}-${cenarioName}.png`;
    const screenshotPath = path.resolve('reports', screenshotFileName);
    await page.screenshot({ path: screenshotPath, fullPage: true });

    const exception = step.result.exception;
    if (exception) {
      const cleanedLog = cleanExceptionLog(exception.toString());
      console.error(`   Log detalhado:\n${cleanedLog}  \n`);
    } else {
      console.error('   Nenhum log de excecao disponivel.  \n');
    }
  } else {
    console.warn(`.   Passo ignorado: "${stepText}"  \n`);
  }
});

  //  * Função para limpar o log de exceção, removendo caminhos de arquivos e call stacks.
function cleanExceptionLog(log: string): string {
  return log
    .replace(/(at .+ \(.+\))/g, '')
    .replace(/^\s*- .+$/gm, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

After(async function (cenario) {
  const status = cenario.result?.status === Status.PASSED ? 'PASSED' : 'FAIL';
  console.log('\n' + '-'.repeat(80));
  console.log(`Cenario finalizado: ${status}`);
  console.log('-'.repeat(80) + '\n');
  await page.close();
  await browser.close();
});

AfterAll(async () => {
  generateReport(envType, browserType);
});

