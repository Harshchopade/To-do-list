document.addEventListener('DOMContentLoaded', () => {

    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // --- 1. Fetch and Display Tasks ---
    async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();

    // Clear the list first
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const listItem = document.createElement('li');
        listItem.textContent = task.text;

        // Create the delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '❌';

        // Add an event listener to the button
        deleteBtn.addEventListener('click', async () => {
            await fetch(`/api/tasks/${task._id}`, {
                method: 'DELETE',
            });
            // After deleting, refresh the list from the server
            fetchTasks();
        });

        listItem.appendChild(deleteBtn);
        taskList.appendChild(listItem);
    });
}

    // --- 2. Add (POST) a New Task ---
    async function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText !== "") {
            // Send a POST request to our backend API
            await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: taskText }),
            });

            // Clear the input and refresh the list from the server
            taskInput.value = "";
            fetchTasks();
        }
    }

    // --- Event Listeners ---
    addTaskBtn.addEventListener('click', addTask);
    
    // Initial fetch of tasks when the page loads
    fetchTasks();
});