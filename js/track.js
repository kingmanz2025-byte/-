const result=document.getElementById("trackResult");
const form=document.getElementById("trackForm");
const input=document.getElementById("trackId");
const qp=new URLSearchParams(location.search); if(qp.get("id"))input.value=qp.get("id");

function statusText(s){return ({new:"جديد",reviewing:"قيد المراجعة",completed:"مكتمل",rejected:"مرفوض"})[s]||s;}
function renderOrder(o){
  result.innerHTML=`<div class="result-card">
    <div class="result-top"><div><span class="eyebrow">رقم الطلب</span><h2>${escapeHtml(o.id)}</h2></div><span class="status ${escapeHtml(o.status)}">${statusText(o.status)}</span></div>
    <div class="details-grid">
      <div><small>الخدمة</small><b>${escapeHtml(o.serviceName)}</b></div>
      <div><small>الاسم</small><b>${escapeHtml(o.fullName)}</b></div><div><small>اسم الأم</small><b>${escapeHtml(o.motherName||"-")}</b></div>
      <div><small>المحافظة</small><b>${escapeHtml(o.governorate)}</b></div><div><small>المركز / الحي</small><b>${escapeHtml(o.area||"-")}</b></div>
      <div><small>تاريخ التقديم</small><b>${new Date(o.createdAt).toLocaleString("ar-EG")}</b></div>
    </div>
    <div class="timeline"><span class="active">تم استلام الطلب</span><span class="${o.status!=="new"?"active":""}">المراجعة</span><span class="${o.status==="completed"?"active":""}">الانتهاء</span></div>
    ${o.demoFiles?.length?`<p class="muted">تم إرفاق ${o.demoFiles.length} ملف.</p>`:""}
  </div>`;
}
form.addEventListener("submit",e=>{
  e.preventDefault();
  const id=input.value.trim().toUpperCase();
  const all=JSON.parse(localStorage.getItem("tamween_orders")||"[]");
  const o=all.find(x=>x.id===id);
  if(o) renderOrder(o); else result.innerHTML=`<div class="empty">لم يتم العثور على طلب بهذا الرقم.</div>`;
});
if(input.value) form.dispatchEvent(new Event("submit"));