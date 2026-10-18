/* Adrián Valencia Ríos — v5. JS propio, sin dependencias (~5 KB). */
(()=>{const d=document,de=d.documentElement,W=window;
const RM=matchMedia('(prefers-reduced-motion: reduce)'),FINE=matchMedia('(pointer:fine)');let rm=RM.matches;
const $$=(s,c=d)=>[...c.querySelectorAll(s)];

/* Ajuste de titulares a ancho (wordmark, 404, contacto) */
const fits=$$('.fit');
/* Portada: encuadre de la mirada. Pelo bajo la barra y orificios nasales a la altura del borde superior de las letras.
   Referencias en portada-bn (1024 px; = bn-2 desplazada −2 px en x y +6 px en y): pelo y=106, parte alta de los orificios y=546, ojos y=441, eje x=495. */
function aim(){const im=d.querySelector('.hp-k img'),hn=d.querySelector('.h-name'),bl=hn&&hn.querySelector('.bl'),he=d.querySelector('.hero');if(!im||!bl||!he)return;
 const fs=parseFloat(getComputedStyle(hn).fontSize),cx=(aim.c||(aim.c=d.createElement('canvas').getContext('2d')));cx.font=fs+'px Anton';const cap=cx.measureText('N').actualBoundingBoxAscent||fs*.735;
 const hb=he.getBoundingClientRect(),W=hb.width,capTop=bl.getBoundingClientRect().bottom-hb.top-cap,hd=d.querySelector('.hd-in'),Ht=(hd?hd.offsetHeight:72)+4,mob=W<=600;
 const N=546,AX=495,s=mob?Math.max(W/994,Math.min(capTop/N,(W-20)/355)):Math.max(W/994,capTop/N,(capTop-Ht)/(N-106)),z=1024*s;
 im.style.cssText='width:'+z.toFixed(1)+'px;height:'+z.toFixed(1)+'px;left:'+(W/2-AX*s).toFixed(1)+'px;top:'+(capTop-N*s).toFixed(1)+'px';im.parentNode.style.transformOrigin='50% '+(capTop-(N-441)*s).toFixed(1)+'px';}
function fit(){fits.forEach(el=>{const wm=el.querySelector('.wm');if(!wm)return;
 if(el.dataset.lines){const ls=el.querySelectorAll('.nl');if(innerWidth<=+el.dataset.lines){el.style.fontSize='';const box=el.parentNode,cs=getComputedStyle(box),cw=box.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);ls.forEach(l=>{l.style.fontSize='100px';const w=l.firstChild.getBoundingClientRect().width;l.style.fontSize=(100*cw/w*.995).toFixed(2)+'px'});return}ls.forEach(l=>l.style.fontSize='')}el.style.fontSize='100px';const w=wm.getBoundingClientRect().width,cw=el.clientWidth||el.parentNode.clientWidth;if(!w)return;let fs=Math.min(100*cw/w*.995,+el.dataset.max||1000);if(el.dataset.maxh){const h=wm.getBoundingClientRect().height*fs/100,mh=innerHeight*el.dataset.maxh;if(h>mh)fs*=mh/h}el.style.fontSize=fs.toFixed(2)+'px';});}
fit();aim();d.fonts&&d.fonts.ready.then(()=>{fit();aim()});let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{fit();aim()},80)});

/* Aparición al entrar en viewport */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px'});
let pend=$$('[data-r]');pend.forEach(el=>io.observe(el));
/* red de seguridad: revela lo que ya quedó por encima (saltos de scroll, anclas, tecla Fin) */
let lastChk=0;const sweep=now=>{if(now-lastChk<200||!pend.length)return;lastChk=now;pend=pend.filter(el=>{if(el.classList.contains('in'))return false;if(el.getBoundingClientRect().top<innerHeight*.95){el.classList.add('in');io.unobserve(el);return false}return true})};

/* Cabecera: sólida al bajar, se oculta al hacer scroll hacia abajo */
const hd=d.querySelector('.hd');let ly=scrollY;
/* Reloj de Sevilla */
const clks=$$('.clock');
if(clks.length){const f=new Intl.DateTimeFormat('es-ES',{timeZone:'Europe/Madrid',hour:'2-digit',minute:'2-digit'});const tick=()=>{const t=f.format(new Date());clks.forEach(c=>c.textContent=t)};tick();setInterval(tick,15000);}

