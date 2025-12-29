// Elemen DOM
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const filterBtns = document.querySelectorAll('.filter-btn');
const currentDateEl = document.getElementById('current-date');
const progressPercent = document.getElementById('progress-percent');
const progressFill = document.getElementById('progress-fill');

// Data tugas (array objek: {id, text, completed})
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Tampilkan tanggal hari ini
const today = new Date();
currentDateEl.textContent = today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

// Fungsi render tugas
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    let filteredTasks = tasks;
    
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <span class="task-text" data-id="${task.id}">${task.text}</span>
            <button class="edit-btn" data-id="${task.id}">Edit</button>
            <button class="delete-btn" data-id="${task.id}">Hapus</button>
        `;
        taskList.appendChild(li);
    });
    
    updateProgress();
}

// Update progress harian
function updateProgress() {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    progressPercent.textContent = `${percent}%`;
    progressFill.style.width = `${percent}%`;
}

// Simpan ke LocalStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Tambah tugas
addBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
        const newTask = {
            id: Date.now(),
            text,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
});

// Event listener untuk list tugas (checkbox, edit, delete)
taskList.addEventListener('click', (e) => {
    const id = parseInt(e.target.dataset.id);
    if (e.target.classList.contains('checkbox')) {
        // Toggle completed
        const task = tasks.find(t => t.id === id);
        task.completed = e.target.checked;
        saveTasks();
        renderTasks();
    } else if (e.target.classList.contains('edit-btn')) {
        // Edit tugas
        const task = tasks.find(t => t.id === id);
        const newText = prompt('Edit tugas:', task.text);
        if (newText !== null && newText.trim()) {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    } else if (e.target.classList.contains('delete-btn')) {
        // Hapus tugas
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
});

// Filter tugas
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderTasks(btn.dataset.filter);
    });
});

// Render awal
renderTasks();