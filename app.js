const SURL='https://yygjkqkzbdjnyyrrhdku.supabase.co';
const SKEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5Z2prcWt6YmRqbnl5cnJoZGt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwMjgyNTcsImV4cCI6MjA5MzYwNDI1N30.6mJTBhjWphURBnFefQziVreQW8WjYJLAAjMx6Sv-Kfk';
const RESEND_KEY='re_NbpuzGhW_N5WRkmwF68SZ12yEy3q9Z7m9';
const ADMIN_EMAIL='deofortistutors@gmail.com';
const sb=window.supabase.createClient(SURL,SKEY);
let pkgsLoaded=false;

async function sendAdminEmail(subject,body){
  try{
    await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+RESEND_KEY},
      body:JSON.stringify({from:'Deo Fortis <onboarding@resend.dev>',to:ADMIN_EMAIL,subject,html:body})
    });
  }catch(e){console.log('Email error:',e);}
}

let S={page:'landing',user:null,profile:null};
function go(p){S.page=p;render();}

sb.auth.getSession().then(({data:{session}})=>{if(session){S.user=session.user;getProfile(session.user.id);}});
sb.auth.onAuthStateChange((_,session)=>{if(session){S.user=session.user;getProfile(session.user.id);}else{S.user=null;S.profile=null;go('landing');}});

async function getProfile(id){
  const{data}=await sb.from('profiles').select('*').eq('id',id).single();
  if(data){S.profile=data;go(data.status==='approved'?'dashboard':'pending');}
}

function h(tag,attr,kids){
  const e=document.createElement(tag);
  if(attr)Object.entries(attr).forEach(([k,v])=>{
    if(k==='cls')e.className=v;
    else if(k==='html')e.innerHTML=v;
    else if(k==='style'&&typeof v==='object')Object.assign(e.style,v);
    else if(k.startsWith('on'))e.addEventListener(k.slice(2),v);
    else e[k]=v;
  });
  if(kids)kids.filter(Boolean).forEach(k=>e.append(typeof k==='string'||typeof k==='number'?document.createTextNode(String(k)):k));
  return e;
}
function div(a,k){return h('div',a,k);}
function btn(text,cls,onclick,extra){const b=h('button',{cls:'btn '+cls,onclick,...extra},[text]);return b;}
function inp(ph,type='text',val=''){const i=h('input',{cls:'input',placeholder:ph,type,value:val});return i;}
function fmtMS(s){return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function fmtHMS(s){return String(Math.floor(s/3600)).padStart(2,'0')+':'+String(Math.floor((s%3600)/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');}
function lbl(text){return h('label',{cls:'label',html:text});}
function field(labelText,inputEl,mb='mb-16'){const w=div({style:{marginBottom:mb==='mb-16'?'16px':'20px'}});w.append(lbl(labelText),inputEl);return w;}

function render(){
  const root=document.getElementById('root');
  root.innerHTML='';
  const pages={landing,signup,login,pending,dashboard,study,flashcards,vignette,leaderboard,admin};
  root.append((pages[S.page]||landing)());
}

// ═══════════════════════════════
// LANDING
// ═══════════════════════════════
function landing(){
  const page=div({});
  let scrolled=false;
  let cfg={video:'',links:{monthly:'#',sixmonth:'#',yearly:'#'},testimonials:[],packages:[]};

  const nav=div({cls:'top-nav',id:'tnav'});
  nav.append(
    div({cls:'logo',html:'Deo Fortis'}),
    div({style:{display:'flex',gap:'32px',alignItems:'center'}},[
      h('a',{cls:'nav-link',href:'#plans',html:'Plans'}),
      h('a',{cls:'nav-link',href:'#tutoring',html:'Tutoring'}),
      btn('Log In','btn-outline',()=>go('login'),{style:{padding:'8px 18px'}}),
    ])
  );
  window.onscroll=()=>{const s=window.scrollY>60;if(s!==scrolled){scrolled=s;nav.classList.toggle('scrolled',s);}};
  page.append(nav);

  // HERO
  const hero=div({cls:'section fade',style:{minHeight:'100vh',display:'flex',flexDirection:'column',justifyContent:'center',paddingTop:'140px',position:'relative'}});
  const shelf=div({style:{position:'absolute',top:'100px',right:'0',opacity:'.1',display:'flex',alignItems:'flex-end',gap:'3px',borderBottom:'4px solid #3A3020'}});
  [{h:160,w:22,c:'#8B4513'},{h:200,w:30,c:'#2F4F4F'},{h:140,w:18,c:'#8B0000'},{h:185,w:26,c:'#4B0082'},{h:220,w:34,c:'#556B2F'},{h:150,w:20,c:'#8B6914'},{h:175,w:28,c:'#1C3A5E'},{h:130,w:16,c:'#6B3A2A'},{h:195,w:24,c:'#2E4A1E'},{h:210,w:32,c:'#4A1942'}].forEach(b=>shelf.append(div({style:{height:b.h+'px',width:b.w+'px',background:b.c,borderRadius:'2px 2px 0 0'}})));
  hero.append(shelf);
  const hc=div({style:{position:'relative',zIndex:'1'}});
  hc.append(
    h('span',{cls:'chapter',html:'— A Premium Study Platform —'}),
    h('h1',{cls:'big',html:'Study with<br><em class="gold-em">Deo Fortis!</em>'}),
    h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'28px 0',maxWidth:'480px'}}),
    h('p',{cls:'muted',style:{fontSize:'16px',lineHeight:'1.8',maxWidth:'520px'},html:'A structured, evidence-based study system built for students who are done making excuses and ready to actually retain what they learn.'})
  );
  const hbtns=div({style:{display:'flex',gap:'16px',marginTop:'32px',flexWrap:'wrap',alignItems:'center'}});
  hbtns.append(h('a',{cls:'btn btn-gold',href:'#plans',html:'View Plans →'}));
  const vbtn=div({style:{display:'inline-flex',alignItems:'center',gap:'10px',padding:'12px 24px',border:'1px solid var(--border)',borderRadius:'2px',fontFamily:"'DM Mono',monospace",fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)',cursor:'pointer'}});
  vbtn.append(div({style:{width:'24px',height:'24px',borderRadius:'50%',border:'1px solid var(--dim)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'10px',color:'var(--gold)',html:'▶'}}),document.createTextNode('Watch Demo (Optional)'));
  vbtn.onclick=()=>showVidModal(cfg.video);
  hbtns.append(vbtn);
  hc.append(hbtns);
  const stats=div({style:{display:'flex',gap:'48px',marginTop:'56px',flexWrap:'wrap'}});
  [['3','Recall Formats'],['100%','Full Access'],['∞','Sessions']].forEach(([n,l])=>{
    const s=div({style:{borderLeft:'2px solid var(--border)',paddingLeft:'16px'}});
    s.append(div({style:{fontFamily:"'Playfair Display',serif",fontSize:'36px',color:'var(--gold)',lineHeight:'1',fontWeight:'700'},html:n}),div({cls:'mono',style:{marginTop:'6px'},html:l}));
    stats.append(s);
  });
  hc.append(stats);
  hero.append(hc);
  page.append(hero);

  const features=['Full Pomodoro System','Active Recall Engine (Theory, Anki, Vignette)','Request Recall Sessions Anytime','Personalised Study Timetable','Clock In / Clock Out Tracking','Leaderboard Access','Community Access','Accountability System','Admin-Curated Content','Study Analytics'];

  // PLANS
  const plansSection=div({cls:'section',id:'plans'});
  plansSection.append(div({cls:'divider'}),h('br'),h('span',{cls:'chapter',html:'Chapter I — Enrollment'}),h('h2',{cls:'big',style:{marginBottom:'12px'},html:'Choose Your<br><em class="gold-em">Duration</em>'}),h('p',{cls:'muted',style:{maxWidth:'500px',fontSize:'15px',marginBottom:'8px'},html:'Every plan includes the full platform. You are simply choosing how long your access lasts.'}),div({cls:'quote',style:{maxWidth:'480px',marginBottom:'40px',marginTop:'24px'},html:'"The longer you commit, the less you pay per month."'}));
  const plansGrid=div({cls:'grid-auto',id:'plans-grid'});
  const planDefs=[{name:'Monthly',price:'$10',period:'/ month',dur:'1 Month',color:'var(--gold)',key:'monthly'},{name:'6 Months',price:'$39',period:'/ 6 months',dur:'6 Months',color:'var(--teal)',popular:true,key:'sixmonth'},{name:'1 Year',price:'$59',period:'/ year',dur:'12 Months',color:'var(--purple)',key:'yearly'}];
  planDefs.forEach(plan=>{
    const card=div({cls:'plan-card',style:{borderColor:plan.popular?plan.color+'55':'var(--border)',borderTopWidth:plan.popular?'3px':'1px',borderTopColor:plan.popular?plan.color:'var(--border)'}});
    if(plan.popular)card.append(div({cls:'popular-tag',html:'Best Value'}));
    card.append(div({cls:'mono',style:{marginBottom:'8px',marginTop:plan.popular?'16px':'0'},html:plan.name}));
    card.append(div({style:{display:'flex',alignItems:'baseline',gap:'6px',marginBottom:'4px'}},[h('span',{style:{fontFamily:"'Playfair Display',serif",fontSize:'52px',color:plan.color,lineHeight:'1',fontWeight:'700'},html:plan.price}),h('span',{style:{fontSize:'14px',color:'var(--dim)',fontWeight:'300'},html:plan.period})]));
    card.append(div({style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:plan.color,letterSpacing:'1px',marginBottom:'24px',opacity:'.8'},html:plan.dur+' of full access'}));
    card.append(h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',marginBottom:'20px'}}));
    const fl=div({style:{marginBottom:'28px'}});
    features.forEach(f=>{const item=div({cls:'check-item'});item.append(h('span',{style:{color:plan.color,fontSize:'12px',marginTop:'2px',flexShrink:'0'},html:'✦'}),h('span',{},[f]));fl.append(item);});
    card.append(fl);
    const eb=h('a',{cls:'btn btn-gold',style:{background:plan.color,color:'#0F0E0A',width:'100%',textAlign:'center',display:'block'},html:'Enroll — '+plan.price,id:'enroll-'+plan.key});
    eb.href='#';
    eb.onclick=e=>{e.preventDefault();showEnrollModal(plan,cfg.links[plan.key]||'#');};
    card.append(eb);
    card.append(h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)',textAlign:'center',marginTop:'12px',letterSpacing:'1px',textTransform:'uppercase'},html:'Click Enroll → Create account → Pay on Selar'}));
    plansGrid.append(card);
  });
  plansSection.append(plansGrid);
  page.append(plansSection);

  // TUTORING
  const tutSection=div({cls:'section',id:'tutoring'});
  tutSection.append(div({cls:'divider'}),h('br'),h('span',{cls:'chapter',html:'Chapter II — Personal Tutoring'}),h('h2',{cls:'big',style:{marginBottom:'12px'},html:'Work With Me<br><em class="gold-em">Directly</em>'}),h('p',{cls:'muted',style:{maxWidth:'500px',fontSize:'15px',marginBottom:'8px'},html:'Personal tutoring packages include full access to the study portal.'}),div({cls:'quote',style:{maxWidth:'480px',marginBottom:'40px',marginTop:'24px'},html:'"One-on-one guidance accelerates everything."'}));
  tutSection.append(div({cls:'grid-auto',id:'pkg-grid'}));
  page.append(tutSection);

  // WHY
  const whySection=div({cls:'section',id:'why'});
  whySection.append(div({cls:'divider'}),h('br'),h('span',{cls:'chapter',html:'Chapter III — The Method'}),h('h2',{cls:'big',style:{marginBottom:'12px'},html:"What You'll<br><em class='gold-em'>Actually Get</em>"}),h('p',{cls:'muted',style:{maxWidth:'520px',fontSize:'15px',marginBottom:'40px'},html:'This is not a list of features. This is a study system built for results.'}));
  const rg=div({cls:'grid-auto'});
  [{icon:'🍅',title:'Pomodoro Technique',desc:'Structured sessions built around proven time management. Work hard, rest smart, repeat.'},{icon:'🧠',title:'Active Recall Sessions',desc:'Request a recall session anytime. Theory, Anki-style, or vignette — you choose the format.'},{icon:'📅',title:'Study Timetable',desc:'Get a personalised follow-up timetable built around your goals and weak areas.'},{icon:'🏆',title:'Leaderboard',desc:'Compete with other students. Rankings based on real study hours logged.'},{icon:'👥',title:'Community',desc:'You are not studying alone. Be part of a group that holds each other accountable.'},{icon:'✅',title:'Accountability',desc:'Clock in. Clock out. Your real study hours tracked. No lying to yourself.'}].forEach(r=>{
    const card=div({cls:'reason-card'});
    card.append(div({style:{fontSize:'28px',marginBottom:'14px'},html:r.icon}),h('h3',{style:{fontFamily:"'Playfair Display',serif",fontWeight:'600',fontSize:'17px',marginBottom:'8px',color:'var(--text)'},html:r.title}),h('p',{style:{fontSize:'14px',color:'#6A6050',lineHeight:'1.7',fontWeight:'300'},html:r.desc}));
    rg.append(card);
  });
  whySection.append(rg);
  page.append(whySection);

  // TESTIMONIALS
  const tsSection=div({cls:'section',id:'ts-section',style:{display:'none'}});
  tsSection.append(div({cls:'divider'}),h('br'),h('span',{cls:'chapter',html:'Chapter IV — Results'}),h('h2',{cls:'big',style:{marginBottom:'40px'},html:"What Students<br><em class='gold-em'>Are Saying</em>"}),div({cls:'grid-auto',id:'ts-grid'}));
  page.append(tsSection);

  // HOW
  const howSection=div({cls:'section'});
  howSection.append(div({cls:'divider'}),h('br'),h('span',{cls:'chapter',html:'Chapter V — The Process'}),h('h2',{cls:'big',style:{marginBottom:'40px'},html:"How to<br><em class='gold-em'>Get Started</em>"}));
  const hg=div({style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',borderTop:'1px solid var(--border)',borderLeft:'1px solid var(--border)'}});
  [{num:'I',title:'Choose a Plan',desc:'Pick the duration that works for you.'},{num:'II',title:'Pay via Selar',desc:'Complete your payment securely. Takes about 2 minutes.'},{num:'III',title:'Get Approved',desc:'Your payment is verified and account approved.'},{num:'IV',title:'Begin Studying',desc:'Log in and start your first session.'}].forEach(step=>{
    const s=div({style:{padding:'32px 28px',borderRight:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}});
    s.append(div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'48px',color:'var(--border)',lineHeight:'1',marginBottom:'16px'},html:step.num}),h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'17px',color:'var(--text)',marginBottom:'8px',fontWeight:'600'},html:step.title}),h('p',{style:{fontSize:'14px',color:'#6A6050',lineHeight:'1.7',fontWeight:'300'},html:step.desc}));
    hg.append(s);
  });
  howSection.append(hg);
  page.append(howSection);

  // FOOTER
  const footer=div({style:{borderTop:'1px solid var(--border)',padding:'48px',textAlign:'center'}});
  footer.append(div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'28px',color:'var(--gold)',marginBottom:'10px'},html:'Deo Fortis'}),div({style:{color:'var(--gold)',opacity:'.4',letterSpacing:'8px',marginBottom:'12px'},html:'✦ ✦ ✦'}),h('p',{style:{fontSize:'14px',color:'var(--dim)',fontWeight:'300'},html:'Study with purpose. Results follow.'}),btn('Admin','',()=>go('admin'),{style:{background:'none',border:'none',color:'var(--muted)',fontSize:'11px',marginTop:'24px',fontFamily:"'DM Mono',monospace",letterSpacing:'2px',textTransform:'uppercase'}}));
  page.append(footer);

  // Load data
  (async()=>{
    const{data:s}=await sb.from('admin_settings').select('*').single();
    if(s){cfg.video=s.video_url||'';cfg.links={monthly:s.link_monthly||'#',sixmonth:s.link_sixmonth||'#',yearly:s.link_yearly||'#'};
      planDefs.forEach(p=>{const b=document.getElementById('enroll-'+p.key);if(b)b.href=cfg.links[p.key]||'#';});
    }
    const{data:pkgs}=await sb.from('tutoring_packages').select('*').order('id');
    const pg=document.getElementById('pkg-grid');
    if(pg&&pkgs&&pkgs.length&&!pkgsLoaded){pkgsLoaded=true;pkgs.forEach((pkg,i)=>{
      const card=div({cls:'plan-card',style:{borderTopWidth:'3px',borderTopColor:i===0?'var(--gold)':'var(--purple)',borderColor:i===0?'#C8A96E33':'#A89BC833'}});
      card.append(div({cls:'mono',style:{marginBottom:'8px'},html:pkg.name}),div({style:{fontFamily:"'Playfair Display',serif",fontSize:'48px',color:i===0?'var(--gold)':'var(--purple)',lineHeight:'1',fontWeight:'700',marginBottom:'8px'},html:pkg.price}),div({style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:i===0?'var(--gold)':'var(--purple)',letterSpacing:'1px',marginBottom:'24px',opacity:'.8'},html:pkg.sessions}),h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',marginBottom:'20px'}}));
      const fl=div({style:{marginBottom:'28px'}});
      (pkg.features||'').split(',').forEach(f=>{const item=div({cls:'check-item'});item.append(h('span',{style:{color:i===0?'var(--gold)':'var(--purple)',fontSize:'12px',flexShrink:'0'},html:'✦'}),h('span',{},[f.trim()]));fl.append(item);});
      card.append(fl);
      const ab=h('a',{cls:'btn',style:{background:i===0?'var(--gold)':'var(--purple)',color:'#0F0E0A',width:'100%',textAlign:'center',display:'block'},html:'Book — '+pkg.price});
      ab.href=pkg.selar_link||'#';ab.target='_blank';
      card.append(ab,h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)',textAlign:'center',marginTop:'12px',letterSpacing:'1px',textTransform:'uppercase'},html:'Includes study portal access'}));
      pg.append(card);
    });}
    const{data:ts}=await sb.from('testimonials').select('*').order('created_at',{ascending:false});
    const tss=document.getElementById('ts-section');
    const tsg=document.getElementById('ts-grid');
    if(ts&&ts.length&&tss&&tsg){tss.style.display='block';ts.forEach(t=>{const c=div({cls:'card'});c.append(div({style:{fontSize:'24px',color:'var(--gold)',marginBottom:'16px',opacity:'.6'},html:'"'}),h('p',{style:{fontSize:'15px',color:'var(--muted)',lineHeight:'1.8',marginBottom:'20px',fontStyle:'italic',fontWeight:'300'},html:t.content}),div({style:{borderTop:'1px solid var(--border)',paddingTop:'16px'}},[div({style:{fontFamily:"'Playfair Display',serif",fontSize:'15px',color:'var(--text)',fontWeight:'600'},html:t.name}),t.title?div({cls:'mono',style:{marginTop:'4px'},html:t.title}):null].filter(Boolean)));tsg.append(c);});}
  })();
  return page;
}

