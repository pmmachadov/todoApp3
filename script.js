// READ:

// Display tasks in the HTML container
function displayTasks() {
  const tasksContainer = document.getElementById("tasks-container");
  tasksContainer.innerHTML = ""; // Clear the container

  const tasks = getTasks(); // Get tasks stored locally

  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    taskDiv.innerHTML = `
      <span class="task">${task}</span>
      <button class="delete-btn" onclick="deleteTask('${task}')">Delete</button>
    `;

    tasksContainer.appendChild(taskDiv);
  });
}

function getTasks() {
  const tasksString = localStorage.getItem("tasks");  // READ: Get tasks stored locally
  return tasksString ? JSON.parse(tasksString) : []; // If tasksString is null, return an empty array. JSON.parse(tasksString) is used here to convert the string to an array because localStorage only stores strings.
}






// CREATE:

//Add a new task to local storage and update the display
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const task = taskInput.value.trim();

  if (task !== "") {
    // READ: Get tasks stored locally
    const tasks = getTasks();

    // CREATE: Add the new task to the array
    tasks.push(task);

    // CREATE: Store the updated array in localStorage
    localStorage.setItem("tasks", JSON.stringify(tasks));

    // Clear the input
    taskInput.value = "";

    // READ: Display the updated tasks
    displayTasks();
  }
}






// DELETE:

//Remove a task from local storage and update the display
function deleteTask(task) {
  // READ: Get tasks stored locally and filter out the task to delete
  const tasks = getTasks().filter(t => t !== task); // READ: Get tasks stored locally and filter out the task to be deleted (filter returns a new array)

  // DELETE: Store the updated array in localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // READ: Display the updated tasks
  displayTasks();
}






// Add an event listener for the "Enter" key to facilitate task creation
document.getElementById("taskInput").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});
