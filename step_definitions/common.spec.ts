import { Dado, Quando, E, Entao } from '../support/BDD-pt-br';
import { expect } from '@playwright/test';
import { CommonPage } from '../page_objects/commonPage';
import { LoginPage } from '../page_objects/login/loginPage';
import { loadConfigAndMassData } from '../support/utils/envUtils';
const env = process.env.ENV || 'hml';
const funcionalidade = process.env.FUNCIONALIDADE || 'plataforma';

interface Config {
  [env: string]: {
    [funcionalidade: string]: {
      BASE_URL: string;
    };
  };
}
 
let config: Config;
let massData: any;
 
try {
  const data = loadConfigAndMassData(env, funcionalidade);
  config = data.config;
  massData = data.massData;
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error('An unknown error occurred:', error);
  }
  process.exit(1);
}
 
if (!config || !config[env] || !config[env][funcionalidade]) {
  console.error(`Configuração para o ambiente ${env} e funcionalidade ${funcionalidade} não encontrada.`);
  console.error(`Ambientes disponíveis:`, Object.keys(config || {}));
  if (config[env]) {
    console.error(`Funcionalidades disponíveis em ${env}:`, Object.keys(config[env]));
  }
  throw new Error(`Configuração para o ambiente ${env} e funcionalidade ${funcionalidade} não encontrada.`);
}
 
const baseUrl = config[env][funcionalidade].BASE_URL;

const getUserData = (conta: string) => {
  const contaData = massData[conta];
  if (!contaData) {
      throw new Error(`Conta ${conta} não encontrada em massasEnv.json`);
  }
  return contaData;
}

Dado('que o usuario esta na tela de login da Genial', async () => {
  await global.page.goto(baseUrl);
});

Quando('o usuario insere o nome de usuario {string}', async (username: string) => {
  await global.page.getByRole('textbox').click();
  await global.page.getByRole('textbox').fill(username);
  await global.page.getByRole('button', { name: 'Próximo' }).click();
});

Quando('o usuario insere a senha {string}', async (password: string) => {
  await global.page.fill('input[name="password"]', password);
});

Quando('clica no botão de login', async () => {
  await global.page.click('button[type="submit"]');
});

E('clicar no botao {string}', async (botao: string) => {
  const commonPage = new CommonPage(global.page);
  const metodosRapidos = [
    { nome: 'button', fn: () => commonPage.selecionarBotao(botao) },
    { nome: 'link', fn: () => commonPage.selecionarBotaoLink(botao) },
    { nome: 'main', fn: () => commonPage.selecionarBotaoMain(botao) },
    { nome: 'label', fn: () => commonPage.selecionarBotaoLabel(botao) },
    { nome: 'tab', fn: () => commonPage.selecionarBotaoTab(botao) },
    { nome: 'dialog', fn: () => commonPage.botaoDialog(botao) },
    { nome: 'option', fn: () => commonPage.selecionarBotaoOption(botao) },
    { nome: 'heading', fn: () => commonPage.selecionarBotaoHeading(botao) },
  ];
  
  for (let i = 0; i < metodosRapidos.length; i++) {
    const metodo = metodosRapidos[i];
    
    try {
      // console.log(`🔍 [${i+1}/${metodosRapidos.length}] Tentando seletor: ${metodo.nome}`);
      await Promise.race([
        metodo.fn(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 3000))
      ]);
      
      console.log(`✅ Sucesso com seletor: ${metodo.nome}`);
      return;
      
    } catch (error) {
      if (i === metodosRapidos.length - 1) {
        throw new Error(`Botão "${botao}" não encontrado`);
      }
    }
  }
});

E('clicar no texto {string}', async (texto: string) => {
  const commonPage = new CommonPage(global.page);
  await commonPage.selecionarTexto(texto);
});

E('acessar o sub menu {string}', async (botao: string) => {
  const commonPage = new CommonPage(global.page);
  await commonPage.selecionarBotao(botao)
});

E('visualizar o botao {string}', async (botao) => {
  const commonPage = new CommonPage(global.page);
  await commonPage.visualizarBotao(botao)
})

E('visualizar o texto {string}', async (text) => {
  const commonPage = new CommonPage(global.page);
  await commonPage.validarTexto(text)
})

Entao('o usuario deve ver a pagina inicial da Genial', async () => {
  await global.page.waitForSelector('selector-da-pagina-inicial');
  const url = global.page.url();
  expect(url).toContain('https://www.genial.com.br/home');
});

Entao('sera apresentado em tela a mensagem {string}', async (text: string) => {
  const commomPage = new CommonPage(global.page);
  await commomPage.validarTexto(text)
  // console.log('o texto que retorna:', text)
});

Entao('ao logar na plataforma com o {string}', { timeout: 30000 }, async (user: string) => {
  try {
    const usuario = global.massData[user];
    if (!usuario) {
      throw new Error(`Usuário "${user}" não encontrado`);
    }
    const loginPage = new LoginPage(global.page);
    const commomPage = new CommonPage(global.page);

    await loginPage.popUpPrivacidade();
    await loginPage.popUpCookies();
    await loginPage.login(usuario.login, usuario.password);
    await commomPage.validarTexto('Lançamentos futuros');

  } catch (error) {
    console.error(`❌ Erro ao tentar logar na plataforma"\n`, error);
    throw error;
  }
});

Entao('clicar no menu lateral {string}', async (menuLateral) => {
  const commomPage = new CommonPage(page);
  await commomPage.menuLateral(menuLateral);
  await commomPage.validarPopUpAvaliar()
  // await commomPage.validarPopUpAtualizarInformacoes() // >>> Em caso de ser apresentado em tela muitas vezes
});

Entao('sera carregado texto na tela {string}', async (tituloTela: string) => {
  const commomPage = new CommonPage(page);
  await commomPage.validarTexto(tituloTela);
});
