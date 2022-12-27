let storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
if (storedTheme) {
    document.documentElement.setAttribute('data-theme', storedTheme);
}
class SettingsMode {
    constructor() {
        this.iconTheme = document.getElementById("switchMode");
    }
    toggleMode() {
        let currentTheme = document.body.getAttribute("data-theme");
        let targetTheme = "light";

        if (currentTheme === "light") {
            targetTheme = "dark";
        }
        document.body.setAttribute('data-theme', targetTheme);
        localStorage.setItem('theme', targetTheme);
    }
 }

const settingsMode = new SettingsMode();

settingsMode.iconTheme.addEventListener('click', settingsMode.toggleMode);

class ToDoHandler {
    constructor() {
        this.todos = document.getElementsByClassName("toDoSection");
        this.spanNrOfItems = document.getElementById("nrOfItems");
        this.categories = document.getElementById("categories").children;
        this.newTodoInput = document.getElementById("input");
        this.objectsTodosArray = [];
        this.showAllTrigger = document.getElementById('showAllTrigger');
        this.showActiveTrigger = document.getElementById('showActiveTrigger');
        this.showCompletedTrigger = document.getElementById('showCompletedTrigger');
        this.deleteAllTrigger = document.getElementById('deleteAllTrigger');
    }
    completeHandler(e) {
        e.target.parentElement.classList.toggle("completed");
        this.changeIsCompleted(e);
        this.verifyItemsLeft(this.objectsTodosArray);
    }

    changeIsCompleted(e) {
        this.objectsTodosArray.forEach(todo => {
            if(e.target.innerText === todo.title){
                todo.isCompleted = !todo.isCompleted;
            }
        })
    }

    verifyItemsLeft(todoList) {
        let count = 0;

        todoList.forEach(todo => {
            if(!todo.isCompleted) {
                count += 1;
            }
            this.spanNrOfItems.innerHTML = count.toString()
        })
    }

    pushTodos(title, completed){
        this.objectsTodosArray.push({
            title: title,
            isCompleted: completed
        });
    }

    addNewToDo(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if(e.target.value) {
                this.createNewTodo(e.target.value, false);
                this.pushTodos(e.target.value, false);

                e.target.value = "";
                this.verifyItemsLeft(this.objectsTodosArray);
            }
        }
    }

    createNewTodo(title, completed) {
        let toDoListContainer = document.getElementById("toDoList");

        let newDiv = document.createElement("div");
        let newCheckBox = document.createElement("div");
        let newToDoText = document.createElement("div");
        let newDeleteIcon = document.createElement("span");

        newDiv.classList.add("toDoSection");
        if(completed) {
            newDiv.classList.add("completed");
        }

        newCheckBox.classList.add("checkbox");
        newToDoText.classList.add("todo");
        newDeleteIcon.classList.add("deleteIcon");

        newToDoText.innerHTML = title;

        toDoListContainer.prepend(newDiv);
        newDiv.prepend(newCheckBox);
        newDiv.append(newToDoText);
        newToDoText.append(newDeleteIcon);
    }

    showAll(e) {
        this.verifyActiveStatus(e.target);

        Array.from(this.todos).forEach(todo => {
            todo.style.display = "flex";
        })
    }

    verifyActiveStatus(e) {
        Array.from(this.categories).forEach( node => {
            if(node === e){
                node.style.color = "hsl(220, 98%, 61%)";
            } else {
                node.style.color = "";
            }
        })
    }

    showTodos(e, condition) {
        this.verifyActiveStatus(e.target);
        Array.from(this.todos).forEach(todo => {
            if(todo.classList.contains("completed") === condition) {
                todo.style.display = "none";
            } else {
                todo.style.display = "flex";
            }
        })
    }

    deleteOneTodo (e){
        let currentTodo = e.target.parentNode.parentNode;
        let currentTodoText = e.target.parentNode.innerText;

        currentTodo.parentNode.removeChild(currentTodo);
        this.deleteItem(currentTodoText);
    }
    deleteItem(title) {
        console.log(this.objectsTodosArray)
        this.objectsTodosArray.forEach((todo, index) => {
            if(title === todo.title){
                this.objectsTodosArray.splice(index, 1);
            }
        })
    }
    clearCompleted() {
        // console.log(Array.from(this.todos))
        Array.from(this.todos).forEach(todo => {
            console.log(todo)
            if(todo.classList.contains("completed")) {
                todo.parentNode.removeChild(todo);
                let title = todo.children[1].innerText;
                console.log(title)
                this.deleteItem(title);
            }
        })
    }
}

const toDoHandler = new ToDoHandler();

const todos = document.getElementsByClassName("toDoSection");
const deleteIcons = document.getElementsByClassName("deleteIcon");

setTimeout(() => {
    Array.from(todos).forEach( todo => {
        todo.addEventListener('click', (e) => toDoHandler.completeHandler(e));
    })
}, 100);

setTimeout(() => {
    Array.from(deleteIcons).forEach( deleteIcon => {
        deleteIcon.addEventListener('click', (e) => toDoHandler.deleteOneTodo(e));
    })
}, 100);


toDoHandler.newTodoInput.addEventListener('keypress', function (e) {
    toDoHandler.addNewToDo(e);
 });

toDoHandler.showAllTrigger.addEventListener('click', (e) => toDoHandler.showAll(e));
toDoHandler.showActiveTrigger.addEventListener('click', (e) => toDoHandler.showTodos(e, true));
toDoHandler.showCompletedTrigger.addEventListener('click', (e) => toDoHandler.showTodos(e, false));
toDoHandler.deleteAllTrigger.addEventListener('click', () => toDoHandler.clearCompleted());

window.onbeforeunload = () => {
    let data = JSON.stringify(toDoHandler.objectsTodosArray);
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
    let json = JSON.parse(await data.json())
    toDoHandler.verifyItemsLeft(json);

    json.forEach( todo => {
        toDoHandler.createNewTodo(todo.title, todo.isCompleted);
        toDoHandler.pushTodos(todo.title, todo.isCompleted);
    });
})



