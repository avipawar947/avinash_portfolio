const config=window.PORTFOLIO||{};
const toggle=document.querySelector('.menu-toggle');
const mobileMenu=document.querySelector('#mobile-menu');
const mobileViewport=matchMedia('(max-width:600px)');
function closeMenu(returnFocus=true){
 const wasOpen=mobileMenu.open;
 if(wasOpen)mobileMenu.close();
 document.documentElement.classList.remove('mobile-menu-open');
 toggle.setAttribute('aria-expanded','false');
 toggle.setAttribute('aria-label','Open navigation');
 if(wasOpen&&returnFocus&&mobileViewport.matches)toggle.focus({preventScroll:true});
}
function openMenu(){
 if(!mobileViewport.matches)return;
 if(mobileMenu.open){closeMenu();return;}
 mobileMenu.showModal();
 document.documentElement.classList.add('mobile-menu-open');
 toggle.setAttribute('aria-expanded','true');
 toggle.setAttribute('aria-label','Close navigation');
}
toggle.addEventListener('click',openMenu);
mobileMenu.querySelector('.mobile-menu-close').addEventListener('click',()=>closeMenu());
mobileMenu.addEventListener('cancel',e=>{e.preventDefault();closeMenu()});
mobileViewport.addEventListener('change',e=>{if(!e.matches)closeMenu(false)});
mobileMenu.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{
 closeMenu(false);
 const target=document.querySelector(link.hash);
 if(target){target.setAttribute('tabindex','-1');target.focus({preventScroll:true})}
}));
mobileMenu.querySelectorAll('.linkedin-action,.resume-action').forEach(button=>button.addEventListener('click',()=>closeMenu(false)));
const dialog=document.querySelector('#detail-dialog'),content=document.querySelector('#dialog-content');
document.querySelector('.dialog-close').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
function notice(title,message){content.replaceChildren();const wrap=document.createElement('div');wrap.className='notice';const h=document.createElement('h2');h.textContent=title;const p=document.createElement('p');p.textContent=message;wrap.append(h,p);content.append(wrap);dialog.showModal()}
function preview(button,title){content.replaceChildren();const h=document.createElement('h2');h.textContent=title;const img=document.createElement('img');img.className='dialog-image';img.src=button.querySelector('img').currentSrc||button.querySelector('img').src;img.alt=button.querySelector('img').alt;content.append(h,img);dialog.showModal()}
function safeUrl(value){try{const u=new URL(value,location.href);return ['https:','http:'].includes(u.protocol)?u.href:null}catch{return null}}
document.querySelectorAll('[data-project]').forEach(b=>b.addEventListener('click',()=>{const url=config.projects?.[b.dataset.project];if(url&&safeUrl(url)){location.href=safeUrl(url);return}preview(b,b.querySelector('.project-caption').textContent.replace('↗','').trim())}));
document.querySelectorAll('[data-lightbox]').forEach(b=>b.addEventListener('click',()=>preview(b,b.dataset.lightbox)));
function bindDestination(selector,value,title,message){document.querySelectorAll(selector).forEach(b=>{if(!value){b.title=title+' — available soon';b.setAttribute('aria-label',title+' — available soon')}b.addEventListener('click',()=>{if(value&&safeUrl(value)){location.href=safeUrl(value)}else notice(title,message)})})}
bindDestination('.resume-action',config.resume,'Résumé','My résumé download will be available here soon.');
bindDestination('.linkedin-action',config.linkedin,'LinkedIn','My LinkedIn profile link will be available here soon.');
bindDestination('.behance-action',config.behance,'Behance','My Behance profile link will be available here soon.');
document.querySelectorAll('.contact-action').forEach(b=>{if(!config.email)b.title='Contact details available soon';b.addEventListener('click',()=>{if(config.email){location.href='mailto:'+encodeURIComponent(config.email)}else notice('Let’s talk','My direct contact details will be available here soon. I’m open to full-time product design roles and freelance work.')})});
document.querySelectorAll('[data-scroll]').forEach(b=>b.addEventListener('click',()=>{const track=document.querySelector('.'+b.dataset.scroll);track.scrollBy({left:Number(b.dataset.direction)*Math.min(track.clientWidth*.8,650),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}));
const tabs=[...document.querySelectorAll('[data-device]')];
function selectDevice(tab){tabs.forEach(t=>{t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1});document.querySelector('.device').dataset.current=tab.dataset.device;document.querySelector('#contact').dataset.contactDevice=tab.dataset.device;document.querySelectorAll('[data-mockup]').forEach(mockup=>{mockup.hidden=mockup.dataset.mockup!==tab.dataset.device});document.querySelector('#device-panel').setAttribute('aria-labelledby',tab.id)}
tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectDevice(tab));tab.addEventListener('keydown',e=>{let target;if(e.key==='ArrowRight')target=tabs[(i+1)%tabs.length];if(e.key==='ArrowLeft')target=tabs[(i+tabs.length-1)%tabs.length];if(e.key==='Home')target=tabs[0];if(e.key==='End')target=tabs[tabs.length-1];if(target){e.preventDefault();selectDevice(target);target.focus()}})});
document.querySelectorAll('[data-info]').forEach(b=>b.addEventListener('click',()=>b.dataset.info==='privacy'?notice('Privacy','This portfolio page has no contact form and does not run its own analytics. If you contact me through email or another platform, that service handles your message.'):notice('Cookies','This portfolio does not set its own advertising or analytics cookies. The hosting service may use cookies to provide access to this site.')));
const navLinks=[...document.querySelectorAll('.desktop-nav a')];
const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){navLinks.forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}},{rootMargin:'-10% 0px -65% 0px',threshold:0});
['home','work','about','contact'].forEach(id=>observer.observe(document.getElementById(id)));

const designGallery=document.querySelector('.gallery-track');function centreGallery(){if(designGallery)designGallery.scrollLeft=(designGallery.scrollWidth-designGallery.clientWidth)/2;}window.addEventListener('load',centreGallery,{once:true});let galleryResize;window.addEventListener('resize',()=>{clearTimeout(galleryResize);galleryResize=setTimeout(centreGallery,150)});
