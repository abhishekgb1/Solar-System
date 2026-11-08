'use strict';
const type = document.querySelector('[data-catalog]').dataset.catalog;
const objects = window.ASTRO_DATA[type];
const list = document.querySelector('#object-list');
const details = document.querySelector('#object-details');
let selected = 0;
const palettes = ['#a69c88','#e0b787','#588cbb','#c47351','#c19c80','#d4bb85','#8fbec9','#5476c6','#8b79bd','#e0a577'];
function selectObject(index) {
  selected = index;
  const object = objects[index];
  const art = type === 'stars' ? 'star' : type === 'galaxies' ? 'galaxy' : 'planet';
  details.innerHTML = `<div class="object-visual ${art}-visual" aria-hidden="true" style="--object-color:${palettes[index % palettes.length]}"><div class="object-orbit"></div><div class="object-sphere"></div><span class="visual-caption">${String(index+1).padStart(2,'0')} / ${String(objects.length).padStart(2,'0')} &nbsp; · &nbsp; STYLIZED VIEW</span></div><div class="object-copy"><p class="eyebrow">${object.subtitle}</p><h2 id="object-name">${object.name}</h2><p class="object-description">${object.description}</p>${object.facts ? `<dl class="object-facts">${Object.entries(object.facts).map(([key,value])=>`<div><dt>${key}</dt><dd>${value}</dd></div>`).join('')}</dl>` : ''}<a class="primary" href="${object.wiki}" target="_blank" rel="noopener noreferrer">Learn more on Wikipedia ↗</a><div class="object-pagination"><button id="previous-object" ${index===0?'disabled':''}>← Previous</button><span>${index+1} / ${objects.length}</span><button id="next-object" ${index===objects.length-1?'disabled':''}>Next →</button></div></div>`;
  document.querySelectorAll('[data-object]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.object)===index)));
  document.querySelector('#previous-object').addEventListener('click',()=>selectObject(selected-1));
  document.querySelector('#next-object').addEventListener('click',()=>selectObject(selected+1));
}
function renderList() {
  const query = document.querySelector('#object-search').value.trim().toLowerCase();
  list.replaceChildren();
  objects.forEach((object,index)=>{
    if(!object.name.toLowerCase().includes(query))return;
    const button=document.createElement('button');button.className='object-button';button.dataset.object=index;button.setAttribute('aria-pressed',String(index===selected));
    const number=document.createElement('span');number.textContent=String(index+1).padStart(2,'0');
    const name=document.createElement('span');name.textContent=object.name;
    const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
    button.append(number,name,arrow);button.addEventListener('click',()=>selectObject(index));list.append(button);
  });
  document.querySelector('#no-results').hidden=list.children.length>0;
}
document.querySelector('#object-search').addEventListener('input',renderList);
renderList();selectObject(0);
