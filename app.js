(() => {
  const app = document.getElementById('app');
  const searchInput = document.getElementById('search');
  const HOME_LIMIT = 6;
  let DATA = null;

  // ---- data loading ----
  async function loadData() {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error('data.json introuvable');
    DATA = await res.json();
    document.title = DATA.site.title;
    applySiteChrome();
  }

  function applySiteChrome() {
    document.querySelectorAll('[data-bind="repoUrl"]').forEach(a => {
      if (DATA.site.repoUrl) a.href = DATA.site.repoUrl;
    });
  }

  // ---- template helpers ----
  function tpl(id) {
    return document.getElementById(id).content.cloneNode(true);
  }

  function bind(node, key) {
    return node.querySelector(`[data-bind="${key}"]`);
  }

  function tagsNode(tags = []) {
    const frag = document.createDocumentFragment();
    tags.forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      frag.appendChild(span);
    });
    return frag;
  }

  // ---- views ----
  function renderHome() {
    const node = tpl('tpl-home');
    bind(node, 'title').textContent = DATA.site.title;
    bind(node, 'tagline').textContent = DATA.site.tagline;
    bind(node, 'intro').textContent = DATA.site.intro;

    const layout = bind(node, 'categories');
    DATA.categories.forEach(cat => {
      const panel = tpl('tpl-category-panel');
      const section = panel.querySelector('.category-panel');
      section.id = `c-${cat.id}`;
      bind(panel, 'icon').textContent = cat.icon || '•';
      bind(panel, 'name').textContent = cat.name;
      bind(panel, 'anchorHref').href = `#/c/${cat.id}`;
      bind(panel, 'description').textContent = cat.description;
      bind(panel, 'count').textContent = `${cat.sites.length}`;

      const list = bind(panel, 'sites');
      cat.sites.forEach((site, idx) => {
        const row = siteRow(site, idx + 1);
        if (idx >= HOME_LIMIT) row.querySelector('.site-row').classList.add('extra');
        list.appendChild(row);
      });

      if (cat.sites.length > HOME_LIMIT) {
        const hidden = cat.sites.length - HOME_LIMIT;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'see-more';
        btn.textContent = `Voir plus (${hidden})`;
        btn.addEventListener('click', () => {
          const expanded = section.classList.toggle('expanded');
          btn.textContent = expanded ? 'Voir moins' : `Voir plus (${hidden})`;
        });
        section.appendChild(btn);
      }

      layout.appendChild(panel);
    });
    return node;
  }

  function renderCategory(catId) {
    const cat = DATA.categories.find(c => c.id === catId);
    if (!cat) return renderNotFound();

    const node = tpl('tpl-category');
    bind(node, 'name').textContent = cat.name;
    node.querySelectorAll('[data-bind="name"]').forEach(n => n.textContent = cat.name);
    bind(node, 'icon').textContent = cat.icon || '•';
    bind(node, 'description').textContent = cat.description;

    const list = bind(node, 'sites');
    cat.sites.forEach((site, idx) => {
      list.appendChild(siteRow(site, idx + 1));
    });
    return node;
  }

  function siteRow(site, rank) {
    const row = tpl('tpl-site-row');
    bind(row, 'rank').textContent = rank;
    bind(row, 'siteUrl').href = site.url;
    bind(row, 'siteUrl').querySelector('span').textContent = site.name;
    bind(row, 'description').textContent = site.description || '';
    bind(row, 'tags').appendChild(tagsNode(site.tags));
    bind(row, 'url').href = site.url;
    return row;
  }

  function renderSearch(query) {
    const q = query.toLowerCase().trim();
    const results = [];
    DATA.categories.forEach(cat => {
      cat.sites.forEach((site, idx) => {
        const hay = [site.name, site.description, ...(site.tags || []), cat.name].join(' ').toLowerCase();
        if (hay.includes(q)) results.push({ site, cat, rank: idx + 1 });
      });
    });

    const node = tpl('tpl-search-results');
    bind(node, 'summary').textContent = `${results.length} résultat(s) pour « ${query} »`;
    const list = bind(node, 'results');
    results.forEach(({ site, cat, rank }) => {
      list.appendChild(siteRow(site, rank));
    });
    return node;
  }

  function renderNotFound() {
    const div = document.createElement('div');
    div.innerHTML = `<h1>Introuvable</h1><p><a href="#/">Retour à l'accueil</a></p>`;
    return div;
  }

  // ---- router ----
  function route() {
    if (!DATA) return;
    const hash = window.location.hash.replace(/^#/, '') || '/';
    const parts = hash.split('/').filter(Boolean);
    app.innerHTML = '';

    if (parts.length === 0) {
      app.appendChild(renderHome());
    } else if (parts[0] === 'c' && parts[1]) {
      app.appendChild(renderCategory(parts[1]));
    } else if (parts[0] === 'search' && parts[1]) {
      app.appendChild(renderSearch(decodeURIComponent(parts[1])));
    } else {
      app.appendChild(renderNotFound());
    }
    window.scrollTo(0, 0);
  }

  // ---- search wiring ----
  let searchTimer;
  searchInput.addEventListener('input', e => {
    clearTimeout(searchTimer);
    const v = e.target.value;
    searchTimer = setTimeout(() => {
      if (v.trim().length === 0) {
        if (window.location.hash.startsWith('#/search')) window.location.hash = '#/';
      } else {
        window.location.hash = `#/search/${encodeURIComponent(v)}`;
      }
    }, 200);
  });

  window.addEventListener('hashchange', route);

  loadData()
    .then(route)
    .catch(err => {
      app.innerHTML = `<p style="color:#f87171">Erreur : ${err.message}</p>`;
    });
})();
