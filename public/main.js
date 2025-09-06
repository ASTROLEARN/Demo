document.addEventListener('DOMContentLoaded',()=>{
  // Mobile nav toggle (simple)
  const trigger=document.querySelector('[data-nav-toggle]');
  const links=document.querySelector('.nav-links');
  if(trigger&&links){trigger.addEventListener('click',()=>links.style.display=links.style.display==='flex'?'':'flex');}

  // Carousel
  document.querySelectorAll('[data-carousel]').forEach(car=>{
    const track=car.querySelector('[data-track]');
    const slides=[...car.querySelectorAll('.testimonial')];
    let idx=0;const go=i=>{idx=(i+slides.length)%slides.length;track.style.transform=`translateX(-${idx*100}%)`;};
    car.querySelector('[data-prev]')?.addEventListener('click',()=>go(idx-1));
    car.querySelector('[data-next]')?.addEventListener('click',()=>go(idx+1));
    setInterval(()=>go(idx+1),6000);
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
