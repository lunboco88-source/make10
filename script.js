let nums = [];
let answer_exam = "";

function make_random_num() {
    return Math.floor(Math.random() * 10);
}

function updateDisplay() {
    // console.log(nums);
    for(let i = 0; i < 4; i++) {
        document.getElementById(['num' + (i + 1)]).innerHTML = nums[i];
    }
    for(i = 1; i <= 3; i++) {
        target = document.getElementById(["operator" + i]);
        target.classList.remove("hidden");
    }

}

function checkAnsExam(nums) {
    const operators = ["+", "-", "*", "/"];

    // 数字の並び順
    for(let a = 0; a < 4; a++) {
        for(let b = 0; b < 4; b++) {
            for(let c = 0; c < 4; c++) {
                for(let d = 0; d < 4; d++) {

                    // 同じ数字を2回使わない
                    if(a == b || a == c || a == d ||
                       b == c || b == d ||
                       c == d) {
                        continue;
                    }

                    // 演算子
                    for(let op1 = 0; op1 < 4; op1++) {
                        for(let op2 = 0; op2 < 4; op2++) {
                            for(let op3 = 0; op3 < 4; op3++) {

                                let o1 = operators[op1];
                                let o2 = operators[op2];
                                let o3 = operators[op3];

                                // 括弧パターン5種類
                                let expressions = [
                                    `((${nums[a]}${o1}${nums[b]})${o2}${nums[c]})${o3}${nums[d]}`,
                                    `(${nums[a]}${o1}(${nums[b]}${o2}${nums[c]}))${o3}${nums[d]}`,
                                    `${nums[a]}${o1}((${nums[b]}${o2}${nums[c]})${o3}${nums[d]})`,
                                    `${nums[a]}${o1}(${nums[b]}${o2}(${nums[c]}${o3}${nums[d]}))`,
                                    `(${nums[a]}${o1}${nums[b]})${o2}(${nums[c]}${o3}${nums[d]})`
                                ];

                                for(let expression of expressions) {

                                    let result;

                                    try {
                                        result = eval(expression);
                                    }
                                    catch {
                                        continue;
                                    }

                                    // 0除算などで Infinity が出た場合
                                    if(!isFinite(result)) {
                                        continue;
                                    }

                                    if(Math.abs(result - 10) < 0.0001) {
                                        answer_exam = expression;
                                        // console.log("解答例:", expression);

                                        return answer_exam;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return 0;
}

let check_answer_exam = 0;

function CreateProblem() {
    nums = []

    document
        .getElementById("insertParentheses")
        .classList.remove("hidden");

    document
        .getElementById("deleteParentheses")
        .classList.remove("hidden");

    document
        .getElementById("checkAns")
        .classList.remove("hidden");

    document
        .getElementById("show_ans")
        .classList.remove("hidden");




    document.getElementById("ans_exam").textContent = "";

    while(1) {
        for(let i = 0; i < 4; i++) {
            nums.push(make_random_num());
        }
        if(checkAnsExam(nums) != 0) break;
        else {
            nums = [];
            // console.log("わ！")
        }
    }

    updateDisplay();
}

let selectedIndex = -1;
let parentheses_num = 0;

let left_parentheses_index = -1;
let left_parentheses_element = null;

let warnTimer = null;

function clickNum(index) {
    let check_Parentheses_class =
        document.getElementById("insertParentheses");

    // 数字入れ替えモード
    if(check_Parentheses_class.className != "pressed") {

        if(selectedIndex == -1) {
            selectedIndex = index;

            document
                .getElementById("num" + (index + 1))
                .classList.add("selected");
        }
        else {
            let temp = nums[selectedIndex];
            nums[selectedIndex] = nums[index];
            nums[index] = temp;

            document
                .getElementById("num" + (selectedIndex + 1))
                .classList.remove("selected");

            selectedIndex = -1;

            updateDisplay();
        }
    }

    // 括弧挿入モード
    else {

        let element =
            document.getElementById("num" + (index + 1));

        // 左括弧
        if(parentheses_num == 0) {

            let left_parentheses =
                document.createElement("span");

            left_parentheses.className =
                "parentheses ans";

            left_parentheses.textContent = "(";

            element.before(left_parentheses);

            left_parentheses_element =
                left_parentheses;

            left_parentheses_index = index;

            parentheses_num = 1;
        }

        // 右括弧
        else {

            // 左括弧より左には置けない
            if(index <= left_parentheses_index) {

                const warnText = document.getElementById("warn_text");

                warnText.classList.remove("hidden");

                clearTimeout(warnTimer);

                warnTimer = setTimeout(() => {
                    warnText.classList.add("hidden");
                }, 1000);

                // 左括弧を削除
                if(left_parentheses_element != null) {
                    left_parentheses_element.remove();
                }

                left_parentheses_element = null;
                left_parentheses_index = -1;
                parentheses_num = 0;

                return;
            }

            let right_parentheses =
                document.createElement("span");

            right_parentheses.className =
                "parentheses ans";

            right_parentheses.textContent = ")";

            element.after(right_parentheses);

            left_parentheses_element = null;
            left_parentheses_index = -1;

            parentheses_num = 0;
        }
    }
}

function deleteParentheses() {
    let delete_parentheses = document.getElementsByClassName("parentheses");
    // console.log(delete_parentheses);

    while(delete_parentheses.length > 0) {
        delete_parentheses[0].remove();
    }
}

// 括弧挿入処理

function insertParentheses() {
    document
        .getElementById("insertParentheses")
        .classList.toggle("pressed");
}

function checkAns() {
    let ans_list = document.getElementsByClassName("ans")
    // console.log(ans_list);

    let expression = "";

    for(let i = 0; i < ans_list.length; i++) {

        if(ans_list[i].tagName == "SELECT") {
            expression += ans_list[i].value;
        }
        else {
            expression += ans_list[i].textContent;
        }
    }

    expression = expression.replaceAll("×", "*");
    expression = expression.replaceAll("÷", "/");

    // console.log(expression);

    let result = eval(expression);

    // console.log(result);

    document.getElementById("answer").innerHTML = `= ${result}`;

    if(result == 10) {
        document.getElementById("ans_word").textContent = "正解！！"
    } else {
        document.getElementById("ans_word").textContent = "残念"
    }
}


function showAns() {
    let new_answer_exam = answer_exam.replaceAll("*", "×");
    new_answer_exam = answer_exam.replaceAll("/", "÷");
    document.getElementById("ans_exam").textContent = answer_exam;
}