function showEnrollModal(plan, selarLink){
  const ov=div({cls:'modal-bg'});
  ov.onclick=e=>{if(e.target===ov)ov.remove();};
  const box=div({cls:'card',style:{maxWidth:'480px',width:'100%',maxHeight:'90vh',overflowY:'auto'}});
  const errEl=div({cls:'err hidden'});
  const nameI=inp('Your full name');
  const emailI=inp('your@email.com','email');
  const passI=inp('Min. 6 characters','password');
  const badge=div({style:{background:plan.color,color:'#0F0E0A',borderRadius:'4px',padding:'12px 16px',marginBottom:'20px',display:'flex',justifyContent:'space-between',alignItems:'center'}});
  badge.append(div({},[div({style:{fontFamily:"'DM Mono',monospace",fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'4px'},html:'Selected Plan'}),div({style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',fontWeight:'700'},html:plan.name+' — '+plan.price})]),div({style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',letterSpacing:'1px'},html:plan.dur+' access'}));
  const submitBtn=btn('Create Account & Pay','btn-gold',async()=>{
    errEl.classList.add('hidden');
    if(!nameI.value||!emailI.value||!passI.value){errEl.classList.remove('hidden');errEl.textContent='Please fill in all fields.';return;}
    if(passI.value.length<6){errEl.classList.remove('hidden');errEl.textContent='Password must be at least 6 characters.';return;}
    submitBtn.textContent='Creating Account...';submitBtn.disabled=true;
    const{data,error}=await sb.auth.signUp({email:emailI.value,password:passI.value});
    if(error){errEl.classList.remove('hidden');errEl.textContent=error.message;submitBtn.textContent='Create Account & Pay';submitBtn.disabled=false;return;}
    await sb.from('profiles').upsert({id:data.user.id,email:emailI.value,full_name:nameI.value,status:'pending',plan:plan.name},{onConflict:'id'});
    sendAdminEmail('New Signup — Deo Fortis','<h2>New Student Signed Up</h2><p><b>Name:</b> '+nameI.value+'</p><p><b>Email:</b> '+emailI.value+'</p><p><b>Plan:</b> '+plan.name+'</p>');
    ov.remove();
    window.open(selarLink,'_blank');
    showSignupSuccess(nameI.value,selarLink);
  },{style:{width:'100%',padding:'16px',marginTop:'8px'}});
  box.append(div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'16px'}},[h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px'},html:'Create Account'}),btn('x','',()=>ov.remove(),{style:{background:'none',border:'none',color:'var(--muted)',fontSize:'18px',cursor:'pointer'}})]),badge,errEl,field('Full Name',nameI),field('Email',emailI),field('Password',passI),submitBtn,h('p',{style:{fontSize:'12px',color:'var(--dim)',textAlign:'center',marginTop:'12px',fontFamily:"'DM Mono',monospace",letterSpacing:'1px'},html:'You will be redirected to Selar to complete payment'}),h('p',{style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'12px'},html:'Already have an account? <button onclick="go(\'login\')" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:13px">Log in</button>'}));
  ov.append(box);document.body.append(ov);
}

function showSignupSuccess(name,selarLink){
  const ov=div({cls:'modal-bg'});
  const box=div({cls:'card',style:{maxWidth:'440px',width:'100%',textAlign:'center'}});
  box.append(div({style:{fontSize:'48px',marginBottom:'16px'},html:'🎉'}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',marginBottom:'12px'},html:'Account Created!'}),h('p',{cls:'muted',style:{fontSize:'14px',lineHeight:'1.8',marginBottom:'24px'},html:'Hi '+name+'! Complete your payment on Selar to get approved and gain full access.'}),h('a',{cls:'btn btn-gold',style:{display:'block',textAlign:'center',marginBottom:'12px'},href:selarLink,target:'_blank',html:'Complete Payment on Selar →'}),h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)',letterSpacing:'1px',textTransform:'uppercase',marginTop:'16px'},html:"You'll be approved as soon as your payment is verified"}),btn('Log In After Paying','btn-outline',()=>{ov.remove();go('login');},{style:{marginTop:'16px',width:'100%'}}));
  ov.append(box);document.body.append(ov);
}


