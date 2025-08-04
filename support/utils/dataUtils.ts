import fs from 'fs';
import path from 'path';

// Função para obter a configuração de massa de dados com base no ambiente
export const getMassData = (envType: string) => {
  const massDataPath = path.resolve(__dirname, '../massasEnv.json');
  const massData = JSON.parse(fs.readFileSync(massDataPath, 'utf8'));
  return massData[envType];
};