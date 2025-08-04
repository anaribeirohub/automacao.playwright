# Projeto Playwright com Cucumber em TypeScript

## Introdução

Este projeto utiliza o Playwright e o Cucumber para automação de testes de aplicações web no banco Genial. Com o Playwright, você pode automatizar testes em diferentes navegadores e modos (normal, depuração ou headless), enquanto o Cucumber oferece uma estrutura de teste baseada em comportamento (BDD) que permite escrever testes em linguagem natural.

## Instalação de Dependências

Para começar, você precisa instalar as dependências do projeto. Certifique-se de ter o Node.js e o npm instalados em seu sistema. Em seguida, execute o seguinte comando:

```sh
npm install
npx playwright install
```

Isso instalará todas as dependências necessárias, incluindo o Playwright, o Cucumber e as bibliotecas TypeScript.

## Escrevendo Testes

Os testes são escritos usando a linguagem Gherkin do Cucumber. Eles são armazenados nos arquivos `.feature` na pasta `features`. Aqui está um exemplo simples de um arquivo `.feature`:

```gherkin
# features/sample.feature

Feature: Login Feature

  Scenario: Successful Login
    Given I am on the login page
    When I enter my username and password
    Then I should be logged in
```

Você pode adicionar mais cenários e funcionalidades conforme necessário.

## Executando os Testes

### Rodar os Testes

Para rodar os testes, você pode usar o seguinte comando:

```sh
npx cucumber-js
```

Isso executará todos os arquivos `.feature` na pasta `features` por padrão.

### Rodar um Teste Específico

Se você deseja executar apenas um arquivo de teste específico, você pode fazer:

```sh
npx cucumber-js features/sample.feature
```

### Definindo Variáveis de Ambiente

Você pode definir variáveis de ambiente para configurar o ambiente de execução dos testes. Use `cross-env` para garantir compatibilidade entre diferentes sistemas operacionais.

### Rodar em Modo Headless

Para executar os testes em modo headless (sem interface gráfica), você pode fazer:

```sh
npx cross-env HEADLESS=true npx cucumber-js
```

### Rodar em um Navegador Específico

Para rodar os testes em um navegador específico, como o Firefox, você pode fazer:

```sh
npx cross-env BROWSER=firefox npx cucumber-js
```

### Rodar em um Ambiente Específico

Para rodar os testes em um ambiente específico, como `hml`, você pode fazer:

```sh
npx cross-env ENV=hml npx cucumber-js
```

### Executar Combinando Variáveis de Ambiente

Você pode combinar várias variáveis de ambiente. Por exemplo, para rodar testes em modo headless no Firefox no ambiente `hml`:

```sh
npx cross-env ENV=hml SITE=my_account BROWSER=firefox HEADLESS=true npx cucumber-js features/plataforma/login/login\ copy.feature
```

### Depurar Testes

Para iniciar a execução dos testes em modo de depuração, você pode usar o comando abaixo:

```sh
npx cross-env DEBUG=true npx cucumber-js --tags "@testando"
```

Este comando inicia a execução dos testes com o timeout desativado (infinito) para permitir uma depuração mais detalhada. Certifique-se de definir a variável de ambiente `DEBUG` para `true` para ativar este modo.


Para debugar em uma parte especifica do código coloque o comando

```sh
await global.page.pause(); // Pausa para depuração
```


### Rodar Testes por Tags

Você pode executar testes filtrando por tags. Por exemplo, para executar apenas os cenários marcados com `@smoke`, você pode fazer:

```sh
npx cucumber-js --tags "@smoke"
```

Para combinar várias tags, você pode fazer:

```sh
npx cucumber-js --tags "@tag1" --tags "@tag2"
```

E para excluir cenários com determinadas tags, você pode usar a lógica booleana NOT. Por exemplo, para executar todos os cenários exceto aqueles marcados com `@tag1`, você pode fazer:

```sh
npx cucumber-js --tags 'not @tag1'
```


### Rodar os Testes no Jenkins

Para rodar os testes com os logs organizados, você pode usar o seguinte comando:

```sh
npx cross-env cucumber-js --tags "@tag1" --format summary
```

o comando "--format summary" resultará em uma saída mais limpa, sem pontos adicionais.



