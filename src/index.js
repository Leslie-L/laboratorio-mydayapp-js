import "./css/base.css";

import hat from "hat";

const TODO = [];

const main = document.querySelector(".main");
const ulTodo = document.querySelector(".todo-list");
const footer = document.querySelector(".footer");
const input = document.querySelector(".new-todo");

window.addEventListener("load", function () {
  input.autofocus = true;
});
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addNewTodo();
    input.value = "";
  }
});

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
  }
  controlCantidadTodos();
  drawTodo();
}
function drawTodo() {
  ulTodo.innerHTML = "";
  TODO.forEach((item) => {
    ulTodo.appendChild(createLi(item));
  });
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
      input.checked = false;
    } else {
      todo.completed = true;
      li.classList.add("completed");
      input.checked = true;
    }
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
