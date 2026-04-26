document.addEventListener("DOMContentLoaded", function(){
    const main = document.getElementById("tasks");
    const searchInput = document.querySelector(".search-input");
    const selectFilter = document.getElementById("select");
    const newTaskBtn = document.querySelector(".new-task");
    const modalOverlay = document.getElementById("modalOverlay");
    const modalInput = document.getElementById("modalInput");
    const btnCancel = document.getElementById("btnCancel");
    const btnApply = document.getElementById("btnApply");
    const undoContainer = document.getElementById("undoContainer");
    const undoButton = document.getElementById("undoButton");
    const countdownNumber = document.getElementById("countdownNumber");
    const circleProgress = document.getElementById("circleProgress");

    let tasks = [
        {id: 1, text: "Read recommended book", isDone: false},
        {id: 2, text: "Vacation planning", isDone: false},
        {id: 3, text: "Cook dinner", isDone: false},
        {id: 4, text: "Sign up for training", isDone: false},
    ];

    let nextId = 5;
    let deletedTask = null;
    let undoTimer = null;
    let countdownInterval = null;
    let currentSearch = "";
    let currentFilter = "all";
    let editingTaskId = null;
    let originalText = "";

    function getFilteredTasks() {
        return tasks.filter(task => {
            const matchesSearch = task.text.toLowerCase().includes(currentSearch.toLowerCase());
            let matchesFilter = true;
            if (currentFilter === "complete") {
                matchesFilter = task.isDone;
            } else if (currentFilter === "incomplete") {
                matchesFilter = !task.isDone;
            }
            return matchesSearch && matchesFilter;
        });
    }

    function renderTasks() {
        const filteredTasks = getFilteredTasks();
        
        if (filteredTasks.length === 0) {
            main.innerHTML = '<div class="empty-state"><img src="img/empty.png" alt=""><span>No tasks found</span></div>';
            return;
        }

        main.innerHTML = filteredTasks.map((task) => {
            const isEditing = editingTaskId === task.id;
            const completedClass = task.isDone ? "task-completed" : "";
            
            return `
            <div class="task ${completedClass}" data-task-id="${task.id}">
                <div class="checkbox-text">
                    <input type="checkbox" ${task.isDone ? "checked" : ""} data-action="toggle">
                    ${isEditing 
                        ? `<input type="text" class="task-text-editable" value="${task.text}" data-action="edit-input">`
                        : `<span data-action="toggle-text">${task.text}</span>`
                    }
                </div>
                <div class="task-controls">
                    <div class="main-controls ${isEditing ? "hidden" : ""}"> 
                        <svg class="svg-icon edit-btn" width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" data-action="edit">
                            <path d="M7.17272 3.49106L0.5 10.1637V13.5H3.83636L10.5091 6.82736M7.17272 3.49106L9.5654 1.09837L9.5669 1.09695C9.8962 0.767585 10.0612 0.602613 10.2514 0.540824C10.4189 0.486392 10.5993 0.486392 10.7669 0.540824C10.9569 0.602571 11.1217 0.767352 11.4506 1.09625L12.9018 2.54738C13.2321 2.87769 13.3973 3.04292 13.4592 3.23337C13.5136 3.40088 13.5136 3.58133 13.4592 3.74885C13.3974 3.93916 13.2324 4.10414 12.9025 4.43398L12.9018 4.43468L10.5091 6.82736M7.17272 3.49106L10.5091 6.82736" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <svg class="svg-icon-red delete-btn" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" data-action="delete">
                            <path d="M3.87414 7.61505C3.80712 6.74386 4.49595 6 5.36971 6H12.63C13.5039 6 14.1927 6.74385 14.1257 7.61505L13.6064 14.365C13.5463 15.1465 12.8946 15.75 12.1108 15.75H5.88894C5.10514 15.75 4.45348 15.1465 4.39336 14.365L3.87414 7.61505Z" />
                            <path d="M14.625 3.75H3.375"  stroke-linecap="round"/>
                            <path d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z" />
                            <path d="M10.5 9V12.75"  stroke-linecap="round"/>
                            <path d="M7.5 9V12.75"  stroke-linecap="round"/>
                        </svg>
                    </div>
                    <div class="secondary-controls ${isEditing ? "" : "hidden"}">
                        <img src="img/ok.svg" alt="" srcset="" width="18" draggable="false" data-action="save" style="cursor: pointer;">
                        <img src="img/cross.png" alt="" srcset="" width="15" draggable="false" data-action="cancel" style="cursor: pointer;">
                    </div>
                </div>
            </div>
            `;
        }).join("");
    }

    function openModal() {
        modalOverlay.classList.remove("hidden");
        modalInput.value = "";
        modalInput.focus();
    }

    function closeModal() {
        modalOverlay.classList.add("hidden");
        modalInput.value = "";
    }

    function addNewTask() {
        const text = modalInput.value.trim();
        if (text) {
            tasks.push({
                id: nextId++,
                text: text,
                isDone: false
            });
            renderTasks();
            closeModal();
        }
    }

    function showUndo(task) {
        deletedTask = task;
        undoContainer.classList.remove("hidden");
        
        let timeLeft = 5;
        countdownNumber.textContent = timeLeft;
        circleProgress.style.strokeDashoffset = 0;
        
        const totalTime = 5000;
        const intervalTime = 50;
        const steps = totalTime / intervalTime;
        let currentStep = 0;
        
        if (undoTimer) clearTimeout(undoTimer);
        if (countdownInterval) clearInterval(countdownInterval);
        
        countdownInterval = setInterval(() => {
            currentStep++;
            const progress = (currentStep / steps) * 100;
            circleProgress.style.strokeDashoffset = progress;
            
            if (currentStep % (1000 / intervalTime) === 0) {
                timeLeft--;
                countdownNumber.textContent = timeLeft;
            }
            
            if (currentStep >= steps) {
                clearInterval(countdownInterval);
            }
        }, intervalTime);
        
        undoTimer = setTimeout(() => {
            hideUndo();
        }, totalTime);
    }

    function hideUndo() {
        undoContainer.classList.add("hidden");
        deletedTask = null;
        if (undoTimer) clearTimeout(undoTimer);
        if (countdownInterval) clearInterval(countdownInterval);
    }

    function restoreTask() {
        if (deletedTask) {
            tasks.push(deletedTask);
            renderTasks();
            hideUndo();
        }
    }

    newTaskBtn.addEventListener("click", openModal);
    btnCancel.addEventListener("click", closeModal);
    btnApply.addEventListener("click", addNewTask);
    
    modalInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") addNewTask();
    });

    undoButton.addEventListener("click", restoreTask);

    searchInput.addEventListener("input", (e) => {
        currentSearch = e.target.value;
        renderTasks();
    });

    selectFilter.addEventListener("change", (e) => {
        currentFilter = e.target.value;
        renderTasks();
    });

    main.addEventListener("click", function(event) {
        const taskElement = event.target.closest(".task");
        if (!taskElement) return;
        
        const taskId = Number(taskElement.dataset.taskId);
        const action = event.target.dataset.action;
        
        if (action === "toggle" || action === "toggle-text") {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.isDone = !task.isDone;
                renderTasks();
            }
        }
        
        if (action === "delete") {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                deletedTask = {...task};
                tasks = tasks.filter(t => t.id !== taskId);
                renderTasks();
                showUndo(deletedTask);
            }
        }
        
        if (action === "edit") {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                editingTaskId = taskId;
                originalText = task.text;
                renderTasks();
                setTimeout(() => {
                    const input = document.querySelector(`[data-task-id="${taskId}"] .task-text-editable`);
                    if (input) {
                        input.focus();
                        input.select();
                    }
                }, 0);
            }
        }
        
        if (action === "save") {
            const input = document.querySelector(`[data-task-id="${taskId}"] .task-text-editable`);
            if (input) {
                const newText = input.value.trim();
                if (newText) {
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                        task.text = newText;
                    }
                }
            }
            editingTaskId = null;
            originalText = "";
            renderTasks();
        }
        
        if (action === "cancel") {
            editingTaskId = null;
            originalText = "";
            renderTasks();
        }
    });

    main.addEventListener("keypress", function(event) {
        if (event.target.dataset.action === "edit-input" && event.key === "Enter") {
            const taskElement = event.target.closest(".task");
            if (taskElement) {
                const taskId = Number(taskElement.dataset.taskId);
                const newText = event.target.value.trim();
                if (newText) {
                    const task = tasks.find(t => t.id === taskId);
                    if (task) {
                        task.text = newText;
                    }
                }
                editingTaskId = null;
                originalText = "";
                renderTasks();
            }
        }
    });

    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    renderTasks();
});
