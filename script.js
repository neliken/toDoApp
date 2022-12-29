class HtmlUI {
    setAttribute(name, value) {
        document.body.setAttribute(name, value);
    }

    getAttribute(name) {
        return document.body.getAttribute(name);
    }
}

class LocalStorage {
    add(name, value) {
        localStorage.setItem(name, value);
    }

    get(name) {
        localStorage.getItem(name);
    }

    remove(name) {
        localStorage.removeItem(name);
    }

}

class Setting {
    constants = {
        DATA_THEME: 'data-theme',
        THEME: 'theme'
    }

    themeType = {
        LIGHT: "light",
        DARK: "dark"
    }

    constructor(htmlUI, localStorage) {
        this.htmlUI = htmlUI;
        this.localStorage = localStorage;
    }

    currentTheme() {
        return this.htmlUI.getAttribute(this.constants.DATA_THEME);
    }

    switchThemeColor() {
        const theme = this.currentTheme() === this.themeType.LIGHT
            ? this.themeType.DARK
            : this.themeType.LIGHT;

        this.htmlUI.setAttribute(this.constants.DATA_THEME, theme);
        this.localStorage.add(this.constants.THEME, theme);
    }
}

const htmlUi = new HtmlUI();
const lt = new LocalStorage();

const setting = new Setting(htmlUi, lt);

const switchThemeBtn = document.getElementById("switch-mode");

switchThemeBtn.addEventListener('click', () => setting.switchThemeColor());

class Todo {
    constructor() {
        this.todoList = new Set();
    }

    addTodo(todo) {
        this.todoList.add(todo);
    }

    removeTodo(todo) {
        this.todoList.delete(todo);
    }
}

const todo = new Todo();

class TodoItem {
    constructor(name, isCompleted) {
        // this.id = id;
        this.name = name;
        this.isCompleted = isCompleted;
    }
}

const todoItem = new TodoItem();

class TodoUIController {
    constructor() {
        this.getElements();
    }

    getElementById(id) {
        return document.getElementById(id);
    }

    getElementsByClassName(className) {
        return document.getElementsByClassName(className);
    }

    getElements() {
        this.todos = this.getElementsByClassName("to-do-section");
        this.nrOfItems = this.getElementById('nr-of-items');
        this.categories = [...this.getElementById("categories-mobile").children, ...this.getElementById("categories-desktop").children];
    }

    completeHandler(e) {
        e.target.parentElement.classList.toggle("completed");
        this.toggleCompleted(e);
        this.checkNrOfItems(todo.todoList);
    }

    toggleCompleted(e) {
        todo.todoList.forEach(todoItem => {
            if(e.target.innerText === todoItem.name) {
                todoItem.isCompleted = !todoItem.isCompleted;
            }
        })
    }

    checkNrOfItems(todoList) {
        let count = 0;

        todoList.forEach(todo => {
            if(!todo.isCompleted) {
                count += 1;
            }
            this.nrOfItems.innerHTML = count.toString()
        })
    }

