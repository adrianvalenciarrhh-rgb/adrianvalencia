/* t396 v3 · Gabinete — IA: dibujo al entrar, mapa con relaciones, selector de esfuerzo, contadores */
(()=>{const R=matchMedia('(prefers-reduced-motion: reduce)').matches,d=document;
const A=d.querySelectorAll('.g3-anim');
if(R||!('IntersectionObserver' in window)){A.forEach(e=>e.classList.add('on'))}else{d.documentElement.classList.add('g3-m');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}}),{threshold:.25});A.forEach(e=>io.observe(e))}
/* contadores */
const C=d.querySelectorAll('[data-c]');
if(!R&&'IntersectionObserver' in window){const io2=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io2.unobserve(e.target);const el=e.target,n=+el.dataset.c,t0=performance.now();
const f=t=>{const p=Math.min(1,(t-t0)/1100);el.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}),{threshold:.6});C.forEach(c=>io2.observe(c))}
/* mapa: resaltar relaciones */
const W=d.querySelector('.g3-mapw');if(W){const set=k=>{W.dataset.on=k||'';const rel=new Set(k?[k]:[]);if(k)W.querySelectorAll('.g3-ed').forEach(e=>{const ks=e.dataset.k.split(' ');if(ks.includes(k))ks.forEach(x=>rel.add(x))});
W.querySelectorAll('[data-k]').forEach(e=>{const ks=e.dataset.k.split(' ');const on=e.classList.contains('g3-ed')?ks.includes(k):ks.some(x=>rel.has(x));e.classList.toggle('hi',!!k&&on)})};
W.querySelectorAll('.g3-nd,.g3-leg li').forEach(n=>{const k=n.dataset.k;n.addEventListener('mouseenter',()=>set(k));n.addEventListener('focus',()=>set(k));n.addEventListener('mouseleave',()=>set(''));n.addEventListener('blur',()=>set(''))})}
/* esfuerzo */
d.querySelectorAll('.g3-ef button').forEach(b=>b.addEventListener('click',()=>{d.querySelectorAll('.g3-ef').forEach(l=>{const on=l.contains(b);l.classList.toggle('on',on);l.querySelector('button').setAttribute('aria-pressed',on)})}));
})();
