const pyodideWorker = new Worker("./js/webworker.js");
const callbacks = {};

let interruptBuffer = new Uint8Array(new SharedArrayBuffer(1));
pyodideWorker.postMessage({ cmd: "setInterruptBuffer", interruptBuffer });

function interruptExecution() {
  // 2 stands for SIGINT.
  interruptBuffer[0] = 2;
}

pyodideWorker.onmessage = (event) => {
  const { id, loaded, ...data } = event.data;
  if(loaded){
    const output = document.getElementById('output');
    output.value = 'Initialized\n';
  }else{
    const onSuccess = callbacks[id];
    delete callbacks[id];
    onSuccess(data);
 }
};

const asyncRun = (() => {
  interruptBuffer[0] = 0;
  let id = 0; // identify a Promise
  return (script, context) => {
    // the id could be generated more carefully
    id = (id + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((onSuccess) => {
      callbacks[id] = onSuccess;
      pyodideWorker.postMessage({
        ...context,
        python: script,
        id,
      });
    });
  };
})();

export {asyncRun, interruptExecution}