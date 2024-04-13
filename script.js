document.addEventListener("DOMContentLoaded", function() {
    const addEventBtn = document.getElementById("add-event-btn");
    const addTaskBtn = document.getElementById("add-task-btn");

    addEventBtn.addEventListener("click", addEvent);
    addTaskBtn.addEventListener("click", addTask);

    loadTasks();
    loadEvents();
});

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => addTaskToList(task.text, task.priority, task.done));
    updateTaskCount();
}

function loadEvents() {
    const events = JSON.parse(localStorage.getItem("events")) || [];
    events.forEach(event => addEventToList(event.time, event.text, event.done));
    updateTaskCount();
}

function addEventToList(time, text, done) {
    const eventsList = document.getElementById("events");

    const listItem = createListItem(time + " - " + text, done);
    listItem.querySelector("input[type='checkbox']").addEventListener("change", function() {
        if (this.checked) listItem.classList.add("done");
        else listItem.classList.remove("done");
        saveEvents();
        updateTaskCount();
    });

    const deleteButton = createDeleteButton(() => {
        listItem.remove();
        updateTaskCount();
    });

    listItem.appendChild(deleteButton);
    eventsList.appendChild(listItem);

    saveEvents();
}

function addTaskToList(text, priority, done) {
    const tasksList = document.getElementById("tasks");

    const listItem = createListItem(text + " - Priority: " + priority, done);
    listItem.querySelector("input[type='checkbox']").addEventListener("change", function() {
        if (this.checked) listItem.classList.add("done");
        else listItem.classList.remove("done");
        saveTasks();
        updateTaskCount();
    });

    const deleteButton = createDeleteButton(() => {
        listItem.remove();
        updateTaskCount();
    });

    listItem.appendChild(deleteButton);

    if (done) listItem.classList.add("done");
    else {
        if (priority === "low") listItem.style.color = "blue";
        else if (priority === "medium") listItem.style.color = "orange";
        else if (priority === "high") listItem.style.color = "red";
    }

    tasksList.appendChild(listItem);

    saveTasks();
}

function createListItem(text, done) {
    const listItem = document.createElement("li");
    listItem.innerText = text;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = done;
    listItem.prepend(checkbox);

    return listItem;
}

function createDeleteButton(onClick) {
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = onClick;
    return deleteButton;
}

function addEvent() {
    const timeInput = document.getElementById("time-input");
    const eventInput = document.getElementById("event-input");

    addEventToList(timeInput.value, eventInput.value, false);
    updateTaskCount();

    timeInput.value = "";
    eventInput.value = "";
}

function addTask() {
    const taskInput = document.getElementById("task-input");
    const prioritySelect = document.getElementById("priority-select");

    addTaskToList(taskInput.value, prioritySelect.value, false);
    updateTaskCount();

    taskInput.value = "";
}

function saveTasks() {
    const tasksListItems = Array.from(document.querySelectorAll("#tasks li"));
    const tasks = tasksListItems.map(item => ({
        text: item.innerText.split(" - Priority: ")[0],
        priority: item.innerText.split(" - Priority: ")[1],
        done: item.querySelector("input[type='checkbox']").checked
    }));

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveEvents() {
    const eventsListItems = Array.from(document.querySelectorAll("#events li"));
    const events = eventsListItems.map(item => ({
        time: item.innerText.split(" - ")[0],
        text: item.innerText.split(" - ")[1],
        done: item.querySelector("input[type='checkbox']").checked
    }));

    localStorage.setItem("events", JSON.stringify(events));
}

function updateTaskCount() {
    const totalTasks = document.querySelectorAll("#tasks li").length;
    const completedTasks = document.querySelectorAll("#tasks li.done").length;
    const pendingTasks = totalTasks - completedTasks;

    document.getElementById("total-tasks").innerText = totalTasks;
    document.getElementById("completed-tasks").innerText = completedTasks;
    document.getElementById("pending-tasks").innerText = pendingTasks;
}
