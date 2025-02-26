document.addEventListener("DOMContentLoaded", function() {
    // --- Функционал бургер-меню ---
    const burgerMenu = document.getElementById("burgerMenu");
    const sidebar = document.getElementById("sidebarMenu");
    if (burgerMenu && sidebar) {
      burgerMenu.addEventListener("click", function() {
        sidebar.classList.toggle("active");
        burgerMenu.classList.toggle("active");
      });
    }
    
    // --- Функционал для задач (лаба 5) ---
    const openTaskModal = document.getElementById("openTaskModal");
    const taskModal = document.getElementById("taskModal");
    const closeTaskModal = document.getElementById("closeTaskModal");
    const addTaskForm = document.getElementById("addTaskForm");
    
    // Контейнеры для колонок
    const todoList = document.getElementById("todoList");
    const inProgressList = document.getElementById("inProgressList");
    const completedList = document.getElementById("completedList");
  
    // Массив для хранения задач
    let tasks = [];
  
    // Загрузка задач из localStorage при загрузке страницы
    loadTasks();
    renderTasks();
  
    // Открытие модального окна для добавления задачи
    if (openTaskModal && taskModal) {
      openTaskModal.addEventListener("click", function() {
        taskModal.showModal();
      });
    }
    
    // Закрытие модального окна
    if (closeTaskModal && taskModal) {
      closeTaskModal.addEventListener("click", function() {
        taskModal.close();
      });
    }
    
    // Закрытие модального окна при клике вне его содержимого
    if (taskModal) {
      taskModal.addEventListener("click", function(event) {
        const rect = taskModal.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        ) {
          taskModal.close();
        }
      });
    }
    
    // Обработка формы добавления задачи
    if (addTaskForm) {
      addTaskForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const taskText = addTaskForm.elements.taskText.value.trim();
        if (taskText !== "") {
          addTask(taskText);
          addTaskForm.reset();
          taskModal.close();
        }
      });
    }
    
    // Функция добавления новой задачи с начальными данными
    function addTask(text) {
      const task = {
        id: Date.now(),      // уникальный идентификатор
        text: text,
        status: "todo"       // возможные значения: "todo", "inProgress", "completed"
      };
      tasks.push(task);
      saveTasks();
      renderTasks();
    }
    
    // Функция сохранения задач в localStorage
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
    
    // Функция загрузки задач из localStorage
    function loadTasks() {
      const storedTasks = localStorage.getItem("tasks");
      if (storedTasks) {
        tasks = JSON.parse(storedTasks);
      }
    }
    
    // Функция обновления статуса задачи при нажатии на чекбокс
    function updateTaskStatus(taskId) {
      tasks = tasks.map(task => {
        if (task.id == taskId) {
          if (task.status === "todo") {
            task.status = "inProgress";
          } else if (task.status === "inProgress") {
            task.status = "completed";
          }
        }
        return task;
      });
      saveTasks();
      renderTasks();
    }
    
    // Функция удаления задачи
    function deleteTask(taskId) {
      tasks = tasks.filter(task => task.id != taskId);
      saveTasks();
      renderTasks();
    }
    
    // Функция рендера задач в соответствующие колонки
    function renderTasks() {
      // Очищаем все списки
      todoList.innerHTML = "";
      inProgressList.innerHTML = "";
      completedList.innerHTML = "";
      
      tasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.classList.add("task-item");
        taskItem.dataset.id = task.id;
        
        // Чекбокс для изменения статуса задачи
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.status === "completed";
        checkbox.addEventListener("click", function() {
          updateTaskStatus(task.id);
        });
        taskItem.appendChild(checkbox);
        
        // Текст задачи
        const span = document.createElement("span");
        span.classList.add("task-text");
        span.textContent = task.text;
        taskItem.appendChild(span);
        
        // Кнопка "Удалить"
        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete-task");
        deleteBtn.textContent = "Удалить";
        deleteBtn.addEventListener("click", function() {
          deleteTask(task.id);
        });
        taskItem.appendChild(deleteBtn);
        
        // Добавляем задачу в нужную колонку по статусу
        if (task.status === "todo") {
          todoList.appendChild(taskItem);
        } else if (task.status === "inProgress") {
          inProgressList.appendChild(taskItem);
        } else if (task.status === "completed") {
          completedList.appendChild(taskItem);
        }
      });
    }
  });
  