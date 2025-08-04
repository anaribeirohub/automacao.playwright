const common = [
  '--require-module ts-node/register',              // Suporte para TypeScript
  '--require support/hooks.ts',                     // Caminho para os hooks
  '--require step_definitions/**/**/*.ts',          // Caminho para os step definitions
  '--format json:./reports/cucumber_report.json',   // Formato JSON para o relatório
  '--format progress-bar',                          // Formato de saída legível
  // '--format @cucumber/pretty-formatter'             // Formato de saída legível e detalhada

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