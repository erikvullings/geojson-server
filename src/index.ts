import fs from 'fs';
import path from 'path';
import { exit } from 'process';

const dataFolder = path.resolve(process.cwd(), process.env.DATA_FOLDER || 'data');
const outputFolder = path.resolve(process.cwd(), process.env.OUTPUT_FOLDER || 'output');

const processFolder = (folder = dataFolder) => {
  fs.readdir(folder, (err, files) => {
    if (err) {
      console.error(err);
      exit(1);
    }
    const result = [] as Array<{ id: number; data: any }>;
    files.forEach((file) => {
      const fromPath = path.resolve(folder, file);
      fs.stat(fromPath, (err, stats) => {
        if (err) {
          console.error(err);
          return;
        }
        if (stats.isDirectory()) {
          processFolder(fromPath);
        } else {
          const data = JSON.parse(fs.readFileSync(fromPath).toString());
          const m = /(?:^.*\.|^)(\d*).*\.(?:geo)?json$/i.exec(file);
          const id = m ? +m[1] : undefined;
          if (id) {
            result.push({ id, data });
          }
          if (Object.keys(result).length === files.length) {
            if (!fs.existsSync(outputFolder)) {
              fs.mkdirSync(outputFolder);
            }
            const filename = path.resolve(outputFolder, path.basename(folder) + '.json');
            console.log(
              `Writing "${filename}", combining ${files.length} files from the "${folder}" folder.`
            );
            fs.writeFileSync(filename, JSON.stringify(result));
          }
        }
      });
    });
  });
};

processFolder();
