// script.js

document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTask');
  const taskList = document.getElementById('taskList');
  const filters = document.querySelectorAll('.filter');
  const themeToggle = document.getElementById('themeToggle');

  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';

  const saveTasks = () => localStorage.setItem('tasks', JSON.stringify(tasks));

  const renderTasks = () => {
    taskList.innerHTML = '';
    const filteredTasks = tasks
      .filter(task => {
        return (
          currentFilter === 'all' ||
          (currentFilter === 'completed' && task.completed) ||
          (currentFilter === 'pending' && !task.completed)
        );
      })
      .sort((a, b) => a.text.localeCompare(b.text));

    filteredTasks.forEach(({ id, text, completed }) => {
      const li = document.createElement('li');
      li.className = 'task-item';

      const span = document.createElement('span');
      span.className = `task-text ${completed ? 'task-completed' : ''}`;
      span.textContent = text;

      const actions = document.createElement('div');
      actions.className = 'actions';

      const checkBtn = document.createElement('i');
      checkBtn.className = 'fas fa-check';
      checkBtn.title = 'Mark as completed';
      checkBtn.addEventListener('click', () => toggleComplete(id));

      const editBtn = document.createElement('i');
      editBtn.className = 'fas fa-edit';
      editBtn.title = 'Edit task';
      editBtn.addEventListener('click', () => editTask(id));

      const deleteBtn = document.createElement('i');
      deleteBtn.className = 'fas fa-trash';
      deleteBtn.title = 'Delete task';
      deleteBtn.addEventListener('click', () => deleteTask(id));

      actions.append(checkBtn, editBtn, deleteBtn);
      li.append(span, actions);
      taskList.appendChild(li);
    });
  };

  const addTask = () => {
    const text = taskInput.value.trim();
    if (!text) {
      alert('Task cannot be empty.');
      return;
    }
    tasks.push({ id: Date.now(), text, completed: false });
    taskInput.value = '';
    saveTasks();
    renderTasks();
  };

  const toggleComplete = id => {
    tasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
  };

  const editTask = id => {
    const task = tasks.find(t => t.id === id);
    const newText = prompt('Edit your task:', task.text);
    if (newText && newText.trim()) {
      task.text = newText.trim();
      saveTasks();
      renderTasks();
    }
  };

  const deleteTask = id => {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  };

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
  });

  addTaskBtn.addEventListener('click', addTask);
  taskInput.addEventListener('keypress', e => {
    if (e.key === 'Enter') addTask();
  });

  renderTasks();
});
