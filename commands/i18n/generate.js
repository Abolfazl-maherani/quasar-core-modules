const fs = require("fs");
const path = require("path");
const colors = require("colors");
const lodash = require("lodash");

module.exports = function () {
  this.generate = async function (options) {
    const availableLocales = ["en-US", "fa-IR"];

    const srcDir = path.join(__dirname, "/../../../..");
    const modulesDir = path.join(srcDir, "/modules");

    const availableModules = await findModules();

    let modulesExtractedKeys = {};

    availableModules.forEach((moduleName) => {
      modulesExtractedKeys[moduleName] = {};
    });

    async function findModules(dir = modulesDir) {
      return fs.readdirSync(dir);
    }

    async function checkI18nFiles() {
      for (let moduleName of availableModules) {
        await extractModuleKeys(moduleName);

        for (let localeName of availableLocales) {
          if (!fs.existsSync(`${modulesDir}/${moduleName}/languages`)) {
            fs.mkdirSync(`${modulesDir}/${moduleName}/languages`, {
              recursive: true,
            });
          }

          const localeFilePath = `${modulesDir}/${moduleName}/languages/${localeName}.json`;
          let localeFileContent = {};

          if (!fs.existsSync(localeFilePath)) {
            fs.writeFileSync(
              localeFilePath,
              JSON.stringify(localeFileContent),
              "utf-8"
            );
          } else {
            localeFileContent = require(localeFilePath);
          }

          for (let languageKey in modulesExtractedKeys[moduleName]) {
            if (
              !Object.prototype.hasOwnProperty.call(
                localeFileContent,
                languageKey
              )
            ) {
              localeFileContent[languageKey] =
                modulesExtractedKeys[moduleName][languageKey];
            }
          }

          for (let languageKey in localeFileContent) {
            if (
              !Object.prototype.hasOwnProperty.call(
                modulesExtractedKeys[moduleName],
                languageKey
              )
            ) {
              delete localeFileContent[languageKey];
            }
          }

          localeFileContent = JSON.stringify(
            lodash.pick(
              localeFileContent,
              Object.keys(localeFileContent).sort()
            ),
            null,
            2
          );

          fs.writeFileSync(localeFilePath, localeFileContent, "utf-8");

          console.log(colors.green(`${localeFilePath} saved.`));
        }
      }
    }

    async function extractModuleKeys(
      moduleName,
      dir = modulesDir + "/" + moduleName
    ) {
      const pattern = new RegExp(
        "src/modules/" + moduleName + "/(.*).[vue|js]"
      );
      const files = fs.readdirSync(dir);

      for (let file of files) {
        let filePath = dir + "/" + file;
        let stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
          extractModuleKeys(moduleName, filePath);
        } else if (stats.isFile() && pattern.test(filePath)) {
          const doc = fs.readFileSync(filePath, "utf8");

          const regex =
            /\$?mt\(\s*?["|'](.+?)["|']\s*?,\s*?["|'](.+?)["|']\s*?[\)|,]/g;

          let match;

          do {
            match = regex.exec(doc);
            if (match) {
              const moduleName = match[1];
              const i18nKey = match[2];

              modulesExtractedKeys[moduleName][i18nKey] = null;
            }
          } while (match);

          console.log(colors.blue(`${filePath} extracted.`));
        }
      }
    }

    async function cacheFiles() {
      let mainI18nFile = "";
      let mainI18nLocales = {};

      for (const localeName of availableLocales) {
        // console.log(localeName);
        let localeFile = "";
        let localeModules = {};

        mainI18nLocales[localeName] = localeName.replace("-", "");

        for (const moduleName of availableModules) {
          // if (
          //   !fs.existsSync(
          //     `./src/modules/${moduleName}/languages/${localeName}`
          //   )
          // ) {
          //   fs.mkdirSync(
          //     `./src/modules/${moduleName}/languages/${localeName}`,
          //     {
          //       recursive: true,
          //     }
          //   );
          // }

          localeFile += `import ${moduleName} from "../../../${moduleName}/languages/${localeName}.json";\n`;

          localeModules[moduleName] = moduleName;
        }

        mainI18nFile += `import ${localeName.replace(
          "-",
          ""
        )} from "./${localeName}";\n`;

        localeFile += `\nexport default `;
        localeFile += JSON.stringify(localeModules, null, 2).replace(
          /"([^"]+)": "([^"]+)"/g,
          "$1"
        );
        localeFile += `;`;

        if (!fs.existsSync(`./src/modules/app/i18n/${localeName}`)) {
          fs.mkdirSync(`./src/modules/app/i18n/${localeName}`, {
            recursive: true,
          });
        }

        fs.writeFileSync(
          `./src/modules/app/i18n/${localeName}/index.js`,
          localeFile,
          "utf-8"
        );

        console.log(
          colors.green(`./src/modules/app/i18n/${localeName}/index.js saved.`)
        );
      }

      mainI18nFile += `\nexport default `;
      mainI18nFile += JSON.stringify(mainI18nLocales, null, 2).replace(
        /"([^"]+)": "([^"]+)"/g,
        '"$1": $2'
      );
      mainI18nFile += `;`;

      fs.writeFileSync(
        `./src/modules/app/i18n/index.js`,
        mainI18nFile,
        "utf-8"
      );

      console.log(colors.green(`./src/modules/app/i18n/index.js saved.`));
    }

    async function doGenerate() {
      console.log(colors.blue("Extracting i18n keys from files ... "));
      await checkI18nFiles();
      console.log(colors.blue("Generating application i18n files ... "));
      await cacheFiles();
    }

    doGenerate();
  };
};
