# language: pt

Funcionalidade: Plataforma - Pré login

  Contexto:
    Dado que esteja na home deslogada

# PRÉ LOGIN
    @regressivo_pre_login_hml @smoke_pre_login_pre_prod
    Cenário: Pré Login - Validar avisos de privacidade na home da plataforma
      Quando apresentar a home de login da plataforma
      Entao devera apresentar aviso para utilizar cookies e privacidade

    @regressivo_pre_login_hml @smoke_pre_login_pre_prod
    Cenário: Pré Login - Esqueci minha senha
      Quando digitar o email "usuario_valido"
      E clicar no botao "Próximo"
      E clicar no botao "Esqueci minha senha"
      Entao sera aberto frame com a mensagem "Para sua segurança, a redefinição de senha deve ser feita exclusivamente pelo app Genial. Escaneie o QR code para acessar o App Genial."

# Se rodar em prd, irá para outra tela diferente de HML pedindo token do email digitado
    @regressivo_pre_login_hml @smoke_pre_login_pre_prod
    Cenário: Pré Login - Efetuar o login com e-mail inválido
      Quando digitar o email "usuario_inexistente"
      E clicar no botao "Próximo"
      Entao sera apresentado em tela a mensagem "Atenção! Token inválido. Verifique e tente novamente."

    @regressivo_pre_login_hml @smoke_pre_login_pre_prod
    Cenário: Pré Login - Validar botão QUERO ABRIR UMA CONTA
      Quando devera apresentar aviso para utilizar cookies e privacidade
      E clicar no botao "quero abrir uma conta"
      Entao devera ser direcionado para a tela de cadastro

    # @regressivo_pre_login_hml @smoke_pre_login_pre_prod
    Cenário: Pré Login - Tentativa de login com e-mail valido e senha incorreta
      Dado ao logar na plataforma com o "usuario_valido_senha_invalida"
      Entao sera apresentado em tela a mensagem "Usuário e/ou Senha incorretos."

