/**
 * Doctor Body block
 * Two-column layout: main content column + sidebar.
 *
 * Authored as multiple rows. Each row is a section box:
 *   Row 1..N (main column boxes): single cell with h2 + content
 *   Last row(s) with class "sidebar": sidebar cards
 *
 * To indicate sidebar rows, author adds a second cell that is empty
 * OR the block variant "doctor-body sidebar-last" separates by position.
 *
 * Simpler approach: rows with two cells → main | sidebar layout signal.
 * Rows with a single cell containing a "sidebar-*" marker → sidebar.
 *
 * Actual approach used here:
 *   - All rows authored as: [main-content] (single cell) go into main column
 *   - Rows authored as: [| sidebar-content] (first cell empty) go into sidebar
 *   - Two-cell rows where cell[0] has heading → main section box
 *   - Two-cell rows where cell[0] is empty → sidebar item
 *
 * CV list items: authored as DL with DT (year) / DD (description).
 * Membership tags: authored as UL with class "memberships" or detected by context.
 * Publications: authored as UL where each LI has a link + meta text.
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  if (!rows.length) return;

  const mainCol = document.createElement('div');
  mainCol.className = 'doctor-main';

  const sidebarCol = document.createElement('div');
  sidebarCol.className = 'doctor-sidebar';

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const isSidebar = cells.length === 2 && cells[0].textContent.trim() === '';

    if (isSidebar) {
      // Sidebar card — wrap in section-box style
      const card = document.createElement('div');
      card.className = 'doctor-sidebar-card';
      card.append(...cells[1].childNodes);
      sidebarCol.append(card);
    } else {
      // Main column section box
      const box = document.createElement('div');
      box.className = 'section-box';

      const cell = cells[0];
      if (cell) {
        // Style CV lists (dl elements)
        cell.querySelectorAll('dl').forEach((dl) => {
          dl.className = 'cv-list';
          dl.querySelectorAll('div').forEach((r) => { r.className = 'cv-row'; });
          dl.querySelectorAll('dt').forEach((dt) => { dt.className = 'cv-year'; });
          dl.querySelectorAll('dd').forEach((dd) => { dd.className = 'cv-desc'; });
        });

        // Style membership ULs: UL immediately after h2 "Mitglied" or with only short text items
        cell.querySelectorAll('ul').forEach((ul) => {
          const prev = ul.previousElementSibling;
          const isMemberships = prev && /mitglied|partner/i.test(prev.textContent);
          if (isMemberships) {
            ul.className = 'membership-tags';
          }
        });

        // Style publication ULs: LIs that contain links with pub-meta text
        cell.querySelectorAll('ul:not(.membership-tags)').forEach((ul) => {
          const hasPubs = [...ul.querySelectorAll('li')].some((li) => li.querySelector('a') && li.querySelector('a[href*="youtube"]'));
          if (hasPubs) {
            ul.className = 'pub-list';
            [...ul.querySelectorAll('li')].forEach((li) => {
              li.className = 'pub-item';
              const link = li.querySelector('a');
              if (link) {
                // Wrap in pub-content
                const icon = document.createElement('div');
                icon.className = 'pub-icon';
                icon.setAttribute('aria-hidden', 'true');
                icon.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>';

                const content = document.createElement('div');
                content.className = 'pub-content';

                // Move heading link into h4
                const h4 = document.createElement('h4');
                link.style.cssText = '';
                h4.append(link);
                content.append(h4);

                // Remaining text nodes / spans become pub-meta
                const remaining = [...li.childNodes]
                  .filter((n) => n !== link && n.textContent.trim());
                if (remaining.length) {
                  const meta = document.createElement('div');
                  meta.className = 'pub-meta';
                  remaining.forEach((n) => meta.append(n.cloneNode(true)));
                  content.append(meta);
                }

                li.innerHTML = '';
                li.append(icon, content);
              }
            });
          }
        });

        box.append(...cell.childNodes);
      }
      mainCol.append(box);
    }
  });

  const grid = document.createElement('div');
  grid.className = 'doctor-body-grid';
  grid.append(mainCol, sidebarCol);

  block.innerHTML = '';
  block.append(grid);
}
