const SERVICES=[
{id:"new-card",icon:"🪪",title:"إصدار بطاقة تموين جديدة وفصل من بطاقة الأهل",desc:"تقديم طلب إصدار بطاقة تموين جديدة وفصل من بطاقة الأهل."},
{id:"add-wife",icon:"👩‍❤️‍👨",title:"ضم الزوجة",desc:"ضم الزوجة إلى بطاقة الزوج مع مستندات الزوج والزوجة."},
{id:"transfer",icon:"📍",title:"نقل البطاقة",desc:"نقل بطاقة التموين من محافظة ومنطقة إلى أخرى."},
{id:"damaged",icon:"🔄",title:"بدل تالف",desc:"طلب إصدار بدل تالف لبطاقة التموين."},
{id:"lost",icon:"❓",title:"بدل فاقد",desc:"طلب إصدار بدل فاقد لبطاقة التموين."},
{id:"children",icon:"👨‍👩‍👧",title:"ضم الأبناء",desc:"ضم الأبناء مع شهادات الميلاد وبطاقة الأم."},
{id:"update-data",icon:"🕒",title:"تحديث بيانات بطاقة التموين",desc:"خدمة تحديث بيانات البطاقة لمن تم حذفهم من التموين — قريبًا.",soon:true}
];

const AREAS_BY_GOVERNORATE=LOCATION_DATA;
function serviceById(id){return SERVICES.find(s=>s.id===id)}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

/* Arabic-friendly normalization used by every location field. */
function norm(v){
  return String(v||"").trim().toLowerCase()
    .replace(/[أإآٱ]/g,"ا")
    .replace(/[ةۀ]/g,"ه")
    .replace(/ى/g,"ي")
    .replace(/ؤ/g,"و")
    .replace(/ئ/g,"ي")
    .replace(/ـ/g,"")
    .replace(/[\u064B-\u065F\u0670]/g,"")
    .replace(/\s+/g," ");
}

function renderServices(id="servicesGrid"){
  const el=document.getElementById(id); if(!el)return;
  el.innerHTML=SERVICES.map(s=>`
    <article class="service-card ${s.soon?"service-soon":""}">
      <div class="service-icon">${s.icon}</div>
      <span class="service-badge">${s.soon?"قريبًا":"متاح الآن"}</span>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.desc)}</p>
      ${s.soon
        ? `<button class="service-link disabled" disabled>سيتم تفعيلها قريبًا ⏳</button>`
        : `<a class="service-link" href="request.html?service=${encodeURIComponent(s.id)}">ابدأ الطلب <span>←</span></a>`}
    </article>`).join("");
}

