(()=>{
  const FALLBACK=[
    {title:'رئاسة الوزراء: اهتمام حكومي متواصل بمحافظة مطروح ومشروعاتها الخدمية',link:'https://sis.gov.eg/en/media-center/news/prime-minister-egypt-has-given-major-attention-to-matrouh-governorate-in-recent-years/',source:'الهيئة العامة للاستعلامات'},
    {title:'أخبار مصر المحلية — أحدث التطورات والقرارات والخدمات للمواطنين',link:'https://news.google.com/search?q=Egypt%20local%20news&hl=ar&gl=EG&ceid=EG:ar',source:'Google News'},
    {title:'آخر أخبار القاهرة والمحافظات في مصر',link:'https://news.google.com/search?q=%D8%A3%D8%AE%D8%A8%D8%A7%D8%B1%20%D9%85%D8%B5%D8%B1&hl=ar&gl=EG&ceid=EG:ar',source:'Google News'}
  ];
  const GOOGLE_RSS='https://news.google.com/rss/search?q='+encodeURIComponent('مصر أخبار محلية')+'&hl=ar&gl=EG&ceid=EG:ar';
  const PROXIES=[
    url=>`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}&_=${Date.now()}`,
    url=>`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}&_=${Date.now()}`
  ];
  let started=false, items=[], timer=null;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function normalize(list){
    return (Array.isArray(list)?list:[]).map(n=>({
      title:n.title||n.name||'',
      link:n.link||n.url||'',
      source:n.source||n.author||'أخبار مصر',
      pubDate:n.pubDate||n.published||''
    })).filter(n=>n.title);
  }
  function parseXml(text){
    const xml=new DOMParser().parseFromString(text,'text/xml');
    return [...xml.querySelectorAll('item')].map(x=>({
      title:x.querySelector('title')?.textContent?.trim()||'',
      link:x.querySelector('link')?.textContent?.trim()||'',
      source:x.querySelector('source')?.textContent?.trim()||'أخبار مصر',
      pubDate:x.querySelector('pubDate')?.textContent?.trim()||''
    }));
  }
  async function fetchLive(){
    for(const makeUrl of PROXIES){
      try{
        const r=await fetch(makeUrl(GOOGLE_RSS),{cache:'no-store'});
        if(!r.ok)continue;
        const text=await r.text();
        let list=[];
        try{
          const j=JSON.parse(text);
          list=normalize(j.items||j);
        }catch(_){ list=parseXml(text); }
        if(list.length)return list.slice(0,14);
      }catch(_){ }
    }
    return [];
  }
  function render(list){
    const viewport=document.querySelector('.news-viewport');
    const track=document.getElementById('newsTrack');
    if(!viewport||!track)return;
    list=normalize(list);
    if(!list.length)list=FALLBACK;
    items=list;
    const html=list.map(n=>{
      const title=esc(n.title);
      const href=esc(n.link);
      const source=esc(n.source);
      return `<a class="news-item" href="${href}" target="_blank" rel="noopener noreferrer" title="${source} — فتح الخبر">${title} <span class="news-source">— ${source}</span></a>`;
    }).join('');
    track.innerHTML=html+html;
    startTicker(viewport,track);
  }
  let ticker={x:0,half:0,last:0,paused:false,raf:0};
  function startTicker(viewport,track){
    cancelAnimationFrame(ticker.raf);
    ticker={x:0,half:0,last:performance.now(),paused:false,raf:0};
    const measure=()=>{
      ticker.half=track.scrollWidth/2;
      if(ticker.half){
        // Start at the right edge of the first copy so the first visible motion is left -> right.
        ticker.x=-ticker.half;
        track.style.setProperty('transform',`translate3d(${ticker.x}px,0,0)`,'important');
      }
    };
    const pause=()=>{ticker.paused=true;track.classList.add('hover-paused')};
    const resume=()=>{ticker.paused=false;ticker.last=performance.now();track.classList.remove('hover-paused')};
    viewport.onpointerenter=pause; viewport.onpointerleave=resume;
    viewport.onfocusin=pause; viewport.onfocusout=resume;
    window.addEventListener('resize',measure);
    requestAnimationFrame(measure); setTimeout(measure,120);
    const tick=now=>{
      const dt=Math.min(50,now-ticker.last); ticker.last=now;
      if(!ticker.paused&&ticker.half){
        ticker.x+=36*dt/1000;
        if(ticker.x>=0)ticker.x=-ticker.half;
        track.style.setProperty('transform',`translate3d(${ticker.x}px,0,0)`,'important');
      }
      ticker.raf=requestAnimationFrame(tick);
    };
    ticker.raf=requestAnimationFrame(tick);
  }
  async function refresh(){
    const live=await fetchLive();
    if(live.length)render(live);
    else if(!started)render(FALLBACK);
  }
  document.addEventListener('DOMContentLoaded',async()=>{
    if(started)return; started=true;
    // Show bundled current headlines immediately, then replace them with live Egyptian headlines.
    try{
      const r=await fetch('assets/news.json?ts='+Date.now(),{cache:'no-store'});
      if(r.ok){const j=await r.json();const local=normalize(Array.isArray(j)?j:j.items||[]);if(local.length)render(local.slice(0,14));}
    }catch(_){render(FALLBACK)}
    await refresh();
    clearInterval(timer); timer=setInterval(refresh,5*60*1000);
  });
})();