function showVidModal(url){
  const ov=div({cls:'modal-bg'});
  ov.onclick=e=>{if(e.target===ov)ov.remove();};
  const box=div({style:{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'4px',width:'100%',maxWidth:'720px',overflow:'hidden'}});
  const hdr=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 20px',borderBottom:'1px solid var(--border)'}});
  hdr.append(h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',letterSpacing:'2px',textTransform:'uppercase',color:'var(--muted)'},html:'Platform Demo'}),btn('✕','',()=>ov.remove(),{style:{background:'none',border:'none',color:'var(--muted)',fontSize:'18px'}}));
  const va=div({style:{aspectRatio:'16/9',background:'#000',display:'flex',alignItems:'center',justifyContent:'center'}});
  if(url){const ifr=h('iframe',{src:url,style:{width:'100%',height:'100%',border:'none'},allowFullscreen:true});va.append(ifr);}
  else va.append(h('p',{style:{fontFamily:"'DM Mono',monospace",color:'var(--dim)',fontSize:'11px',letterSpacing:'2px'},html:'VIDEO NOT UPLOADED YET'}));
  box.append(hdr,va);ov.append(box);document.body.append(ov);
}

// ═══════════════════════════════
// SIGNUP
// ═══════════════════════════════
function signup(){
  const page=div({cls:'center',style:{minHeight:'100vh',padding:'24px'}});
  let sel=null;let links={monthly:'#',sixmonth:'#',yearly:'#'};
  const wrap=div({cls:'fade',style:{width:'100%',maxWidth:'560px'}});
  sb.from('admin_settings').select('*').single().then(({data})=>{if(data)links={monthly:data.link_monthly||'#',sixmonth:data.link_sixmonth||'#',yearly:data.link_yearly||'#'};});
  const fc=div({cls:'card',style:{marginBottom:'20px'}});
  const errEl=div({cls:'err hidden',id:'serr'});
  const nameI=inp('Your full name');const emailI=inp('your@email.com','email');const passI=inp('Min. 6 characters','password');
  fc.append(div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'4px'},html:'Deo Fortis'}),h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',marginBottom:'4px'},html:'Create Account'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:'Fill in your details and select a plan.'}),errEl,field('Full Name',nameI),field('Email',emailI),field('Password',passI));
  const ps=div({style:{marginBottom:'20px'}});
  ps.append(h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',letterSpacing:'3px',textTransform:'uppercase',color:'var(--gold)',marginBottom:'16px'},html:'Select Your Plan'}));
  const pl=div({style:{display:'grid',gap:'12px'}});
  const planDefs=[{name:'Monthly',price:'$10',period:'/ month',dur:'1 Month',color:'var(--gold)',key:'monthly'},{name:'6 Months',price:'$39',period:'/ 6 months',dur:'6 Months',color:'var(--teal)',popular:true,key:'sixmonth'},{name:'1 Year',price:'$59',period:'/ year',dur:'12 Months',color:'var(--purple)',key:'yearly'}];
  planDefs.forEach(plan=>{
    const card=div({style:{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'4px',padding:'20px 24px',cursor:'pointer',transition:'all .2s',position:'relative'},id:'pc-'+plan.key});
    if(plan.popular)card.append(h('span',{style:{position:'absolute',top:'-1px',right:'16px',background:'var(--teal)',color:'#0F0E0A',fontFamily:"'DM Mono',monospace",fontSize:'9px',letterSpacing:'2px',textTransform:'uppercase',padding:'3px 10px',borderRadius:'0 0 4px 4px'},html:'Best Value'}));
    const row=div({style:{display:'flex',alignItems:'center',justifyContent:'space-between'}});
    row.append(div({},[div({cls:'mono',style:{marginBottom:'4px'},html:plan.name}),div({style:{fontFamily:"'Playfair Display',serif",fontSize:'28px',color:plan.color,fontWeight:'700',lineHeight:'1'},html:plan.price+' <span style="font-size:13px;color:var(--dim);font-weight:300">'+plan.period+'</span>'})]),div({style:{width:'22px',height:'22px',borderRadius:'50%',border:'2px solid var(--border)',flexShrink:'0'},id:'pr-'+plan.key}));
    card.append(row,div({style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:plan.color,letterSpacing:'1px',marginTop:'6px',opacity:'.7'},html:plan.dur+' of full access'}));
    card.onclick=()=>{
      planDefs.forEach(p=>{const c=document.getElementById('pc-'+p.key);const r=document.getElementById('pr-'+p.key);if(c){c.style.border='1px solid var(--border)';c.style.background='var(--card)';}if(r){r.innerHTML='';r.style.border='2px solid var(--border)';}});
      card.style.border='1px solid '+plan.color;card.style.background='#1a1a0f';
      const radio=document.getElementById('pr-'+plan.key);
      if(radio){radio.style.border='2px solid '+plan.color;radio.innerHTML='<div style="width:10px;height:10px;border-radius:50%;background:'+plan.color+'"></div>';}
      sel=plan;sb.textContent='Create Account — '+plan.price;
    };
    pl.append(card);
  });
  ps.append(pl);
  const sb2=btn('Create Account','btn-gold',async()=>{
    const err=document.getElementById('serr');
    if(!sel){err.classList.remove('hidden');err.textContent='Please select a plan.';return;}
    if(!nameI.value||!emailI.value||!passI.value){err.classList.remove('hidden');err.textContent='Please fill in all fields.';return;}
    sb2.textContent='Creating...';sb2.disabled=true;
    const{data,error}=await sb.auth.signUp({email:emailI.value,password:passI.value});
    if(error){err.classList.remove('hidden');err.textContent=error.message;sb2.textContent='Create Account';sb2.disabled=false;return;}
    await sb.from('profiles').upsert({id:data.user.id,email:emailI.value,full_name:nameI.value,status:'pending',plan:sel.name},{onConflict:'id'});
    sendAdminEmail('🎓 New Signup — Deo Fortis','<h2>New Student Signed Up</h2><p><b>Name:</b> '+nameI.value+'</p><p><b>Email:</b> '+emailI.value+'</p><p><b>Plan:</b> '+sel.name+'</p><p>Log in to your admin panel to approve them after payment is verified.</p>');
    wrap.innerHTML='';
    const dc=div({cls:'card',style:{textAlign:'center'}});
    dc.append(div({style:{fontSize:'48px',marginBottom:'16px'},html:'📬'}),div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'16px'},html:'Deo Fortis'}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',marginBottom:'12px'},html:'Almost There!'}),h('p',{cls:'muted',style:{fontSize:'14px',lineHeight:'1.8',marginBottom:'24px'},html:'Your account has been created. Complete your payment to get approved.'}),h('a',{cls:'btn btn-gold',style:{display:'block',textAlign:'center',marginBottom:'12px'},href:links[sel.key]||'#',target:'_blank',html:'Complete Payment — '+sel.price}),h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--dim)',letterSpacing:'1px',textTransform:'uppercase',marginTop:'16px'},html:"You'll be approved as soon as your payment is verified"}),btn('Already paid? Log in →','',()=>go('login'),{style:{background:'none',border:'none',color:'var(--muted)',fontSize:'13px',marginTop:'16px'}}));
    wrap.append(dc);
  },{style:{width:'100%',padding:'16px'}});
  wrap.append(fc,ps,sb2,h('p',{style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'16px'},html:'Already have an account? <button onclick="go(\'login\')" style="background:none;border:none;color:var(--gold);cursor:pointer;font-size:13px">Log in</button>'}),h('p',{style:{textAlign:'center',marginTop:'8px'},html:'<button onclick="go(\'landing\')" style="background:none;border:none;color:var(--dim);cursor:pointer;font-size:12px;font-family:\'DM Mono\',monospace;letter-spacing:1px">← Back to home</button>'}));
  page.append(wrap);return page;
}

// ═══════════════════════════════
// LOGIN
// ═══════════════════════════════
function login(){
  const page=div({cls:'center',style:{minHeight:'100vh',padding:'24px'}});
  const card=div({cls:'card fade',style:{width:'100%',maxWidth:'400px'}});
  const errEl=div({cls:'err hidden'});
  const emailI=inp('your@email.com','email');const passI=inp('Your password','password');
  const sb2=btn('Log In','btn-gold',async()=>{
    errEl.classList.add('hidden');sb2.textContent='Logging in...';sb2.disabled=true;
    const{data,error}=await sb.auth.signInWithPassword({email:emailI.value,password:passI.value});
    if(error){errEl.classList.remove('hidden');errEl.textContent=error.message;sb2.textContent='Log In';sb2.disabled=false;return;}
    await getProfile(data.user.id);
  },{style:{width:'100%',marginBottom:'16px'}});
  passI.onkeydown=e=>{if(e.key==='Enter')sb2.click();};
  card.append(div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'4px'},html:'Deo Fortis'}),h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',marginBottom:'4px'},html:'Welcome Back'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:'Log in to continue your studies.'}),errEl,field('Email',emailI),field('Password',passI,{mb:'mb-24'}),sb2,h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),h('p',{style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'16px'},html:"Don't have an account? <button onclick=\"go('signup')\" style=\"background:none;border:none;color:var(--gold);cursor:pointer;font-size:13px\">Sign up</button>"}),h('p',{style:{fontSize:'13px',color:'var(--muted)',textAlign:'center',marginTop:'8px'},html:"<button onclick=\"go('landing')\" style=\"background:none;border:none;color:var(--dim);cursor:pointer;font-size:12px\">← Back to home</button>"}));
  page.append(card);return page;
}

// ═══════════════════════════════
// PENDING
// ═══════════════════════════════
function pending(){
  const page=div({cls:'center',style:{minHeight:'100vh',padding:'24px'}});
  const card=div({cls:'card fade',style:{width:'100%',maxWidth:'480px',textAlign:'center'}});
  card.append(div({style:{fontSize:'48px',marginBottom:'20px'},html:'⏳'}),div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'16px'},html:'Deo Fortis'}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'24px',marginBottom:'12px'},html:'Awaiting Approval'}),h('p',{cls:'muted',style:{fontSize:'15px',lineHeight:'1.7',marginBottom:'24px'},html:'Thanks for joining Deo Fortis! Your account is pending approval. You will be approved as soon as your payment is verified.'}),div({cls:'quote',style:{marginBottom:'24px',textAlign:'left'},html:'"Great students are patient students."'}),btn('Log Out','btn-outline',()=>sb.auth.signOut()));
  page.append(card);return page;
}