### Configuração do Cucumber

Aqui estão algumas opções de configuração que você pode adicionar ao seu comando do Cucumber para ajustar como seus testes são executados e relatados:

```javascript
const common = [
  '--require-module ts-node/register',              // Suporte para TypeScript
  '--require support/hooks.ts',                     // Caminho para os hooks
  '--require step_definitions/**/**/*.ts',          // Caminho para os step definitions
  '--format json:./reports/cucumber_report.json',   // Formato JSON para o relatório
  '--format progress-bar'                           // Formato de saída legível
].join(' ');

const smoke = [
  '--tags @smoke',                                  // Executar apenas cenários marcados com @smoke
  '--retry 2',                                      // Reexecutar cenários falhados duas vezes
].join(' ');

const parallel = [
  '--parallel 4',                                   // Executar testes em paralelo usando 4 threads
].join(' ');

module.exports = {
  default: common,
  smoke: `${common} ${smoke}`,
  parallel: `${common} ${parallel}`
};
```

### Usando Perfis

Você pode adicionar perfis no arquivo `cucumber.js` para diferentes configurações de execução, permitindo que você escolha rapidamente uma configuração específica ao executar seus testes.

Para usar um perfil específico, você pode executar o comando Cucumber com a opção `--profile`:

```sh
npx cucumber-js --profile smoke
```

ou

```sh
npx cucumber-js --profile parallel
```



### Tags

O padrão de tags para rodar os teste são compostos por:

- Tipo do teste;
- Funcionalidade;
- Ambiente;

Exemplos:

```sh
regressivo_home_hml
```

ou

```sh
smoke_home_preprod
```



### Hooks

Este arquivo contém configurações essenciais e ganchos do Cucumber para configurar e finalizar o ambiente de teste.

Configuração incial:

```sh
Before
```

Configura o navegador, o contexto, a página e carrega as configurações e os dados de massa antes de cada cenário.


Ações Após Cada Passo:

```sh
AfterStep
```

Captura screenshots em caso de falha e exibe informações detalhadas no console log sobre os passos executados.


Finalização por Cenário:

```sh
After
```

Fecha a página e o navegador após cada cenário finalizar.


Relatório:

```sh
AfterAll
```

Gera relatórios ao final da execução dos cenários executados, sendo possível visualizar dentalhadamente cada etapa que foi ou deixou de ser executada.



### Config Env

O arquivo é estruturado em formato JSON, com cada ambiente representado com uma chave dentro do objeto principal "plataforma". Cada ambiente possui uma propriedade "BASE_URL", que define a URL base do sistema para aquele ambiente.

```json
{
  "dev": {
    "plataforma": {
      "BASE_URL": "https://appdev.genialinvestimentos.com.br"
    }
  },
  "hml": {
    "plataforma": {
      "BASE_URL": "https://apphml.genialinvestimentos.com.br/auth/login"
    },
    "conta_digital": {
      "BASE_URL": "https://apphmlcontadigital.genialinvestimentos.com.br/auth/login"
    }
  },
  "prd": {
    "plataforma": {
      "BASE_URL": "https://app.genialinvestimentos.com.br"
    }
  }
}
```

Durante a execução dos testes, o ambiente de execução é definido por meio de uma variável de ambiente

```sh
ENV 
``` 

Com base no valor dessa variável, o sistema carrega a URL correspondente do configEnv.json.

Para rodar testes no ambiente hml, use:

```sh
npx cross-env ENV=hml npx cucumber-js
```

Para rodar testes com ambiente e funcionalidade específica

```sh
npx cross-env ENV=dev FUNCIONALIDADE=conta_digital cucumber-js
```

Ambientes:

- dev: Ambiente de desenvolvimento.
- hml: Ambiente de homologação.
- prd: Ambiente de produção.
- pre_prd e pre_prd_02: Ambientes pré-produção, geralmente utilizados para validações finais antes do deploy.
- qa: Ambiente de qualidade.
- conta_digital: Ambiente dedicado à funcionalidade específica da conta digital.



### Massas Env

