const loginPanel=document.getElementById("loginPanel"), dashboard=document.getElementById("dashboard");
const ADMIN_USERNAME="Mohamed";
const ADMIN_PASSWORD="Med@7111992";
let orders=[];

function loggedIn(){return sessionStorage.getItem("tamween_admin")==="1";}
function showDash(){loginPanel.classList.add("hidden");dashboard.classList.remove("hidden");loadOrders();}
function loadOrders(){
  orders=JSON.parse(localStorage.getItem("tamween_orders")||"[]");
  renderStats(); renderTable();
}
function renderStats(){
  const counts={all:orders.length,new:0,reviewing:0,completed:0,rejected:0};
  orders.forEach(o=>counts[o.status]=(counts[o.status]||0)+1);
  document.getElementById("stats").innerHTML=`
  <div><b>${counts.all}</b><span>كل الطلبات</span></div>
  <div><b>${counts.new}</b><span>جديد</span></div>
  <div><b>${counts.reviewing}</b><span>قيد المراجعة</span></div>
  <div><b>${counts.completed}</b><span>مكتمل</span></div>`;
}
function renderTable(){
  const q=(document.getElementById("searchOrders").value||"").toLowerCase();
  const sf=document.getElementById("statusFilter").value;
  const filtered=orders.filter(o=>(!sf||o.status===sf)&&(!q||[o.id,o.fullName,o.phone].join(" ").toLowerCase().includes(q)));
  document.getElementById("ordersBody").innerHTML=filtered.map(o=>`<tr>
    <td><b>${escapeHtml(o.id)}</b></td><td>${escapeHtml(o.serviceName)}</td><td>${escapeHtml(o.fullName)}</td>
    <td>${escapeHtml(o.governorate)}</td><td>${new Date(o.createdAt).toLocaleDateString("ar-EG")}</td>
    <td><select class="status-select" data-id="${escapeHtml(o.id)}"><option value="new" ${o.status==="new"?"selected":""}>جديد</option><option value="reviewing" ${o.status==="reviewing"?"selected":""}>قيد المراجعة</option><option value="completed" ${o.status==="completed"?"selected":""}>مكتمل</option><option value="rejected" ${o.status==="rejected"?"selected":""}>مرفوض</option></select></td>
    <td><button class="small-btn" data-view="${escapeHtml(o.id)}">عرض</button></td></tr>`).join("")||`<tr><td colspan="7" class="empty">لا توجد طلبات.</td></tr>`;
}
function showDetails(id){
  const o=orders.find(x=>x.id===id); if(!o)return;
  document.getElementById("detailsContent").innerHTML=`<span class="eyebrow">${escapeHtml(o.id)}</span><h2>${escapeHtml(o.serviceName)}</h2>
  <div class="details-grid">
  <div><small>الاسم</small><b>${escapeHtml(o.fullName)}</b></div><div><small>اسم الأم</small><b>${escapeHtml(o.motherName||"-")}</b></div><div><small>تليفون الزوج</small><b>${escapeHtml(o.husbandPhone||"-")}</b></div><div><small>هاتف مقدم الطلب</small><b>${escapeHtml(o.phone||"-")}</b></div>
  <div><small>الرقم القومي</small><b>${escapeHtml(o.nationalId)}</b></div><div><small>المحافظة</small><b>${escapeHtml(o.governorate)}</b></div><div><small>المركز / الحي</small><b>${escapeHtml(o.area||"-")}</b></div>
  <div><small>المنطقة</small><b>${escapeHtml(o.area)}</b></div><div><small>رقم البطاقة</small><b>${escapeHtml(o.cardNumber||"-")}</b></div></div>
  <div class="detail-note"><b>ملاحظات</b><p>${escapeHtml(o.notes||"لا توجد")}</p></div>
  <div class="detail-note"><b>المرفقات</b><p>${o.demoFiles?.length?o.demoFiles.map(f=>`📎 ${escapeHtml(f.name)}`).join("<br>"):"لا توجد مرفقات في وضع التجربة."}</p></div>`;
  document.getElementById("orderDetails").classList.remove("hidden");
}
document.getElementById("loginBtn").onclick=()=>{
  const e=document.getElementById("adminUsername").value,p=document.getElementById("adminPassword").value;
  if(e===ADMIN_USERNAME&&p===ADMIN_PASSWORD){sessionStorage.setItem("tamween_admin","1");showDash();}
  else showMessage(document.getElementById("loginMsg"),"بيانات الدخول غير صحيحة.","error");
};
document.getElementById("logoutBtn").onclick=()=>{sessionStorage.removeItem("tamween_admin");location.reload();};
document.getElementById("closeModal").onclick=()=>document.getElementById("orderDetails").classList.add("hidden");
document.getElementById("searchOrders").oninput=renderTable; document.getElementById("statusFilter").onchange=renderTable;
document.getElementById("ordersBody").onclick=e=>{const id=e.target.dataset.view;if(id)showDetails(id);};
document.getElementById("ordersBody").onchange=e=>{
  if(!e.target.dataset.id)return;
  const id=e.target.dataset.id,o=orders.find(x=>x.id===id);o.status=e.target.value;
  localStorage.setItem("tamween_orders",JSON.stringify(orders));renderStats();renderTable();
};
if(loggedIn())showDash();