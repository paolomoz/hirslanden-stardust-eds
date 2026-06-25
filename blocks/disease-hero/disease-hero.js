/**
 * disease-hero block
 * A full-bleed cinematic banner image for a disease/condition page.
 *
 * Authoring: a single image (absolute URL). If none is authored, a neutral
 * placeholder renders (author drops the image later).
 */

export default async function decorate(block) {
  let media = null;
  block.querySelectorAll(':scope > div > div').forEach((cell) => {
    const found = cell.querySelector('picture, img');
    if (found && !media) media = found;
  });

  let node;
  if (media) {
    node = media.tagName.toLowerCase() === 'picture' ? media : media;
  } else {
    node = document.createElement('div');
    node.className = 'placeholder-media';
  }

  block.replaceChildren(node);
}
