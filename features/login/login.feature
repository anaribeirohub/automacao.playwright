# language: pt

Funcionalidade: Plataforma - Login

  Contexto:
    Dado que esteja na home deslogada

# LOGIN
    @regressivo_login_hml1 @smoke_login_pre_prod
    Cenário: Login - Efetuar login com sucesso na plataforma
      Dado ao logar na plataforma com o "usuario_valido"
      Entao sera direcionado para a home da plataforma

    @regressivo_login_hml @smoke_login_pre_prod
    Cenário: Login - Lembrar acesso de um novo email na plataforma
      Dado que antes de logar na plataforma selecione o checkbox "Lembrar meu acesso neste dispositivo"
      E ao logar na plataforma com o "usuario_valido"
      Quando sera direcionado para a home da plataforma
      E clicar no botao "Sair"
      E que esteja na home deslogada
      Entao o campo de email devera ter as opcoes "Adicionar nova conta" e "Remover conta neste dispositivo"

    @regressivo_login_hml @smoke_login_pre_prod
    Cenário: Login - Cadastrando um novo email na lista de emails logados na plataforma
      Dado que antes de logar na plataforma selecione o checkbox "Lembrar meu acesso neste dispositivo"
      E ao logar na plataforma com o "usuario_valido"
      Quando sera direcionado para a home da plataforma
      E clicar no botao "Sair"
      E clicar no botao "Adicionar nova conta"
      E que antes de logar na plataforma selecione o checkbox "Lembrar meu acesso neste dispositivo"
      E ao logar na plataforma com o "email_rentabilidade"
      E sera direcionado para a home da plataforma
      E clicar no botao "Sair"
      Entao devera constar na lista de emails o novo email "email_rentabilidade"

    @regressivo_login_hml @smoke_login_pre_prod
    Cenário: Login - Remover email que já tenha logado e salvo na plataforma
      Dado que antes de logar na plataforma selecione o checkbox "Lembrar meu acesso neste dispositivo"
      E ao logar na plataforma com o "usuario_valido"
      Quando sera direcionado para a home da plataforma
      E clicar no botao "Sair"
      E clicar no botao "Adicionar nova conta"
      E que antes de logar na plataforma selecione o checkbox "Lembrar meu acesso neste dispositivo"
      E ao logar na plataforma com o "email_rentabilidade"
      E sera direcionado para a home da plataforma
      E clicar no botao "Sair"
      E clicar no botao "Remover conta neste dispositivo"
      Entao devera remover em tempo real da tela o email "email_rentabilidade"

