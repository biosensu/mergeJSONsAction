const core = require("@actions/core");
const github = require("@actions/github");
const fg = require("fast-glob");
const fs = require("fs").promises;

async function combineJsonFiles(p, prefix) {
  const jsonFiles = await fg(`${p}${prefix}*.json`);
  const combinedData = [];

  for (const file of jsonFiles) {
    const content = await fs.readFile(file, "utf-8");
    const jsonData = JSON.parse(content);
    combinedData.push(jsonData);
  }

  return combinedData;
}

async function gerarConsolidado() {
  try {
    console.log('salvando entradas...')
    const caminho = core.getInput("caminho");
    const prefixo = core.getInput("prefixo");
    console.log('entradas obtidas com sucesso')
    const combinedData = await combineJsonFiles(caminho, prefixo);
    console.log('jsons combinados com sucesso. Salvando arquivo...')
    // try {
    //   await fs.access(caminho);
    // } catch (error) {
    //   console.error(error)
    //   await fs.mkdir(caminho, { recursive: true });
    // }
    // try {
    //   await fs.access(caminho);
    // } catch (error) {
    //   core.setFailed("couldn't create directory structure");
    // }
    console.log('diretório acessado')

    core.setOutput("consolidado", JSON.stringify(combinedData, null, 2))
      
  

    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(`The event payload: ${payload}`);
  } catch (error) {
    core.setFailed(error.message);
  }
}

gerarConsolidado();