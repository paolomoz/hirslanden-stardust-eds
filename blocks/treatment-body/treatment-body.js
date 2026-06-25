export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const layout = document.createElement('div');
  layout.className = 'td-layout';

  const main = document.createElement('div');
  main.className = 'td-main';

  const sidebar = document.createElement('aside');
  sidebar.className = 'td-sidebar';
  sidebar.setAttribute('aria-label', 'Zusatzinformationen');

  const sidebarSticky = document.createElement('div');
  sidebarSticky.className = 'td-sidebar-sticky';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells[0]) main.append(...cells[0].childNodes);
    if (cells[1]) sidebarSticky.append(...cells[1].childNodes);
  });

  sidebar.append(sidebarSticky);
  layout.append(main, sidebar);
  block.innerHTML = '';
  block.append(layout);
}
