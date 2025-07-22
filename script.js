const API_URL = 'https://todo-miniapp.onrender.com/items';

function createTodoHTML(item) {
  return `
    <div class="item">
      <input type="checkbox" onchange="deleteTodo(${item.id})" />

      <p id="title${item.id}">${item.title}</p>

      <form class="edit" onsubmit="editTodo(${item.id}); return false;">
        <input id="input${item.id}" type="text" value="${item.title}" hidden />
        <button id="done${item.id}" class="edit" hidden>
          <img class="icon" src="icons/check-solid.svg" alt="tick image">
        </button>
      </form>

      <button id="edit${item.id}" class="edit" onclick="enableEdit(${item.id})">
        <img class="icon" src="icons/pencil-solid.svg" alt="pencil image">
      </button>
    </div>
  `;
}

function renderTodos(todos) {
  const container = document.getElementById('todo-container');
  container.innerHTML = todos.map(createTodoHTML).join('') + `
    <form class="item" id="add-form">
      <input type="text" id="newItem" placeholder="New Item" autocomplete="off" required />
      <button class="add" type="submit">+</button>
    </form>
  `;

  document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('newItem').value.trim();
    if (title) {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
      });
      fetchTodos();
    }
  });
}

async function fetchTodos() {
  const res = await fetch(API_URL);
  const data = await res.json();
  renderTodos(data);
}

async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchTodos();
}

function enableEdit(id) {
  document.getElementById("title" + id).setAttribute("hidden", true);
  document.getElementById("edit" + id).setAttribute("hidden", true);
  document.getElementById("done" + id).removeAttribute("hidden");
  document.getElementById("input" + id).removeAttribute("hidden");
}

async function editTodo(id) {
  const updatedTitle = document.getElementById("input" + id).value.trim();
  if (!updatedTitle) return;

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: updatedTitle })
  });

  fetchTodos();
}

window.onload = () => {
  fetchTodos();
  document.getElementById("year").textContent = new Date().getFullYear();
};
