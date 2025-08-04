import { Dado, Entao, Quando } from '../../support/BDD-pt-br';
import { LoginPage } from '../../page_objects/login/loginPage';
import { Page } from 'playwright';
import { CommonPage } from '../../page_objects/commonPage';

declare let page: Page;

Dado('que esteja na home deslogada', async () => {
    await global.page.goto('https://www.saucedemo.com')
});

Dado('que antes de logar na plataforma selecione o checkbox {string}', async (text: string) => {
    const commomPage = new CommonPage(page);
    await global.page.waitForTimeout(2000)
    await commomPage.selecionarCheckbox(text)
});

Quando('apresentar a home de login da plataforma', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.textoAcesseSuaConta()
});

Quando('digitar o email {string}', async (emailUser: string) => {
    const loginPage = new LoginPage(page);
    await loginPage.popUpPrivacidade()
    await loginPage.popUpCookies()
    const usuario = global.massData[emailUser];
    await loginPage.preencherCampoEmail(usuario.login)
});

Entao('devera apresentar aviso para utilizar cookies e privacidade', async () => {
    const loginPage = new LoginPage(page);
    await loginPage.popUpPrivacidade()
    await loginPage.popUpCookies()
});

Entao('sera aberto frame com a mensagem {string}', async (text: string) => {
    const commomPage = new CommonPage(page);
    await commomPage.validarTexto(text)
});

Entao('devera ser direcionado para a tela de cadastro', async () => {
    const commomPage = new CommonPage(page);
    await commomPage.validarTexto('Invista no seu passo, abra sua conta na Genial!')
    await commomPage.scrollParaBaixoAteEncontrarTexto('Ao prosseguir, você autoriza a Genial a coletar seus dados pessoais de acordo com a nossa Política de Privacidade, com o objetivo de envio de novidades, conteúdo informativo, analítico e publicitário sobre produtos e serviços da Genial e de seus parceiros; e aceita receber comunicações da Genial pelos canais oficiais (E-mail, SMS, Whatsapp, Telefone).')
    await commomPage.scrollParaBaixoAteEncontrarElemento('Abra sua conta')
});

Entao('sera direcionado para a home da plataforma', async () => {
    const commomPage = new CommonPage(page);
    await commomPage.validarTexto('Destaques da semana')
});

Entao('o campo de email devera ter as opcoes {string} e {string}', async (elementUm: string, elementDois: string) => {
    const commomPage = new CommonPage(page);
    await commomPage.visualizarBotao(elementUm);
    await commomPage.visualizarBotao(elementDois);
});

Entao('devera constar na lista de emails o novo email {string}', async (email: string) => {
    const usuario = global.massData[email];
    const commomPage = new CommonPage(page);
    const loginPage = new LoginPage(page);
    await commomPage.validarTexto('Selecione o e-mail cadastrado:')
    await loginPage.clicarCampoEmailCadastrado(usuario.login)
    await page.getByRole('option', { name: email }).isVisible();
});

Entao('devera remover em tempo real da tela o email {string}', async (email: string) => {
    const usuario = global.massData[email];
    const isEmailHidden = await page.getByLabel(usuario.login).isHidden();
    if (!isEmailHidden) {
        throw new Error(`O email ${usuario.login} ainda está visível na tela.`);
    }
});


