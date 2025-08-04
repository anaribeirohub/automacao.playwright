import * as path from 'path';
import * as fs from 'fs';
import * as reporter from 'cucumber-html-reporter';

// Função para obter relatorio
export const generateReport = (envType: string, browserType: string) => {
  const jsonFilePath = path.resolve(__dirname, '../../reports/cucumber_report.json');
  const htmlFilePath = path.resolve(__dirname, '../../reports/cucumber_report.html');

  try {
    if (fs.existsSync(jsonFilePath)) {
      fs.readFile(jsonFilePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading JSON file: ${err}`);
          return;
        }

        try {
          const options: reporter.Options = {
            theme: 'bootstrap',
            jsonFile: jsonFilePath,
            output: htmlFilePath,
            reportSuiteAsScenarios: true,
            launchReport: true,
            metadata: {
              "App Version": "1.0.0",
              "Test Environment": envType.toUpperCase(),
              "Browser": browserType,
              "Platform": "WEB",
              "Parallel": "Scenarios",
              "Executed": "Remote"
            }
          };

          reporter.generate(options);
        } catch (err) {
          console.error(`Error parsing JSON data: ${err}`);
        }
      });
    } else {
      console.error(`JSON report not found at ${jsonFilePath}`);
    }
  } catch (error) {
    console.error('Error processing JSON file:', error);
  }
};