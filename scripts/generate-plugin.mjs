#!/usr/bin/env zx
// @ts-check
import "zx/globals";
import { ROOT_DIR } from "./tools/path.mjs";

const libDir = path.join(__dirname, "../lib");
const templateDir = path.join(__dirname, "./template");

const [_pluginName] = process.argv;

const pluginName = _pluginName.includes("reactotron")
  ? _pluginName
  : `reactotron-${_pluginName}`;
const targetDir = path(libDir, pluginName);

console.log(`Module name: ${pluginName}`);
// validate that the target directory exists
if (fs.existsSync(targetDir)) {
  console.error(`Plugin already exists "${targetDir}" does not exist`);
  process.exit(1);
}

fs.mkdirSync(targetDir, { recursive: true });

fs.writeFileSync(
  path.join(outputDir, "package.json"),
  JSON.stringify(getPackageJson(pluginName), null, 2)
);

fs.copyFileSync(
  path.join(templateDir, "tsconfig.json"),
  path.join(outputDir, "tsconfig.json")
);

fs.copyFileSync(
  path.join(templateDir, "project.json"),
  path.join(outputDir, "project.json")
);

fs.copyFileSync(
  path.join(templateDir, "LICENSE"),
  path.join(outputDir, "LICENSE")
);

const srcFolder = path.join(outputDir, "src");
fs.mkdirSync(srcFolder, { recursive: true });

fs.writeFileSync(
  path.join(srcFolder, `index.ts`),
  createTemplatePlugin(pluginName)
);

fs.writeFileSync(
  path.join(srcFolder, `${pluginName}.ts`),
  createTemplatePlugin(pluginName)
);

fs.writeFileSync(
  path.join(outputDir, `README.md`),
  createTemplateREADME(pluginName)
);

function camelize(str: string) {
  const arr = str.split("-");
  const capital = arr.map((item, index) =>
    index
      ? item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()
      : item.toLowerCase()
  );
  return capital.join("");
}

function createTemplateIndex({
  pluginName
}) {
  let template = fs.readFileSync(path.join(templateDir, "index.ts"), "utf8");

  template = template.replace(/templatePlugin/g, camelize(pluginName));
  template = template.replace(/reactotron-template/g, pluginName);

  return template;
}

function createTemplatePlugin({
  pluginName
}) {
  let template = fs.readFileSync(path.join(templateDir, `reactotron-template.ts`), "utf8");

  template = template.replace(/templatePlugin/g, camelize(pluginName));

  return template;
}

function createTemplateREADME({
  pluginName,
}) {
  let template = fs.readFileSync(path.join(templateDir, "README.md"), "utf8");

  template = template.replace(/reactotron-template/g, pluginName);

  return template;
}

function createTemplateRollupConfig({pluginName}) {
  let template = fs.readFileSync(path.join(templateDir, "rollup.config.ts"), "utf8");

  template = template.replace(/reactotron-template/g, pluginName);

  return template;
}

function getPackageJson({
  pluginName
}) {
  const templatePackageJson = JSON.parse(
    fs.readFileSync(path.join(templateDir, "package.json"), "utf8")
  );

  templatePackageJson.name = pluginName;
  templatePackageJson.homepage = `https://github.com/infinitered/reactotron/tree/master/lib/${pluginName}`,
  templatePackageJson.repository = `https://github.com/infinitered/reactotron/tree/master/lib/${pluginName}`",

  return templatePackageJson;
}
