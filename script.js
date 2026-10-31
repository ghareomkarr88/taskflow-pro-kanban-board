// ==================== TASK CLASS ====================
class Task {
  constructor(data = {}) {
    this.id = data.id || this.generateId();
    this.title = data.title || '';
    this.description = data.description || '';
    this.priority = data.priority || 'medium';
    this.status = data.status || 'todo';
    this.dueDate = data.dueDate || '';
    this.subtasks = data.subtasks || [];
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = data.updatedAt || new Date().toISOString();
  }

  generateId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  isOverdue() {
    if (!this.dueDate || this.status === 'done') return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(this.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }

  getCompletedSubtasks() {
    return this.subtasks.filter(s => s.completed).length;
  }

  getSubtaskProgress() {
    if (this.subtasks.length === 0) return 0;
    return Math.round((this.getCompletedSubtasks() / this.subtasks.length) * 100);
  }

  formatDueDate() {
    if (!this.dueDate) return '';
    const date = new Date(this.dueDate);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  formatCreatedDate() {
    const date = new Date(this.createdAt);
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return date.toLocaleDateString('en-US', options);
  }
}

// ==================== STATE MANAGER ====================
class StateManager {
  constructor() {
    this.STORAGE_KEY = 'taskflow_pro_tasks';
    this.THEME_KEY = 'taskflow_pro_theme';
    this.tasks = [];
    this.deletedTasks = [];
    this.listeners = [];
  }

  load() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        const previousStarterTitles = new Set([
          'Design Landing Page Mockup',
          'Setup CI/CD Pipeline',
          'Write API Documentation',
          'Fix Navigation Bug',
          'User Authentication Module',
          'Database Schema Review',
          'Update Dependencies'
        ]);
        const hasPreviousStarterTasks = parsed.some(task => previousStarterTitles.has(task.title));

        if (hasPreviousStarterTasks) {
          const userTasks = parsed.filter(task => !previousStarterTitles.has(task.title));
          this.loadSampleTasks();
          this.tasks.push(...userTasks.map(task => new Task(task)));
          this.save();
        } else {
          this.tasks = parsed.map(t => new Task(t));
        }
      } else {
        this.loadSampleTasks();
      }
    } catch (e) {
      console.error('Error loading tasks:', e);
      this.tasks = [];
    }
  }

  save() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.tasks));
    } catch (e) {
      console.error('Error saving tasks:', e);
    }
  }

  loadSampleTasks() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const fmt = d => d.toISOString().split('T')[0];

    this.tasks = [
      new Task({
        title: 'Polish NexaShop product cards',
        description: 'Check image crops, price hierarchy, and stock labels on desktop and mobile.',
        priority: 'high',
        status: 'todo',
        dueDate: fmt(nextWeek),
        subtasks: [
          { id: 's1', text: 'Review image crops', completed: true },
          { id: 's2', text: 'Check sale and stock labels', completed: false },
          { id: 's3', text: 'Verify narrow-screen layout', completed: false }
        ]
      }),
      new Task({
        title: 'Test cart restore after reload',
        description: 'Confirm cart items and quantities persist when the product page is refreshed.',
        priority: 'high',
        status: 'in-progress',
        dueDate: fmt(tomorrow),
        subtasks: [
          { id: 's5', text: 'Test empty and populated cart', completed: true },
          { id: 's6', text: 'Check quantity updates', completed: true },
          { id: 's7', text: 'Verify checkout summary', completed: false }
        ]
      }),
      new Task({
        title: 'Improve weather search empty state',
        description: 'Make invalid city searches easier to recover from and keep the last result visible.',
        priority: 'medium',
        status: 'todo',
        dueDate: fmt(nextWeek),
        subtasks: [
          { id: 's8', text: 'Review API error responses', completed: false },
          { id: 's9', text: 'Add retry guidance', completed: false },
          { id: 's10', text: 'Check keyboard navigation', completed: false }
        ]
      }),
      new Task({
        title: 'Check chat message persistence',
        description: 'Verify new messages and delivery status survive a page refresh.',
        priority: 'high',
        status: 'in-progress',
        dueDate: fmt(tomorrow),
        subtasks: [
          { id: 's11', text: 'Send a message in an existing thread', completed: true },
          { id: 's12', text: 'Reload and confirm order', completed: false }
        ]
      }),
      new Task({
        title: 'Verify checkout summary on mobile',
        description: 'Check totals, shipping threshold, and discount copy at common phone widths.',
        priority: 'high',
        status: 'done',
        dueDate: fmt(yesterday),
        subtasks: [
          { id: 's13', text: 'Check 360px layout', completed: true },
          { id: 's14', text: 'Check 390px layout', completed: true },
          { id: 's15', text: 'Confirm totals remain visible', completed: true }
        ]
      }),
      new Task({
        title: 'Refresh store dashboard metrics',
        description: 'Align revenue, order, and customer charts with the current NexaShop demo dataset.',
        priority: 'low',
        status: 'done',
        dueDate: fmt(today),
        subtasks: [
          { id: 's16', text: 'Update KPI labels', completed: true },
          { id: 's17', text: 'Check monthly chart range', completed: true }
        ]
      }),
      new Task({
        title: 'Capture portfolio project screenshots',
        description: 'Prepare consistent desktop and mobile captures for the project gallery.',
        priority: 'low',
        status: 'todo',
        dueDate: fmt(nextWeek),
        subtasks: [
          { id: 's18', text: 'Capture dashboard and Kanban', completed: false },
          { id: 's19', text: 'Capture weather and chat', completed: false }
        ]
      })
    ];
    this.save();
  }

  addTask(taskData) {
    const task = new Task(taskData);
    this.tasks.push(task);
    this.save();
    this.notify();
    return task;
  }

  updateTask(id, updates) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      Object.assign(task, updates, { updatedAt: new Date().toISOString() });
      this.save();
      this.notify();
    }
    return task;
  }

  deleteTask(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      const deleted = this.tasks.splice(index, 1)[0];
      this.deletedTasks.push(deleted);
      this.save();
      this.notify();
      return deleted;
    }
    return null;
  }

  undoDelete() {
    if (this.deletedTasks.length === 0) return null;
    const task = this.deletedTasks.pop();
    this.tasks.push(task);
    this.save();
    this.notify();
    return task;
  }

  moveTask(id, newStatus) {
    return this.updateTask(id, { status: newStatus });
  }

  getTasksByStatus(status) {
    return this.tasks.filter(t => t.status === status);
  }

  getTaskById(id) {
    return this.tasks.find(t => t.id === id);
  }

  getFilteredTasks(search = '', priority = 'all') {
    let filtered = [...this.tasks];
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(s) ||
        t.description.toLowerCase().includes(s)
      );
    }
    if (priority !== 'all') {
      filtered = filtered.filter(t => t.priority === priority);
    }
    return filtered;
  }

  getStats() {
    const all = this.tasks;
    return {
      total: all.length,
      todo: all.filter(t => t.status === 'todo').length,
      inProgress: all.filter(t => t.status === 'in-progress').length,
      done: all.filter(t => t.status === 'done').length,
      overdue: all.filter(t => t.isOverdue()).length
    };
  }

  subscribe(fn) {
    this.listeners.push(fn);
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  getTheme() {
    return localStorage.getItem(this.THEME_KEY) || 'light';
  }

  setTheme(theme) {
    localStorage.setItem(this.THEME_KEY, theme);
  }
}

