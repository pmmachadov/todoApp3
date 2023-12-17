document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector("#searchInput");
  const taskInput = document.querySelector("#taskInput");
  const addTaskButton = document.getElementById("addTaskButton");
  const showFavoriteCheckbox = document.getElementById("showFavoriteTasks");

  const CLASS_COMPLETED = "completed";
  const TASK_CONTAINER_CLASS = "card";
  const DELETE_BTN_CLASS = "delete-btn";
  const EDIT_BTN_CLASS = "edit-btn";

  showFavoriteCheckbox.addEventListener("change", toggleShowFavoriteTasks);

  function toggleShowFavoriteTasks() {
    const showFavorite = showFavoriteCheckbox.checked;
    if (showFavorite) {
      showFavoriteTasks();
    } else {
      displayTasks();
    }
  }

  function getTasks() {
    const tasksString = localStorage.getItem("tasks");
    return tasksString ? JSON.parse(tasksString) : [];
  }

  addTaskButton.addEventListener("click", addTask);

  taskInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  displayTasks();

  function displayTasks() {
    const searchInputValue = searchInput.value.toLowerCase();
    const tasks = getTasks();
    const completedTasksContainer = document.querySelector(".completed-tasks-container");
    const incompletedTasksContainer = document.querySelector(".incompleted-tasks-container");

    completedTasksContainer.innerHTML = "";
    incompletedTasksContainer.innerHTML = "";

    const completedTasks = tasks.filter((task) => task.completed);
    const incompleteTasks = tasks.filter((task) => !task.completed);

    incompleteTasks.forEach((task) => {
      if (task.task.toLowerCase().includes(searchInputValue)) {
        const taskElement = createTaskElement(task);
        incompletedTasksContainer.appendChild(taskElement);
      }
    });

    completedTasks.forEach((task) => {
      if (task.task.toLowerCase().includes(searchInputValue)) {
        const taskElement = createTaskElement(task);
        taskElement.classList.add("completed");
        completedTasksContainer.appendChild(taskElement);
      }
    });
  }

  function toggleFavorite(taskId, favoriteButton) {
    const tasks = getTasks().map((task) => {
      if (task.id === taskId) {
        task.favorite = !task.favorite;
      }
      return task;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();

    const taskElement = favoriteButton.closest(`.${TASK_CONTAINER_CLASS}`);
    taskElement.classList.toggle("favorite", tasks.find((task) => task.id === taskId).favorite);
  }

  function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add(TASK_CONTAINER_CLASS);
    taskElement.setAttribute("data-task-id", task.id);

    const taskTextElement = document.createElement("p");
    taskTextElement.textContent = task.task;
    taskTextElement.classList.add("task-text");
    taskElement.appendChild(taskTextElement);

    const completedCheckbox = createCheckbox(task.completed);
    completedCheckbox.addEventListener("change", function () {
      toggleTaskComplete(task.id, taskElement);
    });
    taskElement.appendChild(completedCheckbox);

    const favoriteButton = createButton("⭐", "favorite-btn", function (event) {
      toggleFavorite(task.id, event.target);
    });
    taskElement.appendChild(favoriteButton);

    const deleteButton = createButton("Eliminar", DELETE_BTN_CLASS, function () {
      deleteTask(task.id);
    });
    taskElement.appendChild(deleteButton);

    const editButton = createButton("Editar", EDIT_BTN_CLASS, function () {
      editTask(task.id, taskTextElement);
    });
    taskElement.appendChild(editButton);

    if (task.favorite) {
      taskElement.classList.add("favorite");
    }

    return taskElement;
  }

  function createCheckbox(checked) {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    return checkbox;
  }

  function createButton(text, className, onClick) {
    const button = document.createElement("button");
    button.textContent = text;
    button.classList.add(className);
    button.addEventListener("click", onClick);
    return button;
  }

  function editTask(taskId, taskTextElement) {
    taskTextElement.contentEditable = true;
    taskTextElement.focus();

    taskTextElement.addEventListener("blur", function () {
      taskTextElement.contentEditable = false;
      editTaskText(taskId, taskTextElement);
    });
  }

  function addTask() {
    const task = taskInput.value.trim();
    if (task !== "") {
      const tasks = getTasks();
      const taskId = crypto.randomUUID();
      const newTask = {
        id: taskId,
        task: task,
        completed: false,
      };

      tasks.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      taskInput.value = "";
      displayTasks();
    }
  }

  function toggleTaskComplete(taskId, taskElement) {
    const tasks = getTasks().map((task) => {
      if (task.id === taskId) {
        task.completed = !task.completed;
      }
      return task;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
    const completedTasksContainer = document.querySelector(`.${CLASS_COMPLETED}`);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      if (tasks[taskIndex].completed) {
        if (!taskElement.classList.contains(CLASS_COMPLETED)) {
          taskElement.classList.add(CLASS_COMPLETED);
          completedTasksContainer.appendChild(taskElement);
          if (completedTasksContainer.contains(taskElement)) {
            displayTasks();
            return;
          }
        }
      } else {
        taskElement.classList.remove(CLASS_COMPLETED);
      }
    }
  }

  function editTaskText(taskId, taskTextElement) {
    const editedTaskText = taskTextElement.textContent.trim();
    const tasks = getTasks().map((task) => {
      if (task.id === taskId) {
        task.task = editedTaskText;
      }
      return task;
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
  }

  function deleteTask(taskId) {
    const tasks = getTasks().filter((t) => t.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    displayTasks();
  }

  function updateTaskTextOnEnter(event, taskId, taskTextElement) {
    if (event.key === "Enter") {
      const newTaskText = event.target.textContent.trim();
      let tasks = getTasks().map((task) => {
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

  document.getElementById("tasks-container").addEventListener("keyup", function (event) {
    const taskId = event.target.closest(`.${TASK_CONTAINER_CLASS}`).getAttribute("data-task-id");
    const taskTextElement = event.target;
    updateTaskTextOnEnter(event, taskId, taskTextElement);
  });

  searchInput.addEventListener("input", displayTasks);

  searchInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      displayTasks();
    }
  });

  function showFavoriteTasks() {
    const tasks = getTasks();
    const favoriteTasks = tasks.filter((task) => task.favorite);

    const completedTasksContainer = document.querySelector(".completed-tasks-container");
    const incompletedTasksContainer = document.querySelector(".incompleted-tasks-container");

    completedTasksContainer.innerHTML = "";
    incompletedTasksContainer.innerHTML = "";

    favoriteTasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      if (task.completed) {
        taskElement.classList.add("completed");
        completedTasksContainer.appendChild(taskElement);
      } else {
        incompletedTasksContainer.appendChild(taskElement);
      }
    });
  }
});

const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');
const toggleButton = document.querySelector('#toggleSidebarButton');

toggleButton.addEventListener('click', toggleSidebar);
content.addEventListener('click', closeSidebarOutside);

function toggleSidebar() {
  sidebar.classList.toggle('open');
}

function closeSidebarOutside(event) {
  if (sidebar.classList.contains('open') && !event.target.closest('.sidebar')) {
    sidebar.classList.remove('open');
  }
}
