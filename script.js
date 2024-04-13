document.addEventListener("DOMContentLoaded", function() {
    const scheduleInput = document.getElementById('time-input');
    const eventInput = document.getElementById('event-input');
    const addEventBtn = document.getElementById('add-event-btn');
    const eventsList = document.getElementById('events');
    
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasksList = document.getElementById('tasks');
    
    // Modified task count elements
    const taskCount = document.getElementById('task-count');
    const totalTasksSpan = document.getElementById('total-tasks');
    const completedTasksSpan = document.getElementById('completed-tasks');
    const pendingTasksSpan = document.getElementById('pending-tasks');
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    // Load tasks from localStorage
    const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    savedTasks.forEach(task => {
        createTaskElement(task);
        totalTasks++;
        if (task.done) {
            completedTasks++;
        }
    });
    
    // Load events from localStorage
    const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
    savedEvents.forEach(event => {
        createEventElement(event);
    });
    
    updateTaskCount(); // Оновлення після завантаження сторінки
    
    // Add event listener for adding events
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
    
    // Add event listener for adding tasks
    addTaskBtn.addEventListener('click', function() {
        const taskName = taskInput.value;
        const priority = prioritySelect.value;
        
        if (taskName) {
            const newTask = { name: taskName, priority: priority, done: false };
            createTaskElement(newTask);
            saveTasksToLocalStorage();
            taskInput.value = '';
            totalTasks++;
            updateTaskCount(); // Оновлення після додавання завдання
        }
    });
    
    // Function to create new event element
    function createEventElement(event) {
        const li = document.createElement('li');
        li.textContent = `${event.time} - ${event.event}`;
        
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            li.remove();
            saveEventsToLocalStorage();
        });
        
        li.appendChild(deleteButton);
        eventsList.appendChild(li);
    }
    
    // Function to create new task element
    function createTaskElement(task) {
        const li = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        const span = document.createElement('span');
        span.textContent = task.name;
        span.style.color = task.priority === 'high' ? 'red' : (task.priority === 'medium' ? 'orange' : 'blue');
        if (task.done) {
            span.classList.add('done');
            completedTasks++;
        }
        li.appendChild(checkbox);
        li.appendChild(span);
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '&times;';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function() {
            li.remove();
            totalTasks--;
            if (task.done) {
                completedTasks--;
            }
            updateTaskCount(); // Оновлення після видалення завдання
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
            updateTaskCount(); // Оновлення після зміни стану завдання
            saveTasksToLocalStorage();
        });
        tasksList.appendChild(li);
    }
    
    // Function to update task count
    function updateTaskCount() {
        taskCount.textContent = `Total Tasks: ${totalTasks}, Completed Tasks: ${completedTasks}, Pending Tasks: ${totalTasks - completedTasks}`;
        totalTasksSpan.textContent = totalTasks;
        completedTasksSpan.textContent = completedTasks;
        pendingTasksSpan.textContent = totalTasks - completedTasks;
        localStorage.setItem('totalTasks', totalTasks);
        localStorage.setItem('completedTasks', completedTasks);
    }
    
    // Function to save events to localStorage
    function saveEventsToLocalStorage() {
        const events = Array.from(eventsList.children).map(li => {
            const [time, event] = li.textContent.split(' - ');
            return { time, event };
        });
        localStorage.setItem('events', JSON.stringify(events));
    }
    
    // Function to save tasks to localStorage
    function saveTasksToLocalStorage() {
        const tasks = Array.from(tasksList.children).map(li => {
            const name = li.querySelector('span').textContent;
            const priority = li.querySelector('span').style.color === 'red' ? 'high' : (li.querySelector('span').style.color === 'orange' ? 'medium' : 'low');
            const done = li.querySelector('input').checked;
            return { name, priority, done };
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
});
