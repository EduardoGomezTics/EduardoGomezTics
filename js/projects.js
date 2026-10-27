// projects.js - carga dinámica de proyectos desde data/projects.json
(function () {
  const grid = document.querySelector('.projects-grid');
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (!grid) return;

  const escapeHTML = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));

  function renderCard(project) {
    const isExternal = project.type === 'external';
    const linkAttrs = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
    const tags = (project.tags || [])
      .map((tag) => `<span class="tag">#${escapeHTML(tag)}</span>`)
      .join('');

    return `
      <article class="project-card" data-category="${escapeHTML(project.category)}">
        <div class="project-cover" style="--cover: url('${escapeHTML(project.cover)}')" aria-hidden="true"></div>
        <div class="project-body">
          <h3 class="project-title">${escapeHTML(project.title)}</h3>
          <p class="project-summary">${escapeHTML(project.summary).replace(/\n/g, '<br>')}</p>
          <div class="project-tags">${tags}</div>
          <a href="${escapeHTML(project.url)}" class="project-link"${linkAttrs}>Ver proyecto &rarr;</a>
        </div>
      </article>`;
  }

  function applyFilter(filter) {
    grid.querySelectorAll('.project-card').forEach((card) => {
      card.hidden = !(filter === 'all' || card.dataset.category === filter);
    });
    filterButtons.forEach((btn) => {
      const active = btn.dataset.filter === filter;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active);
    });
  }

  filterButtons.forEach((btn) =>
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter))
  );

  fetch('data/projects.json')
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .then((projects) => {
      grid.innerHTML = projects.map(renderCard).join('');
      const active = document.querySelector('.filter-btn.active');
      applyFilter(active ? active.dataset.filter : 'all');
    })
    .catch((error) => {
      console.error('Error al cargar los proyectos:', error);
      grid.innerHTML = '<p class="projects-error">// ERROR: no se pudieron cargar los proyectos. Usa un servidor local (Live Server).</p>';
    });
})();
