const core = require("@actions/core");
const github = require("@actions/github");
const { promises: fs } = require("fs");
const fg = require("fast-glob");
const fs = require("fs").promises;

async function combineJsonFiles(path, prefix) {
  const jsonFiles = await fg(`${path}${prefix}*.json`);
  const combinedData = [];

  for (const file of jsonFiles) {
    const content = await fs.readFile(file, "utf-8");
    const jsonData = JSON.parse(content);
    combinedData.push(jsonData);
  }

  return combinedData;
}

try {
  const caminho = core.getInput("caminho");
  const prefixo = core.getInput("prefixo");
  const combinedData = await combineJsonFiles(caminho, prefixo);

  try {
    await fs.access(caminho);
  } catch (error) {
    await fs.mkdir(caminho, { recursive: true });
  }
  try {
    await fs.access(caminho);
  } catch (error) {
    core.setFailed("couldn't create directory structure");
  }

  await fs.writeFile(path.join(caminho,"combinados.json"), JSON.stringify(combinedData, null, 2));

  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
