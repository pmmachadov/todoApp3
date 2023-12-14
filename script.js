document.addEventListener("DOMContentLoaded", () => {

  // Display tasks on page load
  displayTasks();

  function displayTasks() {
    const tasksContainer = document.getElementById("tasks-container");
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const tasks = getTasks(); // Get tasks stored locally

    // Clear the container
    tasksContainer.innerHTML = "";

    // Separate tasks into completed and incomplete
    const completedTasks = tasks.filter(task => task.completed);
    const incompleteTasks = tasks.filter(task => !task.completed);

    // Display incomplete tasks that match the search input
    incompleteTasks.forEach(task => {
      // Added check for search input matching
      if (task.task.toLowerCase().includes(searchInput)) {
        const taskElement = createTaskElement(task);
        tasksContainer.appendChild(taskElement);
      }
    });

    // Remove the completed tasks container and recreate it
    const completedTasksContainer = document.querySelector('.completed-tasks-container');
    if (completedTasksContainer) {
      completedTasksContainer.remove();
      getTasks();
    }

    if (completedTasks.length > 0) {
      const newCompletedTasksContainer = document.createElement('div');
      newCompletedTasksContainer.classList.add('completed-tasks-container');

      completedTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskElement.classList.add('completed');
        newCompletedTasksContainer.appendChild(taskElement);
      });

      tasksContainer.appendChild(newCompletedTasksContainer);
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

    const completedCheckbox = createCheckbox(task.completed);
    completedCheckbox.addEventListener('change', () => toggleTaskComplete(task.id, taskElement));
    taskElement.appendChild(completedCheckbox);

    const deleteButton = createButton('Eliminar', 'delete-btn', () => deleteTask(task.id));
    taskElement.appendChild(deleteButton);

    const editButton = createButton('Editar', 'edit-btn', () => editTask(task.id, taskTextElement));
    taskElement.appendChild(editButton);

    return taskElement;
  }

  function createCheckbox(checked) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    return checkbox;
  }

  function createButton(text, className, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener('click', onClick);
    return button;
  }

  function editTask(taskId, taskTextElement) {
    taskTextElement.contentEditable = true;
    taskTextElement.focus();

    taskTextElement.addEventListener('blur', () => {
      taskTextElement.contentEditable = false;
      editTaskText(taskId, taskTextElement);
    });
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

  function toggleTaskComplete(taskId, taskElement) {  // taskElement is the card element
    const tasks = getTasks().map(task => {  // Get tasks stored locally
      if (task.id === taskId) { // If the task id matches the id of the task that was clicked
        task.completed = !task.completed; // Toggle the completed property

      }
      return task;  // Return the task
    });

    localStorage.setItem("tasks", JSON.stringify(tasks)); // Store the updated tasks
    displayTasks(); // Display the updated tasks
    const completedTasksContainer = document.querySelector('.completed-tasks-container'); // Get the completed tasks container
    const taskIndex = tasks.findIndex(task => task.id === taskId);  // Get the index of the task that was clicked

    if (taskIndex !== -1) { // If the task was found
      if (tasks[taskIndex].completed) { // If the task is completed
        // Task is completed
        if (!taskElement.classList.contains('completed')) { // If the task element does not have the completed class
          taskElement.classList.add('completed'); // Add the completed class
          completedTasksContainer.appendChild(taskElement); // Append the task element to the completed tasks container
          if (completedTasksContainer.contains(taskElement)) {
            displayTasks();
            return;
          }
        }
      } else {
        // Task is incomplete
        taskElement.classList.remove('completed');  // Remove the completed class
      }
    }
  }


  function editTaskText(taskId, taskTextElement) {
    const editedTaskText = taskTextElement.textContent.trim();
    const tasks = getTasks().map(task => {
      if (task.id === taskId) {
        task.task = editedTaskText;
      }
      return task;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
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

  // Event listener for the "keyup" event on the search input
  document.getElementById("searchInput").addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      displayTasks();
    }
  });

});
