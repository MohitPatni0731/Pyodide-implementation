import { asyncRun } from "./py-worker.js";

function addToOutput(s) {
    output.value += `${s}\n`
    output.scrollTop = output.scrollHeight
}

async function evaluatePython() {
    addToOutput(`>>>${code.value}`)

    try {
        // await pyodide.loadPackagesFromImports(code.value, addToOutput, addToOutput)
        const {result, error} = await asyncRun(code.value, {})
        if (error) {
            // console.log("pyodideWorker error: ", error);
            addToOutput(`${error}`)
          }else if (result) {
            // console.log("pyodideWorker return results: ", result);
            addToOutput(`${result}`)
          } 
    } catch (e) {
        console.log(
            `Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`
        );
        addToOutput(`${e.message}`)
    }
}

(async () => {
    const output = document.getElementById('output');
    const code = document.getElementById("code");
    const run = document.getElementById("run");
    output.value = 'Initializing...\n';
    run.addEventListener("click", evaluatePython);
})();