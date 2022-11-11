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
        let resolved=false;
        const promise = asyncRun(code.value, {})
        promise.then(() => resolved=true);
        // Check if resolved every 100ms for 5s
        for (let i = 0; i < 50; i++) {
            await new Promise(resolve => setTimeout(resolve, 100));
            console.log('Checking if promise is resolved');
            if (resolved) {
                console.log('Promise is resolved');
                break;
            }
        }
        if (!resolved){
            addToOutput('Execution timed out. Interrupting...');
            interruptExecution();
        }
        const {result, error} = await promise;
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