// ═══════════════════════════════
// DASHBOARD
// ═══════════════════════════════
function dashboard(){
  const page=div({});
  let clockedIn=false,curSess=null,elapsed=0,ticker=null;
  const p=S.profile||{};

  const nav=div({cls:'dash-nav'});
  nav.append(div({cls:'logo',html:'Deo Fortis'}),div({style:{display:'flex',gap:'8px'}},[btn('📚 Study','btn-outline',()=>go('study'),{style:{padding:'8px 16px'}}),btn('🃏 Cards','btn-outline',()=>go('flashcards'),{style:{padding:'8px 16px'}}),btn('📝 Q-Bank','btn-outline',()=>go('vignette'),{style:{padding:'8px 16px'}}),btn('🏆','btn-outline',()=>go('leaderboard'),{style:{padding:'8px 16px'}}),btn('Log Out','btn-outline',()=>sb.auth.signOut(),{style:{padding:'8px 16px'}})]));
  page.append(nav);

  // Banner alert for new assigned content
  if(p.has_new_content){
    const banner=div({style:{background:'linear-gradient(135deg,#1a3a2a,#0a2518)',border:'1px solid var(--teal)',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}});
    banner.append(div({style:{display:'flex',alignItems:'center',gap:'12px'}},[div({style:{fontSize:'24px'},html:'📬'}),div({},[div({style:{color:'var(--teal)',fontFamily:"'Playfair Display',serif",fontSize:'16px',fontWeight:'600',marginBottom:'2px'},html:'New content has been assigned to you!'}),div({style:{fontSize:'13px',color:'var(--muted)'},html:'Your tutor has uploaded new study materials for you. Check your flashcards or Q-Bank.'})])]),btn('View Now','btn-teal',async()=>{await sb.from('profiles').update({has_new_content:false}).eq('id',S.user.id);banner.remove();go('flashcards');},{style:{padding:'8px 16px',fontSize:'11px',flexShrink:'0'}}));
    page.append(banner);
  }

  // Load community link and show button
  let communityLink='';
  sb.from('admin_settings').select('community_link').single().then(({data})=>{
    if(data&&data.community_link){
      communityLink=data.community_link;
      const cb=document.getElementById('community-btn');
      if(cb){cb.href=communityLink;cb.style.display='block';}
    }
  });

  const inner=div({cls:'inner'});
  const th=Math.floor((p.total_study_minutes||0)/60),tm=(p.total_study_minutes||0)%60;
  inner.append(div({cls:'fade'},[h('span',{cls:'chapter',html:'Welcome Back'}),h('h1',{style:{fontFamily:"'Playfair Display',serif",fontSize:'40px',fontWeight:'700',marginBottom:'4px'},html:(p.full_name||'Scholar')+' <em style="font-style:italic;color:var(--gold);font-size:32px">📖</em>'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'40px'},html:'Plan: <span style="color:var(--gold)">'+(p.plan||'Active')+'</span> · Expires: <span style="color:var(--text)">'+(p.access_expires_at?new Date(p.access_expires_at).toLocaleDateString():'Active')+'</span>'})]));

  const sg=div({style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'16px',marginBottom:'40px'}});
  [{label:'Total Study Time',val:th+'h '+tm+'m',color:'var(--gold)'},{label:'Sessions',val:'0',color:'var(--teal)',id:'sc'},{label:'Status',val:'Active',color:'var(--purple)'}].forEach(s=>{
    const c=div({cls:'card',style:{textAlign:'center'}});
    c.append(div({style:{fontFamily:"'Playfair Display',serif",fontSize:'32px',color:s.color,fontWeight:'700',marginBottom:'4px'},html:s.val,id:s.id||''}),div({cls:'mono',html:s.label}));
    sg.append(c);
  });
  inner.append(sg);

  const cg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'24px',marginBottom:'24px'}});
  const cc=div({cls:'card'});
  const timerD=div({style:{fontFamily:"'DM Mono',monospace",fontSize:'36px',color:'var(--gold)',textAlign:'center',marginBottom:'20px',display:'none'},html:'00:00:00',id:'tdis'});
  const cdesc=h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'20px'},html:'Ready to study? Clock in to start tracking.'});
  const cinBtn=btn('Clock In','btn-gold',async()=>{
    const{data}=await sb.from('study_sessions').insert({user_id:S.user.id,topic:'General Study'}).select().single();
    if(data){curSess=data;clockedIn=true;elapsed=0;timerD.style.display='block';cdesc.style.display='none';cinBtn.style.display='none';coutBtn.style.display='block';ticker=setInterval(()=>{elapsed++;const td=document.getElementById('tdis');if(td)td.textContent=fmtHMS(elapsed);},1000);}
  },{style:{width:'100%'}});
  const coutBtn=btn('Clock Out','btn-red',async()=>{
    clearInterval(ticker);const mins=Math.floor(elapsed/60);
    if(curSess)await sb.from('study_sessions').update({ended_at:new Date().toISOString(),duration_minutes:mins}).eq('id',curSess.id);
    await sb.from('profiles').update({total_study_minutes:(p.total_study_minutes||0)+mins}).eq('id',S.user.id);
    clockedIn=false;curSess=null;elapsed=0;timerD.style.display='none';cdesc.style.display='block';cinBtn.style.display='block';coutBtn.style.display='none';loadSess();
  },{style:{width:'100%',display:'none'}});
  cc.append(h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',marginBottom:'20px'},html:'Clock In / Out'}),timerD,cdesc,cinBtn,coutBtn);

  const sc2=div({cls:'card'});
  sc2.append(h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',marginBottom:'20px'},html:'Recent Sessions'}),div({id:'slist',html:'<p style="font-size:14px;color:var(--dim)">Loading...</p>'}));
  cg.append(cc,sc2);inner.append(cg);

  const ag=div({style:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}});
  ag.append(btn('Start Pomodoro →','btn-gold',()=>go('study'),{style:{padding:'18px',fontSize:'13px'}}),btn('Flashcards →','btn-outline',()=>go('flashcards'),{style:{padding:'18px',fontSize:'13px'}}),btn('Q-Bank →','btn-outline',()=>go('vignette'),{style:{padding:'18px',fontSize:'13px'}}));
  inner.append(ag);
  // Community button
  const communityCard=div({style:{marginTop:'16px',background:'linear-gradient(135deg,#1a1509,#141309)',border:'1px solid #C8A96E44',borderRadius:'4px',padding:'20px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'16px'}});
  communityCard.append(div({style:{display:'flex',alignItems:'center',gap:'12px'}},[div({style:{fontSize:'28px'},html:'👥'}),div({},[div({style:{fontFamily:"'Playfair Display',serif",fontSize:'17px',color:'var(--text)',fontWeight:'600',marginBottom:'2px'},html:'Join Our Community'}),div({style:{fontSize:'13px',color:'var(--muted)'},html:'Connect with other students, share tips and stay accountable.'})])]),h('a',{cls:'btn btn-gold',href:'#',target:'_blank',id:'community-btn',style:{padding:'10px 20px',fontSize:'11px',display:'none',flexShrink:'0'},html:'Join Now →'}));
  inner.append(communityCard);
  page.append(inner);

  async function loadSess(){
    const{data}=await sb.from('study_sessions').select('*').eq('user_id',S.user.id).order('started_at',{ascending:false}).limit(5);
    const sl=document.getElementById('slist');const sc3=document.getElementById('sc');
    if(!sl)return;
    if(!data||!data.length){sl.innerHTML='<p style="font-size:14px;color:var(--dim)">No sessions yet.</p>';return;}
    if(sc3)sc3.textContent=data.length;
    sl.innerHTML='';
    data.forEach(s=>{const row=div({style:{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:'1px solid var(--border)',fontSize:'13px'}});row.append(h('span',{style:{color:'var(--muted)'},html:new Date(s.started_at).toLocaleDateString()}),h('span',{style:{color:'var(--gold)'},html:(s.duration_minutes||0)+' mins'}));sl.append(row);});
  }
  loadSess();
  return page;
}

// ═══════════════════════════════
// STUDY (POMODORO)
// ═══════════════════════════════
function study(){
  const page=div({cls:'center',style:{minHeight:'100vh',padding:'24px',flexDirection:'column'}});
  let cfg={topic:'',workMins:25,breakMins:5,sessions:4,useRecall:false,recallStyle:'',recallDetails:''};
  let timer=0,running=false,curSess=1,isBreak=false,interval=null,reqSent=false;

  function showSetup(){
    page.innerHTML='';
    const card=div({cls:'card fade',style:{width:'100%',maxWidth:'540px'}});
    card.append(btn('← Back','',()=>go('dashboard'),{style:{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'12px',fontFamily:"'DM Mono',monospace",letterSpacing:'1px',marginBottom:'16px'}}));
    card.append(h('span',{cls:'chapter',html:'Study Setup'}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'26px',marginBottom:'24px'},html:'Configure Your Session'}));
    const topI=inp('e.g. Bacteriology, Cardiology','text',cfg.topic);topI.oninput=e=>cfg.topic=e.target.value;
    card.append(field('What topic are you studying?',topI));
    card.append(h('label',{cls:'label',html:'Pomodoro Configuration'}));
    const pg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'8px'}});
    const wI=inp('25','number',String(cfg.workMins));wI.min='1';wI.max='120';wI.oninput=e=>cfg.workMins=parseInt(e.target.value)||25;
    const bI=inp('5','number',String(cfg.breakMins));bI.min='1';bI.max='60';bI.oninput=e=>cfg.breakMins=parseInt(e.target.value)||5;
    const sI=inp('4','number',String(cfg.sessions));sI.min='1';sI.max='20';sI.oninput=e=>cfg.sessions=parseInt(e.target.value)||4;
    [[wI,'Work (mins)'],[bI,'Break (mins)'],[sI,'Sessions']].forEach(([i,l])=>{const w=div({});w.append(h('label',{cls:'label',style:{fontSize:'9px'},html:l}),i);pg.append(w);});
    card.append(pg,h('p',{cls:'mono',style:{marginBottom:'20px'},html:'Set your own work time, break time and number of sessions'}));
    card.append(h('label',{cls:'label',html:'Request Active Recall?'}));
    const rb=div({style:{display:'flex',gap:'12px',marginBottom:'20px'}});
    ['Yes','No'].forEach(v=>{
      const b=btn(v,'btn-outline',()=>{cfg.useRecall=v==='Yes';rb.querySelectorAll('button').forEach(b2=>{b2.style.background='transparent';b2.style.color='var(--muted)';b2.style.border='1px solid var(--border)';});b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';ro.style.display=cfg.useRecall?'block':'none';});
      b.style.flex='1';if((v==='Yes'&&cfg.useRecall)||(v==='No'&&!cfg.useRecall)){b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';}
      rb.append(b);
    });
    card.append(rb);
    const ro=div({style:{display:cfg.useRecall?'block':'none'}});
    ro.append(h('label',{cls:'label',html:'Recall Style'}));
    const sg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'10px',marginBottom:'20px'}});
    [['flashcard','🃏 Flashcard'],['vignette','📝 Vignette'],['theory','📖 Theory']].forEach(([v,l])=>{
      const b=btn(l,'btn-outline',()=>{cfg.recallStyle=v;sg.querySelectorAll('button').forEach(b2=>{b2.style.background='transparent';b2.style.color='var(--muted)';b2.style.border='1px solid var(--border)';});b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';});
      b.style.fontSize='11px';if(cfg.recallStyle===v){b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';}
      sg.append(b);
    });
    ro.append(sg);
    const detI=h('textarea',{cls:'input',placeholder:'e.g. Focus on gram positive bacteria, NBME style...',style:{minHeight:'80px',resize:'vertical',marginBottom:'20px'}});
    detI.value=cfg.recallDetails;detI.oninput=e=>cfg.recallDetails=e.target.value;
    ro.append(h('label',{cls:'label',html:'Be Specific (optional)'}),detI);
    const sentMsg=div({cls:'ok',style:{display:reqSent?'block':'none',marginBottom:'20px'},html:'✓ Request sent! You will be notified when your content is ready.'});
    const sendBtn=btn('Send Recall Request →','btn-teal',async()=>{
      if(!cfg.recallStyle)return;
      await sb.from('recall_requests').insert({user_id:S.user.id,user_name:S.profile?.full_name,user_email:S.profile?.email,topic:cfg.topic,style:cfg.recallStyle,details:cfg.recallDetails,status:'pending'});
      sendAdminEmail('🧠 New Recall Request — Deo Fortis','<h2>New Active Recall Request</h2><p><b>Student:</b> '+S.profile?.full_name+'</p><p><b>Email:</b> '+S.profile?.email+'</p><p><b>Topic:</b> '+cfg.topic+'</p><p><b>Style:</b> '+cfg.recallStyle+'</p><p><b>Details:</b> '+(cfg.recallDetails||'None')+'</p>');
      reqSent=true;sentMsg.style.display='block';sendBtn.style.display='none';
    },{style:{width:'100%',marginBottom:'20px',display:reqSent?'none':'block'}});
    ro.append(sentMsg,sendBtn);
    card.append(ro);
    const startBtn=btn('Start Session →','btn-gold',()=>{if(!cfg.topic)return;showTimer();},{style:{width:'100%'}});
    card.append(startBtn);
    page.append(card);
  }

  function showTimer(){
    page.innerHTML='';
    const maxTime=isBreak?cfg.breakMins*60:cfg.workMins*60;
    const r=80,circ=2*Math.PI*r;
    const card=div({cls:'card fade',style:{textAlign:'center',maxWidth:'400px',width:'100%'}});
    card.append(h('span',{cls:'chapter',html:isBreak?'☕ Break Time':'Session '+curSess+' of '+cfg.sessions}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'20px',marginBottom:'8px',color:isBreak?'var(--teal)':'var(--text)'},html:cfg.topic}));
    const svgNS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(svgNS,'svg');svg.setAttribute('width','200');svg.setAttribute('height','200');svg.style.transform='rotate(-90deg)';
    const bgC=document.createElementNS(svgNS,'circle');bgC.setAttribute('cx','100');bgC.setAttribute('cy','100');bgC.setAttribute('r',String(r));bgC.setAttribute('fill','none');bgC.setAttribute('stroke','var(--border)');bgC.setAttribute('stroke-width','6');
    const fgC=document.createElementNS(svgNS,'circle');fgC.setAttribute('cx','100');fgC.setAttribute('cy','100');fgC.setAttribute('r',String(r));fgC.setAttribute('fill','none');fgC.setAttribute('stroke',isBreak?'var(--teal)':'var(--gold)');fgC.setAttribute('stroke-width','6');fgC.setAttribute('stroke-dasharray',String(circ));fgC.setAttribute('stroke-dashoffset',String(circ));fgC.setAttribute('stroke-linecap','round');fgC.style.transition='stroke-dashoffset 1s linear';
    svg.append(bgC,fgC);
    const tw=div({style:{position:'relative',width:'200px',height:'200px',margin:'24px auto'}});
    tw.append(svg);
    const tc=div({style:{position:'absolute',inset:'0',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}});
    const td=div({style:{fontFamily:"'DM Mono',monospace",fontSize:'32px',color:isBreak?'var(--teal)':'var(--gold)'},html:fmtMS(maxTime)});
    const ml=div({cls:'mono',style:{marginTop:'4px'},html:isBreak?'BREAK':'FOCUS'});
    tc.append(td,ml);tw.append(tc);card.append(tw);
    const br=div({style:{display:'flex',gap:'12px',justifyContent:'center',marginBottom:'16px'}});
    const pauseBtn=btn('Pause','btn-gold',()=>{running=!running;if(running){interval=setInterval(tick,1000);pauseBtn.textContent='Pause';}else{clearInterval(interval);pauseBtn.textContent='Resume';}});
    br.append(pauseBtn,btn('End','btn-outline',()=>{clearInterval(interval);go('dashboard');}));
    card.append(br);
    const qr=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}});
    qr.append(btn('🃏 Flashcards','btn-outline',()=>{clearInterval(interval);go('flashcards');},{style:{fontSize:'11px'}}),btn('📝 Q-Bank','btn-outline',()=>{clearInterval(interval);go('vignette');},{style:{fontSize:'11px'}}));
    card.append(qr);page.append(card);
    function tick(){
      timer++;const mt=isBreak?cfg.breakMins*60:cfg.workMins*60;const rem=mt-timer;
      td.textContent=fmtMS(rem);fgC.setAttribute('stroke-dashoffset',String(circ*(1-timer/mt)));
      if(timer>=mt){clearInterval(interval);timer=0;if(isBreak){isBreak=false;curSess++;if(curSess>cfg.sessions){go('dashboard');return;}}else isBreak=true;showTimer();if(running)interval=setInterval(tick,1000);}
    }
    running=true;interval=setInterval(tick,1000);
  }
  showSetup();return page;
}

