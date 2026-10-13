const $=s=>document.querySelector(s), app=$('#app');
let lang=localStorage.getItem('opd_language')||'en',user=null,config={},patients=[],visits=[],current=null,authRole='patient',authTab='login',challenge=null,busy=false,filter='',queuePage=1,queueTab=null,patientEditing=false,patientNewVisitOpen=false;
window.newCapturedBlobFiles=[];
if(localStorage.getItem('opd_consent')===null){localStorage.setItem('opd_consent','true');}
const dict={
 title:['Patient history, ready to review.','मरीज की जानकारी, डॉक्टर की समीक्षा के लिए तैयार।'],subtitle:['Record your complaint, bring your documents together, and prepare for your consultation.','अपनी परेशानी बताएं, दस्तावेज़ जोड़ें और परामर्श के लिए जानकारी तैयार करें।'],patient:['Patient','मरीज'],staff:['Staff','स्टाफ'],doctor:['Doctor','डॉक्टर'],login:['Log in','लॉगिन'],register:['Register patient','मरीज पंजीकरण'],name:['Full name','पूरा नाम'],fatherName:['Father / guardian name','पिता / अभिभावक का नाम'],mobile:['Mobile number','मोबाइल नंबर'],email:['Email address','ईमेल'],city:['City','शहर'],state:['State','राज्य'],age:['Age (years)','आयु (वर्ष)'],password:['Password','पासवर्ड'],sendOtp:['Get demo OTP','डेमो OTP प्राप्त करें'],verify:['Verify & log in','सत्यापित करें और लॉगिन करें'],identifier:['Mobile number or email','मोबाइल नंबर या ईमेल'],logout:['Log out','लॉगआउट'],dashboard:['Dashboard','डैशबोर्ड'],newVisit:['Start new visit','नई विज़िट शुरू करें'],patientId:['Patient ID','मरीज ID'],visitId:['Visit ID','विज़िट ID'],intake:['Intake in progress','जानकारी भरना जारी'],submitted:['Submitted for staff review','स्टाफ समीक्षा के लिए जमा'],ready:['Ready for doctor','डॉक्टर के लिए तैयार'],reviewed:['Doctor reviewed','डॉक्टर ने समीक्षा की'],open:['Open visit','विज़िट खोलें'],search:['Search name, patient ID, visit ID or mobile','नाम, मरीज ID, विज़िट ID या मोबाइल खोजें'],history:['Relevant history','संबंधित इतिहास'],complaint:['Complaint','मुख्य परेशानी'],current_medicine:['Current medicines — patient reported','वर्तमान दवाएं — मरीज द्वारा बताई गई'],historical_medicine:['Historical prescriptions','पुराने प्रिस्क्रिप्शन'],allergy:['Allergies','एलर्जी'],lab:['Lab results','जांच परिणाम'],other:['Other recorded details','अन्य दर्ज जानकारी'],noFacts:['Not provided / not extracted','नहीं बताया गया / जानकारी नहीं निकली'],source:['Open source','स्रोत खोलें'],unknown:['Unknown date','तारीख अज्ञात'],attention:['Highlighted items to verify','सत्यापन हेतु महत्वपूर्ण जानकारी'],timeline:['Dated record timeline','तारीख अनुसार रिकॉर्ड'],documents:['Documents & original answers','दस्तावेज़ और मूल उत्तर'],tell:['Tell us your problem','अपनी परेशानी बताएं'],tellHint:['Describe your complaint, how long it has been present, medicines you currently take, and allergies if known. Only state what you know.','अपनी परेशानी, अवधि, वर्तमान दवाएं और ज्ञात एलर्जी बताएं। केवल ज्ञात जानकारी दें।'],record:['Speak','बोलें'],stop:['Stop recording','रिकॉर्डिंग रोकें'],save:['Save & extract facts','सहेजें और जानकारी निकालें'],upload:['Upload files','फाइल अपलोड करें'],camera:['Capture with camera','कैमरे से स्कैन करें'],uploadHint:['JPG, PNG, WEBP or PDF. Maximum 10 MB per file.','JPG, PNG, WEBP या PDF। प्रत्येक फाइल अधिकतम 10 MB।'],questions:['Clarify missing details','अधूरी जानकारी स्पष्ट करें'],answer:['Save answers','उत्तर सहेजें'],submit:['Submit for staff review','स्टाफ समीक्षा के लिए जमा करें'],markReady:['Mark ready for doctor','डॉक्टर के लिए तैयार करें'],reopen:['Reopen patient intake','मरीज की जानकारी फिर खोलें'],review:['Save doctor review','डॉक्टर की समीक्षा सहेजें'],doctorNote:['Doctor review note','डॉक्टर की समीक्षा टिप्पणी'],profile:['Basic information','मूल जानकारी'],edit:['Edit / verify','बदलें / सत्यापित करें'],retry:['Retry extraction','जानकारी फिर निकालें'],failed:['Extraction failed — original saved','जानकारी नहीं निकली — मूल स्रोत सहेजा गया'],done:['Extracted — review required','जानकारी निकली — समीक्षा आवश्यक'],saved:['Saved','सहेजा गया'],processing:['Processing','प्रोसेसिंग जारी'],close:['Close','बंद करें'],cancel:['Cancel','रद्द करें'],check:['Mark checked','जांच पूरी दर्ज करें'],print:['Print summary','सारांश प्रिंट करें'],account:['My profile','मेरी प्रोफाइल'],empty:['No visits yet. Start a visit to record information.','अभी कोई विज़िट नहीं। जानकारी दर्ज करने के लिए विज़िट शुरू करें।'],back:['Back to dashboard','डैशबोर्ड पर वापस'],patient_reported:['Patient / attendant reported','मरीज / परिचारक द्वारा बताया गया'],unverified_extraction:['AI extraction — unverified','AI जानकारी — असत्यापित'],staff_checked:['Staff checked','स्टाफ द्वारा जांचा गया'],doctor_checked:['Doctor checked','डॉक्टर द्वारा जांचा गया'],uncertain:['Unreadable / uncertain','अपठनीय / अस्पष्ट'],department:['Department','विभाग'],qualification:['Qualification','योग्यता'],employeeId:['Employee ID','कर्मचारी ID'],optional:['optional','वैकल्पिक'],consent:['I agree to send these demo records/audio to OpenAI for extraction or transcription. Use synthetic records for this demonstration.','मैं डेमो रिकॉर्ड/ऑडियो को जानकारी निकालने हेतु OpenAI को भेजने के लिए सहमत हूं। इस प्रदर्शन में काल्पनिक रिकॉर्ड उपयोग करें।'],noKey:['OpenAI is not configured. Configure OPENAI_API_KEY in Vercel settings and redeploy (or .env locally). Registration and portal navigation still work.','OpenAI कॉन्फ़िगर नहीं है। Vercel सेटिंग में OPENAI_API_KEY जोड़ें और फिर deploy करें। पंजीकरण और पोर्टल उपलब्ध हैं।'],demo:['Demo mode: fixed OTP; no SMS or email is sent.','डेमो मोड: निश्चित OTP; SMS या ईमेल नहीं भेजा जाता।'],safety:['Draft facts with original evidence. No diagnosis or treatment suggestions. Unreadable information remains unresolved.','मूल स्रोतों के साथ जानकारी का ड्राफ्ट। कोई निदान या उपचार सुझाव नहीं। अपठनीय जानकारी अनसुलझी रहती है।'],checkMissing:['Check gaps & possible conflicts','अधूरी / विरोधाभासी जानकारी जांचें'],sourceQuote:['Source excerpt — verify against original','स्रोत अंश — मूल दस्तावेज़ से जांचें'],readyHint:['Staff preparation completed. Unverified or missing information remains visible.','स्टाफ तैयारी पूरी। असत्यापित या अधूरी जानकारी दिखाई देती रहेगी।'],noVitals:['No vitals recorded','वाइटल्स दर्ज नहीं हैं'],vitals:['Patient Vitals','मरीज के वाइटल्स'],addVitals:['Record vitals','वाइटल्स दर्ज करें'],weight:['Weight (kg)','वजन (किलो)'],height:['Height (cm)','कद (सेमी)'],bp:['Blood pressure (BP)','रक्तचाप (BP)'],pulse:['Pulse rate (bpm)','नाड़ी गति (bpm)'],sugar:['Blood sugar (mg/dL)','ब्लड शुगर (mg/dL)'],sugarType:['Sugar test timing','जांच का प्रकार'],fasting:['Fasting','खाली पेट (फास्टिंग)'],random:['Random','रैंडम'],pp:['Post-prandial (PP)','खाने के बाद (PP)'],vitalsHistory:['Vitals history & trends','वाइटल्स इतिहास व ट्रैक'],assignStaff:['Assign to staff with note','स्टाफ को समीक्षा हेतु भेजें'],assignNote:['Doctor note for staff (corrections/verification needed)','स्टाफ के लिए निर्देश / सुधार टिप्पणी'],assignedBanner:['Doctor requested staff review & correction','डॉक्टर ने समीक्षा व सुधार का अनुरोध किया है'],quickReview:['Save review & complete consultation','समीक्षा पूरी करें व सहेजें'],quickNotes:['Quick notes:','त्वरित टिप्पणी:'],markDone:['Mark as done','परामर्श पूर्ण']};
