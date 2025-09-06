document.addEventListener('DOMContentLoaded',()=>{
  // Insert theme toggle into navbar
  const navContainers=document.querySelectorAll('.navbar');
  navContainers.forEach(nav=>{
    if(nav.querySelector('.theme-toggle')) return;
    const btn=document.createElement('button');
    btn.className='theme-toggle';
    btn.type='button';
    btn.title='Toggle color mode';
    btn.innerHTML='☀️';
    btn.addEventListener('click',toggleTheme);
    // place near end of navbar
    nav.appendChild(btn);
  });

  // Theme: initialize from localStorage or prefers-color-scheme
  function applyTheme(theme){
    document.documentElement.setAttribute('data-theme',theme);
    const toggles=document.querySelectorAll('.theme-toggle');
    toggles.forEach(t=>t.innerHTML = theme==='dark' ? '🌙' : '☀️');
  }
  function toggleTheme(){
    const current=document.documentElement.getAttribute('data-theme')|| (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark':'light');
    const next = current==='dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  }
  const stored=localStorage.getItem('theme');
  if(stored) applyTheme(stored); else {
    const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefers? 'dark':'light');
  }

  // Mobile nav toggle (simple)
  const trigger=document.querySelector('[data-nav-toggle]');
  const links=document.querySelector('.nav-links');
  if(trigger&&links){trigger.addEventListener('click',()=>links.style.display=links.style.display==='flex'?'':'flex');}

  // Carousel with auto-slide + swipe
  document.querySelectorAll('[data-carousel]').forEach(car=>{
    const track=car.querySelector('[data-track]');
    const slides=[...car.querySelectorAll('.testimonial')];
    let idx=0; let timer=null;
    const setActive=i=>{
      idx=(i+slides.length)%slides.length;track.style.transition='transform .28s cubic-bezier(.2,.9,.2,1)';
      track.style.transform=`translateX(-${idx*100}%)`;
      slides.forEach((s,sn)=>s.classList.toggle('active', sn===idx));
    };
    const prevBtn=car.querySelector('[data-prev]');
    const nextBtn=car.querySelector('[data-next]');
    prevBtn?.addEventListener('click',()=>{setActive(idx-1);resetTimer();});
    nextBtn?.addEventListener('click',()=>{setActive(idx+1);resetTimer();});

    // Auto slide
    const startTimer=()=>{ timer = setInterval(()=>setActive(idx+1),6000); };
    const resetTimer=()=>{ if(timer) clearInterval(timer); startTimer(); };
    startTimer();

    // Swipe support
    let startX=0; let deltaX=0; let isTouch=false;
    track.addEventListener('touchstart',(e)=>{if(e.touches.length!==1) return; isTouch=true; startX=e.touches[0].clientX; track.style.transition='none'; if(timer) clearInterval(timer);});
    track.addEventListener('touchmove',(e)=>{ if(!isTouch) return; deltaX = e.touches[0].clientX - startX; track.style.transform = `translateX(${ -idx*100 + (deltaX / car.clientWidth)*100 }%)`; });
    track.addEventListener('touchend',(e)=>{ if(!isTouch) return; isTouch=false; track.style.transition='transform .28s cubic-bezier(.2,.9,.2,1)'; if(Math.abs(deltaX) > (car.clientWidth*0.18)) { if(deltaX>0) setActive(idx-1); else setActive(idx+1); } else setActive(idx); deltaX=0; resetTimer(); });

    // Pause on hover (desktop)
    car.addEventListener('mouseenter',()=>{ if(timer) clearInterval(timer); });
    car.addEventListener('mouseleave',()=>{ resetTimer(); });

    setActive(0);
  });

  // Vendor filters
  const vendorGrid=document.querySelector('[data-vendors]');
  if(vendorGrid){
    const getParam=(k)=>new URLSearchParams(location.search).get(k)||'';
    const qCat=getParam('category').toLowerCase();
    const controls={
      category:document.querySelector('#filter-category'),
      price:document.querySelector('#filter-price'),
      rating:document.querySelector('#filter-rating'),
      availability:document.querySelector('#filter-availability')
    };
    const apply=()=>{
      const cat=(controls.category?.value||qCat).toLowerCase();
      const price=(controls.price?.value||'');
      const rating=Number(controls.rating?.value||0);
      const avail=(controls.availability?.checked||false);
      vendorGrid.querySelectorAll('.vendor-card').forEach(card=>{
        const c=card.dataset.category.toLowerCase();
        const pr=card.dataset.price; // low, mid, high
        const rt=Number(card.dataset.rating);
        const av=card.dataset.available==='true';
        const ok=(cat?c===cat:true)&&(!price||pr===price)&&(rt>=rating)&&(!avail||av);
        card.style.display=ok?'':'none';
      });
    };
    Object.values(controls).forEach(el=>el&&el.addEventListener(el.type==='checkbox'?'change':'input',apply));
    apply();
    vendorGrid.addEventListener('click',e=>{
      const btn=e.target.closest('[data-check]');
      if(btn){
        const name=btn.dataset.name;const av=btn.dataset.available==='true';
        alert(`${name} availability: ${av?"Available":"Unavailable"}`);
      }
    });
  }

  // Assign random prices to vendor cards
  (function assignRandomPrices(){
    const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
    const cards = document.querySelectorAll('.vendor-card');
    if(!cards || cards.length===0) return;
    function rand(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }
    cards.forEach(card=>{
      const priceTier = (card.dataset.price||'mid').toLowerCase();
      let amount;
      if(priceTier==='low') amount = rand(5000,30000);
      else if(priceTier==='high') amount = rand(150000,800000);
      else amount = rand(30000,150000);
      // store value
      card.dataset.priceAmount = amount;
      // format and display in badges area
      const badges = card.querySelector('.badges');
      if(badges){
        const priceEl = badges.querySelector('.tag');
        if(priceEl) priceEl.textContent = fmt.format(amount);
      }
    });
  })();

  // Dashboard prototype
  const budgetBar=document.querySelector('[data-budget-bar]');
  if(budgetBar){
    const spend=Number(budgetBar.dataset.spend); const total=Number(budgetBar.dataset.total);
    const pct=Math.min(100,Math.round((spend/total)*100));
    budgetBar.querySelector('span').style.width=pct+'%';
    budgetBar.title=`${pct}% of budget used`;
  }
  const todoForm=document.querySelector('[data-todo-form]');
  const todoList=document.querySelector('[data-todos]');
  const loadTodos=()=>JSON.parse(localStorage.getItem('todos')||'[]');
  const saveTodos=(t)=>localStorage.setItem('todos',JSON.stringify(t));
  if(todoForm&&todoList){
    const render=()=>{todoList.innerHTML='';loadTodos().forEach((t,i)=>{
      const li=document.createElement('li');li.className='tr';li.style.listStyle='none';li.style.padding='10px 12px';li.style.margin='6px 0';
      li.innerHTML=`<span>${t.text}</span> <button class="btn btn-outline" data-del="${i}">Done</button>`;todoList.appendChild(li);
    });};
    todoForm.addEventListener('submit',e=>{e.preventDefault();const inp=todoForm.querySelector('input');if(inp.value.trim()){const all=loadTodos();all.push({text:inp.value.trim()});saveTodos(all);inp.value='';render();}});
    todoList.addEventListener('click',e=>{const b=e.target.closest('[data-del]');if(b){const all=loadTodos();all.splice(Number(b.dataset.del),1);saveTodos(all);render();}});
    render();
  }
});
