(async () => {
  const list = document.getElementById('repo-list');
  const status = document.getElementById('repo-status');
  try {
    const response = await fetch('assets/pinned.json');
    if (!response.ok) throw new Error('Pinned repositories unavailable');
    const repos = (await response.json()).filter(repo => !repo.isPrivate);
    repos.sort((a, b) => Number(!a.nameWithOwner.startsWith('wkarshat/')) - Number(!b.nameWithOwner.startsWith('wkarshat/')));
    list.replaceChildren();
    for (const repo of repos) {
      const row = document.createElement('article'); row.className = 'repo';
      const link = document.createElement('a'); link.href = repo.url; link.textContent = repo.nameWithOwner + ' ↗';
      const description = document.createElement('p'); description.textContent = repo.description || 'Source and documentation on GitHub.';
      const badge = document.createElement('span'); badge.className = 'badge';
      badge.textContent = repo.nameWithOwner.startsWith('wkarshat/') ? 'WK REPOSITORY' : 'EXTERNAL PROJECT';
      row.append(link, description, badge); list.append(row);
    }
    status.textContent = '';
  } catch { status.textContent = 'Browse the pinned repositories on GitHub.'; }
})();
