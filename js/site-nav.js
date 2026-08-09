(()=>{
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('.nav-dropdown').forEach(drop=>{
      const link=drop.querySelector('.nav-services-link');
      if(!link)return;
      link.addEventListener('click',e=>{
        if(window.matchMedia('(max-width:700px)').matches){
          if(!drop.classList.contains('open')){e.preventDefault();drop.classList.add('open');}
        }
      });
      document.addEventListener('click',e=>{if(!drop.contains(e.target))drop.classList.remove('open')});
    });
  });
})();
