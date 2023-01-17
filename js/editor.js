let experiments = [
  "value-error",
  "key-error",
  "index-error",
  "zero-division-error",
];

let selectedExp = experiments[0];

const expSelector = document.getElementById("exception-name");

const code = document.getElementById("code");

let defaultCode = {
  "value-error":
    "total_marks = 468\ntry:\n\tinput = '10'\n\tnumber_of_students = # Enter anything\n\taverage_marks = total_marks/number_of_students\nexcept ValueError:\n\tprint('Number of students has to be an Integer')\nfinally:\n\tprint('Found the average marks')",
  "key-error":
    "marks = {'Maths': 90, 'Science': 80, 'English': 70}\ntry:\n\tprint(marks['Social'])\nexcept KeyError:\n\tprint('Social is not a subject')\nfinally:\n\tprint('Found the average marks')",
  "index-error":
    "marks = [90, 80, 70]\ntry:\n\tprint(marks[3])\nexcept IndexError:\n\tprint('Index out of range')\nfinally:\n\tprint('Found the average marks')",
  "zero-division-error":
    "total_marks = 468\ntry:\n\tinput = '10'\n\tnumber_of_students = int(input)\n\taverage_marks = total_marks/number_of_students\nexcept ZeroDivisionError:\n\tprint('Number of students cannot be zero')\nfinally:\n\tprint('Found the average marks')",
};

code.value = defaultCode[selectedExp];

let editor = CodeMirror.fromTextArea(code, {
  mode: "python",
  lineNumbers: false,
  indentWithTabs: true,
  autofocus: true,
  tabSize: 2,
  value: defaultCode[selectedExp],
  //readOnly: 'nocursor'
});

let readOnlyLines = {
  "value-error": [0, 1, 2, 4, 5, 6, 7, 8],
  "key-error": [0, 1, 2, 4, 5, 6, 7, 8],
  "index-error": [0, 1, 2, 4, 5, 6, 7, 8],
  "zero-division-error": [0, 1, 2, 4, 5, 6, 7, 8],
};

expSelector.addEventListener("change", (e) => {
  selectedExp = e.target.value;

  initialiseEditor(defaultCode[selectedExp], readOnlyLines[selectedExp]);
});

const initialiseEditor = (cur_code, readLines) => {
  // Remove existing listeners
  editor.off("change");
  editor.off("beforeChange");
  document.querySelector(".CodeMirror")?.remove();
  code.value = defaultCode[selectedExp];
  editor = CodeMirror.fromTextArea(code, {
    mode: "python",
    lineNumbers: false,
    indentWithTabs: true,
    autofocus: true,
    tabSize: 2,
    value: defaultCode[selectedExp],
    //readOnly: 'nocursor'
  });
  editor.setValue(defaultCode[selectedExp]);
  editor.refresh();

  editor.on("beforeChange", (cm, change) => {
    // If readOnly line is changed
    if (~readLines.indexOf(change.from.line)) {
      change.cancel();
    }
  });

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
        if (~readLines.indexOf(i)) {
          readLines = readLines.map((line) => {
            return line >= i ? line + 1 : line;
          });
          break;
        }
      }
      console.log(readLines);
    }

    // Update code.value
    // code.value = cm.getValue();
  });
};

initialiseEditor(defaultCode[selectedExp], readOnlyLines[selectedExp]);