    addItem(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if(e.target.value) {
                let todoItem = new TodoItem(e.target.value, false);
                this.createItem(e.target.value, false);
                todo.addTodo(todoItem);

                e.target.value = "";
                this.checkNrOfItems(todo.todoList);
            }
        }
    }

    createElement(el) {
        return document.createElement(el);
    }

    createItem(name, completed) {
        let toDoListContainer = this.getElementById("to-do-list");

        let newDiv =  this.createElement("div");
        let newCheckBox = this.createElement("div");
        let newToDoText = this.createElement("div");
        let newDeleteIcon = this.createElement("span");

        newDiv.classList.add("to-do-section");
        if(completed) {
            newDiv.classList.add("completed");
        }

        newCheckBox.classList.add("checkbox");
        newToDoText.classList.add("todo");
        newDeleteIcon.classList.add("delete-icon");

        newToDoText.innerHTML = name;

        toDoListContainer.prepend(newDiv);
        newDiv.prepend(newCheckBox);
        newDiv.append(newToDoText);
        newToDoText.append(newDeleteIcon);
    }

    showAllItems(e) {
        this.checkStatus(e.target);

        Array.from(this.todos).forEach(todo => {
            todo.style.display = "flex";
        })
    }

    checkStatus(e) {
        this.categories.forEach(node => {
            if(node === e){
                node.style.color = "hsl(220, 98%, 61%)";
            } else {
                node.style.color = "";
            }
        })
    }

    showItems(e, condition) {
        this.checkStatus(e.target);
        Array.from(this.todos).forEach(todo => {
            if(todo.classList.contains("completed") === condition) {
                todo.style.display = "none";
            } else {
                todo.style.display = "flex";
            }
        })
    }

    deleteTodo (e){
        let currentTodo = e.target.parentNode.parentNode;
        let currentTodoText = e.target.parentNode.innerText;

        currentTodo.parentNode.removeChild(currentTodo);
        this.deleteItem(currentTodoText);
        todo.removeTodo(currentTodoText);
    }

    deleteItem(name) {
        todo.todoList.forEach( todoItem => {
            if(name === todoItem.name) {
                todo.removeTodo(todoItem);
            }
        })
        console.log(todo.todoList);
    }

    deleteCompletedItems() {
        Array.from(this.todos).forEach(todo => {
            if(todo.classList.contains("completed")) {
                todo.parentNode.removeChild(todo);
                let name = todo.children[1].innerText;
                this.deleteItem(name);
            }
        })
        this.checkNrOfItems(todo.todoList);
    }
}

const todoUIController = new TodoUIController();

const todos = todoUIController.getElementsByClassName("to-do-section");
const deleteIcons = todoUIController.getElementsByClassName("delete-icon");
const newItemInput = todoUIController.getElementById("input");
const showAllTriggers = todoUIController.getElementsByClassName("show-all-trigger");
const showActiveTriggers = todoUIController.getElementsByClassName("show-active-trigger");
const showCompletedTriggers = todoUIController.getElementsByClassName("show-completed-trigger");
const deleteAllTrigger = todoUIController.getElementById("delete-all-trigger");


setTimeout(() => {
    Array.from(todos).forEach( todo => {
        todo.addEventListener('click', (e) => todoUIController.completeHandler(e));
    })
}, 100);

setTimeout(() => {
    Array.from(deleteIcons).forEach( deleteIcon => {
        deleteIcon.addEventListener('click', (e) => todoUIController.deleteTodo(e));
    })
}, 100);


newItemInput.addEventListener('keypress', function (e) {
    todoUIController.addItem(e);
 });

Array.from(showAllTriggers).forEach(showAllTrigger => {
    showAllTrigger.addEventListener('click', (e) => todoUIController.showAllItems(e));
})

Array.from(showActiveTriggers).forEach(showActiveTrigger => {
    showActiveTrigger.addEventListener('click', (e) => todoUIController.showItems(e, true));
})

Array.from(showCompletedTriggers).forEach(showCompletedTrigger => {
    showCompletedTrigger.addEventListener('click', (e) => todoUIController.showItems(e, false));
})

deleteAllTrigger.addEventListener('click', () => todoUIController.deleteCompletedItems());

window.onbeforeunload = () => {
    let setTodos = Array.from(todo.todoList);
    let data = JSON.stringify(setTodos);

    fetch('http://localhost:3000/', {
        headers:{
            'Content-Type': 'application/json',
        },
        method: "POST",
        body: data,
        keepalive: true
    }).then(r => r.json());
}

window.addEventListener("load", async () => {
    let data = await fetch('http://localhost:3000/');
    let setTodos = JSON.parse(await data.json())

    todoUIController.checkNrOfItems(setTodos);

    Array.from(showAllTriggers).forEach( showAllTrigger => {
        showAllTrigger.style.color = "hsl(220, 98%, 61%)";
    })

    setTodos.forEach( todoItem => {
        todoUIController.createItem(todoItem.name, todoItem.isCompleted);
        todo.addTodo(todoItem);
    })
})