// ═══════════════════════════════
// FLASHCARDS
// ═══════════════════════════════
function flashcards(){
  const page=div({});
  const nav=div({cls:'dash-nav'});
  nav.append(div({cls:'logo',html:'Deo Fortis'}),btn('← Dashboard','btn-outline',()=>go('dashboard'),{style:{padding:'8px 16px'}}));
  page.append(nav);
  let decks=[],selDeck=null,cards=[],queue=[],curIdx=0,flipped=false,prog={easy:0,iffy:0,hard:0};
  const inner=div({cls:'inner-sm'});page.append(inner);

  async function showDecks(){
    inner.innerHTML='';
    inner.append(h('span',{cls:'chapter',html:'Flashcard Decks'}),h('h1',{style:{fontFamily:"'Playfair Display',serif",fontSize:'40px',fontWeight:'700',marginBottom:'8px'},html:'Study <em class="gold-em">Flashcards</em>'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'40px'},html:'Select a deck. Mark cards Easy, Iffy, or Hard as you go.'}));
    const{data}=await sb.from('flashcard_decks').select('*').order('created_at',{ascending:false});
    decks=data||[];
    if(!decks.length){inner.append(div({cls:'card',style:{textAlign:'center',padding:'48px'}},[div({style:{fontSize:'40px',marginBottom:'16px'},html:'🃏'}),h('p',{style:{fontSize:'14px',color:'var(--dim)'},html:'No flashcard decks yet.'})]));return;}
    const grid=div({style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'16px'}});
    decks.forEach(deck=>{
      const card=div({cls:'card',style:{cursor:'pointer'}});
      card.append(div({style:{fontSize:'32px',marginBottom:'12px'},html:'🃏'}),h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'18px',color:'var(--text)',marginBottom:'8px'},html:deck.topic}),btn('Start Deck →','btn-gold',async()=>loadDeck(deck),{style:{width:'100%',marginTop:'16px'}}));
      grid.append(card);
    });
    inner.append(grid);
  }

  async function loadDeck(deck){
    selDeck=deck;
    const{data}=await sb.from('flashcards').select('*').eq('deck_id',deck.id);
    if(!data||!data.length){alert('No cards in this deck yet.');return;}
    cards=[...data];queue=[...data];curIdx=0;flipped=false;prog={easy:0,iffy:0,hard:0};
    showCard();
  }

  function showCard(){
    inner.innerHTML='';
    if(!queue.length||curIdx>=queue.length){showDone();return;}
    const card=queue[curIdx];
    const pct=cards.length>0?Math.round((prog.easy/cards.length)*100):0;
    const hdr=div({style:{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'20px'}});
    hdr.append(btn('← Decks','',()=>showDecks(),{style:{background:'none',border:'none',color:'var(--dim)',cursor:'pointer',fontSize:'12px',fontFamily:"'DM Mono',monospace",letterSpacing:'1px'}}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--muted)'},html:selDeck?.topic||''}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--dim)'},html:(curIdx+1)+' / '+queue.length}));
    inner.append(hdr);
    const pb=div({cls:'progress-bar',style:{marginBottom:'8px'}});pb.append(div({cls:'progress-fill',style:{width:pct+'%',background:'var(--teal)'}}));
    inner.append(pb);
    const pr=div({style:{display:'flex',justifyContent:'space-between',marginBottom:'24px'}});
    pr.append(h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--teal)'},html:'✓ '+prog.easy+' easy'}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--gold)'},html:'~ '+prog.iffy+' iffy'}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'#ff8888'},html:'✗ '+prog.hard+' hard'}));
    inner.append(pr);
    const fw=div({cls:'flip-card',style:{width:'100%',height:'240px',marginBottom:'24px'}});
    const fi=div({cls:'flip-inner',style:{height:'100%'}});
    const front=div({cls:'flip-front card',style:{position:'absolute',width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px'}});
    front.append(div({cls:'mono',style:{marginBottom:'16px'},html:'Question — tap to flip'}),h('p',{style:{fontSize:'16px',color:'var(--text)',textAlign:'center',lineHeight:'1.7'},html:card.question}));
    const back=div({cls:'flip-back card',style:{position:'absolute',width:'100%',height:'100%',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'32px',background:'#0a1f18',borderColor:'var(--teal)'}});
    back.append(div({style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--teal)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'16px'},html:'Answer'}),h('p',{style:{fontSize:'16px',color:'var(--teal)',textAlign:'center',lineHeight:'1.7'},html:card.answer}));
    fi.append(front,back);fw.append(fi);
    fw.onclick=()=>{flipped=!flipped;fi.classList.toggle('flipped',flipped);mbtns.style.display=flipped?'grid':'none';flipBtn.style.display=flipped?'none':'block';};
    inner.append(fw);
    const mbtns=div({style:{display:'none',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}});
    [['easy','🟢','EASY','#1a3a1a','#7EB8A4','#2a5a2a'],['iffy','🟡','IFFY','#2a1f0a','var(--gold)','#4a3a1a'],['hard','🔴','HARD','#3a1a1a','#ff8888','#5a2a2a']].forEach(([d,ico,lbl2,bg,color,border])=>{
      const b=btn(ico+'\n'+lbl2,'',()=>markCard(d),{style:{background:bg,color,border:'1px solid '+border,padding:'16px 8px',fontSize:'10px',letterSpacing:'1px'}});
      mbtns.append(b);
    });
    inner.append(mbtns);
    const flipBtn=btn('Flip Card →','btn-outline',()=>{flipped=true;fi.classList.add('flipped');mbtns.style.display='grid';flipBtn.style.display='none';},{style:{width:'100%'}});
    inner.append(flipBtn);
  }

  function markCard(d){
    const cur=queue[curIdx];prog[d]++;
    let nq=[...queue];
    if(d==='hard')nq.splice(curIdx+2,0,cur);
    else if(d==='iffy')nq.push(cur);
    nq.splice(curIdx,1);
    if(!nq.length){showDone();return;}
    queue=nq;curIdx=Math.min(curIdx,queue.length-1);flipped=false;showCard();
  }

  function showDone(){
    inner.innerHTML='';
    const card=div({cls:'card fade',style:{textAlign:'center'}});
    card.append(div({style:{fontSize:'48px',marginBottom:'16px'},html:'🎉'}),h('span',{cls:'chapter',html:'Deck Complete'}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'28px',marginBottom:'20px'},html:selDeck?.topic||''}));
    const sg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px',marginBottom:'24px'}});
    [{l:'Easy',v:prog.easy,c:'var(--teal)'},{l:'Iffy',v:prog.iffy,c:'var(--gold)'},{l:'Hard',v:prog.hard,c:'#ff8888'}].forEach(s=>{const c=div({cls:'card',style:{padding:'16px',textAlign:'center'}});c.append(div({style:{fontFamily:"'Playfair Display',serif",fontSize:'28px',color:s.c},html:String(s.v)}),div({cls:'mono',html:s.l}));sg.append(c);});
    card.append(sg);
    const bw=div({style:{display:'grid',gap:'10px'}});
    bw.append(btn('Redo All Cards','btn-gold',()=>{queue=[...cards];curIdx=0;flipped=false;prog={easy:0,iffy:0,hard:0};showCard();}),btn('Back to Decks','btn-outline',()=>showDecks()),btn('Dashboard','btn-outline',()=>go('dashboard')));
    card.append(bw);inner.append(card);
  }
  showDecks();return page;
}

