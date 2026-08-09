let siteInfoInitialized=false;
document.addEventListener("DOMContentLoaded",()=>{
  if(siteInfoInitialized||document.querySelector(".site-info-bar"))return;
  siteInfoInitialized=true;
  const x=document.createElement("div");
  x.className="site-info-bar";
  x.innerHTML=`<div class="site-info-inner"><span>🇪🇬 مصر</span><span>🕐 <b id="egTime">--</b></span><span>📅 <b id="gregDate">--</b></span><span>🌙 <b id="hijriDate">--</b></span><span>👁️ <b id="visitorCount">0</b> زائر</span></div>`;
  document.body.prepend(x);

  const tick=()=>{
    const d=new Date();
    const timeEl=document.getElementById("egTime"),gregEl=document.getElementById("gregDate"),hijriEl=document.getElementById("hijriDate");
    if(timeEl)timeEl.textContent=new Intl.DateTimeFormat("ar-EG",{timeZone:"Africa/Cairo",hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:true}).format(d);
    if(gregEl)gregEl.textContent=new Intl.DateTimeFormat("ar-EG",{timeZone:"Africa/Cairo",year:"numeric",month:"long",day:"numeric"}).format(d);
    if(hijriEl){try{hijriEl.textContent=new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura",{timeZone:"Africa/Cairo",year:"numeric",month:"long",day:"numeric"}).format(d)}catch(e){hijriEl.textContent=""}}
  };
  tick(); setInterval(tick,1000);

  const k="tamween_visits_v16_local";
  const n=Number(localStorage.getItem(k)||0)+1;
  localStorage.setItem(k,String(n));
  const visitor=document.getElementById("visitorCount");
  if(visitor)visitor.textContent=n.toLocaleString("ar-EG");
});
