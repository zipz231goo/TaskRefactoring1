// Для зручності, маємо один блок для виводу результату, в який будемо записувати результат завдань
let RESULTBLOCK = document.getElementById('resultBlock');

// Знаходимо всі кнопки і згідно з id починаємо виконання функції, передавая параметри, згідно з завдання
let btns = document.querySelectorAll('button');
const taskElements = document.querySelectorAll(".task");

let taskFunctions = {};
taskElements.forEach(element => {
  if (element.id) {
    taskFunctions[element.id] = window[element.id] || null;
  }
});

btns.forEach((btn) => {
  btn.addEventListener('click', event => {
    let parentEl = event.target.parentElement;
    let fnName = parentEl.id;

    // Перевіряємо, чи існує така функція в об'єкті
    if (taskFunctions[fnName]) {
      taskFunctions[fnName](parentEl);
    }
  });
});

// Функція для оновлення блоку результата для зручносі винесена окремо
function refreshResultBlock(){
  RESULTBLOCK.innerHTML = '';
}

// Створюємо універсальну функцію
function handleTask(parentEl, callback) {
  let inputText = parentEl.querySelector('input[type="text"], input[type="number"], textarea[type="text"]').value;
  refreshResultBlock();
  callback(inputText);
}

function taskFunctionsOne(parentEl){
  // Записуємо в параметри текст та розмір шрифта, який потрібно згенерувати
  let inputText = parentEl.querySelector('textarea[type="text"]').value;
  let inputFontSize = parentEl.querySelector('input[type="number"]').value;
  refreshResultBlock();
  displayTextAndSize(inputText, inputFontSize);
}

function taskFunctionsTwo(parentEl){
  handleTask(parentEl, text => createTable(text.split(' ')));
}

function taskFunctionsThree(parentEl){
  handleTask(parentEl, createHeaders);
}

function taskFunctionsFour(parentEl){
  handleTask(parentEl, workWithParameters);
}

function taskDateTwo(parentEl){
  handleTask(parentEl, checkDate);
}

function taskRegExpOne(parentEl){
  handleTask(parentEl, findDates);
}

function taskRegExpTwo(parentEl){
  handleTask(parentEl, toCamelCase)
}

function taskRegExpThree(parentEl){
  handleTask(parentEl, toSnakeCase)
}

function taskRegExpFour(parentEl){
  handleTask(parentEl, findHexColor)
}

/** TASK 1, 1-4 **/

function displayTextAndSize(text, fontSize) {
  // let p = `<p style="font-size: ${fontSize}px;">${text}</p>`
  let p = document.createElement('p');
  p.append(text);
  p.style.fontSize = `${fontSize}px`
  RESULTBLOCK.append(p);
}

function createTable(arr){
  let tbl = document.createElement('table');
  RESULTBLOCK.append(tbl);
  for(let i=0; i<arr.length; i++){
    let tr = document.createElement('tr');
    tbl.append(tr)
    for(j=0; j<2; j++){
      let td = document.createElement('td');
      tr.append(td);
      if(j==0){
        td.innerText=i+1
      } else {
        td.innerHTML=arr[i]
      }
    }
  }
}

function createHeaders(n){
  for(let i=0; i<n; i++){
    let h2 = document.createElement('h2');
    h2.innerText = `Header${i+1}`;
    RESULTBLOCK.append(h2)
  }
}

function workWithParameters(text){
  let arr = text.split(' ');
  let numbers = [];
  let words = [];
  let sum = 0;

  // Записуємо число і слова з рядка в різні масиви
  arr.forEach((element) => {
    if (Number(element)) {
      numbers.push(parseFloat(element));
    } else {
      words.push(element);
    }
  });

  // Знаходимо суму
  numbers.forEach((element) => {
    sum+=element;
  })

  // Знаходимо максимальне число
  let maxNum = Math.max(...numbers);

  let str = words.join(' ');

  RESULTBLOCK.innerHTML = `
  1) Максимальне число з переданих: ${maxNum} <br>
  2) Сума переданих чисел ${numbers}:  ${sum} <br>
  3) Речення з переданих слів: ${str}`;
}



/** TASK 2, 1-2 **/

let dayNames = [`неділя`, `понеділок`, `вівторок`, `середа`, `четвер`, `п'ятниця`, `субота`];
let monthNames = [`січня`, `лютого`, `березня`, `квітня`, `травня`, `червня`, `липня`, `серпня`, `вересня`, `жовтня`, `листопада`, `грудня`];

