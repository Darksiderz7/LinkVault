const form = document.querySelector('#link-form');
const list = document.querySelector('#links');
const message = document.querySelector('#message');
const search = document.querySelector('#search');
const count = document.querySelector('#link-count');
const empty = document.querySelector('#empty');

async function loadLinks() {
  const response = await fetch(`/api/links?search=${encodeURIComponent(search.value)}`);
  const links = await response.json();
  count.textContent = links.length;
  empty.hidden = links.length !== 0;
  list.innerHTML = links.map((link) => `
    <article class="link-card">
      <div class="category">${escapeHtml(link.category)}</div>
      <h3>${escapeHtml(link.title)}</h3>
      <p>${escapeHtml(link.description || 'No description provided.')}</p>
      <div class="actions">
        <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener">Visit site ↗</a>
        <button data-delete="${link.id}" class="delete">Delete</button>
      </div>
    </article>`).join('');
}

function escapeHtml(value) {
  const element = document.createElement('div');
  element.textContent = value;
  return element.innerHTML;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const response = await fetch('/api/links', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data)
  });
  const result = response.status === 204 ? {} : await response.json();
  message.textContent = response.ok ? 'Link saved successfully.' : result.error;
  message.className = response.ok ? 'success' : 'error';
  if (response.ok) { form.reset(); await loadLinks(); }
});

list.addEventListener('click', async (event) => {
  const id = event.target.dataset.delete;
  if (!id) return;
  const response = await fetch(`/api/links/${id}`, { method: 'DELETE' });
  if (response.ok) {
    message.textContent = 'Link deleted.';
    message.className = 'success';
    await loadLinks();
  }
});

search.addEventListener('input', loadLinks);
loadLinks();
