const params=new URLSearchParams(location.search);
const selectedId=params.get("service")||"new-card";
const selectedService=serviceById(selectedId)||SERVICES[0];
const $=id=>document.getElementById(id);
const isAddWife=selectedId==="add-wife";
const isChildren=selectedId==="children";

function showMessage(el,text,type="success"){if(!el)return;el.textContent=text;el.className=`form-message ${type}`;}

function escapeHtml(v){
  return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}

document.addEventListener("DOMContentLoaded",()=>{
  const form=$("requestForm");
  if(!form)return;

  $("serviceId").value=selectedId;
  $("serviceHeader").innerHTML=`<span class="eyebrow">${selectedService.icon||"🧾"} تقديم طلب</span><h1>${escapeHtml(selectedService.title||"طلب خدمة")}</h1><p>${escapeHtml(selectedService.desc||"")}</p>`;

  $("wifeSection")?.classList.toggle("hidden",!isAddWife);
  $("childrenSection")?.classList.toggle("hidden",!isChildren);

  // لا نطلب رفع بطاقة الرقم القومي لصاحب الطلب في ضم الزوجة أو ضم الأبناء.
  $("idSection")?.classList.toggle("hidden",isAddWife||isChildren);

  const husbandPhone=$("husbandPhone");
  if(husbandPhone){
    husbandPhone.required=isAddWife;
    husbandPhone.closest("label")?.classList.toggle("service-hidden-field",!isAddWife);
  }

  // HTML required attributes are adjusted per service before browser validation.
  const nationalId=$("nationalId");
  const idFront=$("idFront");
  const idBack=$("idBack");
  const needsOwnerId=!isAddWife&&!isChildren;
  if(nationalId){
    nationalId.required=needsOwnerId;
    nationalId.closest("label")?.classList.toggle("service-hidden-field",!needsOwnerId);
  }
  if(idFront)idFront.required=needsOwnerId;
  if(idBack)idBack.required=needsOwnerId;

  if(isAddWife){
    ["husbandName","wifeName","husbandIdFront","husbandIdBack","wifeIdFront","wifeIdBack"].forEach(id=>{
      const e=$(id); if(e)e.required=true;
    });
  }

  if(isChildren){
    ["motherIdFront","motherIdBack","childrenHusbandIdFront","childrenHusbandIdBack","birthCerts"].forEach(id=>{
      const e=$(id); if(e)e.required=true;
    });
  }

  function missing(){
    const m=[];
    [
      ["fullName","اسم صاحب الطلب"],
      ["motherName","اسم الأم"],
      ["governorate","المحافظة"],
      ["area","المنطقة"]
    ].forEach(([id,label])=>{
      const e=$(id);
      if(!e?.value?.trim())m.push(label);
    });

    if($("area")?.value==="__other__" && !$("otherArea")?.value?.trim())m.push("اسم المنطقة غير المدرجة");

    if(isAddWife){
      if(!husbandPhone?.value?.trim())m.push("رقم تليفون الزوج");
      [
        ["husbandName","اسم الزوج"],
        ["wifeName","اسم الزوجة"],
        ["husbandIdFront","بطاقة الزوج وجه"],
        ["husbandIdBack","بطاقة الزوج ظهر"],
        ["wifeIdFront","بطاقة الزوجة وجه"],
        ["wifeIdBack","بطاقة الزوجة ظهر"]
      ].forEach(([id,label])=>{
        const e=$(id);
        if(!e?.value?.trim() && !e?.files?.length)m.push(label);
      });
    }else if(isChildren){
      [
        ["motherIdFront","بطاقة الأم وجه"],
        ["motherIdBack","بطاقة الأم ظهر"],
        ["childrenHusbandIdFront","بطاقة الزوج وجه"],
        ["childrenHusbandIdBack","بطاقة الزوج ظهر"],
        ["birthCerts","شهادات ميلاد الأبناء"]
      ].forEach(([id,label])=>{
        const e=$(id);
        if(!e?.files?.length)m.push(label);
      });
    }else{
      if(!$("nationalId")?.value?.trim())m.push("الرقم القومي");
      if(!$("idFront")?.files?.length)m.push("بطاقة صاحب الطلب وجه");
      if(!$("idBack")?.files?.length)m.push("بطاقة صاحب الطلب ظهر");
    }
    return [...new Set(m)];
  }

  $("validationClose").onclick=()=>$("validationModal").classList.add("hidden");

  form.addEventListener("submit",e=>{
    e.preventDefault();
    const missingFields=missing();
    if(missingFields.length){
      $("validationList").innerHTML=missingFields.map(x=>`<li>${escapeHtml(x)}</li>`).join("");
      $("validationModal").classList.remove("hidden");
      return;
    }

    const order={
      id:"TM-"+Math.floor(100000+Math.random()*900000),
      serviceId:selectedId,
      serviceName:selectedService.title,
      fullName:$("fullName").value.trim(),
      motherName:$("motherName").value.trim(),
      phone:$("phone").value.trim(),
      husbandPhone:husbandPhone?.value.trim()||"",
      nationalId:$("nationalId").value.trim(),
      governorate:$("governorate").value.trim(),
      area:$("area").value==="__other__"?($("otherArea")?.value.trim()||"أخرى / غير مدرجة"):$("area").value.trim(),
      createdAt:new Date().toISOString(),
      status:"new"
    };

    const all=JSON.parse(localStorage.getItem("tamween_orders")||"[]");
    all.unshift(order);
    localStorage.setItem("tamween_orders",JSON.stringify(all));
    localStorage.setItem("last_order_id",order.id);
    showMessage($("formMessage"),`تم تسجيل الطلب تجريبيًا. رقم الطلب: ${order.id}`,"success");
  });
});