/* Menú móvil */
const bg=d.querySelector('.burger'),menu=d.getElementById('menu');
function setMenu(o){bg.setAttribute('aria-expanded',String(o));bg.querySelector('.vh').textContent=o?'Cerrar menú':'Abrir menú';menu.hidden=!o;de.style.overflow=o?'hidden':'';if(o)menu.querySelector('a').focus();}
if(bg&&menu){bg.addEventListener('click',()=>setMenu(menu.hidden));addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden){setMenu(false);bg.focus()}});$$('a',menu).forEach(a=>a.addEventListener('click',()=>setMenu(false)));}

/* Manifiesto: palabras que se iluminan con el scroll */
const mf=d.querySelector('[data-words]');let words=[];
if(mf){const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const fr=d.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(t=>{if(!t)return;if(/^\s+$/.test(t))fr.append(t);else{const s=d.createElement('span');s.className='w';s.textContent=t;fr.append(s)}});c.replaceWith(fr)}else walk(c)})};walk(mf);words=$$('.w',mf);}

/* Marquesinas: velocidad base + inercia del scroll, la dirección sigue al scroll */
const mqs=$$('.mq-t,.strip-t').map(t=>({t,s:+(t.closest('[data-speed]')||t).dataset.speed||40,x:0,w:0,vis:true}));
const vio=new IntersectionObserver(es=>es.forEach(e=>{const m=mqs.find(m=>m.t.parentNode===e.target||m.t===e.target);if(m)m.vis=e.isIntersecting}));
mqs.forEach(m=>vio.observe(m.t.parentNode));
const measure=()=>mqs.forEach(m=>{m.w=m.t.firstElementChild.getBoundingClientRect().width});measure();d.fonts&&d.fonts.ready.then(measure);addEventListener('resize',measure);
let vel=0,dir=1,last=performance.now();

/* Paralaje suave */
const par=$$('[data-par]').map(el=>({el,f:+el.dataset.par}));

/* Vista previa de proyectos que sigue al cursor */
let pv=null,px=0,py=0,tx=0,ty=0;
const lists=$$('.plist,.jlist,.tlist');
if(FINE.matches&&lists.length){pv=d.createElement('div');pv.className='pv';pv.setAttribute('aria-hidden','true');pv.innerHTML='<img alt="">';d.body.append(pv);const pimg=pv.firstChild;
 lists.forEach(l=>{l.addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY});
  $$('a[data-img]',l).forEach(a=>a.addEventListener('pointerenter',e=>{if(pimg.getAttribute('src')!==a.dataset.img)pimg.src=a.dataset.img;pv.classList.toggle('sq',l.classList.contains('tlist'));if(!pv.classList.contains('on')){px=tx=e.clientX;py=ty=e.clientY}pv.classList.add('on')}));
  l.addEventListener('pointerleave',()=>pv.classList.remove('on'));});}

const isHome=d.body.classList.contains('home'),spb=d.querySelector('.sp-b');
function frame(now){sweep(now);const dt=Math.min(64,now-last)/1000;last=now;const y=scrollY,dy=y-ly;
 if(isHome)d.body.classList.toggle('at-hero',y<innerHeight*.45&&!(spb&&spb.getAttribute('aria-expanded')==='true'));
 if(hd){hd.classList.toggle('solid',y>40);hd.classList.toggle('hide',dy>2&&y>320&&menu&&menu.hidden);if(dy<-2)hd.classList.remove('hide');}
 if(Math.abs(dy)>0.5)dir=dy>0?1:-1;vel+=(Math.min(Math.abs(dy),120)-vel)*.12;ly=y;
 if(!rm){mqs.forEach(m=>{if(!m.vis||!m.w)return;m.x-=(m.s*(1+vel*.09))*dt*dir;if(m.x<=-m.w)m.x+=m.w;if(m.x>0)m.x-=m.w;m.t.style.transform=`translate3d(${m.x.toFixed(2)}px,0,0)`});
  if(innerWidth>820)par.forEach(p=>{const r=p.el.getBoundingClientRect();const c=(r.top+r.height/2-innerHeight/2);p.el.style.transform=`translate3d(0,${Math.max(-12,Math.min(12,c*p.f)).toFixed(1)}px,0)`});
  if(pv&&pv.classList.contains('on')){px+=(tx-px)*.16;py+=(ty-py)*.16;const rot=Math.max(-8,Math.min(8,(tx-px)*.08));pv.style.transform=`translate(${px.toFixed(1)}px,${py.toFixed(1)}px) translate(-50%,-50%) rotate(${rot.toFixed(2)}deg)`;}}
 else if(pv&&pv.classList.contains('on'))pv.style.transform=`translate(${tx}px,${ty}px) translate(-50%,-50%)`;
 if(words.length){const r=mf.getBoundingClientRect();const p=Math.min(1,Math.max(0,(innerHeight*.82-r.top)/(r.height+innerHeight*.3)));const n=rm?words.length:Math.round(p*words.length*1.05);words.forEach((w,i)=>w.classList.toggle('on',i<n));}
 requestAnimationFrame(frame);}
