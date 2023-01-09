// const replaceTabWithSpaces = (code) => {
//   return code.replace(/\t/g, "  ");
// };

const code = document.getElementById("code");
const defaultCode =
  "total_marks = 468\ntry:\n\tinput = '10'\n\tnumber_of_students = # Enter anything\n\taverage_marks = total_marks/number_of_students\nexcept ValueError:\n\tprint('Number of students has to be an Integer')\nfinally:\n\tprint('Found the average marks')";

let disableEditingRange = [
  [1, 3] /* line 1 to 3 */,
  [5, -1] /* line 5 to end */,
];

code.value = defaultCode;

const editor = CodeMirror.fromTextArea(code, {
  mode: "python",
  lineNumbers: true,
  indentWithTabs: true,
  autofocus: true,
  tabSize: 2,
});

// Editor on change update code.value
editor.on("change", (cm, change) => {
  code.value = cm.getValue();
});
