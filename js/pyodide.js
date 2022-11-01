import { asyncRun, interruptExecution } from "./py-worker.js";

function addToOutput(s) {
    output.value += `${s}\n`
    output.scrollTop = output.scrollHeight
}

async function evaluatePython() {
    addToOutput(`>>>${code.value}`)
    document.getElementById('run').disabled = true;
    document.getElementById('run').innerText = 'Running...';
    document.getElementById('stop').disabled = false;

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

    document.getElementById('run').disabled = false;
    document.getElementById('run').innerText = 'Run';
    document.getElementById('stop').disabled = true;
}

(async () => {
    const output = document.getElementById('output');
    const code = document.getElementById("code");
    const run = document.getElementById("run");
    const stop = document.getElementById("stop");
    output.value = 'Initializing...\n';
    run.addEventListener("click", evaluatePython);    
    stop.addEventListener("click", interruptExecution);
})();