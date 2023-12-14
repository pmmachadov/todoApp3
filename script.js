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

    // Display incomplete tasks
    console.log("Incomplete Tasks:", incompleteTasks);
    incompleteTasks.forEach(task => {
      const taskElement = createTaskElement(task);
      tasksContainer.appendChild(taskElement);
    });

    function createTaskElement(task) {
      const taskElement = document.createElement('div');
      taskElement.classList.add('card');
      taskElement.setAttribute('data-task-id', task.id);

      // Task Text
      const taskTextElement = document.createElement('p');
      taskTextElement.textContent = task.task;
      taskTextElement.classList.add('task-text');
      taskElement.appendChild(taskTextElement);

      // Completion Checkbox
      const completedCheckbox = document.createElement('input');
      completedCheckbox.type = 'checkbox';
      completedCheckbox.checked = task.completed;
      completedCheckbox.addEventListener('change', () => toggleTaskComplete(task.id, taskElement));
      taskElement.appendChild(completedCheckbox);

      // Delete Button
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Eliminar';
      deleteButton.classList.add('delete-btn');
      deleteButton.addEventListener('click', () => deleteTask(task.id));
      taskElement.appendChild(deleteButton);

      // Edit Button
      const editButton = document.createElement('button');
      editButton.textContent = 'Editar';
      editButton.classList.add('edit-btn');
      // Update the task text on click
      editButton.addEventListener('click', () => {
        taskTextElement.contentEditable = true;
        taskTextElement.focus();
        updateTask(task.id); // Add this line to call updateTask
      });
      taskElement.appendChild(editButton);

      return taskElement;
    }

    // Display completed tasks below
    if (completedTasks.length > 0) {
      const completedTasksContainer = document.createElement('div');
      completedTasksContainer.classList.add('completed-tasks-container');

      console.log("Completed Tasks:", completedTasks);

      completedTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskElement.classList.add('completed'); // Add a class to identify completed tasks
        completedTasksContainer.appendChild(taskElement); // Append the task to the container
      });

      tasksContainer.appendChild(completedTasksContainer); // Append the container once, not for each task
    }
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

    // Check if the task is completed and not already in the completed container
    const completedTasksContainer = document.querySelector('.completed-tasks-container');
    const taskIndex = tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1 && tasks[taskIndex].completed) {
      if (!taskElement.classList.contains('completed')) {
        taskElement.classList.add('completed');
        completedTasksContainer.appendChild(taskElement);
      }
    } else {
      // If the task is not completed, make sure it doesn't have the completed class
      taskElement.classList.remove('completed');
    }
  }

  function updateTask(taskId) {
    const originalTasks = getTasks();
    let tasks = originalTasks.slice();

    const task = tasks.find(task => task.id === taskId);

    if (task) {
      // Remove the existing task element from the DOM
      const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
      taskElement.parentNode.removeChild(taskElement);

      // Remove the existing task from the tasks array
      tasks = tasks.filter(task => task.id !== taskId);

      // Create or update the task element
      taskElement = document.querySelector(`[data-task-id="${taskId}"] p`);
      if (!taskElement) {
        taskElement = createTaskElement(task);
        document.getElementById('tasks-container').appendChild(taskElement);
      } else {
        taskElement.textContent = task.task;
      }

      // Add the updated task to the array
      tasks.push({
        id: taskId,
        task: task.task,
        completed: task.completed
      });

      // Store the updated array in localStorage
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
      tasks = getTasks().map(task => {
        if (task.id === taskId) {
          task.task = newTaskText;
        }
        return task;
      });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      displayTasks();
      taskTextElement.blur(); // Remove focus from the task text element
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

});