Nesse arquivo é organizado as massas de dados necessárias para os testes do projeto com, diferentes tipos de usuários e suas credenciais em ambientes específicos, como hml, etc. que facilita a execução de cenários de teste que envolvem diferentes combinações de login e senha para validar comportamentos específicos.


```json
{
  "MASSAS": {
    "dev": {
      "usuario_valido": {
        "login": "teste01@gmail.comx",
        "password": "000000"
      },
      "usuario_inexistente": {
        "login": "teste02@gmail.com",
        "password": "000000"
      }
    },
    "hml": {
      "usuario_valido": {
        "login": "teste03@hotmail.comx",
        "password": "000000"
      },
      "usuario_valido_senha_invalida": {
        "login": "testes05@hotmail.comx",
        "password": "000000"
      }
    }
  }
}
```



### BDD Pt-Br

Este arquivo é uma adaptação do Cucumber para facilitar o uso do framework com palavras-chave em português, facilitando a escrita de BDDs.

Funções nativas do Cucumber:

- Given >>> Dado
Representa a pré-condição ou o contexto inicial do cenário.

- When >>> Quando
Define uma ação ou evento que dispara a interação no sistema.

- And >>> E
Função auxiliar para incluir passos adicionais ao final de cenários.

- Then >>> Então
Define os resultados esperados ou verificações do cenário.



### Arquivos Utils

O projeto contém uma pasta chamada "utils", que inclui funções utilitárias essenciais para gerenciar massas de dados, variáveis de ambiente e relatórios. A pasta contém os arquivos:

- dataUtils.ts
- envUtils.ts
- reportUtils.ts

# dataUtils.ts

Este arquivo é responsável por gerenciar as massas de dados para diferentes ambientes do projeto.

```typescript
// Função para obter a configuração de massa de dados com base no ambiente
export const getMassData = (envType: string) => {
  const massDataPath = path.resolve(__dirname, '../massasEnv.json');
  const massData = JSON.parse(fs.readFileSync(massDataPath, 'utf8'));
  return massData[envType];
};
```
Retorna as massas de dados para o ambiente especificado, lendo-as do arquivo "massasEnv.json".


# envUtils.ts

Este arquivo centraliza funções para capturar variáveis de ambiente e configurar a execução dos testes, como o tipo de navegador, ambiente de teste e modos de execução (headless ou visual).

```typescript
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
};
```

# reportUtils.ts

Este arquivo lida com a geração de relatórios de execução em formato HTML a partir de arquivos JSON gerados pelo Cucumber, com base nos resultados dos testes.

```typescript
// Função para obter relatorio
export const generateReport = (envType: string, browserType: string) => {
  const jsonFilePath = path.resolve(__dirname, '../../reports/cucumber_report.json');
  const htmlFilePath = path.resolve(__dirname, '../../reports/cucumber_report.html');

  if (fs.existsSync(jsonFilePath)) {
    const options: reporter.Options = {
      theme: 'bootstrap',
      jsonFile: jsonFilePath,
      output: htmlFilePath,
      reportSuiteAsScenarios: true,
      metadata: {
        "Test Environment": envType.toUpperCase(),
        "Browser": browserType,
      }
    };
    reporter.generate(options);
  } else {
    console.error(`JSON report not found at ${jsonFilePath}`);
  }
};
```



### Common

São componentes importantes no framework de automação, organizando os testes de forma reutilizável e modular.

# commonPage.ts

Este arquivo encapsula as funções reutilizáveis que representam interações e validações que seram usadas em diferentes partes do teste. 

```typescript
async selecionarBotao(botao: string): Promise<void> {
  await this.page.getByRole(commonElements.botaoButton.role, { name: botao }).click();
}
```

# common.spec.ts

Este arquivo tem a função de ser reutilizado pelas suas steps em cenários que irão passar por algum fluxo repetitivo e que não seja nescessário ser mapeado mais de uma vez.

```typescript
E('visualizar o texto {string}', async (text) => {
  const commonPage = new CommonPage(global.page);
  await commonPage.validarTexto(text)
})
```


## Conclusão

Este README fornece uma visão geral básica de como configurar e executar testes com Playwright e Cucumber em TypeScript. Sinta-se à vontade para expandir e personalizar conforme necessário para atender aos requisitos do seu projeto.