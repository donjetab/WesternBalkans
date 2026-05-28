
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const menuBtn = document.getElementById('menuBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (menuBtn && mobileNav) menuBtn.addEventListener('click', () => mobileNav.classList.toggle('open'));
  const onScroll = () => {
    if (window.scrollY > 20) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll);
  onScroll();
});
