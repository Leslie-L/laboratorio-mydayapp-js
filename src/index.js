import "./css/base.css";

import hat from "hat";

let TODO;

TODO = localStorage.getItem("mydayapp-js");
if (TODO) {
  TODO = JSON.parse(TODO);
} else {
  TODO = [];
}

const main = document.querySelector(".main");
const ulTodo = document.querySelector(".todo-list");
const footer = document.querySelector(".footer");
const input = document.querySelector(".new-todo");
const todoCount = document.querySelector(".todo-count");
const btnClearTodo = document.querySelector(".clear-completed");

window.addEventListener('DOMContentLoaded',drawTodo,false);
window.addEventListener('hashchange',drawTodo,false);

window.addEventListener("load", function () {
  input.autofocus = true;
});
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addNewTodo();
    input.value = "";
  }
});
btnClearTodo.addEventListener("click", clearCompleted);
function findIndexTODO(id) {
  return TODO.findIndex((item) => {
    return item.id == id;
  });
}

function addNewTodo() {
  let newTodo = input.value;
  newTodo = newTodo.trim();
  if (newTodo.length > 0) {
    const newId = hat();
    TODO.push({
      id: newId,
      title: newTodo,
      completed: false,
    });
    localStorage.setItem('mydayapp-js',JSON.stringify(TODO));
  }
  controlCantidadTodos();
  drawTodo();
}
function drawTodo() {
  let TODOAnalisis;
  if (location.hash.startsWith("#/pending")) {
    console.log("pending");
    TODOAnalisis = TODO.filter((item) => {
      return item.completed === false;
    });
  } else if (location.hash.startsWith("#/completed")) {
    console.log("completed");
    TODOAnalisis = TODO.filter((item) => {
      return item.completed === true;
    });
  } else if (
    location.hash.startsWith("#/all") ||
    location.hash.startsWith("#/")
  ) {
    console.log("all");
    TODOAnalisis = TODO;
  } else {
    TODOAnalisis = TODO;
  }

  ulTodo.innerHTML = "";
  TODOAnalisis.forEach((item) => {
    ulTodo.appendChild(createLi(item));
  });
  countTodos();
}
function countTodos() {
  const pending = TODO.filter((item) => {
    return item.completed === false;
  });
  console.log(pending);
  const numberPending = pending.length;
  const strong = document.createElement("strong");
  const palabra = numberPending == 1 ? "item" : "items";
  strong.innerHTML = numberPending + " " + palabra;
  todoCount.innerHTML = "";
  todoCount.appendChild(strong);
}
function clearCompleted() {
  TODO = TODO.filter((item) => {
    return item.completed === false;
  });
  localStorage.setItem("mydayapp-js", JSON.stringify(TODO));
  drawTodo();
}
function createLi(todo) {
  const li = document.createElement("li");
  if (todo.completed) li.classList.add("completed");
  const div = document.createElement("div");
  div.classList.add("view");
  const input = document.createElement("input");
  input.classList.add("toggle");
  input.setAttribute("type", "checkbox");
  input.addEventListener("change", () => {
    if (!input.checked) {
      todo.completed = false;
      li.classList.remove("completed");
      input.removeAttribute("checked", "checked");
    } else {
      todo.completed = true;
      li.classList.add("completed");
      input.setAttribute("checked", "checked");
    }
    localStorage.setItem("mydayapp-js", JSON.stringify(TODO));
    countTodos();
  });
  //input.checked = todo.checked;
  if (todo.completed) input.setAttribute("checked", "checked");
  const label = document.createElement("label");
  label.innerText = todo.title;

  const btn = document.createElement("button");
  btn.classList.add("destroy");
  btn.addEventListener("click", () => {
    const indexDeleted = findIndexTODO(todo.id);
    TODO.splice(indexDeleted, 1);
    localStorage.setItem("mydayapp-js", JSON.stringify(TODO));
    drawTodo();
    controlCantidadTodos();
  });
  div.appendChild(input);
  div.appendChild(label);
  div.appendChild(btn);
  const inputEdit = document.createElement("input");
  inputEdit.classList.add("edit");
  inputEdit.value = todo.title;
  label.addEventListener("dblclick", () => {
    li.classList.add("editing");
  });
  inputEdit.addEventListener("keydown", (e) => {
    console.log(e.key);
    if (e.key === "Enter") {
      let newTodo = inputEdit.value;
      newTodo = newTodo.trim();
      if (newTodo.length > 0) {
        todo.title = newTodo;
        todo.completed = false;
        label.innerText = newTodo;
        li.classList.remove("completed");
        input.checked = false;
        inputEdit.classList.add(".focus()");
        li.classList.remove("editing");
        localStorage.setItem("mydayapp-js", JSON.stringify(TODO));
      }
    } else if (e.key === "Escape") {
      li.classList.remove("editing");
    }
  });
  li.appendChild(div);
  li.appendChild(inputEdit);
  return li;
}

function controlCantidadTodos() {
  if (TODO.length === 0) {
    main.classList.add("hidden");
    footer.classList.add("hidden");
  } else {
    main.classList.remove("hidden");
    footer.classList.remove("hidden");
  }
}
controlCantidadTodos();
drawTodo();