function setupLocationPicker(){
  const g=document.getElementById("governorate");
  const a=document.getElementById("area");
  const smart=document.getElementById("locationSmart");
  const otherWrap=document.getElementById("otherAreaWrap");
  const otherInput=document.getElementById("otherArea");
  if(!g||!a)return;

  const govs=Object.keys(LOCATION_DATA);
  const OTHER="__other__";
  const all=[];
  govs.forEach(gov=>(LOCATION_DATA[gov]||[]).forEach(area=>all.push({gov,area})));

  const aliases={
    "فيصل":"الجيزة","فصل":"الجيزة","الهرم":"الجيزة","6 اكتوبر":"الجيزة","6 أكتوبر":"الجيزة",
    "السادس من اكتوبر":"الجيزة","السادس من أكتوبر":"الجيزة","مدينه نصر":"القاهرة","مدينة نصر":"القاهرة",
    "مصر الجديده":"القاهرة","شبرا الخيمه":"القليوبية","شبرا الخيمة":"القليوبية"
  };

  const norm=v=>String(v||"").trim().toLowerCase()
    .replace(/[أإآٱ]/g,"ا").replace(/[ةۀ]/g,"ه").replace(/ى/g,"ي")
    .replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/ـ/g,"")
    .replace(/[\u064B-\u065F\u0670]/g,"").replace(/\s+/g," ");

  const score=(item,q)=>{
    const n=norm(q),v=norm(item);
    if(!n)return 1;
    if(v===n)return 100;
    if(v.startsWith(n))return 90;
    const pos=v.indexOf(n);
    return pos>=0?70-Math.min(pos,25):0;
  };

  const option=(value,text,disabled=false)=>{
    const o=document.createElement("option");o.value=value;o.textContent=text;o.disabled=disabled;return o;
  };

  function fillGovs(selected=""){
    g.innerHTML="";
    g.appendChild(option("","اختر المحافظة..."));
    govs.forEach(gov=>g.appendChild(option(gov,gov)));
    if(selected && govs.includes(selected))g.value=selected;
  }

  function showOther(show){
    otherWrap?.classList.toggle("hidden",!show);
    if(otherInput){otherInput.required=show;if(!show)otherInput.value="";}
  }

  function fillAreas(gov, query="", selected=""){
    a.innerHTML="";
    a.appendChild(option("","اختر المركز / الحي / المنطقة..."));
    if(!gov){a.disabled=true;showOther(false);return;}
    const source=[...(LOCATION_DATA[gov]||[])];
    const q=norm(query);
    const filtered=q?source.map((area,i)=>({area,i,s:score(area,q)})).filter(x=>x.s>0).sort((x,y)=>y.s-x.s||x.i-y.i).map(x=>x.area):source;
    [...new Set(filtered)].forEach(area=>a.appendChild(option(area,area)));
    a.appendChild(option(OTHER,"أخرى / غير مدرجة"));
    a.disabled=false;
    if(selected && [...a.options].some(o=>o.value===selected))a.value=selected;
    showOther(a.value===OTHER);
  }

  function findGov(q){
    const n=norm(q); if(!n)return null;
    if(aliases[n])return aliases[n];
    return govs.find(x=>norm(x)===n)||govs.find(x=>norm(x).startsWith(n))||null;
  }

  function smartFind(value){
    const q=norm(value);if(!q)return;

    // 1) Exact governorate name always wins when the user typed a governorate.
    const govExact=govs.find(x=>norm(x)===q);
    if(govExact){
      g.value=govExact;fillAreas(govExact);
      return;
    }

    // 2) Exact area match MUST be checked before aliases.
    // This fixes cases such as "فيصل": it is an area in Giza, not just
    // an alias that points to the governorate.
    const exact=all.filter(x=>norm(x.area)===q);
    if(exact.length){
      const aliasGov=aliases[q];
      const chosen=aliasGov?exact.find(x=>x.gov===aliasGov)||exact[0]:exact[0];
      g.value=chosen.gov;
      fillAreas(chosen.gov,"",chosen.area);
      return;
    }

    // 3) Known aliases (useful for short/common spellings).
    const aliasGov=aliases[q];
    if(aliasGov){
      g.value=aliasGov;
      const aliasArea=all.find(x=>x.gov===aliasGov && norm(x.area)===q);
      fillAreas(aliasGov,"",aliasArea?.area||"");
      return;
    }

    // 4) Partial/prefix search for first letters or incomplete names.
    const pref=all.filter(x=>norm(x.area).startsWith(q));
    if(pref.length){
      const chosen=pref[0];
      g.value=chosen.gov;
      fillAreas(chosen.gov,"",chosen.area);
      return;
    }

    // If the user clearly typed a region but it isn't in our dataset,
    // choose the governorate when it was already selected and expose "Other".
    if(g.value){fillAreas(g.value);a.value=OTHER;showOther(true);if(otherInput)otherInput.value=value.trim();}
  }

  fillGovs();
  a.disabled=true;

  g.addEventListener("change",()=>{fillAreas(g.value);});
  a.addEventListener("change",()=>showOther(a.value===OTHER));
  smart?.addEventListener("input",()=>smartFind(smart.value));
  smart?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();smartFind(smart.value);}});

  // Native select keyboard search remains available; typing in the smart box is the universal search.
}

document.addEventListener("DOMContentLoaded",()=>{
  renderServices();
  setupLocationPicker();
});

/* Services dropdown: hover on desktop, tap-to-open on touch/mobile. */
document.addEventListener("DOMContentLoaded",()=>{
  const dropdown=document.querySelector(".nav-dropdown");
  const trigger=dropdown?.querySelector(".nav-services-link");
  if(!dropdown||!trigger)return;
  trigger.addEventListener("click",e=>{
    if(window.matchMedia("(max-width: 700px)").matches){
      e.preventDefault();
      dropdown.classList.toggle("open");
    }
  });
  document.addEventListener("click",e=>{
    if(!dropdown.contains(e.target))dropdown.classList.remove("open");
  });
});
