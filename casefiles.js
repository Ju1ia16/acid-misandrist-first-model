// clock
function tick(){
    const n=new Date();
    const t=`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`;
    const el=document.getElementById('osClock');
    if(el) el.textContent=t;
  }
  tick(); setInterval(tick,10000);
  
  // boot
  const bootLines=[
    {t:'1-JAN-87     NEON CASE OS BOOTSTRAP',c:''},
    {t:'',c:''},
    {t:'[ OK ]  initializing bubble memory...',c:'ok'},
    {t:'[ OK ]  loading pink mainframe kernel',c:'ok'},
    {t:'[ OK ]  establishing secure database connection',c:'ok'},
    {t:'[ OK ]  identity module loaded',c:'ok'},
    {t:'[ OK ]  mood scanner calibrated',c:'ok'},
    {t:'[ OK ]  diva protocols engaged',c:'ok'},
    {t:'',c:''},
    {t:'me@neoncase:~$ launch neon_case_os --mode=secure',c:''},
    {t:'[ OK ]  welcome back, operator.',c:'ok cursor'},
  ];
  const bootEl=document.getElementById('bootText');
  const bootScreen=document.getElementById('bootScreen');
  
  (function runBoot(){
    let i=0;
    function next(){
      if(i>=bootLines.length){
        setTimeout(()=>{
          bootScreen.classList.add('fade');
          showScreen('formScreen');
          setTimeout(()=>bootScreen.style.display='none',700);
        },400);
        return;
      }
      const s=document.createElement('span');
      s.textContent=bootLines[i].t||'\u00a0';
      bootLines[i].c.split(' ').forEach(c=>c&&s.classList.add(c));
      bootEl.appendChild(s);
      i++;
      setTimeout(next,Math.random()*100+45);
    }
    next();
  })();
  
  function showScreen(id){
    document.querySelectorAll('.screen').forEach(s=>{
      s.classList.remove('active','visible');
    });
    const el=document.getElementById(id);
    el.classList.add('active');
    setTimeout(()=>el.classList.add('visible'),30);
  }
  
  // field selection
  let currentField='name';
  function selectField(f){
    currentField=f;
    document.querySelectorAll('.os-row').forEach(r=>r.classList.remove('selected'));
    const rows=['name','age','nodetype','mood','beliefs','skill','chaos'];
    const idx=rows.indexOf(f);
    if(idx>=0) document.querySelectorAll('.os-row')[idx].classList.add('selected');
    document.querySelectorAll('.field-input').forEach(el=>el.style.display='none');
    const inp=document.getElementById('input-'+f);
    if(inp) inp.style.display='block';
    // focus input inside
    const fi=inp && inp.querySelector('input, select');
    if(fi) setTimeout(()=>fi.focus(),50);
  }
  selectField('name');
  
  function updateStatus(field,val){
    const el=document.getElementById('status-'+field);
    if(!el) return;
    if(field==='nodetype'||field==='skill'||field==='chaos'){
      el.textContent=val;
    } else {
      el.textContent=val.trim() ? val.trim().substring(0,10)+(val.length>10?'…':'') : 'Empty';
    }
    drawPreview();
  }
  
  // ── PIXEL ART ──
  function drawKittyDots(ctx, W, H, color){
    // simplified sitting kitty as dot grid
    ctx.clearRect(0,0,W,H);
    const s=Math.floor(W/20);
    const grid=[
      '00000001100110000000',
      '00000011111111000000',
      '00000111011101110000',
      '00001111111111111000',
      '00011111111111111100',
      '00111101111111011110',
      '00111111111111111110',
      '00111101111111011110', // blink row (eyes)
      '00111111110111111110',
      '00011101100110011100',
      '00011111111111111100',
      '00001111111111111000',
      '00000111111111110000',
      '00000011111111100000',
      '00001111001100111100',
      '00011111001100111110',
      '00011110000000011110',
      '00001110000000001110',
      '00000000000000000000',
      '00000000000000000000',
    ];
    grid.forEach((row,ri)=>{
      [...row].forEach((cell,ci)=>{
        if(cell==='1'){
          const flicker=Math.random()>0.15;
          if(flicker){
            ctx.fillStyle=color;
            ctx.beginPath();
            ctx.arc(ci*s+s/2, ri*s+s/2, s*0.42, 0, Math.PI*2);
            ctx.fill();
          }
        }
      });
    });
    // whiskers
    const wc='rgba(255,20,147,0.5)';
    [[3,9],[3,10],[3,11]].forEach(([col,row])=>{
      ctx.fillStyle=wc;
      ctx.beginPath();
      ctx.arc(col*s+s/2,row*s+s/2,s*0.3,0,Math.PI*2);
      ctx.fill();
    });
    [[16,9],[16,10],[16,11]].forEach(([col,row])=>{
      ctx.fillStyle=wc;
      ctx.beginPath();
      ctx.arc(col*s+s/2,row*s+s/2,s*0.3,0,Math.PI*2);
      ctx.fill();
    });
  }
  
  function drawPreview(){
    const c=document.getElementById('previewCanvas');
    const ctx=c.getContext('2d');
    ctx.clearRect(0,0,80,80);
    drawKittyDots(ctx,80,80,'#ff1493');
  }
  drawPreview();
  
  // animate preview
  setInterval(drawPreview, 600);
  
  // ── UPLOAD ──
  function doUpload(){
    const name=document.getElementById('nameVal').value.trim();
    if(!name){ alert('// IDENTITY NAME REQUIRED'); selectField('name'); return; }
    const age=document.getElementById('ageVal').value.trim();
    const nodetype=document.getElementById('nodetypeVal').value;
    const mood=document.getElementById('moodVal').value.trim();
    const beliefs=document.getElementById('beliefsVal').value.trim();
    const skill=parseInt(document.getElementById('skillVal').value);
    const chaos=parseInt(document.getElementById('chaosVal').value);
    const id=Date.now().toString(36).toUpperCase();
    const now=new Date();
  
    // populate profile
    document.getElementById('profileName').textContent=name.toUpperCase();
    document.getElementById('profileType').textContent=nodetype;
    document.getElementById('profileAge').textContent=age||'UNKNOWN';
    document.getElementById('profileMood').textContent=mood||'UNDEFINED';
    document.getElementById('profileBelief').textContent=beliefs||'NULL';
    document.getElementById('profileDate').textContent=now.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase();
    document.getElementById('profileFooterDate').textContent=now.toLocaleString();
    document.getElementById('profileId').textContent=id;
    document.getElementById('profileBig').textContent=name.length>8?name.substring(0,8):name;
    document.getElementById('nodeDisplay').textContent=nodetype;
  
    // dot meters
    function dots(id,val,max=10){
      const el=document.getElementById(id);
      el.innerHTML='';
      for(let i=1;i<=max;i++){
        const s=document.createElement('span');
        s.textContent= i<=val ? '♥' : '♡';
        s.className = i<=val ? 'dot-on' : 'dot-off';
        s.style.fontSize='13px';
        el.appendChild(s);
      }
    }
    dots('skillDots',skill);
    dots('chaosDots',chaos);
  
    // waveform
    const wf=document.getElementById('waveform');
    wf.innerHTML='';
    for(let i=0;i<40;i++){
      const b=document.createElement('div');
      b.className='wave-bar';
      const h=4+Math.random()*28;
      b.style.height=h+'px';
      b.style.animationDelay=(i*0.05)+'s';
      b.style.animationDuration=(0.8+Math.random()*0.8)+'s';
      wf.appendChild(b);
    }
  
    // draw big profile art
    const c=document.getElementById('profileArt');
    const ctx=c.getContext('2d');
    drawKittyDots(ctx,160,160,'#ff1493');
    // animate it
    if(window._artInterval) clearInterval(window._artInterval);
    window._artInterval=setInterval(()=>drawKittyDots(ctx,160,160,'#ff1493'),500);
  
    showScreen('profileScreen');
  }
  
  function goBack(){
    if(window._artInterval) clearInterval(window._artInterval);
    showScreen('formScreen');
  }
