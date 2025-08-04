// src/page_objects/plataforma/login/loginPage.ts
import { Page } from 'playwright';
import { commonElements } from '../../elements/commonElements';

export class LoginPage {
  private page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async textoAcesseSuaConta(): Promise<void> {
    await this.page.getByText('Olá! Acesse sua conta Genial').textContent();
  }

  async popUpPrivacidade(): Promise<void> {
    await delay(3)
    const acceptButton = this.page.getByRole(commonElements.botaoButton.role, { name: 'Accept' })
    const aceitarButton = this.page.getByRole(commonElements.botaoButton.role, { name: 'Aceitar' })

    if (await acceptButton.isVisible()) {
      await acceptButton.click()
    } else if (await aceitarButton.isVisible()) {
      await aceitarButton.click()
    } else {
      console.error(` Nenhum botão de aceitação de PopUp foi encontrado. `)
    }
  }

  async popUpCookies(): Promise<void> {
    await this.page.getByRole(commonElements.botaoButton.role, { name: 'Entendi' }).click()
  }

  async login(username: string, password: string): Promise<void> {
    await this.page.getByRole(commonElements.preencherCampo.role).click();
    await this.page.getByRole(commonElements.preencherCampo.role).fill(username);
    await this.page.getByRole(commonElements.botaoButton.role, { name: "Próximo" }).click();
    for (const digit of password) {
      await this.page.getByLabel(digit).click();
    }
    await this.page.getByRole(commonElements.botaoButton.role, { name: "Entrar" }).click();
  }

  async preencherCampoEmail(emailuser: string): Promise<void> {
    await this.page.getByRole(commonElements.preencherCampo.role).click();
    await this.page.getByRole(commonElements.preencherCampo.role).fill(emailuser);
  }

  async clicarCampoEmailCadastrado(emailCadastrado: string): Promise<void> {
    await this.page.getByLabel(emailCadastrado).click()
  }
  


}

