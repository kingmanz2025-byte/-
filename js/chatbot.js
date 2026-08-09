document.addEventListener("DOMContentLoaded",()=>{
  const b=document.getElementById("chatbotLaunch"),p=document.getElementById("chatbotPanel"),c=document.getElementById("chatbotClose"),m=document.getElementById("chatbotMessages"),f=document.getElementById("chatbotForm"),i=document.getElementById("chatbotInput");
  if(!b||!p||!m||!f||!i)return;
  const norm=x=>String(x||"").toLowerCase().replace(/[أإآٱ]/g,"ا").replace(/[ةۀ]/g,"ه").replace(/ى/g,"ي").replace(/ؤ/g,"و").replace(/ئ/g,"ي").replace(/[\u064B-\u065F\u0670]/g,"");
  const faq=[
    ["الخدمات","الخدمات المتاحة حاليًا: إصدار بطاقة جديدة، ضم الزوجة، نقل البطاقة، بدل تالف، بدل فاقد، وضم الأبناء. وتحديث بيانات من تم حذفهم من التموين قريبًا."],
    ["ضم الزوجة","مطلوب: بطاقة الزوج وجه وظهر + بطاقة الزوجة وجه وظهر + رقم تليفون الزوج، بدون تكرار طلب بطاقة الرقم القومي لصاحب الطلب."],
    ["ضم الابناء","مطلوب: شهادات ميلاد الأبناء + بطاقة الأم وجه وظهر، مع بيانات الطلب الأساسية."],
    ["تحديث","خدمة تحديث بيانات بطاقة التموين لمن تم حذفهم من التموين: قريبًا."],
    ["المحافظه","يمكنك اختيار المحافظة والمنطقة من القوائم، أو اكتب اسم المحافظة أو المنطقة في البحث الذكي وسيحاول الموقع الاختيار تلقائيًا."],
    ["منطقه","يمكنك كتابة اسم المنطقة أو أول حرف/حرفين. وإذا لم تكن موجودة اختر أخرى / غير مدرجة واكتب الاسم."],
    ["متابعه","ادخل صفحة متابعة الطلب واكتب رقم الطلب لمعرفة آخر حالة مسجلة."],
    ["مستندات","كل خدمة تعرض المستندات المطلوبة، وضم الزوجة وضم الأبناء لهما متطلبات مستقلة."],
  ];
  const add=(t,k)=>{const d=document.createElement("div");d.className="chat-msg "+k;d.textContent=t;m.appendChild(d);m.scrollTop=m.scrollHeight};
  const open=()=>{p.classList.add("open");b.setAttribute("aria-expanded","true");if(!m.children.length)add("أهلاً بيك 👋 أنا المساعد بتاعك في خدمات التموين. اسألني أي سؤال، وأنا معاك. اكتب سؤالك هنا وأنا هساعدك.","bot");setTimeout(()=>i.focus(),80)};
  b.onclick=()=>p.classList.contains("open")?p.classList.remove("open"):open();
  c.onclick=()=>{p.classList.remove("open");b.setAttribute("aria-expanded","false")};
  f.onsubmit=e=>{e.preventDefault();const q=i.value.trim();i.value="";if(!q)return;add(q,"user");const x=norm(q);const hit=faq.find(a=>x.includes(norm(a[0])));setTimeout(()=>add(hit?hit[1]:"أنا جاهز أساعدك. جرّب تسألني عن الخدمات، ضم الزوجة، ضم الأبناء، المستندات، المحافظات والمناطق، أو متابعة الطلب.","bot"),220)};
});