export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];

  const layout = document.createElement('div');
  layout.className = 'disease-layout';

  const main = document.createElement('div');
  main.className = 'disease-main';

  const sidebar = document.createElement('aside');
  sidebar.className = 'disease-sidebar';
  sidebar.setAttribute('aria-label', 'Weiterführende Informationen');

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells[0]) main.append(...cells[0].childNodes);
    if (cells[1]) sidebar.append(...cells[1].childNodes);
  });

  layout.append(main, sidebar);
  block.innerHTML = '';
  block.append(layout);
}