requestAnimationFrame(frame);
RM.addEventListener&&RM.addEventListener('change',e=>{rm=e.matches;if(rm){mqs.forEach(m=>m.t.style.transform='');par.forEach(p=>p.el.style.transform='')}});


/* Posts: paralaje inverso suave con el ratón (todas las imágenes a la vez, sentido contrario, lerp). Sólo puntero fino y sin reduced-motion. */
const coll=d.querySelector('[data-coll]');
if(coll){const its=$$('.pi',coll).map(el=>({el,k:+el.dataset.d||1}));let tx=0,ty=0,cx=0,cy=0,on=false,run=false;const A=22;
 const vids=$$('video',coll);const vsync=()=>vids.forEach(v=>{if(rm){v.pause();v.removeAttribute('autoplay')}else if(on)v.play().catch(()=>{})});vsync();
 new IntersectionObserver(es=>{on=es[0].isIntersecting;vsync();if(on)kick()}).observe(coll);
 const step=()=>{cx+=(tx-cx)*.07;cy+=(ty-cy)*.07;its.forEach(o=>{o.el.style.transform=`translate3d(${(cx*o.k).toFixed(2)}px,${(cy*o.k).toFixed(2)}px,0)`});if(on&&!rm&&(Math.abs(tx-cx)>.05||Math.abs(ty-cy)>.05))requestAnimationFrame(step);else run=false};
 const kick=()=>{if(!run&&on&&!rm){run=true;requestAnimationFrame(step)}};
 if(FINE.matches)addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||rm||!on)return;tx=-(e.clientX/innerWidth-.5)*2*A;ty=-(e.clientY/innerHeight-.5)*2*A;kick()},{passive:true});
 RM.addEventListener&&RM.addEventListener('change',()=>{if(rm){tx=ty=cx=cy=0;its.forEach(o=>o.el.style.transform='')}vsync()});}

/* FAQ acordeón accesible */
$$('.faq-q').forEach(b=>b.addEventListener('click',()=>b.setAttribute('aria-expanded',String(b.getAttribute('aria-expanded')!=='true'))));