const t=k=>dict[k]?.[lang==='hi'?1:0]||k;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=x=>x?new Date(x).toLocaleString(lang==='hi'?'hi-IN':'en-IN') :t('unknown');
const val=f=>lang==='hi'?f.value_hi:f.value_en;
const badge=s=>`<span class="badge ${esc(s)}">${esc(t(s))}</span>`;
function toast(msg){const el=$('#toast');el.textContent=msg;el.style.display='block';clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.style.display='none',6000);}
async function api(p,b){const r=await fetch('/api'+p,{method:b===undefined?'GET':'POST',headers:b===undefined?{}:{'Content-Type':'application/json'},body:b===undefined?undefined:JSON.stringify(b)});let j;try{j=await r.json();}catch{throw new Error('Server returned an invalid response. Check the deployment logs. / सर्वर प्रतिक्रिया जांचें।');}if(!r.ok)throw new Error(j.error+(j.detail?' '+j.detail:''));return j;}
async function task(fn){if(busy)return;busy=true;const bar=document.createElement('div');bar.className='busy-bar';document.body.append(bar);document.querySelectorAll('button').forEach(b=>b.disabled=true);try{await fn();}catch(e){toast(e.message);if(current){try{renderVisit(await api('/visits/'+current.id));}catch{}}}finally{busy=false;bar.remove();document.querySelectorAll('button').forEach(b=>b.disabled=false);}}
function header(){return `<header><div class="brand"><i>+</i>OPD <span>Brief</span></div><div class="top-actions">${user?`<span class="muted">${esc(user.name)} · ${t(user.role)}</span><button class="secondary small" data-action="account">${t('account')}</button>`:''}<button class="secondary small" data-action="language">${lang==='en'?'हिन्दी':'English'}</button>${user?`<button class="secondary small" data-action="logout">${t('logout')}</button>`:''}</div></header>`;}
function footer(){return `<div class="page-footer">${t('safety')}</div>`;}
function profileFields(p={}){return ['name','fatherName','mobile','email','city','state','age'].map(k=>{const hints={name:lang==='hi'?'पूरा नाम दर्ज करें':'Enter full name',fatherName:'',mobile:lang==='hi'?'10 अंकों का मोबाइल नंबर (प्रति मरीज एक)':'10-digit mobile — one patient per number',email:lang==='hi'?'सही ईमेल पता (वैकल्पिक)':'Valid email address (optional)',age:lang==='hi'?'0 से 120 के बीच आयु':'Age between 0 and 120',city:'',state:''};return `<div class="field"><label for="field-${k}">${t(k)} ${['name','mobile','age'].includes(k)?'<span class="req-star">*</span>':`<span class="opt-label">(${t('optional')})</span>`}</label><input id="field-${k}" name="${k}" ${['name','mobile','age'].includes(k)?'required':''} ${k==='age'?'type="number" min="0" max="120" step="1"':k==='email'?'type="email" autocomplete="email"':k==='mobile'?'type="tel" inputmode="numeric" pattern="[0-9]{10}" maxlength="10" autocomplete="tel"':k==='name'?'autocomplete="name"':''} value="${esc(p[k]||'')}" data-field="${k}"><span class="field-hint" id="hint-${k}">${hints[k]||''}</span><span class="field-error" id="err-${k}"></span></div>`;}).join('');}
function consent(){const checked=localStorage.getItem('opd_consent')!=='false';return `<label class="consent"><input type="checkbox" id="consent" ${checked?'checked':''}>${t('consent')}</label>`;}
function normalizeFactString(s){return String(s||'').toLowerCase().replace(/[^\w\s\u0900-\u097F]/g,' ').replace(/\s+/g,' ').trim();}
function getConceptKey(f){
  const text=normalizeFactString((f.label||'')+' '+(f.value_en||'')+' '+(f.value_hi||''));
  if(f.category==='complaint'||f.category==='history'){
    if(/adheren|intermittent|on and off|compliance|irregular|take medicines|medicine use|दवा छोड़/.test(text))return 'concept_med_adherence';
    if(/control|poor glycaemic|glycemic control|uncontrolled/.test(text))return 'concept_glycaemic_control';
    if(/duration|years|since 2011|\b2011\b|diagnosed/.test(text)&&/diabet|sugar|मधुमेह/.test(text))return 'concept_diabetes_duration';
    if(/thirst|thirsty|water|polydipsia|प्यास/.test(text))return 'concept_thirst';
    if(/urin|pee|polyuria|toilet|मूत्र|पेशाब/.test(text))return 'concept_urination';
    if(/tired|fatigue|exhaust|weak|कमजोरी|थकान/.test(text))return 'concept_tiredness';
    if(/blur|vision|eye|sight|धुंधला|दृष्टि/.test(text))return 'concept_blurred_vision';
    if(/diabet|sugar|मधुमेह|शुगर/.test(text))return 'concept_diabetes';
    if(/fever|temp|pyrexia|बुखार/.test(text))return 'concept_fever';
    if(/cough|khansi|खांसी/.test(text))return 'concept_cough';
    if(/headache|sir\s*dard|सर\s*दर्द/.test(text))return 'concept_headache';
    if(/hypertens|blood\s*pressure|\bbp\b|रक्तचाप/.test(text))return 'concept_hypertension';
    if(/chest\s*pain|angina|छाती/.test(text))return 'concept_chest_pain';
    if(/vomit|nausea|उल्टी|मतली/.test(text))return 'concept_vomiting';
  }
  if(f.category==='allergy'){
    const match=text.match(/ceftriaxone|ceftrexon|penicillin|aspirin|sulfa|dust|pollen|peanut|लैक्टोज|सल्फा/);
    if(match)return 'allergy_'+match[0];
  }
  if(f.category==='current_medicine'||f.category==='historical_medicine'){
    const match=text.match(/metformin|glimepiride|insulin|aspirin|atorvastatin|amlodipine|losartan|telmisartan|pantoprazole|paracetamol|ceftriaxone/);
    if(match)return 'med_'+match[0];
  }
  if(f.category==='lab'){
    if(/hba1c|glycated|a1c/.test(text))return 'concept_lab_hba1c';
    if(/fasting|glucose|fbs|ppbs|sugar/.test(text))return 'concept_lab_glucose';
    if(/creatinine|egfr|urea|kidney/.test(text))return 'concept_lab_kidney';
    if(/lipid|cholesterol|triglyceride/.test(text))return 'concept_lab_lipid';
  }
  const words=text.split(' ').filter(w=>w.length>3&&!['have','been','with','from','this','that','years','days','weeks','month','months','report','reports','patient','during'].includes(w));
  return words.slice(0,3).sort().join('_')||text;
}
function deduplicateFacts(facts){
  if(!Array.isArray(facts))return [];
  const result=[];
  for(const f of facts){
    if(!f||typeof f!=='object')continue;
    const cat=f.category||'other';
    const key=getConceptKey(f);
    const normEn=normalizeFactString(f.value_en||f.label);
    const idx=result.findIndex(existing=>{
      const sameOrRelatedCat=(existing.category===cat)||
        (['complaint','history'].includes(existing.category)&&['complaint','history'].includes(cat))||
        (['current_medicine','historical_medicine'].includes(existing.category)&&['current_medicine','historical_medicine'].includes(cat));
      if(!sameOrRelatedCat)return false;
      const existingKey=getConceptKey(existing);
      if(key&&existingKey&&key===existingKey)return true;
      const existNormEn=normalizeFactString(existing.value_en||existing.label);
      if(normEn&&existNormEn){
        if(normEn===existNormEn)return true;
        if(normEn.length>8&&existNormEn.length>8){
          if(normEn.includes(existNormEn)||existNormEn.includes(normEn))return true;
        }
      }
      return false;
    });
    if(idx===-1){
      result.push({...f});
    }else{
      const prev=result[idx];
      const prevScore=(prev.value_en||'').length+(prev.date?20:0)+(prev.verification&&prev.verification.includes('checked')?30:0);
      const currScore=(f.value_en||'').length+(f.date?20:0)+(f.verification&&f.verification.includes('checked')?30:0);
      const label=(prev.label&&prev.label.length<35)?prev.label:f.label;
      const label_hi=(prev.label_hi&&prev.label_hi.length<35)?prev.label_hi:f.label_hi;
      if(currScore>prevScore){
        result[idx]={...prev,...f,label,label_hi,id:prev.id};
      }else{
        result[idx]={...f,...prev,label,label_hi};
      }
    }
  }
  return result;
}
function deduplicateGaps(gaps){
  if(!Array.isArray(gaps))return [];
  const seen=new Set();
  const res=[];
  for(const g of gaps){
    if(!g)continue;
    const str=typeof g==='string'?g:(g.en||g.hi||'');
    const norm=normalizeFactString(str);
    if(!norm||seen.has(norm))continue;
    seen.add(norm);
    res.push(g);
  }
  return res;
}
function hasPatientFilledInfo(v){if(!v)return false;const hasUserSources=(v.sources||[]).some(s=>s.type!=='history_carryover');const hasNewFacts=(v.facts||[]).some(f=>!f.isCarriedOver);return hasUserSources||hasNewFacts;}
function validateProfileForm(form){let ok=true;const show=(id,msg)=>{const el=form.querySelector('#err-'+id)||document.getElementById('err-'+id);if(el){el.textContent=msg;el.style.display=msg?'block':'none';}};const get=n=>(form.elements[n]?.value||'').trim();
  // Name
  if(!get('name')){show('name',lang==='hi'?'नाम आवश्यक है':'Full name is required');ok=false;}else show('name','');
  // Mobile: exactly 10 digits
  const mob=get('mobile').replace(/[\s()-]/g,'').replace(/^\+91/,'');
  if(!mob){show('mobile',lang==='hi'?'मोबाइल नंबर आवश्यक है':'Mobile number is required');ok=false;}
  else if(!/^\d{10}$/.test(mob)){show('mobile',lang==='hi'?'10 अंकों का मोबाइल नंबर दर्ज करें':'Enter a valid 10-digit mobile number');ok=false;}
  else show('mobile','');
  // Email: optional but must be valid if provided
  const em=get('email');
  if(em&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){show('email',lang==='hi'?'सही ईमेल पता दर्ज करें':'Enter a valid email address');ok=false;}else show('email','');
  // Age
  const age=get('age');
  if(!age){show('age',lang==='hi'?'आयु आवश्यक है':'Age is required');ok=false;}
  else if(!/^\d{1,3}$/.test(age)||Number(age)>120||Number(age)<0){show('age',lang==='hi'?'0 से 120 के बीच आयु दर्ज करें':'Enter age between 0 and 120');ok=false;}
  else show('age','');
  return ok;
}
function calcBMI(w,h){
  const wt=Number(w),ht=Number(h);if(!Number.isFinite(wt)||!Number.isFinite(ht)||wt<=0||ht<=0)return null;
  return {bmi:+(wt/((ht/100)**2)).toFixed(1),cat:lang==='hi'?'दर्ज माप से गणना':'Calculated from entered measurements',cls:'info'};
}
function evalBP(bp){return bp?{val:bp,cat:lang==='hi'?'स्टाफ द्वारा दर्ज':'Staff recorded',cls:'info'}:null;}
function evalPulse(p){return p?{val:p,cat:lang==='hi'?'स्टाफ द्वारा दर्ज':'Staff recorded',cls:'info'}:null;}
function evalSugar(s,type){
  if(!s)return null;
  const labels={fasting:lang==='hi'?'फास्टिंग':'Fasting',pp:lang==='hi'?'खाने के बाद':'Post-meal',random:lang==='hi'?'रैंडम':'Random'};
  return {val:s,cat:lang==='hi'?'स्टाफ द्वारा दर्ज':'Staff recorded',cls:'info',type:labels[type]||(lang==='hi'?'प्रकार अज्ञात':'Timing unknown')};
}
function renderVitalsDashboard(v,canAdd=false){
  const list=v.vitals||[];
  const last=list.length?list[list.length-1]:null;
  const bmi=last?calcBMI(last.weight,last.height):null;
  const bpInfo=last?evalBP(last.bp):null;
  const pulseInfo=last?evalPulse(last.pulse):null;
  const sugarInfo=last?evalSugar(last.sugar,last.sugarType):null;
  return `<section class="vitals-panel">
    <div class="vitals-header">
      <div>
        <h2 style="margin:0;font-size:18px;display:flex;align-items:center;gap:7px;">
          <span style="color:#126b52">●</span> ${t('vitals')}
        </h2>
        <span class="muted" style="font-size:12px;">${last?`${lang==='hi'?'नवीनतम दर्ज':'Latest recorded'}: ${date(last.recordedAt)} · ${esc(last.recordedBy)}`:t('noVitals')}</span>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        ${list.length>1?`<button class="secondary small" data-action="vitals-history">⏱ ${t('vitalsHistory')} (${list.length})</button>`:''}
        ${canAdd?`<button class="small" data-action="open-vitals-modal">+ ${t('addVitals')}</button>`:''}
      </div>
    </div>
    ${last?`
      <div class="vitals-grid">
        <div class="vital-box ${bmi?bmi.cls:'ok'}">
          <div class="vital-name">${t('weight')} / ${t('height')}</div>
          <div class="vital-val">${last.weight?esc(last.weight):'—'}<span class="vital-unit">kg</span> ${last.height?`· ${esc(last.height)}<span class="vital-unit">cm</span>`:''}</div>
          ${bmi?`<span class="vital-tag ${bmi.cls}">BMI ${bmi.bmi} (${bmi.cat})</span>`:''}
        </div>
        <div class="vital-box ${bpInfo?bpInfo.cls:'ok'}">
          <div class="vital-name">${t('bp')}</div>
          <div class="vital-val">${last.bp?esc(last.bp):'—'} <span class="vital-unit">mmHg</span></div>
          ${bpInfo&&bpInfo.cat?`<span class="vital-tag ${bpInfo.cls}">${esc(bpInfo.cat)}</span>`:''}
        </div>
        <div class="vital-box ${pulseInfo?pulseInfo.cls:'ok'}">
          <div class="vital-name">${t('pulse')}</div>
          <div class="vital-val">${last.pulse?esc(last.pulse):'—'} <span class="vital-unit">bpm</span></div>
          ${pulseInfo&&pulseInfo.cat?`<span class="vital-tag ${pulseInfo.cls}">${esc(pulseInfo.cat)}</span>`:''}
        </div>
        <div class="vital-box ${sugarInfo?sugarInfo.cls:'ok'}">
          <div class="vital-name">${t('sugar')}</div>
          <div class="vital-val">${last.sugar?esc(last.sugar):'—'} <span class="vital-unit">mg/dL</span></div>
          ${sugarInfo?`<span class="vital-tag ${sugarInfo.cls}">${esc(sugarInfo.type)}: ${esc(sugarInfo.cat)}</span>`:''}
        </div>
      </div>
    `:`<div style="padding:14px;background:#f7faf8;border-radius:10px;text-align:center;color:var(--muted);font-size:13px;">
        ${t('noVitals')}. ${canAdd?lang==='hi'?'मरीज की जांच कर वाइटल्स दर्ज करें।':'Record patient vitals before doctor review.':''}
      </div>`}
  </section>`;
}
function vitalsModal(){
  modal(`<h3>${t('addVitals')}</h3>
    <p class="muted">${lang==='hi'?'वजन, कद, रक्तचाप, नाड़ी गति और ब्लड शुगर दर्ज करें:':'Record patient weight, height, BP, pulse rate and blood glucose:'}</p>
    <form id="vitals-form">
      <div class="form-grid">
        <div class="field">
          <label for="vit-weight">${t('weight')}</label>
          <input id="vit-weight" name="weight" type="number" step="0.1" min="1" max="300" placeholder="e.g. 68.5" data-field="vital-weight">
          <span class="field-hint">${lang==='hi'?'किलोग्राम (1–300)':'kg (1–300)'}</span>
          <span class="field-error" id="err-vital-weight"></span>
        </div>
        <div class="field">
          <label for="vit-height">${t('height')}</label>
          <input id="vit-height" name="height" type="number" step="0.5" min="30" max="250" placeholder="e.g. 170" data-field="vital-height">
          <span class="field-hint">${lang==='hi'?'सेंटीमीटर (30–250)':'cm (30–250)'}</span>
          <span class="field-error" id="err-vital-height"></span>
        </div>
        <div class="field">
          <label for="vit-bp">${t('bp')}</label>
          <input id="vit-bp" name="bp" placeholder="120/80" pattern="\\d{2,3}\\s*\\/\\s*\\d{2,3}" data-field="vital-bp">
          <span class="field-hint">${lang==='hi'?'सिस्टोलिक/डायस्टोलिक (उदा. 120/80)':'SYS/DIA format (e.g. 120/80)'}</span>
          <span class="field-error" id="err-vital-bp"></span>
        </div>
        <div class="field">
          <label for="vit-pulse">${t('pulse')}</label>
          <input id="vit-pulse" name="pulse" type="number" min="30" max="250" placeholder="72" data-field="vital-pulse">
          <span class="field-hint">${lang==='hi'?'धड़कन प्रति मिनट (30–250)':'bpm (30–250)'}</span>
          <span class="field-error" id="err-vital-pulse"></span>
        </div>
        <div class="field">
          <label for="vit-sugar">${t('sugar')}</label>
          <input id="vit-sugar" name="sugar" type="number" min="20" max="600" placeholder="110" data-field="vital-sugar">
          <span class="field-hint">${lang==='hi'?'mg/dL (20–600)':'mg/dL (20–600)'}</span>
          <span class="field-error" id="err-vital-sugar"></span>
        </div>
        <div class="field">
          <label for="vit-sugarType">${t('sugarType')}</label>
          <select id="vit-sugarType" name="sugarType">
            <option value="random">${t('random')}</option>
            <option value="fasting">${t('fasting')}</option>
            <option value="pp">${t('pp')}</option>
          </select>
        </div>
      </div>
      <div id="vitals-form-error" class="error" style="margin-top:10px;display:none;"></div>
      <div class="actions">
        <button>${t('saved')}</button>
        <button type="button" class="secondary" data-action="close">${t('cancel')}</button>
      </div>
    </form>`);
}
function vitalsHistoryModal(v){
  const list=v.vitals||[];
  modal(`<h3>${t('vitalsHistory')}</h3>
    <p class="muted">${esc(v.patient.name)} (${esc(v.patient.id)}) · ${t('visitId')}: ${esc(v.id)}</p>
    ${list.length?`
      <table class="vitals-table">
        <thead>
          <tr>
            <th>${lang==='hi'?'तारीख व समय':'Timestamp'}</th>
            <th>${t('weight')}</th>
            <th>${t('height')}</th>
            <th>BMI</th>
            <th>${t('bp')}</th>
            <th>${t('pulse')}</th>
            <th>${t('sugar')}</th>
            <th>${lang==='hi'?'दर्जकर्ता':'Staff'}</th>
          </tr>
        </thead>
        <tbody>
          ${list.slice().reverse().map(vt=>{
            const b=calcBMI(vt.weight,vt.height);
            const bpI=evalBP(vt.bp);
            const sugI=evalSugar(vt.sugar,vt.sugarType);
            return `<tr>
              <td><small>${date(vt.recordedAt)}</small></td>
              <td>${vt.weight?`${esc(vt.weight)} kg`:'—'}</td>
              <td>${vt.height?`${esc(vt.height)} cm`:'—'}</td>
              <td>${b?`<span class="vital-tag ${b.cls}">${b.bmi}</span>`:'—'}</td>
              <td>${vt.bp?`${esc(vt.bp)} ${bpI?`<small class="vital-tag ${bpI.cls}">${esc(bpI.cat)}</small>`:''}`:'—'}</td>
              <td>${vt.pulse?`${esc(vt.pulse)} bpm`:'—'}</td>
              <td>${vt.sugar?`${esc(vt.sugar)} mg/dL ${sugI?`<small class="vital-tag ${sugI.cls}">(${esc(sugI.type)})</small>`:''}`:'—'}</td>
              <td><small>${esc(vt.recordedBy)}</small></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    `:`<p class="muted">${t('noVitals')}</p>`}`);
}
function validateVitalsForm(form){
  const w=form.weight.value.trim(), h=form.height.value.trim(), bp=form.bp.value.trim(), pulse=form.pulse.value.trim(), sugar=form.sugar.value.trim();
  const errBox=form.querySelector('#vitals-form-error');
  if(!w&&!h&&!bp&&!pulse&&!sugar){
    if(errBox){errBox.textContent=lang==='hi'?'कृपया कम से कम एक वाइटल दर्ज करें।':'Please enter at least one vital sign.';errBox.style.display='block';}
    return false;
  }
  if(errBox)errBox.style.display='none';
  if(bp&&!/^\d{2,3}\s*\/\s*\d{2,3}$/.test(bp)){
    if(errBox){errBox.textContent=lang==='hi'?'BP को सिस्टोलिक/डायस्टोलिक (उदा. 120/80) प्रारूप में दर्ज करें।':'Enter BP in SYS/DIA format (e.g. 120/80).';errBox.style.display='block';}
    return false;
  }
  return true;
}
function ensureConsent(){const cb=$('#consent');const ok=cb?cb.checked:(localStorage.getItem('opd_consent')!=='false');if(!ok)throw new Error(lang==='hi'?'पहले OpenAI प्रोसेसिंग की सहमति दें।':'Confirm OpenAI processing consent first.');}
function renderAuth(){app.innerHTML=header()+`<main class="wrap"><div class="hero"><div class="eyebrow">T01 · The Two-Minute Doctor</div><h1>${t('title')}</h1><p>${t('subtitle')}</p></div><div class="login-layout"><section class="panel"><div class="tabs">${['patient','staff','doctor'].map(r=>`<button class="${r===authRole?'active':''}" data-action="role" data-role="${r}">${t(r)}</button>`).join('')}</div>${authRole==='patient'?`<div class="tabs"><button class="${authTab==='login'?'active':''}" data-action="auth-tab" data-tab="login">${t('login')}</button><button class="${authTab==='register'?'active':''}" data-action="auth-tab" data-tab="register">${t('register')}</button></div>`:''}<div id="auth-error" class="error" role="alert"></div>${authRole==='patient'&&authTab==='register'?`<form id="registration"><div class="form-grid">${profileFields()}</div><div class="actions"><button>${t('register')}</button></div></form><div class="notice">${lang==='en'?'Or speak your details, review the transcript, then fill the form with AI.':'या अपनी जानकारी बोलें, ट्रांसक्रिप्ट जांचें और AI से फॉर्म भरें।'}</div><textarea id="reg-transcript" placeholder="${esc(t('profile'))}"></textarea><div class="actions"><button class="secondary" data-action="record" data-target="reg-transcript">${t('record')}</button><button class="secondary" data-action="extract-profile">${lang==='hi'?'फॉर्म भरें':'Fill form from transcript'}</button></div>${consent()}`:authRole==='patient'?`<form id="patient-login"><div class="field"><label>${t('identifier')}</label><input name="identifier" required autocomplete="username"></div>${challenge?`<div class="field"><label>OTP</label><input name="otp" inputmode="numeric" required maxlength="6" placeholder="${esc(config.otp)}"></div>`:''}<div class="actions"><button>${t(challenge?'verify':'sendOtp')}</button></div></form>`:`<form id="staff-login"><div class="field"><label>${t('email')}</label><input name="email" type="email" required value="${authRole}@opd.demo" autocomplete="username"></div><div class="field"><label>${t('password')}</label><input name="password" type="password" required autocomplete="current-password" value="${authRole==='staff'?'Staff@123':'Doctor@123'}"></div><div class="actions"><button>${t('login')}</button></div></form>`}</section><section class="panel"><h2>${lang==='hi'?'एक साझा मरीज रिकॉर्ड':'One shared patient record'}</h2><p>${lang==='hi'?'मरीज जानकारी भरता है। स्टाफ अधूरी जानकारी जांचता है। डॉक्टर स्रोतों सहित सारांश देखता है।':'Patients record their story. Staff checks missing information. Doctors review a concise summary with original evidence.'}</p><div class="credentials"><strong>${t('demo')}</strong><br>OTP: <strong>${esc(config.otp||'123456')}</strong><br>Staff: staff@opd.demo / Staff@123<br>Doctor: doctor@opd.demo / Doctor@123</div>${!config.aiReady?`<div class="notice">${t('noKey')}</div>`:`<div class="notice success">OpenAI · ${esc(config.model)}</div>`}<p class="muted">${t('safety')}</p></section></div>${footer()}</main>`;}
async function load(){const me=await api('/me');user=me.user;if(!queueTab)queueTab=user.role==='doctor'?'ready':'intake';[visits,patients]=await Promise.all([api('/visits'),user.role==='patient'?Promise.resolve([me.patient]):api('/patients')]);if(user.role==='patient'){patientEditing=false;patientNewVisitOpen=false;renderDashboard();return;}renderDashboard();}
function renderDashboard(){
  current=null;
  const p=patients.find(x=>x.id===user.patientId);
  if(user.role==='patient'){
    const sorted=[...visits].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
    const newVisitFormHTML=patientNewVisitOpen?`
      <section id="patient-new-visit-panel" class="panel no-print" style="border:2px solid #126b52;background:#fbfdfc;box-shadow:0 4px 16px rgba(18,107,82,0.08);border-radius:12px;margin-bottom:24px;padding:24px;">
        <div class="section-title" style="margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
          <h2 style="color:#126b52;margin:0;font-size:20px;display:flex;align-items:center;gap:8px;">
            <span>📝</span> ${lang==='hi'?'वर्तमान परेशानी व डॉक्टर परामर्श का कारण':'Current Issue & Reason for Doctor Visit'}
          </h2>
          <div style="display:flex;gap:8px;align-items:center;">
            <span class="badge intake" style="font-weight:700;">${lang==='hi'?'नई विज़िट प्रविष्टि':'New visit entry'}</span>
            <button type="button" class="secondary small" data-action="cancel-new-visit" style="padding:4px 10px;font-size:12px;">✕ ${lang==='hi'?'रद्द करें':'Cancel'}</button>
          </div>
        </div>
        <p class="muted" style="margin-top:-2px;font-size:13.5px;line-height:1.5;">
          ${lang==='hi'?'डॉक्टर से परामर्श का वर्तमान कारण लिखें या बोलें। यदि कोई नई जांच रिपोर्ट या पर्ची हो तो उसे भी नीचे जोड़ें:':'Please enter the current issue why you are visiting the doctor, and attach any new reports or documents if available:'}
        </p>

        <div class="row" style="margin-bottom:12px;align-items:center;">
          <label for="new-speaker" style="font-size:13px;font-weight:600;color:var(--muted);">${lang==='hi'?'जानकारी देने वाला:':'Speaking on behalf of:'}</label>
          <select id="new-speaker" style="width:auto;padding:6px 10px;font-size:13px;border-radius:6px;">
            <option value="patient">${t('patient')}</option>
            <option value="attendant">${lang==='hi'?'परिचारक (Attendant)':'Attendant'}</option>
          </select>
        </div>

        <div class="field" style="margin-bottom:16px;">
          <label for="new-complaint" style="font-weight:700;font-size:14.5px;color:#183b32;margin-bottom:8px;display:block;">
            ${lang==='hi'?'वर्तमान समस्या / लक्षण (बोलें या लिखें):':'Current issue / Reason for visiting doctor (type or speak):'}
          </label>
          <textarea id="new-complaint" style="min-height:110px;font-size:14.5px;line-height:1.5;padding:12px;border-radius:8px;border:1px solid #cedbd3;width:100%;box-sizing:border-box;" placeholder="${lang==='hi'?'उदा. पिछले 2 दिनों से तेज बुखार, खांसी, या डायबिटीज की नियमित जांच व दवाओं के लिए...':'e.g. Fever and body ache for 2 days, or coming for regular diabetes checkup and medicine refill...'}"></textarea>
        </div>

        <div class="file-zone" style="border:2px dashed #b7cec2;background:#f3f7f4;padding:18px;border-radius:10px;margin-bottom:16px;">
          <div style="font-weight:700;font-size:14px;color:#1b4d3e;margin-bottom:4px;">
            📄 ${lang==='hi'?'नई जांच रिपोर्ट या पर्ची अपलोड करें (यदि उपलब्ध हो)':'Upload new documents or reports (if available)'}
          </div>
          <div class="muted" style="font-size:12.5px;margin-bottom:10px;">${t('uploadHint')}</div>
          <input id="new-upload" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple style="margin:0 auto 10px;max-width:320px;display:block;">
          <div id="new-file-list" class="muted" style="font-size:12.5px;text-align:center;margin-bottom:8px;"></div>
          <div class="actions" style="justify-content:center;gap:8px;">
            <button type="button" class="secondary small" data-action="new-pick-files">📁 ${lang==='hi'?'फाइल चुनें':'Choose files'}</button>
            <button type="button" class="secondary small" data-action="camera">📷 ${t('camera')}</button>
            <label class="secondary small mobile-only" style="margin:0;">${lang==='hi'?'फोन कैमरा':'Phone camera'}<input id="new-capture-file" type="file" accept="image/jpeg,image/png" capture="environment"></label>
          </div>
        </div>

        <div class="actions" style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
          <button type="button" class="secondary" data-action="record" data-target="new-complaint" style="display:inline-flex;align-items:center;gap:6px;">
            🎤 ${t('record')}
          </button>
          <button type="button" data-action="submit-new-visit" style="background:#126b52;color:#ffffff;font-weight:700;padding:10px 22px;border-radius:8px;box-shadow:0 2px 6px rgba(18,107,82,0.25);">
            ✓ ${lang==='hi'?'परेशानी सहेजें व नई विज़िट शुरू करें':'Save Issue & Start New Visit'}
          </button>
          <button type="button" class="secondary" data-action="cancel-new-visit" style="padding:10px 18px;border-radius:8px;">
            ✕ ${lang==='hi'?'रद्द करें':'Cancel'}
          </button>
        </div>
        <p class="muted" style="margin:8px 0 0;font-size:12px;">${lang==='hi'?'सहेजने पर AI आपकी वर्तमान समस्या व दस्तावेजों का विश्लेषण कर रिकॉर्ड्स अपडेट करेगा। पुरानी बीमारियों व दवाओं का इतिहास सुरक्षित रहेगा।':'Upon saving, AI extracts clinical facts from your issue & documents to update your records. Baseline medical history is automatically carried over without duplicates.'}</p>
        ${consent()}
      </section>
    `:'';
    app.innerHTML=header()+`
    <main class="wrap">
      <div class="patient-visit-hero" style="background:linear-gradient(135deg,#eef7f2 0%,#ffffff 100%);padding:20px 24px;border:1px solid #cfe0d8;border-radius:12px;margin:12px 0 20px;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
        <div class="row" style="align-items:center;">
          <div>
            <div class="eyebrow" style="margin-bottom:4px;color:#126b52;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">${lang==='hi'?'मरीज परामर्श पोर्टल':'Patient Consultation Portal'}</div>
            <h1 style="margin:0 0 6px;">${esc(p?.name||user.name)} <span class="muted" style="font-size:20px;font-weight:400;">${esc(p?.age||'')} ${lang==='hi'?'वर्ष':'years'} · ${esc(p?.mobile||'')}</span></h1>
            <p class="muted" style="margin:0;font-size:13px;">${t('patientId')}: <strong>${esc(p?.id||user.patientId)}</strong> · ${lang==='hi'?'कुल विज़िट: ':'Total visits: '}<strong>${sorted.length}</strong></p>
          </div>
          <div class="actions no-print" style="align-items:center;flex-wrap:wrap;gap:10px;">
            <button data-action="new-visit" data-id="${esc(p?.id||user.patientId)}" style="background:#126b52;color:#ffffff;font-weight:700;padding:10px 18px;border-radius:8px;box-shadow:0 2px 6px rgba(18,107,82,0.25);">+ ${t('newVisit')}</button>
            <button class="secondary" data-action="edit-profile" data-id="${esc(p?.id||user.patientId)}">👤 ${t('profile')}</button>
          </div>
        </div>
      </div>
      
      <div class="stats">
        <div class="stat"><strong>${sorted.length}</strong>${lang==='hi'?'कुल विज़िट':'Total visits'}</div>
        <div class="stat"><strong>${sorted.filter(v=>v.status==='reviewed').length}</strong>${lang==='hi'?'पूर्ण परामर्श':'Doctor reviewed'}</div>
        <div class="stat" style="border-color:#126b52;background:#f2faf5;">
          <strong style="color:#126b52;">${sorted.filter(v=>v.status!=='reviewed').length}</strong>${lang==='hi'?'सक्रिय विज़िट':'Active / in-review'}
        </div>
      </div>

      ${newVisitFormHTML}

      <section class="panel">
        <div class="section-title">
          <h2>📋 ${lang==='hi'?'आपकी सभी विज़िट और डॉक्टर/स्टाफ समीक्षा':'Consultation Visits & Reviews'}</h2>
          <button data-action="new-visit" data-id="${esc(p?.id||user.patientId)}" class="secondary small">+ ${t('newVisit')}</button>
        </div>
        <p class="muted" style="margin-top:-6px;font-size:13.5px;">
          ${lang==='hi'?'यहाँ आपकी पुरानी व वर्तमान विज़िट, डॉक्टर की टिप्पणियाँ और स्टाफ सत्यापन उपलब्ध हैं:':'All your past and ongoing visits, doctor notes, and staff verifications are listed below:'}
        </p>

        ${sorted.length ? `
          <div style="overflow-x:auto;">
            <table class="queue">
              <thead>
                <tr>
                  <th>${t('visitId')}</th>
                  <th>${lang==='hi'?'तारीख':'Date & Time'}</th>
                  <th>${lang==='hi'?'स्थिति':'Status'}</th>
                  <th>${lang==='hi'?'स्टाफ समीक्षा':'Staff Review'}</th>
                  <th>${lang==='hi'?'डॉक्टर समीक्षा / निर्देश':'Doctor Review'}</th>
                  <th style="text-align:right;">${lang==='hi'?'कार्य':'Actions'}</th>
                </tr>
              </thead>
              <tbody>
                ${sorted.map(v => {
                  const isReviewed = v.status === 'reviewed';
                  return `
                    <tr>
                      <td>
                        <strong>${esc(v.id)}</strong>
                      </td>
                      <td style="white-space:nowrap;">${date(v.createdAt)}</td>
                      <td>${badge(v.status)}</td>
                      <td>
                        ${v.staffVerifyNote ? `
                          <div style="color:#166534;font-size:13px;font-weight:600;">✓ ${esc(v.staffVerifyNote)}</div>
                          <small class="muted">${esc(v.staffVerifiedBy||'Staff')} · ${date(v.staffVerifiedAt)}</small>
                        ` : v.staffNote ? `
                          <div style="color:#b45309;font-size:13px;font-weight:600;background:#fffbeb;border:1px solid #fde68a;padding:5px 8px;border-radius:6px;">
                            ⚠️ ${lang==='hi'?'सुधार हेतु भेजा':'Review requested'}: "${esc(v.staffNote)}"
                          </div>
                          <small class="muted">Dr. ${esc(v.staffNoteBy)}</small>
                        ` : v.status === 'ready' ? `
                          <span style="color:#166534;font-size:13px;font-weight:600;">✓ ${lang==='hi'?'स्टाफ द्वारा सत्यापित':'Staff verified'}</span>
                        ` : v.status === 'submitted' ? `
                          <span class="muted" style="font-size:13px;">⏳ ${lang==='hi'?'स्टाफ समीक्षा प्रतीक्षारत':'Awaiting staff review'}</span>
                        ` : `
                          <span class="muted" style="font-size:13px;">${lang==='hi'?'जानकारी दर्ज जारी':'Intake in progress'}</span>
                        `}
                      </td>
                      <td>
                        ${v.doctorNote ? `
                          <div style="color:#166534;font-size:13.5px;font-weight:600;">🩺 "${esc(v.doctorNote)}"</div>
                          <small class="muted">Dr. ${esc(v.reviewedBy||'Doctor')} · ${date(v.reviewedAt)}</small>
                        ` : isReviewed ? `
                          <span style="color:#166534;font-size:13px;">✓ ${lang==='hi'?'परामर्श पूर्ण':'Consultation complete'}</span>
                        ` : `
                          <span class="muted" style="font-size:13px;">${lang==='hi'?'डॉक्टर समीक्षा प्रतीक्षारत':'Pending consultation'}</span>
                        `}
                      </td>
                      <td style="text-align:right;white-space:nowrap;">
                        <button class="secondary small" data-action="open" data-id="${v.id}">
                          ${lang==='hi'?'सारांश देखें':'View'}
                        </button>
                        ${!isReviewed ? `
                          <button class="small" data-action="edit-visit" data-id="${v.id}" style="background:#d97706;color:#ffffff;font-weight:600;margin-left:4px;">
                            ✏️ ${lang==='hi'?'बदलें':'Edit'}
                          </button>
                        ` : ''}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        ` : `
          <div class="empty">
            <p>${t('empty')}</p>
            <button data-action="new-visit" data-id="${esc(p?.id||user.patientId)}">+ ${t('newVisit')}</button>
          </div>
        `}
      </section>
      ${footer()}
    </main>`;
    return;
  }
  const isDoctor=user.role==='doctor';
  const effectiveTab=queueTab || (isDoctor ? 'ready' : 'intake');

  // Deduplicate visits: 1 patient (mobile number) = 1 row in the queue table
  const patientVisitMap=new Map();
  const sortedVisits=[...visits].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  for(const v of sortedVisits){
    const pt=v.patient||patients.find(x=>x.id===v.patientId)||{};
    const key=(pt.mobile||v.patientId||v.id).trim();
    if(!patientVisitMap.has(key)){
      patientVisitMap.set(key,v);
    }else{
      const prev=patientVisitMap.get(key);
      if(prev.status==='reviewed'&&v.status!=='reviewed'){
        patientVisitMap.set(key,v);
      }
    }
  }
  const uniqueVisits=Array.from(patientVisitMap.values());

  const filtered=uniqueVisits.filter(v=>{
    if(effectiveTab==='ready'&&v.status!=='ready')return false;
    if(effectiveTab==='reviewed'&&v.status!=='reviewed')return false;
    if(effectiveTab==='intake'&&!['intake','submitted'].includes(v.status))return false;
    if(filter){
      const q=filter.trim().toLowerCase();
      const pt=v.patient||patients.find(x=>x.id===v.patientId)||{};
      return [v.id,v.patientId,pt.name,pt.mobile].some(x=>String(x||'').toLowerCase().includes(q));
    }
    return true;
  }).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));

  const pageSize=5;
  const totalItems=filtered.length;
  const totalPages=Math.ceil(totalItems/pageSize)||1;
  if(queuePage>totalPages)queuePage=totalPages;
  if(queuePage<1)queuePage=1;
  const startIdx=(queuePage-1)*pageSize;
  const endIdx=Math.min(startIdx+pageSize,totalItems);
  const shown=filtered.slice(startIdx,endIdx);

  const paginationHTML=totalItems>pageSize?`
    <div class="pagination-bar no-print">
      <div class="pagination-info muted">
        ${lang==='hi'?`${totalItems} में से ${startIdx+1}–${endIdx} मरीज दिखा रहे हैं`:`Showing ${startIdx+1}–${endIdx} of ${totalItems} patients`}
      </div>
      <div class="pagination-controls">
        <button class="secondary small" data-action="queue-page" data-page="${queuePage-1}" ${queuePage<=1?'disabled style="opacity:0.4;cursor:not-allowed;"':''}>
          ← ${lang==='hi'?'पिछला':'Previous'}
        </button>
        <span class="page-indicator">
          ${lang==='hi'?`पृष्ठ ${queuePage} / ${totalPages}`:`Page ${queuePage} of ${totalPages}`}
        </span>
        <button class="secondary small" data-action="queue-page" data-page="${queuePage+1}" ${queuePage>=totalPages?'disabled style="opacity:0.4;cursor:not-allowed;"':''}>
          ${lang==='hi'?'अगला':'Next'} →
        </button>
      </div>
    </div>
  `:(totalItems>0?`
    <div class="pagination-bar no-print" style="justify-content:flex-end;">
      <span class="pagination-info muted" style="font-size:12.5px;">${lang==='hi'?`कुल ${totalItems} मरीज`:`Total ${totalItems} patients`}</span>
    </div>
  `:'');

  const readyCount=uniqueVisits.filter(v=>v.status==='ready').length;
  const reviewedCount=uniqueVisits.filter(v=>v.status==='reviewed').length;
  const intakeCount=uniqueVisits.filter(v=>['intake','submitted'].includes(v.status)).length;

  const queueTabsHTML=`
    <div class="tabs no-print" style="margin-bottom:14px;max-width:580px;">
      ${isDoctor ? `
        <button class="${effectiveTab==='ready'?'active':''}" data-action="queue-tab" data-tab="ready" style="font-weight:700;">
          ● ${lang==='hi'?'परामर्श हेतु तैयार':'Ready for doctor'} (${readyCount})
        </button>
        <button class="${effectiveTab==='reviewed'?'active':''}" data-action="queue-tab" data-tab="reviewed">
          ✓ ${lang==='hi'?'पूर्ण परामर्श':'Reviewed'} (${reviewedCount})
        </button>
        <button class="${effectiveTab==='all'?'active':''}" data-action="queue-tab" data-tab="all">
          ${lang==='hi'?'सभी मरीज':'All patients'} (${uniqueVisits.length})
        </button>
      ` : `
        <button class="${effectiveTab==='intake'?'active':''}" data-action="queue-tab" data-tab="intake" style="font-weight:700;">
          ⏳ ${lang==='hi'?'तैयारी जारी':'Intake in progress'} (${intakeCount})
        </button>
        <button class="${effectiveTab==='ready'?'active':''}" data-action="queue-tab" data-tab="ready">
          ● ${lang==='hi'?'डॉक्टर हेतु तैयार':'Ready for doctor'} (${readyCount})
        </button>
        <button class="${effectiveTab==='all'?'active':''}" data-action="queue-tab" data-tab="all">
          ${lang==='hi'?'सभी मरीज':'All patients'} (${uniqueVisits.length})
        </button>
      `}
    </div>
  `;

  let queueContentHTML = '';
  if (shown.length) {
    queueContentHTML = `
      <table class="queue">
        <thead>
          <tr>
            <th>${t('patient')}</th>
            <th>${t('visitId')}</th>
            <th>${lang==='hi'?'बनाने की तारीख':'Created'}</th>
            <th>${lang==='hi'?'स्थिति':'Status'}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${shown.map(v=>`
            <tr>
              <td><strong>${esc(v.patient.name)}</strong><small>${esc(v.patientId)} · ${esc(v.patient.mobile)}</small></td>
              <td>${esc(v.id)}</td>
              <td>${date(v.createdAt)}</td>
              <td>${badge(v.status)}</td>
              <td>
                <button class="${isDoctor&&v.status==='ready'?'':'secondary'} small" data-action="open" data-id="${v.id}" style="${isDoctor&&v.status==='ready'?'background:#126b52;color:#ffffff;font-weight:700;':''}">
                  ${isDoctor&&v.status==='ready'?(lang==='hi'?'परामर्श शुरू करें':'Start consultation'):t('open')}
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      ${paginationHTML}
    `;
  } else if (isDoctor && effectiveTab === 'ready') {
    queueContentHTML = `
      <div class="empty">
        <div style="font-size:32px;margin-bottom:8px;">🩺</div>
        <strong>${lang==='hi'?'वर्तमान में कोई मरीज परामर्श के लिए प्रतीक्षारत नहीं है।':'No patients waiting for consultation.'}</strong>
        <p class="muted" style="margin:4px 0 0;font-size:13px;">${lang==='hi'?'स्टाफ द्वारा मरीज की तैयारी व समीक्षा पूरी होने पर यहाँ दिखाई देंगे।':'Patients prepared and reviewed by staff will appear here.'}</p>
      </div>
    `;
  } else if (effectiveTab === 'intake') {
    queueContentHTML = `
      <div class="empty">
        <div style="font-size:32px;margin-bottom:8px;">⏳</div>
        <strong>${lang==='hi'?'वर्तमान में कोई मरीज तैयारी में नहीं है।':'No patients currently in intake.'}</strong>
        <p class="muted" style="margin:4px 0 0;font-size:13px;">${lang==='hi'?'नया मरीज पंजीकृत करें या "सभी मरीज" टैब देखें।':'Register a patient or switch to "All patients".'}</p>
      </div>
    `;
  } else {
    queueContentHTML = `<div class="empty">${t('empty')}</div>`;
  }

  app.innerHTML=header()+`
  <main class="wrap">
    <div class="row">
      <div>
        <div class="eyebrow">${t(user.role)} ${t('dashboard')}</div>
        <h1>${isDoctor?(lang==='hi'?'परामर्श कतार':'Consultation Queue'):(lang==='hi'?'परामर्श की तैयारी':'Prepare for the consultation')}</h1>
      </div>
      <div class="actions">
        ${user.role==='patient'&&p?`<button data-action="new-visit" data-id="${p.id}">${t('newVisit')}</button>`:`<button data-action="register-modal">${t('register')}</button><button class="secondary" data-action="existing-visit">${t('newVisit')}</button>`}
      </div>
    </div>
    ${p?`<section class="panel"><div class="row"><div><h2>${esc(p.name)}</h2><div class="muted">${esc(p.age)} ${lang==='hi'?'वर्ष':'years'} · ${esc(p.city)} · ${esc(p.mobile)}</div></div><div class="id-box">${t('patientId')}<br><strong>${esc(p.id)}</strong></div><button class="secondary" data-action="edit-profile" data-id="${p.id}">${t('profile')}</button></div></section>`:''}
    <div class="stats">
      <div class="stat"><strong>${uniqueVisits.length}</strong>${lang==='hi'?'कुल मरीज':'Total patients'}</div>
      <div class="stat"><strong>${intakeCount}</strong>${t('intake')}</div>
      <div class="stat" style="${isDoctor?'border-color:#126b52;background:#f2faf5;':''}">
        <strong style="${isDoctor?'color:#126b52;':''}">${readyCount}</strong>${t('ready')}
      </div>
    </div>
    <section class="panel">
      <div class="section-title">
        <h2>${isDoctor?(lang==='hi'?'मरीज कतार':'Patient queue'):(lang==='hi'?'विज़िट सूची':'Visit queue')}</h2>
        <input class="search" id="search" value="${esc(filter)}" placeholder="${esc(t('search'))}">
      </div>
      ${queueTabsHTML}
      ${queueContentHTML}
    </section>
    ${footer()}
  </main>`;
}
function formatFactTitle(str){
  if(!str) return '';
  const s = String(str).trim();
  if(/^hba1c$/i.test(s)) return 'HbA1c';
  if(/^bp|blood\s*pressure$/i.test(s)) return 'Blood Pressure (BP)';
  if(/^egfr$/i.test(s)) return 'eGFR';
  return s.replace(/\b([a-z])/g, c => c.toUpperCase());
}
function factHTML(f){
  const isAttention = f.uncertain || f.attention_reason;
  let icon = '📌';
  if(isAttention) icon = '⚠️';
  else if(f.category === 'complaint') icon = '🩺';
  else if(f.category === 'allergy') icon = '⚠️';
  else if(f.category === 'lab') icon = '🧪';
  else if(f.category === 'current_medicine' || f.category === 'historical_medicine') icon = '💊';
  else if(f.category === 'history') icon = '📜';

  const rawTitle = lang === 'hi' ? (f.label_hi || f.label) : f.label;
  const title = formatFactTitle(rawTitle);

  return `<div class="fact ${isAttention ? 'attention' : ''}">
    <div class="fact-label">
      <span>${icon}</span>
      <span>${esc(title)}</span>
    </div>
    <div class="fact-value">${esc(val(f))}</div>
    ${f.attention_reason ? `
      <div class="muted" style="color:#b45309;font-size:12.5px;margin-bottom:8px;font-weight:600;display:flex;align-items:center;gap:5px;background:#fef3c7;padding:4px 9px;border-radius:6px;width:fit-content;">
        <span>⚠️</span> <span>${esc(lang==='hi'?(f.attention_hi||f.attention_reason):f.attention_reason)}</span>
      </div>
    ` : ''}
    <div class="fact-meta">
      ${badge(f.verification)}
      ${f.uncertain ? badge('uncertain') : ''}
      <span style="display:inline-flex;align-items:center;gap:4px;">📅 ${esc(f.date || t('unknown'))}</span>
      <button class="source-link" data-action="source" data-id="${f.sourceId}" data-fact="${f.id}" style="font-weight:600;">
        📄 ${t('source')}${f.page ? ' · ' + f.page : ''}
      </button>
      ${user.role !== 'patient' && current.status !== 'reviewed' ? `
        <button class="secondary small" data-action="edit-fact" data-id="${f.id}" style="margin-left:auto;">
          ✏️ ${t('edit')}
        </button>
      ` : ''}
    </div>
  </div>`;
}
function clinicalSummaryCard(v){
  const complaints = v.facts.filter(f => f.category === 'complaint');
  const history = v.facts.filter(f => f.category === 'history');
  const allergies = v.facts.filter(f => f.category === 'allergy');
  const currentMeds = v.facts.filter(f => f.category === 'current_medicine');
  const pastMeds = v.facts.filter(f => f.category === 'historical_medicine');
  const labs = v.facts.filter(f => f.category === 'lab');
  const latestVital = (v.vitals && v.vitals.length) ? v.vitals[v.vitals.length - 1] : null;
  const keyLabs = labs.filter(f => f.attention_reason || /hba1c|glucose|sugar|creatinine|egfr|lipid|cholesterol/i.test((f.label||'')+' '+(f.value_en||'')));

  return `
    <section class="panel clinical-snapshot-card no-print" style="border:2px solid #0f766e;background:linear-gradient(135deg,#f0fdfa 0%,#ffffff 100%);box-shadow:0 3px 12px rgba(15,118,110,0.08);border-radius:12px;margin-bottom:20px;padding:20px 22px;">
      <div class="section-title" style="margin-bottom:12px;border-bottom:1.5px solid #ccfbf1;padding-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
        <h2 style="color:#0f766e;font-size:18px;margin:0;display:flex;align-items:center;gap:8px;">
          <span>⚡</span> ${lang==='hi'?'त्वरित नैदानिक सारांश (2-मिनट डॉक्टर व स्टाफ ब्रीफ)':'Essential Clinical Summary (2-Minute Brief)'}
        </h2>
        <span class="badge" style="background:#0f766e;color:#ffffff;font-weight:700;font-size:11px;letter-spacing:0.04em;">
          ${lang==='hi'?'निदान सारांश':'Clinical Snapshot'}
        </span>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;">
        <!-- Column 1: What is the issue for visiting the doctor today -->
        <div style="background:#ffffff;border:1.5px solid #99f6e4;border-radius:10px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="font-size:14px;font-weight:700;color:#0f766e;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
            <span>🎯</span> ${lang==='hi'?'डॉक्टर से मिलने का मुख्य कारण व लक्षण':'Reason for Visit / Current Complaints'}
          </div>
          ${complaints.length ? `
            <ul style="margin:0 0 10px;padding-left:18px;font-size:14px;line-height:1.6;color:#134e4a;">
              ${complaints.map(f => `
                <li style="margin-bottom:3px;">
                  <strong>${esc(val(f))}</strong>
                  ${f.date ? ` <span class="muted" style="font-size:12px;">(${esc(f.date)})</span>` : ''}
                </li>
              `).join('')}
            </ul>
          ` : `
            <p class="muted" style="margin:0 0 10px;font-size:13px;">${lang==='hi'?'कोई सक्रिय लक्षण स्पष्ट रूप से दर्ज नहीं है।':'No acute symptoms explicitly stated.'}</p>
          `}

          ${latestVital ? `
            <div style="background:#f0fdfa;border:1px solid #ccfbf1;border-radius:8px;padding:8px 12px;font-size:12.5px;color:#115e59;margin-top:8px;">
              <strong>${lang==='hi'?'ताजा वाइटल्स:':'Latest Vitals:'}</strong>
              ${latestVital.bp ? ` BP <strong>${esc(latestVital.bp)}</strong> ·` : ''}
              ${latestVital.pulse ? ` Pulse <strong>${esc(latestVital.pulse)} bpm</strong> ·` : ''}
              ${latestVital.sugar ? ` Sugar <strong>${esc(latestVital.sugar)} mg/dL</strong> (${esc(latestVital.sugarType||'random')}) ·` : ''}
              ${latestVital.weight ? ` Wt <strong>${esc(latestVital.weight)} kg</strong>` : ''}
            </div>
          ` : ''}
        </div>

        <!-- Column 2: Essential past history for diagnosis -->
        <div style="background:#ffffff;border:1.5px solid #cbd5e1;border-radius:10px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="font-size:14px;font-weight:700;color:#1e293b;margin-bottom:8px;display:flex;align-items:center;gap:6px;">
            <span>📋</span> ${lang==='hi'?'आवश्यक पूर्व इतिहास (निदान व जांच हेतु)':'Essential Past History for Diagnosis'}
          </div>
          <div style="font-size:13.5px;line-height:1.6;color:#1e293b;display:flex;flex-direction:column;gap:8px;">
            ${history.length ? `
              <div>
                <strong>${lang==='hi'?'बीमारियों का इतिहास:':'Chronic Conditions & Duration:'}</strong>
                <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:2px;">
                  ${history.map(f => `<span style="background:#f1f5f9;border:1px solid #cbd5e1;padding:2px 8px;border-radius:6px;font-size:12.5px;color:#334155;">${esc(val(f))}</span>`).join('')}
                </div>
              </div>
            ` : ''}

            ${(currentMeds.length || pastMeds.length) ? `
              <div>
                <strong>${lang==='hi'?'दवाओं का इतिहास व पालन:':'Medications & Adherence:'}</strong>
                <span style="color:#475569;font-size:13px;">${[...currentMeds, ...pastMeds].map(f => esc(val(f))).join(', ')}</span>
              </div>
            ` : ''}

            ${allergies.length ? `
              <div style="color:#991b1b;background:#fef2f2;border:1px solid #fecaca;padding:5px 10px;border-radius:6px;font-size:13px;font-weight:600;">
                ⚠️ ${lang==='hi'?'एलर्जी:':'Allergy Alert:'} ${allergies.map(f => esc(val(f))).join(', ')}
              </div>
            ` : `
              <div style="color:#166534;font-size:12.5px;">✓ ${lang==='hi'?'कोई दवा एलर्जी दर्ज नहीं':'No drug allergies reported'}</div>
            `}

            ${keyLabs.length ? `
              <div style="background:#fffbeb;border:1px solid #fde68a;padding:5px 10px;border-radius:6px;font-size:12.5px;color:#92400e;">
                <strong>🧪 ${lang==='hi'?'प्रमुख लैब रिपोर्ट:':'Key Diagnostic Labs:'}</strong>
                ${keyLabs.map(f => `<span><strong>${esc(f.label||'Lab')}:</strong> ${esc(val(f))}${f.attention_reason ? ` <span style="color:#b45309;">(${esc(f.attention_reason)})</span>` : ''}</span>`).join(' · ')}
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    </section>
  `;
}

function getQuestionQuickChips(qText, lang) {
  const norm = String(qText || '').toLowerCase();
  const isHi = lang === 'hi';
  if (/diabet|sugar|मधुमेह|शर्करा/.test(norm)) {
    return isHi 
      ? ['कोई इतिहास नहीं', 'हाँ, 5 साल से डायबिटीज है', 'मेटफॉर्मिन दवा लेते हैं']
      : ['No history', 'Yes, diabetic for 5 years', 'Taking Metformin daily'];
  }
  if (/medicat|medicine|दवा|औषध|tablet|dose/.test(norm)) {
    return isHi
      ? ['कोई अन्य दवा नहीं ले रहे', 'नियमित दवाएं ले रहे हैं', 'पर्चे के अनुसार दवा जारी']
      : ['No other medicines', 'Taking regular daily meds', 'As prescribed'];
  }
  if (/lab|result|test|report|जांच|रिपोर्ट|तुलना/.test(norm)) {
    return isHi
      ? ['पिछली रिपोर्ट सामान्य थी', 'पहली बार जांच कराई', '1 माह पुरानी रिपोर्ट है']
      : ['Previous report normal', 'Tested for first time', 'Report is 1 month old'];
  }
  if (/duration|how long|कब से|अवधि|दिन|महीने/.test(norm)) {
    return isHi
      ? ['2-3 दिनों से है', '1 सप्ताह से', '1 महीने से अधिक']
      : ['For 2-3 days', 'For 1 week', 'Over 1 month'];
  }
  if (/allerg|एलर्जी/.test(norm)) {
    return isHi
      ? ['कोई ज्ञात एलर्जी नहीं', 'सल्फा दवाओं से एलर्जी', 'पेनिसिलिन से एलर्जी']
      : ['No known allergies', 'Sulfa allergy', 'Penicillin allergy'];
  }
  if (/symptom|fever|pain|बुखार|दर्द|तकलीफ/.test(norm)) {
    return isHi
      ? ['हल्के लक्षण हैं', 'तेज लक्षण हैं', 'कभी-कभी होता है']
      : ['Mild symptoms', 'Severe symptoms', 'Occasional / comes & goes'];
  }
  return isHi ? ['हाँ', 'नहीं', 'ज्ञात नहीं'] : ['Yes', 'No', 'Not sure'];
}

function staffVisitOverviewCard(v){
  const complaints = v.facts.filter(f => f.category === 'complaint');
  const history = v.facts.filter(f => f.category === 'history');
  const allergies = v.facts.filter(f => f.category === 'allergy');
  const currentMeds = v.facts.filter(f => f.category === 'current_medicine');
  const pastMeds = v.facts.filter(f => f.category === 'historical_medicine');
  const docs = v.sources.filter(s => s.type === 'document');
  const latestVital = (v.vitals && v.vitals.length) ? v.vitals[v.vitals.length - 1] : null;

  const missingItems = [];
  if (!currentMeds.length) {
    missingItems.push({
      en: 'Current complete medication list is unknown — confirm what medicines patient is taking',
      hi: 'वर्तमान दवाओं की सूची अज्ञात है — मरीज से पुष्टि करें कि वे अभी कौन सी दवाएं ले रहे हैं'
    });
  } else if (pastMeds.length && !currentMeds.some(m => m.value_en.toLowerCase().includes('mg') || m.value_en.toLowerCase().includes('daily'))) {
    missingItems.push({
      en: 'Exact medication dosages & daily frequency not confirmed',
      hi: 'दवाओं की सटीक खुराक व समय मरीज द्वारा स्पष्ट नहीं है'
    });
  }
  if (!allergies.length) {
    missingItems.push({
      en: 'Known drug & food allergies unconfirmed — verify before doctor consultation',
      hi: 'दवा व भोजन एलर्जी की पुष्टि नहीं है — डॉक्टर परामर्श से पहले मरीज से पूछें'
    });
  }
  if (!complaints.some(c => c.value_en.toLowerCase().includes('day') || c.value_en.toLowerCase().includes('week') || c.value_en.toLowerCase().includes('month') || c.date)) {
    missingItems.push({
      en: 'Duration/onset of symptoms not clearly stated by patient',
      hi: 'लक्षण कब से हैं (अवधि) स्पष्ट रूप से दर्ज नहीं है'
    });
  }
  if (!latestVital) {
    missingItems.push({
      en: 'No vitals recorded today — measure BP, Pulse, Sugar & Weight below',
      hi: 'आज के वाइटल्स दर्ज नहीं हैं — कृपया नीचे BP, पल्स, शुगर व वजन मापें'
    });
  }
  const uniqueGaps = deduplicateGaps(v.gaps || []);
  for (const g of uniqueGaps.slice(0, 4)) {
    const textEn = typeof g === 'string' ? g : g.en;
    const textHi = typeof g === 'string' ? g : g.hi;
    if (textEn && !missingItems.some(m => m.en.toLowerCase() === textEn.toLowerCase())) {
      missingItems.push({ en: textEn, hi: textHi || textEn });
    }
  }

  return `
    <section class="panel staff-intake-card no-print" style="border:2px solid #2563eb;background:linear-gradient(135deg,#eff6ff 0%,#ffffff 100%);box-shadow:0 3px 12px rgba(37,99,235,0.08);border-radius:12px;margin-bottom:20px;padding:20px 22px;">
      <div class="section-title staff-intake-header" style="margin-bottom:12px;border-bottom:1.5px solid #dbeafe;padding-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
        <h2 style="color:#1d4ed8;font-size:18px;margin:0;display:flex;align-items:center;gap:8px;">
          <span>📋</span> ${lang==='hi'?'स्टाफ ट्राइएज: मरीज सारांश व अधूरी जानकारी (मरीज दृष्टिकोण)':'Staff Triage: Visit Brief & Missing Details (Patient POV)'}
        </h2>
        <span class="badge" style="background:#2563eb;color:#ffffff;font-weight:700;font-size:11px;letter-spacing:0.04em;">
          ${lang==='hi'?'स्टाफ प्रविष्टि':'Staff Intake'}
        </span>
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:16px;">
        <div style="background:#ffffff;border:1.5px solid #bfdbfe;border-radius:10px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="font-size:14px;font-weight:750;color:#1e40af;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
            <span>🗣️</span> ${lang==='hi'?'मरीज द्वारा बताई गई परेशानी (संक्षिप्त सारांश)':'What Patient Reported (Visit Summary)'}
          </div>

          <div style="font-size:13.5px;line-height:1.6;color:#1e293b;display:flex;flex-direction:column;gap:10px;">
            <div>
              <strong style="color:#1e3a8a;display:block;margin-bottom:2px;">${lang==='hi'?'मुख्य लक्षण / आने का कारण:':'Chief Complaints / Reason:'}</strong>
              ${complaints.length ? `
                <ul style="margin:2px 0 0;padding-left:18px;">
                  ${complaints.map(f => `<li><strong>${esc(val(f))}</strong>${f.date ? ` <span class="muted">(${esc(f.date)})</span>` : ''}</li>`).join('')}
                </ul>
              ` : `
                <p class="muted" style="margin:0;font-size:13px;">${lang==='hi'?'मरीज ने अभी कोई लक्षण दर्ज नहीं किए हैं।':'No complaints recorded by patient yet.'}</p>
              `}
            </div>

            <div>
              <strong style="color:#1e3a8a;display:block;margin-bottom:2px;">${lang==='hi'?'दवाओं की स्थिति (मरीज अनुसार):':'Medications (Patient Reported):'}</strong>
              ${currentMeds.length ? `
                <div style="color:#166534;font-size:13px;">💊 ${currentMeds.map(f => esc(val(f))).join(', ')}</div>
              ` : pastMeds.length ? `
                <div style="color:#b45309;font-size:13px;">⚠️ ${lang==='hi'?'पुरानी दवाएं हैं, वर्तमान नियमित सेवन अस्पष्ट':'Past meds recorded; current use unconfirmed'}: ${pastMeds.map(f => esc(val(f))).join(', ')}</div>
              ` : `
                <span class="muted" style="font-size:13px;">${lang==='hi'?'दवाओं की जानकारी मरीज द्वारा नहीं दी गई।':'No medication reported by patient.'}</span>
              `}
            </div>

            <div>
              <strong style="color:#1e3a8a;display:block;margin-bottom:2px;">${lang==='hi'?'पूर्व इतिहास व दस्तावेज:':'History & Documents:'}</strong>
              <div style="font-size:13px;color:#475569;">
                ${history.length ? `<span>📜 ${history.map(f => esc(val(f))).join(', ')}</span> · ` : ''}
                <span>📄 ${docs.length} ${lang==='hi'?'दस्तावेज़ संलग्न':'document(s) attached'}</span>
              </div>
            </div>
          </div>
        </div>

        <div style="background:#ffffff;border:1.5px solid #fcd34d;border-radius:10px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,0.03);">
          <div style="font-size:14px;font-weight:750;color:#92400e;margin-bottom:10px;display:flex;align-items:center;gap:6px;">
            <span>⚠️</span> ${lang==='hi'?'मरीज से अधूरी जानकारी (स्टाफ द्वारा सत्यापन आवश्यक)':'Missing Details from Patient POV (Staff to Verify)'}
          </div>

          ${missingItems.length ? `
            <div style="display:flex;flex-direction:column;gap:8px;">
              ${missingItems.map(m => `
                <div style="background:#fffbeb;border-left:3.5px solid #d97706;border-radius:4px;padding:8px 12px;font-size:13px;color:#78350f;line-height:1.45;">
                  <strong>•</strong> ${esc(lang==='hi'?m.hi:m.en)}
                </div>
              `).join('')}
            </div>
          ` : `
            <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:8px;padding:12px;color:#166534;font-size:13px;">
              ✓ ${lang==='hi'?'मरीज द्वारा सभी आवश्यक जानकारी दी गई है। वाइटल्स जांचें व डॉक्टर को भेजें।':'All essential patient details recorded. Check vitals and mark ready for doctor.'}
            </div>
          `}

          <div style="margin-top:12px;padding-top:10px;border-top:1px dashed #e2e8f0;display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
            <button type="button" class="secondary small" data-action="add-vitals" style="background:#eff6ff;color:#1d4ed8;border-color:#bfdbfe;">
              🩺 ${lang==='hi'?'वाइटल्स दर्ज करें':'Record Vitals'}
            </button>
            ${v.status!=='ready'?`
              <button type="button" data-action="mark-ready-top" style="background:#166534;color:#ffffff;padding:6px 12px;font-size:13px;border-radius:6px;">
                ✓ ${lang==='hi'?'सत्यापित व डॉक्टर हेतु तैयार':'Mark Ready for Doctor'}
              </button>
            `:''}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderVisit(v){
  current=v;
  v.facts=deduplicateFacts(v.facts);
  v.gaps=deduplicateGaps(v.gaps||[]);
  const p=v.patient || (patients.find(x=>x.id===v.patientId)) || user;
  const editable=v.status!=='reviewed';
  const issues=v.facts.filter(f=>f.uncertain||f.attention_reason);
  const uniqueIssues=[];
  const seenIssues=new Set();
  for(const f of issues){
    const norm=normalizeFactString((f.label||'')+' '+(f.value_en||''));
    if(!seenIssues.has(norm)){seenIssues.add(norm);uniqueIssues.push(f);}
  }
  const uniqueAiIssues=[];
  const seenAiIssues=new Set();
  for(const i of (v.issues||[])){
    const text=(lang==='hi'?i.hi:i.en)||'';
    const norm=normalizeFactString(text);
    if(!seenAiIssues.has(norm)){seenAiIssues.add(norm);uniqueAiIssues.push(i);}
  }
  const uniqueGaps=deduplicateGaps(v.gaps||[]);
  const isDoctor=user.role==='doctor';
  const isStaff=user.role==='staff';
  const isPatient=user.role==='patient';
  const hasFilledInfo=hasPatientFilledInfo(v);

  const catMeta = {
    complaint: { icon: '🩺', en: 'Chief Complaint & Symptoms', hi: 'मुख्य परेशानी व वर्तमान लक्षण' },
    history: { icon: '📜', en: 'Relevant Medical History', hi: 'संबंधित मेडिकल इतिहास' },
    current_medicine: { icon: '💊', en: 'Current Medicines — Patient Reported', hi: 'वर्तमान दवाएं — मरीज द्वारा बताई गई' },
    historical_medicine: { icon: '📋', en: 'Historical Prescriptions & Past Meds', hi: 'पुराने प्रिस्क्रिप्शन व दवाएं' },
    allergy: { icon: '⚠️', en: 'Known Drug & Other Allergies', hi: 'ज्ञात एलर्जी व प्रतिक्रियाएं' },
    lab: { icon: '🧪', en: 'Diagnostic Labs & Test Reports', hi: 'जांच व लैब परिणाम' },
    other: { icon: '📝', en: 'Other Recorded Clinical Details', hi: 'अन्य दर्ज जानकारी' }
  };

  const summarySection=`<section class="panel">
    <div class="section-title" style="margin-bottom:12px;border-bottom:1.5px solid #e2ebe5;padding-bottom:10px;">
      <h2 style="font-size:21px;color:#124336;display:flex;align-items:center;gap:8px;margin:0;">
        <span>📋</span> ${lang==='hi'?'डॉक्टर के लिए संपूर्ण सारांश':'Doctor Overview & Clinical Findings'}
      </h2>
      <span class="badge ${v.status==='reviewed'?'reviewed':v.status==='ready'?'ready':'intake'}" style="font-weight:700;">
        ${v.status==='reviewed'?t('reviewed'):lang==='hi'?'समीक्षा हेतु सारांश':'Clinical summary'}
      </span>
    </div>
    <p class="muted" style="margin-top:-4px;margin-bottom:18px;font-size:13.5px;">${t('safety')}</p>
    ${['complaint','history','current_medicine','historical_medicine','allergy','lab','other'].map(cat => {
      const items = v.facts.filter(f => f.category === cat);
      const meta = catMeta[cat] || { icon: '📌', en: t(cat), hi: t(cat) };
      const catLabel = lang === 'hi' ? meta.hi : meta.en;
      const isAlert = cat === 'allergy' && items.length > 0;
      const countLabel = items.length === 1 
        ? (lang==='hi'?'1 जानकारी':'1 item') 
        : (lang==='hi'?`${items.length} जानकारियां`:`${items.length} items`);

      return `
        <div class="category-block" style="margin-bottom:20px;">
          <div class="category-header ${isAlert ? 'category-header-alert' : ''} ${cat === 'complaint' ? 'category-header-complaint' : ''}">
            <div class="category-title">
              <span class="category-icon" style="font-size:19px;">${meta.icon}</span>
              <span>${esc(catLabel)}</span>
            </div>
            <span class="category-count">${items.length ? countLabel : (lang==='hi'?'कोई रिकॉर्ड नहीं':'0 items')}</span>
          </div>
          <div class="category-items">
            ${items.length ? items.map(factHTML).join('') : `<p class="muted" style="padding:10px 14px;background:#f9fbf9;border:1px dashed #dce5df;border-radius:8px;font-size:13px;margin:6px 0;">${t('noFacts')}</p>`}
          </div>
        </div>
      `;
    }).join('')}
  </section>`;

  const patientSummarySection=`<section class="panel">
    <div class="section-title">
      <h2>📋 ${lang==='hi'?'आपकी जानकारी का संक्षिप्त सारांश':'Your Consultation Summary'}</h2>
      <span class="badge ${v.status==='reviewed'?'reviewed':v.status==='ready'?'ready':'intake'}">
        ${v.status==='reviewed'?(lang==='hi'?'✓ डॉक्टर द्वारा देखा गया':'✓ Reviewed by doctor'):t(v.status)}
      </span>
    </div>
    <p class="muted" style="margin-top:-6px;font-size:13.5px;">
      ${lang==='hi'?'यह आपके द्वारा दर्ज की गई परेशानी, दवाओं और रिपोर्ट का आसान सारांश है:':'A simple, clear summary of your symptoms, medicines, and records prepared for your doctor:'}
    </p>

    <div class="patient-summary-grid">
      <div class="patient-card">
        <h3>🩺 ${lang==='hi'?'आपकी परेशानी व लक्षण':'Chief Complaint & Symptoms'}</h3>
        <div class="patient-card-body">
          ${(() => {
            const complaints = v.facts.filter(f => f.category === 'complaint');
            const history = v.facts.filter(f => f.category === 'history');
            if (!complaints.length && !history.length) {
              return `<span class="muted">${lang==='hi'?'अभी कोई परेशानी दर्ज नहीं है। ऊपर दिए गए फॉर्म में बोलें या लिखें।':'No symptoms recorded yet. Use the form above to record your problem.'}</span>`;
            }
            return `
              ${complaints.length ? `
                <ul style="margin:2px 0 0;padding-left:18px;line-height:1.6;">
                  ${complaints.map(f => `<li><strong>${esc(val(f))}</strong>${f.date ? ` <small class="muted">(${esc(f.date)})</small>` : ''}</li>`).join('')}
                </ul>
              ` : ''}
              ${history.length ? `
                <div style="margin-top:6px;font-size:12.5px;color:var(--muted);">
                  <strong>${lang==='hi'?'संबंधित इतिहास':'History'}:</strong> ${history.map(f => esc(val(f))).join(', ')}
                </div>
              ` : ''}
            `;
          })()}
        </div>
      </div>

      <div class="patient-card">
        <h3>💊 ${lang==='hi'?'वर्तमान दवाएं':'Current Medicines'}</h3>
        <div class="patient-card-body">
          ${(() => {
            const meds = v.facts.filter(f => f.category === 'current_medicine');
            if (!meds.length) {
              return `<span class="patient-pill">${lang==='hi'?'वर्तमान दवाओं की जानकारी अज्ञात':'Current medicine use unknown'}</span>`;
            }
            return `
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                ${meds.map(f => `<span class="patient-pill">💊 ${esc(val(f))}</span>`).join('')}
              </div>
            `;
          })()}
        </div>
      </div>

      <div class="patient-card">
        <h3>⚠️ ${lang==='hi'?'दवा या अन्य एलर्जी':'Known Allergies'}</h3>
        <div class="patient-card-body">
          ${(() => {
            const allergies = v.facts.filter(f => f.category === 'allergy');
            if (!allergies.length) {
              return `<span class="patient-pill">${lang==='hi'?'एलर्जी की जानकारी अज्ञात':'Allergy information unknown'}</span>`;
            }
            return `
              <div style="display:flex;flex-wrap:wrap;gap:6px;">
                ${allergies.map(f => `<span class="patient-pill alert">⚠️ ${esc(val(f))}</span>`).join('')}
              </div>
            `;
          })()}
        </div>
      </div>

      <div class="patient-card">
        <h3>📄 ${lang==='hi'?'संलग्न दस्तावेज़ व पुरानी जांच':'Uploaded Documents & Records'}</h3>
        <div class="patient-card-body">
          ${(() => {
            const histMeds = v.facts.filter(f => f.category === 'historical_medicine');
            const labs = v.facts.filter(f => f.category === 'lab');
            const count = v.sources.filter(s=>s.type==='document').length;
            if (!count && !histMeds.length && !labs.length) {
              return `<span class="muted">${lang==='hi'?'कोई फाइल या पुरानी पर्ची अपलोड नहीं की गई।':'No documents or reports uploaded yet.'}</span>`;
            }
            return `
              <div style="font-size:13px;line-height:1.6;">
                <div><strong>${count}</strong> ${lang==='hi'?'दस्तावेज़/पर्चियां अपलोड हैं':'document(s) attached'}</div>
                ${histMeds.length ? `<div class="muted">• ${histMeds.length} ${lang==='hi'?'पुराने प्रिस्क्रिप्शन रिकॉर्ड मिले':'past prescription record(s)'}</div>` : ''}
                ${labs.length ? `<div class="muted">• ${labs.length} ${lang==='hi'?'लैब जांच रिपोर्ट मिली':'lab investigation(s)'}</div>` : ''}
              </div>
            `;
          })()}
        </div>
      </div>
    </div>

    ${v.doctorNote ? `
      <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:10px;padding:12px 16px;margin-top:16px;">
        <strong style="color:#166534;font-size:14.5px;">🩺 ${lang==='hi'?'डॉक्टर की सलाह / निर्देश':'Doctor\'s Review Note'}:</strong>
        <div style="margin-top:4px;color:#14532d;font-size:14px;line-height:1.5;">${esc(v.doctorNote)}</div>
        <div class="muted" style="font-size:12px;margin-top:4px;">${esc(v.reviewedBy)} · ${date(v.reviewedAt)}</div>
      </div>
    ` : ''}
  </section>`;

  const doctorActionsSection=isDoctor&&v.status!=='reviewed'?`
    <section class="doc-station no-print">
      <h2>⏱ ${lang==='hi'?'त्वरित डॉक्टर परामर्श व एक्शन':'Quick Doctor Actions'}</h2>
      <p class="muted" style="margin-top:-6px;font-size:13px;">${lang==='hi'?'समय बचाएं: तुरंत समीक्षा पूरी करें, या स्टाफ को सुधारात्मक टिप्पणी के साथ पुनः सौंपें।':'Save time: sign off consultation or assign back to staff with a small correction note.'}</p>
      
      <div class="action-box assign-card">
        <h3 style="color:#92400e;display:flex;align-items:center;gap:6px;margin:0 0 4px;">
          <span>📋</span> ${t('assignStaff')}
        </h3>
        <p class="muted" style="font-size:12.5px;margin:0 0 8px;">${lang==='hi'?'यदि जानकारी अधूरी है या वाइटल्स/दवाएं दोबारा जांचनी हैं, तो स्टाफ को छोटा नोट भेजें:':'If information or vitals need checking, assign back to staff with a small note:'}</p>
        <div class="quick-chips">
          <button type="button" class="chip" data-action="quick-chip" data-target="assign-note" data-val="${lang==='hi'?'वर्तमान दवाओं की खुराक व विवरण मरीज से दोबारा जांचें।':'Verify medication dosages and frequency with patient.'}">${lang==='hi'?'दवाएं जांचें':'Verify medicines'}</button>
          <button type="button" class="chip" data-action="quick-chip" data-target="assign-note" data-val="${lang==='hi'?'रक्तचाप और वाइटल्स दोबारा मापें।':'Re-check blood pressure and pulse rate.'}">${lang==='hi'?'BP/वाइटल्स दोबारा मापें':'Re-check BP/vitals'}</button>
          <button type="button" class="chip" data-action="quick-chip" data-target="assign-note" data-val="${lang==='hi'?'मरीज की एलर्जी का इतिहास स्पष्ट करें।':'Clarify known allergy history.'}">${lang==='hi'?'एलर्जी स्पष्ट करें':'Check allergy'}</button>
          <button type="button" class="chip" data-action="quick-chip" data-target="assign-note" data-val="${lang==='hi'?'मूल रिपोर्ट और प्रिस्क्रिप्शन की तारीख जांचें।':'Verify original report and prescription clinical dates.'}">${lang==='hi'?'तारीख जांचें':'Verify dates'}</button>
          <button type="button" class="chip" data-action="quick-chip" data-target="assign-note" data-val="${lang==='hi'?'मुख्य परेशानी कितने दिनों से है, स्पष्ट करें।':'Clarify chief complaint duration and severity.'}">${lang==='hi'?'लक्षण अवधि जांचें':'Check duration'}</button>
        </div>
        <div class="field">
          <label for="assign-note">${t('assignNote')}</label>
          <textarea id="assign-note" style="min-height:70px;" placeholder="${lang==='hi'?'स्टाफ के लिए छोटा नोट लिखें या ऊपर दिए चिप्स पर क्लिक करें...':'Short note for staff to review and correct...'}"></textarea>
        </div>
        <div class="actions">
          <button type="button" style="background:#d97706;" data-action="assign-staff">↳ ${t('assignStaff')}</button>
        </div>
      </div>

      <div class="action-box review-card">
        <h3 style="color:#126b52;display:flex;align-items:center;gap:6px;margin:0 0 4px;">
          <span>✓</span> ${t('quickReview')}
        </h3>
        <p class="muted" style="font-size:12.5px;margin:0 0 8px;">${lang==='hi'?'त्वरित टिप्पणी चुनें या लिखें और परामर्श पूर्ण करें:':'Select a quick note or type brief remarks to complete consultation:'}</p>
        <div class="quick-chips">
          <button type="button" class="chip" data-action="quick-chip" data-target="doctor-note" data-val="${lang==='hi'?'इतिहास व वाइटल्स जांचे गए। परामर्श पूर्ण।':'History & vitals reviewed. Consultation completed.'}">${lang==='hi'?'परामर्श पूर्ण':'Consultation complete'}</button>
          <button type="button" class="chip" data-action="quick-chip" data-target="doctor-note" data-val="${lang==='hi'?'दवाएं समझाई गईं। 1 सप्ताह बाद फॉलो-अप।':'Medications advised as discussed. Follow-up in 1 week.'}">${lang==='hi'?'1 सप्ताह फॉलो-अप':'1-week follow-up'}</button>
          <button type="button" class="chip" data-action="quick-chip" data-target="doctor-note" data-val="${lang==='hi'?'जांच रिपोर्ट की सलाह दी गई।':'Diagnostic investigations ordered.'}">${lang==='hi'?'जांच की सलाह':'Tests ordered'}</button>
        </div>
        <div class="field">
          <label for="doctor-note">${t('doctorNote')}</label>
          <textarea id="doctor-note" style="min-height:70px;" placeholder="${lang==='hi'?'डॉक्टर टिप्पणी (वैकल्पिक)...':'Doctor review note (optional)...'}"></textarea>
        </div>
        <div class="actions">
          <button data-action="doctor-review">✓ ${t('review')}</button>
        </div>
      </div>
    </section>
  `:(v.doctorNote?`<section class="panel"><h3>${t('doctorNote')}</h3><p>${esc(v.doctorNote)}</p></section>`:'');

  const staffAssignmentBanner=v.staffNote?`
    <div class="staff-assignment-banner">
      <div class="banner-icon">⚠️</div>
      <div style="flex:1;">
        <div class="banner-title">${t('assignedBanner')}</div>
        <div class="banner-meta">${date(v.staffNoteAt)} · Dr. ${esc(v.staffNoteBy)}</div>
        <div class="banner-note">"${esc(v.staffNote)}"</div>
        
        <div class="verify-action-box" style="background:#ffffff;border:1px solid #e0c58a;border-radius:10px;padding:12px;margin-top:10px;">
          <div class="quick-chips" style="margin:0 0 8px;">
            <button type="button" class="chip" data-action="quick-chip" data-target="staff-verify-note" data-val="${lang==='hi'?'दवाओं की खुराक व विवरण मरीज से सत्यापित किए गए।':'Medication dosages and frequency verified with patient.'}">${lang==='hi'?'दवाएं सत्यापित':'Medicines verified'}</button>
            <button type="button" class="chip" data-action="quick-chip" data-target="staff-verify-note" data-val="${lang==='hi'?'वाइटल्स पुनः मापकर सही दर्ज किए गए।':'Vitals re-checked and updated.'}">${lang==='hi'?'वाइटल्स जांचे':'Vitals re-checked'}</button>
            <button type="button" class="chip" data-action="quick-chip" data-target="staff-verify-note" data-val="${lang==='hi'?'सभी रिपोर्ट व विवरण जांचे गए। सब सही है।':'All reports and records verified. Ready for doctor.'}">${lang==='hi'?'सब सत्यापित':'All verified'}</button>
          </div>
          <div class="field" style="margin-bottom:10px;">
            <label for="staff-verify-note" style="font-size:12.5px;font-weight:700;color:#78350f;">
              ${lang==='hi'?'सत्यापन टिप्पणी (छोटा नोट):':'Verification short note:'}
            </label>
            <input id="staff-verify-note" placeholder="${lang==='hi'?'छोटा नोट लिखें या ऊपर चिप पर क्लिक करें...':'Short note (e.g. Dosages verified with patient)...'}" style="background:#fdfdfd;border:1px solid #d97706;border-radius:8px;padding:9px 12px;font-size:13.5px;width:100%;">
          </div>
          <div class="actions" style="margin:0;display:flex;gap:10px;align-items:center;">
            <button type="button" data-action="staff-verify-confirm" style="background:#126b52;color:#ffffff;font-weight:700;padding:8px 18px;border-radius:8px;display:inline-flex;align-items:center;gap:6px;box-shadow:0 2px 6px rgba(18,107,82,0.25);">
              ✓ ${lang==='hi'?'सत्यापित (Verified)':'Verified'}
            </button>
            <button type="button" class="secondary" data-action="staff-verify-cancel" style="padding:8px 16px;border-radius:8px;font-weight:600;background:#ffffff;border:1px solid #cedbd3;color:#374151;">
              ✕ ${lang==='hi'?'रद्द करें (Cancel)':'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  `:(v.staffVerifyNote?`
    <div class="notice success no-print" style="display:flex;align-items:center;gap:10px;margin-bottom:18px;">
      <span style="font-size:18px;">✓</span>
      <div>
        <strong>${lang==='hi'?'स्टाफ द्वारा सत्यापित':'Verified by staff'}:</strong> "${esc(v.staffVerifyNote)}"
        <div class="muted" style="font-size:12px;">${esc(v.staffVerifiedBy)} · ${date(v.staffVerifiedAt)}</div>
      </div>
    </div>
  `:'');

  const intakeSections=editable&&!isDoctor?`
    <section class="panel no-print" style="border:1.5px solid #126b52;background:#fbfdfc;box-shadow:0 3px 12px rgba(18,107,82,0.06);border-radius:12px;margin-bottom:20px;padding:22px;">
      <div class="section-title" style="margin-bottom:10px;">
        <h2 style="color:#126b52;margin:0;font-size:19px;display:flex;align-items:center;gap:8px;">
          <span>📝</span> ${lang==='hi'?'वर्तमान परेशानी व डॉक्टर परामर्श का कारण':'Current Issue & Reason for Doctor Visit'}
        </h2>
        <span class="badge intake" style="font-weight:700;">${lang==='hi'?'नई विज़िट विवरण':'New visit entry'}</span>
      </div>
      <p class="muted" style="margin-top:-2px;font-size:13.5px;line-height:1.5;">
        ${lang==='hi'?'डॉक्टर से परामर्श का वर्तमान कारण लिखें या बोलें। यदि कोई नई जांच रिपोर्ट या पर्ची हो तो उसे भी नीचे जोड़ें:':'Please enter the current issue why you are visiting the doctor, and attach any new reports or documents if available:'}
      </p>

      <div class="row" style="margin-bottom:12px;align-items:center;">
        <label for="speaker" style="font-size:13px;font-weight:600;color:var(--muted);">${lang==='hi'?'जानकारी देने वाला:':'Speaking on behalf of:'}</label>
        <select id="speaker" style="width:auto;padding:6px 10px;font-size:13px;border-radius:6px;">
          <option value="patient">${t('patient')}</option>
          <option value="attendant">${lang==='hi'?'परिचारक (Attendant)':'Attendant'}</option>
        </select>
      </div>

      <div class="field" style="margin-bottom:16px;">
        <label for="complaint" style="font-weight:700;font-size:14.5px;color:#183b32;margin-bottom:8px;display:block;">
          ${lang==='hi'?'वर्तमान समस्या / लक्षण (बोलें या लिखें):':'Current issue / Reason for visiting doctor (type or speak):'}
        </label>
        <textarea id="complaint" style="min-height:100px;font-size:14.5px;line-height:1.5;padding:12px;border-radius:8px;border:1px solid #cedbd3;width:100%;box-sizing:border-box;" placeholder="${lang==='hi'?'उदा. पिछले 2 दिनों से तेज बुखार, खांसी, या डायबिटीज की नियमित जांच व दवाओं के लिए...':'e.g. Fever and body ache for 2 days, or coming for regular diabetes checkup and medicine refill...'}"></textarea>
      </div>

      <div class="file-zone" style="border:2px dashed #b7cec2;background:#f3f7f4;padding:18px;border-radius:10px;margin-bottom:16px;">
        <div style="font-weight:700;font-size:14px;color:#1b4d3e;margin-bottom:4px;">
          📄 ${lang==='hi'?'नई जांच रिपोर्ट या पर्ची अपलोड करें (यदि उपलब्ध हो)':'Upload new documents or reports (if available)'}
        </div>
        <div class="muted" style="font-size:12.5px;margin-bottom:10px;">${t('uploadHint')}</div>
        <input id="upload" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" multiple style="margin:0 auto 10px;max-width:320px;display:block;">
        <div class="actions" style="justify-content:center;gap:8px;">
          <button type="button" data-action="upload" class="secondary small">${t('upload')}</button>
          <button type="button" class="secondary small" data-action="camera">${t('camera')}</button>
          <label class="secondary small mobile-only" style="margin:0;">${lang==='hi'?'फोन कैमरा':'Phone camera'}<input id="capture-file" type="file" accept="image/jpeg,image/png" capture="environment"></label>
        </div>
      </div>

      <div class="actions" style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
        <button type="button" class="secondary" data-action="record" data-target="complaint" style="display:inline-flex;align-items:center;gap:6px;">
          🎤 ${t('record')}
        </button>
        <button type="button" data-action="save-text" style="background:#126b52;color:#ffffff;font-weight:700;padding:10px 22px;border-radius:8px;box-shadow:0 2px 6px rgba(18,107,82,0.25);">
          ✓ ${lang==='hi'?'परेशानी सहेजें व रिकॉर्ड अपडेट करें':'Save Issue & Update Records'}
        </button>
      </div>
      <p class="muted" style="margin:8px 0 0;font-size:12px;">${lang==='hi'?'सहेजने पर AI आपकी वर्तमान समस्या व दस्तावेजों का विश्लेषण कर रिकॉर्ड्स अपडेट करेगा।':'Upon saving, AI extracts clinical facts from your issue & documents to update your history and records.'}</p>
      ${consent()}
    </section>
  `:'';

  const isNewVisitIntake = isPatient && (
    (window.activeNewVisitId === v.id || sessionStorage.getItem('active_new_visit_id') === v.id) &&
    v.status === 'intake' &&
    v.questions && v.questions.length > 0
  );

  const intakeGuideAside = isNewVisitIntake ? `
    <section class="panel intake-guide-panel" style="background:#ffffff;border:1.5px solid #b8dcce;border-radius:14px;padding:20px;box-shadow:0 3px 12px rgba(18,107,82,0.06);margin-bottom:20px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
        <span style="font-size:22px;">🩺</span>
        <div>
          <h3 style="margin:0;color:#126b52;font-size:16px;">${lang==='hi'?'परामर्श तैयारी व अगला चरण':'Consultation Prep & Guide'}</h3>
          <small class="muted">${lang==='hi'?'समय की बचत व बेहतर सलाह':'Faster & clearer consultation'}</small>
        </div>
      </div>
      
      <div class="intake-stepper" style="margin-bottom:16px;background:#f7faf8;border:1px solid #e0ebe4;border-radius:10px;padding:12px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;color:#166534;font-size:13px;font-weight:600;">
          <span>✓</span> <span>${lang==='hi'?'1. वर्तमान समस्या दर्ज हुई':'1. Issue recorded'}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;color:#126b52;font-size:13px;font-weight:750;">
          <span style="background:#126b52;color:#fff;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;">2</span>
          <span>${lang==='hi'?'2. अधूरी जानकारी स्पष्ट करें (जारी)':'2. Clarify missing details (Active)'}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px;color:var(--muted);font-size:13px;">
          <span style="background:#e5eae7;color:var(--muted);border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:11px;">3</span>
          <span>${lang==='hi'?'3. डॉक्टर परामर्श':'3. Doctor consultation'}</span>
        </div>
      </div>

      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:12px;margin-bottom:14px;">
        <div style="font-weight:700;color:#166534;font-size:13px;margin-bottom:4px;">⏱ ${lang==='hi'?'2-मिनट डॉक्टर लाभ':'Two-Minute Efficiency'}</div>
        <div style="font-size:12.5px;color:#14532d;line-height:1.5;">
          ${lang==='hi'?'इन प्रश्नों के उत्तर देने से डॉक्टर को आपके पिछले इतिहास व दवाओं का स्पष्ट पता चलता है और परामर्श में समय बचता है।':'Answering these questions gives your doctor instant clinical history, saving 10-15 minutes of consultation time.'}
        </div>
      </div>

      <div style="font-size:12.5px;color:var(--muted);line-height:1.5;">
        <div>🎤 <strong>${lang==='hi'?'आवाज़ से बोलें:':'Voice input:'}</strong> ${lang==='hi'?'प्रत्येक प्रश्न के नीचे माइक बटन दबाकर बोल सकते हैं।':'Tap microphone to speak answers.'}</div>
        <div style="margin-top:6px;">🏷 <strong>${lang==='hi'?'त्वरित चिप्स:':'Quick chips:'}</strong> ${lang==='hi'?'सुझाव चिप्स पर क्लिक कर तुरंत भरें।':'Tap any quick chip suggestion to fill.'}</div>
      </div>

      ${v.sources.filter(s=>s.type==='document').length ? `
        <div style="margin-top:14px;padding-top:12px;border-top:1px solid #e2ebe5;">
          <strong style="font-size:12.5px;color:#183b30;display:block;margin-bottom:6px;">📄 ${lang==='hi'?'संलग्न दस्तावेज़':'Attached Documents'}:</strong>
          ${v.sources.filter(s=>s.type==='document').map(s=>`
            <div style="font-size:12px;padding:4px 0;display:flex;justify-content:space-between;align-items:center;">
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:180px;">${esc(s.name)}</span>
              <button class="source-link" data-action="source" data-id="${s.id}" style="font-size:11.5px;">${t('source')}</button>
            </div>
          `).join('')}
        </div>
      ` : ''}
    </section>
  ` : '';

  const questionsSection=editable?`
    <section class="panel no-print questions-intake-panel" style="${isPatient?'border:2px solid #126b52;background:#fbfdfc;box-shadow:0 4px 18px rgba(18,107,82,0.1);border-radius:14px;padding:22px;margin-bottom:22px;':''}">
      ${isDoctor?consent():''}
      <div class="section-title">
        <div>
          ${isPatient?`<div class="eyebrow" style="color:#126b52;margin-bottom:4px;">✨ ${lang==='hi'?'AI क्लिनिकल पूछताछ':'AI Clinical Clarification'}</div>`:''}
          <h2 style="${isPatient?'color:#126b52;margin:0;font-size:20px;':''}">${t('questions')}</h2>
        </div>
        ${!isPatient?`<button class="secondary small" data-action="clarify">🔍 ${t('checkMissing')}</button>`:''}
      </div>
      <p class="muted">${lang==='hi'?'AI द्वारा पहचानी गई अधूरी जानकारी के उत्तर दें ताकि डॉक्टर को सही विवरण मिले:':'Answer these clarifying questions to provide missing clinical details before meeting your doctor:'}</p>
      ${v.questions && v.questions.length?`
        <form id="answers">
          ${v.questions.map((q,i)=>{
            const qText = lang==='hi'?q.hi:q.en;
            const chips = isPatient ? getQuestionQuickChips(qText, lang) : [];
            return `
              <div class="question" style="background:#f8faf9;border:1px solid #dbe5e0;border-radius:10px;padding:14px;margin-bottom:12px;">
                <label for="answer-${i}" style="font-weight:700;display:block;margin-bottom:8px;color:#183b32;font-size:14px;">
                  ❓ ${esc(qText)}
                </label>
                ${chips.length ? `
                  <div class="quick-chips" style="margin:4px 0 8px;">
                    <span style="font-size:11.5px;color:var(--muted);align-self:center;margin-right:2px;">${lang==='hi'?'सुझाव:':'Quick:'}</span>
                    ${chips.map(c=>`<button type="button" class="chip" data-action="chip-answer" data-target="answer-${i}" data-val="${esc(c)}">${esc(c)}</button>`).join('')}
                  </div>
                ` : ''}
                <textarea id="answer-${i}" name="answer-${i}" style="width:100%;min-height:65px;border-radius:8px;" placeholder="${lang==='hi'?'उत्तर यहाँ लिखें, सुझाव चुनें, या माइक से बोलें...':'Type your answer or speak using microphone...'}"></textarea>
                <div class="actions" style="margin-top:6px;display:flex;gap:8px;">
                  <button type="button" class="secondary small" data-action="record" data-target="answer-${i}">🎤 ${t('record')}</button>
                </div>
              </div>
            `;
          }).join('')}
          <div class="actions" style="margin-top:10px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
            <button style="background:#126b52;color:#ffffff;font-weight:700;padding:10px 20px;border-radius:8px;">✓ ${t('answer')}</button>
            ${isPatient?`<button type="button" class="secondary" data-action="skip-questions" style="padding:10px 16px;border-radius:8px;">${lang==='hi'?'बाद में बताएं (छोड़ें)':'Skip for now'}</button>`:''}
          </div>
        </form>
      `:`
        <div style="background:#f8faf9;border:1px dashed #cedbd3;border-radius:10px;padding:18px;text-align:center;">
          <p class="muted" style="margin:0 0 10px;">${lang==='hi'?'वर्तमान में कोई अनुत्तरित प्रश्न नहीं हैं।':'No pending questions right now.'}</p>
          ${!isPatient?`<button class="secondary small" data-action="clarify">🔍 ${t('checkMissing')}</button>`:''}
        </div>
      `}
    </section>
  `:'';

  app.innerHTML=header()+`
  <main class="wrap">
    <button class="secondary small no-print" data-action="back">← ${lang==='hi'?'सभी विज़िट सूची (डैशबोर्ड)':'All visits (Dashboard)'}</button>
    <div class="patient-visit-hero" style="${isPatient?'background:linear-gradient(135deg,#eef7f2 0%,#ffffff 100%);padding:18px 22px;border:1px solid #cfe0d8;border-radius:12px;margin:12px 0 16px;box-shadow:0 1px 4px rgba(0,0,0,0.04);':'margin:12px 0 16px;'}">
      <div class="row" style="align-items:center;">
        <div>
          ${isPatient?`<div class="eyebrow" style="margin-bottom:4px;color:#126b52;font-weight:700;font-size:12px;text-transform:uppercase;letter-spacing:0.05em;">${lang==='hi'?'मरीज परामर्श पोर्टल':'Patient Consultation Portal'}</div>`:''}
          <h1 style="margin:0 0 6px;">${esc(p.name)} <span class="muted" style="font-size:20px;font-weight:400;">${esc(p.age)} ${lang==='hi'?'वर्ष':'years'} · ${esc(p.mobile)}</span></h1>
          <p class="muted" style="margin:0;font-size:13px;">${t('patientId')}: <strong>${esc(p.id)}</strong> · ${t('visitId')}: <strong>${esc(v.id)}</strong> · ${date(v.createdAt)}</p>
        </div>
        <div class="actions no-print" style="align-items:center;flex-wrap:wrap;gap:8px;">
          ${badge(v.status)}
          ${isPatient?`<button class="secondary small" data-action="edit-profile" data-id="${p.id}">👤 ${t('profile')}</button>`:''}
          ${isPatient&&v.status==='intake'?`<button data-action="status" data-status="submitted" style="background:#126b52;color:#ffffff;font-weight:700;padding:8px 14px;border-radius:8px;">✓ ${t('submit')}</button>`:''}
          ${isPatient?`<button data-action="new-visit" data-id="${p.id}" style="background:#126b52;color:#ffffff;font-weight:700;padding:8px 14px;border-radius:8px;box-shadow:0 2px 6px rgba(18,107,82,0.25);">+ ${t('newVisit')}</button>`:''}
          ${isDoctor&&v.status!=='reviewed'?`<button data-action="mark-done" style="background:#126b52;color:#ffffff;display:inline-flex;align-items:center;gap:6px;font-weight:700;padding:8px 14px;border-radius:8px;box-shadow:0 2px 6px rgba(18,107,82,0.25);">✓ ${t('markDone')}</button>`:''}
          ${isStaff&&v.status!=='reviewed'?(v.status!=='ready'?`<button data-action="mark-ready-top" style="background:#126b52;color:#ffffff;display:inline-flex;align-items:center;gap:6px;font-weight:700;padding:8px 14px;border-radius:8px;box-shadow:0 2px 6px rgba(18,107,82,0.25);">✓ ${lang==='hi'?'डॉक्टर के लिए तैयार करें':'Mark as ready for doc'}</button>`:`<button data-action="reopen-intake-top" class="secondary" style="font-weight:600;padding:8px 12px;border-radius:8px;">↺ ${lang==='hi'?'जानकारी पुनः खोलें':'Reopen intake'}</button>`):''}
          <button class="secondary small" data-action="print">${t('print')}</button>
        </div>
      </div>
    </div>
    ${!config.aiReady?`<div class="notice no-print">${t('noKey')}</div>`:''}
    ${v.status==='reviewed'?`<div class="notice success">${t('reviewed')}: ${esc(v.reviewedBy)} · ${date(v.reviewedAt)}</div>`:''}
    
    ${staffAssignmentBanner}

    <div class="visit-layout">
      <div>
        ${isPatient ? `
          ${v.staffNote ? `
            <div class="notice no-print" style="background:#fffbeb;border:1px solid #fde68a;margin-bottom:16px;">
              <strong style="color:#92400e;">⚠️ ${lang==='hi'?'स्टाफ/डॉक्टर निर्देश':'Staff/Doctor Note'}:</strong> "${esc(v.staffNote)}"
            </div>
          ` : ''}
          ${v.facts.some(f=>f.isCarriedOver)?`
            <div class="notice success no-print" style="margin-bottom:14px;">
              <strong>✓ ${lang==='hi'?'पिछली विज़िट से सहेजा गया इतिहास':'Saved history from previous visit'}:</strong> ${lang==='hi'?'आपकी ज्ञात एलर्जी व पुराना इतिहास सुरक्षित है।':'Your allergies and chronic medical history are saved.'}
            </div>
          `:''}
          ${patientSummarySection}
          ${isNewVisitIntake ? questionsSection : ''}
          ${v.vitals && v.vitals.length ? renderVitalsDashboard(v, false) : ''}
        ` : isDoctor ? `
          ${clinicalSummaryCard(v)}
          ${renderVitalsDashboard(v, false)}
          ${summarySection}
          ${doctorActionsSection}
        ` : `
          ${staffVisitOverviewCard(v)}
          ${renderVitalsDashboard(v, true)}
          ${intakeSections}
          ${summarySection}
        `}
      </div>

      <aside>
        ${isPatient && isNewVisitIntake ? intakeGuideAside : ''}
        <section class="panel">
          <h3>${t('profile')}</h3>
          <div class="profile-grid">
            ${['name','fatherName','mobile','email','city','state','age'].map(k=>`<div><span>${t(k)}</span>${esc(p[k]||'—')}</div>`).join('')}
          </div>
          <div class="actions no-print">
            <button class="secondary small" data-action="edit-profile" data-id="${p.id}">${t('edit')}</button>
          </div>
        </section>

        <section class="panel">
          <h3>${t('attention')}</h3>
          ${uniqueIssues.length?uniqueIssues.map(factHTML).join(''):`<p class="muted">${lang==='hi'?'कोई हाइलाइट किया गया आइटम नहीं। यह चिकित्सकीय सुरक्षा की पुष्टि नहीं है।':'No highlighted items. This does not establish clinical safety.'}</p>`}
          ${uniqueAiIssues.map(i=>`<div class="notice">${esc(lang==='hi'?i.hi:i.en)}<div>${i.sourceIds.map(id=>`<button class="source-link" data-action="source" data-id="${id}">${t('source')}</button>`).join(' · ')}</div></div>`).join('')}
          ${uniqueGaps.map(g=>`<div class="notice">${esc(typeof g==='string'?g:lang==='hi'?g.hi:g.en)}</div>`).join('')}
          ${!v.facts.some(f=>f.category==='allergy')?`<div class="notice" style="border-color:#e45b5b;background:#fef2f2;color:#991b1b;">⚠️ ${t('allergy')}: ${t('noFacts')}</div>`:''}
        </section>

        ${isStaff && editable ? questionsSection : ''}

        <section class="panel">
          <h3>${t('timeline')}</h3>
          <div class="timeline">
            ${[...v.facts].filter(f=>f.date).sort((a,b)=>b.date.localeCompare(a.date)).map(f=>`
              <div class="timeline-item">
                <strong>${esc(f.date)}</strong><br>
                ${esc(val(f))}<br>
                <button class="source-link" data-action="source" data-id="${f.sourceId}" data-fact="${f.id}">${t('source')}</button>
              </div>
            `).join('')||`<p class="muted">${t('unknown')}</p>`}
          </div>
        </section>

        <section class="panel">
          <h3>${t('documents')}</h3>
          ${v.sources.map(s=>`
            <div class="source">
              <div class="row">
                <div class="source-name">${esc(s.name)}</div>
                ${badge(s.status)}
              </div>
              <div class="muted">${date(s.createdAt)}</div>
              ${s.error?`<p class="error">${esc(s.error)}</p>`:''}
              <div class="actions">
                <button class="source-link" data-action="source" data-id="${s.id}">${t('source')}</button>
                ${editable&&s.status!=='done'?`<button class="secondary small" data-action="retry" data-id="${s.id}">${t('retry')}</button>`:''}
              </div>
            </div>
          `).join('')||`<p class="muted">${t('noFacts')}</p>`}
        </section>

        ${!isDoctor && !isPatient ? `
        <section class="panel no-print">
          <h3>${lang==='hi'?'अगला चरण':'Next step'}</h3>
          ${isStaff&&v.status!=='reviewed'?`
            <p class="muted">${t('readyHint')}</p>
            <div class="actions">
              <button data-action="status" data-status="ready">${t('markReady')}</button>
              <button class="secondary" data-action="status" data-status="intake">${t('reopen')}</button>
            </div>
          `:`<p class="muted">${t(v.status)}</p>`}
        </section>
        ` : ''}

        ${!isPatient?`
          <section class="panel">
            <h3>${lang==='hi'?'गतिविधि रिकॉर्ड':'Activity record'}</h3>
            ${v.audit.slice(-12).reverse().map(a=>`
              <div class="audit">
                ${esc(a.action)} · ${esc(a.role)}<br>
                ${date(a.at)}
              </div>
            `).join('')}
          </section>
        `:''}
      </aside>
    </div>
    ${footer()}
  </main>`;
}
function modal(html){const d=$('#dialog');d.innerHTML=`<div class="row"><h2>OPD Brief</h2><button class="secondary small" data-action="close">${t('close')}</button></div>${html}`;d.showModal();}
async function refreshVisit(){renderVisit(await api('/visits/'+current.id));}
function profileModal(p,register=false){modal(`<h3>${t(register?'register':'profile')}</h3><form id="${register?'staff-register':'edit-profile-form'}" data-id="${esc(p?.id||'')}"><div class="form-grid">${profileFields(p)}</div><div class="actions"><button>${t(register?'register':'saved')}</button></div></form>`);}
async function showSource(id,factId){const s=current.sources.find(s=>s.id===id),f=current.facts.find(f=>f.id===factId);if(!s)return;const url=`/api/visits/${current.id}/file?source=${s.id}${f?.page?'#page='+f.page:''}`;modal(`<h3>${esc(s.name)}</h3><p class="muted">${s.speaker?esc(s.speaker)+' · ':''}${date(s.createdAt)}</p>${f?`<p class="muted">${t('sourceQuote')}${f.page?' · Page '+f.page:''}</p><blockquote><mark>${esc(f.quote)}</mark></blockquote>`:''}${s.type==='text'?`<blockquote>${esc(s.text)}</blockquote>`:`<div class="document-view">${s.mime==='application/pdf'?`<iframe title="Original report" src="${url}"></iframe><a href="${url}" target="_blank" rel="noopener">${t('source')}</a>`:`<img alt="Original uploaded document" src="${url}">`}</div>`}`);}
let mediaStream=null,recorder=null;
async function record(target,button){ensureConsent();if(recorder?.state==='recording'){recorder.stop();return;}if(!navigator.mediaDevices?.getUserMedia)throw new Error('Microphone requires localhost or HTTPS. / माइक्रोफोन हेतु localhost या HTTPS आवश्यक है।');if(typeof MediaRecorder==='undefined')throw new Error('Recording is unsupported in this browser. Use Chrome/Edge or type.');mediaStream=await navigator.mediaDevices.getUserMedia({audio:true});const mime=['audio/webm;codecs=opus','audio/mp4','audio/ogg;codecs=opus'].find(m=>MediaRecorder.isTypeSupported(m));recorder=new MediaRecorder(mediaStream,mime?{mimeType:mime}:undefined);let chunks=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data);};recorder.onstop=()=>{clearTimeout(recorder.limit);mediaStream.getTracks().forEach(t=>t.stop());button.textContent=t('record');button.classList.remove('recording');const blob=new Blob(chunks,{type:recorder.mimeType});task(async()=>{const ticket=await sendChunks(blob,{kind:'audio',name:'voice-recording',mime:blob.type.split(';')[0]});const j=await api('/transcribe',ticket);const input=document.getElementById(target);if(input)input.value=(input.value?input.value+'\n':'')+j.text;toast(lang==='hi'?'ट्रांसक्रिप्ट जांचें और सहेजें।':'Review transcript before saving.');});};recorder.start();recorder.limit=setTimeout(()=>{if(recorder.state==='recording')recorder.stop();},120000);button.textContent=t('stop');button.classList.add('recording');}
function blobData(blob){return new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result.split(',')[1]);r.onerror=reject;r.readAsDataURL(blob);});}
async function sendChunks(blob,metadata){
  if(!blob.size||blob.size>10*1024*1024)throw new Error('Maximum 10 MB per file / अधिकतम 10 MB');
  const ticket=await api('/uploads',{...metadata,size:blob.size});
  for(let start=0,part=0;start<blob.size;start+=ticket.chunkSize,part++){
    const data=await blobData(blob.slice(start,start+ticket.chunkSize));
    const payload={uploadId:ticket.id,uploadToken:ticket.token,part,data};
    let lastError;for(let attempt=0;attempt<3;attempt++){try{await api('/uploads/chunk',payload);lastError=null;break;}catch(e){lastError=e;}}
    if(lastError)throw lastError;
  }
  return {uploadId:ticket.id,uploadToken:ticket.token};
}
async function uploadFiles(files){ensureConsent();if(!files.length)throw new Error(lang==='hi'?'पहले फाइल चुनें।':'Choose a file first.');const id=current.id;
  for(const f of files){const ticket=await sendChunks(f,{kind:'document',visitId:id,name:f.name,mime:f.type});await api(`/visits/${id}/source`,{type:'document',...ticket});}
  await refreshVisit();
}
async function camera(){ensureConsent();if(!navigator.mediaDevices?.getUserMedia)throw new Error('Camera requires localhost or HTTPS; use phone camera file input instead.');mediaStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}}});modal(`<video id="camera-video" autoplay playsinline muted></video><div class="actions"><button data-action="snap">${t('camera')}</button></div>`);$('#camera-video').srcObject=mediaStream;}
$('#dialog').addEventListener('close',()=>{if(mediaStream&&recorder?.state!=='recording')mediaStream.getTracks().forEach(t=>t.stop());});
document.addEventListener('click',async e=>{const b=e.target.closest('[data-action]');if(!b)return;const a=b.dataset.action;if(busy)return;
 if(a==='language'){if(recorder?.state==='recording'){toast('Stop recording first / पहले रिकॉर्डिंग रोकें');return;}lang=lang==='en'?'hi':'en';localStorage.setItem('opd_language',lang);document.documentElement.lang=lang;current?renderVisit(current):user?renderDashboard():renderAuth();return;}
 if(a==='close'){ $('#dialog').close();return;}
 if(a==='role'){authRole=b.dataset.role;challenge=null;renderAuth();return;}
 if(a==='auth-tab'){authTab=b.dataset.tab;challenge=null;renderAuth();return;}
 if(a==='print'){window.print();return;}
 if(a==='queue-tab'){queueTab=b.dataset.tab;queuePage=1;renderDashboard();return;}
 if(a==='queue-page'){const p=parseInt(b.dataset.page);if(p>=1){queuePage=p;renderDashboard();}return;}
 if(a==='record'){try{await record(b.dataset.target,b);}catch(e){toast(e.message);}return;}
 await task(async()=>{
  if(a==='logout'){await api('/logout',{});user=null;current=null;queueTab=null;patientEditing=false;renderAuth();}
  if(a==='back'){sessionStorage.removeItem('active_new_visit_id');window.activeNewVisitId=null;patientEditing=false;current=null;await load();}
  if(a==='open'){sessionStorage.removeItem('active_new_visit_id');window.activeNewVisitId=null;patientEditing=false;renderVisit(await api('/visits/'+b.dataset.id));}
  if(a==='edit-visit'){sessionStorage.removeItem('active_new_visit_id');window.activeNewVisitId=null;patientEditing=false;renderVisit(await api('/visits/'+b.dataset.id));}
  if(a==='toggle-edit'){patientEditing=!patientEditing;if(current)renderVisit(current);}
  if(a==='chip-answer'){
    const targetId=b.dataset.target;
    const val=b.dataset.val;
    const ta=document.getElementById(targetId);
    if(ta){
      if(ta.value.trim()){
        ta.value=ta.value.trim()+', '+val;
      }else{
        ta.value=val;
      }
      ta.focus();
    }
    return;
  }
  if(a==='skip-questions'){
    sessionStorage.removeItem('active_new_visit_id');
    window.activeNewVisitId=null;
    toast(lang==='hi'?'प्रश्न छोड़े गए। डॉक्टर के लिए सारांश तैयार है।':'Questions skipped. Ready for consultation.');
    if(current) renderVisit(current);
    return;
  }
  if(a==='new-visit'){
    sessionStorage.removeItem('active_new_visit_id');window.activeNewVisitId=null;
    if(user.role==='patient'){
      patientNewVisitOpen=true;
      current=null;
      window.newCapturedBlobFiles=[];
      renderDashboard();
      setTimeout(()=>{
        const el=document.getElementById('new-complaint');
        if(el){el.focus();el.scrollIntoView({behavior:'smooth',block:'center'});}
      },80);
      return;
    }
    patientEditing=false;
    const v=await api('/visits',{patientId:b.dataset.id||user.patientId,forceNew:true});
    visits=await api('/visits');
    renderVisit(v);
    return;
  }
  if(a==='cancel-new-visit'){
    sessionStorage.removeItem('active_new_visit_id');window.activeNewVisitId=null;
    patientNewVisitOpen=false;
    window.newCapturedBlobFiles=[];
    renderDashboard();
    return;
  }
  if(a==='new-pick-files'){
    const input=document.getElementById('new-upload');
    if(input) input.click();
    return;
  }
  if(a==='submit-new-visit'){
    ensureConsent();
    const text=($('#new-complaint')?.value||'').trim();
    const uploadInput=$('#new-upload');
    const selectedFiles=uploadInput?.files ? [...uploadInput.files] : [];
    if(window.newCapturedBlobFiles && window.newCapturedBlobFiles.length){
      selectedFiles.push(...window.newCapturedBlobFiles);
    }
    if(!text && !selectedFiles.length){
      throw new Error(lang==='hi'?'कृपया वर्तमान समस्या / परेशानी लिखें या दस्तावेज़ चुनें।':'Please enter the current issue or select a document.');
    }
    const newV=await api('/visits',{patientId:user.patientId,forceNew:true});
    if(text){
      await api('/visits/'+newV.id+'/source',{
        type:'text',
        text,
        speaker:$('#new-speaker')?.value||'patient',
        name:lang==='hi'?'वर्तमान परेशानी':'Current reason for visit'
      });
    }
    if(selectedFiles.length){
      for(const f of selectedFiles){
        const ticket=await sendChunks(f,{kind:'document',visitId:newV.id,name:f.name,mime:f.type});
        await api(`/visits/${newV.id}/source`,{type:'document',...ticket});
      }
    }
    window.newCapturedBlobFiles=[];
    patientNewVisitOpen=false;
    try {
      await api('/visits/'+newV.id+'/clarify', {});
    } catch(e) {
      console.warn('Auto clarify notice:', e.message);
    }
    sessionStorage.setItem('active_new_visit_id', newV.id);
    window.activeNewVisitId = newV.id;
    toast(lang==='hi'?'नई विज़िट दर्ज की गई। AI द्वारा पूछे गए विवरण भरें।':'New visit recorded. Please answer AI clarifying questions.');
    visits=await api('/visits');
    renderVisit(await api('/visits/'+newV.id));
    return;
  }
  if(a==='register-modal')profileModal({},true);
  if(a==='edit-profile')profileModal(patients.find(p=>p.id===b.dataset.id)||current?.patient);
  if(a==='existing-visit')modal(`<h3>${t('newVisit')}</h3><form id="existing-visit"><label>${t('patient')}</label><select name="patientId" required>${patients.map(p=>`<option value="${p.id}">${esc(p.name)} · ${p.id} · ${esc(p.mobile)}</option>`).join('')}</select><div class="actions"><button>${t('newVisit')}</button></div></form>`);
  if(a==='save-text'){
    ensureConsent();
    const text=($('#complaint')?.value||'').trim();
    const files=$('#upload')?.files ? [...$('#upload').files] : [];
    if(!text && !files.length) throw new Error(lang==='hi'?'कृपया वर्तमान परेशानी लिखें या दस्तावेज चुनें।':'Please enter the current issue or select a document.');
    if(text){
      await api('/visits/'+current.id+'/source',{type:'text',text,speaker:$('#speaker')?.value||'patient',name:lang==='hi'?'वर्तमान परेशानी':'Current reason for visit'});
    }
    if(files.length){
      await uploadFiles(files);
    }
    patientEditing=false;
    toast(lang==='hi'?'वर्तमान परेशानी सहेजी गई व रिकॉर्ड अपडेट किए गए।':'Current issue saved and records updated.');
    await refreshVisit();
  }
  if(a==='upload')await uploadFiles([...$('#upload').files]);
  if(a==='retry'){ensureConsent();await api('/visits/'+current.id+'/retry',{sourceId:b.dataset.id});await refreshVisit();}
  if(a==='source')await showSource(b.dataset.id,b.dataset.fact);
  if(a==='status'){await api('/visits/'+current.id+'/status',{status:b.dataset.status});await refreshVisit();}
  if(a==='mark-ready-top'){
    await api('/visits/'+current.id+'/status',{status:'ready'});
    toast(lang==='hi'?'मरीज डॉक्टर के लिए तैयार दर्ज किया गया (Ready for doc)।':'Marked as ready for doc. Status updated.');
    filter='';
    await load();
    setTimeout(()=>{const s=document.getElementById('search');if(s){s.focus();s.select();}},60);
  }
  if(a==='reopen-intake-top'){
    await api('/visits/'+current.id+'/status',{status:'intake'});
    toast(lang==='hi'?'मरीज की जानकारी पुनः खोली गई।':'Intake reopened for staff review.');
    await refreshVisit();
  }
  if(a==='staff-verify-confirm'){
    const note=($('#staff-verify-note')?.value||'').trim() || (lang==='hi'?'स्टाफ द्वारा सत्यापन पूर्ण।':'Checked and verified by staff.');
    try{
      await api('/visits/'+current.id+'/verify-note',{note});
    }catch(e){
      await api('/visits/'+current.id+'/status',{status:'ready',clearStaffNote:true,staffVerifyNote:note});
    }
    toast(lang==='hi'?'सत्यापित दर्ज किया गया। विज़िट डॉक्टर के लिए तैयार है।':'Verified by staff. Visit marked ready for doctor.');
    filter='';
    await load();
    setTimeout(()=>{const s=document.getElementById('search');if(s){s.focus();s.select();}},60);
  }
  if(a==='staff-verify-cancel'){
    try{
      await api('/visits/'+current.id+'/cancel-note',{});
    }catch(e){
      await api('/visits/'+current.id+'/status',{status:current.status,clearStaffNote:true});
    }
    toast(lang==='hi'?'सुधार अनुरोध हटाया गया।':'Doctor correction note dismissed.');
    await refreshVisit();
  }
  if(a==='open-vitals-modal'){vitalsModal();return;}
  if(a==='vitals-history'){vitalsHistoryModal(current);return;}
  if(a==='quick-chip'){const target=document.getElementById(b.dataset.target);if(target){target.value=b.dataset.val;target.focus();}return;}
  if(a==='assign-staff'){
    const note=($('#assign-note')?.value||'').trim();
    if(!note)throw new Error(lang==='hi'?'स्टाफ के लिए एक छोटा निर्देश या टिप्पणी दर्ज करें।':'Please enter or select a note for staff.');
    await api('/visits/'+current.id+'/assign',{note});
    filter='';
    await load();
    setTimeout(()=>{const s=document.getElementById('search');if(s){s.focus();s.select();}},60);
    toast(lang==='hi'?'विज़िट स्टाफ को सुधारात्मक निर्देश के साथ सौंपी गई। अगला मरीज खोजें।':'Visit assigned to staff with instructions. Ready for next patient.');
  }
  if(a==='mark-done'||a==='doctor-review'){
    const note=($('#doctor-note')?.value||'').trim() || (lang==='hi'?'परामर्श पूर्ण।':'Meeting & consultation completed.');
    await api('/visits/'+current.id+'/review',{note});
    filter='';
    await load();
    setTimeout(()=>{const s=document.getElementById('search');if(s){s.focus();s.select();}},60);
    toast(lang==='hi'?'परामर्श पूर्ण दर्ज किया गया (मीटिंग डन)। अगला मरीज खोजें।':'Meeting done with doctor. Ready for next patient.');
  }
  if(a==='edit-fact'){const f=current.facts.find(f=>f.id===b.dataset.id);modal(`<h3>${t('edit')}</h3><blockquote>${esc(f.quote)}</blockquote><form id="edit-fact-form" data-id="${f.id}"><div class="field"><label>English</label><textarea name="value_en">${esc(f.value_en)}</textarea></div><div class="field"><label>हिन्दी</label><textarea name="value_hi">${esc(f.value_hi)}</textarea></div><div class="field"><label>${lang==='hi'?'दस्तावेज़ की तारीख (अज्ञात हो तो खाली)':'Clinical date (blank if unknown)'}</label><input type="date" name="date" value="${esc(f.date||'')}"></div><div class="field"><label>${lang==='hi'?'सत्यापन का आधार':'Verification / correction note'}</label><input name="note" required></div><div class="actions"><button>${t('check')}</button></div></form>`);}
  if(a==='account'){if(user.role==='patient')profileModal(patients[0]);else modal(`<form id="account-form"><div class="form-grid">${['name','mobile','department','qualification','employeeId'].map(k=>`<div class="field"><label>${esc(dict[k]?t(k):k)}</label><input name="${k}" value="${esc(user[k]||'')}"></div>`).join('')}</div><div class="actions"><button>${t('saved')}</button></div></form>`);}
  if(a==='camera')await camera();
  if(a==='snap'){const video=$('#camera-video');if(!video.videoWidth)throw new Error('Camera not ready');const canvas=document.createElement('canvas');canvas.width=video.videoWidth;canvas.height=video.videoHeight;canvas.getContext('2d').drawImage(video,0,0);const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',.92));mediaStream.getTracks().forEach(t=>t.stop());$('#dialog').close();modal(`<h3>${lang==='hi'?'कैप्चर जांचें':'Review capture'}</h3><div class="document-view"><img id="capture-preview" src="${canvas.toDataURL('image/jpeg',.92)}" alt="Camera capture"></div><div class="actions"><button data-action="capture-upload">${t('upload')}</button><button class="secondary" data-action="camera">${lang==='hi'?'फिर लें':'Retake'}</button></div>`);window.captureBlob=blob;}
  if(a==='capture-upload'){
    const f=new File([window.captureBlob],'camera-'+Date.now()+'.jpg',{type:'image/jpeg'});
    $('#dialog').close();
    if(current){
      await uploadFiles([f]);
    } else {
      if(!window.newCapturedBlobFiles) window.newCapturedBlobFiles=[];
      window.newCapturedBlobFiles.push(f);
      const listEl=document.getElementById('new-file-list');
      if(listEl){
        listEl.innerHTML += `<div style="color:#126b52;font-weight:600;margin-top:2px;">📷 ${esc(f.name)} (${Math.round(f.size/1024)} KB)</div>`;
      }
      toast(lang==='hi'?'फोटो जोड़ी गई।':'Photo captured and attached.');
    }
  }
  if(a==='extract-profile'){ensureConsent();const out=await api('/profile/extract',{text:$('#reg-transcript').value});for(const [k,v]of Object.entries(out)){const input=$(`#registration [name="${k}"]`);if(input&&v!==null)input.value=v;}toast(lang==='hi'?'फॉर्म जांचें और पंजीकरण करें।':'Review filled fields, then register.');}
  if(a==='clarify'){ensureConsent();await api('/visits/'+current.id+'/clarify',{});await refreshVisit();}
 });
});
document.addEventListener('submit',e=>{e.preventDefault();const f=e.target,b=Object.fromEntries(new FormData(f));task(async()=>{
 if(f.id==='registration'){if(!validateProfileForm(f))throw new Error(lang==='hi'?'फॉर्म में त्रुटियाँ हैं। कृपया जांचें।':'Please fix the errors in the form before submitting.');await api('/register',{...b,language:lang});authTab='login';challenge=null;renderAuth();toast(lang==='hi'?'पंजीकरण पूरा। मोबाइल से लॉगिन करें।':'Registered. Log in using your mobile or email.');}
 if(f.id==='patient-login'){const id=(b.identifier||'').trim();if(!id)throw new Error(lang==='hi'?'मोबाइल नंबर या ईमेल दर्ज करें।':'Enter mobile number or email.');if(!challenge){challenge=(await api('/otp/request',b)).challenge;renderAuth();$('#patient-login [name=identifier]').value=id;toast('Demo OTP: '+config.otp);}else{if(!/^\d{6}$/.test(String(b.otp||'').trim()))throw new Error(lang==='hi'?'6 अंकों का वैध OTP दर्ज करें।':'Enter a valid 6-digit OTP.');user=await api('/otp/verify',{challenge,otp:b.otp});challenge=null;await load();}}
 if(f.id==='staff-login'){if(!b.email||!b.password)throw new Error(lang==='hi'?'ईमेल और पासवर्ड आवश्यक हैं।':'Email and password are required.');user=await api('/login',{...b,role:authRole});queueTab=authRole==='doctor'?'ready':'intake';await load();}
 if(f.id==='staff-register'){if(!validateProfileForm(f))throw new Error(lang==='hi'?'फॉर्म में त्रुटियाँ हैं। कृपया जांचें।':'Please fix the errors in the form before submitting.');const p=await api('/patients',{...b,language:lang});$('#dialog').close();patients=await api('/patients');renderVisit(await api('/visits',{patientId:p.id}));}
 if(f.id==='existing-visit'){const v=await api('/visits',b);$('#dialog').close();renderVisit(v);}
 if(f.id==='edit-profile-form'){if(!validateProfileForm(f))throw new Error(lang==='hi'?'फॉर्म में त्रुटियाँ हैं। कृपया जांचें।':'Please fix the errors in the form before submitting.');await api('/profile',{...b,patientId:f.dataset.id,language:lang});$('#dialog').close();if(current)await refreshVisit();else await load();}
 if(f.id==='vitals-form'){if(!validateVitalsForm(f))return;await api('/visits/'+current.id+'/vitals',b);$('#dialog').close();toast(lang==='hi'?'वाइटल्स सफलतापूर्वक दर्ज किए गए।':'Vitals recorded successfully.');await refreshVisit();}
 if(f.id==='edit-fact-form'){await api('/visits/'+current.id+'/facts',{...b,factId:f.dataset.id,verified:true});$('#dialog').close();await refreshVisit();}
 if(f.id==='account-form'){user=await api('/account',b);$('#dialog').close();current?renderVisit(current):renderDashboard();}
 if(f.id==='answers'){ensureConsent();const text=current.questions.map((q,i)=>b['answer-'+i]?.trim()?`${lang==='hi'?q.hi:q.en}\n${b['answer-'+i]}`:'').filter(Boolean).join('\n\n');if(!text)throw new Error(lang==='hi'?'कम से कम एक उत्तर दर्ज करें':'Enter at least one answer');await api('/visits/'+current.id+'/source',{type:'text',text,name:lang==='hi'?'स्पष्टीकरण उत्तर':'Clarification answers'});sessionStorage.removeItem('active_new_visit_id');window.activeNewVisitId=null;toast(lang==='hi'?'उत्तर सहेजे गए। डॉक्टर के लिए सारांश तैयार है।':'Answers saved! Consultation summary updated for doctor.');await refreshVisit();}
 });});
document.addEventListener('input',e=>{
  if(e.target.id==='search'){const pos=e.target.selectionStart;filter=e.target.value;queuePage=1;renderDashboard();$('#search').focus();$('#search').setSelectionRange(pos,pos);}
  // Live validation on profile fields
  const field=e.target.dataset?.field;
  if(field){
    const errEl=document.getElementById('err-'+field);
    if(!errEl)return;
    const v=(e.target.value||'').trim();
    if(field==='mobile'){const mob=v.replace(/[\s()-]/g,'').replace(/^\+91/,'');if(mob&&!/^\d{10}$/.test(mob)){errEl.textContent=lang==='hi'?'10 अंकों का मोबाइल नंबर दर्ज करें':'Enter a valid 10-digit mobile number';errEl.style.display='block';e.target.classList.add('input-error');e.target.classList.remove('input-ok');}else if(mob.length===10&&/^\d{10}$/.test(mob)){errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error');e.target.classList.add('input-ok');}else{errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error','input-ok');}}
    else if(field==='email'){if(v&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){errEl.textContent=lang==='hi'?'सही ईमेल पता दर्ज करें':'Enter a valid email address';errEl.style.display='block';e.target.classList.add('input-error');e.target.classList.remove('input-ok');}else if(v){errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error');e.target.classList.add('input-ok');}else{errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error','input-ok');}}
    else if(field==='name'){if(!v){errEl.textContent=lang==='hi'?'नाम आवश्यक है':'Full name is required';errEl.style.display='block';e.target.classList.add('input-error');e.target.classList.remove('input-ok');}else{errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error');e.target.classList.add('input-ok');}}
    else if(field==='age'){const n=Number(v);if(v&&(!/^\d{1,3}$/.test(v)||n<0||n>120)){errEl.textContent=lang==='hi'?'0 से 120 के बीच आयु':'Age must be 0–120';errEl.style.display='block';e.target.classList.add('input-error');e.target.classList.remove('input-ok');}else if(v){errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error');e.target.classList.add('input-ok');}else{errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error','input-ok');}}
    else if(field==='vital-weight'){const w=parseFloat(v);if(v&&(isNaN(w)||w<1||w>300)){errEl.textContent=lang==='hi'?'1 से 300 किलो दर्ज करें':'Weight must be 1–300 kg';errEl.style.display='block';e.target.classList.add('input-error');}else{errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error');}}
    else if(field==='vital-height'){const h=parseFloat(v);if(v&&(isNaN(h)||h<30||h>250)){errEl.textContent=lang==='hi'?'30 से 250 सेमी दर्ज करें':'Height must be 30–250 cm';errEl.style.display='block';e.target.classList.add('input-error');}else{errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error');}}
    else if(field==='vital-bp'){if(v&&!/^\d{2,3}\s*\/\s*\d{2,3}$/.test(v)){errEl.textContent=lang==='hi'?'प्रारूप: 120/80':'Format: 120/80';errEl.style.display='block';e.target.classList.add('input-error');}else{errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error');}}
    else if(field==='vital-pulse'){const p=parseInt(v);if(v&&(isNaN(p)||p<30||p>250)){errEl.textContent=lang==='hi'?'30 से 250 bpm दर्ज करें':'Pulse must be 30–250 bpm';errEl.style.display='block';e.target.classList.add('input-error');}else{errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error');}}
    else if(field==='vital-sugar'){const s=parseInt(v);if(v&&(isNaN(s)||s<20||s>600)){errEl.textContent=lang==='hi'?'20 से 600 mg/dL दर्ज करें':'Sugar must be 20–600 mg/dL';errEl.style.display='block';e.target.classList.add('input-error');}else{errEl.textContent='';errEl.style.display='none';e.target.classList.remove('input-error');}}
  }
});
document.addEventListener('change',e=>{
  if(e.target.id==='capture-file'){const files=[...e.target.files];task(()=>uploadFiles(files));}
  if(e.target.id==='new-upload'){
    const files=[...e.target.files];
    const listEl=document.getElementById('new-file-list');
    if(listEl){
      listEl.innerHTML=files.map(f=>`<div style="color:#126b52;font-weight:600;margin-top:2px;">📄 ${esc(f.name)} (${Math.round(f.size/1024)} KB)</div>`).join('');
    }
  }
  if(e.target.id==='new-capture-file'){
    const files=[...e.target.files];
    if(!window.newCapturedBlobFiles) window.newCapturedBlobFiles=[];
    window.newCapturedBlobFiles.push(...files);
    const listEl=document.getElementById('new-file-list');
    if(listEl){
      listEl.innerHTML += files.map(f=>`<div style="color:#126b52;font-weight:600;margin-top:2px;">📷 ${esc(f.name)} (${Math.round(f.size/1024)} KB)</div>`).join('');
    }
  }
  if(e.target.id==='consent'||e.target.matches?.('.consent input')){localStorage.setItem('opd_consent',e.target.checked?'true':'false');document.querySelectorAll('#consent, .consent input').forEach(cb=>{cb.checked=e.target.checked;});}
});
window.addEventListener('beforeunload',()=>mediaStream?.getTracks().forEach(t=>t.stop()));
async function init(){config=await api('/config');try{await load();}catch{renderAuth();}document.documentElement.lang=lang;}
init().catch(e=>{app.textContent=e.message;});
