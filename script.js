document.addEventListener("DOMContentLoaded", function() {
    const scheduleInput = document.getElementById('time-input');
    const eventInput = document.getElementById('event-input');
    const addEventBtn = document.getElementById('add-event-btn');
    const eventsList = document.getElementById('events');
    
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksList = document.getElementById('tasks');
    
    const taskCount = document.getElementById('task-count');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');
    const pendingTasksSpan = document.getElementById('pending-tasks');
    
    let totalTasks = 0;
    let completedTasks = 0;

    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        createTaskElement(task);
        totalTasks++;
        if (task.done) {
            completedTasks++;
        }
    });
    
    const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
    savedEvents.forEach(event => {
        createEventElement(event);
    });
    
    updateTaskCount();
    
    addEventBtn.addEventListener('click', function() {
        const time = scheduleInput.value;
        const event = eventInput.value;
        
        if (time && event) {
            const newEvent = { time, event };
            createEventElement(newEvent);
            saveEventsToLocalStorage();
            scheduleInput.value = '';
            eventInput.value = '';
        }
    });
    
    addTaskBtn.addEventListener('click', function() {
        const taskName = taskInput.value;
        const priority = prioritySelect.value;
        
        if (taskName) {
            const newTask = { name: taskName, priority: priority, done: false };
            createTaskElement(newTask);
            saveTasksToLocalStorage();
            taskInput.value = '';
            totalTasks++;
            updateTaskCount();
        }
    });
    
    function createEventElement(event) {
        const li = document.createElement('li');

        const timeSpan = document.createElement('span');
        timeSpan.classList.add('time');
        timeSpan.textContent = event.time;

        const eventSpan = document.createElement('span');
        eventSpan.classList.add('event');
        eventSpan.textContent = event.event;

        const changeButton = document.createElement('button');
        changeButton.textContent = 'Change';
        changeButton.classList.add('change-button');
        changeButton.addEventListener('click', function() {
            const newTime = prompt("Enter new time:", event.time);
            const newEventName = prompt("Enter new event name:", event.event);
            if (newTime && newEventName) {
                event.time = newTime;
                event.event = newEventName;
                timeSpan.textContent = event.time;
                eventSpan.textContent = event.event;
                saveEventsToLocalStorage();
            }
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            li.remove();
            saveEventsToLocalStorage();
        });

        li.appendChild(timeSpan);
        li.appendChild(document.createTextNode(' - '));
        li.appendChild(eventSpan);
        li.appendChild(changeButton);
        li.appendChild(deleteButton);
        eventsList.appendChild(li);
    }
    
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.innerHTML = `<input type="checkbox"> <span>${task.name} (${task.priority})</span>`;
        const checkbox = li.querySelector('input');
        checkbox.checked = task.done;
        const span = li.querySelector('span');
        span.style.color = task.priority === 'high' ? 'red' : (task.priority === 'medium' ? 'blue' : 'green');
        if (task.done) {
            span.classList.add('done');
            completedTasks++;
        }
        tasksList.appendChild(li);
        
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            li.remove();
            totalTasks--;
            if (task.done) {
                completedTasks--;
            }
            updateTaskCount();
            saveTasksToLocalStorage();
        });
        li.appendChild(deleteButton);
        
        checkbox.addEventListener('change', function() {
            if (checkbox.checked) {
                span.classList.add('done');
                completedTasks++;
                task.done = true;
            } else {
                span.classList.remove('done');
                completedTasks--;
                task.done = false;
            }
            updateTaskCount();
            saveTasksToLocalStorage();
        });
    }
    
    function updateTaskCount() {
        completedTasks = Array.from(tasksList.children).filter(li => li.querySelector('input').checked).length;
        totalTasks = tasksList.children.length;
        const pendingTasks = totalTasks - completedTasks;
        taskCount.textContent = `Total Tasks: ${totalTasks}, Completed Tasks: ${completedTasks}, Pending Tasks: ${pendingTasks}`;
        totalTasksSpan.textContent = totalTasks;
        completedTasksSpan.textContent = completedTasks;
        pendingTasksSpan.textContent = pendingTasks;
        localStorage.setItem('totalTasks', totalTasks);
        localStorage.setItem('completedTasks', completedTasks);
    }
    
    function saveEventsToLocalStorage() {
        const events = Array.from(eventsList.children).map(li => {
            const time = li.querySelector('.time').textContent;
            const event = li.querySelector('.event').textContent;
            return { time, event };
        });
        localStorage.setItem('events', JSON.stringify(events));
    }
    
    function saveTasksToLocalStorage() {
        const tasks = Array.from(tasksList.children).map(li => {
            const name = li.querySelector('span').textContent.split(' (')[0];
            const priority = li.querySelector('span').textContent.split(' (')[1].slice(0, -1);
            const done = li.querySelector('input').checked;
            return { name, priority, done };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
