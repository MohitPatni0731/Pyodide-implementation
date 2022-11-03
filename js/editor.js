const replaceTabWithSpaces = (code) => {
  return code.replace(/\t/g, "    ");
};

const code = document.getElementById("code");
const defaultCode =
  "try:\n\tx = 1\nexcept:\n\t# Write Your code here\nelse:\n\tprint('No exception occured')\nfinally:\n\tprint('We always do this')";
let disableEditingRange = [
  [1, 3] /* line 1 to 3 */,
  [5, -1] /* line 5 to end */,
];

code.value = replaceTabWithSpaces(defaultCode);

document.addEventListener("select", (event) => {
  console.log(code.selectionStart, code.selectionEnd);
  // If selection is not empty
  if (code.selectionStart !== code.selectionEnd) {
    // TODO: Check if any part of selection is in disableEditingRange
    code.blur();
  }
});

// Add key down event listener
code.addEventListener("keydown", function (e) {
  // Disable selecting with shift key
  if (
    e.shiftKey &&
    (e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight")
  ) {
    e.preventDefault();
  }

  // Disable editing
  const line = this.value.substr(0, this.selectionStart).split("\n").length;
  for (let i = 0; i < disableEditingRange.length; i++) {
    const [start, end] = disableEditingRange[i];
    if (start <= line && (end === -1 || line <= end)) {
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown"
      ) {
        return;
      }

      e.preventDefault();
      return;
    }
  }

  // if enter
  if (e.key === "Enter") {
    // Get cur line number
    const line = this.value.substr(0, this.selectionStart).split("\n").length;

    // Go through disableEditingRange and add 1 to start and end if line is greater than start
    for (let i = 0; i < disableEditingRange.length; i++) {
      const [start, end] = disableEditingRange[i];
      if (line <= start) {
        disableEditingRange[i][0] += 1;
        if (end !== -1) {
          disableEditingRange[i][1] += 1;
        }
      }
    }
  }
  if (e.key === "Tab") {
    e.preventDefault();
    const start = this.selectionStart;
    const end = this.selectionEnd;
    // Add 4 spaces to the current cursor position
    this.value =
      this.value.substring(0, start) + "    " + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 4;
  }

  //   If backspace and deleting a line update disableEditingRange
  if (e.key === "Backspace") {
    const line = this.value.substr(0, this.selectionStart).split("\n").length;
    const prevLine = this.value
      .substr(0, this.selectionStart - 1)
      .split("\n").length;
    console.log(line, prevLine);
    if (line !== prevLine) {
      for (let i = 0; i < disableEditingRange.length; i++) {
        const [start, end] = disableEditingRange[i];
        console.log(start, end);
        if (prevLine >= start && end !== -1 && prevLine <= end) {
          e.preventDefault();
          return;
        }
      }
      for (let i = 0; i < disableEditingRange.length; i++) {
        const [start, end] = disableEditingRange[i];
        if (line <= start) {
          disableEditingRange[i][0] -= 1;
          if (end !== -1) {
            disableEditingRange[i][1] -= 1;
          }
        }
      }
    }
  }

  if (e.shiftKey && e.key === "Tab") {
    // TODO: Handle like actual editor
  }

  //   Disable ctrl + s and cmd + s
  if ((e.ctrlKey || e.metaKey) && e.key === "s") {
    e.preventDefault();
  }
});
