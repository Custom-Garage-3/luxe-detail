(function(){
  const header = document.getElementById('header');
  const hero = document.querySelector('.hero, .page-hero');
  const isTopHero = document.querySelector('.hero') !== null;

  function onScroll(){
    const scrolled = window.scrollY > 60;
    header.classList.toggle('scrolled', scrolled);
    if(hero){
      const heroBottom = hero.offsetHeight - 80;
      const overHero = window.scrollY < heroBottom && !scrolled;
      header.classList.toggle('on-dark', overHero);
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  if(toggle && nav){
    toggle.addEventListener('click', ()=> nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> nav.classList.remove('open')));
  }

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.15});
  document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

  document.querySelectorAll('.faq-item').forEach(item=>{
    const q = item.querySelector('.faq-q');
    if(q) q.addEventListener('click', ()=> item.classList.toggle('open'));
  });
})();