/* Reel en modal (<dialog> nativo: foco atrapado, Esc, foco devuelto) */
const dlg=d.querySelector('.reel-d');
if(dlg){const box=dlg.querySelector('.reel-v');let opener=null;
 const close=()=>{dlg.close()};
 dlg.addEventListener('close',()=>{box.innerHTML='';de.style.overflow='';opener&&opener.focus()});
 $$('[data-reel]').forEach(b=>b.addEventListener('click',()=>{opener=b;box.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${dlg.dataset.yt}?autoplay=1&rel=0&playsinline=1" title="Reel de Adrián Valencia (YouTube)" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;dlg.showModal();de.style.overflow='hidden';dlg.querySelector('.reel-x').focus()}));
 dlg.querySelector('.reel-x').addEventListener('click',close);
 dlg.addEventListener('click',e=>{if(e.target===dlg)close()});}

/* Mini reproductor de Spotify (el iframe sólo se carga al abrir) */
const sb=d.querySelector('.sp-b'),sp=d.getElementById('sp-panel');
if(sb&&sp)sb.addEventListener('click',()=>{const o=sp.hidden;if(o&&!sp.querySelector('iframe'))sp.querySelector('.sp-f').innerHTML=`<iframe src="${sp.dataset.src}" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" title="Playlist de Spotify — Resonancia"></iframe>`;sp.hidden=!o;sb.setAttribute('aria-expanded',String(o))});

/* Copiar email */
$$('[data-copy]').forEach(b=>b.addEventListener('click',async()=>{const s=b.nextElementSibling;try{await navigator.clipboard.writeText(b.dataset.copy);s.textContent='Copiado ✓'}catch(e){s.textContent=b.dataset.copy}setTimeout(()=>s.textContent='',2400)}));

/* Volver arriba */
$$('a[href="#top"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();scrollTo({top:0,behavior:rm?'auto':'smooth'});(d.querySelector('.brand')||d.body).focus({preventScroll:true})}));

/* Resonancia D/E/F: selector común (botones aria-pressed + flechas/Inicio/Fin) y lectura «sonando» */
$$('[data-pick]').forEach(root=>{const bs=$$('.pk',root);if(!bs.length)return;let cur=-1;
 const set=(k,v)=>$$('[data-np="'+k+'"]',root).forEach(e=>e.textContent=v);
 const sel=(i,o={})=>{i=(i+bs.length)%bs.length;const b=bs[i];if(i!==cur){cur=i;bs.forEach((x,j)=>x.setAttribute('aria-pressed',j===i?'true':'false'));
  set('n',String(i+1).padStart(2,'0'));set('t',b.dataset.t);set('ar',b.dataset.ar);set('a',b.dataset.ga);set('b',b.dataset.gb);set('c',b.dataset.gc);set('vh',' — '+b.dataset.t+' — '+b.dataset.ar+' (se abre en una pestaña nueva)');
  $$('[data-np-h]',root).forEach(a=>a.href=b.dataset.h);$$('[data-np-img]',root).forEach(im=>im.src=b.dataset.src);if(b.dataset.big)$$('[data-np-big]',root).forEach(im=>im.src=b.dataset.big);
  if(o.user&&!rm){root.classList.remove('chg');void root.offsetWidth;root.classList.add('chg')}root.dataset.g=b.dataset.g;root.style.setProperty('--cur',i);
  root.dispatchEvent(new CustomEvent('pick',{detail:{i,b,o}}));}
  if(o.focus)b.focus({preventScroll:!!o.noScroll});};
 bs.forEach((b,i)=>b.addEventListener('click',()=>sel(i,{user:1})));
 root.addEventListener('keydown',e=>{const i=bs.indexOf(d.activeElement);if(i<0)return;const k=e.key;let n=null;
  if(k==='ArrowRight'||k==='ArrowDown')n=i+1;else if(k==='ArrowLeft'||k==='ArrowUp')n=i-1;else if(k==='Home')n=0;else if(k==='End')n=bs.length-1;
  if((k==='Enter'||k===' ')&&bs[i].tagName!=='BUTTON'){e.preventDefault();sel(i,{user:1});return}
  if(n!==null){e.preventDefault();sel(n,{user:1,focus:1})}});
 root._sel=sel;root._n=bs.length;root._cur=()=>cur;
 new IntersectionObserver(es=>{root.classList.toggle('vis',es[0].isIntersecting)}).observe(root);
 sel(0);});

/* D — tocadiscos: el vinilo sale, cambia la galleta y vuelve al plato */
$$('[data-tt]').forEach(tt=>{const lab=tt.querySelector('.tt-lab img');let tm;
 tt.addEventListener('pick',e=>{const src=e.detail.b.querySelector('img').getAttribute('src');if(!e.detail.o.user||rm){lab.src=src;return}
  clearTimeout(tm);tt.classList.add('swap');tm=setTimeout(()=>{lab.src=src;tt.classList.remove('swap')},420)});});

/* E — cajón de discos: el scroll hojea los discos (sticky); con reduced-motion, sin scroll largo y cambio inmediato */
$$('[data-crate]').forEach(cr=>{const ss=$$('.cr-s',cr),N=ss.length;let c=0,tc=0,run=false,fromScroll=false;
 const lay=v=>ss.forEach((s,i)=>{const dd=i-v;let t,op=1;
  if(dd<0){const k=Math.max(dd,-1.3);t=`translate3d(0,${(-k*14).toFixed(1)}%,${(-k*70).toFixed(1)}px) rotateX(${(k*78).toFixed(1)}deg)`;op=Math.max(0,1+k*1.5)}
  else{const k=Math.min(dd,9),l=Math.min(dd,1);t=`translate3d(0,${(-k*3).toFixed(2)}%,${(-k*38).toFixed(1)}px) rotateX(${(l*14).toFixed(1)}deg)`;op=dd>7?Math.max(0,8-dd):1}
  s.style.transform=t;s.style.opacity=op.toFixed(3);s.classList.toggle('on',Math.abs(dd)<.5)});
 const stat=()=>rm||innerWidth<0;const span=()=>Math.max(1,cr.offsetHeight-innerHeight);
 const prog=()=>{const r=cr.getBoundingClientRect();return Math.min(1,Math.max(0,-r.top/span()))};
 const tick=()=>{tc=prog()*(N-1);c+=(tc-c)*.16;if(Math.abs(tc-c)<.002)c=tc;lay(c);const i=Math.round(c);if(i!==cr._cur()){fromScroll=true;cr._sel(i);fromScroll=false}
  if(cr.classList.contains('vis')&&!rm)requestAnimationFrame(tick);else run=false};
 const kick=()=>{if(!run&&!rm){run=true;requestAnimationFrame(tick)}};
 const mode=()=>{cr.classList.toggle('cr-static',rm);if(rm)lay(cr._cur());else kick()};
 cr.addEventListener('pick',e=>{if(fromScroll)return;const i=e.detail.i;if(rm){lay(i);return}
  if(e.detail.o.user)go(i)});
 const go=(i,inst)=>{const top=cr.getBoundingClientRect().top+scrollY+span()*(i/(N-1));scrollTo({top,behavior:inst?'auto':'smooth'})};
 cr.addEventListener('focusin',e=>{const b=e.target.closest&&e.target.closest('.pk');if(!b||rm)return;const i=+b.dataset.i;requestAnimationFrame(()=>{if(i!==cr._cur())cr._sel(i,{user:1});else go(i,1)})});
 addEventListener('scroll',kick,{passive:true});new IntersectionObserver(es=>{if(es[0].isIntersecting)kick()}).observe(cr);
 RM.addEventListener&&RM.addEventListener('change',mode);mode();lay(0);});

/* F — ecualizador: el grupo del disco elegido se ensancha */
$$('[data-eq]').forEach(eq=>{const gs=$$('.eq-grp',eq),ls=$$('.eq-gl',eq);eq.addEventListener('pick',e=>{const g=+e.detail.b.dataset.g;gs.forEach((x,i)=>x.classList.toggle('on',i===g));ls.forEach((x,i)=>x.classList.toggle('on',i===g))})});

/* K — hoja de contactos: lupa sobre el fotograma elegido; con ratón, sigue al cursor y amplía lo que hay debajo */
$$('[data-ks]').forEach(ks=>{const tb=ks.querySelector('.ks-tb'),lp=ks.querySelector('.ks-lp'),li=lp.querySelector('img'),fs=$$('.ks-f',ks),Z=2.4;let selB=fs[0];
 const place=(im,cx,cy,rx,ry)=>{const tr=tb.getBoundingClientRect(),r=im.getBoundingClientRect(),L=lp.offsetWidth,W=r.width*Z;
  lp.style.transform=`translate(${(cx-tr.left-L/2).toFixed(1)}px,${(cy-tr.top-L/2).toFixed(1)}px)`;li.style.width=li.style.height=W.toFixed(1)+'px';li.style.transform=`translate(${(L/2-rx*W).toFixed(1)}px,${(L/2-ry*W).toFixed(1)}px)`};
 const rest=()=>{const im=selB.querySelector('.ks-im'),r=im.getBoundingClientRect();li.src=selB.dataset.big;place(im,r.right-r.width*.08,r.top+r.height*.12,.5,.5)};
 ks.addEventListener('pick',e=>{selB=e.detail.b;rest()});
 if(FINE.matches)fs.forEach(f=>{const im=f.querySelector('.ks-im');f.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse')return;const r=im.getBoundingClientRect();const rx=Math.min(1,Math.max(0,(e.clientX-r.left)/r.width)),ry=Math.min(1,Math.max(0,(e.clientY-r.top)/r.height));if(li.getAttribute('src')!==f.dataset.big)li.src=f.dataset.big;ks.classList.add('hov');place(im,e.clientX,e.clientY,rx,ry)})});
 tb.addEventListener('pointerleave',()=>{ks.classList.remove('hov');rest()});
 addEventListener('resize',rest);d.fonts&&d.fonts.ready.then(rest);addEventListener('load',rest);rest();});
/* R — Resonancia definitiva: el título elegido suena a su propio volumen (ajustado al hueco) y deja tres ecos que se apagan.
   Física: muelle subamortiguado analítico (ζ .58, 1,7 Hz) con retardo entre ecos de 70 ms, como un delay. Sólo transform/opacity. */
$$('[data-rz]').forEach(rz=>{const tb=rz.querySelector('.rz-t'),Ls=$$('.rz-l',tb),M=Ls[Ls.length-1],E=Ls.slice(0,-1).reverse(),cb=rz.querySelector('.rz-cb'),cis=$$('.rz-ci',rz),frs=$$('.rz-fr',rz).reverse();
 const cx=d.createElement('canvas').getContext('2d'),LH=.86,EK=.1,OP=[.5,.3,.7],FD=14;let fs=100,raf=0,cur=rz.querySelector('.pk[aria-pressed="true"]'),fi=0;
 const wd=s=>cx.measureText(s).width/100;
 const fit=t=>{const W=tb.clientWidth,H=tb.clientHeight;if(!W||!H)return;cx.font='100px Anton, "Arial Narrow", sans-serif';const T=t.toUpperCase(),w=T.split(' '),c=[[T]];
  const split=(ws,n)=>{if(n===1)return[[ws.join(' ')]];const out=[];for(let i=1;i<ws.length;i++)for(const r of split(ws.slice(i),n-1))out.push([ws.slice(0,i).join(' '),...r]);return out};
  for(let n=2;n<=Math.min(3,w.length);n++)c.push(...split(w,n));
  let b=null;for(const l of c){const s=Math.min(W*.995/Math.max(...l.map(wd)),H/(l.length*LH+E.length*EK));if(!b||s>b.s+.5)b={l,s}}
  fs=b.s;tb.style.setProperty('--fs',fs.toFixed(1)+'px');const q=b.l.map(x=>x.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'})[m]));M.innerHTML=q.join('<br>');E.forEach(e=>e.innerHTML=q.map((x,i)=>i?'<span class="rz-x">'+x+'</span>':x).join('<br>'))};
 const sp=t=>{if(t<=0)return 0;const z=.58,w=2*Math.PI*1.7,wd2=w*Math.sqrt(1-z*z);return 1-Math.exp(-z*w*t)*(Math.cos(wd2*t)+z*w/wd2*Math.sin(wd2*t))};
 const lin=(t,dur)=>Math.max(0,Math.min(1,t/dur));
 const pose=t=>{const fz=fs;M.style.transform=`translate3d(0,${((1-sp(t))*.16*fz).toFixed(2)}px,0)`;M.style.opacity=lin(t,.12).toFixed(3);
  E.forEach((e,k)=>{const tk=t-.07*(k+1),p=sp(tk);e.style.transform=`translate3d(0,${(-(k+1)*EK*fz*p).toFixed(2)}px,0)`;e.style.opacity=(OP[k]*lin(tk,.18)*(1-.45*lin(tk-.5,.9))).toFixed(3)});
  frs.forEach((f,k)=>{const tk=t-.07*(k+1),p=sp(tk);f.style.transform=`translate3d(0,${(-(k+1)*FD*p).toFixed(2)}px,0)`;f.style.opacity=(lin(tk,.18)*(1-.4*lin(tk-.5,.9))).toFixed(3)});
  cb.style.transform=`scale(${(.955+.045*sp(t)).toFixed(4)})`};
 const strike=()=>{cancelAnimationFrame(raf);if(rm){pose(9);return}const t0=performance.now();const go=n=>{const t=(n-t0)/1000;pose(t);if(t<2.2)raf=requestAnimationFrame(go);else pose(9)};raf=requestAnimationFrame(go)};
 const swap=src=>{if(rm){cis[fi].src=src;return}const nx=1-fi;cis[nx].src=src;const show=()=>{cis[nx].classList.add('on');cis[fi].classList.remove('on');fi=nx};cis[nx].decode?cis[nx].decode().then(show,show):show()};
 rz.addEventListener('pick',e=>{const b=e.detail.b;cur=b;fit(b.dataset.t);swap(b.dataset.src);strike()});fit(cur.dataset.t);
 const re=()=>{if(cur)fit(cur.dataset.t);if(!raf||rm)pose(9)};
 let rt=0;addEventListener('resize',()=>{cancelAnimationFrame(rt);rt=requestAnimationFrame(re)});d.fonts&&d.fonts.ready.then(re);
 if(rm||!('IntersectionObserver' in W))pose(9);else{pose(0);new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();strike()}},{threshold:.45}).observe(tb)}});
})();
