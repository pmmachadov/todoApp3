// READ:

// Display tasks in the HTML container
function displayTasks() {
  const tasksContainer = document.getElementById("tasks-container");
  tasksContainer.innerHTML = ""; // Clear the container

  const tasks = getTasks(); // Get tasks stored locally

  tasks.forEach(task => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-container");

    // Add a checkbox to mark tasks as complete
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed || false; // I || false here to prevent the checkbox from being checked if task.completed is null
    checkbox.addEventListener("change", () => toggleTaskComplete(task.id));

    taskDiv.appendChild(checkbox);

    // Add a span for the task text with a line-through style if completed
    const taskText = document.createElement("span");
    taskText.classList.add("task");
    taskText.style.textDecoration = task.completed ? "line-through" : "none";
    taskText.style.opacity = task.completed ? "0.5" : "1";
    taskText.textContent = task.task;

    taskDiv.appendChild(taskText);

    // Add buttons for delete and edit
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-btn");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(task.id));

    const editButton = document.createElement("button");
    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => updateTask(task.id));

    taskDiv.appendChild(deleteButton);
    taskDiv.appendChild(editButton);

    tasksContainer.appendChild(taskDiv);
  });
}

// Toggle task completion status
function toggleTaskComplete(taskId) {
  const tasks = getTasks().map(task => {
    if (task.id === taskId) {
      task.completed = !task.completed;
    }
    return task;
  });

  localStorage.setItem("tasks", JSON.stringify(tasks));
  displayTasks();
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

    const taskId = new Date().toISOString(); // Generate a unique ID for the task by converting the current date to a string
    const newTask = {
      id: taskId,
      task: task
    }; // Create a new task object to store text and ID

    // CREATE: Add the new task to the array
    tasks.push(newTask);
    console.log(tasks);

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
function deleteTask(taskId) {
  // READ: Get tasks stored locally and filter out the task to delete
  const tasks = getTasks().filter(t => t.id !== taskId); // READ: Get tasks stored locally and filter out the task to be deleted (filter returns a new array)

  // DELETE: Store the updated array in localStorage
  localStorage.setItem("tasks", JSON.stringify(tasks));

  // READ: Display the updated tasks
  displayTasks();
  console.log(tasks);
}




// UPDATE:

function updateTask(taskId) {

  // Update tasks and save to local storage
  const tasks = getTasks(); // READ: Get tasks stored locally
  const task = tasks.find(t => t.id === taskId);
  const taskInput = document.getElementById("taskInput");
  taskInput.value = task.task;
  deleteTask(taskId);
}






// Add an event listener for the "Enter" key to facilitate task creation
document.getElementById("taskInput").addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});
