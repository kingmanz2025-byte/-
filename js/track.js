const result=document.getElementById("trackResult");
const form=document.getElementById("trackForm");
const input=document.getElementById("trackId");
const qp=new URLSearchParams(location.search);

function normalizeOrderId(v){
  return String(v||"").trim().toUpperCase().replace(/\s+/g,"");
}
function readOrders(){
  try{
    const raw=localStorage.getItem("tamween_orders");
    const orders=raw?JSON.parse(raw):[];
    return Array.isArray(orders)?orders:[];
  }catch(e){
    result.innerHTML=`<div class="empty">تعذر قراءة الطلبات محليًا. لو بتفتح الملفات مباشرة بـ file:// شغّل المشروع عبر Live Server.</div>`;
    return [];
  }
}
function statusText(s){return ({new:"جديد",reviewing:"قيد المراجعة",completed:"مكتمل",rejected:"مرفوض"})[s]||s;}
function renderOrder(o){
  result.innerHTML=`<div class="result-card">
    <div class="result-top"><div><span class="eyebrow">رقم الطلب</span><h2>${escapeHtml(o.id)}</h2></div><span class="status ${escapeHtml(o.status)}">${statusText(o.status)}</span></div>
    <div class="details-grid">
      <div><small>الخدمة</small><b>${escapeHtml(o.serviceName)}</b></div>
      <div><small>الاسم</small><b>${escapeHtml(o.fullName)}</b></div>
      <div><small>اسم الأم</small><b>${escapeHtml(o.motherName||"-")}</b></div>
      <div><small>المحافظة</small><b>${escapeHtml(o.governorate)}</b></div>
      <div><small>المركز / الحي</small><b>${escapeHtml(o.area||"-")}</b></div>
      <div><small>تاريخ التقديم</small><b>${new Date(o.createdAt).toLocaleString("ar-EG")}</b></div>
    </div>
    <div class="timeline"><span class="active">تم استلام الطلب</span><span class="${o.status!=="new"?"active":""}">المراجعة</span><span class="${o.status==="completed"?"active":""}">الانتهاء</span></div>
    ${o.demoFiles?.length?`<p class="muted">تم تسجيل ${o.demoFiles.length} مرفقًا في الوضع المحلي.</p>`:""}
  </div>`;
}
function searchOrder(id){
  const wanted=normalizeOrderId(id);
  if(!wanted){result.innerHTML=`<div class="empty">اكتب رقم الطلب أولًا.</div>`;return;}
  const all=readOrders();
  const o=all.find(x=>normalizeOrderId(x.id)===wanted);
  if(o){
    renderOrder(o);
    return;
  }
  const lastId=normalizeOrderId(localStorage.getItem("last_order_id"));
  if(lastId===wanted){
    try{
      const last=JSON.parse(localStorage.getItem("last_order")||"null");
      if(last && normalizeOrderId(last.id)===wanted){renderOrder(last);return;}
    }catch(e){}
  }
  result.innerHTML=`<div class="empty">لم يتم العثور على طلب بهذا الرقم على هذا الجهاز/المتصفح.</div>`;
}
form.addEventListener("submit",e=>{e.preventDefault();searchOrder(input.value);});

const initial=qp.get("id")||localStorage.getItem("last_order_id")||"";
if(initial){input.value=initial;searchOrder(initial);}
