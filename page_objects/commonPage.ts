import { Page } from 'playwright';
import { commonElements } from '../elements/commonElements';
import { expect } from '@playwright/test';

export class CommonPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async selecionarBotao(botao: string): Promise<void> {
    await this.page.getByRole(commonElements.botaoButton.role, { name: botao }).click();
  }

  async selecionarBotaoLink(nomeBotao: string): Promise<void> {
    await this.page.getByRole(commonElements.botaoLink.role, { name: nomeBotao }).click();
  }

  async selecionarBotaoMain(nomeBotao: string): Promise<void> {
    await this.page.getByRole(commonElements.botaoMain.role).getByRole(commonElements.botaoButton.role, { name: nomeBotao }).first().click();
  }

  async selecionarBotaoLabel(nomeBotao: string): Promise<void> {
    await this.page.getByLabel(nomeBotao).click();
  }

  async selecionarBotaoTab(botao: string): Promise<void> {
    await this.page.getByRole(commonElements.botaoTab.role, { name: botao }).click();
  }

  async botaoDialog(botao: string): Promise<void> {
    await this.page.getByRole(commonElements.botaoDialog.role, { name: botao }).click();
  }

  async selecionarBotaoOption(botao: string): Promise<void> {
    await this.page.getByRole(commonElements.botaoOption.role, { name: botao }).click();
  }

  async selecionarBotaoHeading(botao: string): Promise<void> {
    await this.page.getByRole(commonElements.botaoHeading.role, { name: botao }).click();
  }

  async selecionarBotaoOcultarAssinaturaEletronica(): Promise<void> {
    await this.page.getByLabel(commonElements.botaoOcultarAssinaturaEletronica.label).click();
  }

  async selecionarCheckbox(checkbox: string): Promise<void> {
    await this.page.getByLabel(checkbox).check();
  }  

  async desmarcarCheckbox(checkbox: string): Promise<void> {
    await this.page.getByLabel(checkbox).uncheck();
  }

  async selecionarTexto(texto: string): Promise<void> {
    await this.page.getByText(texto).click();
  }

  async selecionarTextoFirst(texto: string): Promise<void> {
    await this.page.getByText(texto).first().click();
  }
  
  async validarTexto(text: string): Promise<void> {
    try {
      const element = this.page.getByText(text)
      await expect(element).toBeVisible({ timeout: 10000 });
    } catch (error) {
      console.error(` Erro ao validar texto: ${text}\n`,error);
      throw error;
    }
  }

  async validarTextoFirst(text: string): Promise<void> {
    const firstElement = this.page.getByText(text).first();
    await expect(firstElement).toBeVisible({ timeout: 10000 });
  }

  async validarTextoLast(text: string): Promise<void> {
    const lastElement = this.page.getByText(text).last();
    await expect(lastElement).toBeVisible({ timeout: 10000 });
  }

  async validarAusenciaDoTexto(text: string): Promise<void> {
    try {
      const element = this.page.getByText(text)
      await expect(element).not.toBeVisible({ timeout: 10000 });
    } catch (error) {
      console.error(`O texto permanece presente: ${text}`, error);
      throw error;
    }
  }

async validarRetornoDominioURL(dominioEsperado: string): Promise<void> {
  await this.page.waitForTimeout(2000);

  const paginas = this.page.context().pages();
  const novaPagina = paginas.at(-1);

  if (paginas.length < 2 || !novaPagina) {
    throw new Error('❌ Nenhuma nova aba foi encontrada');
  }

  await novaPagina.waitForLoadState('networkidle', { timeout: 10000 });

  const url = novaPagina.url();
  console.log(` 📄 URL da nova aba: ${url}`);

  if (!url.includes(dominioEsperado)) {
    throw new Error(`❌ URL "${url}" não contém "${dominioEsperado}"`);
  }
  console.log(`✅ Domínio "${dominioEsperado}" validado com sucesso`);
}


  async validarNavegacaoParaNovaURL(urlEsperada: string): Promise<void> {
    await delay(5)
    const urlAtual = this.page.url();
    if (urlAtual !== urlEsperada) {
      const linkPresente = await this.page.$(`a[href="${urlEsperada}"]`);
      console.log(`url retornada: "${urlEsperada}"  \n`);
      if (!linkPresente) {
        throw new Error(`A navegação falhou. URL atual: ${urlAtual}, URL esperada: ${urlEsperada}`);
      }
    }
  }

  async validarPopUpAvaliar(): Promise<void> {
    await delay(5)
    const textoPopUp = this.page.getByText(commonElements.textoPopUpRecomendacaoGenial.text);
    if (await textoPopUp.isVisible()) {
      await this.page.getByRole(commonElements.botaoButton.role, {name: 'Avalie close'}).click();
    }
  }

  async validarPopUpAtualizarInformacoes(): Promise<void> {
    await delay(2);
    const elementPopUp = this.page.getByRole(commonElements.botaoButton.role, {name: 'atualizar agora'});
    if (await elementPopUp.isVisible()) {
      await this.page.getByRole(commonElements.botaoDialog.role).locator('div').filter({ hasText: 'Olá' }).locator('div').getByRole(commonElements.botaoButton.role).click();
    }
  }

