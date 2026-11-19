/* t396 v4 · Gabinete — IA: entrada de visuales y cuenta 771 → 66 */
(()=>{const R=matchMedia('(prefers-reduced-motion: reduce)').matches,d=document,A=d.querySelectorAll('.g4-a,.g4-res li');
if(R||!('IntersectionObserver' in window)){A.forEach(e=>e.classList.add('on'));return}
d.documentElement.classList.add('g4-m');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting&&e.boundingClientRect.top>0)return;const t=e.target;t.classList.add('on');io.unobserve(t);
const c=t.querySelector('.g4-cd');if(c){const a=+c.dataset.from,b=+c.dataset.to,t0=performance.now();const f=n=>{const p=Math.min(1,(n-t0)/1400),k=1-Math.pow(1-p,3);c.textContent=Math.round(a+(b-a)*k);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)}}),{threshold:.2});
A.forEach(e=>io.observe(e))})();
