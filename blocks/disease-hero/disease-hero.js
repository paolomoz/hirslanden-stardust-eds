export default function decorate(block) {
  const img = block.querySelector('img');
  if (img) {
    img.loading = 'eager';
    img.fetchpriority = 'high';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:50% 35%;display:block;';
  }
  // img eagerness already set above; no DOM transforms needed for this block
}