// ==================== APP CONTROLLER ====================
class KanbanApp {
  constructor() {
    this.state = new StateManager();
    this.editingTaskId = null;
    this.viewingTaskId = null;
    this.currentSearch = '';
    this.currentFilter = 'all';
    this.draggedCard = null;

    this.init();
  }

  init() {
    this.state.load();
    this.applyTheme(this.state.getTheme());
    this.bindEvents();
    this.state.subscribe(() => this.render());
    this.render();
    this.hidePreloader();
  }

  hidePreloader() {
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      const app = document.getElementById('appContainer');
      preloader.classList.add('hidden');
      app.classList.add('visible');
    }, 1800);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.state.setTheme(theme);
  }

  bindEvents() {
    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      this.applyTheme(current === 'light' ? 'dark' : 'light');
    });

    // Add Task Button
    document.getElementById('addTaskBtn').addEventListener('click', () => {
      this.openTaskModal();
    });

    // Column Add Buttons (Event Delegation)
    document.getElementById('kanbanBoard').addEventListener('click', (e) => {
      const addBtn = e.target.closest('.column-add-btn');
      if (addBtn) {
        const status = addBtn.dataset.addStatus;
        this.openTaskModal(null, status);
      }
    });

    // Modal Events
    document.getElementById('modalClose').addEventListener('click', () => this.closeTaskModal());
    document.getElementById('modalCancelBtn').addEventListener('click', () => this.closeTaskModal());
    document.getElementById('modalSaveBtn').addEventListener('click', () => this.saveTask());
    document.getElementById('taskModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeTaskModal();
    });

    // Detail Modal Events
    document.getElementById('detailModalClose').addEventListener('click', () => this.closeDetailModal());
    document.getElementById('detailModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeDetailModal();
    });
    document.getElementById('detailEditBtn').addEventListener('click', () => {
      this.closeDetailModal();
      this.openTaskModal(this.viewingTaskId);
    });
    document.getElementById('detailDeleteBtn').addEventListener('click', () => {
      this.deleteTask(this.viewingTaskId);
      this.closeDetailModal();
    });

    // Add Subtask
    document.getElementById('addSubtaskBtn').addEventListener('click', () => this.addSubtaskField());

    // Subtask List (Event Delegation)
    document.getElementById('subtaskList').addEventListener('click', (e) => {
      const deleteBtn = e.target.closest('.subtask-delete');
      if (deleteBtn) {
        deleteBtn.closest('.subtask-item').remove();
      }
    });

    // Search
    let searchTimeout;
    document.getElementById('searchInput').addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.currentSearch = e.target.value;
        this.render();
      }, 250);
    });

    // Filter
    document.getElementById('filterPriority').addEventListener('change', (e) => {
      this.currentFilter = e.target.value;
      this.render();
    });

    // Task Card Events (Event Delegation on Board)
    document.getElementById('kanbanBoard').addEventListener('click', (e) => {
      const editBtn = e.target.closest('.task-action-btn.edit');
      const deleteBtn = e.target.closest('.task-action-btn.delete');
      const titleEl = e.target.closest('.task-title');

      if (editBtn) {
        const id = editBtn.closest('.task-card').dataset.taskId;
        this.openTaskModal(id);
      } else if (deleteBtn) {
        const id = deleteBtn.closest('.task-card').dataset.taskId;
        this.deleteTask(id);
      } else if (titleEl) {
        const id = titleEl.closest('.task-card').dataset.taskId;
        this.openDetailModal(id);
      }
    });

    // Drag and Drop - Event Delegation
    this.setupDragAndDrop();

    // Keyboard - Escape closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeTaskModal();
        this.closeDetailModal();
      }
    });
  }

  setupDragAndDrop() {
    const board = document.getElementById('kanbanBoard');

    board.addEventListener('dragstart', (e) => {
      const card = e.target.closest('.task-card');
      if (!card) return;
      this.draggedCard = card;
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.dataset.taskId);
    });

    board.addEventListener('dragend', (e) => {
      const card = e.target.closest('.task-card');
      if (card) card.classList.remove('dragging');
      this.draggedCard = null;
      document.querySelectorAll('.kanban-column').forEach(col => col.classList.remove('drag-over'));
    });

    board.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      const column = e.target.closest('.kanban-column');
      if (column) {
        document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
        column.classList.add('drag-over');
      }
    });

    board.addEventListener('dragleave', (e) => {
      const column = e.target.closest('.kanban-column');
      if (column && !column.contains(e.relatedTarget)) {
        column.classList.remove('drag-over');
      }
    });

    board.addEventListener('drop', (e) => {
      e.preventDefault();
      const column = e.target.closest('.kanban-column');
      if (!column) return;
      column.classList.remove('drag-over');

      const taskId = e.dataTransfer.getData('text/plain');
      const newStatus = column.dataset.status;
      const task = this.state.getTaskById(taskId);

      if (task && task.status !== newStatus) {
        this.state.moveTask(taskId, newStatus);
        this.showToast(`Task moved to ${this.getStatusLabel(newStatus)}`, 'success');
      }
    });

    // Touch support for mobile drag and drop
    this.setupTouchDragDrop(board);
  }

  setupTouchDragDrop(board) {
    let touchCard = null;
    let touchClone = null;
    let touchStartX, touchStartY;
    let touchOffsetX, touchOffsetY;

    board.addEventListener('touchstart', (e) => {
      const card = e.target.closest('.task-card');
      if (!card || e.target.closest('.task-action-btn') || e.target.closest('.task-title')) return;

      touchCard = card;
      const rect = card.getBoundingClientRect();
      const touch = e.touches[0];
      touchOffsetX = touch.clientX - rect.left;
      touchOffsetY = touch.clientY - rect.top;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    board.addEventListener('touchmove', (e) => {
      if (!touchCard) return;

      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - touchStartX);
      const deltaY = Math.abs(touch.clientY - touchStartY);

      if (deltaX < 10 && deltaY < 10) return;

      e.preventDefault();

      if (!touchClone) {
        touchClone = touchCard.cloneNode(true);
        touchClone.style.position = 'fixed';
        touchClone.style.zIndex = '99999';
        touchClone.style.width = touchCard.offsetWidth + 'px';
        touchClone.style.opacity = '0.85';
        touchClone.style.transform = 'rotate(3deg) scale(1.05)';
        touchClone.style.pointerEvents = 'none';
        touchClone.style.boxShadow = 'var(--shadow-xl)';
        document.body.appendChild(touchClone);
        touchCard.style.opacity = '0.3';
      }

      touchClone.style.left = (touch.clientX - touchOffsetX) + 'px';
      touchClone.style.top = (touch.clientY - touchOffsetY) + 'px';

      // Highlight column under touch
      const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      const colUnder = elUnder ? elUnder.closest('.kanban-column') : null;
      document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
      if (colUnder) colUnder.classList.add('drag-over');
    }, { passive: false });

    board.addEventListener('touchend', (e) => {
      if (!touchCard) return;

      if (touchClone) {
        const touch = e.changedTouches[0];
        const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
        const colUnder = elUnder ? elUnder.closest('.kanban-column') : null;

        if (colUnder) {
          const newStatus = colUnder.dataset.status;
          const taskId = touchCard.dataset.taskId;
          const task = this.state.getTaskById(taskId);
          if (task && task.status !== newStatus) {
            this.state.moveTask(taskId, newStatus);
            this.showToast(`Task moved to ${this.getStatusLabel(newStatus)}`, 'success');
          }
        }

        document.body.removeChild(touchClone);
        touchClone = null;
      }

      touchCard.style.opacity = '1';
      document.querySelectorAll('.kanban-column').forEach(c => c.classList.remove('drag-over'));
      touchCard = null;
    });
  }

  getStatusLabel(status) {
    const labels = { 'todo': 'To Do', 'in-progress': 'In Progress', 'done': 'Done' };
    return labels[status] || status;
  }

  // ==================== RENDER ====================
  render() {
    const filtered = this.state.getFilteredTasks(this.currentSearch, this.currentFilter);

    const todoTasks = filtered.filter(t => t.status === 'todo');
    const progressTasks = filtered.filter(t => t.status === 'in-progress');
    const doneTasks = filtered.filter(t => t.status === 'done');

    document.getElementById('todoTasks').innerHTML = this.renderTasks(todoTasks);
    document.getElementById('progressTasks').innerHTML = this.renderTasks(progressTasks);
    document.getElementById('doneTasks').innerHTML = this.renderTasks(doneTasks);

    // Update counts (unfiltered for column headers)
    const stats = this.state.getStats();
    document.getElementById('countTodo').textContent = stats.todo;
    document.getElementById('countProgress').textContent = stats.inProgress;
    document.getElementById('countDone').textContent = stats.done;

    // Update stats bar
    document.getElementById('statTotal').textContent = stats.total;
    document.getElementById('statTodo').textContent = stats.todo;
    document.getElementById('statProgress').textContent = stats.inProgress;
    document.getElementById('statDone').textContent = stats.done;
    document.getElementById('statOverdue').textContent = stats.overdue;
  }

  renderTasks(tasks) {
    if (tasks.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">📭</div>
          <div class="empty-state-text">No tasks here yet</div>
        </div>
      `;
    }

    return tasks.map((task, i) => this.renderTaskCard(task, i)).join('');
  }

  renderTaskCard(task, index) {
    const isOverdue = task.isOverdue();
    const subtaskCount = task.subtasks.length;
    const completedSubtasks = task.getCompletedSubtasks();
    const progress = task.getSubtaskProgress();

    return `
      <article
        class="task-card ${isOverdue ? 'overdue-card' : ''}"
        draggable="true"
        data-task-id="${task.id}"
        style="animation-delay: ${index * 0.05}s"
        role="listitem"
        aria-label="Task: ${this.escapeHtml(task.title)}"
      >
        <div class="task-card-header">
          <span class="task-priority ${task.priority}">
            ${task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}
            ${task.priority}
          </span>
          <div class="task-card-actions">
            <button class="task-action-btn edit" aria-label="Edit task" title="Edit">✏️</button>
            <button class="task-action-btn delete" aria-label="Delete task" title="Delete">🗑️</button>
          </div>
        </div>
        <h3 class="task-title">${this.escapeHtml(task.title)}</h3>
        ${task.description ? `<p class="task-description">${this.escapeHtml(task.description)}</p>` : ''}
        <div class="task-meta">
          ${task.dueDate ? `
            <span class="task-due-date ${isOverdue ? 'overdue' : ''}">
              ${isOverdue ? '⚠️' : '📅'} ${task.formatDueDate()}
            </span>
          ` : '<span></span>'}
          ${subtaskCount > 0 ? `
            <span class="task-subtasks-progress">
              <span class="subtask-bar">
                <span class="subtask-bar-fill" style="width: ${progress}%"></span>
              </span>
              ${completedSubtasks}/${subtaskCount}
            </span>
          ` : ''}
        </div>
      </article>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // ==================== MODALS ====================
  openTaskModal(taskId = null, defaultStatus = 'todo') {
    this.editingTaskId = taskId;
    const modal = document.getElementById('taskModal');
    const title = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('modalSaveBtn');

    // Reset form
    document.getElementById('taskTitleInput').value = '';
    document.getElementById('taskDescInput').value = '';
    document.getElementById('taskPriorityInput').value = 'medium';
    document.getElementById('taskDueDateInput').value = '';
    document.getElementById('taskStatusInput').value = defaultStatus;
    document.getElementById('subtaskList').innerHTML = '';

    if (taskId) {
      const task = this.state.getTaskById(taskId);
      if (task) {
        title.textContent = 'Edit Task';
        saveBtn.textContent = 'Update Task';
        document.getElementById('taskTitleInput').value = task.title;
        document.getElementById('taskDescInput').value = task.description;
        document.getElementById('taskPriorityInput').value = task.priority;
        document.getElementById('taskDueDateInput').value = task.dueDate;
        document.getElementById('taskStatusInput').value = task.status;

        task.subtasks.forEach(sub => {
          this.addSubtaskField(sub.text, sub.completed);
        });
      }
    } else {
      title.textContent = 'Add New Task';
      saveBtn.textContent = 'Save Task';
    }

    modal.classList.add('active');
    document.getElementById('taskTitleInput').focus();
  }

  closeTaskModal() {
    document.getElementById('taskModal').classList.remove('active');
    this.editingTaskId = null;
  }

  addSubtaskField(text = '', completed = false) {
    const list = document.getElementById('subtaskList');
    const id = 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);

    const item = document.createElement('div');
    item.className = 'subtask-item';
    item.innerHTML = `
      <input type="checkbox" class="subtask-checkbox" ${completed ? 'checked' : ''} data-sub-id="${id}">
      <input type="text" class="subtask-text ${completed ? 'completed' : ''}" value="${this.escapeHtml(text)}" placeholder="Enter subtask...">
      <button class="subtask-delete" type="button" aria-label="Remove subtask">✕</button>
    `;

    // Toggle completed style
    const checkbox = item.querySelector('.subtask-checkbox');
    const textInput = item.querySelector('.subtask-text');
    checkbox.addEventListener('change', () => {
      textInput.classList.toggle('completed', checkbox.checked);
    });

    list.appendChild(item);
    textInput.focus();
  }

  getSubtasksFromForm() {
    const items = document.querySelectorAll('#subtaskList .subtask-item');
    const subtasks = [];
    items.forEach(item => {
      const text = item.querySelector('.subtask-text').value.trim();
      const completed = item.querySelector('.subtask-checkbox').checked;
      if (text) {
        subtasks.push({
          id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
          text,
          completed
        });
      }
    });
    return subtasks;
  }

  saveTask() {
    const title = document.getElementById('taskTitleInput').value.trim();
    if (!title) {
      this.showToast('Please enter a task title', 'error');
      document.getElementById('taskTitleInput').focus();
      return;
    }

    const taskData = {
      title,
      description: document.getElementById('taskDescInput').value.trim(),
      priority: document.getElementById('taskPriorityInput').value,
      dueDate: document.getElementById('taskDueDateInput').value,
      status: document.getElementById('taskStatusInput').value,
      subtasks: this.getSubtasksFromForm()
    };

    if (this.editingTaskId) {
      this.state.updateTask(this.editingTaskId, taskData);
      this.showToast('Task updated successfully!', 'success');
    } else {
      this.state.addTask(taskData);
      this.showToast('Task created successfully!', 'success');
    }

    this.closeTaskModal();
  }

  deleteTask(id) {
    const task = this.state.deleteTask(id);
    if (task) {
      this.showToast(`"${task.title}" deleted`, 'warning', true);
    }
  }

  openDetailModal(taskId) {
    this.viewingTaskId = taskId;
    const task = this.state.getTaskById(taskId);
    if (!task) return;

    const modal = document.getElementById('detailModal');
    const body = document.getElementById('detailModalBody');

    const priorityClass = task.priority;
    const priorityLabel = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    const priorityIcon = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';
    const statusLabel = this.getStatusLabel(task.status);
    const isOverdue = task.isOverdue();

    let subtasksHtml = '';
    if (task.subtasks.length > 0) {
      subtasksHtml = `
        <div class="detail-section">
          <div class="detail-section-title">Subtasks (${task.getCompletedSubtasks()}/${task.subtasks.length})</div>
          ${task.subtasks.map(s => `
            <div class="detail-subtask-item">
              <div class="detail-subtask-check ${s.completed ? 'checked' : 'unchecked'}">✓</div>
              <span style="font-size:0.9rem;${s.completed ? 'text-decoration:line-through;color:var(--text-tertiary)' : ''}">${this.escapeHtml(s.text)}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    body.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap">
        <span class="detail-priority-badge ${priorityClass}" style="background:var(--priority-${priorityClass}-bg);color:var(--priority-${priorityClass})">${priorityIcon} ${priorityLabel} Priority</span>
        ${isOverdue ? '<span class="detail-priority-badge" style="background:var(--overdue-bg);color:var(--overdue)">⚠️ Overdue</span>' : ''}
      </div>

      <h2 style="font-family:var(--font-display);font-size:1.3rem;font-weight:700;margin-top:0.5rem">${this.escapeHtml(task.title)}</h2>

      ${task.description ? `
        <div class="detail-section">
          <div class="detail-section-title">Description</div>
          <p class="detail-description">${this.escapeHtml(task.description)}</p>
        </div>
      ` : ''}

      <div class="detail-section">
        <div class="detail-section-title">Details</div>
        <div class="detail-meta-grid">
          <div class="detail-meta-item">
            <span class="detail-meta-label">Status</span>
            <span class="detail-meta-value">${statusLabel}</span>
          </div>
          <div class="detail-meta-item">
            <span class="detail-meta-label">Due Date</span>
            <span class="detail-meta-value" ${isOverdue ? 'style="color:var(--overdue)"' : ''}>${task.dueDate ? task.formatDueDate() : 'Not set'}</span>
          </div>
          <div class="detail-meta-item">
            <span class="detail-meta-label">Created</span>
            <span class="detail-meta-value">${task.formatCreatedDate()}</span>
          </div>
          <div class="detail-meta-item">
            <span class="detail-meta-label">Priority</span>
            <span class="detail-meta-value">${priorityIcon} ${priorityLabel}</span>
          </div>
        </div>
      </div>

      ${subtasksHtml}
    `;

    modal.classList.add('active');
  }

  closeDetailModal() {
    document.getElementById('detailModal').classList.remove('active');
    this.viewingTaskId = null;
  }

  // ==================== TOAST NOTIFICATIONS ====================
  showToast(message, type = 'info', undoable = false) {
    const container = document.getElementById('toastContainer');

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    };

    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-message">${message}</div>
      </div>
      ${undoable ? '<button class="toast-undo">Undo</button>' : ''}
      <button class="toast-close-btn" aria-label="Close notification">✕</button>
    `;

    container.appendChild(toast);

    const removeToast = () => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 300);
    };

    toast.querySelector('.toast-close-btn').addEventListener('click', removeToast);

    if (undoable) {
      toast.querySelector('.toast-undo').addEventListener('click', () => {
        const restored = this.state.undoDelete();
        if (restored) {
          this.showToast(`"${restored.title}" restored!`, 'success');
        }
        removeToast();
      });
    }

    setTimeout(removeToast, undoable ? 6000 : 3500);
  }
}

// ==================== INITIALIZE APP ====================
document.addEventListener('DOMContentLoaded', () => {
  new KanbanApp();
});
