const TX={hi:{tag:'अपने गाँव/शहर की समस्या दिखाओ, AI रिपोर्ट बनाएगा',report:'समस्या बताओ',near:'मेरे पास की रिपोर्ट',home:'होम',s1:'1. फोटो लो',capture:'फोटो खींचो',retake:'दोबारा लो',s2:'2. जगह का नाम',placeph:'जैसे: राजोदा चौराहा',next:'आगे',s3:'3. AI रिपोर्ट',editnote:'सिर्फ विवरण बदल सकते हैं',polish:'सुधारो',submit:'जमा करो',disc:'यह एक नागरिक पहल है, सरकारी वेबसाइट नहीं।',all:'सब',sev:{high:'ज़्यादा',medium:'मध्यम',low:'कम'},types:{pothole:'गड्ढा',streetlight:'स्ट्रीट लाइट',drain:'नाली',pipeline:'पाइपलाइन',garbage:'कचरा',other:'अन्य'},like:'👍 पसंद',repost:'🔁 अभी भी ठीक नहीं',share:'📤 शेयर',empty:'पास में कोई रिपोर्ट नहीं',gps:'GPS ठीक नहीं है, खुली जगह जाकर दोबारा कोशिश करें',gpsden:'लोकेशन की अनुमति दें (ब्राउज़र सेटिंग)',notinfra:'इस फोटो में सार्वजनिक समस्या नहीं दिखी, दोबारा फोटो लें',done:'रिपोर्ट जमा हो गई!',dup:'यहाँ पहले से रिपोर्ट है, आप "अभी भी ठीक नहीं" दबा सकते हैं',wait:'कृपया रुकें...',nomic:'इस ब्राउज़र में माइक नहीं चलता, टाइप करें',camerr:'कैमरा नहीं खुला (HTTPS/अनुमति जाँचें)',loc:'लोकेशन मिल रही है...',needplace:'जगह का नाम लिखें'},
en:{tag:'Show a problem in your village/city, AI writes the report',report:'Report a problem',near:'Reports near me',home:'Home',s1:'1. Take photo',capture:'Capture',retake:'Retake',s2:'2. Place name',placeph:'e.g. Rajoda Chauraha',next:'Next',s3:'3. AI report',editnote:'You can edit only the description',polish:'Polish',submit:'Submit',disc:'This is a citizen initiative, not a government website.',all:'All',sev:{high:'High',medium:'Medium',low:'Low'},types:{pothole:'Pothole',streetlight:'Streetlight',drain:'Drain',pipeline:'Pipeline',garbage:'Garbage',other:'Other'},like:'👍 Like',repost:'🔁 Still not fixed',share:'📤 Share',empty:'No reports nearby',gps:'GPS weak, move to open area and retry',gpsden:'Please allow location permission',notinfra:'Photo does not show a public infrastructure problem, retake it',done:'Report submitted!',dup:'A report already exists here, you can press "Still not fixed"',wait:'Please wait...',nomic:'Mic not supported here, please type',camerr:'Camera failed (check HTTPS/permission)',loc:'Getting location...',needplace:'Enter place name'}};
let L=localStorage.lang||'hi';const $=i=>document.getElementById(i),t=k=>TX[L][k];
const uid=localStorage.uid||(localStorage.uid=crypto.randomUUID());
let pos=null,photo=null,ai=null,stream=null,map=null,markers=[],mapOn=false;
const api=(u,o)=>fetch(u,o&&{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...o,uid})}).then(async r=>{const j=await r.json();if(!r.ok)throw new Error(j.error);return j});
function render(){document.documentElement.lang=L;$('lang').textContent=L==='hi'?'EN':'हिं';
document.querySelectorAll('[data-i]').forEach(e=>e.textContent=t(e.dataset.i));
document.querySelectorAll('[data-ph]').forEach(e=>e.placeholder=t(e.dataset.ph));
const ft=$('ft'),fs=$('fs'),a=ft.value,b=fs.value;
ft.innerHTML=`<option value="">${t('all')}</option>`+Object.entries(t('types')).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');
fs.innerHTML=`<option value="">${t('all')}</option>`+Object.entries(t('sev')).map(([k,v])=>`<option value="${k}">${v}</option>`).join('');ft.value=a;fs.value=b}
function setLang(){L=L==='hi'?'en':'hi';localStorage.lang=L;render();if($('feed').classList.contains('show'))loadFeed();if(ai)showAI()}
function go(n){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('show'));$(n).classList.add('show');$('msg').textContent='';
if(n==='report'){resetR();startCam()}else stopCam();if(n==='feed')loadFeed()}
const stopCam=()=>{stream&&stream.getTracks().forEach(x=>x.stop());stream=null};
function resetR(){photo=null;ai=null;$('s1').hidden=false;$('s2').hidden=$('s3').hidden=true;$('place').value=''}
async function startCam(){$('msg').textContent='';$('shot').hidden=true;$('cam').hidden=false;$('snap').hidden=false;$('retake').hidden=true;$('gpsmsg').textContent='';
try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});$('cam').srcObject=stream}catch(e){$('msg').textContent=t('camerr')}}
function snap(){const v=$('cam');if(!v.videoWidth)return;$('gpsmsg').textContent=t('loc');
navigator.geolocation.getCurrentPosition(p=>{pos={lat:p.coords.latitude,lng:p.coords.longitude,acc:p.coords.accuracy};
const s=Math.min(1,1280/Math.max(v.videoWidth,v.videoHeight)),c=$('cv');c.width=v.videoWidth*s;c.height=v.videoHeight*s;c.getContext('2d').drawImage(v,0,0,c.width,c.height);
photo=c.toDataURL('image/jpeg',.7);$('shot').src=photo;$('shot').hidden=false;$('cam').hidden=true;$('snap').hidden=true;$('retake').hidden=false;stopCam();
if(pos.acc>150){$('gpsmsg').textContent='⚠️ '+t('gps')+' ('+Math.round(pos.acc)+'m)';photo=null;return}
$('gpsmsg').textContent='✅ GPS ±'+Math.round(pos.acc)+'m';$('s2').hidden=false;
api(`/api/geo?lat=${pos.lat}&lng=${pos.lng}`).then(g=>{pos.addr=g.address})},
()=>{$('gpsmsg').textContent=t('gpsden')},{enableHighAccuracy:true,timeout:15000,maximumAge:0})}
function mic(id){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR)return alert(t('nomic'));
const r=new SR();r.lang=L==='hi'?'hi-IN':'en-IN';r.onresult=e=>{$(id).value+=(id==='place'?'':' ')+e.results[0][0].transcript};r.start()}
async function analyze(){const pl=$('place').value.trim();if(!pl)return $('msg').textContent=t('needplace');if(!photo)return;
$('msg').textContent=t('wait');try{ai=await api('/api/analyze',{image:photo,place:pl+', '+(pos.addr||'')});$('msg').textContent='';
if(!ai.is_infrastructure_issue){$('msg').textContent=t('notinfra');go('report');$('msg').textContent=t('notinfra');return}
$('s1').hidden=$('s2').hidden=true;$('s3').hidden=false;$('rdesc').value=ai['description_'+L];showAI()}catch(e){$('msg').textContent=e.message}}
function showAI(){$('rtitle').textContent=ai['title_'+L];$('badge').innerHTML=`<span class="tag ${ai.severity}">${t('sev')[ai.severity]}</span><span class="tag ver">${t('types')[ai.type]||ai.type}</span>`}
async function polish(){$('msg').textContent=t('wait');try{const r=await api('/api/polish',{text:$('rdesc').value,lang:L});$('rdesc').value=r.text;$('msg').textContent=''}catch(e){$('msg').textContent=e.message}}
async function submitR(){$('msg').textContent=t('wait');const d=$('rdesc').value;
try{const r=await api('/api/reports',{image:photo,lat:pos.lat,lng:pos.lng,place:$('place').value,type:ai.type,severity:ai.severity,title_hi:ai.title_hi,title_en:ai.title_en,desc_hi:L==='hi'?d:ai.description_hi,desc_en:L==='en'?d:ai.description_en});
alert(r.duplicate?t('dup'):t('done'));go('feed')}catch(e){$('msg').textContent=e.message}}
function here(){return new Promise(res=>navigator.geolocation.getCurrentPosition(p=>res({lat:p.coords.latitude,lng:p.coords.longitude}),()=>res({lat:22.9676,lng:76.0534}),{timeout:8000}))}
async function loadFeed(){const h=await here();const q=new URLSearchParams({lat:h.lat,lng:h.lng,km:$('fk').value,type:$('ft').value,severity:$('fs').value});
const d=await api('/api/reports?'+q);$('list').innerHTML=d.length?d.map(r=>`<div class="card">${r.image?`<img src="${r.image}">`:''}<div class="b"><span class="tag ${r.severity}">${t('sev')[r.severity]}</span><span class="tag ver">${t('types')[r.type]||r.type}</span><b> ${r.status}</b>
<h3>${r['title_'+L]}</h3><p>${r['desc_'+L]}</p><small>📍 ${r.place}</small>
<div class="acts"><button onclick="act('${r.id}','likes')">${t('like')} ${r.likes}</button><button onclick="act('${r.id}','reposts')">${t('repost')} ${r.reposts}</button><button onclick="share('${r.id}','${encodeURIComponent(r['title_'+L])}')">${t('share')}</button></div></div></div>`).join(''):`<p>${t('empty')}</p>`;
if(mapOn)drawMap(d,h)}
async function act(id,a){await api(`/api/reports/${id}/${a}`,{});loadFeed()}
const share=(id,ti)=>window.open('https://wa.me/?text='+ti+'%20'+encodeURIComponent(location.origin+'/#'+id));
function toggleMap(){mapOn=!mapOn;$('map').hidden=!mapOn;loadFeed()}
function drawMap(d,h){if(!map){map=L_.map('map');L_.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map)}
map.setView([h.lat,h.lng],13);setTimeout(()=>map.invalidateSize(),100);markers.forEach(m=>m.remove());const C={high:'#d32f2f',medium:'#f9a825',low:'#2e7d32'};
markers=d.map(r=>L_.circleMarker([r.lat,r.lng],{radius:10,color:C[r.severity],fillOpacity:.8}).addTo(map).bindPopup(r['title_'+L]))}
const L_=window.L;
// bg.jpg hai ya nahi check karo
const im=new Image();im.onload=()=>document.querySelector('.hero').classList.add('has');im.src='bg.jpg';
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
render();
