// const replaceTabWithSpaces = (code) => {
//   return code.replace(/\t/g, "  ");
// };

const code = document.getElementById("code");
const defaultCode =
  "total_marks = 468\ntry:\n\tinput = '10'\n\tnumber_of_students = # Enter anything\n\taverage_marks = total_marks/number_of_students\nexcept ValueError:\n\tprint('Number of students has to be an Integer')\nfinally:\n\tprint('Found the average marks')";

code.value = defaultCode;

const editor = CodeMirror.fromTextArea(code, {
  mode: "python",
  lineNumbers: false,
  indentWithTabs: true,
  autofocus: true,
  tabSize: 2,
  //readOnly: 'nocursor'
});

let readOnlyLines = [0, 1, 2, 4, 5, 6, 7, 8];

editor.on("beforeChange", function (cm, change) {
  if (~readOnlyLines.indexOf(change.from.line)) {
    change.cancel();
  }
});

// Editor on change update code.value
editor.on("change", (cm, change) => {
  let old_value = code.value;
  let cur_value = cm.getValue();

  // Compare each line of old and new value
  let old_lines = old_value.split("\n");
  let cur_lines = cur_value.split("\n");

  // If length is not same
  // If there is a new line in editable range, add 1 to all readOnly lines after new line
  for (let i = 0; i < cur_lines.length; i++) {
    if (cur_lines[i] !== old_lines[i]) {
      // If i in readOnlyLines
      if (~readOnlyLines.indexOf(i)) {
        readOnlyLines = readOnlyLines.map((line) => {
          return line >= i ? line + 1 : line;
        });
        break;
      }
    }
    console.log(readOnlyLines);
  }

  // Update code.value
  code.value = cm.getValue();
});
