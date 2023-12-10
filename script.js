document.addEventListener("DOMContentLoaded", displayTasks);

function displayTasks() {
  const tasksContainer = document.getElementById("tasks-container");
  tasksContainer.innerHTML = "";

  const tasks = getTasks();

  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    taskDiv.innerHTML = `
      <span class="task">${task}</span>
      <button class="delete-btn" onclick="deleteTask('${task}')">Eliminar</button>
    `;

    tasksContainer.appendChild(taskDiv);
  });
}

function getTasks() {
  const tasksString = localStorage.getItem("tasks");
  return tasksString ? JSON.parse(tasksString) : [];
}

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const task = taskInput.value.trim();

  if (task !== "") {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    taskInput.value = "";
    displayTasks();
  }
}

function deleteTask(task) {
  const tasks = getTasks().filter(t => t !== task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
}

// Agrega un evento de escucha para la tecla "Enter"
document.getElementById("taskInput").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});
