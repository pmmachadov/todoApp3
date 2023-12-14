document.addEventListener("DOMContentLoaded", () => {

  // Display tasks on page load
  displayTasks();

  function displayTasks() {
    const tasksContainer = document.getElementById("tasks-container");
    tasksContainer.innerHTML = ""; // Clear the container

    const tasks = getTasks(); // Get tasks stored locally

    // Separate tasks into completed and incomplete
    const completedTasks = tasks.filter(task => task.completed);
    const incompleteTasks = tasks.filter(task => !task.completed);

    // Display incomplete tasks that match the search input
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    incompleteTasks.forEach(task => {
      // Added check for search input matching
      if (task.task.toLowerCase().includes(searchInput)) {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
      }
    });

    // Display completed tasks below
    if (completedTasks.length > 0) {
      const completedTasksContainer = document.createElement('div');
      completedTasksContainer.classList.add('completed-tasks-container');

      completedTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskElement.classList.add('completed');
        completedTasksContainer.appendChild(taskElement);
      });

      tasksContainer.appendChild(completedTasksContainer);
    }
  }

  function createTaskElement(task) {
    const taskElement = document.createElement('div');
    taskElement.classList.add('card');
    taskElement.setAttribute('data-task-id', task.id);

    const taskTextElement = document.createElement('p');
    taskTextElement.textContent = task.task;
    taskTextElement.classList.add('task-text');
    taskElement.appendChild(taskTextElement);

    const completedCheckbox = document.createElement('input');
    completedCheckbox.type = 'checkbox';
    completedCheckbox.checked = task.completed;
    completedCheckbox.addEventListener('change', () => toggleTaskComplete(task.id, taskElement));
    taskElement.appendChild(completedCheckbox);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', () => deleteTask(task.id));
    taskElement.appendChild(deleteButton);

    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click', () => {
      taskTextElement.contentEditable = true;
    });
    taskElement.appendChild(editButton);

    return taskElement;
  }

  function addTask() {
    const taskInput = document.getElementById("taskInput");
    const task = taskInput.value.trim();

    if (task !== "") {
      const tasks = getTasks();

      let taskId = crypto.randomUUID();
      const newTask = {
        id: taskId,
        task: task,
        completed: false
      };

      tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      taskInput.value = "";
      displayTasks();
    }
  }

  function getTasks() {
    const tasksString = localStorage.getItem("tasks");
    return tasksString ? JSON.parse(tasksString) : [];
  }

  function toggleTaskComplete(taskId, taskElement) {
    const tasks = getTasks().map(task => {
      if (task.id === taskId) {
        task.completed = !task.completed;
      }
      return task;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();

    const completedTasksContainer = document.querySelector('.completed-tasks-container');
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1 && tasks[taskIndex].completed) {
      if (!taskElement.classList.contains('completed')) {
        taskElement.classList.add('completed');
        completedTasksContainer.appendChild(taskElement);
      }
    } else {
      taskElement.classList.remove('completed');
    }
  }

  function updateTask(taskId) {
    const originalTasks = getTasks();
    let tasks = originalTasks.slice();

    const task = tasks.find(task => task.id === taskId);

    if (task) {
      let taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
      taskElement.parentNode.removeChild(taskElement);

      tasks = tasks.filter(task => task.id !== taskId);

      taskElement = document.querySelector(`[data-task-id="${taskId}"] p`);
      if (!taskElement) {
        taskElement = createTaskElement(task);
        document.getElementById('tasks-container').appendChild(taskElement);
      } else {
        taskElement.textContent = task.task;
      }

      tasks.push({
        id: taskId,
        task: task.task,
        completed: task.completed
      });

      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }

  function deleteTask(taskId) {
    const tasks = getTasks().filter(t => t.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
  }

  function updateTaskTextOnEnter(event, taskId, taskTextElement) {
    if (event.key === "Enter") {
      const newTaskText = event.target.textContent.trim();
      let tasks = getTasks().map(task => {
        if (task.id === taskId) {
          task.task = newTaskText;
        }
        return task;
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks();
      taskTextElement.blur();
    }
  }

  // Event listener for the "Enter" key to facilitate task creation
  document.getElementById("taskInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  // Event listener for updating task text when the "Enter" key is pressed
  document.getElementById("tasks-container").addEventListener("keyup", function (event) {
    const taskId = event.target.closest('.card').getAttribute('data-task-id');
    const taskTextElement = event.target;
    updateTaskTextOnEnter(event, taskId, taskTextElement);
  });

  // Event listener for the "input" event on the search input
  document.getElementById("searchInput").addEventListener("input", function () {
    displayTasks();
  });

  // Event listener for the "click" event on the search button
  document.getElementById("searchButton").addEventListener("click", function () {
    displayTasks();
  });

  // Event listener for the "keyup" event on the search input
  document.getElementById("searchInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      displayTasks();
    }
  });

});