// ═══════════════════════════════
// VIGNETTE Q-BANK
// ═══════════════════════════════
function vignette(){
  const page=div({});
  const nav=div({cls:'dash-nav'});
  nav.append(div({cls:'logo',html:'Deo Fortis'}),btn('← Dashboard','btn-outline',()=>go('dashboard'),{style:{padding:'8px 16px'}}));
  page.append(nav);
  let questions=[],current=0,answers={},submitted=false,revealed={},timeLeft=0,tInterval=null,selTopic='',mode='',timeLimit=60;
  const inner=div({cls:'inner-sm'});page.append(inner);

  async function showSetup(){
    inner.innerHTML='';
    inner.append(h('span',{cls:'chapter',html:'Question Bank'}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'26px',marginBottom:'24px'},html:'Configure Your Quiz'}));
    const{data}=await sb.from('vignette_questions').select('topic');
    const topics=data?[...new Set(data.map(d=>d.topic))]:[];
    if(!topics.length){inner.append(div({cls:'card',style:{textAlign:'center',padding:'48px'}},[h('p',{style:{fontSize:'14px',color:'var(--dim)'},html:'No questions available yet.'})]));return;}
    const tSel=h('select',{cls:'input',style:{cursor:'pointer',marginBottom:'20px'}});
    tSel.append(h('option',{value:'',html:'Choose a topic...'}));
    topics.forEach(t=>tSel.append(h('option',{value:t,html:t})));
    tSel.onchange=e=>selTopic=e.target.value;
    inner.append(h('label',{cls:'label',html:'Select Topic'}),tSel);
    inner.append(h('label',{cls:'label',html:'Mode'}));
    const mb=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'20px'}});
    [['tutor','🎓 Tutor Mode'],['timed','⏱ Timed Mode']].forEach(([v,l])=>{
      const b=btn(l,'btn-outline',()=>{mode=v;mb.querySelectorAll('button').forEach(b2=>{b2.style.background='transparent';b2.style.color='var(--muted)';b2.style.border='1px solid var(--border)';});b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';tlWrap.style.display=v==='timed'?'block':'none';});
      if(mode===v){b.style.background='var(--gold)';b.style.color='#0F0E0A';b.style.border='1px solid var(--gold)';}
      mb.append(b);
    });
    inner.append(mb);
    const tlI=inp('60','number',String(timeLimit));tlI.min='1';tlI.max='180';tlI.oninput=e=>timeLimit=parseInt(e.target.value)||60;
    const tlWrap=div({style:{marginBottom:'20px',display:mode==='timed'?'block':'none'}},[h('label',{cls:'label',html:'Time Limit (minutes)'}),tlI]);
    inner.append(tlWrap);
    const startBtn=btn('Start Quiz →','btn-gold',async()=>{
      if(!selTopic||!mode)return;
      const{data:qs}=await sb.from('vignette_questions').select('*').eq('topic',selTopic).limit(40);
      if(!qs||!qs.length){alert('No questions for this topic yet.');return;}
      questions=qs;current=0;answers={};submitted=false;revealed={};
      if(mode==='timed')timeLeft=timeLimit*60;
      showQuiz();
    },{style:{width:'100%'}});
    inner.append(startBtn);
  }

  function showQuiz(){
    page.innerHTML='';page.append(nav);
    const qNav=div({style:{background:'rgba(15,14,10,.97)',borderBottom:'1px solid var(--border)',padding:'12px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:'0',zIndex:'100'}});
    const tEl=h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'16px',color:'var(--gold)',display:mode==='timed'?'inline':'none'},html:fmtMS(timeLeft)});
    const pEl=h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--muted)'},html:(current+1)+' / '+questions.length});
    qNav.append(h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--muted)',letterSpacing:'1px'},html:selTopic+' · '+(mode==='tutor'?'Tutor':'Timed')}),div({style:{display:'flex',gap:'16px',alignItems:'center'}},[tEl,pEl]));
    page.append(qNav);
    if(mode==='timed'){tInterval=setInterval(()=>{timeLeft--;tEl.textContent=fmtMS(timeLeft);if(timeLeft<60)tEl.style.color='#ff8888';if(timeLeft<=0){clearInterval(tInterval);submitQuiz();}},1000);}
    const qi=div({style:{display:'grid',gridTemplateColumns:'200px 1fr',maxWidth:'1000px',margin:'0 auto',padding:'24px',gap:'24px'}});
    const sidebar=div({});
    sidebar.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Questions'}));
    const ng=div({style:{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:'4px'}});
    questions.forEach((q,i)=>{
      const nb=h('button',{style:{width:'32px',height:'32px',border:'1px solid var(--border)',background:'transparent',color:'var(--muted)',fontFamily:"'DM Mono',monospace",fontSize:'10px',cursor:'pointer',borderRadius:'2px'},html:String(i+1),id:'nb-'+i});
      nb.onclick=()=>{current=i;updateQ();};ng.append(nb);
    });
    sidebar.append(ng);
    if(mode==='timed'&&!submitted)sidebar.append(btn('Submit All →','btn-gold',()=>submitQuiz(),{style:{width:'100%',marginTop:'20px',fontSize:'11px'}}));
    const mainArea=div({id:'quiz-main'});
    qi.append(sidebar,mainArea);page.append(qi);
    updateQ();

    function updateQ(){
      const q=questions[current];mainArea.innerHTML='';pEl.textContent=(current+1)+' / '+questions.length;
      questions.forEach((qq,i)=>{
        const nb=document.getElementById('nb-'+i);if(!nb)return;
        if(i===current){nb.style.border='1px solid var(--gold)';nb.style.background='#C8A96E22';nb.style.color='var(--gold)';}
        else if(answers[qq.id]){const ok=answers[qq.id]===qq.correct_answer;nb.style.border='1px solid '+(ok?'var(--teal)':'#8B0000');nb.style.background=ok?'#7EB8A422':'#8B000022';nb.style.color=ok?'var(--teal)':'#ff8888';}
        else{nb.style.border='1px solid var(--border)';nb.style.background='transparent';nb.style.color='var(--muted)';}
      });
      const qCard=div({cls:'card',style:{marginBottom:'16px'}});
      qCard.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Question '+(current+1)}),h('p',{style:{fontSize:'15px',color:'var(--text)',lineHeight:'1.8'},html:q.question}));
      mainArea.append(qCard);
      ['a','b','c','d','e'].forEach(opt=>{
        const val=q['option_'+opt];if(!val)return;
        const ob=h('button',{cls:'option-btn'});
        const isSel=answers[q.id]===opt.toUpperCase();
        const isCorr=q.correct_answer===opt.toUpperCase();
        const isRev=revealed[q.id]||submitted;
        if(isRev&&isCorr)ob.classList.add('correct');
        else if(isRev&&isSel&&!isCorr)ob.classList.add('wrong');
        else if(isSel)ob.classList.add('selected');
        ob.append(h('strong',{style:{marginRight:'12px'},html:opt.toUpperCase()+'.'}),document.createTextNode(val));
        ob.onclick=()=>{if(submitted)return;answers[q.id]=opt.toUpperCase();if(mode==='tutor')revealed[q.id]=true;updateQ();};
        mainArea.append(ob);
      });
      if((revealed[q.id]||submitted)&&q.explanation){
        const exp=div({style:{background:'#0a1f18',border:'1px solid #7EB8A422',borderRadius:'2px',padding:'16px',marginTop:'16px'}});
        exp.append(div({style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',color:'var(--teal)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:'8px'},html:'Explanation'}),h('p',{style:{fontSize:'14px',color:'var(--muted)',lineHeight:'1.7'},html:q.explanation}));
        mainArea.append(exp);
      }
      const nr=div({style:{display:'flex',gap:'12px',marginTop:'16px'}});
      if(current>0)nr.append(btn('← Prev','btn-outline',()=>{current--;updateQ();}));
      if(current<questions.length-1)nr.append(btn('Next →','btn-gold',()=>{current++;updateQ();}));
      if(current===questions.length-1&&mode==='tutor')nr.append(btn('See Results →','btn-gold',()=>submitQuiz()));
      mainArea.append(nr);
    }
  }

  async function submitQuiz(){
    clearInterval(tInterval);submitted=true;
    const score=questions.filter(q=>answers[q.id]===q.correct_answer).length;
    await sb.from('vignette_scores').insert({user_id:S.user.id,topic:selTopic,score,total:questions.length,mode});
    showResults(score);
  }

  function showResults(score){
    page.innerHTML='';page.append(nav);
    const ri=div({cls:'inner-sm center',style:{minHeight:'80vh',flexDirection:'column'}});
    const card=div({cls:'card fade',style:{maxWidth:'500px',width:'100%',textAlign:'center'}});
    card.append(h('span',{cls:'chapter',html:'Quiz Complete'}),div({style:{fontSize:'56px',margin:'16px 0'},html:score/questions.length>=.7?'🎉':'📚'}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'36px',marginBottom:'4px',color:'var(--gold)'},html:score+' / '+questions.length}),div({cls:'mono',style:{marginBottom:'8px'},html:Math.round(score/questions.length*100)+'% correct'}),h('p',{style:{fontFamily:"'DM Mono',monospace",fontSize:'11px',color:'var(--muted)',marginBottom:'24px'},html:selTopic+' · '+mode+' mode'}),div({cls:'quote',style:{textAlign:'left',marginBottom:'24px'},html:score/questions.length>=.8?'"Excellent. You know this topic well."':score/questions.length>=.5?'"Good effort. Review the ones you missed."':'"Keep studying. Come back stronger."'}));
    const bw=div({style:{display:'grid',gap:'10px'}});
    bw.append(btn('Try Again','btn-gold',()=>showSetup()),btn('Dashboard','btn-outline',()=>go('dashboard')));
    card.append(bw);ri.append(card);page.append(ri);
  }
  showSetup();return page;
}

// ═══════════════════════════════
// LEADERBOARD
// ═══════════════════════════════
function leaderboard(){
  const page=div({});
  const nav=div({cls:'dash-nav'});
  nav.append(div({cls:'logo',html:'Deo Fortis'}),btn('← Dashboard','btn-outline',()=>go('dashboard'),{style:{padding:'8px 16px'}}));
  page.append(nav);
  const inner=div({cls:'inner-sm'});
  inner.append(h('span',{cls:'chapter',html:'Rankings'}),h('h1',{style:{fontFamily:"'Playfair Display',serif",fontSize:'48px',fontWeight:'700',marginBottom:'8px'},html:'The <em class="gold-em">Leaderboard</em>'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'40px'},html:'Rankings based on total study hours. Updated in real time.'}));
  const board=div({cls:'card',style:{marginBottom:'32px'},id:'board',html:'<p style="font-size:14px;color:var(--dim);text-align:center;padding:20px">Loading...</p>'});
  inner.append(board);
  const bc=div({cls:'card',style:{textAlign:'center',borderColor:'#C8A96E33',borderTopWidth:'3px',borderTopColor:'var(--gold)'}});
  bc.append(div({style:{fontSize:'32px',marginBottom:'12px'},html:'📚'}),h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'8px'},html:'Want Personal Tutoring?'}),h('p',{cls:'muted',style:{fontSize:'14px',lineHeight:'1.7',marginBottom:'20px'},html:'Work directly with me. Get personalised guidance and full portal access.'}),btn('Book a Session →','btn-gold',()=>showBooking()));
  inner.append(bc);page.append(inner);
  const medals=['🥇','🥈','🥉'];
  sb.from('leaderboard').select('*').then(({data})=>{
    const b=document.getElementById('board');if(!b)return;
    if(!data||!data.length){b.innerHTML='<p style="font-size:14px;color:var(--dim);text-align:center;padding:20px">No data yet. Be the first to clock in!</p>';return;}
    b.innerHTML='';
    data.forEach((row,i)=>{const r=div({cls:'leaderboard-row'});r.append(h('span',{style:{fontSize:'22px',width:'32px'},html:medals[i]||(i+1)+'.'}),h('span',{style:{flex:'1',fontSize:'15px',color:'var(--text)'},html:row.full_name}),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'13px',color:'var(--gold)'},html:Math.floor(row.total_study_minutes/60)+'h '+row.total_study_minutes%60+'m'}));b.append(r);});
  });

  async function showBooking(){
    const{data:pkgs}=await sb.from('tutoring_packages').select('*').order('id');
    const ov=div({cls:'modal-bg'});ov.onclick=e=>{if(e.target===ov)ov.remove();};
    const box=div({cls:'card',style:{maxWidth:'480px',width:'100%'}});
    const nI=inp('Your name');const eI=inp('your@email.com','email');
    const pSel=h('select',{cls:'input',style:{cursor:'pointer'}});
    pSel.append(h('option',{value:'',html:'Select a package'}));
    (pkgs||[]).forEach(p=>pSel.append(h('option',{value:p.name,html:p.name+' — '+p.price})));
    const mI=h('textarea',{cls:'input',placeholder:'Tell me about your study goals...',style:{minHeight:'80px',resize:'vertical'}});
    const sBtn=btn('Send Request','btn-gold',async()=>{
      if(!nI.value||!eI.value||!pSel.value)return;
      await sb.from('booking_requests').insert({name:nI.value,email:eI.value,package:pSel.value,message:mI.value});
      sendAdminEmail('📅 New Booking Request — Deo Fortis','<h2>New Tutoring Booking</h2><p><b>Name:</b> '+nI.value+'</p><p><b>Email:</b> '+eI.value+'</p><p><b>Package:</b> '+pSel.value+'</p><p><b>Message:</b> '+mI.value+'</p>');
      box.innerHTML='<div style="text-align:center;padding:20px"><div style="font-size:48px;margin-bottom:16px">✅</div><h2 style="font-family:Playfair Display,serif;font-size:22px;margin-bottom:12px">Request Sent!</h2><p style="color:var(--muted);font-size:14px;line-height:1.7">You will be contacted via email to confirm your booking.</p></div>';
      setTimeout(()=>ov.remove(),3000);
    });
    box.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'20px'},html:'Book a Session'}),field('Full Name',nI),field('Email',eI),field('Package',pSel),field('What do you need help with?',mI),div({style:{display:'flex',gap:'12px'}},[sBtn,btn('Cancel','btn-outline',()=>ov.remove())]));
    ov.append(box);document.body.append(ov);
  }
  return page;
}

