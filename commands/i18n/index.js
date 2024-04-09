#! /usr/bin/env node

const packagejson = require("../../../../../package.json");
const program = require("commander");
const { generate, cache } = require("./commands.js");

const helpText = `

Getting Started
===============

Description
`;

program.description(`${packagejson.name} CLI`).addHelpText("after", helpText);

program
  .command("generate")
  .alias("g")
  // .option("-w, --watch", `Watch CSV file for changes & regenerate files`, false)
  .description("Generate i18n language files from modules.")
  .action((options) => {
    generate(options);
  });

program
  .command("cache")
  .alias("c")
  .option("-w, --watch", `Watch CSV file for changes & regenerate files`, false)
  .description("Cache application i18n language files from modules.")
  .action((options) => {
    cache(options);
  });

program.parse(process.argv);