async visualizarBotao(botao: string): Promise<void> {
  const rolesParaTestar = [
    commonElements.botaoButton.role,
    commonElements.botaoLink.role,
    commonElements.botaoMain.role,
    commonElements.botaoLabel.role,
    commonElements.botaoTab.role,
    commonElements.botaoDialog.role,
    commonElements.botaoOption.role,
    commonElements.botaoHeading.role
  ];

  for (const role of rolesParaTestar) {
    try {
      const elemento = role === 'label' 
        ? this.page.getByLabel(botao) 
        : this.page.getByRole(role, { name: botao });
      await expect(elemento).toBeVisible({ timeout: 3000 });
      // console.log(`✅ "${botao}" encontrado como: ${role}`);
      return;
    } catch (error) {
      continue;
    }
  }

  try {
    await expect(this.page.getByText(botao)).toBeVisible({ timeout: 3000 });
    // console.log(`✅ "${botao}" encontrado como texto`);
  } catch (error) {
    throw new Error(`❌ "${botao}" não encontrado`);
  }
}

async visualizarBotaoFirst(botao: string): Promise<void> {
  const rolesParaTestar = [
    commonElements.botaoButton.role,
    commonElements.botaoLink.role,
    commonElements.botaoMain.role,
    commonElements.botaoLabel.role,
    commonElements.botaoTab.role,
    commonElements.botaoDialog.role,
    commonElements.botaoOption.role,
    commonElements.botaoHeading.role
  ];

  for (const role of rolesParaTestar) {
    try {
      const elemento = role === 'label' 
        ? this.page.getByLabel(botao).first() 
        : this.page.getByRole(role, { name: botao }).first();
        
      await expect(elemento).toBeVisible({ timeout: 3000 });
      // console.log(`✅ Primeiro botão "${botao}" encontrado como: ${role}`);
      return;
    } catch (error) {
      continue;
    }
  }
  
  try {
    await expect(this.page.getByText(botao).first()).toBeVisible({ timeout: 3000 });
    // console.log(`✅ Primeiro botão "${botao}" encontrado como texto`);
  } catch (error) {
    throw new Error(`❌ Botão com o texto "${botao}" não encontrado`);
  }
}

  async scrollParaBaixoAteEncontrarElemento(texto: string): Promise<void> {
    const element = page.locator(`button:has-text("${texto}")`);
    await element.scrollIntoViewIfNeeded();
  }

  async scrollParaBaixoAteEncontrarLink(texto: string): Promise<void> {
    const element = page.locator(`a:has-text("${texto}")`);
    await element.scrollIntoViewIfNeeded();
  }

  async scrollParaBaixoAteEncontrarTexto(texto: string): Promise<void> {
    const locator = page.locator('text=' + texto);
    await locator.scrollIntoViewIfNeeded();
  }

  async scrollPorCoordenada(x: number, y: number): Promise<void> {
    // Scroll para cima: x=1000, y=0
    // Scroll para baixo: x=0, y=1000
    await delay(2)
    await this.page.evaluate(({ x, y }) => {
      window.scrollTo(x, y);
    }, { x, y });
  }

  async menuLateral(menuLateral: string): Promise<void> {
    await page.getByRole('button', { name: menuLateral }).click();
  }

  async preencherAssinaturaEletronica(assinaturaEletronica: string): Promise<void> {
    await this.page.getByPlaceholder(commonElements.campoAssinaturaEletronica.placeholder).fill(assinaturaEletronica);
  }

  async preencherCampo(preencherTexto: string): Promise<void> {
    await this.page.getByRole(commonElements.preencherCampo.role).fill(preencherTexto);
  }

  async gerarDataFuturaAleatoria(): Promise<string> {
    const hoje = new Date();
    const diasNoFuturo = Math.floor(Math.random() * 365) + 1;
    const dataFutura = new Date(hoje);
    dataFutura.setDate(hoje.getDate() + diasNoFuturo);
  
    const dia = String(dataFutura.getDate()).padStart(2, '0');
    const mes = String(dataFutura.getMonth() + 1).padStart(2, '0'); // Os meses são indexados a partir de 0
    const ano = dataFutura.getFullYear();
  
    return `${dia}/${mes}/${ano}`;
  }

  async gerarDataPassadaAleatoria(): Promise<string> {
    const hoje = new Date();
    const diasNoPassado = Math.floor(Math.random() * 365) + 1;
    const dataPassada = new Date(hoje);
    dataPassada.setDate(hoje.getDate() - diasNoPassado);
  
    const dia = String(dataPassada.getDate()).padStart(2, '0');
    const mes = String(dataPassada.getMonth() + 1).padStart(2, '0');
    const ano = dataPassada.getFullYear();
  
    return `${dia}/${mes}/${ano}`;
  }

}