function displayCurrentDateTime(){
  let resultBlock = document.getElementById('currentDateTime');

  let date = new Date();
  let day = date.getDate();
  let weekDay = date.getDay();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  
  let output = `Дата: ${day} ${monthNames[month-1]} ${year} року <br>
  День: ${dayNames[weekDay]} <br>
  Час: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;

  resultBlock.innerHTML = output;
}

function checkDate(text) {
  // Замінюємо в рядку символи "-" та "/" на "."
  let normalDateInput = text.replaceAll('-', '.').replaceAll('/', '.');

  // Деструктурування масиву 
  // Проходимо по кожному елементу масиву та застосовуємо функцію Number до кожного з них.
  // Результат: — кожен елемент перетворено з рядка на число.
  let [day, month, year] = normalDateInput.split('.').map(Number);

  // Перевірка чи правильно отримані значення
  if(!day || !month || !year){
    alert('Введіть в форматі дд.мм.рррр або дд/мм/рррр або дд-мм-рррр.');
    return
  }

  let date = new Date(year, month - 1, day);

  let today = new Date();
  today.setHours(0, 0, 0, 0); // Обнуляємо час

  // Обчислюємо різницю в днях
  let diffTime = today - date; // В мілісекундах
  let diffDays = parseInt(diffTime / (1000 * 60 * 60 * 24)); // Перетворюємо в дні

  let output = '';

  // Відповідно до різниці у днях виводимо відповідний текст
  if (diffDays === 0){
    output = 'Сьогодні';
  } else if (diffDays === 1){
    output = 'Вчора'
  } else if (diffDays >= 2 && diffDays <= 4){
    output = `${Math.floor(diffDays)} дні тому`;
  } else if (diffDays == 5 || diffDays == 6){
    output = `${Math.floor(diffDays)} днів тому`;
  } else if (diffDays === 7){
    output = "Тиждень тому";
  } else if (diffDays >= 365) {
    output = `${Math.floor(diffDays / 365)} рік тому`;
  } else {
    output = `${year}.${month}.${day}`
  }

  RESULTBLOCK.innerHTML = output;
}

/** TASK 3, 1-4 **/

function findDates(text){
  /** 
  * Регулярний вираз для знаходження дат у форматі рррр/мм/дд
  * \b — означає межу слова, щоб точно виявляти формат дат.
  * (\d{4}) — захоплює рік з 4 цифр.
  * \/ — шукає символ /.
  * (\d{1,2}) — захоплює місяць і день у форматі з 1 або 2 цифр.
  * g — прапорець глобального пошуку для знаходження всіх дат у тексті.
  */

  let reg = /\b(\d{4})\-(\d{1,2})\-(\d{1,2})\b/g;
  let result = text.match(reg) 

  RESULTBLOCK.innerHTML = result.join(', ');
}

function toCamelCase(text){

  /** 
   * Метод .replace() у JavaScript дозволяє замінювати знайдені підрядки у рядку.
   * У нашому випадку, ми хочемо знайти всі підкреслення _, які передують буквам. Ось як ми це робимо:
   * ([a-z]) — шукає літеру від a до z, яка йде відразу після підкреслення.
   * Дужки () навколо [a-z] створюють так звану групу захоплення, завдяки якій ми можемо працювати безпосередньо з цією літерою.
   * 
   * Для кожного знайденого збігу, функція повертає letter.toUpperCase():
   * _a перетворюється на A
   */
  let result = text.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());

  RESULTBLOCK.innerHTML = result;
}

function toSnakeCase(text){
  let result = text.replace(/([A-Z])/g, (match, letter) => `_${letter.toLowerCase()}`);

  RESULTBLOCK.innerHTML = result;
}

function findHexColor(text){
  /**
   * # — шукає символ решітки, який є початком коду кольору.
   * ([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}) — група, яка шукає кольори у форматі з трьох або шести символів:
   * [A-Fa-f0-9]{3} — дозволяє три символи у шестигранному форматі (наприклад, #FFF).
   * [A-Fa-f0-9]{6} — дозволяє шість символів (наприклад, #1A2B3C).
   * \b — забезпечує, що код кольору закінчується або на межі слова, або пробілом, щоб уникнути часткових збігів.
   */
  let hexColorPattern = /#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})\b/g;
  let matches = text.match(hexColorPattern);
  let result = matches ? matches : null;

  RESULTBLOCK.innerHTML = result.join(', ');
}