// ═══════════════════════════════
// ADMIN
// ═══════════════════════════════
function admin(){
  const page=div({});
  const PASS='deofortis2024';
  let authed=false;

  function showLogin(){
    page.innerHTML='';
    const wrap=div({cls:'center',style:{minHeight:'100vh',padding:'24px'}});
    const card=div({cls:'card fade',style:{maxWidth:'360px',width:'100%'}});
    const pI=inp('Enter admin password','password');
    const eEl=div({cls:'err hidden'});
    const entBtn=btn('Enter','btn-gold',()=>{if(pI.value===PASS){authed=true;showAdminPanel();}else{eEl.classList.remove('hidden');eEl.textContent='Incorrect password.';}},{style:{width:'100%',marginBottom:'16px'}});
    pI.onkeydown=e=>{if(e.key==='Enter')entBtn.click();};
    card.append(div({style:{fontFamily:"'Playfair Display',serif",fontStyle:'italic',fontSize:'22px',color:'var(--gold)',marginBottom:'4px'},html:'Deo Fortis'}),h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'16px 0'}}),h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'16px'},html:'Admin Access'}),eEl,h('label',{cls:'label',html:'Password'}),pI,h('br'),entBtn,h('p',{style:{fontSize:'12px',color:'var(--dim)',textAlign:'center'},html:'<button onclick="go(\'landing\')" style="background:none;border:none;color:var(--dim);cursor:pointer;font-size:12px">← Back to site</button>'}));
    wrap.append(card);page.append(wrap);
  }

  async function showAdminPanel(){
    page.innerHTML='';
    const aN=div({style:{background:'rgba(15,14,10,.97)',borderBottom:'1px solid var(--border)',padding:'16px 24px',display:'flex',alignItems:'center',justifyContent:'space-between',position:'sticky',top:'0',zIndex:'100'}});
    aN.append(div({cls:'logo',html:'Admin — Deo Fortis'}),btn('← Site','btn-outline',()=>go('landing'),{style:{padding:'8px 16px'}}));
    page.append(aN);
    const tabs=div({style:{borderBottom:'1px solid var(--border)',display:'flex',overflowX:'auto'}});
    const content=div({cls:'inner-md'});
    let curTab='settings';
    const tabDefs=[['settings','⚙ Settings'],['users','👥 Users'],['recalls','🧠 Recalls'],['flashcards','🃏 Flashcards'],['questions','📝 Q-Bank'],['testimonials','💬 Reviews'],['packages','📦 Packages'],['bookings','📅 Bookings']];
    tabDefs.forEach(([id,label])=>{
      const tb=h('button',{cls:'tab-btn'+(id===curTab?' active':''),html:label});
      tb.onclick=()=>{curTab=id;tabs.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));tb.classList.add('active');loadTab(id);};
      tabs.append(tb);
    });
    page.append(tabs,content);

    async function loadTab(tab){
      content.innerHTML='<p style="color:var(--dim);font-size:14px;padding:24px">Loading...</p>';

      if(tab==='settings'){
        const{data:s}=await sb.from('admin_settings').select('*').single();
        const set=s||{};
        const card=div({cls:'card fade'});
        card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'24px'},html:'Site Settings'}));
        const vI=inp('https://www.youtube.com/embed/...','text',set.video_url||'');
        card.append(field('Demo Video URL',vI),h('p',{cls:'mono',style:{marginBottom:'20px'},html:'YouTube: Share → Embed → copy the src URL only'}));
        const comI=inp('https://...','text',set.community_link||'');
        card.append(field('Community Link (Forum / Discord / WhatsApp)',comI));
        card.append(h('hr',{style:{border:'none',borderTop:'1px solid var(--border)',margin:'24px 0'}}),h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'18px',marginBottom:'16px'},html:'Study Portal Payment Links'}));
        const lIs={};
        [['link_monthly','Monthly ($10)'],['link_sixmonth','6 Months ($39)'],['link_yearly','1 Year ($59)']].forEach(([k,l])=>{const i=inp('https://selar.co/...','text',set[k]||'');lIs[k]=i;card.append(field(l,i));});
        const sm=div({cls:'ok',style:{display:'none',marginTop:'12px'},html:'✓ Settings saved!'});
        card.append(btn('Save Settings','btn-gold',async()=>{const obj={id:1,video_url:vI.value,community_link:comI.value};Object.keys(lIs).forEach(k=>obj[k]=lIs[k].value);await sb.from('admin_settings').upsert(obj);sm.style.display='block';setTimeout(()=>sm.style.display='none',2000);}),sm);
        content.innerHTML='';content.append(card);
      }

      if(tab==='users'){
        const{data:users}=await sb.from('profiles').select('*').order('created_at',{ascending:false});
        const card=div({cls:'card fade'});
        const pend=(users||[]).filter(u=>u.status==='pending').length;
        card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'8px'},html:'Users'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:pend+' pending approval'}));
        (users||[]).forEach(u=>{
          const row=div({style:{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 0',borderBottom:'1px solid var(--border)'}});
          const info=div({});
          info.append(div({style:{fontSize:'15px',color:'var(--text)',marginBottom:'2px'},html:u.full_name||'—'}),div({style:{fontSize:'12px',color:'var(--muted)'},html:(u.email||'—')+' · '+(u.plan||'No plan')+' · '+new Date(u.created_at).toLocaleDateString()}));
          const right=div({style:{display:'flex',alignItems:'center',gap:'12px'}});
          right.append(h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',letterSpacing:'1px',textTransform:'uppercase',color:u.status==='approved'?'var(--teal)':'var(--gold)'},html:u.status||'pending'}));
          if(u.status!=='approved'){right.append(btn('Approve','btn-teal',async()=>{const exp=new Date();exp.setMonth(exp.getMonth()+1);await sb.from('profiles').update({status:'approved',access_expires_at:exp.toISOString()}).eq('id',u.id);loadTab('users');},{style:{padding:'6px 16px',fontSize:'11px'}}));}
          row.append(info,right);card.append(row);
        });
        content.innerHTML='';content.append(card);
      }

      if(tab==='recalls'){
        const{data:recs}=await sb.from('recall_requests').select('*').order('created_at',{ascending:false});
        content.innerHTML='';
        content.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'24px'},html:'Recall Requests'}));
        if(!recs||!recs.length){content.append(div({cls:'card',style:{textAlign:'center',padding:'40px'}},[h('p',{style:{fontSize:'14px',color:'var(--dim)'},html:'No recall requests yet.'})]));return;}
        const upSt=div({cls:'ok',style:{display:'none',marginTop:'16px'}});
        recs.forEach(r=>{
          const card=div({cls:'card',style:{marginBottom:'16px'}});
          const hdr2=div({style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'12px'}});
          hdr2.append(div({},[div({style:{fontSize:'15px',color:'var(--text)',marginBottom:'4px'},html:r.user_name||'—'}),div({style:{fontSize:'12px',color:'var(--muted)'},html:r.user_email||''})]),h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',letterSpacing:'1px',textTransform:'uppercase',color:r.status==='pending'?'var(--gold)':'var(--teal)'},html:r.status}));
          card.append(hdr2);
          const dg=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}});
          [[r.topic,'Topic'],[r.style,'Style']].forEach(([v,l])=>{const d=div({});d.append(div({cls:'mono',style:{marginBottom:'4px'},html:l}),div({style:{fontSize:'14px',color:l==='Style'?'var(--gold)':'var(--text)'},html:v||'—'}));dg.append(d);});
          card.append(dg);
          if(r.details)card.append(div({style:{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'2px',padding:'12px',marginBottom:'12px'}},[div({cls:'mono',style:{marginBottom:'4px'},html:'Notes'}),h('p',{style:{fontSize:'13px',color:'var(--muted)'},html:r.details})]));
          const br2=div({style:{display:'flex',gap:'12px'}});
          async function handleUpload(file,isCsv){
            upSt.style.display='block';upSt.textContent='Uploading...';
            const text=await file.text();
            if(isCsv){
              const lines=text.split('\n').filter(l=>l.trim());
              const{data:deck}=await sb.from('flashcard_decks').insert({topic:r.topic}).select().single();
              if(!deck){upSt.textContent='Error';return;}
              const cards=lines.map(line=>{const parts=line.split(',');return{deck_id:deck.id,question:parts[0]?.trim(),answer:parts.slice(1).join(',').trim()};}).filter(c=>c.question&&c.answer);
              await sb.from('flashcards').insert(cards);upSt.textContent='✓ Uploaded '+cards.length+' cards!';
            }else{
              const blocks=text.split('\n\n').filter(b=>b.trim());const qs=[];
              for(const block of blocks){const lines=block.split('\n').filter(l=>l.trim());if(lines.length<3)continue;const q={topic:r.topic,question:'',option_a:'',option_b:'',option_c:'',option_d:'',option_e:'',correct_answer:'',explanation:'',is_global:true};q.question=lines[0];for(const line of lines.slice(1)){if(line.startsWith('A.')||line.startsWith('A)'))q.option_a=line.slice(2).trim();else if(line.startsWith('B.')||line.startsWith('B)'))q.option_b=line.slice(2).trim();else if(line.startsWith('C.')||line.startsWith('C)'))q.option_c=line.slice(2).trim();else if(line.startsWith('D.')||line.startsWith('D)'))q.option_d=line.slice(2).trim();else if(line.startsWith('E.')||line.startsWith('E)'))q.option_e=line.slice(2).trim();else if(line.toLowerCase().startsWith('answer:'))q.correct_answer=line.split(':')[1].trim().toUpperCase();else if(line.toLowerCase().startsWith('explanation:'))q.explanation=line.split(':').slice(1).join(':').trim();}if(q.question&&q.correct_answer)qs.push(q);}
              if(qs.length){await sb.from('vignette_questions').insert(qs);upSt.textContent='✓ Uploaded '+qs.length+' questions!';}else upSt.textContent='No valid questions found.';
            }
            setTimeout(()=>upSt.style.display='none',3000);
          }
          if(r.style==='flashcard'){const fi=h('input',{type:'file',accept:'.csv',style:{color:'var(--muted)',fontSize:'12px',fontFamily:"'DM Mono',monospace"}});fi.onchange=e=>{if(e.target.files[0])handleUpload(e.target.files[0],true);};br2.append(div({},[h('label',{cls:'label',html:'Upload CSV'}),fi]));}
          if(r.style==='vignette'||r.style==='theory'){const fi=h('input',{type:'file',accept:'.txt',style:{color:'var(--muted)',fontSize:'12px',fontFamily:"'DM Mono',monospace"}});fi.onchange=e=>{if(e.target.files[0])handleUpload(e.target.files[0],false);};br2.append(div({},[h('label',{cls:'label',html:'Upload TXT'}),fi]));}
          br2.append(btn('Mark Done','btn-teal',async()=>{await sb.from('recall_requests').update({status:'fulfilled'}).eq('id',r.id);await sb.from('profiles').update({has_new_content:true}).eq('id',r.user_id);loadTab('recalls');},{style:{padding:'8px 16px',fontSize:'11px'}}));
          card.append(br2);content.append(card);
        });
        content.append(upSt);
      }

      if(tab==='flashcards'){
        const card=div({cls:'card fade'});
        card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'8px'},html:'Upload Flashcard Deck'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:'CSV format: question, answer (one per line)'}));
        const dnI=inp('e.g. Bacteriology Basics');
        const upSt=div({cls:'ok',style:{display:'none',marginTop:'16px'}});
        const fi=h('input',{type:'file',accept:'.csv',style:{color:'var(--muted)',fontSize:'13px',fontFamily:"'DM Mono',monospace",marginTop:'16px'}});
        fi.onchange=async e=>{
          const file=e.target.files[0];if(!file)return;
          upSt.style.display='block';upSt.textContent='Uploading...';
          const text=await file.text();const lines=text.split('\n').filter(l=>l.trim());
          const{data:deck}=await sb.from('flashcard_decks').insert({topic:dnI.value||file.name.replace('.csv','')}).select().single();
          if(!deck){upSt.textContent='Error';return;}
          const cards=lines.map(line=>{const parts=line.split(',');return{deck_id:deck.id,question:parts[0]?.trim(),answer:parts.slice(1).join(',').trim()};}).filter(c=>c.question&&c.answer);
          await sb.from('flashcards').insert(cards);upSt.textContent='✓ Uploaded '+cards.length+' cards!';setTimeout(()=>upSt.style.display='none',3000);
        };
        const ex=div({style:{background:'var(--bg)',border:'1px dashed var(--border)',borderRadius:'4px',padding:'32px',marginBottom:'20px'}});
        ex.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Example:'}),div({style:{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'2px',padding:'12px',marginBottom:'16px'},html:'<p style="font-family:\'DM Mono\',monospace;font-size:12px;color:var(--muted);line-height:1.8">What causes malaria?, Plasmodium falciparum<br>What stain is used for TB?, Ziehl-Neelsen stain</p>'}),field('Deck Name',dnI),fi);
        card.append(ex,upSt);content.innerHTML='';content.append(card);
      }

      if(tab==='questions'){
        const card=div({cls:'card fade'});
        card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'8px'},html:'Upload Vignette Questions'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:'TXT format: separate questions with a blank line.'}));
        const tI=inp('e.g. Bacteriology');
        const upSt=div({cls:'ok',style:{display:'none',marginTop:'16px'}});
        const fi=h('input',{type:'file',accept:'.txt',style:{color:'var(--muted)',fontSize:'13px',fontFamily:"'DM Mono',monospace",marginTop:'16px'}});
        fi.onchange=async e=>{
          const file=e.target.files[0];if(!file)return;
          upSt.style.display='block';upSt.textContent='Uploading...';
          const text=await file.text();const blocks=text.split('\n\n').filter(b=>b.trim());const qs=[];
          for(const block of blocks){const lines=block.split('\n').filter(l=>l.trim());if(lines.length<3)continue;const q={topic:tI.value||'General',question:'',option_a:'',option_b:'',option_c:'',option_d:'',option_e:'',correct_answer:'',explanation:'',is_global:true};q.question=lines[0];for(const line of lines.slice(1)){if(line.startsWith('A.')||line.startsWith('A)'))q.option_a=line.slice(2).trim();else if(line.startsWith('B.')||line.startsWith('B)'))q.option_b=line.slice(2).trim();else if(line.startsWith('C.')||line.startsWith('C)'))q.option_c=line.slice(2).trim();else if(line.startsWith('D.')||line.startsWith('D)'))q.option_d=line.slice(2).trim();else if(line.startsWith('E.')||line.startsWith('E)'))q.option_e=line.slice(2).trim();else if(line.toLowerCase().startsWith('answer:'))q.correct_answer=line.split(':')[1].trim().toUpperCase();else if(line.toLowerCase().startsWith('explanation:'))q.explanation=line.split(':').slice(1).join(':').trim();}if(q.question&&q.correct_answer)qs.push(q);}
          if(qs.length){await sb.from('vignette_questions').insert(qs);upSt.textContent='✓ Uploaded '+qs.length+' questions!';}else upSt.textContent='No valid questions found.';
          setTimeout(()=>upSt.style.display='none',4000);
        };
        const ex=div({style:{background:'var(--bg)',border:'1px dashed var(--border)',borderRadius:'4px',padding:'32px',marginBottom:'20px'}});
        ex.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Format:'}),div({style:{background:'var(--card)',border:'1px solid var(--border)',borderRadius:'2px',padding:'12px',marginBottom:'16px'},html:'<p style="font-family:\'DM Mono\',monospace;font-size:12px;color:var(--muted);line-height:2">A 25-year-old presents with fever...<br>A. Streptococcus pyogenes<br>B. Staphylococcus aureus<br>C. Neisseria meningitidis<br>D. Haemophilus influenzae<br>Answer: C<br>Explanation: Classic presentation...</p>'}),field('Topic Name',tI),fi);
        card.append(ex,upSt);content.innerHTML='';content.append(card);
      }

      if(tab==='testimonials'){
        const{data:tlist}=await sb.from('testimonials').select('*').order('created_at',{ascending:false});
        content.innerHTML='';
        const addCard=div({cls:'card',style:{marginBottom:'24px'}});
        addCard.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'20px'},html:'Add Testimonial'}));
        const nI=inp('e.g. Sarah K.');const tI=inp('e.g. USMLE Step 1 Student');
        const cI=h('textarea',{cls:'input',placeholder:"What did they say?",style:{minHeight:'100px',resize:'vertical',marginBottom:'20px'}});
        const sm=div({cls:'ok',style:{display:'none',marginTop:'12px'},html:'✓ Added!'});
        addCard.append(field('Student Name',nI),field('Title / Course (optional)',tI),h('label',{cls:'label',html:'Testimonial'}),cI,btn('Add Testimonial','btn-gold',async()=>{if(!nI.value||!cI.value)return;await sb.from('testimonials').insert({name:nI.value,title:tI.value,content:cI.value});sm.style.display='block';setTimeout(()=>{sm.style.display='none';loadTab('testimonials');},1500);}),sm);
        content.append(addCard);
        if(tlist&&tlist.length){
          const lc=div({cls:'card'});
          lc.append(h('h3',{style:{fontFamily:"'Playfair Display',serif",fontSize:'18px',marginBottom:'16px'},html:'Current Testimonials ('+tlist.length+')'}));
          tlist.forEach(t=>{
            const row=div({style:{padding:'16px 0',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'flex-start'}});
            const info=div({style:{flex:'1'}});info.append(div({style:{fontSize:'14px',color:'var(--text)',marginBottom:'4px'},html:t.name+(t.title?' · <span style="color:var(--dim);font-size:12px">'+t.title+'</span>':'')}),h('p',{style:{fontSize:'13px',color:'var(--muted)',fontStyle:'italic'},html:t.content}));
            row.append(info,btn('✕','',async()=>{await sb.from('testimonials').delete().eq('id',t.id);loadTab('testimonials');},{style:{background:'none',border:'none',color:'#8B0000',cursor:'pointer',fontSize:'16px',marginLeft:'12px'}}));
            lc.append(row);
          });
          content.append(lc);
        }
      }

      if(tab==='packages'){
        const{data:pkgs}=await sb.from('tutoring_packages').select('*').order('id');
        const card=div({cls:'card fade'});
        card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'24px'},html:'Tutoring Packages'}));
        const pkgData=[...(pkgs||[])];const inps={};
        pkgData.forEach((pkg,i)=>{
          const box=div({style:{marginBottom:'24px',padding:'20px',border:'1px solid var(--border)',borderRadius:'4px'}});
          box.append(div({cls:'mono',style:{marginBottom:'12px'},html:'Package '+(i+1)}));inps[pkg.id]={};
          const g=div({style:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'12px',marginBottom:'12px'}});
          ['name','price'].forEach(k=>{const i2=inp(k,'text',pkg[k]||'');inps[pkg.id][k]=i2;g.append(div({},[h('label',{cls:'label',html:k.charAt(0).toUpperCase()+k.slice(1)}),i2]));});
          box.append(g);
          ['sessions','features','selar_link'].forEach(k=>{const i2=inp(k==='selar_link'?'https://selar.co/...':'','text',pkg[k]||'');inps[pkg.id][k]=i2;box.append(div({style:{marginBottom:'12px'}},[h('label',{cls:'label',html:k.replace('_',' ')}),i2]));});
          card.append(box);
        });
        const sm=div({cls:'ok',style:{display:'none',marginTop:'12px'},html:'✓ Saved!'});
        card.append(btn('Save Packages','btn-gold',async()=>{for(const pkg of pkgData){const upd={id:pkg.id};Object.keys(inps[pkg.id]).forEach(k=>upd[k]=inps[pkg.id][k].value);await sb.from('tutoring_packages').upsert(upd);}sm.style.display='block';setTimeout(()=>sm.style.display='none',2000);}),sm);
        content.innerHTML='';content.append(card);
      }

      if(tab==='bookings'){
        const{data:books}=await sb.from('booking_requests').select('*').order('created_at',{ascending:false});
        const card=div({cls:'card fade'});
        const pend=(books||[]).filter(b=>b.status==='pending').length;
        card.append(h('h2',{style:{fontFamily:"'Playfair Display',serif",fontSize:'22px',marginBottom:'8px'},html:'Booking Requests'}),h('p',{cls:'muted',style:{fontSize:'14px',marginBottom:'24px'},html:pend+' new bookings'}));
        if(!books||!books.length){card.append(h('p',{style:{fontSize:'14px',color:'var(--dim)',textAlign:'center',padding:'20px'},html:'No bookings yet.'}));content.innerHTML='';content.append(card);return;}
        books.forEach(b=>{
          const row=div({style:{padding:'16px 0',borderBottom:'1px solid var(--border)'}});
          const inner2=div({style:{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}});
          const info=div({});info.append(div({style:{fontSize:'15px',color:'var(--text)',marginBottom:'4px'},html:b.name||'—'}),div({style:{fontSize:'12px',color:'var(--muted)',marginBottom:'4px'},html:(b.email||'—')+' · '+(b.package||'—')}));
          if(b.message)info.append(h('p',{style:{fontSize:'13px',color:'var(--dim)',fontStyle:'italic'},html:b.message}));
          info.append(div({cls:'mono',style:{marginTop:'4px'},html:new Date(b.created_at).toLocaleDateString()}));
          inner2.append(info,h('span',{style:{fontFamily:"'DM Mono',monospace",fontSize:'10px',letterSpacing:'1px',textTransform:'uppercase',color:b.status==='pending'?'var(--gold)':'var(--teal)'},html:b.status}));
          row.append(inner2);card.append(row);
        });
        content.innerHTML='';content.append(card);
      }
    }
    loadTab('settings');
  }

  showLogin();return page;
}

render();
