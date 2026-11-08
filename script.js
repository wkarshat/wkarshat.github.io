(async () => {
  const list = document.getElementById('repo-list');
  const status = document.getElementById('repo-status');
  try {
    const responses = await Promise.all(['personal', 'fear-ai'].map(name => fetch(`assets/${name}.json`)));
    if (responses.some(response => !response.ok)) throw new Error('Repository snapshot unavailable');
    const repos = (await Promise.all(responses.map(response => response.json()))).flat();
    repos.sort((a, b) => Number(a.fork) - Number(b.fork) || a.full_name.localeCompare(b.full_name));
    function render(filter) {
      const visible = repos.filter(repo => filter === 'all' || (filter === 'original' && !repo.fork) || (filter === 'fork' && repo.fork) || (filter === 'fear-ai' && repo.full_name.startsWith('fear-ai/')));
      list.replaceChildren();
      for (const repo of visible) {
        const row = document.createElement('article'); row.className = 'repo';
        const link = document.createElement('a'); link.href = repo.html_url; link.textContent = repo.full_name + ' ↗';
        const description = document.createElement('p'); description.textContent = repo.description || 'Explore source and documentation on GitHub.';
        const badge = document.createElement('span'); badge.className = 'badge'; badge.textContent = repo.fork ? 'UPSTREAM FORK' : 'ORIGINAL REPO';
        row.append(link, description, badge); list.append(row);
      }
      status.textContent = `${visible.length} public repositories`;
    }
    document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      render(button.dataset.filter);
    }));
    render('all');
  } catch { status.textContent = 'Use the GitHub links below to explore the repositories.'; }
})();
