import { useState, useRef, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase Client ────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://ttlfxmutfzdajgfryesn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0bGZ4bXV0ZnpkYWpnZnJ5ZXNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDI2NzUsImV4cCI6MjA4ODM3ODY3NX0.zMriVY2bOMpg5FHrMF2ll7PIuOlJ0imLCjU_Nhhe-z0";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── EmailJS Config (REST API — no npm package needed) ──────────────────────────
const EJS_SERVICE      = "service_yn1v1ou";
const EJS_TPL_APPROVAL = "e6lonk3";
const EJS_TPL_GENERIC  = "ko82075";
const EJS_PUBLIC_KEY   = "cyXSI_7PBXxL4b_2L";

async function ejsSend(templateId, params) {
  try {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service_id: EJS_SERVICE, template_id: templateId, user_id: EJS_PUBLIC_KEY, template_params: params }),
    });
    if (!res.ok) console.error("EmailJS error:", await res.text());
    else console.log("✅ Email sent to", params.to_email);
  } catch(e) { console.error("EmailJS fetch error:", e); }
}

async function sendApprovalEmail({ to_name, to_email, user_email, user_password }) {
  await ejsSend(EJS_TPL_APPROVAL, { to_name, to_email, user_email, user_password });
}

async function sendGenericEmail({ to_name, to_email, email_subject, email_body }) {
  await ejsSend(EJS_TPL_GENERIC, { to_name, to_email, email_subject, email_body });
}

// ── Offline ECWA Logo (inline SVG as data URI) ─────────────────────────────────
const LOGO_SVG = `data:image/jpeg;base64,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`;

// ── Global Styles (fully offline — no Google Fonts) ────────────────────────────
const GlobalStyles = () => (
  <style>{`
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
    .app-root{font-family:'Segoe UI','Trebuchet MS',Calibri,sans-serif;background:#f0ede8;color:#1a1a2e;min-height:100vh;}
    h1,h2,h3,.playfair{font-family:Georgia,'Times New Roman',serif;}
    .fade-in{animation:fadeIn 0.4s ease forwards;}
    @keyframes fadeIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
    .slide-in{animation:slideIn 0.35s ease forwards;}
    @keyframes slideIn{from{opacity:0;transform:translateX(-14px);}to{opacity:1;transform:translateX(0);}}
    .pulse{animation:pulse 2s infinite;}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.4);}50%{box-shadow:0 0 0 8px rgba(201,168,76,0);}}
    .btn{font-family:'Segoe UI','Trebuchet MS',sans-serif;font-weight:600;font-size:14px;border-radius:8px;padding:10px 20px;cursor:pointer;border:none;transition:all 0.2s;}
    .btn-gold{background:linear-gradient(135deg,#c9a84c,#a8893a);color:#fff;}
    .btn-gold:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(201,168,76,0.4);}
    .btn-gold:disabled{opacity:0.5;cursor:not-allowed;transform:none;}
    .btn-outline{background:transparent;color:#0b1f3a;border:1.5px solid #0b1f3a;}
    .btn-outline:hover{background:#0b1f3a;color:#fff;}
    .btn-red{background:#c0392b;color:#fff;}
    .btn-red:hover{background:#a93226;}
    .btn-ghost{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.14);color:#fff;font-family:'Segoe UI',sans-serif;font-size:12px;border-radius:7px;padding:5px 12px;cursor:pointer;}
    .btn-sm{padding:5px 12px;font-size:12px;}
    .card{background:#fff;border-radius:14px;box-shadow:0 2px 20px rgba(11,31,58,0.07);overflow:hidden;}
    input,select,textarea{font-family:'Segoe UI','Trebuchet MS',sans-serif;border:1.5px solid #e2ddd6;border-radius:8px;padding:10px 14px;font-size:14px;color:#1a1a2e;background:#fafaf8;outline:none;width:100%;transition:border-color 0.2s;}
    input:focus,select:focus,textarea:focus{border-color:#c9a84c;background:#fff;}
    label{font-size:12px;font-weight:600;color:#5a5a7a;display:block;margin-bottom:5px;letter-spacing:0.5px;text-transform:uppercase;}
    .badge{display:inline-flex;align-items:center;padding:3px 11px;border-radius:20px;font-size:12px;font-weight:600;}
    .overlay{position:fixed;inset:0;background:rgba(11,31,58,0.65);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px;animation:fadeIn 0.2s;}
    .modal{background:#fff;border-radius:16px;width:100%;max-width:660px;max-height:92vh;overflow-y:auto;box-shadow:0 24px 60px rgba(11,31,58,0.3);}
    .trow:hover{background:#fafaf8;}
    .link-btn{background:none;border:none;color:#c9a84c;font-family:'Segoe UI',sans-serif;font-size:13px;font-weight:600;cursor:pointer;text-decoration:underline;padding:0;}
    .err-box{background:#fdecea;border:1px solid #f5c6c2;color:#c0392b;border-radius:8px;padding:10px 14px;font-size:13px;}
    .info-box{background:rgba(201,168,76,0.1);border:1px solid rgba(201,168,76,0.3);color:#9a7a2a;border-radius:8px;padding:10px 14px;font-size:12px;}
    .tab-bar{display:flex;gap:4px;background:#f0ede8;border-radius:8px;padding:3px;}
    .tab{padding:6px 14px;border-radius:6px;border:none;cursor:pointer;font-size:12px;font-weight:600;font-family:'Segoe UI',sans-serif;transition:all 0.2s;background:transparent;color:#888;}
    .tab.active{background:#0b1f3a;color:#c9a84c;}
    .divider{display:flex;align-items:center;gap:12px;margin:4px 0;}
    .divider::before,.divider::after{content:'';flex:1;height:1px;background:rgba(255,255,255,0.1);}
    .divider span{font-size:12px;color:rgba(255,255,255,0.25);}
    .doc-row{border:1.5px solid #e8e4dc;border-radius:10px;padding:12px;background:#fafaf8;display:flex;align-items:center;gap:12px;transition:all 0.2s;}
    .doc-row:hover{border-color:#c9a84c;}
    .upload-box{border:2px dashed #d0ccc4;border-radius:10px;padding:20px;text-align:center;cursor:pointer;transition:all 0.2s;background:#fafaf8;}
    .upload-box:hover{border-color:#c9a84c;background:#fef9ee;}
    .scard{border:1.5px solid #e8e4dc;border-radius:12px;padding:16px;background:#fff;cursor:pointer;transition:all 0.2s;}
    .scard:hover{border-color:#c9a84c;box-shadow:0 4px 16px rgba(201,168,76,0.15);transform:translateY(-2px);}
    .cat-btn{border:2px solid rgba(255,255,255,0.12);border-radius:12px;padding:16px 20px;cursor:pointer;transition:all 0.25s;background:rgba(255,255,255,0.04);color:#fff;text-align:left;width:100%;}
    .cat-btn:hover,.cat-btn.active{background:rgba(201,168,76,0.12);border-color:#c9a84c;}
    .section-hdr{display:flex;align-items:center;gap:10px;padding:14px 20px;background:linear-gradient(135deg,#0b1f3a,#1a3a5c);color:#c9a84c;font-family:Georgia,serif;font-size:15px;font-weight:600;}
    .alert-banner{background:linear-gradient(135deg,#c0392b,#e74c3c);color:#fff;padding:10px 20px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;}
    .warn-banner{background:linear-gradient(135deg,#e67e22,#f39c12);color:#fff;padding:8px 20px;font-size:12px;font-weight:600;display:flex;align-items:center;gap:8px;}
    .notif-dot{width:8px;height:8px;background:#c0392b;border-radius:50%;position:absolute;top:2px;right:2px;}
    .att-present{background:#eafbf0;color:#27ae60;}
    .att-late{background:#fef3e2;color:#e67e22;}
    .att-absent{background:#fdecea;color:#c0392b;}
    .att-leave{background:#eaf4fb;color:#2980b9;}
    .att-holiday{background:#f5eefb;color:#8e44ad;}
    .att-weekend{background:#f4f6f7;color:#bbb;}
    .id-card{background:linear-gradient(135deg,#0b1f3a 0%,#1a3a5c 100%);border-radius:16px;padding:24px;color:#fff;position:relative;overflow:hidden;width:320px;min-height:200px;}
    .id-card::before{content:'';position:absolute;width:200px;height:200px;border:1px solid rgba(201,168,76,0.15);border-radius:50%;top:-60px;right:-60px;}
    .notif-panel{position:absolute;top:52px;right:16px;width:340px;background:#fff;border-radius:14px;box-shadow:0 8px 40px rgba(11,31,58,0.18);z-index:200;overflow:hidden;border:1px solid #e8e4dc;}
    @media print{
      .no-print{display:none!important;}
      .print-only{display:block!important;}
      body{margin:0;padding:0;font-size:11px;}
      .overlay{position:static!important;background:none!important;padding:0!important;}
      .modal{box-shadow:none!important;border-radius:0!important;max-width:100%!important;width:100%!important;max-height:none!important;overflow:visible!important;}
      header,.mobile-tabs{display:none!important;}
      button{display:none!important;}
      img[alt="sig"]{height:30px!important;max-width:110px!important;}
      @page{margin:10mm;size:A4;}
    }
    .print-only{display:none;}
    .header-mobile{display:none;}
    @media(max-width:768px){
      .header-desktop-row{display:none!important;}
      .header-mobile{display:block!important;}
    }
    @media(min-width:769px){
      .header-mobile{display:none!important;}
      .header-desktop-row{display:flex!important;}
    }

    /* ── MOBILE RESPONSIVE ─────────────────────────────────────────────────── */
    @media(max-width:768px){

      /* Base layout */
      .app-root{font-size:14px;}

      /* Cards fill screen on mobile */
      .card{border-radius:10px;margin-bottom:12px;}

      /* Modals take full screen on mobile */
      .overlay{padding:0;align-items:flex-end;}
      .modal{max-width:100%!important;width:100%!important;max-height:92vh;border-radius:20px 20px 0 0;}

      /* Buttons bigger for touch */
      .btn{padding:12px 18px;font-size:14px;width:100%;}
      .btn-sm{padding:8px 14px;font-size:12px;width:auto;}
      .btn-outline,.btn-red,.btn-gold{width:100%;}

      /* Button rows — stack on mobile */
      div[style*="display:flex"][style*="gap"]:has(.btn){flex-direction:column;}

      /* Inputs full width, bigger touch targets */
      input,select,textarea{font-size:16px!important;padding:12px 14px;}

      /* Section headers */
      .section-hdr{font-size:13px;padding:12px 16px;}

      /* Staff cards */
      .scard{padding:12px;}

      /* Notifications panel full width on mobile */
      .notif-panel{position:fixed;top:auto;bottom:0;left:0;right:0;width:100%;border-radius:20px 20px 0 0;max-height:70vh;}

      /* Tables scroll horizontally */
      table{font-size:12px;}
      td,th{padding:8px 10px!important;}

      /* Doc rows */
      .doc-row{flex-wrap:wrap;gap:8px;}

      /* Alert banners */
      .alert-banner,.warn-banner{font-size:12px;padding:8px 14px;}

      /* Stat cards grid */
      .stat-grid{grid-template-columns:repeat(2,1fr)!important;}

      /* Hide text on small buttons */
      .btn-ghost{padding:6px 10px;font-size:11px;}

      /* Full width containers */
      .fade-in{padding:0 2px;}
    }

    /* Small phones */
    @media(max-width:400px){
      .modal{max-height:96vh;}
      input,select,textarea{font-size:16px!important;}
    }

    /* Desktop — keep original feel */
    @media(min-width:769px){
      .mobile-tabs{display:none!important;}
    }
  `}</style>
);

// ── Constants ──────────────────────────────────────────────────────────────────
const LOGO = LOGO_SVG;

// 15 LCCs from census
const LCCS_DEFAULT = ["Adamba","Agbashi","Alagye","Amaku","Arikpa","Awe","Doma","Gidan Ausa","Gidan Mai'Akuya","Lafia","Mada Station","Nasarawa Eggon","Obi","Tudun Gwandara","Rukubi"];

// 124 Churches & Prayer Houses from census
const CHURCHES_BY_LCC = {
  "Adamba":["ECWA Adamba","ECWA Burum-Burum","ECWA Angwan Dariya","ECWA Bukan Angulu","ECWA Angwan Rimi","ECWA Tudun Allu","ECWA Mudu"],
  "Agbashi":["ECWA Agbashi","ECWA Kaduna Bassa","ECWA P/H, Gidan Gyepa","ECWA Endeshi","ECWA Okpanya","ECWA Ogani","ECWA P/H, Ajimaza","ECWA P/H, Mararaban Bassa","ECWA Odeni Magaji","ECWA P/H, Odori"],
  "Alagye":["ECWA Alagye","ECWA P/H Kututure","ECWA Dogon Kurmi","ECWA Ruwan Baka","ECWA Kongon Lemu","ECWA P/H, Angwan Mangu"],
  "Amaku":["ECWA Amaku","ECWA Gidan Bawa","ECWA Azabutu","ECWA Akpashimu","ECWA Sokoto","ECWA P/H Sabon Gida","ECWA P/H Angwan Isa"],
  "Arikpa":["ECWA No. 1, Arikpa","ECWA No. 2, Arikpa","ECWA Sabon Gida","ECWA Randa-Arikpa","ECWA P/H, Burum-Burum","ECWA Prayer House, B.A.D"],
  "Awe":["ECWA B 1, Awe","ECWA Pantaki","ECWA Borkunu 1","ECWA Borkonu 2","ECWA P/H, Gidan Dugh","ECWA Ampana"],
  "Doma":["ECWA B. 1, Doma","ECWA Goodnews, Doma","ECWA Alwaza","ECWA B. 3, Doma","ECWA No. 4, Doma","ECWA B. 2, Doma","ECWA Yelwa Ediya","ECWA Idadu","ECWA Sabon Gona","ECWA P/H, Ahuta","ECWA P/H, Angwan Bassa","ECWA P/H, Tudun Wadata","ECWA P/H, Igbabo","ECWA Ruttu","ECWA P/H Gidan Asabo"],
  "Gidan Ausa":["ECWA Gidan Ausa","ECWA Kpangwa","ECWA Agyaragu","ECWA Akaleku-Sidi","ECWA Ishigu","ECWA P/H, Akaba"],
  "Gidan Mai'Akuya":["ECWA Gidan Mai'Akuya","ECWA Kirayi","ECWA Tsamiya","ECWA Ashige","ECWA Assakio","ECWA Abu","ECWA Tunga Daudu","ECWA P/H, Sabon Gida, Bakin Kogi"],
  "Lafia":["ECWA Bishara 1, Lafia","ECWA Goodnews GRA","ECWA Ombi 1, Lafia","ECWA Tudun Kauri","ECWA Shabu, Lafia","ECWA Mararaba Akunza","ECWA P/H, Agyaragu Tofa","ECWA P/H, Tudun Kwashini","ECWA P/H, Wakwa","ECWA P/H, Mile-Uku"],
  "Mada Station":["ECWA Angwan Kuya","ECWA Langa-Langa","ECWA Sabon Gida","ECWA Mada Station","ECWA Kafanchan Ezzen","ECWA Angwan Madaki","ECWA P/H, Angba-Iggah"],
  "Nasarawa Eggon":["ECWA 1, Nas. Eggon","ECWA Goodnews Nasarawa Eggon","ECWA 2, Nasarawa Eggon","ECWA Kampani","ECWA Prayer House, Fawo","ECWA Prayer House, Kagbu","ECWA Prayer House, Kundu","ECWA Prayer House, Agbulagu","ECWA Prayer House, Kudugba"],
  "Obi":["ECWA Adudu","ECWA Obi LC","ECWA P/H, Aba'agu","ECWA P/H, Akwanka","ECWA Daddare"],
  "Tudun Gwandara":["ECWA Bukan Sidi, Lafia","ECWA Ombi 2, Kwandare Road","ECWA Tudun Amba","ECWA Prayer House, Allu-Bako","ECWA No.3, Tudun Gwandara","ECWA Goodnews Bukan Sidi, Lafia","ECWA Agwade","ECWA Behind Stadium, Lafia","ECWA Sabon Pegi Shabu, Lafia","ECWA P/H Sabon Pegi, Shabu","ECWA DCC Gospel","ECWA Gospel Prayer House, Poly","ECWA Prayer House, Keffi Wambai","ECWA P/H, Millionaires' Qtrs","ECWA Prayer House, Rafin Ganye","ECWA P/House, Kwanka","ECWA Bishara 2, Sabon Gari, Lafia"],
  "Rukubi":["ECWA Rukubi","ECWA Okpatta","ECWA Sukene","ECWA Kpakwu","ECWA P/H, Arishi"],
};

const DEPARTMENTS = [
  { id:"finance",   label:"Finance",                    head_role:"accountant"      },
  { id:"missions",  label:"Missions (EMS)",              head_role:"ems_coordinator" },
  { id:"admin",     label:"Admin & Personnel",           head_role:"secretary"       },
  { id:"jets",      label:"JETS / Doma Study Center",    head_role:"lecturer"        },
  { id:"executive", label:"Executive",                   head_role:"chairman"        },
];

const OFFICE_ROLES = [
  { title:"Chairman",                  role:"chairman",        dept:"executive" },
  { title:"Vice Chairman",             role:"vice_chairman",   dept:"executive" },
  { title:"Secretary",                 role:"secretary",       dept:"admin"     },
  { title:"ADS (Asst. DCC Secretary)", role:"ads",             dept:"admin"     },
  { title:"Confidential Secretary",    role:"conf_secretary",  dept:"admin"     },
  { title:"Personnel Officer",         role:"personnel",       dept:"admin"     },
  { title:"Accountant",                role:"accountant",      dept:"finance"   },
  { title:"Auditor",                   role:"auditor",         dept:"finance"   },
  { title:"Cashier",                   role:"cashier",         dept:"finance"   },
  { title:"EMS Coordinator",           role:"ems_coordinator", dept:"missions"  },
  { title:"Lecturer",                  role:"lecturer",        dept:"jets"      },
  { title:"Cleaner / Security",        role:"support",         dept:"admin"     },
];

// Number to words for finance forms — returns e.g. "Eighty Thousand Only"
function nairaToWords(amount) {
  if(!amount||isNaN(amount)) return "";
  const n = Math.floor(Math.abs(amount));
  const kobo = Math.round((Math.abs(amount) - n) * 100);
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  function say(n) {
    if(n===0) return "";
    if(n<20) return ones[n]+" ";
    if(n<100) return tens[Math.floor(n/10)]+" "+(n%10?ones[n%10]+" ":"");
    return ones[Math.floor(n/100)]+" Hundred "+(n%100?say(n%100):"");
  }
  function chunk(n,label) { return n>0?say(n)+label+" ":""; }
  const billions=Math.floor(n/1e9), millions=Math.floor((n%1e9)/1e6), thousands=Math.floor((n%1e6)/1e3), remainder=n%1e3;
  let words = (chunk(billions,"Billion")+chunk(millions,"Million")+chunk(thousands,"Thousand")+say(remainder)).trim() || "Zero";
  words += " Naira";
  if(kobo>0) words += " and "+say(kobo).trim()+" Kobo";
  words += " Only";
  return words;
}

const PASTOR_RANKS = ["Church Planter","Unlicensed Pastor","Licensed Pastor","Reverend"];

// ECWA Grade Levels (from official ECWA New Salary Scale)
const GRADE_LEVELS = [
  "ESSA","ESSB","ESSC","ESSD","ESSE","ESSF","ESSG","ESSH","ESSI","ESSJ","ESSK","ESSL",
  "ESSM","ESSN","ESSO","ESSP","ESSQ"
];

// ECWA Annual Basic Salary Scale (steps 1–15 per grade)
// Source: ECWA New Salary Scale document
const SALARY_SCALE = {
  ESSA: [73094,75335,72375,79516,81657,83798,85939,88080,90221,92362,94503,96644,98785,100925,103066],
  ESSB: [74341,76805,79470,82135,84799,87464,90128,92793,95457,98122,100786,103451,106115,108780,111445],
  ESSC: [77854,81942,84230,87419,90607,93795,96983,100171,103360,106548,109736,112924,116112,119300,122489],
  ESSD: [88732,92441,96150,99859,103568,107277,110986,114695,118405,122114,125823,129532,133241,136950,140659],
  ESSE: [109058,113580,118102,122624,127145,131667,136189,140711,145233,149755,154276,158798,163320,167842,172364],
  ESSF: [146261,151830,157399,162968,168537,174106,179675,185245,190814,196383,201952,207521,213090,218659,224228],
  ESSG: [190294,196934,203573,210213,216852,223492,230131,236771,243410,250050,256690,263329,269969,276608,283248],
  ESSH: [224306,232202,240168,248009,255910,263810,271711,279612,287513,295414,303319,311216,319117,327018,334919],
  ESSI: [264079,272765,281452,290138,298825,307511,316197,324884,333570,342256,350943,359629,368315,377002,385688],
  ESSJ: [304661,318866,333071,347276,361481,375686,389891,404096,418301,432506,446711,460916,475121,489326,503531],
  ESSK: [340601,355928,371255,386583,401910,417237,432565,447892,463219,478546,493874,509201,null,null,null],
  ESSL: [376732,397225,417717,438210,458703,479195,499688,520181,540674,561166,581659,602152,null,null,null],
  ESSM: [417242,441877,466511,491145,515779,540413,565047,589681,614315,638950,663584,688218,null,null,null],
  ESSN: [461490,489457,517424,545390,573357,601324,629291,657258,685225,713191,741158,769125,null,null,null],
  ESSO: [514544,546485,578427,610369,642311,674253,706195,738136,770078,802020,833962,865904,null,null,null],
  ESSP: [577499,613200,648901,684603,720304,756005,791707,827408,863110,898811,934512,970214,null,null,null],
  ESSQ: [646381,686058,725734,765410,805087,844763,884440,924116,963792,1003469,null,null,null,null,null],
};

// Calculate annual basic salary for a given grade and step
function getAnnualSalary(gradeLevel) {
  if(!gradeLevel) return null;
  // Parse grade and step e.g. "ESSH/2" → grade=ESSH, step=2
  const match = gradeLevel.match(/^(ESS[A-Q])(?:\/(\d+))?$/i);
  if(!match) return null;
  const grade = match[1].toUpperCase();
  const step  = match[2] ? parseInt(match[2])-1 : 0;
  const row   = SALARY_SCALE[grade];
  if(!row) return null;
  return row[Math.min(step, row.length-1)] || row[0];
}

// Calculate 25% leave grant from annual basic salary
function calcLeaveGrant(gradeLevel) {
  const annual = getAnnualSalary(gradeLevel);
  if(!annual) return null;
  return Math.round(annual * 0.25 * 100) / 100;
}

const DOC_TYPES_FIXED = [
  { id:"employment",   label:"Employment Letter",   icon:"📄", required:true  },
  { id:"cv",           label:"CV / Résumé",         icon:"📋", required:true  },
  { id:"certificate",  label:"Certificates",        icon:"🎓", required:false },
  { id:"confirmation", label:"Confirmation Letter", icon:"✅", required:false },
  { id:"guarantee",    label:"Guarantor Form",      icon:"🤝", required:false },
  { id:"nok",          label:"Next of Kin Form",    icon:"👨‍👩‍👧", required:false },
  { id:"medical",      label:"Medical Certificate", icon:"🏥", required:false },
  { id:"ordination",   label:"Ordination Certificate",icon:"✝️",required:false },
];

const LEAVE_TYPES = ["Annual Leave","Sick Leave","Casual Leave","Compassionate Leave","Study Leave","Maternity / Paternity Leave"];

const LEAVE_STATUS = {
  pending_dept:    { label:"Awaiting Dept Head",        color:"#e67e22", bg:"#fef3e2" },
  pending_admin:   { label:"Awaiting Admin & Personnel", color:"#8e44ad", bg:"#f5eefb" },
  pending_finance: { label:"Awaiting Finance",           color:"#2980b9", bg:"#eaf4fb" },
  pending_auditor: { label:"Awaiting Auditor",           color:"#6c3483", bg:"#f4ecf7" },
  pending_chairman:{ label:"Awaiting Chairman",          color:"#c0392b", bg:"#fdecea" },
  approved:        { label:"Approved ✓",                 color:"#27ae60", bg:"#eafbf0" },
  rejected:        { label:"Rejected",                   color:"#7f8c8d", bg:"#f4f6f7" },
};

// Finance request approval chain
const F_STEPS = [
  { role:"secretary", label:"DCC Secretary"  },
  { role:"finance",   label:"Finance Officer" },
  { role:"auditor",   label:"Auditor"        },
  { role:"chairman",  label:"Chairman"       },
];
const FIN_STATUS = {
  pending_secretary:{ label:"Awaiting Secretary", color:"#e67e22", bg:"#fef3e2" },
  pending_finance:  { label:"Awaiting Finance",   color:"#2980b9", bg:"#eaf4fb" },
  pending_auditor:  { label:"Awaiting Audit",     color:"#8e44ad", bg:"#f5eefb" },
  pending_chairman: { label:"Awaiting Chairman",  color:"#c0392b", bg:"#fdecea" },
  approved:         { label:"Approved ✓",         color:"#27ae60", bg:"#eafbf0" },
  rejected:         { label:"Rejected",           color:"#7f8c8d", bg:"#f4f6f7" },
};
const FNEXT = { secretary:"pending_finance", finance:"pending_auditor", auditor:"pending_chairman", chairman:"approved" };
const FPFOR = { secretary:"pending_secretary", finance:"pending_finance", auditor:"pending_auditor", chairman:"pending_chairman" };

// Sunday excluded collections
const SUNDAY_FIXED_ITEMS = [
  { id:"offering",      label:"Offering",               excluded:false },
  { id:"tithes",        label:"Tithes",                 excluded:false },
  { id:"thanksgiving",  label:"Thanksgiving",           excluded:false },
  { id:"freewill",      label:"Freewill Donations",     excluded:false },
];
const SUNDAY_OPTIONAL_ITEMS = [
  { id:"ems1",          label:"EMS 1st Collection",     excluded:true  },
  { id:"ems2",          label:"EMS 2nd Collection",     excluded:true  },
  { id:"bingham",       label:"Bingham University",     excluded:true  },
  { id:"dcc_week",      label:"DCC Week Collection",    excluded:true  },
  { id:"appreciation",  label:"Pastors Appreciation",   excluded:true  },
];

// ── 2026 Nigerian Public Holidays ──────────────────────────────────────────────
const PUBLIC_HOLIDAYS_2026 = [
  { date:"2026-01-01", name:"New Year's Day" },
  { date:"2026-03-31", name:"Eid el-Fitr (Day 1)" },
  { date:"2026-04-01", name:"Eid el-Fitr (Day 2)" },
  { date:"2026-04-03", name:"Good Friday" },
  { date:"2026-04-06", name:"Easter Monday" },
  { date:"2026-05-01", name:"Workers' Day" },
  { date:"2026-06-07", name:"Eid el-Kabir (Day 1)" },
  { date:"2026-06-08", name:"Eid el-Kabir (Day 2)" },
  { date:"2026-06-12", name:"Democracy Day" },
  { date:"2026-09-05", name:"Maulud (Prophet's Birthday)" },
  { date:"2026-10-01", name:"Independence Day" },
  { date:"2026-12-25", name:"Christmas Day" },
  { date:"2026-12-26", name:"Boxing Day" },
];

// Attendance status helper
const getAttStatus = (dateStr, records, leaves, userId) => {
  const d = new Date(dateStr);
  const dow = d.getDay();
  if(dow===0||dow===6) return "weekend";
  if(PUBLIC_HOLIDAYS_2026.find(h=>h.date===dateStr)) return "holiday";
  // Check approved leave
  const onLeave = leaves.find(l=>l.requesterEmail&&l.status==="approved"&&l.startDate<=dateStr&&l.endDate>=dateStr);
  if(onLeave) return "leave";
  const rec = records.find(r=>r.userId===userId&&r.date===dateStr);
  if(!rec) return "absent";
  if(!rec.clockIn) return "absent";
  return rec.clockIn<="08:15" ? "present" : "late";
};

const ATT_STYLE = {
  present:{ label:"Present", cls:"att-present", icon:"✓" },
  late:   { label:"Late",    cls:"att-late",    icon:"⏰" },
  absent: { label:"Absent",  cls:"att-absent",  icon:"✗" },
  leave:  { label:"On Leave",cls:"att-leave",   icon:"🏖" },
  holiday:{ label:"Holiday", cls:"att-holiday", icon:"🎉" },
  weekend:{ label:"—",       cls:"att-weekend", icon:"—" },
};

// ── Helpers
const money  = n => "₦"+Number(n||0).toLocaleString("en-NG",{minimumFractionDigits:2,maximumFractionDigits:2});
const fdate  = d => d ? new Date(d).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}) : "—";
const today  = () => new Date().toISOString().split("T")[0];
const getAge = dob => dob ? Math.floor((new Date()-new Date(dob))/(1000*60*60*24*365.25)) : null;
const getYOS = doe => doe ? Math.floor((new Date()-new Date(doe))/(1000*60*60*24*365.25)) : null;
const yearsToRetire = (dob, doe) => {
  const byAge = dob ? Math.max(0,65-getAge(dob)) : null;
  const byService = doe ? Math.max(0,40-getYOS(doe)) : null;
  if(byAge===null&&byService===null) return null;
  if(byAge===null) return byService;
  if(byService===null) return byAge;
  return Math.min(byAge,byService);
};

// Display role label
const roleDisplay = r => {
  const map = {
    chairman:"Chairman", vice_chairman:"Vice Chairman", secretary:"Secretary",
    ads:"Admin & Personnel", conf_secretary:"Admin & Personnel",
    accountant:"Accountant", auditor:"Auditor", cashier:"Cashier",
    personnel:"Personnel Officer", ems_coordinator:"EMS Coordinator",
    lecturer:"Lecturer", support:"Support Staff",
    pastor:"Pastor", lo:"Local Overseer",
  };
  return map[r] || r;
};

// Who can act as dept head
const deptHeadRole = dept => DEPARTMENTS.find(d=>d.id===dept)?.head_role;

// Generate LO email from LCC name
const loEmail = lcc => "LO"+lcc.replace(/[\s']/g,"")+"LCC@ecwalafia.org";

// Get LO record for an LCC (pastor with active loAppointment for that LCC)
const getLOForLCC = (users, lcc) => users.find(u=>u.loAppointment?.active&&u.loAppointment?.lcc_overseen===lcc);

// Can approve leave at which stage
const canActLeave = (user, leave, users=[]) => {
  if(leave.status==="pending_dept"){
    if(leave.requester_role==="pastor"||leave.category==="pastor"){
      const lo = getLOForLCC(users, leave.lcc);
      if(lo && user.id===lo.id) return "dept";
      if(user.role==="lo" && user.lcc_overseen===leave.lcc) return "dept";
      return null;
    }
    const dh = deptHeadRole(leave.dept);
    if(user.role==="ads" && leave.requester_role==="secretary") return "dept";
    if(user.role==="vice_chairman" && leave.requester_role==="chairman") return "dept";
    if(user.role===dh) return "dept";
    return null;
  }
  if(leave.status==="pending_admin"){
    if(["ads","conf_secretary","secretary"].includes(user.role)) return "admin";
    return null;
  }
  if(leave.status==="pending_finance"){
    if(user.role==="accountant") return "finance";
    return null;
  }
  if(leave.status==="pending_auditor"){
    if(user.role==="auditor") return "auditor";
    return null;
  }
  if(leave.status==="pending_chairman"){
    if(["chairman","vice_chairman"].includes(user.role)) return "chairman";
    return null;
  }
  return null;
};

// ── Demo Data ──────────────────────────────────────────────────────────────────
const USERS0 = [
  { id:1,  name:"Bro. Emmanuel Yusuf",    email:"staff@ecwalafia.org",     password:"staff123",     role:"cashier",        category:"office", jobTitle:"Cashier",                dept:"finance",  approved:true,  gradeLevel:"C3",  gradePending:false, phone:"08012345678", dob:"1985-06-15", doj:"2022-01-15", docs:{}, customDocSections:[] },
  { id:2,  name:"Pastor James Danladi",   email:"secretary@ecwalafia.org", password:"secretary123", role:"secretary",      category:"office", jobTitle:"Secretary",              dept:"admin",    approved:true,  gradeLevel:"J5",  gradePending:false, phone:"08023456789", dob:"1972-03-01", doj:"2018-03-01", docs:{}, customDocSections:[] },
  { id:3,  name:"Mrs. Ruth Okonkwo",      email:"finance@ecwalafia.org",   password:"finance123",   role:"accountant",     category:"office", jobTitle:"Accountant",             dept:"finance",  approved:true,  gradeLevel:"H4",  gradePending:false, phone:"08034567890", dob:"1978-09-10", doj:"2019-06-10", docs:{}, customDocSections:[] },
  { id:4,  name:"Mr. Philip Musa",        email:"auditor@ecwalafia.org",   password:"auditor123",   role:"auditor",        category:"office", jobTitle:"Auditor",                dept:"finance",  approved:true,  gradeLevel:"G2",  gradePending:false, phone:"08045678901", dob:"1980-04-20", doj:"2020-09-20", docs:{}, customDocSections:[] },
  { id:5,  name:"Rev. Samuel Agbo",       email:"chairman@ecwalafia.org",  password:"chairman123",  role:"chairman",       category:"office", jobTitle:"Chairman",               dept:"admin",    approved:true,  gradeLevel:"O12", gradePending:false, phone:"08056789012", dob:"1965-01-01", doj:"2015-01-01", docs:{}, customDocSections:[] },
  { id:6,  name:"Sis. Grace Adamu",       email:"conf@ecwalafia.org",      password:"conf123",      role:"conf_secretary", category:"office", jobTitle:"Confidential Secretary", dept:"admin",    approved:true,  gradeLevel:"E2",  gradePending:false, phone:"08067890123", dob:"1990-04-05", doj:"2021-04-05", docs:{}, customDocSections:[] },
  { id:7,  name:"Rev. Daniel Maikudi",    email:"rev@ecwalafia.org",       password:"rev123",       role:"pastor",         category:"pastor", rank:"Reverend",                   lc_ph:"ECWA Bishara 1, Lafia", lcc:"Lafia", approved:true, phone:"08078901234", dob:"1975-05-12", doj:"2017-05-12", docs:{}, customDocSections:[], loAppointment:{ lcc_overseen:"Lafia", email:"LOLafiaLCC@ecwalafia.org", password:"lo2026", active:true } },
  { id:9,  name:"Deacon Samuel Bako",     email:"ads@ecwalafia.org",       password:"ads123",       role:"ads",            category:"office", jobTitle:"ADS (Asst. DCC Secretary)", dept:"admin", approved:true, gradeLevel:"I3", gradePending:false, phone:"08090123456", dob:"1976-11-20", doj:"2019-01-10", docs:{}, customDocSections:[] },
  { id:10, name:"Sis. Patience Danladi",  email:"personnel@ecwalafia.org", password:"personnel123", role:"personnel",      category:"office", jobTitle:"Personnel Officer",      dept:"admin",    approved:true,  gradeLevel:"F3",  gradePending:false, phone:"08001234567", dob:"1988-07-14", doj:"2020-03-01", docs:{}, customDocSections:[] },
];

const REQS0 = [
  { id:"REQ-001", requester:"Bro. Emmanuel Yusuf", requesterEmail:"staff@ecwalafia.org", date:"2026-03-01", purpose:"Youth Outreach — transport, materials & catering", amount:185000, status:"pending_secretary", signatures:{}, comments:{} },
  { id:"REQ-002", requester:"Bro. Emmanuel Yusuf", requesterEmail:"staff@ecwalafia.org", date:"2026-03-03", purpose:"Office supplies and printer cartridges", amount:42500, status:"pending_finance", signatures:{secretary:true}, comments:{secretary:"Reviewed. Request is in order."} },
];

const LEAVES0 = [
  { id:"LV-001", requester:"Rev. Daniel Maikudi", requesterEmail:"rev@ecwalafia.org", requester_role:"pastor", lcc:"Lafia", lc_ph:"ECWA Bishara 1, Lafia", rank:"Reverend", dept:null, type:"Annual Leave", startDate:"2026-03-15", endDate:"2026-03-22", days:7, reason:"Family visit and rest", status:"pending_dept", gradeLevel:"", allowance:null, approvals:[], date:"2026-03-05", refNo:"LV-2026-001" },
];

const SUNDAY_REPORTS0 = [
  { id:"SR-001", pastorId:7, pastorName:"Rev. Daniel Maikudi", lcc:"Lafia", lc_ph:"ECWA Bishara 1, Lafia", date:"2026-03-02", attendance:{men:45,women:62,children:38}, collections:{offering:25000,tithes:18000,thanksgiving:12000,freewill:5000}, optionalItems:[{id:"ems1",label:"EMS 1st Collection",amount:8000,excluded:true}], others:[], fullRemittance:false, totalGross:68000, remittanceBase:60000, remittanceDue:15000, submitted:true, appeal:null },
];

// Attendance records: {id, userId, userEmail, userName, dept, date, clockIn, clockOut, dailyReport, reportReadBy, adminClosed, adminNote}
const ATTENDANCE0 = [
  { id:"ATT-001", userId:1, userEmail:"staff@ecwalafia.org", userName:"Bro. Emmanuel Yusuf", dept:"finance", date:"2026-03-02", clockIn:"07:58", clockOut:"16:05", dailyReport:{achievements:"Processed payments for outreach programme, reconciled petty cash.", challenges:"Printer was down for 2 hours.", tomorrowPlan:"Submit monthly cash report."}, reportReadBy:[], adminClosed:false, adminNote:"" },
  { id:"ATT-002", userId:1, userEmail:"staff@ecwalafia.org", userName:"Bro. Emmanuel Yusuf", dept:"finance", date:"2026-03-03", clockIn:"08:32", clockOut:"16:00", dailyReport:{achievements:"Filed receipts and updated ledger.", challenges:"None.", tomorrowPlan:"Prepare payroll summary."}, reportReadBy:[], adminClosed:false, adminNote:"" },
];

// Announcements: {id, title, body, audience, postedBy, postedByRole, date, readBy}
const ANNOUNCEMENTS0 = [
  { id:"ANN-001", title:"DCC General Meeting — March 2026", body:"All office staff, pastors and LOs are reminded of the DCC General Meeting scheduled for Saturday 28th March 2026 at 10:00am at the DCC Secretariat. Attendance is compulsory.", audience:"all", postedBy:"Pastor James Danladi", postedByRole:"Secretary", date:"2026-03-04", readBy:[] },
  { id:"ANN-002", title:"Leave Application Reminder", body:"All staff intending to go on leave in Q2 2026 (April–June) should submit their leave applications not later than 31st March 2026. Late applications may not be processed in time.", audience:"office", postedBy:"Sis. Grace Adamu", postedByRole:"Admin & Personnel", date:"2026-03-05", readBy:[] },
];

// Password reset requests: {id, email, name, requestDate, status, newPassword, resolvedBy, resolvedDate}
const PWD_REQS0 = [];

// ── Shared UI ──────────────────────────────────────────────────────────────────
function MH({ title, sub, onClose }) {
  return (
    <div style={{background:"#0b1f3a",padding:"18px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div>
        {sub&&<div style={{color:"#c9a84c",fontSize:11,letterSpacing:1,textTransform:"uppercase",marginBottom:3}}>{sub}</div>}
        <span style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:19}}>{title}</span>
      </div>
      <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:26,cursor:"pointer",lineHeight:1}}>×</button>
    </div>
  );
}

function Toasty({ msg, type }) {
  return <div style={{position:"fixed",top:16,right:16,zIndex:3000,background:type==="danger"?"#c0392b":"#0b1f3a",color:"#fff",padding:"12px 18px",borderRadius:10,fontSize:13,boxShadow:"0 8px 30px rgba(0,0,0,0.25)",borderLeft:"4px solid #c9a84c",maxWidth:340}}>{msg}</div>;
}

// ── Lightbox ───────────────────────────────────────────────────────────────────
function Lightbox({ src, name, onClose }) {
  useEffect(()=>{const h=e=>{if(e.key==="Escape")onClose();};window.addEventListener("keydown",h);return()=>window.removeEventListener("keydown",h);},[onClose]);
  const isPdf = name?.toLowerCase().endsWith(".pdf")||src?.includes("application/pdf");
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:2000,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:16}} onClick={onClose}>
      <div style={{position:"absolute",top:16,right:20,display:"flex",gap:10}}>
        <a href={src} download={name} onClick={e=>e.stopPropagation()} style={{background:"rgba(255,255,255,0.1)",color:"#fff",padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:600,textDecoration:"none",border:"1px solid rgba(255,255,255,0.2)"}}>⬇ Download</a>
        <button onClick={onClose} style={{background:"rgba(255,255,255,0.1)",border:"1px solid rgba(255,255,255,0.2)",color:"#fff",borderRadius:8,padding:"8px 16px",fontSize:18,cursor:"pointer",lineHeight:1}}>×</button>
      </div>
      <div style={{maxWidth:"90vw",maxHeight:"85vh",display:"flex",alignItems:"center",justifyContent:"center"}} onClick={e=>e.stopPropagation()}>
        {isPdf
          ? <iframe src={src} style={{width:"80vw",height:"80vh",border:"none",borderRadius:8}} title={name}/>
          : <img src={src} alt={name} style={{maxWidth:"88vw",maxHeight:"82vh",borderRadius:10,boxShadow:"0 8px 40px rgba(0,0,0,0.5)",objectFit:"contain"}}/>
        }
      </div>
      {name&&<div style={{color:"rgba(255,255,255,0.5)",fontSize:12,marginTop:12}}>{name}</div>}
    </div>
  );
}

// ── Notification Panel ─────────────────────────────────────────────────────────
function NotifPanel({ notifs, onRead, onClose }) {
  const unread = notifs.filter(n=>!n.read).length;
  return(
    <div className="notif-panel">
      <div style={{padding:"14px 18px",borderBottom:"1px solid #f0ede8",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:"#0b1f3a"}}>Notifications {unread>0&&<span style={{background:"#c0392b",color:"#fff",borderRadius:10,padding:"1px 7px",fontSize:11,marginLeft:6}}>{unread}</span>}</div>
        <button onClick={onClose} style={{background:"none",border:"none",fontSize:20,cursor:"pointer",color:"#888"}}>×</button>
      </div>
      <div style={{maxHeight:380,overflowY:"auto"}}>
        {notifs.length===0&&<div style={{padding:32,textAlign:"center",color:"#bbb",fontSize:13}}>No notifications yet</div>}
        {notifs.map(n=>(
          <div key={n.id} onClick={()=>onRead(n.id)} style={{padding:"12px 18px",borderBottom:"1px solid #f5f3ef",cursor:"pointer",background:n.read?"#fff":"#fef9ee",transition:"background 0.2s"}}
            onMouseEnter={e=>e.currentTarget.style.background="#f8f6f0"} onMouseLeave={e=>e.currentTarget.style.background=n.read?"#fff":"#fef9ee"}>
            <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
              <span style={{fontSize:18,flexShrink:0}}>{n.icon||"🔔"}</span>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:13,fontWeight:n.read?400:700,color:"#0b1f3a",lineHeight:1.4}}>{n.title}</div>
                <div style={{fontSize:11,color:"#888",marginTop:2}}>{n.body}</div>
                <div style={{fontSize:10,color:"#bbb",marginTop:4}}>{fdate(n.date)}</div>
              </div>
              {!n.read&&<div style={{width:8,height:8,background:"#c9a84c",borderRadius:"50%",flexShrink:0,marginTop:4}}/>}
            </div>
          </div>
        ))}
      </div>
      {unread>0&&<div style={{padding:"10px 18px",borderTop:"1px solid #f0ede8",textAlign:"center"}}><button className="link-btn" onClick={()=>notifs.forEach(n=>onRead(n.id))}>Mark all as read</button></div>}
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return <div className="card" style={{padding:"14px 12px",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{fontSize:24,marginBottom:4}}>{icon}</div><div style={{fontSize:22,fontWeight:700,color:color||"#0b1f3a",fontFamily:"Georgia,serif"}}>{value}</div><div style={{fontSize:11,color:"#aaa",marginTop:2,lineHeight:1.4,textAlign:"center"}}>{label}</div></div>;
}

function RetirementBadge({ dob, doj }) {
  const ytr = yearsToRetire(dob, doj);
  if(ytr===null) return null;
  if(ytr<=0) return <span style={{background:"#fdecea",color:"#c0392b",padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700}}>🔴 Retirement Due</span>;
  if(ytr<=5) return <span style={{background:"#fef3e2",color:"#e67e22",padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700}}>⚠️ {ytr}yr to Retirement</span>;
  return <span style={{background:"#eafbf0",color:"#27ae60",padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700}}>✓ {ytr}yr to Retirement</span>;
}

// ── Signature Pad ──────────────────────────────────────────────────────────────
function SigPad({ onSave, onClose }) {
  const ref=useRef(null); const dr=useRef(false); const [has,setHas]=useState(false);
  const gp=(e,c)=>{const r=c.getBoundingClientRect(),s=e.touches?e.touches[0]:e;return[s.clientX-r.left,s.clientY-r.top];};
  const md=e=>{dr.current=true;const ctx=ref.current.getContext("2d"),[x,y]=gp(e,ref.current);ctx.beginPath();ctx.moveTo(x,y);};
  const mm=e=>{if(!dr.current)return;e.preventDefault();const ctx=ref.current.getContext("2d"),[x,y]=gp(e,ref.current);ctx.strokeStyle="#0b1f3a";ctx.lineWidth=2.5;ctx.lineCap="round";ctx.lineTo(x,y);ctx.stroke();setHas(true);};
  const mu=()=>{dr.current=false;};
  const cl=()=>{ref.current.getContext("2d").clearRect(0,0,500,160);setHas(false);};
  return(
    <div className="overlay" style={{zIndex:1100}}>
      <div className="modal" style={{maxWidth:480}}>
        <div style={{padding:"24px 24px 0"}}>
          <h3 style={{fontFamily:"Georgia,serif",fontSize:20,marginBottom:6}}>Draw Your Signature</h3>
          <p style={{fontSize:12,color:"#888",marginBottom:14}}>Use your mouse or finger to sign below.</p>
          <canvas ref={ref} width={432} height={160} style={{border:"2px dashed #c9a84c",borderRadius:10,width:"100%",height:160,cursor:"crosshair",background:"#fafaf8",display:"block"}} onMouseDown={md} onMouseMove={mm} onMouseUp={mu} onMouseLeave={mu} onTouchStart={md} onTouchMove={mm} onTouchEnd={mu}/>
        </div>
        <div style={{padding:"16px 24px 24px",display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button className="btn btn-outline" onClick={cl}>Clear</button>
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-gold" disabled={!has} onClick={()=>onSave(ref.current.toDataURL())}>Apply Signature</button>
        </div>
      </div>
    </div>
  );
}

// ── Signature Updater (inline button for staff profile) ───────────────────────
function SigUpdater({ staffId, onUpdate }) {
  const [show,setShow]=useState(false);
  const uploadRef=useRef(null);
  return(
    <>
      <div style={{display:"flex",gap:8,marginTop:4}}>
        <button className="btn btn-outline btn-sm" onClick={()=>setShow(true)}>✏️ Draw</button>
        <button className="btn btn-outline btn-sm" onClick={()=>uploadRef.current.click()}>📷 Upload</button>
      </div>
      <input ref={uploadRef} type="file" style={{display:"none"}} accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=ev=>onUpdate(staffId,{signatureImage:ev.target.result});rd.readAsDataURL(f);e.target.value="";}}/>
      {show&&<SigPad onSave={d=>{onUpdate(staffId,{signatureImage:d});setShow(false);}} onClose={()=>setShow(false)}/>}
    </>
  );
}

// ── Finance: Request Detail ───────────────────────────────────────────────────
function ReqDetail({ req, user, users, onClose, onAction }) {
  const savedSig = users?.find(u=>u.id===user.id)?.signatureImage||null;
  const [showSig,setShowSig]=useState(false); const [sig,setSig]=useState(savedSig); const [note,setNote]=useState("");
  const [showPrint,setShowPrint]=useState(false);
  const isApprover = ["secretary","ads","conf_secretary"].includes(user.role) ? req.status==="pending_secretary"
    : user.role==="accountant" ? req.status==="pending_finance"
    : user.role==="auditor" ? req.status==="pending_auditor"
    : ["chairman","vice_chairman"].includes(user.role) ? req.status==="pending_chairman" : false;
  const sc=FIN_STATUS[req.status];
  if(showPrint) return <FinancePrintForm req={req} onClose={()=>setShowPrint(false)}/>;
  return(
    <>
      <div className="overlay">
        <div className="modal">
          <MH title={req.id} sub="Financial Request" onClose={onClose}/>
          <div style={{padding:"22px 24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontFamily:"Georgia,serif",fontSize:26,fontWeight:700,color:"#0b1f3a"}}>{money(req.amount)}</div>
                {req.amountWords&&<div style={{fontSize:11,color:"#888",fontStyle:"italic",marginTop:2}}>{req.amountWords}</div>}
                <div style={{fontSize:12,color:"#888",marginTop:2}}>By {req.requester}{req.requesterRole?` (${req.requesterRole})`:""} · {fdate(req.date)}</div>
              </div>
              <span className="badge" style={{color:sc.color,background:sc.bg}}>{sc.label}</span>
            </div>
            <div style={{background:"#f8f6f0",borderLeft:"4px solid #c9a84c",borderRadius:8,padding:14,marginBottom:18}}>
              <div style={{fontSize:11,color:"#aaa",textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>Purpose</div>
              <p style={{fontSize:13,lineHeight:1.7}}>{req.purpose}</p>
            </div>
            {req.attachment&&(
              <div style={{display:"flex",alignItems:"center",gap:10,background:"#f0f9ff",border:"1px solid #aed6f1",borderRadius:8,padding:"10px 14px",marginBottom:18,flexWrap:"wrap"}}>
                <span style={{fontSize:22,flexShrink:0}}>📎</span>
                <div style={{flex:1,minWidth:120}}>
                  <div style={{fontSize:12,fontWeight:600,color:"#0b1f3a"}}>
                    {req.attachment.name&&req.attachment.name.length>35&&/^[0-9]/.test(req.attachment.name)?"Supporting Document":req.attachment.name}
                  </div>
                  <div style={{fontSize:10,color:"#888"}}>{req.attachment.size}</div>
                </div>
                <a href={req.attachment.data} download={req.attachment.name} className="btn btn-outline btn-sm" style={{flexShrink:0}}>⬇ Download</a>
              </div>
            )}
            {/* Approval Progress */}
            <div style={{marginBottom:18}}>
              <div style={{fontSize:11,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:12}}>Approval Progress</div>
              <div style={{display:"flex",alignItems:"center"}}>
                {F_STEPS.map((step,i)=>{
                  const done=!!req.signatures[step.role],active=!done&&req.status===FPFOR[step.role];
                  return(<div key={step.role} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{display:"flex",width:"100%",alignItems:"center"}}>
                      {i>0&&<div style={{flex:1,height:2,background:done?"#c9a84c":"#e0ddd6"}}/>}
                      <div style={{width:30,height:30,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0,background:done?"#c9a84c":active?"#0b1f3a":"#e8e4dc",color:done?"#fff":active?"#c9a84c":"#aaa"}}>{done?"✓":i+1}</div>
                      {i<F_STEPS.length-1&&<div style={{flex:1,height:2,background:done?"#c9a84c":"#e0ddd6"}}/>}
                    </div>
                    <div style={{fontSize:9,marginTop:5,textAlign:"center",color:done?"#c9a84c":active?"#0b1f3a":"#bbb",fontWeight:done||active?700:400}}>{step.label}</div>
                  </div>);
                })}
              </div>
            </div>
            {Object.keys(req.comments).filter(k=>req.comments[k]).length>0&&(
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Comments</div>
                {F_STEPS.filter(s=>req.comments[s.role]).map(s=>(
                  <div key={s.role} style={{background:"#f8f6f0",borderRadius:8,padding:"8px 12px",marginBottom:6}}>
                    <div style={{fontSize:10,fontWeight:700,color:"#c9a84c",marginBottom:2}}>{s.label}</div>
                    <div style={{fontSize:12,color:"#555"}}>{req.comments[s.role]}</div>
                  </div>
                ))}
              </div>
            )}
            {isApprover?(
              <div style={{borderTop:"1.5px solid #f0ede8",paddingTop:18}}>
                <div style={{fontSize:11,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:12}}>Your Action</div>
                <div style={{marginBottom:12}}><label>Comment (optional)</label><textarea rows={2} value={note} onChange={e=>setNote(e.target.value)} style={{resize:"vertical"}} placeholder="Add your remarks..."/></div>
                <div style={{marginBottom:16}}>
                  <label>E-Signature *</label>
                  {sig
                    ?<div style={{display:"flex",alignItems:"center",gap:10,background:"#f8f6f0",borderRadius:8,padding:"8px 12px"}}>
                      <img src={sig} alt="sig" style={{height:48,border:"1px solid #e2ddd6",borderRadius:8,background:"#fff"}}/>
                      <div>
                        <div style={{fontSize:11,color:"#27ae60",fontWeight:600}}>{savedSig===sig?"✅ Your saved signature":"✅ Signature ready"}</div>
                        <button className="btn btn-outline" style={{padding:"3px 10px",fontSize:11,marginTop:4}} onClick={()=>setShowSig(true)}>Re-sign</button>
                      </div>
                    </div>
                    :<button className="btn btn-outline" style={{width:"100%"}} onClick={()=>setShowSig(true)}>✏️ Draw Your Signature</button>}
                </div>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                  <button className="btn btn-red" disabled={!sig} onClick={()=>{onAction(req.id,"reject",sig,note);onClose();}}>Reject</button>
                  <button className="btn btn-gold" disabled={!sig} onClick={()=>{onAction(req.id,"approve",sig,note);onClose();}}>
                    {["chairman","vice_chairman"].includes(user.role)?"✓ Grant Final Approval":"Forward to Next →"}
                  </button>
                </div>
              </div>
            ):(
              <div style={{background:"#f8f6f0",borderRadius:8,padding:"12px 14px",textAlign:"center",color:"#aaa",fontSize:13}}>
                {req.status==="approved"?<div style={{display:"flex",gap:10,justifyContent:"center",alignItems:"center",flexWrap:"wrap"}}>✅ Fully approved. <button className="btn btn-gold btn-sm" onClick={()=>setShowPrint(true)}>🖨️ Print Approved Form</button></div>:req.status==="rejected"?"❌ Rejected.":"⏳ Being processed."}
              </div>
            )}
          </div>
        </div>
      </div>
      {showSig&&<SigPad onSave={d=>{setSig(d);setShowSig(false);}} onClose={()=>setShowSig(false)}/>}
    </>
  );
}

// ── Finance Print Form ────────────────────────────────────────────────────────
function FinancePrintForm({ req, onClose }) {
  return(
    <div className="overlay" style={{padding:0,alignItems:"flex-start",overflowY:"auto"}}>
      <div style={{background:"#fff",width:"100%",maxWidth:720,margin:"20px auto",borderRadius:16,boxShadow:"0 24px 60px rgba(11,31,58,0.3)",overflow:"hidden"}}>
        <div style={{background:"#0b1f3a",padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}} className="no-print">
          <span style={{fontFamily:"Georgia,serif",color:"#c9a84c",fontSize:16}}>Approved Finance Request</span>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-gold btn-sm" onClick={()=>printElement("finance-print-doc")}>🖨️ Print / PDF</button>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:24,cursor:"pointer"}}>×</button>
          </div>
        </div>
        <div id="finance-print-doc" style={{padding:"32px 40px",fontFamily:"'Segoe UI',sans-serif"}}>
          {/* Letterhead */}
          <div style={{textAlign:"center",borderBottom:"3px double #0b1f3a",paddingBottom:18,marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16,marginBottom:8}}>
              <img src={LOGO_SVG} alt="ECWA" style={{width:66,height:66,borderRadius:"50%",objectFit:"cover",border:"2px solid #c9a84c"}}/>
              <div style={{textAlign:"left"}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:9,color:"#555",letterSpacing:1}}>EVANGELICAL CHURCH WINNING ALL</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:17,fontWeight:700,color:"#0b1f3a",lineHeight:1.2}}>ECWA Lafia District Church Council (LDCC)</div>
                <div style={{fontSize:11,color:"#666",marginTop:3}}>Beside New Tomatoes Market, P.O. Box 329, Shinge Road Lafia, Nasarawa State</div>
                <div style={{fontSize:11,color:"#555",marginTop:2}}>E-MAIL: lafiadcc@ecwang.org &nbsp;|&nbsp; Tel: 08166646683, 09053971264</div>
              </div>
            </div>
            <div style={{display:"inline-block",background:"#c9a84c",color:"#fff",padding:"3px 20px",borderRadius:20,fontSize:11,fontWeight:700,marginTop:6,letterSpacing:1}}>APPROVED FINANCIAL REQUEST FORM</div>
          </div>
          {/* Ref & Date */}
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:18,fontSize:13}}>
            <div><strong>Ref:</strong> {req.id}</div>
            <div><strong>Date:</strong> {fdate(req.date)}</div>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,marginBottom:20}}>
            {[
              ["Requester Name", req.requester],
              ["Position / Role", req.requesterRole||"—"],
              ["Email", req.requesterEmail],
              ["Date of Request", fdate(req.date)],
              ["Purpose", req.purpose],
              ["Amount (Figures)", money(req.amount)],
              ["Amount (Words)", req.amountWords||nairaToWords(req.amount)],
              ["Request ID", req.id],
              ["Final Status", "✅ APPROVED"],
            ].map(([k,v],i)=>(
              <tr key={k} style={{background:i%2===0?"#f8f6f0":"#fff"}}>
                <td style={{padding:"8px 12px",fontWeight:600,color:"#555",width:"36%",borderBottom:"1px solid #e8e4dc"}}>{k}</td>
                <td style={{padding:"8px 12px",color:"#0b1f3a",fontWeight:500,borderBottom:"1px solid #e8e4dc"}}>{v}</td>
              </tr>
            ))}
          </table>
          {/* Approval signatures */}
          {Object.keys(req.signatures).length>0&&(
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:12,borderTop:"1px solid #e8e4dc",paddingTop:12}}>Approval Signatures</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:16}}>
                {F_STEPS.filter(s=>req.signatures[s.role]).map(s=>(
                  <div key={s.role} style={{textAlign:"center",border:"1px solid #e8e4dc",borderRadius:8,padding:"12px 10px"}}>
                    {typeof req.signatures[s.role]==="string"&&req.signatures[s.role].length>20?
                      <img src={req.signatures[s.role]} alt="" style={{height:46,marginBottom:6,maxWidth:"100%"}}/>:
                      <div style={{height:46,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>✅</div>
                    }
                    <div style={{fontSize:11,fontWeight:700,color:"#0b1f3a"}}>{s.label}</div>
                    {req.comments[s.role]&&<div style={{fontSize:10,color:"#888",marginTop:3,fontStyle:"italic"}}>"{req.comments[s.role]}"</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{fontSize:10,color:"#aaa",textAlign:"center",marginTop:16,borderTop:"1px solid #e8e4dc",paddingTop:12}}>
            <div>All Correspondence should be addressed to the DCC Secretary</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Finance Module ─────────────────────────────────────────────────────────────
function FinanceMod({ user, users, requests, setRequests, toast }) {
  const [sel,setSel]=useState(null); const [form,setForm]=useState(false);
  const [tab,setTab]=useState("all"); const [purp,setPurp]=useState(""); const [amt,setAmt]=useState("");
  const [reqDate,setReqDate]=useState(today()); const [reqAttach,setReqAttach]=useState(null);
  const attachRef=useRef(null);

  const isApprover = ["secretary","ads","conf_secretary","accountant","auditor","chairman","vice_chairman"].includes(user.role);

  const pendingCount = isApprover ? requests.filter(r=>{
    if(["secretary","ads","conf_secretary"].includes(user.role)) return r.status==="pending_secretary";
    if(user.role==="accountant") return r.status==="pending_finance";
    if(user.role==="auditor") return r.status==="pending_auditor";
    if(["chairman","vice_chairman"].includes(user.role)) return r.status==="pending_chairman";
    return false;
  }).length : 0;

  const vis = requests.filter(r=>{
    // Non-approvers (pastors, cashier, support, etc.) only see their own requests
    if(!isApprover) return r.requesterEmail===user.email;
    if(tab==="pending") return (
      (["secretary","ads","conf_secretary"].includes(user.role)&&r.status==="pending_secretary")||
      (user.role==="accountant"&&r.status==="pending_finance")||
      (user.role==="auditor"&&r.status==="pending_auditor")||
      (["chairman","vice_chairman"].includes(user.role)&&r.status==="pending_chairman")
    );
    if(tab==="mine") return r.requesterEmail===user.email;
    return true;
  });

  const sum={}; Object.keys(FIN_STATUS).forEach(k=>sum[k]=requests.filter(r=>r.status===k).length);

  const add=()=>{
    if(!purp||!amt||!reqDate)return;
    const id="REQ-"+String(requests.length+1).padStart(3,"0");
    let attachData=null;
    if(reqAttach){
      const rd=new FileReader();
      rd.onload=ev=>{
        setRequests(r=>[...r,{id,requester:user.name,requesterRole:roleDisplay(user.role),requesterEmail:user.email,date:reqDate,purpose:purp,amount:parseFloat(amt),amountWords:nairaToWords(parseFloat(amt)),status:"pending_secretary",signatures:{},comments:{},attachment:{name:reqAttach.name,data:ev.target.result,size:(reqAttach.size/1024).toFixed(1)+" KB"}}]);
        toast("✅ Request submitted!");setForm(false);setPurp("");setAmt("");setReqDate(today());setReqAttach(null);
      };
      rd.readAsDataURL(reqAttach);
      return;
    }
    setRequests(r=>[...r,{id,requester:user.name,requesterRole:roleDisplay(user.role),requesterEmail:user.email,date:reqDate,purpose:purp,amount:parseFloat(amt),amountWords:nairaToWords(parseFloat(amt)),status:"pending_secretary",signatures:{},comments:{},attachment:null}]);
    toast("✅ Request submitted!");setForm(false);setPurp("");setAmt("");setReqDate(today());setReqAttach(null);
  };

  const act=(id,action,sig,note)=>{
    setRequests(rs=>rs.map(r=>{
      if(r.id!==id)return r;
      const actKey=["secretary","ads","conf_secretary"].includes(user.role)?"secretary":user.role==="accountant"?"finance":user.role;
      const s2={...r.signatures,[actKey]:sig},c2={...r.comments,[actKey]:note||""};
      if(action==="reject"){
        toast("Request rejected.","danger");
        sendGenericEmail({
          to_name: r.requester,
          to_email: r.requesterEmail,
          email_subject: "Your Fund Request Has Been Rejected — ECWA Lafia DCC",
          email_body: `Your fund request of ₦${Number(r.amount).toLocaleString()} for "${r.purpose}" has been rejected by ${user.name} (${roleDisplay(user.role)}).\n\n${note?`Note: ${note}\n\n`:""}Please contact Admin & Personnel for further guidance.`,
        });
        return{...r,status:"rejected",signatures:s2,comments:c2};
      }
      // Only chairman/vice_chairman can fully approve — everyone else goes to next stage
      if(["chairman","vice_chairman"].includes(user.role)){
        toast("🎉 Fully approved!");
        sendGenericEmail({
          to_name: r.requester,
          to_email: r.requesterEmail,
          email_subject: "Your Fund Request Has Been Approved — ECWA Lafia DCC",
          email_body: `Great news! Your fund request has been fully approved.\n\nAmount: ₦${Number(r.amount).toLocaleString()}\nPurpose: ${r.purpose}\nDate: ${fdate(r.date)}\n\nPlease contact the Finance department for disbursement.\n\nSign in at: https://ecwa-portal.onrender.com`,
        });
        return{...r,status:"approved",signatures:s2,comments:c2};
      }
      const nextStatus = FNEXT[actKey];
      if(!nextStatus){toast("Approval error — contact admin.","danger");return r;}
      toast("✅ Forwarded to next stage.");
      return{...r,status:nextStatus,signatures:s2,comments:c2};
    }));
  };

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(120px,1fr))",gap:12,marginBottom:22}}>
        <StatCard icon="📄" label="Total" value={requests.length} color="#0b1f3a"/>
        <StatCard icon="📋" label="Pend. Secretary" value={sum.pending_secretary||0} color="#e67e22"/>
        <StatCard icon="💰" label="Pend. Finance" value={sum.pending_finance||0} color="#2980b9"/>
        <StatCard icon="🔍" label="Pend. Audit" value={sum.pending_auditor||0} color="#8e44ad"/>
        <StatCard icon="⭐" label="Pend. Chairman" value={sum.pending_chairman||0} color="#c0392b"/>
        <StatCard icon="✅" label="Approved" value={sum.approved||0} color="#27ae60"/>
      </div>
      <div className="card">
        <div style={{padding:"18px 20px",borderBottom:"1.5px solid #f0ede8",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div><h2 style={{fontFamily:"Georgia,serif",fontSize:18,color:"#0b1f3a"}}>Financial Requests</h2><p style={{fontSize:12,color:"#888",marginTop:1}}>Click any request to open it</p></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div className="tab-bar">
              {[{id:"all",label:"All"},{id:"mine",label:"My Requests"},...(isApprover?[{id:"pending",label:"Pending",badge:pendingCount}]:[])].map(t=>(
                <button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
                  {t.label}
                  {t.badge>0&&<span className="pulse" style={{marginLeft:5,background:"#c9a84c",color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10}}>{t.badge}</span>}
                </button>
              ))}
            </div>
            <button className="btn btn-gold" onClick={()=>setForm(true)}>+ New Request</button>
          </div>
        </div>
        {vis.length===0&&<div style={{padding:48,textAlign:"center",color:"#bbb"}}><div style={{fontSize:36,marginBottom:10}}>📭</div><div style={{fontSize:14,fontWeight:600,color:"#ccc"}}>No requests here</div></div>}
        {vis.map((req,i)=>{const sc=FIN_STATUS[req.status];return(
          <div key={req.id} className="trow slide-in" style={{padding:"16px 20px",borderBottom:"1px solid #f5f3ef",display:"flex",alignItems:"center",gap:14,cursor:"pointer",animationDelay:`${i*0.04}s`}} onClick={()=>setSel(req)}>
            <div style={{width:40,height:40,background:req.status.startsWith("pending")?"#0b1f3a":"#f0ede8",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{req.status==="approved"?"✅":req.status==="rejected"?"❌":"📄"}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",gap:6,marginBottom:2,alignItems:"center"}}><span style={{fontWeight:700,fontSize:14,color:"#0b1f3a"}}>{req.id}</span><span style={{fontSize:12,color:"#aaa"}}>·</span><span style={{fontSize:13,color:"#666"}}>{req.requester}</span></div>
              <div style={{fontSize:12,color:"#999",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{req.purpose}</div>
            </div>
            <div style={{textAlign:"right",flexShrink:0}}><div style={{fontFamily:"Georgia,serif",fontWeight:700,fontSize:16,color:"#0b1f3a"}}>{money(req.amount)}</div><span className="badge" style={{color:sc.color,background:sc.bg,marginTop:4}}>{sc.label}</span></div>
            <div style={{color:"#ddd",fontSize:18}}>›</div>
          </div>
        );})}
      </div>
      {form&&(
        <div className="overlay">
          <div className="modal" style={{maxWidth:560}}>
            <MH title="New Financial Request" sub="Finance Module" onClose={()=>setForm(false)}/>
            <div style={{padding:"22px 24px 24px",display:"flex",flexDirection:"column",gap:14}}>
              {/* Requester info auto-populated */}
              <div style={{background:"linear-gradient(135deg,#0b1f3a,#1a3a5c)",borderRadius:10,padding:"12px 16px",display:"flex",gap:12,alignItems:"center"}}>
                <div style={{width:38,height:38,background:"#c9a84c",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:700,fontSize:14,flexShrink:0}}>{user.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}</div>
                <div>
                  <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{user.name}</div>
                  <div style={{fontSize:11,color:"#c9a84c"}}>{roleDisplay(user.role)} · {user.email}</div>
                </div>
              </div>
              <div><label>Date of Request *</label><input type="date" value={reqDate} onChange={e=>setReqDate(e.target.value)}/></div>
              <div><label>Purpose / Description *</label><textarea rows={3} placeholder="Describe what the funds will be used for..." value={purp} onChange={e=>setPurp(e.target.value)} style={{resize:"vertical"}}/></div>
              <div>
                <label>Amount Requested (₦) *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="e.g. 75,000"
                  value={amt ? Number(amt.replace(/,/g,'')||0).toLocaleString('en-NG') : ""}
                  onChange={e=>{const raw=e.target.value.replace(/[^0-9]/g,''); setAmt(raw);}}
                />
                {amt&&parseFloat(amt)>0&&<div style={{marginTop:6,background:"#f8f6f0",borderRadius:6,padding:"6px 12px",fontSize:12,color:"#555",fontStyle:"italic"}}>In words: <strong>{nairaToWords(parseFloat(amt))}</strong></div>}
              </div>
              {/* Attachment */}
              <div>
                <label>Supporting Document (optional)</label>
                {reqAttach?
                  <div style={{display:"flex",alignItems:"center",gap:10,background:"#eafbf0",borderRadius:8,padding:"8px 12px",border:"1px solid #abebc6"}}>
                    <span style={{fontSize:20}}>📎</span>
                    <div style={{flex:1,minWidth:0}}><div style={{fontSize:12,fontWeight:600,color:"#0b1f3a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{reqAttach.name}</div><div style={{fontSize:10,color:"#888"}}>{(reqAttach.size/1024).toFixed(1)} KB</div></div>
                    <button className="btn btn-red btn-sm" onClick={()=>setReqAttach(null)}>Remove</button>
                  </div>:
                  <div className="upload-box" onClick={()=>attachRef.current.click()} style={{padding:"12px 16px"}}>
                    <span style={{fontSize:22}}>📤</span><span style={{fontSize:12,color:"#aaa",marginLeft:8}}>Click to attach a document (PDF, image, Word)</span>
                  </div>
                }
                <input ref={attachRef} type="file" style={{display:"none"}} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={e=>{const f=e.target.files[0];if(f)setReqAttach(f);e.target.value="";}}/>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><button className="btn btn-outline" onClick={()=>{setForm(false);setPurp("");setAmt("");setReqDate(today());setReqAttach(null);}}>Cancel</button><button className="btn btn-gold" disabled={!purp||!amt||!reqDate} onClick={add}>Submit Request →</button></div>
            </div>
          </div>
        </div>
      )}
      {sel&&<ReqDetail req={sel} user={user} users={users} onClose={()=>setSel(null)} onAction={act}/>}
    </div>
  );
}

// ── Leave: Detail & Letter ─────────────────────────────────────────────────────
function LeaveDetail({ leave, user, users, onClose, onAct }) {
  const [note,setNote]=useState(""); const [allowance,setAllowance]=useState(leave.allowance||"");
  const [showSig,setShowSig]=useState(false);
  const savedSig = users.find(u=>u.id===user.id)?.signatureImage||null;
  const [sig,setSig]=useState(savedSig);
  const [printMode,setPrintMode]=useState(false);
  const sc=LEAVE_STATUS[leave.status];
  const stage = canActLeave(user, leave, users);
  const staffRecord = users.find(u=>u.email===leave.requesterEmail);

  if(printMode) return <LeaveLetter leave={leave} users={users} onClose={()=>setPrintMode(false)}/>;

  return(
    <>
      <div className="overlay">
        <div className="modal" style={{maxWidth:600}}>
          <MH title={leave.id} sub="Leave Request" onClose={onClose}/>
          <div style={{padding:"22px 24px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#0b1f3a"}}>{leave.type}</div>
                <div style={{fontSize:12,color:"#888",marginTop:2}}>By {leave.requester} · {leave.rank||roleDisplay(leave.requester_role)}</div>
              </div>
              <span className="badge" style={{color:sc.color,background:sc.bg}}>{sc.label}</span>
            </div>

            {/* Bio summary */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 20px",marginBottom:18,background:"#f8f6f0",borderRadius:10,padding:"14px 18px"}}>
              {[
                ["📍 LCC/Dept", leave.lcc||(leave.dept?DEPARTMENTS.find(d=>d.id===leave.dept)?.label:"-")],
                ["⛪ LC / Position", leave.lc_ph||roleDisplay(leave.requester_role)],
                ["📅 From", fdate(leave.startDate)],
                ["📅 To", fdate(leave.endDate)],
                ["🗓️ Duration", leave.days+" day"+(leave.days>1?"s":"")],
                ["📊 Grade Level", staffRecord?.gradePending?"Pending":staffRecord?.gradeLevel||"—"],
                ["💰 Allowance", leave.allowance?money(leave.allowance):"Not yet calculated"],
                ["📆 Submitted", fdate(leave.date)],
              ].map(([k,v])=>(
                <div key={k}><div style={{fontSize:11,color:"#aaa",marginBottom:2}}>{k}</div><div style={{fontSize:13,fontWeight:600}}>{v}</div></div>
              ))}
            </div>

            <div style={{background:"#f8f6f0",borderLeft:"4px solid #c9a84c",borderRadius:8,padding:14,marginBottom:18}}>
              <div style={{fontSize:11,color:"#aaa",textTransform:"uppercase",letterSpacing:0.5,marginBottom:5}}>Reason</div>
              <p style={{fontSize:13,lineHeight:1.7}}>{leave.reason}</p>
            </div>

            {/* Grade level info box — always visible to approvers */}
            {staffRecord&&(
              <div style={{background:"#eaf4fb",border:"1px solid #aed6f1",borderRadius:8,padding:"10px 14px",marginBottom:18,display:"flex",gap:16,flexWrap:"wrap"}}>
                <div><div style={{fontSize:10,color:"#2980b9",textTransform:"uppercase",letterSpacing:0.5,fontWeight:700}}>Staff</div><div style={{fontSize:13,fontWeight:700,color:"#0b1f3a"}}>{staffRecord.name}</div></div>
                <div><div style={{fontSize:10,color:"#2980b9",textTransform:"uppercase",letterSpacing:0.5,fontWeight:700}}>Grade Level</div><div style={{fontSize:13,fontWeight:700,color:staffRecord.gradePending?"#e67e22":"#0b1f3a"}}>{staffRecord.gradePending?`${staffRecord.gradeLevel||"—"} (Pending)`:(staffRecord.gradeLevel||"Not assigned")}</div></div>
                <div><div style={{fontSize:10,color:"#2980b9",textTransform:"uppercase",letterSpacing:0.5,fontWeight:700}}>Years of Service</div><div style={{fontSize:13,fontWeight:700,color:"#0b1f3a"}}>{staffRecord.doj?getYOS(staffRecord.doj)+" yrs":"—"}</div></div>
                {leave.allowance&&<div><div style={{fontSize:10,color:"#2980b9",textTransform:"uppercase",letterSpacing:0.5,fontWeight:700}}>Leave Allowance</div><div style={{fontSize:13,fontWeight:700,color:"#27ae60"}}>{money(leave.allowance)}</div></div>}
              </div>
            )}
              <div style={{display:"flex",alignItems:"center"}}>
                {[
                  {label:"Submit",done:true},
                  {label:"Dept Head",done:["pending_admin","pending_finance","pending_auditor","pending_chairman","approved"].includes(leave.status)},
                  {label:"Admin",done:["pending_finance","pending_auditor","pending_chairman","approved"].includes(leave.status)},
                  {label:"Finance",done:["pending_auditor","pending_chairman","approved"].includes(leave.status)},
                  {label:"Auditor",done:["pending_chairman","approved"].includes(leave.status)},
                  {label:"Chairman",done:leave.status==="approved"},
                ].map((step,i,a)=>(
                  <div key={step.label} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}>
                    <div style={{display:"flex",width:"100%",alignItems:"center"}}>
                      {i>0&&<div style={{flex:1,height:2,background:step.done?"#c9a84c":"#e0ddd6"}}/>}
                      <div style={{width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,flexShrink:0,background:step.done?"#c9a84c":"#e8e4dc",color:step.done?"#fff":"#aaa"}}>{step.done?"✓":i+1}</div>
                      {i<a.length-1&&<div style={{flex:1,height:2,background:step.done?"#c9a84c":"#e0ddd6"}}/>}
                    </div>
                    <div style={{fontSize:7,marginTop:4,textAlign:"center",color:step.done?"#c9a84c":"#bbb",fontWeight:step.done?700:400}}>{step.label}</div>
                  </div>
                ))}
              </div>

            {/* Approvals trail */}
            {leave.approvals?.length>0&&(
              <div style={{marginBottom:18}}>
                <div style={{fontSize:11,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Approval Trail</div>
                {leave.approvals.map((a,i)=>(
                  <div key={i} style={{background:"#f8f6f0",borderRadius:8,padding:"8px 12px",marginBottom:6,display:"flex",gap:12,alignItems:"center"}}>
                    {a.sig&&<img src={a.sig} alt="" style={{height:36,border:"1px solid #e2ddd6",borderRadius:6}}/>}
                    <div><div style={{fontSize:12,fontWeight:700,color:"#0b1f3a"}}>{a.name}</div><div style={{fontSize:11,color:"#888"}}>{a.position} · {fdate(a.date)}</div>{a.note&&<div style={{fontSize:11,color:"#555",marginTop:2}}>"{a.note}"</div>}</div>
                  </div>
                ))}
              </div>
            )}

            {stage?(
              <div style={{borderTop:"1.5px solid #f0ede8",paddingTop:18}}>
                <div style={{fontSize:11,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:12}}>Your Decision</div>
                {stage==="finance"&&leave.type==="Annual Leave"&&(
                  <div style={{marginBottom:14,background:"#eaf4fb",borderRadius:8,padding:14}}>
                    <div style={{fontSize:12,fontWeight:700,color:"#2980b9",marginBottom:8}}>💰 Leave Grant Calculation (25% of Annual Basic Salary)</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:10,background:"#fff",borderRadius:8,padding:"10px 14px",border:"1px solid #aed6f1"}}>
                      <div><div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:0.5}}>Grade Level</div><div style={{fontSize:13,fontWeight:700,color:staffRecord?.gradePending?"#e67e22":"#0b1f3a"}}>{staffRecord?.gradePending?"Pending":staffRecord?.gradeLevel||"Not assigned"}</div></div>
                      <div><div style={{fontSize:10,color:"#888",textTransform:"uppercase",letterSpacing:0.5}}>Annual Basic Salary</div><div style={{fontSize:13,fontWeight:700,color:"#0b1f3a"}}>{staffRecord?.gradeLevel&&!staffRecord?.gradePending?money(getAnnualSalary(staffRecord.gradeLevel)||0):"—"}</div></div>
                      <div><div style={{fontSize:10,color:"#27ae60",textTransform:"uppercase",letterSpacing:0.5,fontWeight:700}}>Auto-Calculated Grant (25%)</div><div style={{fontSize:13,fontWeight:700,color:"#27ae60"}}>{staffRecord?.gradeLevel&&!staffRecord?.gradePending?money(calcLeaveGrant(staffRecord.gradeLevel)||0):"—"}</div></div>
                    </div>
                    {staffRecord?.gradeLevel&&!staffRecord?.gradePending&&!allowance&&(
                      <button className="btn btn-gold btn-sm" style={{marginBottom:10}} onClick={()=>setAllowance(String(calcLeaveGrant(staffRecord.gradeLevel)))}>⚡ Use Auto-Calculated Amount</button>
                    )}
                    <label>Leave Grant Amount (₦) *</label>
                    <input type="number" placeholder="Enter or use auto-calculated amount..." value={allowance} onChange={e=>setAllowance(e.target.value)}/>
                    {allowance&&<div style={{marginTop:6,fontSize:11,color:"#27ae60",fontWeight:600}}>✅ Leave grant set to {money(parseFloat(allowance))}</div>}
                  </div>
                )}
                <div style={{marginBottom:14}}><label>Note (optional)</label><textarea rows={2} value={note} onChange={e=>setNote(e.target.value)} style={{resize:"vertical"}} placeholder="Add a note..."/></div>
                <div style={{marginBottom:16}}>
                  <label>E-Signature *</label>
                  {sig
                    ?<div style={{display:"flex",alignItems:"center",gap:10,background:"#f8f6f0",borderRadius:8,padding:"8px 12px"}}>
                      <img src={sig} alt="sig" style={{height:48,border:"1px solid #e2ddd6",borderRadius:8,background:"#fff"}}/>
                      <div>
                        <div style={{fontSize:11,color:"#27ae60",fontWeight:600}}>{savedSig===sig?"✅ Your saved signature":"✅ Signature ready"}</div>
                        <button className="btn btn-outline" style={{padding:"3px 10px",fontSize:11,marginTop:4}} onClick={()=>setShowSig(true)}>Re-sign</button>
                      </div>
                    </div>
                    :<button className="btn btn-outline" style={{width:"100%"}} onClick={()=>setShowSig(true)}>✏️ Draw Your Signature</button>}
                </div>
                <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                  <button className="btn btn-red" disabled={!sig} onClick={()=>onAct(leave.id,"reject",note,stage,sig,null)}>Reject</button>
                  <button className="btn btn-gold" disabled={!sig||(stage==="finance"&&leave.type==="Annual Leave"&&!allowance)} onClick={()=>onAct(leave.id,"approve",note,stage,sig,stage==="finance"&&leave.type==="Annual Leave"?allowance:null)}>
                    {stage==="chairman"?"✓ Approve Leave & Generate Letter":stage==="auditor"?"✓ Authorise & Forward to Chairman →":"Forward →"}
                  </button>
                </div>
              </div>
            ):(
              <div style={{background:"#f8f6f0",borderRadius:8,padding:"12px 14px",textAlign:"center",color:"#aaa",fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                {leave.status==="approved"?<>✅ Leave approved. <button className="btn btn-gold btn-sm" onClick={()=>setPrintMode(true)}>📥 Download Letter</button></>
                  :leave.status==="rejected"?"❌ Leave rejected.":"⏳ Being processed."}
              </div>
            )}
          </div>
        </div>
      </div>
      {showSig&&<SigPad onSave={d=>{setSig(d);setShowSig(false);}} onClose={()=>setShowSig(false)}/>}
    </>
  );
}

// ── Leave Approval Letter ──────────────────────────────────────────────────────
function LeaveLetter({ leave, users, onClose }) {
  const staff = users.find(u=>u.email===leave.requesterEmail);
  return(
    <div className="overlay">
      <div className="modal" style={{maxWidth:700,background:"#fff"}}>
        <div className="no-print" style={{background:"#0b1f3a",padding:"14px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <span style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:16}}>Leave Approval Letter</span>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-gold btn-sm" onClick={()=>printElement("leave-letter")}>🖨️ Print / Download PDF</button>
            <button onClick={onClose} style={{background:"none",border:"none",color:"#fff",fontSize:24,cursor:"pointer"}}>×</button>
          </div>
        </div>
        <div style={{padding:"32px 40px",fontFamily:"'Segoe UI','Trebuchet MS',sans-serif"}} id="leave-letter">
          {/* Letterhead */}
          <div style={{textAlign:"center",borderBottom:"3px double #0b1f3a",paddingBottom:20,marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16,marginBottom:8}}>
              <img src={LOGO} alt="ECWA" style={{width:70,height:70,borderRadius:"50%",objectFit:"cover",border:"2px solid #c9a84c"}}/>
              <div style={{textAlign:"left"}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:10,color:"#555",letterSpacing:1}}>EVANGELICAL CHURCH WINNING ALL</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#0b1f3a",lineHeight:1.2}}>ECWA Lafia District Church Council (LDCC)</div>
                <div style={{fontSize:11,color:"#666",marginTop:3}}>Beside New Tomatoes Market, P.O. Box 329, Shinge Road Lafia, Nasarawa State</div>
                <div style={{fontSize:11,color:"#555",marginTop:2}}>E-MAIL: lafiadcc@ecwang.org &nbsp;|&nbsp; Tel: 08166646683, 09053971264</div>
              </div>
            </div>
            <div style={{display:"inline-block",background:"#c9a84c",color:"#fff",padding:"3px 20px",borderRadius:20,fontSize:11,fontWeight:700,marginTop:6,letterSpacing:1}}>STAFF LEAVE APPROVAL LETTER</div>
          </div>
          {/* Ref & Date */}
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:20,fontSize:13}}>
            <div><strong>Ref:</strong> {leave.refNo||leave.id}</div>
            <div><strong>Date:</strong> {fdate(today())}</div>
          </div>
          {/* Addressee */}
          <div style={{marginBottom:20,fontSize:13}}>
            <strong>{staff?.name||leave.requester}</strong><br/>
            {staff?.category==="pastor"?<>{staff.rank} · {staff.lc_ph}<br/>{staff.lcc} LCC</>:<>{roleDisplay(staff?.role||leave.requester_role)}<br/>{DEPARTMENTS.find(d=>d.id===staff?.dept)?.label||""} Department</>}
          </div>
          <div style={{marginBottom:20,fontSize:13,lineHeight:1.8}}>
            <strong>Dear {staff?.name?.split(" ")[0]||leave.requester},</strong><br/><br/>
            Your application for leave has been reviewed and approved. Please find below the details of your approved leave:
          </div>
          {/* Details table */}
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13,marginBottom:20}}>
            {[
              ["Staff Name", staff?.name||leave.requester],
              ["Staff ID", staff?`ECWA-${String(staff.id).padStart(4,"0")}`:"—"],
              ["Grade Level", staff?.gradePending?"Pending":staff?.gradeLevel||"—"],
              ["Date of Birth", staff?.dob?fdate(staff.dob):"—"],
              ["Date of Employment", staff?.doj?fdate(staff.doj):"—"],
              ["Department / LCC", leave.lcc||(leave.dept?DEPARTMENTS.find(d=>d.id===leave.dept)?.label:"—")],
              ["Type of Leave", leave.type],
              ["Leave From", fdate(leave.startDate)],
              ["Leave To", fdate(leave.endDate)],
              ["Duration", `${leave.days} day${leave.days>1?"s":""}`],
              ["Leave Allowance", leave.allowance?money(leave.allowance):"Nil"],
            ].map(([k,v])=>(
              <tr key={k} style={{borderBottom:"1px solid #f0ede8"}}>
                <td style={{padding:"8px 12px",background:"#f8f6f0",fontWeight:600,width:"40%",color:"#555"}}>{k}</td>
                <td style={{padding:"8px 12px",fontWeight:600,color:"#0b1f3a"}}>{v}</td>
              </tr>
            ))}
          </table>
          <div style={{fontSize:13,lineHeight:1.8,marginBottom:24}}>
            You are expected to resume duty on <strong>{fdate(new Date(new Date(leave.endDate).getTime()+86400000).toISOString().split("T")[0])}</strong>. We wish you a restful leave period.
          </div>
          {/* Approvals */}
          {leave.approvals?.length>0&&(
            <div style={{marginBottom:24}}>
              <div style={{fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:12,borderTop:"1px solid #e8e4dc",paddingTop:12}}>Approvals</div>
              <div style={{display:"grid",gridTemplateColumns:`repeat(${Math.min(leave.approvals.length,3)},1fr)`,gap:16}}>
                {leave.approvals.map((a,i)=>(
                  <div key={i} style={{textAlign:"center",border:"1px solid #e8e4dc",borderRadius:8,padding:"12px 10px"}}>
                    {a.sig&&<img src={a.sig} alt="" style={{height:40,marginBottom:6,maxWidth:"100%"}}/>}
                    <div style={{fontSize:11,fontWeight:700,color:"#0b1f3a"}}>{a.name}</div>
                    <div style={{fontSize:10,color:"#888"}}>{a.position}</div>
                    <div style={{fontSize:10,color:"#c9a84c"}}>{fdate(a.date)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{fontSize:11,color:"#888",borderTop:"1px solid #e8e4dc",paddingTop:14,marginTop:10}}>
            <div style={{textAlign:"center",fontStyle:"italic",marginBottom:6}}>All Correspondence should be addressed to the DCC Secretary</div>
            <div style={{textAlign:"center",fontSize:10,color:"#aaa"}}>Registered Trustees: Engr. Peter Nathaniel Tsado, Rev. Michael Adamu, Rev. Engr. Justus Ayodele Obilomo, Rev. Prof. Sunday B. Agang, Rev. Prof. Musa A.B. Gaiya, Rev. Dr. Isaac B. Laudarji, Elder Moses Y. Dembo, Prof. Umaru Kiro Kalgo, Pastor Engr. James Asonnibare and Prof. Basil Nwosu</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Leave Module ──────────────────────────────────────────────────────────────
function LeaveMod({ user, users, leaves, setLeaves, toast }) {
  const [form,setForm]=useState(false); const [sel,setSel]=useState(null); const [tab,setTab]=useState("all");

  const isApprover = ["lo","secretary","ads","conf_secretary","accountant","auditor","chairman","vice_chairman"].includes(user.role);

  const pendingCount = leaves.filter(l=>{
    if(user.role==="lo") return l.lcc===user.lcc_overseen&&l.status==="pending_dept";
    const dh = l.dept?deptHeadRole(l.dept):null;
    if((user.role===dh&&l.status==="pending_dept")||
       (["secretary","ads","conf_secretary"].includes(user.role)&&l.status==="pending_admin")||
       (user.role==="accountant"&&l.status==="pending_finance")||
       (user.role==="auditor"&&l.status==="pending_auditor")||
       (["chairman","vice_chairman"].includes(user.role)&&l.status==="pending_chairman")) return true;
    return false;
  }).length;

  const addLeave=(f)=>{
    const id="LV-"+String(leaves.length+1).padStart(3,"0");
    const days=Math.max(1,Math.round((new Date(f.endDate)-new Date(f.startDate))/(1000*60*60*24))+1);
    const deptForUser = user.category==="office"?user.dept:null;
    setLeaves(l=>[...l,{
      id, refNo:`LV-${new Date().getFullYear()}-${String(leaves.length+1).padStart(3,"0")}`,
      requester:user.name, requesterEmail:user.email, requester_role:user.role,
      lcc:user.lcc||null, lc_ph:user.lc_ph||null, rank:user.rank||null,
      dept:deptForUser, type:f.type, startDate:f.startDate, endDate:f.endDate,
      days, reason:f.reason, status:"pending_dept",
      allowance:null, approvals:[], date:today(), appeal:null,
    }]);
    toast("✅ Leave request submitted.");setForm(false);
  };

  const act=(id,action,note,stage,sig,allowanceAmt)=>{
    setLeaves(ls=>ls.map(l=>{
      if(l.id!==id)return l;
      const approverName = user.name;
      const approverPos = roleDisplay(user.role);
      const newApproval = {name:approverName,position:approverPos,date:today(),note:note||"",sig:sig||null};
      const newApprovals = [...(l.approvals||[]),newApproval];
      if(action==="reject"){
        toast("Leave request rejected.","danger");
        sendGenericEmail({
          to_name: l.requester,
          to_email: l.requesterEmail,
          email_subject: "Your Leave Request Has Been Rejected — ECWA Lafia DCC",
          email_body: `Your leave request (${l.type}, ${fdate(l.startDate)} – ${fdate(l.endDate)}) has been rejected by ${approverName} (${approverPos}).\n\n${note?`Note: ${note}\n\n`:""}Please contact Admin & Personnel for further guidance.`,
        });
        return{...l,status:"rejected",approvals:newApprovals};
      }
      // advance — dept→admin→finance→auditor→chairman→approved
      const nextStatus = stage==="dept"?"pending_admin":stage==="admin"?"pending_finance":stage==="finance"?"pending_auditor":stage==="auditor"?"pending_chairman":"approved";
      const updates = {status:nextStatus,approvals:newApprovals};
      if(allowanceAmt) updates.allowance=parseFloat(allowanceAmt);
      if(nextStatus==="approved"){
        toast("🎉 Leave approved! Letter ready for download.");
        sendGenericEmail({
          to_name: l.requester,
          to_email: l.requesterEmail,
          email_subject: "Your Leave Request Has Been Approved — ECWA Lafia DCC",
          email_body: `Congratulations! Your leave request has been fully approved.\n\nLeave Type: ${l.type}\nFrom: ${fdate(l.startDate)}\nTo: ${fdate(l.endDate)}\nDuration: ${l.days} day(s)\n${updates.allowance?`Leave Grant: ₦${Number(updates.allowance).toLocaleString()}\n`:""}\nYour leave approval letter is available on the portal.\n\nSign in at: https://ecwa-portal.onrender.com`,
        });
      } else {
        toast("✅ Forwarded to next stage.");
      }
      return{...l,...updates};
    }));
    setSel(null);
  };

  const displayLeaves = user.role==="pastor"? leaves.filter(l=>l.requesterEmail===user.email)
    : user.role==="lo"? (
        tab==="pending"? leaves.filter(l=>l.lcc===user.lcc_overseen&&l.status==="pending_dept")
        : tab==="mine"?  leaves.filter(l=>l.requesterEmail===user.email)
        : leaves.filter(l=>l.lcc===user.lcc_overseen)
      )
    : tab==="mine"? leaves.filter(l=>l.requesterEmail===user.email)
    : tab==="pending"? leaves.filter(l=>canActLeave(user,l,users)!==null)
    : leaves;

  // Stats — pastors only see their own, LO sees their LCC, admins see all
  const statsLeaves = user.role==="pastor"? leaves.filter(l=>l.requesterEmail===user.email)
    : user.role==="lo"? leaves.filter(l=>l.lcc===user.lcc_overseen)
    : leaves;

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:22}}>
        <StatCard icon="📋" label="Total" value={statsLeaves.length} color="#0b1f3a"/>
        <StatCard icon="⏳" label="Pending" value={statsLeaves.filter(l=>l.status.startsWith("pending")).length} color="#e67e22"/>
        <StatCard icon="✅" label="Approved" value={statsLeaves.filter(l=>l.status==="approved").length} color="#27ae60"/>
        <StatCard icon="❌" label="Rejected" value={statsLeaves.filter(l=>l.status==="rejected").length} color="#c0392b"/>
      </div>
      <div className="card">
        <div style={{padding:"18px 20px",borderBottom:"1.5px solid #f0ede8",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div><h2 style={{fontFamily:"Georgia,serif",fontSize:18,color:"#0b1f3a"}}>Leave Requests</h2><p style={{fontSize:12,color:"#888",marginTop:1}}>Click any record to view or act on it</p></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {user.role!=="pastor"&&(
              <div className="tab-bar">
                {[{id:"all",label:"All"},{id:"mine",label:"Mine"},...(isApprover?[{id:"pending",label:"Pending",badge:pendingCount}]:[])].map(t=>(
                  <button key={t.id} className={`tab ${tab===t.id?"active":""}`} onClick={()=>setTab(t.id)}>
                    {t.label}
                    {t.badge>0&&<span className="pulse" style={{marginLeft:5,background:"#c9a84c",color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:10}}>{t.badge}</span>}
                  </button>
                ))}
              </div>
            )}
            <button className="btn btn-gold" onClick={()=>setForm(true)}>+ Apply for Leave</button>
          </div>
        </div>
        {displayLeaves.length===0&&<div style={{padding:48,textAlign:"center",color:"#bbb"}}><div style={{fontSize:36,marginBottom:10}}>📭</div><div style={{fontSize:14,fontWeight:600,color:"#ccc"}}>No leave records found.</div></div>}
        {displayLeaves.map((lv,i)=>{
          const sc=LEAVE_STATUS[lv.status]||{label:lv.status,color:"#888",bg:"#f4f4f4"};
          return(
            <div key={lv.id} className="trow slide-in" style={{padding:"16px 20px",borderBottom:"1px solid #f5f3ef",display:"flex",alignItems:"center",gap:14,cursor:"pointer",animationDelay:`${i*0.04}s`}} onClick={()=>setSel(lv)}>
              <div style={{width:40,height:40,background:lv.status.startsWith("pending")?"#0b1f3a":"#f0ede8",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{lv.status==="approved"?"✅":lv.status==="rejected"?"❌":"📋"}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",gap:6,marginBottom:2,alignItems:"center",flexWrap:"wrap"}}><span style={{fontWeight:700,fontSize:14,color:"#0b1f3a"}}>{lv.id}</span><span style={{fontSize:12,color:"#aaa"}}>·</span><span style={{fontSize:13,color:"#666"}}>{lv.requester}</span><span style={{fontSize:11,color:"#888",background:"#f0ede8",padding:"2px 8px",borderRadius:10}}>{lv.type}</span></div>
                <div style={{fontSize:12,color:"#999"}}>{lv.days} day{lv.days>1?"s":""} · {fdate(lv.startDate)} – {fdate(lv.endDate)}</div>
              </div>
              <span className="badge" style={{color:sc.color,background:sc.bg,flexShrink:0}}>{sc.label}</span>
              <div style={{color:"#ddd",fontSize:18}}>›</div>
            </div>
          );
        })}
      </div>
      {form&&<LeaveForm user={user} onSubmit={addLeave} onClose={()=>setForm(false)}/>}
      {sel&&<LeaveDetail leave={sel} user={user} users={users} onClose={()=>setSel(null)} onAct={act}/>}
    </div>
  );
}

function LeaveForm({ user, onSubmit, onClose }) {
  const [f,setF]=useState({type:"",startDate:"",endDate:"",reason:""});
  const s=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const valid=f.type&&f.startDate&&f.endDate&&f.reason&&new Date(f.endDate)>=new Date(f.startDate);
  return(
    <div className="overlay">
      <div className="modal" style={{maxWidth:520}}>
        <MH title="Apply for Leave" sub="Leave Module" onClose={onClose}/>
        <div style={{padding:"22px 24px 24px",display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"#f8f6f0",borderRadius:8,padding:"12px 16px"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#0b1f3a"}}>{user.name} · {roleDisplay(user.role)}</div>
            <div style={{fontSize:12,color:"#888",marginTop:2}}>{user.category==="pastor"?`${user.lc_ph} · ${user.lcc} LCC`:DEPARTMENTS.find(d=>d.id===user.dept)?.label||"—"}</div>
          </div>
          <div><label>Type of Leave *</label><select value={f.type} onChange={s("type")}><option value="">— Select leave type —</option>{LEAVE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label>Start Date *</label><input type="date" value={f.startDate} onChange={s("startDate")}/></div>
            <div><label>End Date *</label><input type="date" value={f.endDate} onChange={s("endDate")}/></div>
          </div>
          {f.startDate&&f.endDate&&new Date(f.endDate)>=new Date(f.startDate)&&(
            <div style={{background:"#eaf4fb",borderRadius:8,padding:"8px 14px",fontSize:13,color:"#2980b9",fontWeight:600}}>📅 {Math.max(1,Math.round((new Date(f.endDate)-new Date(f.startDate))/(1000*60*60*24))+1)} days requested</div>
          )}
          <div><label>Reason / Details *</label><textarea rows={3} placeholder="Briefly explain the reason for this leave..." value={f.reason} onChange={s("reason")} style={{resize:"vertical"}}/></div>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-gold" disabled={!valid} onClick={()=>onSubmit(f)}>Submit →</button></div>
        </div>
      </div>
    </div>
  );
}

// ── Sunday Reports ─────────────────────────────────────────────────────────────
function SundayMod({ user, users, sundayReports, setSundayReports, toast }) {
  const [form,setForm]=useState(false); const [sel,setSel]=useState(null);
  const [monthFilter,setMonthFilter]=useState(new Date().toISOString().slice(0,7));

  const isLO = user.role==="lo";
  const isPastor = user.role==="pastor";

  // Get pastors in LO's LCC
  const myLccPastors = isLO ? users.filter(u=>u.category==="pastor"&&u.lcc===user.lcc_overseen) : [];

  // Reports visible
  const visReports = isPastor? sundayReports.filter(r=>r.pastorId===user.id)
    : isLO? sundayReports.filter(r=>r.lcc===user.lcc_overseen)
    : sundayReports;

  const monthReports = visReports.filter(r=>r.date.startsWith(monthFilter));

  // Monthly summary per pastor (for LO)
  const getMonthlySummary = (pastorId) => {
    const rpts = visReports.filter(r=>r.pastorId===pastorId&&r.date.startsWith(monthFilter));
    // Count Sundays in that month
    const [yr,mo] = monthFilter.split("-").map(Number);
    const firstDay = new Date(yr,mo-1,1);
    const lastDay = new Date(yr,mo,0);
    let sundayCount=0;
    for(let d=new Date(firstDay);d<=lastDay;d.setDate(d.getDate()+1)){if(d.getDay()===0)sundayCount++;}
    return {
      rpts, submitted:rpts.length, total:sundayCount, missed:Math.max(0,sundayCount-rpts.length),
      totalAttendance: rpts.reduce((s,r)=>s+(r.attendance.men||0)+(r.attendance.women||0)+(r.attendance.children||0),0),
      totalGross: rpts.reduce((s,r)=>s+(r.totalGross||0),0),
      totalDue: rpts.reduce((s,r)=>s+(r.remittanceDue||0),0),
    };
  };

  const submitReport=(f)=>{
    const id="SR-"+String(sundayReports.length+1).padStart(3,"0");
    setSundayReports(r=>[...r,{...f,id,pastorId:user.id,pastorName:user.name,pastorEmail:user.email,lcc:user.lcc,lc_ph:user.lc_ph,submitted:true,appeal:null}]);
    toast("✅ Sunday report submitted.");setForm(false);
  };

  return(
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:22}}>
        <StatCard icon="📖" label="Total Reports" value={visReports.length} color="#0b1f3a"/>
        <StatCard icon="👥" label="This Month" value={monthReports.length} color="#2980b9"/>
        <StatCard icon="💰" label="Total Due (Month)" value={money(monthReports.reduce((s,r)=>s+(r.remittanceDue||0),0))} color="#27ae60"/>
        {isPastor&&<StatCard icon="🏛️" label="All Sundays Submitted" value={visReports.length} color="#8e44ad"/>}
      </div>

      {/* LO: Monthly Summary Per Pastor */}
      {isLO&&(
        <div className="card" style={{marginBottom:20}}>
          <div className="section-hdr">📊 Monthly Summary — {monthFilter}</div>
          <div style={{padding:"14px 20px"}}>
            <div style={{marginBottom:14}}>
              <label>Filter Month</label>
              <input type="month" value={monthFilter} onChange={e=>setMonthFilter(e.target.value)} style={{maxWidth:200}}/>
            </div>
            {myLccPastors.length===0&&<div style={{color:"#bbb",fontSize:13,textAlign:"center",padding:20}}>No pastors in your LCC yet.</div>}
            {myLccPastors.map(pastor=>{
              const s=getMonthlySummary(pastor.id);
              return(
                <div key={pastor.id} style={{border:"1.5px solid #e8e4dc",borderRadius:12,padding:16,marginBottom:12,background:s.missed>0?"#fffbf5":"#fff"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:12}}>
                    <div>
                      <div style={{fontWeight:700,fontSize:14,color:"#0b1f3a"}}>{pastor.name}</div>
                      <div style={{fontSize:12,color:"#888",marginTop:2}}>{pastor.rank} · {pastor.lc_ph}</div>
                    </div>
                    {s.missed>0
                      ?<span style={{background:"#fdecea",color:"#c0392b",padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700}}>⚠️ {s.missed} Sunday{s.missed>1?"s":""} Missed</span>
                      :<span style={{background:"#eafbf0",color:"#27ae60",padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700}}>✓ All Submitted</span>
                    }
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:"8px 16px"}}>
                    {[["📋 Submitted",`${s.submitted}/${s.total} Sundays`],["👥 Attendance",s.totalAttendance.toLocaleString()],["💰 Gross Collected",money(s.totalGross)],["🏛️ DCC Due",money(s.totalDue)]].map(([k,v])=>(
                      <div key={k}><div style={{fontSize:10,color:"#aaa"}}>{k}</div><div style={{fontSize:13,fontWeight:700,color:"#0b1f3a"}}>{v}</div></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Report List */}
      <div className="card">
        <div style={{padding:"18px 20px",borderBottom:"1.5px solid #f0ede8",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <div><h2 style={{fontFamily:"Georgia,serif",fontSize:18,color:"#0b1f3a"}}>{isPastor?"My Sunday Reports":"Sunday Reports"}</h2><p style={{fontSize:12,color:"#888",marginTop:1}}>Click to view details</p></div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <input type="month" value={monthFilter} onChange={e=>setMonthFilter(e.target.value)} style={{maxWidth:160}}/>
            {isPastor&&<button className="btn btn-gold" onClick={()=>setForm(true)}>+ Submit Report</button>}
          </div>
        </div>
        {monthReports.length===0&&<div style={{padding:48,textAlign:"center",color:"#bbb"}}><div style={{fontSize:36,marginBottom:10}}>📖</div><div style={{fontSize:14,fontWeight:600,color:"#ccc"}}>{isPastor?"No reports for this month. Submit your Sunday report.":"No reports for this month."}</div></div>}
        {monthReports.map((rpt,i)=>(
          <div key={rpt.id} className="trow slide-in" style={{padding:"16px 20px",borderBottom:"1px solid #f5f3ef",display:"flex",alignItems:"center",gap:14,cursor:"pointer",animationDelay:`${i*0.04}s`}} onClick={()=>setSel(rpt)}>
            <div style={{width:40,height:40,background:"#0b1f3a",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>⛪</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{display:"flex",gap:6,marginBottom:2,alignItems:"center",flexWrap:"wrap"}}>
                <span style={{fontWeight:700,fontSize:14,color:"#0b1f3a"}}>{fdate(rpt.date)}</span>
                {!isPastor&&<span style={{fontSize:12,color:"#666"}}>· {rpt.pastorName}</span>}
                {rpt.fullRemittance&&<span style={{background:"#fdecea",color:"#c0392b",padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700}}>100% Remittance</span>}
                {rpt.appeal&&<span style={{background:"#fef3e2",color:"#e67e22",padding:"2px 8px",borderRadius:10,fontSize:10,fontWeight:700}}>Appeal Pending</span>}
              </div>
              <div style={{fontSize:12,color:"#999"}}>
                👥 {(rpt.attendance.men||0)+(rpt.attendance.women||0)+(rpt.attendance.children||0)} total · 💰 {money(rpt.totalGross)} collected · 🏛️ {money(rpt.remittanceDue)} due
              </div>
            </div>
            <div style={{color:"#ddd",fontSize:18}}>›</div>
          </div>
        ))}
      </div>

      {form&&<SundayReportForm user={user} onSubmit={submitReport} onClose={()=>setForm(false)}/>}
      {sel&&<SundayReportDetail report={sel} user={user} users={users} setSundayReports={setSundayReports} toast={toast} onClose={()=>setSel(null)}/>}
    </div>
  );
}

function SundayReportForm({ user, onSubmit, onClose }) {
  const [date,setDate]=useState(today());
  const [att,setAtt]=useState({men:"",women:"",children:""});
  const [cols,setCols]=useState({offering:"",tithes:"",thanksgiving:"",freewill:""});
  const [optItems,setOptItems]=useState([]);
  const [others,setOthers]=useState([]);
  const [fullRemittance,setFullRemittance]=useState(false);
  const [newOtherLabel,setNewOtherLabel]=useState("");

  const addOptItem=(item)=>{if(!optItems.find(o=>o.id===item.id))setOptItems(p=>[...p,{...item,amount:""}]);};
  const removeOpt=(id)=>setOptItems(p=>p.filter(o=>o.id!==id));
  const setOptAmt=(id,val)=>setOptItems(p=>p.map(o=>o.id===id?{...o,amount:val}:o));
  const addOther=()=>{if(!newOtherLabel.trim())return;setOthers(p=>[...p,{id:"other_"+Date.now(),label:newOtherLabel.trim(),amount:"",excluded:false}]);setNewOtherLabel("");};
  const removeOther=(id)=>setOthers(p=>p.filter(o=>o.id!==id));
  const setOtherAmt=(id,val)=>setOthers(p=>p.map(o=>o.id===id?{...o,amount:val}:o));

  const fixedTotal = Object.values(cols).reduce((s,v)=>s+(parseFloat(v)||0),0);
  const optTotal   = optItems.reduce((s,o)=>s+(parseFloat(o.amount)||0),0);
  const othersTotal= others.reduce((s,o)=>s+(parseFloat(o.amount)||0),0);
  const totalGross = fixedTotal+optTotal+othersTotal;

  // Remittance base excludes optional excluded items (unless fullRemittance)
  const remittanceBase = fullRemittance? totalGross
    : fixedTotal + others.filter(o=>!o.excluded).reduce((s,o)=>s+(parseFloat(o.amount)||0),0);
  const remittanceDue = Math.round(fullRemittance? totalGross : remittanceBase*0.25);

  const valid = date && (Object.values(cols).some(v=>parseFloat(v)>0)||optItems.length>0);

  const submit=()=>{
    onSubmit({
      date, attendance:{men:parseInt(att.men)||0,women:parseInt(att.women)||0,children:parseInt(att.children)||0},
      collections:Object.fromEntries(Object.entries(cols).map(([k,v])=>[k,parseFloat(v)||0])),
      optionalItems:optItems.map(o=>({...o,amount:parseFloat(o.amount)||0})),
      others:others.map(o=>({...o,amount:parseFloat(o.amount)||0})),
      fullRemittance, totalGross, remittanceBase, remittanceDue,
    });
  };

  return(
    <div className="overlay">
      <div className="modal" style={{maxWidth:600}}>
        <MH title="Sunday Report Entry" sub="Sunday Reports" onClose={onClose}/>
        <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:"#f8f6f0",borderRadius:8,padding:"12px 16px"}}>
            <div style={{fontSize:13,fontWeight:700,color:"#0b1f3a"}}>{user.name} · {user.rank}</div>
            <div style={{fontSize:12,color:"#888",marginTop:2}}>{user.lc_ph} · {user.lcc} LCC</div>
          </div>

          <div><label>Date of Sunday *</label><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></div>

          {/* Attendance */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>👥 Attendance</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <div><label>Men</label><input type="number" min="0" placeholder="0" value={att.men} onChange={e=>setAtt(p=>({...p,men:e.target.value}))}/></div>
              <div><label>Women</label><input type="number" min="0" placeholder="0" value={att.women} onChange={e=>setAtt(p=>({...p,women:e.target.value}))}/></div>
              <div><label>Children</label><input type="number" min="0" placeholder="0" value={att.children} onChange={e=>setAtt(p=>({...p,children:e.target.value}))}/></div>
            </div>
            {(att.men||att.women||att.children)&&<div style={{marginTop:8,background:"#eaf4fb",borderRadius:8,padding:"6px 12px",fontSize:12,color:"#2980b9",fontWeight:600}}>Total: {(parseInt(att.men)||0)+(parseInt(att.women)||0)+(parseInt(att.children)||0)}</div>}
          </div>

          {/* Standard Collections */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>💰 Standard Collections (included in 25%)</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {SUNDAY_FIXED_ITEMS.map(item=>(
                <div key={item.id}>
                  <label>{item.label}</label>
                  <div style={{position:"relative"}}>
                    <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#aaa",fontWeight:600,fontSize:13,pointerEvents:"none"}}>₦</span>
                    <input type="text" inputMode="decimal" placeholder="0.00" style={{paddingLeft:24}}
                      value={cols[item.id]||""}
                      onChange={e=>setCols(p=>({...p,[item.id]:e.target.value.replace(/[^0-9.]/g,"")}))}
                      onBlur={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setCols(p=>({...p,[item.id]:v.toFixed(2)}))}}/> 
                  </div>
                  {cols[item.id]&&parseFloat(cols[item.id])>0&&<div style={{fontSize:10,color:"#888",marginTop:2}}>{money(parseFloat(cols[item.id]))}</div>}
                </div>
              ))}
            </div>
          </div>

          {/* Optional excluded items */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>📌 Special Collections (excluded from 25%)</div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:10}}>
              {SUNDAY_OPTIONAL_ITEMS.filter(oi=>!optItems.find(o=>o.id===oi.id)).map(oi=>(
                <button key={oi.id} className="btn btn-outline btn-sm" onClick={()=>addOptItem(oi)}>+ {oi.label}</button>
              ))}
            </div>
            {optItems.map(oi=>(
              <div key={oi.id} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <div style={{flex:1}}>
                  <label>{oi.label}</label>
                  <div style={{position:"relative"}}>
                    <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#aaa",fontWeight:600,fontSize:13,pointerEvents:"none"}}>₦</span>
                    <input type="text" inputMode="decimal" placeholder="0.00" style={{paddingLeft:24}}
                      value={oi.amount}
                      onChange={e=>setOptAmt(oi.id,e.target.value.replace(/[^0-9.]/g,""))}
                      onBlur={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setOptAmt(oi.id,v.toFixed(2));}}/>
                  </div>
                </div>
                <button className="btn btn-red btn-sm" style={{marginTop:20,flexShrink:0}} onClick={()=>removeOpt(oi.id)}>✕</button>
              </div>
            ))}
          </div>

          {/* Others */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>➕ Other Collections</div>
            {others.map(o=>(
              <div key={o.id} style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <div style={{flex:1}}>
                  <label>{o.label}</label>
                  <div style={{position:"relative"}}>
                    <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#aaa",fontWeight:600,fontSize:13,pointerEvents:"none"}}>₦</span>
                    <input type="text" inputMode="decimal" placeholder="0.00" style={{paddingLeft:24}}
                      value={o.amount}
                      onChange={e=>setOtherAmt(o.id,e.target.value.replace(/[^0-9.]/g,""))}
                      onBlur={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setOtherAmt(o.id,v.toFixed(2));}}/>
                  </div>
                </div>
                <button className="btn btn-red btn-sm" style={{marginTop:20,flexShrink:0}} onClick={()=>removeOther(o.id)}>✕</button>
              </div>
            ))}
            <div style={{display:"flex",gap:8}}>
              <input placeholder="Collection name..." value={newOtherLabel} onChange={e=>setNewOtherLabel(e.target.value)} style={{flex:1}}/>
              <button className="btn btn-outline btn-sm" onClick={addOther} style={{flexShrink:0}}>+ Add</button>
            </div>
          </div>

          {/* 100% Remittance */}
          <div style={{background:"#fdecea",borderRadius:8,padding:"12px 16px",display:"flex",alignItems:"center",gap:12}}>
            <input type="checkbox" id="fullRem" checked={fullRemittance} onChange={e=>setFullRemittance(e.target.checked)} style={{width:"auto",margin:0}}/>
            <label htmlFor="fullRem" style={{margin:0,textTransform:"none",fontSize:13,color:"#c0392b",letterSpacing:0}}>🔴 This is a 100% remittance Sunday (entire gross goes to DCC)</label>
          </div>

          {/* Summary */}
          {totalGross>0&&(
            <div style={{background:"linear-gradient(135deg,#0b1f3a,#1a3a5c)",borderRadius:12,padding:20,color:"#fff"}}>
              <div style={{fontSize:12,color:"#c9a84c",fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:12}}>💰 Collection Summary</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                <div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>Total Gross</div><div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#fff"}}>{money(totalGross)}</div></div>
                <div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>{fullRemittance?"100% DCC Remittance":"25% DCC Remittance"}</div><div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#c9a84c"}}>{money(remittanceDue)}</div></div>
                {!fullRemittance&&<div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>75% Retained by LC</div><div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#27ae60"}}>{money(remittanceBase-remittanceDue)}</div></div>}
              </div>
            </div>
          )}

          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-gold" disabled={!valid} onClick={submit}>Submit Report →</button></div>
        </div>
      </div>
    </div>
  );
}

function SundayReportDetail({ report, user, users, setSundayReports, toast, onClose }) {
  const [showAppeal,setShowAppeal]=useState(false); const [appealText,setAppealText]=useState("");
  const [appealAction,setAppealAction]=useState(null); const [appealNote,setAppealNote]=useState("");
  const totalAtt=(report.attendance.men||0)+(report.attendance.women||0)+(report.attendance.children||0);
  const isAdmin=["secretary","ads","conf_secretary","chairman","accountant"].includes(user.role);

  const submitAppeal=()=>{
    setSundayReports(rs=>rs.map(r=>r.id===report.id?{...r,appeal:{text:appealText,date:today(),status:"pending",pastorEmail:report.pastorEmail||user.email,pastorName:report.pastorName}}:r));
    const admins=users.filter(u=>["secretary","ads","conf_secretary"].includes(u.role));
    admins.forEach(a=>sendGenericEmail({to_name:a.name,to_email:a.email,
      email_subject:`Sunday Report Appeal — ${report.pastorName} (${fdate(report.date)})`,
      email_body:`An appeal was submitted for a Sunday report.\n\nPastor: ${report.pastorName}\nChurch: ${report.lc_ph}\nDate: ${fdate(report.date)}\n\nAppeal:\n${appealText}\n\nPlease log in to review.\nhttps://ecwa-portal.onrender.com`}));
    toast("Appeal submitted. Admin has been notified.");setShowAppeal(false);
  };

  const handleAppealDecision=(action)=>{
    if(action==="resubmit"){
      setSundayReports(rs=>rs.map(r=>r.id===report.id?{...r,submitted:false,appeal:{...r.appeal,status:"resubmit",adminNote:appealNote,adminBy:user.name,adminDate:today()}}:r));
      sendGenericEmail({to_name:report.pastorName,to_email:report.appeal?.pastorEmail||"",
        email_subject:"Sunday Report Returned for Correction — ECWA Lafia DCC",
        email_body:`Your Sunday report for ${fdate(report.date)} has been returned for correction.\n\nAdmin Note: ${appealNote}\n\nPlease log in and resubmit.\nhttps://ecwa-portal.onrender.com`});
      toast("Report returned to pastor for correction.");
    } else {
      setSundayReports(rs=>rs.map(r=>r.id===report.id?{...r,appeal:{...r.appeal,status:"accepted",adminNote:appealNote,adminBy:user.name,adminDate:today()}}:r));
      sendGenericEmail({to_name:report.pastorName,to_email:report.appeal?.pastorEmail||"",
        email_subject:"Sunday Report Appeal Accepted — ECWA Lafia DCC",
        email_body:`Your appeal for the Sunday report dated ${fdate(report.date)} has been accepted.\n\nAdmin Note: ${appealNote||"No additional note."}\n\nECWA Lafia DCC`});
      toast("Appeal accepted.");
    }
    setAppealAction(null);setAppealNote("");onClose();
  };

  return(
    <div className="overlay">
      <div className="modal" style={{maxWidth:580}}>
        <MH title={report.id} sub="Sunday Report" onClose={onClose}/>
        <div style={{padding:"22px 24px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:10}}>
            <div>
              <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#0b1f3a"}}>{fdate(report.date)}</div>
              <div style={{fontSize:12,color:"#888",marginTop:2}}>{report.pastorName} · {report.lc_ph}</div>
            </div>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              {report.fullRemittance&&<span style={{background:"#fdecea",color:"#c0392b",padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700}}>🔴 100% Remittance</span>}
              {report.appeal&&<span style={{background:report.appeal.status==="accepted"?"#eafbf0":report.appeal.status==="resubmit"?"#eaf4fb":"#fef3e2",color:report.appeal.status==="accepted"?"#27ae60":report.appeal.status==="resubmit"?"#2980b9":"#e67e22",padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700}}>
                {report.appeal.status==="accepted"?"✅ Appeal Accepted":report.appeal.status==="resubmit"?"🔄 Returned for Correction":"⚠️ Appeal Pending"}
              </span>}
            </div>
          </div>

          <div style={{background:"#eaf4fb",borderRadius:10,padding:"14px 18px",marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:"#2980b9",textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>👥 Attendance</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12}}>
              {[["Men",report.attendance.men||0],["Women",report.attendance.women||0],["Children",report.attendance.children||0],["Total",totalAtt]].map(([k,v])=>(
                <div key={k} style={{textAlign:"center"}}><div style={{fontSize:10,color:"#888"}}>{k}</div><div style={{fontSize:18,fontWeight:700,color:"#0b1f3a",fontFamily:"Georgia,serif"}}>{v}</div></div>
              ))}
            </div>
          </div>

          <div style={{marginBottom:16}}>
            <div style={{fontSize:11,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>💰 Collections</div>
            {SUNDAY_FIXED_ITEMS.map(item=>(
              <div key={item.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 12px",borderBottom:"1px solid #f5f3ef",fontSize:13}}>
                <span style={{color:"#555"}}>{item.label}</span><span style={{fontWeight:700}}>{money(report.collections?.[item.id]||0)}</span>
              </div>
            ))}
            {report.optionalItems?.map(o=>(
              <div key={o.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 12px",borderBottom:"1px solid #f5f3ef",fontSize:13}}>
                <span style={{color:"#888"}}>{o.label} <span style={{fontSize:10,background:"#f0ede8",padding:"1px 6px",borderRadius:10,color:"#aaa"}}>excluded</span></span>
                <span style={{fontWeight:700}}>{money(o.amount||0)}</span>
              </div>
            ))}
            {report.others?.map(o=>(
              <div key={o.id} style={{display:"flex",justifyContent:"space-between",padding:"7px 12px",borderBottom:"1px solid #f5f3ef",fontSize:13}}>
                <span style={{color:"#555"}}>{o.label}</span><span style={{fontWeight:700}}>{money(o.amount||0)}</span>
              </div>
            ))}
          </div>

          {/* Fix #9 — Remittance Base removed */}
          <div style={{background:"linear-gradient(135deg,#0b1f3a,#1a3a5c)",borderRadius:12,padding:18,marginBottom:16}}>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>Total Gross</div><div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#fff"}}>{money(report.totalGross)}</div></div>
              <div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>{report.fullRemittance?"100% DCC Remittance":"25% DCC Remittance"}</div><div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#c9a84c"}}>{money(report.remittanceDue)}</div></div>
              {!report.fullRemittance&&<div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>75% Retained by LC</div><div style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#27ae60"}}>{money((report.totalGross||0)-(report.remittanceDue||0))}</div></div>}
            </div>
          </div>

          {/* Fix #4 — Full appeal workflow */}
          {report.appeal?(
            <div style={{background:"#fef3e2",border:"1px solid #f5c542",borderRadius:8,padding:"12px 14px",fontSize:13}}>
              <div style={{fontWeight:700,color:"#e67e22",marginBottom:4}}>⚠️ Appeal: {report.appeal.text}</div>
              <div style={{fontSize:11,color:"#aaa",marginTop:2}}>{fdate(report.appeal.date)} · Status: <strong>{report.appeal.status}</strong></div>
              {report.appeal.adminNote&&<div style={{marginTop:6,background:"#fff",borderRadius:6,padding:"6px 10px",fontSize:12}}>Admin note: {report.appeal.adminNote} — <span style={{color:"#aaa"}}>{report.appeal.adminBy}, {fdate(report.appeal.adminDate)}</span></div>}
              {isAdmin&&report.appeal.status==="pending"&&!appealAction&&(
                <div style={{marginTop:10,display:"flex",gap:8,flexWrap:"wrap"}}>
                  <button className="btn btn-outline btn-sm" onClick={()=>setAppealAction("accept")}>✅ Accept Appeal</button>
                  <button className="btn btn-gold btn-sm" onClick={()=>setAppealAction("resubmit")}>🔄 Return for Correction</button>
                </div>
              )}
              {appealAction&&(
                <div style={{marginTop:10}}>
                  <label style={{fontSize:12,fontWeight:700}}>{appealAction==="resubmit"?"Instructions for Pastor *":"Note (optional)"}</label>
                  <textarea rows={2} value={appealNote} onChange={e=>setAppealNote(e.target.value)} placeholder={appealAction==="resubmit"?"What needs to be corrected?":"Any note..."} style={{resize:"vertical",marginTop:4,marginBottom:8}}/>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn btn-outline btn-sm" onClick={()=>setAppealAction(null)}>Cancel</button>
                    <button className="btn btn-gold btn-sm" disabled={appealAction==="resubmit"&&!appealNote.trim()} onClick={()=>handleAppealDecision(appealAction)}>
                      {appealAction==="resubmit"?"Send Back to Pastor →":"Confirm Accept →"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ):user.role==="pastor"&&(
            <div>
              {!showAppeal?(
                <button className="btn btn-outline btn-sm" onClick={()=>setShowAppeal(true)}>⚠️ Submit Appeal (error correction)</button>
              ):(
                <div style={{background:"#f8f6f0",borderRadius:8,padding:14}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#0b1f3a",marginBottom:8}}>Describe the error in your report:</div>
                  <textarea rows={3} value={appealText} onChange={e=>setAppealText(e.target.value)} placeholder="Explain what needs to be corrected..." style={{resize:"vertical",marginBottom:10}}/>
                  <div style={{display:"flex",gap:8}}>
                    <button className="btn btn-outline btn-sm" onClick={()=>setShowAppeal(false)}>Cancel</button>
                    <button className="btn btn-gold btn-sm" disabled={!appealText.trim()} onClick={submitAppeal}>Submit Appeal</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Staff Profile & Documents ──────────────────────────────────────────────────
function StaffProf({ staff, user, users, canEdit, canEditDetails, lccs, onClose, onUpdate, onTransfer }) {
  const isSelfEdit = staff.id===user.id && !canEditDetails;
  const fref=useRef(null); const photoRef=useRef(null); const [upl,setUpl]=useState(null);
  const [editing,setEditing]=useState(false); const [transferMode,setTransferMode]=useState(false);
  const [newLcc,setNewLcc]=useState(""); const [newChurch,setNewChurch]=useState(""); const [transferNote,setTransferNote]=useState("");
  const [addSection,setAddSection]=useState(false); const [newSecLabel,setNewSecLabel]=useState("");
  const [lightbox,setLightbox]=useState(null);
  const [loMode,setLoMode]=useState(false); const [loTempPw,setLoTempPw]=useState(""); // {src, name}
  const [form,setForm]=useState({
    name:staff.name,phone:staff.phone||"",email:staff.email,
    dob:staff.dob||"",doj:staff.doj||"",
    dept:staff.dept||"",jobTitle:staff.jobTitle||"",rank:staff.rank||"",
    lcc:staff.lcc||"",lc_ph:staff.lc_ph||"",lcc_overseen:staff.lcc_overseen||"",
    gradeLevel:staff.gradeLevel||"",gradePending:staff.gradePending!==false,
    approved:staff.approved,
    accountStatus:staff.accountStatus||(staff.approved?"active":"pending"),
    gender:staff.gender||"",nationality:staff.nationality||"Nigerian",
    stateOfOrigin:staff.stateOfOrigin||"",lga:staff.lga||"",tribe:staff.tribe||"",
    maritalStatus:staff.maritalStatus||"",address:staff.address||"",
    nokName:staff.nokName||"",nokRelation:staff.nokRelation||"",nokPhone:staff.nokPhone||"",nokAddress:staff.nokAddress||"",
    highestQualification:staff.highestQualification||"",institution:staff.institution||"",yearGraduated:staff.yearGraduated||"",otherQualifications:staff.otherQualifications||"",
  });
  const sf=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const initials=(form.name||staff.name).split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  const pick=dt=>{setUpl(dt);fref.current.click();};
  const pickPhoto=()=>{if(!canEdit)return;photoRef.current.click();};
  const onPhotoChange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=ev=>onUpdate(staff.id,{photo:ev.target.result});rd.readAsDataURL(f);e.target.value="";};
  const onChange=e=>{const f=e.target.files[0];if(!f||!upl)return;const rd=new FileReader();rd.onload=ev=>{const doc={name:f.name,type:f.type,size:(f.size/1024).toFixed(1)+" KB",data:ev.target.result,uploadedAt:new Date().toLocaleDateString("en-GB")};onUpdate(staff.id,{docs:{...staff.docs,[upl]:[...(staff.docs[upl]||[]),doc]}});setUpl(null);};rd.readAsDataURL(f);e.target.value="";};
  const dl=doc=>{const a=document.createElement("a");a.href=doc.data;a.download=doc.name;a.click();};
  const delDoc=(tid,idx)=>{const arr=[...(staff.docs[tid]||[])];arr.splice(idx,1);onUpdate(staff.id,{docs:{...staff.docs,[tid]:arr}});};
  const saveEdit=()=>{onUpdate(staff.id,form);setEditing(false);};
  const addCustomSection=()=>{if(!newSecLabel.trim())return;onUpdate(staff.id,{customDocSections:[...(staff.customDocSections||[]),{id:"cds_"+Date.now(),label:newSecLabel.trim()}]});setNewSecLabel("");setAddSection(false);};
  const canVerifyGrade=["personnel","secretary","ads"].includes(user.role);
  const canTransfer=["secretary","ads","personnel"].includes(user.role)&&staff.category==="pastor";
  const canAppointLO=["secretary","ads","personnel"].includes(user.role)&&staff.category==="pastor";
  const lccAlreadyHasLO = users ? getLOForLCC(users, staff.lcc) : null;
  const isAlreadyLO = !!staff.loAppointment?.active;
  const loGenEmail = staff.lcc ? loEmail(staff.lcc) : "";

  const ytr=yearsToRetire(form.dob,form.doj);

  return(
    <>
    <div className="overlay">
      <div className="modal" style={{maxWidth:720}}>
        <MH title={editing?"Editing: "+staff.name:staff.name} sub="Staff Profile" onClose={onClose}/>
        <input ref={fref} type="file" style={{display:"none"}} onChange={onChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"/>
        <input ref={photoRef} type="file" style={{display:"none"}} onChange={onPhotoChange} accept="image/*"/>
        <div style={{padding:24}}>

          {/* Retirement Alert */}
          {ytr!==null&&ytr<=5&&(
            <div className={ytr<=0?"alert-banner":"warn-banner"} style={{borderRadius:10,marginBottom:16}}>
              {ytr<=0?"🔴 RETIREMENT DUE — Please initiate retirement process immediately":`⚠️ ${ytr} year${ytr>1?"s":""} to retirement — Begin transition planning`}
            </div>
          )}

          {/* Profile Header */}
          <div style={{display:"flex",gap:20,alignItems:"center",marginBottom:24,padding:"18px 20px",background:"linear-gradient(135deg,#0b1f3a,#1a3a5c)",borderRadius:12,flexWrap:"wrap"}}>
            <div style={{position:"relative",flexShrink:0,cursor:canEdit?"pointer":"default"}} onClick={canEdit?pickPhoto:undefined}>
              {staff.photo?<img src={staff.photo} alt={staff.name} style={{width:72,height:72,borderRadius:"50%",objectFit:"cover",border:"3px solid #c9a84c",display:"block"}}/>
                :<div style={{width:72,height:72,background:"#c9a84c",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:24,fontWeight:700,fontFamily:"Georgia,serif"}}>{initials}</div>}
              {canEdit&&<div style={{position:"absolute",bottom:0,right:0,width:24,height:24,background:"#fff",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,boxShadow:"0 2px 8px rgba(0,0,0,0.2)",border:"2px solid #c9a84c"}}>📷</div>}
              {staff.photo&&<div style={{position:"absolute",top:0,left:0,width:24,height:24,background:"rgba(0,0,0,0.5)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,cursor:"pointer"}} onClick={e=>{e.stopPropagation();setLightbox({src:staff.photo,name:staff.name+" photo"});}}>🔍</div>}
            </div>
            <div style={{flex:1,minWidth:120}}>
              <div style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:18,fontWeight:700}}>{form.name}</div>
              <div style={{color:"#c9a84c",fontSize:12,marginTop:2}}>
                {staff.category==="pastor"?`⛪ ${form.rank}`:staff.category==="lo"?"🏘️ Local Overseer":`🏢 ${form.jobTitle||roleDisplay(staff.role)}`}
              </div>
              {staff.category==="pastor"&&<div style={{color:"rgba(255,255,255,0.45)",fontSize:11,marginTop:1}}>{form.lc_ph} · {form.lcc} LCC</div>}
              {staff.category==="lo"&&<div style={{color:"rgba(255,255,255,0.45)",fontSize:11,marginTop:1}}>Overseeing: {form.lcc_overseen} LCC</div>}
              <div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>
                {ytr!==null&&<RetirementBadge dob={form.dob} doj={form.doj}/>}
                <span style={{fontSize:11,padding:"3px 10px",borderRadius:10,fontWeight:700,color:form.approved?"#27ae60":"#e67e22",background:form.approved?"rgba(39,174,96,0.15)":"rgba(230,126,34,0.15)"}}>{form.approved?"● Active":"● Pending"}</span>
                {isAlreadyLO&&<span style={{fontSize:11,padding:"3px 10px",borderRadius:10,fontWeight:700,color:"#2980b9",background:"rgba(41,128,185,0.15)"}}>🏘️ Local Overseer — {staff.loAppointment.lcc_overseen} LCC</span>}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
              <div><div style={{fontSize:11,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:0.5}}>Staff ID</div><div style={{fontFamily:"Georgia,serif",color:"#c9a84c",fontSize:16,fontWeight:700}}>ECWA-{String(staff.id).padStart(4,"0")}</div></div>
              <div>
                <div style={{fontSize:11,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:0.5}}>Grade Level</div>
                <div style={{fontFamily:"Georgia,serif",color:form.gradePending?"#e67e22":"#c9a84c",fontSize:15,fontWeight:700}}>
                  {form.gradeLevel||"—"}{form.gradePending&&<span style={{fontSize:9,color:"#e67e22",marginLeft:4}}>PENDING</span>}
                </div>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",justifyContent:"flex-end"}}>
                {canEdit&&!editing&&<button className="btn btn-gold" style={{padding:"6px 14px",fontSize:12}} onClick={()=>setEditing(true)}>✏️ {isSelfEdit?"Fill My Bio Data":"Edit"}</button>}
                {canTransfer&&!transferMode&&<button className="btn btn-outline" style={{padding:"6px 14px",fontSize:12,color:"#c9a84c",borderColor:"#c9a84c"}} onClick={()=>setTransferMode(true)}>🔄 Transfer</button>}
                {canAppointLO&&!isAlreadyLO&&!lccAlreadyHasLO&&<button className="btn btn-outline" style={{padding:"6px 14px",fontSize:12,color:"#2980b9",borderColor:"#2980b9"}} onClick={()=>setLoMode(true)}>🏘️ Appoint as LO</button>}
                {canAppointLO&&!isAlreadyLO&&lccAlreadyHasLO&&lccAlreadyHasLO.id!==staff.id&&<span style={{fontSize:10,color:"rgba(255,255,255,0.3)",padding:"6px 0"}}>LCC already has an LO</span>}
                {canAppointLO&&isAlreadyLO&&<button className="btn btn-red" style={{padding:"6px 14px",fontSize:12}} onClick={()=>{if(window.confirm("Revoke LO appointment for "+staff.name+"?"))onUpdate(staff.id,{loAppointment:null});}}>Revoke LO</button>}
              </div>
            </div>
          </div>

          {/* LO Credentials Info */}
          {isAlreadyLO&&(
            <div style={{background:"#eaf4fb",border:"1.5px solid #2980b9",borderRadius:10,padding:"14px 18px",marginBottom:20}}>
              <div style={{fontSize:13,fontWeight:700,color:"#2980b9",marginBottom:8}}>🏘️ LO Login Credentials — {staff.loAppointment.lcc_overseen} LCC</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px 16px",fontSize:12}}>
                <div><span style={{color:"#888"}}>LO Email: </span><strong style={{color:"#0b1f3a"}}>{staff.loAppointment.email}</strong></div>
                <div><span style={{color:"#888"}}>Password: </span><strong style={{color:"#0b1f3a"}}>{staff.loAppointment.password}</strong></div>
                <div><span style={{color:"#888"}}>Appointed by: </span><strong>{staff.loAppointment.appointedBy||"Admin"}</strong></div>
                <div><span style={{color:"#888"}}>Date: </span><strong>{fdate(staff.loAppointment.appointedDate)}</strong></div>
              </div>
              <div style={{fontSize:11,color:"#2980b9",marginTop:8}}>ℹ️ The LO signs in with the email above to access their LCC's pastors and approve leave requests.</div>
            </div>
          )}

          {/* LO Appointment Panel */}
          {loMode&&(
            <div style={{background:"#eaf4fb",border:"2px solid #2980b9",borderRadius:12,padding:20,marginBottom:24}}>
              <div style={{fontSize:13,fontWeight:700,color:"#0b1f3a",marginBottom:6}}>🏘️ Appoint as Local Overseer</div>
              <div style={{fontSize:12,color:"#555",marginBottom:14,lineHeight:1.6}}>
                This will grant <strong>{staff.name}</strong> LO access for <strong>{staff.lcc} LCC</strong>.<br/>
                Login email will be: <strong style={{color:"#2980b9"}}>{loGenEmail}</strong>
              </div>
              <div style={{marginBottom:14}}>
                <label>Temporary Password *</label>
                <input type="password" placeholder="Set a temporary login password" value={loTempPw} onChange={e=>setLoTempPw(e.target.value)}/>
              </div>
              <div className="info-box" style={{marginBottom:14}}>ℹ️ The pastor will use the LO email and this password to sign in. Their personal pastor account remains unchanged.</div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn btn-outline" onClick={()=>{setLoMode(false);setLoTempPw("");}}>Cancel</button>
                <button className="btn btn-gold" disabled={!loTempPw||loTempPw.length<6} onClick={()=>{
                  onUpdate(staff.id,{loAppointment:{lcc_overseen:staff.lcc,email:loGenEmail,password:loTempPw,active:true,appointedBy:user.name,appointedDate:today()}});
                  setLoMode(false);setLoTempPw("");
                  setTimeout(()=>alert(`✅ LO Appointment Complete!\n\nShare these credentials with ${staff.name}:\n\n📧 Email: ${loGenEmail}\n🔐 Password: ${loTempPw}\n\nThey use this to sign in as LO and approve pastor leave requests.`),100);
                }}>Confirm Appointment →</button>
              </div>
            </div>
          )}

          {/* Transfer Panel */}
          {transferMode&&(
            <div style={{background:"#fef9ee",border:"2px solid #c9a84c",borderRadius:12,padding:20,marginBottom:24}}>
              <div style={{fontSize:13,fontWeight:700,color:"#0b1f3a",marginBottom:14}}>🔄 Transfer Pastor to Another LCC</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}}>
                <div>
                  <label>New LCC *</label>
                  <select value={newLcc} onChange={e=>{setNewLcc(e.target.value);setNewChurch("");}}>
                    <option value="">— Select LCC —</option>
                    {lccs.filter(l=>l!==form.lcc).map(l=><option key={l} value={l}>{l} LCC</option>)}
                  </select>
                </div>
                <div>
                  <label>New LC / Prayer House *</label>
                  <select value={newChurch} onChange={e=>setNewChurch(e.target.value)} disabled={!newLcc}>
                    <option value="">— Select Church —</option>
                    {(CHURCHES_BY_LCC[newLcc]||[]).map(c=><option key={c} value={c}>{c}</option>)}
                    <option value="__new__">+ Other (type below)</option>
                  </select>
                </div>
                {newChurch==="__new__"&&<div style={{gridColumn:"1/-1"}}><label>Church Name</label><input placeholder="Type church name..." value={newChurch==="__new__"?"":newChurch} onChange={e=>setNewChurch(e.target.value)}/></div>}
              </div>
              <div style={{marginBottom:12}}><label>Transfer Note</label><textarea rows={2} value={transferNote} onChange={e=>setTransferNote(e.target.value)} placeholder="Reason for transfer..." style={{resize:"vertical"}}/></div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn btn-outline" onClick={()=>setTransferMode(false)}>Cancel</button>
                <button className="btn btn-gold" disabled={!newLcc||!newChurch||newChurch==="__new__"} onClick={()=>{onTransfer(staff.id,newLcc,newChurch,transferNote);setTransferMode(false);}}>Confirm Transfer →</button>
              </div>
            </div>
          )}

          {/* Edit Panel */}
          {editing?(
            <div style={{background:"#f8f6f0",border:"2px solid #c9a84c",borderRadius:12,padding:20,marginBottom:24}}>
              <div style={{fontSize:13,fontWeight:700,color:"#0b1f3a",marginBottom:16}}>✏️ Edit Staff Details</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12}}>
                <div><label>Full Name</label><input value={form.name} onChange={sf("name")}/></div>
                <div><label>Email</label><input type="email" value={form.email} onChange={sf("email")} disabled={isSelfEdit} style={isSelfEdit?{background:"#f0f0f0",color:"#aaa"}:{}}/></div>
                <div><label>Phone</label><input value={form.phone} onChange={sf("phone")}/></div>
                <div><label>Date of Birth</label><input type="date" value={form.dob} onChange={sf("dob")}/></div>
                <div><label>Date of Employment</label><input type="date" value={form.doj} onChange={sf("doj")} disabled={isSelfEdit} style={isSelfEdit?{background:"#f0f0f0",color:"#aaa"}:{}} /></div>
                {staff.category==="office"&&canEditDetails&&<div><label>Department</label><select value={form.dept} onChange={sf("dept")}><option value="">— Select —</option>{DEPARTMENTS.map(d=><option key={d.id} value={d.id}>{d.label}</option>)}</select></div>}
                {staff.category==="office"&&canEditDetails&&<div><label>Job Title</label><select value={form.jobTitle} onChange={sf("jobTitle")}><option value="">— Select —</option>{OFFICE_ROLES.map(r=><option key={r.role} value={r.title}>{r.title}</option>)}</select></div>}
                {staff.category==="pastor"&&<>
                  <div><label>Rank</label><select value={form.rank} onChange={sf("rank")} disabled={isSelfEdit} style={isSelfEdit?{background:"#f0f0f0",color:"#aaa"}:{}}><option value="">— Select —</option>{PASTOR_RANKS.map(r=><option key={r} value={r}>{r}</option>)}</select></div>
                  <div><label>LCC</label><select value={form.lcc} onChange={sf("lcc")} disabled={isSelfEdit} style={isSelfEdit?{background:"#f0f0f0",color:"#aaa"}:{}}><option value="">— Select —</option>{lccs.map(l=><option key={l} value={l}>{l} LCC</option>)}</select></div>
                  <div style={{gridColumn:"1/-1"}}><label>LC / Prayer House</label><select value={form.lc_ph} onChange={sf("lc_ph")} disabled={isSelfEdit} style={isSelfEdit?{background:"#f0f0f0",color:"#aaa"}:{}}><option value="">— Select —</option>{(CHURCHES_BY_LCC[form.lcc]||[]).map(c=><option key={c} value={c}>{c}</option>)}<option value="__new__">+ Other</option></select></div>
                </>}
                {staff.category==="lo"&&<div><label>LCC Overseen</label><select value={form.lcc_overseen} onChange={sf("lcc_overseen")}><option value="">— Select —</option>{lccs.map(l=><option key={l} value={l}>{l} LCC</option>)}</select></div>}
                {canVerifyGrade&&<div><label>Grade Level (e.g. ESSH/2)</label><select value={form.gradeLevel} onChange={sf("gradeLevel")}><option value="">— Select —</option>{GRADE_LEVELS.flatMap(g=>Array.from({length:15},(_,i)=>`${g}/${i+1}`)).map(g=><option key={g} value={g}>{g}</option>)}</select></div>}
                {canVerifyGrade&&<div style={{display:"flex",alignItems:"flex-end",paddingBottom:8}}><div><input type="checkbox" id="gp" checked={!form.gradePending} onChange={e=>setForm(p=>({...p,gradePending:!e.target.checked}))} style={{width:"auto",marginRight:6}}/><label htmlFor="gp" style={{textTransform:"none",fontSize:12,color:"#27ae60",letterSpacing:0}}>✓ Grade Level Verified</label></div></div>}
                {canEditDetails&&<div style={{gridColumn:"1/-1"}}><label>Account Status</label><select value={form.accountStatus||"active"} onChange={e=>setForm(p=>({...p,accountStatus:e.target.value,approved:e.target.value==="active"}))}><option value="active">✅ Active — Can sign in</option><option value="pending">⏳ Pending — Awaiting approval</option><option value="deceased">🕊️ Deceased</option><option value="transferred">🔄 Transferred Out of DCC</option><option value="suspended">🚫 Suspended</option></select></div>}
                {isSelfEdit&&<div style={{gridColumn:"1/-1",background:"#eaf4fb",border:"1px solid #aed6f1",borderRadius:8,padding:"10px 14px",fontSize:12,color:"#2980b9"}}>ℹ️ Fields like Job Title, Department, Grade Level and Account Status can only be updated by the Personnel Officer.</div>}
                {/* Bio fields */}
                <div style={{gridColumn:"1/-1",marginTop:8,paddingTop:12,borderTop:"1px solid #e8e4dc",fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5}}>Personal Bio</div>
                <div><label>Gender</label><select value={form.gender} onChange={sf("gender")}><option value="">— Select —</option><option>Male</option><option>Female</option></select></div>
                <div><label>Marital Status</label><select value={form.maritalStatus} onChange={sf("maritalStatus")}><option value="">— Select —</option><option>Single</option><option>Married</option><option>Widowed</option><option>Divorced</option></select></div>
                <div><label>Nationality</label><input value={form.nationality} onChange={sf("nationality")} placeholder="e.g. Nigerian"/></div>
                <div><label>State of Origin</label><input value={form.stateOfOrigin} onChange={sf("stateOfOrigin")} placeholder="e.g. Nasarawa"/></div>
                <div><label>LGA</label><input value={form.lga} onChange={sf("lga")} placeholder="e.g. Lafia"/></div>
                <div><label>Tribe / Ethnicity</label><input value={form.tribe} onChange={sf("tribe")} placeholder="e.g. Eggon"/></div>
                <div style={{gridColumn:"1/-1"}}><label>Residential Address</label><input value={form.address} onChange={sf("address")} placeholder="Full residential address"/></div>
                <div style={{gridColumn:"1/-1",marginTop:8,paddingTop:12,borderTop:"1px solid #e8e4dc",fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5}}>Next of Kin</div>
                <div><label>NOK Name</label><input value={form.nokName} onChange={sf("nokName")}/></div>
                <div><label>Relationship</label><input value={form.nokRelation} onChange={sf("nokRelation")} placeholder="e.g. Spouse"/></div>
                <div><label>NOK Phone</label><input value={form.nokPhone} onChange={sf("nokPhone")}/></div>
                <div style={{gridColumn:"1/-1"}}><label>NOK Address</label><input value={form.nokAddress} onChange={sf("nokAddress")}/></div>
                <div style={{gridColumn:"1/-1",marginTop:8,paddingTop:12,borderTop:"1px solid #e8e4dc",fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5}}>Academic Qualifications</div>
                <div><label>Highest Qualification</label><input value={form.highestQualification} onChange={sf("highestQualification")} placeholder="e.g. B.Sc., B.Th."/></div>
                <div><label>Institution</label><input value={form.institution} onChange={sf("institution")}/></div>
                <div><label>Year Graduated</label><input value={form.yearGraduated} onChange={sf("yearGraduated")} placeholder="e.g. 2005"/></div>
                <div style={{gridColumn:"1/-1"}}><label>Other Qualifications</label><input value={form.otherQualifications} onChange={sf("otherQualifications")} placeholder="e.g. PGD, Masters, etc."/></div>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:16}}>
                <button className="btn btn-outline" onClick={()=>setEditing(false)}>Cancel</button>
                <button className="btn btn-gold" onClick={saveEdit}>💾 Save Changes</button>
              </div>
            </div>
          ):(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 24px",marginBottom:24,padding:"16px 18px",background:"#f8f6f0",borderRadius:10}}>
              {[
                ["📧 Email",form.email],
                ["📱 Phone",form.phone||"—"],
                ["🎂 Date of Birth",form.dob?fdate(form.dob):"—"],
                ["📅 Date of Employment",form.doj?fdate(form.doj):"—"],
                ["📊 Grade Level",form.gradeLevel?(form.gradePending?`${form.gradeLevel} (Pending)`:form.gradeLevel):"—"],
                ["⏳ Years of Service",form.doj?(getYOS(form.doj)+" years"):"—"],
                ...(staff.category==="office"?[["💼 Job Title",form.jobTitle||"—"],["🏢 Department",DEPARTMENTS.find(d=>d.id===form.dept)?.label||"—"]]:
                   staff.category==="pastor"?[["✝️ Rank",form.rank||"—"],["⛪ LC / PH",form.lc_ph||"—"],["📍 LCC",form.lcc?(form.lcc+" LCC"):"—"]]:
                   [["📍 LCC Overseen",form.lcc_overseen?(form.lcc_overseen+" LCC"):"—"]]),
                ["✅ Status",{active:"Active",pending:"Pending Approval",deceased:"Deceased 🕊️",transferred:"Transferred Out 🔄",suspended:"Suspended 🚫"}[form.accountStatus||( form.approved?"active":"pending")]||"—"],
              ].map(([k,v])=>(
                <div key={k}><div style={{fontSize:11,color:"#aaa",marginBottom:2}}>{k}</div><div style={{fontSize:13,fontWeight:600}}>{v}</div></div>
              ))}
            </div>
          )}

          {/* Signature section */}
          {(canEdit||staff.signatureImage)&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:10}}>✍️ Signature</div>
              {staff.signatureImage?(
                <div style={{display:"flex",alignItems:"center",gap:14,background:"#f8f6f0",borderRadius:10,padding:"12px 16px"}}>
                  <img src={staff.signatureImage} alt="Signature" style={{height:52,background:"#fff",border:"1px solid #e2ddd6",borderRadius:8,padding:4}}/>
                  <div>
                    <div style={{fontSize:12,color:"#27ae60",fontWeight:600}}>✅ Signature on file</div>
                    {canEdit&&<SigUpdater staffId={staff.id} onUpdate={onUpdate}/>}
                  </div>
                </div>
              ):canEdit?(
                <div style={{background:"#fff8e8",border:"1px dashed #c9a84c",borderRadius:10,padding:"14px 16px",textAlign:"center"}}>
                  <div style={{fontSize:12,color:"#e67e22",marginBottom:8}}>⚠️ No signature on file</div>
                  <SigUpdater staffId={staff.id} onUpdate={onUpdate}/>
                </div>
              ):null}
            </div>
          )}

          {/* Transfer History — pastors only */}
          {staff.category==="pastor"&&(
            <div style={{marginBottom:20}}>
              <div style={{fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>🔄 Transfer History</div>
              {(staff.transferHistory||[]).length===0?<div style={{fontSize:12,color:"#bbb",paddingBottom:4}}>No transfers on record.</div>:null}
              {(staff.transferHistory||[]).map((t,i)=>(
                <div key={i} style={{background:"#f8f6f0",borderRadius:8,padding:"8px 12px",marginBottom:6,fontSize:12}}>
                  <span style={{fontWeight:700}}>{fdate(t.date)}</span> — From <strong>{t.fromLcc} LCC · {t.fromChurch}</strong> to <strong>{t.toLcc} LCC · {t.toChurch}</strong>
                  {t.note&&<div style={{color:"#888",marginTop:2}}>"{t.note}"</div>}
                  <div style={{color:"#aaa",marginTop:1}}>By: {t.by}</div>
                </div>
              ))}
            </div>
          )}

          {/* Documents */}
          <div style={{fontSize:13,fontWeight:700,color:"#0b1f3a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:16}}>📁 Documents & Files</div>

          {/* Fixed doc types */}
          {DOC_TYPES_FIXED.map(dt=>{
            const files=staff.docs[dt.id]||[];
            return(
              <div key={dt.id} style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>{dt.icon}</span><span style={{fontSize:13,fontWeight:600}}>{dt.label}</span>
                    {dt.required&&<span style={{fontSize:10,color:"#c0392b",background:"#fdecea",padding:"2px 7px",borderRadius:10,fontWeight:600}}>Required</span>}
                    {files.length>0&&<span style={{fontSize:10,color:"#27ae60",background:"#eafbf0",padding:"2px 7px",borderRadius:10,fontWeight:600}}>{files.length} file{files.length>1?"s":""}</span>}
                  </div>
                  {canEdit&&<button className="btn btn-gold btn-sm" onClick={()=>pick(dt.id)}>+ Upload</button>}
                </div>
                <DocFileList files={files} canEdit={canEdit} onDl={dl} onDel={(idx)=>delDoc(dt.id,idx)} onPick={()=>pick(dt.id)} label={dt.label}/>
              </div>
            );
          })}

          {/* Custom document sections */}
          {(staff.customDocSections||[]).map(sec=>{
            const files=staff.docs[sec.id]||[];
            return(
              <div key={sec.id} style={{marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:16}}>📎</span><span style={{fontSize:13,fontWeight:600}}>{sec.label}</span>
                    {files.length>0&&<span style={{fontSize:10,color:"#27ae60",background:"#eafbf0",padding:"2px 7px",borderRadius:10,fontWeight:600}}>{files.length} file{files.length>1?"s":""}</span>}
                  </div>
                  {canEdit&&<button className="btn btn-gold btn-sm" onClick={()=>pick(sec.id)}>+ Upload</button>}
                </div>
                <DocFileList files={files} canEdit={canEdit} onDl={dl} onDel={(idx)=>delDoc(sec.id,idx)} onPick={()=>pick(sec.id)} label={sec.label}/>
              </div>
            );
          })}

          {/* Add custom section */}
          {canEdit&&(
            <div style={{marginBottom:20}}>
              {!addSection?(
                <button className="btn btn-outline btn-sm" onClick={()=>setAddSection(true)}>+ Add Document Section</button>
              ):(
                <div style={{background:"#f8f6f0",borderRadius:8,padding:14}}>
                  <div style={{fontSize:12,fontWeight:700,color:"#0b1f3a",marginBottom:8}}>New Document Section Name</div>
                  <div style={{display:"flex",gap:8}}>
                    <input placeholder="e.g. Medical Certificate, Guarantor Form..." value={newSecLabel} onChange={e=>setNewSecLabel(e.target.value)} style={{flex:1}}/>
                    <button className="btn btn-gold btn-sm" onClick={addCustomSection} disabled={!newSecLabel.trim()}>Add</button>
                    <button className="btn btn-outline btn-sm" onClick={()=>{setAddSection(false);setNewSecLabel("");}}>Cancel</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    {lightbox&&<Lightbox src={lightbox.src} name={lightbox.name} onClose={()=>setLightbox(null)}/>}
  </>
  );
}

function DocFileList({ files, canEdit, onDl, onDel, onPick, label }) {
  const [lightbox,setLightbox]=useState(null);
  const isViewable = doc => doc.type?.includes("image")||doc.type?.includes("pdf")||doc.data?.startsWith("data:image")||doc.data?.startsWith("data:application/pdf");
  if(files.length===0) return canEdit?(
    <div className="upload-box" onClick={onPick}><div style={{fontSize:28,marginBottom:6}}>📤</div><div style={{fontSize:12,color:"#aaa"}}>Click to upload {label.toLowerCase()}</div></div>
  ):(
    <div style={{padding:"12px 16px",background:"#f8f6f0",borderRadius:8,fontSize:12,color:"#bbb",textAlign:"center"}}>No files uploaded yet</div>
  );
  return(
    <>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {files.map((doc,idx)=>(
          <div key={idx} className="doc-row">
            <div style={{width:36,height:36,background:"#0b1f3a",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"#c9a84c",fontSize:16,flexShrink:0}}>{doc.type?.includes("pdf")?"📄":doc.type?.includes("image")?"🖼️":"📎"}</div>
            <div style={{flex:1,minWidth:0}}><div style={{fontSize:13,fontWeight:600,color:"#0b1f3a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{doc.name}</div><div style={{fontSize:11,color:"#aaa",marginTop:1}}>{doc.size} · {doc.uploadedAt}</div></div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              {isViewable(doc)&&<button className="btn btn-outline btn-sm" onClick={()=>setLightbox({src:doc.data,name:doc.name})}>👁 View</button>}
              <button className="btn btn-gold btn-sm" onClick={()=>onDl(doc)}>⬇</button>
              {canEdit&&<button className="btn btn-red btn-sm" onClick={()=>onDel(idx)}>🗑</button>}
            </div>
          </div>
        ))}
      </div>
      {lightbox&&<Lightbox src={lightbox.src} name={lightbox.name} onClose={()=>setLightbox(null)}/>}
    </>
  );
}

// ── Personnel Module ────────────────────────────────────────────────────────────
function PersonnelMod({ user, users, setUsers, lccs, toast }) {
  const isLO = user.role==="lo";
  // Only these roles get the full staff directory — everyone else sees only their own profile
  const ADMIN_ROLES = ["personnel","secretary","ads","chairman","vice_chairman"];
  const isAdmin = ADMIN_ROLES.includes(user.role);
  const isStaffOnly = !isAdmin && !isLO;

  const [q,setQ]=useState(""); const [rf,setRf]=useState("all"); const [sel,setSel]=useState(null);
  const myProfile=users.find(u=>u.id===user.id);

  const canEdit=s=>["personnel","secretary","ads","conf_secretary"].includes(user.role)||s.id===user.id;
  const canEditDetails=s=>["personnel","secretary","ads"].includes(user.role)||(["conf_secretary"].includes(user.role)&&s.id===user.id);

  const upd=(id,u2)=>{setUsers(us=>us.map(u=>u.id===id?{...u,...u2}:u));setSel(s=>s?{...s,...u2}:s);toast("✅ Profile updated.");};
  const transfer=(id,toLcc,toChurch,note)=>{
    setUsers(us=>us.map(u=>{
      if(u.id!==id)return u;
      const hist=[...(u.transferHistory||[]),{date:today(),fromLcc:u.lcc,fromChurch:u.lc_ph,toLcc,toChurch,note,by:user.name}];
      return{...u,lcc:toLcc,lc_ph:toChurch,transferHistory:hist};
    }));
    setSel(s=>s?{...s,lcc:toLcc,lc_ph:toChurch}:s);
    toast("✅ Pastor transferred successfully.");
  };

  // My profile view for basic staff / pastors
  if(isStaffOnly) return(
    <div>
      <div className="card fade-in" style={{padding:28,maxWidth:480,margin:"0 auto",textAlign:"center"}}>
        <div style={{fontSize:48,marginBottom:12}}>{user.category==="pastor"?"⛪":"👤"}</div>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:20,color:"#0b1f3a",marginBottom:6}}>My Profile</h2>
        <p style={{fontSize:13,color:"#888",marginBottom:20,lineHeight:1.6}}>View your profile, upload documents and track your retirement countdown.</p>
        {myProfile&&user.dob&&user.doj&&<div style={{marginBottom:16}}><RetirementBadge dob={user.dob} doj={user.doj}/></div>}
        <button className="btn btn-gold" style={{width:"100%",padding:"12px"}} onClick={()=>setSel(myProfile)}>Open My Profile →</button>
      </div>
      {sel&&<StaffProf staff={sel} user={user} users={users} canEdit={true} canEditDetails={false} lccs={lccs} onClose={()=>setSel(null)} onUpdate={upd} onTransfer={transfer}/>}
    </div>
  );

  // LO: only sees pastors in their LCC
  const visibleUsers = isLO
    ? users.filter(u=>u.category==="pastor"&&u.lcc===user.lcc_overseen)
    : users.filter(u=>matchFilter(u,q,rf));

  const officeStaff=visibleUsers.filter(u=>u.category==="office");
  const pastors    =visibleUsers.filter(u=>u.category==="pastor");
  const td=users.reduce((a,u)=>a+Object.values(u.docs||{}).flat().length,0);

  const retiringSoon=users.filter(u=>{const y=yearsToRetire(u.dob,u.doj);return y!==null&&y<=5;});

  const pendingAccounts = users.filter(u=>!u.approved);

  return(
    <div>
      {/* Pending approvals banner — only for admins */}
      {isAdmin && pendingAccounts.length>0&&(
        <div className="card" style={{marginBottom:18,padding:"16px 20px",borderLeft:"4px solid #e67e22"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:"#0b1f3a",marginBottom:12}}>⏳ Pending Account Approvals ({pendingAccounts.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {pendingAccounts.map(u=>(
              <div key={u.id} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"10px 12px",background:"#fef9ee",borderRadius:8,border:"1px solid #f5c542",flexWrap:"wrap"}}>
                <div style={{width:36,height:36,background:"#e67e22",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:13,fontWeight:700,flexShrink:0,marginTop:2}}>{u.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}</div>
                <div style={{flex:1,minWidth:140}}>
                  <div style={{fontWeight:700,fontSize:13,color:"#0b1f3a"}}>{u.name}</div>
                  <div style={{fontSize:11,color:"#888"}}>{u.email} · {u.category==="pastor"?u.rank:u.jobTitle||roleDisplay(u.role)}</div>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,marginTop:3,display:"inline-block",background:u.category==="pastor"?"#f5eefb":"#eaf4fb",color:u.category==="pastor"?"#8e44ad":"#2980b9"}}>{u.category==="pastor"?"⛪ Pastor":"🏢 Office Staff"}</span>
                </div>
                <div style={{display:"flex",gap:8,flexShrink:0,flexWrap:"wrap",alignItems:"center"}}>
                  <button className="btn btn-gold" style={{padding:"6px 16px",fontSize:12}} onClick={()=>{
                    upd(u.id,{approved:true});
                    sendApprovalEmail({
                      to_name: u.name,
                      to_email: u.email,
                      user_email: u.email,
                      user_password: "(your chosen password)",
                    });
                    toast("✅ Account approved. Login email sent to "+u.email);
                  }}>✅ Approve</button>
                  <button className="btn btn-outline" style={{padding:"6px 12px",fontSize:12}} onClick={()=>setSel(u)}>View Profile</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {retiringSoon.length>0&&(
        <div className="alert-banner" style={{borderRadius:10,marginBottom:16}}>
          ⚠️ {retiringSoon.length} staff member{retiringSoon.length>1?"s":""} retiring within 5 years — check profiles
        </div>
      )}
      {!isLO&&(
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12,marginBottom:22}}>
          <StatCard icon="👥" label="Total Staff" value={users.length} color="#0b1f3a"/>
          <StatCard icon="🏢" label="Office Staff" value={users.filter(u=>u.category==="office").length} color="#2980b9"/>
          <StatCard icon="⛪" label="Pastors" value={users.filter(u=>u.category==="pastor").length} color="#8e44ad"/>
          <StatCard icon="📁" label="Documents Filed" value={td} color="#27ae60"/>
          <StatCard icon="⚠️" label="Retiring Soon" value={retiringSoon.length} color="#e67e22"/>
        </div>
      )}
      <div className="card">
        <div style={{padding:"18px 20px",borderBottom:"1.5px solid #f0ede8"}}>
          <div style={{marginBottom:14}}><h2 style={{fontFamily:"Georgia,serif",fontSize:18,color:"#0b1f3a"}}>{isLO?`${user.lcc_overseen} LCC — Pastors`:"Staff Directory"}</h2><p style={{fontSize:12,color:"#888",marginTop:1}}>Click any staff member to view profile &amp; documents</p></div>
          {!isLO&&(
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <input placeholder="🔍  Search by name, email, LCC or department..." value={q} onChange={e=>setQ(e.target.value)} style={{flex:1,minWidth:200}}/>
              <select value={rf} onChange={e=>setRf(e.target.value)} style={{width:"auto",minWidth:180}}>
                <option value="all">All Categories</option>
                <option value="office">🏢 Office Staff</option>
                <option value="pastor">⛪ Pastors</option>
              </select>
            </div>
          )}
        </div>
        {isLO&&pastors.length===0&&<div style={{padding:48,textAlign:"center",color:"#bbb"}}><div style={{fontSize:36,marginBottom:10}}>⛪</div><div>No pastors in your LCC yet.</div></div>}
        {(isLO||rf==="all"||rf==="office")&&officeStaff.length>0&&<>
          <div className="section-hdr">🏢 Office Staff <span style={{fontSize:12,fontWeight:400,color:"rgba(201,168,76,0.7)"}}>({officeStaff.length})</span></div>
          <div style={{padding:"14px 20px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
            {officeStaff.map((s,i)=><StaffCard key={s.id} s={s} i={i} onClick={()=>setSel(s)}/>)}
          </div>
        </>}
        {(isLO||rf==="all"||rf==="pastor")&&pastors.length>0&&<>
          <div className="section-hdr">⛪ Pastors <span style={{fontSize:12,fontWeight:400,color:"rgba(201,168,76,0.7)"}}>({pastors.length})</span></div>
          <div style={{padding:"14px 20px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:12}}>
            {pastors.map((s,i)=><StaffCard key={s.id} s={s} i={i} onClick={()=>setSel(s)}/>)}
          </div>
        </>}
        {officeStaff.length===0&&pastors.length===0&&!isLO&&(
          <div style={{padding:48,textAlign:"center",color:"#bbb"}}><div style={{fontSize:36,marginBottom:10}}>🔍</div><div>No staff found</div></div>
        )}
      </div>
      {sel&&<StaffProf staff={sel} user={user} users={users} canEdit={canEdit(sel)} canEditDetails={canEditDetails(sel)} lccs={lccs} onClose={()=>setSel(null)} onUpdate={upd} onTransfer={transfer}/>}
    </div>
  );
}

function matchFilter(u,q,rf) {
  const qq=q.toLowerCase();
  const matchQ=!q||(u.name.toLowerCase().includes(qq)||u.email.toLowerCase().includes(qq)||(u.dept||"").toLowerCase().includes(qq)||(u.lcc||"").toLowerCase().includes(qq)||(u.jobTitle||"").toLowerCase().includes(qq));
  const matchRf=rf==="all"||u.category===rf;
  return matchQ&&matchRf;
}

function StaffCard({ s, i, onClick }) {
  const ini=s.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  const dc=Object.values(s.docs||{}).flat().length;
  const subtitle=s.category==="pastor"?`${s.rank||"Pastor"} · ${s.lcc||"—"} LCC`:s.jobTitle||s.dept||"—";
  const ytr=yearsToRetire(s.dob,s.doj);
  const isLO=s.loAppointment?.active;
  return(
    <div className="scard slide-in" style={{animationDelay:`${i*0.04}s`}} onClick={onClick}>
      <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:10}}>
        <div style={{width:46,height:46,borderRadius:"50%",flexShrink:0,overflow:"hidden",border:"2px solid",borderColor:isLO?"#2980b9":s.approved?"#c9a84c":"#e8e4dc"}}>
          {s.photo?<img src={s.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            :<div style={{width:"100%",height:"100%",background:isLO?"#2980b9":s.approved?"#0b1f3a":"#e8e4dc",display:"flex",alignItems:"center",justifyContent:"center",color:s.approved||isLO?"#c9a84c":"#aaa",fontSize:15,fontWeight:700,fontFamily:"Georgia,serif"}}>{ini}</div>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:13,fontWeight:700,color:"#0b1f3a",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.name}</div>
          <div style={{fontSize:11,color:"#888",marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{subtitle}</div>
          {isLO&&<div style={{fontSize:10,color:"#2980b9",fontWeight:700,marginTop:2}}>🏘️ LO — {s.loAppointment.lcc_overseen} LCC</div>}
        </div>
        {!s.approved&&<span style={{fontSize:10,color:"#e67e22",background:"#fef3e2",padding:"3px 8px",borderRadius:10,fontWeight:600,flexShrink:0}}>Pending</span>}
        {ytr!==null&&ytr<=5&&<span style={{fontSize:10,color:"#c0392b",background:"#fdecea",padding:"3px 8px",borderRadius:10,fontWeight:600,flexShrink:0}}>⚠️ {ytr}yr</span>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:8,borderTop:"1px solid #f0ede8"}}>
        <div style={{fontSize:11,color:s.gradePending?"#e67e22":"#888"}}>{s.gradeLevel?`GL: ${s.gradeLevel}${s.gradePending?" (Pending)":""}`:s.category==="office"?"No GL":""}</div>
        <span style={{fontSize:11,color:"#2980b9",fontWeight:600}}>{dc} doc{dc!==1?"s":""}</span>
      </div>
    </div>
  );
}

// ── Staff ID Card ──────────────────────────────────────────────────────────────
function IDCard({ staff, onClose }) {
  const initials = staff.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  return(
    <div className="overlay" style={{padding:0,alignItems:"flex-start",overflowY:"auto"}}>
      <div style={{background:"#fff",width:"100%",maxWidth:700,margin:"20px auto",borderRadius:16,boxShadow:"0 24px 60px rgba(11,31,58,0.3)",overflow:"hidden"}}>
        {/* Header bar */}
        <div style={{background:"#0b1f3a",padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center"}} className="no-print">
          <span style={{fontFamily:"Georgia,serif",color:"#c9a84c",fontSize:16,fontWeight:700}}>📋 Staff Bio Data</span>
          <div style={{display:"flex",gap:10}}>
            <button className="btn btn-gold" style={{padding:"6px 16px",fontSize:13}} onClick={()=>printElement("bio-print")}>🖨️ Print</button>
            <button className="btn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>

        {/* Printable content */}
        <div style={{padding:"28px 36px"}} id="bio-print">
          {/* Letterhead */}
          <div style={{textAlign:"center",borderBottom:"3px double #0b1f3a",paddingBottom:18,marginBottom:24}}>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16,marginBottom:8}}>
              <img src={LOGO} alt="ECWA" style={{width:70,height:70,borderRadius:"50%",objectFit:"cover",border:"2px solid #c9a84c"}}/>
              <div style={{textAlign:"left"}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:10,color:"#555",letterSpacing:1}}>EVANGELICAL CHURCH WINNING ALL</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:700,color:"#0b1f3a",lineHeight:1.2}}>ECWA Lafia District Church Council (LDCC)</div>
                <div style={{fontSize:11,color:"#666",marginTop:3}}>Beside New Tomatoes Market, P.O. Box 329, Shinge Road Lafia, Nasarawa State</div>
                <div style={{fontSize:11,color:"#555",marginTop:2}}>E-MAIL: lafiadcc@ecwang.org &nbsp;|&nbsp; Tel: 08166646683, 09053971264</div>
              </div>
            </div>
            <div style={{display:"inline-block",background:"#0b1f3a",color:"#c9a84c",padding:"3px 18px",borderRadius:20,fontSize:11,fontWeight:700,marginTop:8,letterSpacing:1}}>STAFF PERSONAL DATA FORM</div>
          </div>

          {/* Photo + ID */}
          <div style={{display:"flex",gap:24,marginBottom:24,alignItems:"flex-start"}}>
            <div style={{flexShrink:0,textAlign:"center"}}>
              <div style={{width:110,height:130,border:"2px solid #0b1f3a",borderRadius:6,overflow:"hidden",marginBottom:6,background:"#f0ede8",display:"flex",alignItems:"center",justifyContent:"center"}}>
                {staff.photo?<img src={staff.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                  :<div style={{fontFamily:"Georgia,serif",fontSize:28,fontWeight:700,color:"#0b1f3a"}}>{initials}</div>}
              </div>
              <div style={{fontSize:11,color:"#888"}}>Passport Photo</div>
            </div>
            <div style={{flex:1}}>
              <div style={{fontFamily:"Georgia,serif",fontSize:20,fontWeight:700,color:"#0b1f3a",marginBottom:4}}>{staff.name}</div>
              <div style={{fontSize:13,color:"#555",marginBottom:4}}>{staff.category==="pastor"?staff.rank:staff.jobTitle||roleDisplay(staff.role)}</div>
              <div style={{fontSize:12,color:"#888",marginBottom:10}}>{staff.category==="pastor"?`${staff.lcc} LCC · ${staff.lc_ph}`:DEPARTMENTS.find(d=>d.id===staff.dept)?.label||""}</div>
              <div style={{display:"flex",gap:16}}>
                <div style={{background:"#0b1f3a",color:"#c9a84c",padding:"6px 14px",borderRadius:8,fontSize:13,fontWeight:700,display:"inline-block"}}>ECWA-{String(staff.id).padStart(4,"0")}</div>
                {staff.gradeLevel&&<div style={{background:"#f8f6f0",color:staff.gradePending?"#e67e22":"#0b1f3a",padding:"6px 14px",borderRadius:8,fontSize:13,fontWeight:700,display:"inline-block",marginLeft:8}}>GL: {staff.gradeLevel}{staff.gradePending?" (Pending)":""}</div>}
              </div>
            </div>
          </div>

          {/* Bio Data Table */}
          {[
            ["PERSONAL INFORMATION", [
              ["Full Name", staff.name],
              ["Date of Birth", staff.dob?fdate(staff.dob):"—"],
              ["Age", staff.dob?getAge(staff.dob)+" years":"—"],
              ["Gender", staff.gender||"—"],
              ["Nationality", staff.nationality||"Nigerian"],
              ["State of Origin", staff.stateOfOrigin||"—"],
              ["LGA", staff.lga||"—"],
              ["Tribe / Ethnicity", staff.tribe||"—"],
              ["Religion", "Christianity"],
              ["Marital Status", staff.maritalStatus||"—"],
            ]],
            ["CONTACT INFORMATION", [
              ["Phone Number", staff.phone||"—"],
              ["Email Address", staff.email],
              ["Residential Address", staff.address||"—"],
            ]],
            ["EMPLOYMENT INFORMATION", [
              ["Staff ID", `ECWA-${String(staff.id).padStart(4,"0")}`],
              ["Category", staff.category==="pastor"?"Pastor":"Office Staff"],
              ["Job Title / Rank", staff.category==="pastor"?staff.rank:staff.jobTitle||roleDisplay(staff.role)],
              ["Department / LCC", staff.category==="pastor"?`${staff.lcc} LCC`:DEPARTMENTS.find(d=>d.id===staff.dept)?.label||"—"],
              ["LC / Prayer House", staff.lc_ph||"—"],
              ["Grade Level", staff.gradePending?`${staff.gradeLevel||"—"} (Pending)`:(staff.gradeLevel||"—")],
              ["Date of Employment", staff.doj?fdate(staff.doj):"—"],
              ["Years of Service", staff.doj?getYOS(staff.doj)+" years":"—"],
              ["Account Status", {active:"Active",pending:"Pending",deceased:"Deceased",transferred:"Transferred Out",suspended:"Suspended"}[staff.accountStatus||(staff.approved?"active":"pending")]],
            ]],
            ["NEXT OF KIN / EMERGENCY CONTACT", [
              ["Next of Kin Name", staff.nokName||"—"],
              ["Relationship", staff.nokRelation||"—"],
              ["Next of Kin Phone", staff.nokPhone||"—"],
              ["Next of Kin Address", staff.nokAddress||"—"],
            ]],
            ["ACADEMIC QUALIFICATIONS", [
              ["Highest Qualification", staff.highestQualification||"—"],
              ["Institution", staff.institution||"—"],
              ["Year Graduated", staff.yearGraduated||"—"],
              ["Other Qualifications", staff.otherQualifications||"—"],
            ]],
          ].map(([section, rows])=>(
            <div key={section} style={{marginBottom:20}}>
              <div style={{background:"#0b1f3a",color:"#c9a84c",padding:"6px 14px",fontSize:11,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:0,borderRadius:"4px 4px 0 0"}}>{section}</div>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                {rows.map(([k,v],i)=>(
                  <tr key={k} style={{background:i%2===0?"#f8f6f0":"#fff"}}>
                    <td style={{padding:"7px 12px",fontWeight:600,color:"#555",width:"35%",borderBottom:"1px solid #e8e4dc"}}>{k}</td>
                    <td style={{padding:"7px 12px",color:"#0b1f3a",fontWeight:500,borderBottom:"1px solid #e8e4dc"}}>{v}</td>
                  </tr>
                ))}
              </table>
            </div>
          ))}

          {/* Staff Signature on biodata */}
          {staff.signatureImage&&(
            <div style={{marginTop:24,paddingTop:16,borderTop:"1px solid #e8e4dc"}}>
              <div style={{fontSize:11,color:"#5a5a7a",fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>Staff Signature</div>
              <img src={staff.signatureImage} alt="Signature" style={{height:52,border:"1px solid #e2ddd6",borderRadius:6,background:"#fafaf8"}}/>
              <div style={{fontSize:10,color:"#888",marginTop:4}}>{staff.name} — {fdate(today())}</div>
            </div>
          )}
          <div style={{fontSize:10,color:"#aaa",textAlign:"center",marginTop:20,fontStyle:"italic",borderTop:"1px solid #e8e4dc",paddingTop:12}}>
            <div>All Correspondence should be addressed to the DCC Secretary</div>
            <div style={{marginTop:4}}>ECWA Lafia District Church Council · Generated {fdate(today())} · Confidential</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Announcements ──────────────────────────────────────────────────────────────
function AnnouncementsMod({ user, announcements, setAnnouncements, toast }) {
  const [form,setForm]=useState(false);
  const [f,setF]=useState({title:"",body:"",audience:"all"});
  const canPost = ["secretary","ads","conf_secretary","chairman","vice_chairman","personnel"].includes(user.role);

  const visible = announcements.filter(a=>{
    if(a.audience==="all") return true;
    if(a.audience==="office") return user.category==="office";
    if(a.audience==="pastor") return user.category==="pastor"||user.role==="lo";
    return true;
  });

  const markRead = id => setAnnouncements(as=>as.map(a=>a.id===id&&!a.readBy.includes(user.email)?{...a,readBy:[...a.readBy,user.email]}:a));
  const post = () => {
    if(!f.title||!f.body) return;
    const id="ANN-"+String(announcements.length+1).padStart(3,"0");
    setAnnouncements(a=>[{id,title:f.title,body:f.body,audience:f.audience,postedBy:user.name,postedByRole:roleDisplay(user.role),date:today(),readBy:[]}, ...a]);
    toast("✅ Announcement posted.");setForm(false);setF({title:"",body:"",audience:"all"});
  };

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
        <div><h2 style={{fontFamily:"Georgia,serif",fontSize:20,color:"#0b1f3a"}}>Notice Board</h2><p style={{fontSize:12,color:"#888",marginTop:2}}>DCC announcements and notices</p></div>
        {canPost&&<button className="btn btn-gold" onClick={()=>setForm(true)}>+ Post Announcement</button>}
      </div>
      {visible.length===0&&<div className="card" style={{padding:48,textAlign:"center",color:"#bbb"}}><div style={{fontSize:36,marginBottom:10}}>📢</div><div>No announcements yet.</div></div>}
      {visible.map((a,i)=>{
        const read = a.readBy.includes(user.email);
        return(
          <div key={a.id} className="card fade-in" style={{marginBottom:14,border:`2px solid ${read?"transparent":"#c9a84c"}`,animationDelay:`${i*0.05}s`}} onClick={()=>markRead(a.id)}>
            <div style={{padding:"16px 20px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:8,marginBottom:10}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginBottom:4}}>
                    {!read&&<span style={{width:8,height:8,background:"#c9a84c",borderRadius:"50%",display:"inline-block",flexShrink:0}}/>}
                    <span style={{fontFamily:"Georgia,serif",fontSize:16,fontWeight:700,color:"#0b1f3a"}}>{a.title}</span>
                    <span style={{fontSize:10,padding:"2px 8px",borderRadius:10,background:a.audience==="all"?"#eafbf0":a.audience==="office"?"#eaf4fb":"#f5eefb",color:a.audience==="all"?"#27ae60":a.audience==="office"?"#2980b9":"#8e44ad",fontWeight:600}}>{a.audience==="all"?"Everyone":a.audience==="office"?"Office Staff":"Pastors & LOs"}</span>
                  </div>
                  <p style={{fontSize:13,color:"#555",lineHeight:1.7}}>{a.body}</p>
                </div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:"1px solid #f0ede8"}}>
                <div style={{fontSize:11,color:"#aaa"}}>📌 {a.postedBy} · {a.postedByRole} · {fdate(a.date)}</div>
                <div style={{fontSize:11,color:"#bbb"}}>{a.readBy.length} read</div>
              </div>
            </div>
          </div>
        );
      })}
      {form&&(
        <div className="overlay">
          <div className="modal" style={{maxWidth:540}}>
            <MH title="Post Announcement" sub="Notice Board" onClose={()=>setForm(false)}/>
            <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:14}}>
              <div><label>Title *</label><input placeholder="e.g. DCC General Meeting" value={f.title} onChange={e=>setF(p=>({...p,title:e.target.value}))}/></div>
              <div><label>Message *</label><textarea rows={5} placeholder="Type your announcement..." value={f.body} onChange={e=>setF(p=>({...p,body:e.target.value}))} style={{resize:"vertical"}}/></div>
              <div><label>Audience</label>
                <select value={f.audience} onChange={e=>setF(p=>({...p,audience:e.target.value}))}>
                  <option value="all">Everyone (All Staff, Pastors & LOs)</option>
                  <option value="office">Office Staff Only</option>
                  <option value="pastor">Pastors & LOs Only</option>
                </select>
              </div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn btn-outline" onClick={()=>setForm(false)}>Cancel</button>
                <button className="btn btn-gold" disabled={!f.title||!f.body} onClick={post}>Post Announcement →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Attendance Module ──────────────────────────────────────────────────────────
function AttendanceMod({ user, users, attendance, setAttendance, leaves, toast }) {
  const [now, setNow] = useState(new Date());
  const [reportForm, setReportForm] = useState(false);
  const [rep, setRep] = useState({achievements:"",challenges:"",tomorrowPlan:""});
  const [weekOffset, setWeekOffset] = useState(0);
  const [selRecord, setSelRecord] = useState(null);
  const [adminClose, setAdminClose] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [viewDept, setViewDept] = useState("all");

  useEffect(()=>{const t=setInterval(()=>setNow(new Date()),1000);return()=>clearInterval(t);},[]);

  const todayStr = now.toISOString().split("T")[0];
  const timeStr  = now.toTimeString().slice(0,5);
  const dow      = now.getDay();
  const isWorkday= dow>0&&dow<6;
  const isHoliday= PUBLIC_HOLIDAYS_2026.find(h=>h.date===todayStr);

  const myTodayRecord = attendance.find(r=>r.userId===user.id&&r.date===todayStr);
  const isClockedIn   = myTodayRecord?.clockIn&&!myTodayRecord?.clockOut;
  const isClockedOut  = myTodayRecord?.clockOut;

  // Check if on leave today
  const onLeaveToday = leaves.find(l=>l.requesterEmail===user.email&&l.status==="approved"&&l.startDate<=todayStr&&l.endDate>=todayStr);

  const clockIn = () => {
    const id="ATT-"+String(attendance.length+1).padStart(3,"0");
    setAttendance(a=>[...a,{id,userId:user.id,userEmail:user.email,userName:user.name,dept:user.dept,date:todayStr,clockIn:timeStr,clockOut:null,dailyReport:null,reportReadBy:[],adminClosed:false,adminNote:""}]);
    toast("✅ Clocked in at "+timeStr);
  };

  const clockOut = () => {
    // Chairman, Vice Chairman and Secretary clock out directly — no daily report required
    if(["chairman","vice_chairman","secretary","ads"].includes(user.role)){
      const timeStr2=new Date().toTimeString().slice(0,5);
      setAttendance(a=>a.map(r=>r.userId===user.id&&r.date===todayStr?{...r,clockOut:timeStr2}:r));
      toast("✅ Clocked out at "+timeStr2);
    } else {
      setReportForm(true);
    }
  };

  const submitClockOut = () => {
    if(!rep.achievements.trim()||!rep.challenges.trim()){toast("Please fill in Achievements and Challenges before submitting.","danger");return;}
    setAttendance(a=>a.map(r=>r.userId===user.id&&r.date===todayStr?{...r,clockOut:timeStr,dailyReport:rep}:r));
    toast("✅ Clocked out at "+timeStr+". Daily report submitted.");
    setReportForm(false); setRep({achievements:"",challenges:"",tomorrowPlan:""});
  };

  // Weekly grid — get dates for current week + offset
  const getWeekDates = (offset=0) => {
    const d = new Date();
    const day = d.getDay()||7;
    d.setDate(d.getDate()-day+1+(offset*7));
    return Array.from({length:5},(_,i)=>{const dd=new Date(d);dd.setDate(d.getDate()+i);return dd.toISOString().split("T")[0];});
  };
  const weekDates = getWeekDates(weekOffset);
  const weekLabel = `${fdate(weekDates[0])} – ${fdate(weekDates[4])}`;

  // Admin & Personnel view — all staff
  const isAdmin = ["secretary","ads","conf_secretary","chairman","vice_chairman","personnel"].includes(user.role);
  const isDeptHead = ["accountant","ems_coordinator","auditor","lecturer"].includes(user.role);
  const canSeeTeam = isAdmin||isDeptHead;

  // Who can read daily reports: dept heads (own dept), secretary, ads, personnel, chairman
  // (used implicitly via canSeeTeam — team view shows reports to all who canSeeTeam)

  const teamUsers = isAdmin
    ? users.filter(u=>u.category==="office"&&(viewDept==="all"||u.dept===viewDept))
    : isDeptHead
    ? users.filter(u=>u.category==="office"&&u.id!==user.id)
    : [];

  const doAdminClose = () => {
    setAttendance(a=>a.map(r=>r.id===adminClose.id?{...r,clockOut:timeStr,adminClosed:true,adminNote}:r));
    toast("Record closed with admin note.");setAdminClose(null);setAdminNote("");
  };

  // My history
  const myHistory = attendance.filter(r=>r.userId===user.id).sort((a,b)=>b.date.localeCompare(a.date));

  return(
    <div>
      {/* Info: who can see clock-out reports */}
      {!canSeeTeam&&(
        <div style={{background:"#eaf4fb",border:"1px solid #aed6f1",borderRadius:10,padding:"10px 16px",marginBottom:16,fontSize:12,color:"#2980b9",display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:18}}>ℹ️</span>
          <span>Your daily clock-out reports are visible to your <strong>Department Head</strong>, <strong>Admin & Personnel</strong>, <strong>Secretary</strong>, and <strong>Chairman</strong>.</span>
        </div>
      )}
      {/* Today's clock widget */}
      <div className="card" style={{marginBottom:20,background:"linear-gradient(135deg,#0b1f3a,#1a3a5c)",overflow:"visible"}}>
        <div style={{padding:"24px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:16}}>
          <div>
            <div style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:28,fontWeight:700,letterSpacing:1}}>{now.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}</div>
            <div style={{color:"#c9a84c",fontSize:13,marginTop:4}}>{now.toLocaleDateString("en-GB",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}</div>
            {isHoliday&&<div style={{marginTop:6,background:"rgba(142,68,173,0.2)",color:"#c39bd3",padding:"4px 12px",borderRadius:10,fontSize:12,fontWeight:600,display:"inline-block"}}>🎉 {isHoliday.name}</div>}
            {onLeaveToday&&<div style={{marginTop:6,background:"rgba(41,128,185,0.2)",color:"#85c1e9",padding:"4px 12px",borderRadius:10,fontSize:12,fontWeight:600,display:"inline-block"}}>🏖️ You are on {onLeaveToday.type}</div>}
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10}}>
            {myTodayRecord?.clockIn&&<div style={{color:"rgba(255,255,255,0.6)",fontSize:12}}>Clocked in: <strong style={{color:"#c9a84c"}}>{myTodayRecord.clockIn}</strong>{myTodayRecord.adminClosed&&<span style={{color:"#e67e22",marginLeft:6,fontSize:10}}>(Admin closed)</span>}</div>}
            {myTodayRecord?.clockOut&&<div style={{color:"rgba(255,255,255,0.6)",fontSize:12}}>Clocked out: <strong style={{color:"#c9a84c"}}>{myTodayRecord.clockOut}</strong></div>}
            {!isHoliday&&!onLeaveToday&&isWorkday&&!isClockedOut&&(
              isClockedIn
                ?<button className="btn btn-red" onClick={clockOut}>🔴 Clock Out & Submit Report</button>
                :!myTodayRecord&&<button className="btn btn-gold" onClick={clockIn}>🟢 Clock In</button>
            )}
            {(isHoliday||!isWorkday)&&<div style={{color:"rgba(255,255,255,0.4)",fontSize:12}}>No attendance required today</div>}
          </div>
        </div>
        {myTodayRecord&&(
          <div style={{padding:"12px 28px",borderTop:"1px solid rgba(255,255,255,0.08)",display:"flex",gap:20,flexWrap:"wrap"}}>
            {[["Status", myTodayRecord.clockIn?(myTodayRecord.clockIn<="08:15"?"✅ On Time":"⏰ Late"):"⏳ Not yet"],
              ["Clock In", myTodayRecord.clockIn||"—"],
              ["Clock Out", myTodayRecord.clockOut||"Pending"],
              ["Report", myTodayRecord.dailyReport?"✅ Submitted":"⏳ Pending"],
            ].map(([k,v])=>(
              <div key={k}><div style={{fontSize:10,color:"rgba(255,255,255,0.35)",textTransform:"uppercase",letterSpacing:0.5}}>{k}</div><div style={{fontSize:13,color:"#fff",fontWeight:600,marginTop:2}}>{v}</div></div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly grid */}
      <div className="card" style={{marginBottom:20}}>
        <div style={{padding:"16px 20px",borderBottom:"1.5px solid #f0ede8",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
          <h3 style={{fontFamily:"Georgia,serif",fontSize:16,color:"#0b1f3a"}}>My Week — {weekLabel}</h3>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-outline btn-sm" onClick={()=>setWeekOffset(w=>w-1)}>← Prev</button>
            <button className="btn btn-outline btn-sm" onClick={()=>setWeekOffset(0)}>This Week</button>
            <button className="btn btn-outline btn-sm" disabled={weekOffset>=0} onClick={()=>setWeekOffset(w=>w+1)}>Next →</button>
          </div>
        </div>
        <div style={{padding:"16px 20px",display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:10}}>
          {weekDates.map(d=>{
            const status = getAttStatus(d,[...attendance],leaves,user.id);
            const rec = attendance.find(r=>r.userId===user.id&&r.date===d);
            const st = ATT_STYLE[status];
            const ph = PUBLIC_HOLIDAYS_2026.find(h=>h.date===d);
            return(
              <div key={d} className={`scard ${rec?"":"" }`} style={{padding:12,cursor:rec?"pointer":"default",border:`1.5px solid ${status==="present"?"#c9a84c":status==="absent"?"#f5c6c2":status==="late"?"#f5c542":"#e8e4dc"}`}} onClick={()=>rec&&setSelRecord(rec)}>
                <div style={{fontSize:10,color:"#aaa",marginBottom:4}}>{new Date(d+"T12:00:00").toLocaleDateString("en-GB",{weekday:"short"})}</div>
                <div style={{fontSize:12,fontWeight:600,color:"#0b1f3a",marginBottom:6}}>{new Date(d+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</div>
                <span className={`badge ${st.cls}`} style={{fontSize:10,padding:"2px 8px"}}>{st.icon} {st.label}</span>
                {ph&&<div style={{fontSize:9,color:"#8e44ad",marginTop:4,lineHeight:1.3}}>{ph.name}</div>}
                {rec?.clockIn&&<div style={{fontSize:10,color:"#888",marginTop:4}}>In: {rec.clockIn}{rec.clockOut?` · Out: ${rec.clockOut}`:""}</div>}
                {rec?.dailyReport&&<div style={{fontSize:9,color:"#27ae60",marginTop:2}}>📋 Report filed</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Team view for heads/admin */}
      {canSeeTeam&&(
        <div className="card" style={{marginBottom:20}}>
          <div style={{padding:"16px 20px",borderBottom:"1.5px solid #f0ede8",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
            <h3 style={{fontFamily:"Georgia,serif",fontSize:16,color:"#0b1f3a"}}>Team Attendance — {weekLabel}</h3>
            {isAdmin&&(
              <select value={viewDept} onChange={e=>setViewDept(e.target.value)} style={{width:"auto",minWidth:180}}>
                <option value="all">All Departments</option>
                {DEPARTMENTS.map(d=><option key={d.id} value={d.id}>{d.label}</option>)}
              </select>
            )}
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
              <thead>
                <tr style={{background:"#f8f6f0"}}>
                  <td style={{padding:"10px 16px",fontSize:12,fontWeight:700,color:"#5a5a7a",width:180}}>Staff</td>
                  {weekDates.map(d=>(
                    <td key={d} style={{padding:"10px 8px",fontSize:11,fontWeight:700,color:"#5a5a7a",textAlign:"center"}}>
                      {new Date(d+"T12:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric"})}
                    </td>
                  ))}
                </tr>
              </thead>
              <tbody>
                {teamUsers.map(u=>(
                  <tr key={u.id} className="trow">
                    <td style={{padding:"10px 16px"}}>
                      <div style={{fontSize:13,fontWeight:600,color:"#0b1f3a"}}>{u.name}</div>
                      <div style={{fontSize:10,color:"#aaa"}}>{roleDisplay(u.role)}</div>
                    </td>
                    {weekDates.map(d=>{
                      const status=getAttStatus(d,attendance,leaves,u.id);
                      const rec=attendance.find(r=>r.userId===u.id&&r.date===d);
                      const st=ATT_STYLE[status];
                      return(
                        <td key={d} style={{padding:"8px",textAlign:"center"}}>
                          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                            <span className={`badge ${st.cls}`} style={{fontSize:9,padding:"2px 6px"}}>{st.icon}</span>
                            {rec?.dailyReport?<span style={{fontSize:9,color:"#27ae60",cursor:"pointer",textDecoration:"underline",marginTop:2,display:"block"}} onClick={()=>setSelRecord(rec)}>📋 View{(rec.acks||[]).length>0?` ✅${rec.acks.length}`:""}{(rec.comments||[]).length>0?` 💬${rec.comments.length}`:""}</span>:<span style={{fontSize:9,color:"#ddd"}}>—</span>}
                            {rec&&!rec.clockOut&&!rec.adminClosed&&isAdmin&&(
                              <button style={{fontSize:9,background:"#fef3e2",color:"#e67e22",border:"none",borderRadius:4,padding:"1px 5px",cursor:"pointer"}} onClick={()=>{setAdminClose(rec);setAdminNote("");}}>Fix</button>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{padding:"10px 16px",background:"#f8f6f0",display:"flex",gap:16,flexWrap:"wrap"}}>
            {Object.entries(ATT_STYLE).filter(([k])=>k!=="weekend").map(([k,v])=>(
              <span key={k} className={`badge ${v.cls}`} style={{fontSize:10}}>{v.icon} {v.label}</span>
            ))}
            <span style={{fontSize:10,color:"#27ae60"}}>📋 = Report submitted</span>
          </div>
        </div>
      )}

      {/* Recent history */}
      {myHistory.length>0&&(
        <div className="card">
          <div className="section-hdr">📅 My Attendance History</div>
          {myHistory.slice(0,20).map((r,i)=>{
            const status=r.clockIn?(r.clockIn<="08:15"?"present":"late"):"absent";
            const st=ATT_STYLE[status];
            return(
              <div key={r.id} className="trow slide-in" style={{padding:"12px 20px",borderBottom:"1px solid #f5f3ef",display:"flex",alignItems:"center",gap:14,cursor:"pointer",animationDelay:`${i*0.03}s`}} onClick={()=>setSelRecord(r)}>
                <span className={`badge ${st.cls}`} style={{flexShrink:0,fontSize:11}}>{st.icon} {st.label}</span>
                <div style={{flex:1}}>
                  <div style={{fontSize:13,fontWeight:600,color:"#0b1f3a"}}>{fdate(r.date)}</div>
                  <div style={{fontSize:11,color:"#888",marginTop:1}}>In: {r.clockIn||"—"} · Out: {r.clockOut||"—"} {r.adminClosed&&"(Admin closed)"}</div>
                </div>
                {r.dailyReport?<span style={{fontSize:11,color:"#27ae60",fontWeight:600}}>📋 Report filed</span>:<span style={{fontSize:11,color:"#ddd"}}>No report</span>}
                <div style={{color:"#ddd",fontSize:18}}>›</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Daily report form (clock-out) */}
      {reportForm&&(
        <div className="overlay">
          <div className="modal" style={{maxWidth:520}}>
            <MH title="Daily Report" sub="Clock Out" onClose={()=>setReportForm(false)}/>
            <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:14}}>
              <div className="info-box">📋 Please fill your end-of-day report before clocking out. This is sent to your dept head and Admin & Personnel.</div>
              <div><label>✅ Achievements Today *</label><textarea rows={3} value={rep.achievements} onChange={e=>setRep(p=>({...p,achievements:e.target.value}))} placeholder="What did you accomplish today?" style={{resize:"vertical"}}/></div>
              <div><label>⚠️ Challenges *</label><textarea rows={2} value={rep.challenges} onChange={e=>setRep(p=>({...p,challenges:e.target.value}))} placeholder="Any blockers or issues?" style={{resize:"vertical"}}/></div>
              <div><label>📅 Tomorrow's Plan (optional)</label><textarea rows={2} value={rep.tomorrowPlan} onChange={e=>setRep(p=>({...p,tomorrowPlan:e.target.value}))} placeholder="What's your plan for tomorrow?" style={{resize:"vertical"}}/></div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn btn-outline" onClick={()=>setReportForm(false)}>Cancel</button>
                <button className="btn btn-gold" disabled={!rep.achievements||!rep.challenges} onClick={submitClockOut}>🔴 Clock Out & Submit →</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Record detail modal */}
      {selRecord&&<AttRecordDetail record={selRecord} user={user} canRespond={canSeeTeam} onClose={()=>setSelRecord(null)}
        onAck={(id,ack)=>{setAttendance(a=>a.map(r=>r.id===id?{...r,acks:[...(r.acks||[]),ack]}:r));setSelRecord(s=>s?{...s,acks:[...(s.acks||[]),ack]}:s);toast("✅ Report acknowledged.");}}
        onComment={(id,c)=>{setAttendance(a=>a.map(r=>r.id===id?{...r,comments:[...(r.comments||[]),c]}:r));setSelRecord(s=>s?{...s,comments:[...(s.comments||[]),c]}:s);toast("Comment sent.");}}
      />}

      {/* Admin close modal */}
      {adminClose&&(
        <div className="overlay">
          <div className="modal" style={{maxWidth:440}}>
            <MH title="Close Attendance Record" sub="Admin Action" onClose={()=>setAdminClose(null)}/>
            <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:14}}>
              <div className="info-box">Closing attendance for <strong>{adminClose.userName}</strong> on {fdate(adminClose.date)}. Current clock-in: <strong>{adminClose.clockIn}</strong>.</div>
              <div><label>Admin Note (reason for manual close) *</label><textarea rows={3} value={adminNote} onChange={e=>setAdminNote(e.target.value)} placeholder="e.g. Staff forgot to clock out. Confirmed departed at 16:00." style={{resize:"vertical"}}/></div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn btn-outline" onClick={()=>setAdminClose(null)}>Cancel</button>
                <button className="btn btn-gold" disabled={!adminNote.trim()} onClick={doAdminClose}>Confirm Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AttRecordDetail({ record, user, canRespond, onClose, onAck, onComment }) {
  const [commentText,setCommentText]=useState("");
  const [showCommentBox,setShowCommentBox]=useState(false);
  const alreadyAcked = (record.acks||[]).some(a=>a.email===user.email);
  const myComment = (record.comments||[]).find(c=>c.email===user.email);
  return(
    <div className="overlay">
      <div className="modal" style={{maxWidth:540}}>
        <MH title={`Attendance — ${fdate(record.date)}`} sub={record.userName} onClose={onClose}/>
        <div style={{padding:"22px 24px"}}>
          {/* Clock stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px 24px",background:"#f8f6f0",borderRadius:10,padding:"14px 18px",marginBottom:18}}>
            {[["🕗 Clock In",record.clockIn||"—"],["🕓 Clock Out",record.clockOut||(record.adminClosed?"Admin closed":"Still in")],["📊 Status",record.clockIn?(record.clockIn<="08:15"?"✅ On Time":"⏰ Late"):"❌ Absent"],["📅 Date",fdate(record.date)]].map(([k,v])=>(
              <div key={k}><div style={{fontSize:11,color:"#aaa",marginBottom:2}}>{k}</div><div style={{fontSize:13,fontWeight:600}}>{v}</div></div>
            ))}
            {record.adminClosed&&<div style={{gridColumn:"1/-1"}}><div style={{fontSize:11,color:"#aaa",marginBottom:2}}>🔧 Admin Note</div><div style={{fontSize:13,color:"#e67e22"}}>{record.adminNote}</div></div>}
          </div>

          {/* Daily Report */}
          {record.dailyReport?(
            <div style={{marginBottom:18}}>
              <div style={{fontSize:12,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:12}}>📋 Daily Report</div>
              {[["✅ Achievements",record.dailyReport.achievements],["⚠️ Challenges",record.dailyReport.challenges],["📅 Tomorrow's Plan",record.dailyReport.tomorrowPlan]].filter(([,v])=>v).map(([k,v])=>(
                <div key={k} style={{background:"#f8f6f0",borderLeft:"3px solid #c9a84c",borderRadius:6,padding:"10px 14px",marginBottom:10}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#c9a84c",marginBottom:4}}>{k}</div>
                  <div style={{fontSize:13,color:"#555",lineHeight:1.6}}>{v}</div>
                </div>
              ))}

              {/* Acknowledgements */}
              {canRespond&&(
                <div style={{marginTop:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>👁 Acknowledgements</div>
                  {(record.acks||[]).length===0&&<div style={{fontSize:12,color:"#bbb",marginBottom:8}}>No acknowledgements yet.</div>}
                  {(record.acks||[]).map((a,i)=>(
                    <div key={i} style={{display:"flex",gap:8,alignItems:"center",marginBottom:6}}>
                      <span style={{background:"#eafbf0",color:"#27ae60",fontSize:11,fontWeight:700,padding:"2px 10px",borderRadius:10}}>✅ {a.name}</span>
                      <span style={{fontSize:10,color:"#aaa"}}>{a.role} · {fdate(a.date)}</span>
                    </div>
                  ))}
                  {!alreadyAcked&&(
                    <button className="btn btn-outline btn-sm" style={{color:"#27ae60",borderColor:"#27ae60",marginTop:4}} onClick={()=>onAck(record.id,{name:user.name,role:roleDisplay(user.role),email:user.email,date:today()})}>
                      ✅ Acknowledge Report
                    </button>
                  )}
                </div>
              )}

              {/* Comments */}
              {canRespond&&(
                <div style={{marginTop:14}}>
                  <div style={{fontSize:11,fontWeight:700,color:"#5a5a7a",textTransform:"uppercase",letterSpacing:0.5,marginBottom:8}}>💬 Comments</div>
                  {(record.comments||[]).length===0&&<div style={{fontSize:12,color:"#bbb",marginBottom:8}}>No comments yet.</div>}
                  {(record.comments||[]).map((c,i)=>(
                    <div key={i} style={{background:"#f0f9ff",border:"1px solid #aed6f1",borderRadius:8,padding:"8px 12px",marginBottom:8}}>
                      <div style={{fontSize:11,fontWeight:700,color:"#2980b9"}}>{c.name} <span style={{color:"#aaa",fontWeight:400}}>· {c.role} · {fdate(c.date)}</span></div>
                      <div style={{fontSize:13,color:"#333",marginTop:3}}>{c.text}</div>
                    </div>
                  ))}
                  {!showCommentBox&&(
                    <button className="btn btn-outline btn-sm" onClick={()=>setShowCommentBox(true)}>💬 {myComment?"Add Another Comment":"Add Comment"}</button>
                  )}
                  {showCommentBox&&(
                    <div style={{marginTop:8}}>
                      <textarea rows={2} value={commentText} onChange={e=>setCommentText(e.target.value)} placeholder="Write your comment..." style={{resize:"vertical",marginBottom:8}}/>
                      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                        <button className="btn btn-outline btn-sm" onClick={()=>{setShowCommentBox(false);setCommentText("");}}>Cancel</button>
                        <button className="btn btn-gold btn-sm" disabled={!commentText.trim()} onClick={()=>{onComment(record.id,{name:user.name,role:roleDisplay(user.role),email:user.email,text:commentText.trim(),date:today()});setShowCommentBox(false);setCommentText("");}}>Send</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ):<div style={{background:"#f8f6f0",borderRadius:8,padding:"12px 14px",textAlign:"center",color:"#bbb",fontSize:13}}>No daily report filed for this day.</div>}
        </div>
      </div>
    </div>
  );
}

// ── Password Reset Flow ────────────────────────────────────────────────────────
function ForgotPassword({ users, pwdReqs, setPwdReqs, onBack }) {
  const [email,setEmail]=useState(""); const [sent,setSent]=useState(false); const [er,setEr]=useState("");
  const submit=()=>{
    setEr("");
    if(!email){setEr("Please enter your email.");return;}
    const u=users.find(u=>u.email.toLowerCase()===email.toLowerCase());
    if(!u){setEr("No account found with this email.");return;}
    if(pwdReqs.find(r=>r.email.toLowerCase()===email.toLowerCase()&&r.status==="pending")){setEr("A reset request is already pending for this email.");return;}
    setPwdReqs(r=>[...r,{id:"PWD-"+String(r.length+1).padStart(3,"0"),email:u.email,name:u.name,requestDate:today(),status:"pending",newPassword:"",resolvedBy:"",resolvedDate:""}]);
    const admins=users.filter(a=>["secretary","ads","conf_secretary","personnel"].includes(a.role));
    admins.forEach(a=>sendGenericEmail({to_name:a.name,to_email:a.email,
      email_subject:"Password Reset Request — ECWA Lafia DCC",
      email_body:`${u.name} (${u.email}) has submitted a password reset request.\n\nPlease log in to process this request.\nhttps://ecwa-portal.onrender.com`}));
    setSent(true);
  };
  if(sent)return(
    <div style={{maxWidth:400,width:"100%",margin:"0 auto",textAlign:"center"}} className="fade-in">
      <div style={{fontSize:52,marginBottom:16}}>📨</div>
      <h2 style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:22,marginBottom:10}}>Request Sent</h2>
      <p style={{color:"rgba(255,255,255,0.55)",fontSize:13,marginBottom:24,lineHeight:1.7}}>Your password reset request has been sent to Admin & Personnel. They will verify your identity and set a new temporary password. Please check back shortly.</p>
      <button className="btn btn-gold" onClick={onBack}>← Back to Sign In</button>
    </div>
  );
  return(
    <div style={{maxWidth:400,width:"100%",margin:"0 auto"}} className="fade-in">
      <h2 style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:24,marginBottom:4}}>Forgot Password</h2>
      <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:22}}>Enter your email and a reset request will be sent to Admin & Personnel</p>
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:24,display:"flex",flexDirection:"column",gap:14}}>
        {er&&<div className="err-box">{er}</div>}
        <div><label style={{color:"rgba(255,255,255,0.5)"}}>Email Address</label><input type="email" placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/></div>
        <button className="btn btn-gold" style={{width:"100%"}} onClick={submit}>Send Reset Request →</button>
        <div style={{background:"rgba(201,168,76,0.08)",border:"1px solid rgba(201,168,76,0.2)",borderRadius:8,padding:"10px 14px",fontSize:11,color:"rgba(255,255,255,0.45)",lineHeight:1.6}}>
          ℹ️ <strong style={{color:"#c9a84c"}}>First-time admin?</strong> Contact KrizTechs on <a href="tel:08166646683" style={{color:"#c9a84c"}}>08166646683</a> to have your initial password set directly.
        </div>
        <div style={{textAlign:"center"}}><button className="link-btn" onClick={onBack}>← Back to Sign In</button></div>
      </div>
    </div>
  );
}

// Password reset manager for Admin & Personnel
function PwdResetManager({ pwdReqs, setPwdReqs, users, setUsers, toast }) {
  const pending = pwdReqs.filter(r=>r.status==="pending");
  const [sel,setSel]=useState(null); const [newPw,setNewPw]=useState("");
  const resolve=async ()=>{
    if(!newPw||newPw.length<6){toast("Password must be at least 6 characters.","danger");return;}
    const hashedPw = await hashPassword(newPw);
    setUsers(us=>us.map(u=>u.email.toLowerCase()===sel.email.toLowerCase()?{...u,password:hashedPw,mustChangePassword:true}:u));
    setPwdReqs(rs=>rs.map(r=>r.id===sel.id?{...r,status:"resolved",newPassword:"[set]",resolvedDate:today()}:r));
    sendGenericEmail({
      to_name: sel.name,
      to_email: sel.email,
      email_subject: "Your ECWA Lafia DCC Password Has Been Reset",
      email_body: `Your password has been reset by Admin.\n\nYour temporary password: ${newPw}\n\nPlease sign in and change your password immediately.\n\nSign in at: https://ecwa-portal.onrender.com`,
    });
    toast("✅ Password reset. Email sent to "+sel.email);setSel(null);setNewPw("");
  };
  return(
    <div>
      <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#0b1f3a",marginBottom:16}}>🔐 Password Reset Requests</div>
      {pending.length===0&&<div style={{padding:32,textAlign:"center",color:"#bbb",fontSize:13}}>No pending reset requests.</div>}
      {pending.map(r=>(
        <div key={r.id} className="scard" style={{marginBottom:10}} onClick={()=>{setSel(r);setNewPw("");}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontWeight:700,fontSize:14,color:"#0b1f3a"}}>{r.name}</div><div style={{fontSize:12,color:"#888",marginTop:2}}>{r.email} · Requested {fdate(r.requestDate)}</div></div>
            <span style={{background:"#fef3e2",color:"#e67e22",padding:"3px 10px",borderRadius:10,fontSize:11,fontWeight:700}}>Pending</span>
          </div>
        </div>
      ))}
      {sel&&(
        <div className="overlay">
          <div className="modal" style={{maxWidth:420}}>
            <MH title="Reset Password" sub={sel.name} onClose={()=>setSel(null)}/>
            <div style={{padding:"22px 24px",display:"flex",flexDirection:"column",gap:14}}>
              <div className="info-box">Set a temporary password for <strong>{sel.name}</strong>. They will be prompted to change it on next login.</div>
              <div><label>New Temporary Password *</label><input type="password" placeholder="Min. 6 characters" value={newPw} onChange={e=>setNewPw(e.target.value)}/></div>
              <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
                <button className="btn btn-outline" onClick={()=>setSel(null)}>Cancel</button>
                <button className="btn btn-gold" onClick={resolve}>Set Password →</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
function SignUp({ users, lccs, setLccs, onSignUp, onGo }) {
  const [step,setStep]=useState(1); const [cat,setCat]=useState("");
  const [f,setF]=useState({name:"",email:"",pw:"",pw2:"",phone:"",dob:"",doj:"",dept:"",jobTitle:"",role:"",rank:"",lc_ph:"",lcc:"",newLcc:"",lcc_overseen:"",gradeLevel:""});
  const [er,setEr]=useState(""); const [ok,setOk]=useState(false); const [submitting,setSubmitting]=useState(false);
  const [showPw,setShowPw]=useState(false); const [showPw2,setShowPw2]=useState(false);
  const [signatureImage,setSignatureImage]=useState(null); const [showSigPad,setShowSigPad]=useState(false);
  const sigUploadRef=useRef(null); const errRef=useRef(null);
  const s=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const showErr=(msg)=>{setEr(msg);setTimeout(()=>errRef.current?.scrollIntoView({behavior:"smooth",block:"center"}),50);};
  const deptRoles = f.dept ? OFFICE_ROLES.filter(r=>r.dept===f.dept) : OFFICE_ROLES;

  const go=async ()=>{
    showErr("");
    if(!f.name||!f.email||!f.pw||!f.pw2){showErr("Please fill in all required fields.");return;}
    if(!f.email.includes("@")){showErr("Please enter a valid email.");return;}
    if(f.pw.length<6){showErr("Password must be at least 6 characters.");return;}
    if(f.pw!==f.pw2){showErr("Passwords do not match.");return;}
    if(users.find(u=>u.email.toLowerCase()===f.email.toLowerCase())){showErr("This email is already registered.");return;}
    if(cat==="office"&&!f.dept){showErr("Please select your department.");return;}
    if(cat==="office"&&!f.jobTitle){showErr("Please select a job title.");return;}
    if(cat==="pastor"&&(!f.rank||!f.lcc)){showErr("Please fill in your rank and LCC.");return;}
    if(cat==="pastor"&&!f.lc_ph){showErr("Please select your LC / Prayer House.");return;}
    if(cat==="pastor"&&f.lc_ph==="__other__"&&!f.newLcPh){showErr("Please type your church / prayer house name.");return;}
    if(cat==="pastor"&&f.lcc==="__new__"&&!f.newLcc){showErr("Please type the new LCC name.");return;}
    if(!signatureImage){showErr("Please draw your signature before submitting.");return;}
    try {
      setSubmitting(true);
      if(cat==="pastor"&&f.newLcc&&!lccs.includes(f.newLcc)){setLccs(l=>[...l,f.newLcc]);}
      const finalLcc=cat==="pastor"?(f.lcc==="__new__"?f.newLcc:f.lcc):undefined;
      const finalLcPh=cat==="pastor"?(f.lc_ph==="__other__"?f.newLcPh:f.lc_ph):undefined;
      const roleObj = OFFICE_ROLES.find(r=>r.title===f.jobTitle);
      const role = cat==="pastor"?"pastor":(roleObj?.role||"staff");
      const hashedPw = await hashPassword(f.pw);
      onSignUp({
        name:f.name,email:f.email,password:hashedPw,role,category:cat,
        phone:f.phone,dob:f.dob||undefined,doj:f.doj||undefined,
        dept:cat==="office"?f.dept:undefined,
        jobTitle:cat==="office"?f.jobTitle:undefined,
        rank:cat==="pastor"?f.rank:undefined,
        lc_ph:cat==="pastor"?finalLcPh:undefined,
        lcc:cat==="pastor"?finalLcc:undefined,
        gradeLevel:f.gradeLevel||undefined,
        gradePending:true, approved:false,
        signatureImage:signatureImage||null,
        docs:{},customDocSections:[],transferHistory:[],
      });
      setOk(true);
    } catch(e) {
      showErr("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const selectedLcc = f.lcc==="__new__"?f.newLcc:f.lcc;
  const churchOptions = CHURCHES_BY_LCC[selectedLcc]||[];

  if(ok)return(
    <div style={{maxWidth:420,width:"100%",margin:"0 auto",textAlign:"center"}} className="fade-in">
      <div style={{fontSize:52,marginBottom:16}}>🎉</div>
      <h2 style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:24,marginBottom:10}}>Account Created!</h2>
      <p style={{color:"rgba(255,255,255,0.55)",fontSize:14,marginBottom:24}}>Your account is pending admin approval. You'll be able to sign in once approved.</p>
      <button className="btn btn-gold" style={{padding:"12px 32px"}} onClick={()=>onGo("login")}>Go to Sign In →</button>
    </div>
  );

  return(
    <div style={{maxWidth:480,width:"100%",margin:"0 auto"}} className="fade-in">
      <h2 style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:26,marginBottom:4,textAlign:"center"}}>Create Account</h2>
      <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:22,textAlign:"center"}}>Join the ECWA Lafia DCC Portal</p>
      {step===1&&(
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <p style={{color:"rgba(255,255,255,0.6)",fontSize:13,marginBottom:4}}>I am a...</p>
          {[{id:"office",icon:"🏢",label:"Office Staff",desc:"Chairman, Secretary, ADS, Accountant, Auditor, Cashier, EMS Coordinator, etc."},
            {id:"pastor",icon:"⛪",label:"Pastor",desc:"Church Planter, Unlicensed, Licensed Pastor or Reverend"},
          ].map(c=>(
            <button key={c.id} className={`cat-btn ${cat===c.id?"active":""}`} onClick={()=>setCat(c.id)}>
              <div style={{display:"flex",gap:12,alignItems:"center"}}>
                <span style={{fontSize:28}}>{c.icon}</span>
                <div><div style={{fontWeight:700,fontSize:14}}>{c.label}</div><div style={{fontSize:12,color:"rgba(255,255,255,0.45)",marginTop:2}}>{c.desc}</div></div>
              </div>
            </button>
          ))}
          <button className="btn btn-gold" disabled={!cat} style={{width:"100%",marginTop:4}} onClick={()=>setStep(2)}>Continue →</button>
          <div className="divider"><span>already have an account?</span></div>
          <div style={{textAlign:"center"}}><button className="link-btn" onClick={()=>onGo("login")}>Sign In instead</button></div>
        </div>
      )}
      {step===2&&(
        <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:24,display:"flex",flexDirection:"column",gap:12}}>
          <button onClick={()=>setStep(1)} style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:12,fontWeight:600,alignSelf:"flex-start",padding:0}}>← Back</button>
          <div style={{fontSize:13,color:"rgba(255,255,255,0.5)",marginBottom:4}}>{cat==="office"?"🏢 Office Staff Registration":"⛪ Pastor Registration"}</div>
          {er&&<div ref={errRef} className="err-box">{er}</div>}
          <div><label style={{color:"rgba(255,255,255,0.5)"}}>Full Name *</label><input placeholder="e.g. Bro. John Danladi" value={f.name} onChange={s("name")}/></div>
          <div><label style={{color:"rgba(255,255,255,0.5)"}}>Email Address *</label><input type="email" placeholder="e.g. john@ecwalafia.org" value={f.email} onChange={s("email")}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div><label style={{color:"rgba(255,255,255,0.5)"}}>Phone</label><input placeholder="08012345678" value={f.phone} onChange={s("phone")}/></div>
            <div><label style={{color:"rgba(255,255,255,0.5)"}}>Date of Birth</label><input type="date" value={f.dob} onChange={s("dob")}/></div>
            <div style={{gridColumn:"1/-1"}}><label style={{color:"rgba(255,255,255,0.5)"}}>Date of Employment</label><input type="date" value={f.doj} onChange={s("doj")}/></div>
          </div>
          {cat==="office"&&(<>
            <div><label style={{color:"rgba(255,255,255,0.5)"}}>Department *</label>
              <select value={f.dept} onChange={e=>setF(p=>({...p,dept:e.target.value,jobTitle:""}))}>
                <option value="">— Select department first —</option>
                {DEPARTMENTS.filter(d=>d.id!=="executive").map(d=><option key={d.id} value={d.id}>{d.label}</option>)}
                <option value="executive">Executive (Chairman / Vice Chairman)</option>
              </select>
            </div>
            <div><label style={{color:"rgba(255,255,255,0.5)"}}>Job Title *</label>
              <select value={f.jobTitle} onChange={s("jobTitle")} disabled={!f.dept}>
                <option value="">{f.dept?"— Select your title —":"— Select department first —"}</option>
                {deptRoles.map(r=><option key={r.role} value={r.title}>{r.title}</option>)}
              </select>
            </div>
            <div><label style={{color:"rgba(255,255,255,0.5)"}}>Grade Level (self-declared)</label>
              <select value={f.gradeLevel} onChange={s("gradeLevel")}><option value="">— Select grade level —</option>{GRADE_LEVELS.flatMap(g=>Array.from({length:15},(_,i)=>`${g}/${i+1}`)).map(g=><option key={g} value={g}>{g}</option>)}</select>
            </div>
          </>)}
          {cat==="pastor"&&(<>
            <div><label style={{color:"rgba(255,255,255,0.5)"}}>Pastor Rank *</label>
              <select value={f.rank} onChange={s("rank")}><option value="">— Select rank —</option>{PASTOR_RANKS.map(r=><option key={r} value={r}>{r}</option>)}</select>
            </div>
            <div><label style={{color:"rgba(255,255,255,0.5)"}}>LCC *</label>
              <select value={f.lcc} onChange={e=>setF(p=>({...p,lcc:e.target.value,lc_ph:""}))}>
                <option value="">— Select LCC —</option>{lccs.map(l=><option key={l} value={l}>{l} LCC</option>)}<option value="__new__">+ Add new LCC...</option>
              </select>
            </div>
            {f.lcc==="__new__"&&<div><label style={{color:"rgba(255,255,255,0.5)"}}>New LCC Name *</label><input placeholder="Type new LCC name..." value={f.newLcc} onChange={s("newLcc")}/></div>}
            <div><label style={{color:"rgba(255,255,255,0.5)"}}>LC / Prayer House *</label>
              <select value={f.lc_ph} onChange={s("lc_ph")}><option value="">— Select church —</option>{churchOptions.map(c=><option key={c} value={c}>{c}</option>)}<option value="__other__">+ Not listed</option></select>
            </div>
            {f.lc_ph==="__other__"&&<div><label style={{color:"rgba(255,255,255,0.5)"}}>Church / PH Name *</label><input placeholder="e.g. ECWA New Harvest" value={f.newLcPh||""} onChange={e=>setF(p=>({...p,newLcPh:e.target.value}))}/></div>}
            <div><label style={{color:"rgba(255,255,255,0.5)"}}>Grade Level (self-declared)</label>
              <select value={f.gradeLevel} onChange={s("gradeLevel")}><option value="">— Select grade level —</option>{GRADE_LEVELS.flatMap(g=>Array.from({length:15},(_,i)=>`${g}/${i+1}`)).map(g=><option key={g} value={g}>{g}</option>)}</select>
            </div>
          </>)}
          {/* Password with show/hide */}
          <div>
            <label style={{color:"rgba(255,255,255,0.5)"}}>Password *</label>
            <div style={{position:"relative"}}>
              <input type={showPw?"text":"password"} placeholder="Minimum 6 characters" value={f.pw} onChange={s("pw")} style={{paddingRight:44}}/>
              <button type="button" onClick={()=>setShowPw(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#aaa",padding:0}}>{showPw?"🙈":"👁"}</button>
            </div>
          </div>
          <div>
            <label style={{color:"rgba(255,255,255,0.5)"}}>Confirm Password *</label>
            <div style={{position:"relative"}}>
              <input type={showPw2?"text":"password"} placeholder="Repeat password" value={f.pw2} onChange={s("pw2")} style={{paddingRight:44}}/>
              <button type="button" onClick={()=>setShowPw2(v=>!v)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"#aaa",padding:0}}>{showPw2?"🙈":"👁"}</button>
            </div>
          </div>
          {/* Signature — required: draw OR upload */}
          <div>
            <label style={{color:"rgba(255,255,255,0.5)"}}>Your Signature * <span style={{fontSize:10,color:"#c9a84c",fontStyle:"italic"}}>(used on official documents)</span></label>
            {signatureImage?(
              <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(201,168,76,0.4)",borderRadius:10,padding:12,display:"flex",alignItems:"center",gap:12}}>
                <img src={signatureImage} alt="sig" style={{height:46,background:"#fff",borderRadius:6,padding:4,maxWidth:180}}/>
                <div><div style={{fontSize:12,color:"#c9a84c",fontWeight:600}}>✅ Signature captured</div><button type="button" className="btn btn-outline btn-sm" style={{marginTop:6}} onClick={()=>setSignatureImage(null)}>Re-do</button></div>
              </div>
            ):(
              <div style={{display:"flex",gap:10,marginTop:4}}>
                <button type="button" className="btn btn-outline" style={{flex:1,color:"#c9a84c",borderColor:"rgba(201,168,76,0.4)"}} onClick={()=>setShowSigPad(true)}>✏️ Draw</button>
                <button type="button" className="btn btn-outline" style={{flex:1,color:"#c9a84c",borderColor:"rgba(201,168,76,0.4)"}} onClick={()=>sigUploadRef.current.click()}>📷 Upload Photo</button>
              </div>
            )}
            <input ref={sigUploadRef} type="file" style={{display:"none"}} accept="image/*" onChange={e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=ev=>setSignatureImage(ev.target.result);rd.readAsDataURL(f);e.target.value="";}}/>
          </div>
          <div className="info-box">ℹ️ All accounts are subject to approval by Admin & Personnel before you can sign in.</div>
          <button className="btn btn-gold" style={{width:"100%",marginTop:4,opacity:submitting?0.7:1}} disabled={submitting} onClick={go}>{submitting?"⏳ Creating Account...":"Create Account →"}</button>
          <div className="divider"><span>already have an account?</span></div>
          <div style={{textAlign:"center"}}><button className="link-btn" onClick={()=>onGo("login")}>Sign In instead</button></div>
        </div>
      )}
      {showSigPad&&<SigPad onSave={d=>{setSignatureImage(d);setShowSigPad(false);}} onClose={()=>setShowSigPad(false)}/>}
    </div>
  );
}

// ── Sign In ────────────────────────────────────────────────────────────────────
function SignIn({ users, setUsers, onLogin, onGo, pwdReqs, setPwdReqs }) {
  const [em,setEm]=useState(""); const [pw,setPw]=useState(""); const [er,setEr]=useState("");
  const [forgot,setForgot]=useState(false); const [showPw,setShowPw]=useState(false);
  const [changeMode,setChangeMode]=useState(null); // {user} when must change password
  const [newPw,setNewPw]=useState(""); const [newPw2,setNewPw2]=useState("");

  if(forgot) return <ForgotPassword users={users} pwdReqs={pwdReqs} setPwdReqs={setPwdReqs} onBack={()=>setForgot(false)}/>;

  if(changeMode) return(
    <div style={{maxWidth:400,width:"100%",margin:"0 auto"}} className="fade-in">
      <h2 style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:24,marginBottom:4}}>Change Your Password</h2>
      <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:22}}>A temporary password was set by Admin. Please choose a new password.</p>
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:24,display:"flex",flexDirection:"column",gap:14}}>
        {er&&<div className="err-box">{er}</div>}
        <div><label style={{color:"rgba(255,255,255,0.5)"}}>New Password *</label><input type="password" placeholder="Min. 6 characters" value={newPw} onChange={e=>setNewPw(e.target.value)}/></div>
        <div><label style={{color:"rgba(255,255,255,0.5)"}}>Confirm New Password *</label><input type="password" placeholder="Repeat password" value={newPw2} onChange={e=>setNewPw2(e.target.value)}/></div>
        <button className="btn btn-gold" style={{width:"100%"}} onClick={async ()=>{
          setEr("");
          if(newPw.length<6){setEr("Password must be at least 6 characters.");return;}
          if(newPw!==newPw2){setEr("Passwords do not match.");return;}
          const hashedPw = await hashPassword(newPw);
          setUsers(us=>us.map(u=>u.id===changeMode.id?{...u,password:hashedPw,mustChangePassword:false}:u));
          onLogin({...changeMode,password:hashedPw,mustChangePassword:false});
        }}>Save New Password & Sign In →</button>
      </div>
    </div>
  );

  const go=async ()=>{
    setEr("");
    if(!em||!pw){setEr("Please enter your email and password.");return;}
    let u = users.find(u=>u.email.toLowerCase()===em.toLowerCase());
    if(!u){
      const loUser = users.find(u=>u.loAppointment?.active&&u.loAppointment?.email.toLowerCase()===em.toLowerCase());
      if(loUser){
        const ok = await checkPassword(pw, loUser.loAppointment.password);
        if(!ok){setEr("Incorrect password.");return;}
        const loSession = { ...loUser, role:"lo", category:"lo", lcc_overseen:loUser.loAppointment.lcc_overseen, email:loUser.loAppointment.email, _loLogin:true, _pastorId:loUser.id };
        onLogin(loSession); return;
      }
      setEr("No account found with this email.");return;
    }
    const ok = await checkPassword(pw, u.password);
    if(!ok){setEr("Incorrect password.");return;}
    if(!u.approved){setEr("Your account is pending admin approval.");return;}
    if(u.mustChangePassword){setChangeMode(u);return;}
    onLogin(u);
  };
  return(
    <div style={{maxWidth:400,width:"100%",margin:"0 auto",textAlign:"center"}} className="fade-in">
      <h2 style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:26,marginBottom:4,textAlign:"center"}}>Welcome Back</h2>
      <p style={{color:"rgba(255,255,255,0.4)",fontSize:13,marginBottom:22,textAlign:"center"}}>Sign in to your ECWA Lafia DCC account</p>
      <div style={{background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:14,padding:24,display:"flex",flexDirection:"column",gap:14,textAlign:"left"}}>
        {er&&<div className="err-box">{er}</div>}
        <div><label style={{color:"rgba(255,255,255,0.5)"}}>Email Address</label><input type="email" placeholder="your@email.com" value={em} onChange={e=>setEm(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()}/></div>
        <div><label style={{color:"rgba(255,255,255,0.5)"}}>Password</label><div style={{position:"relative"}}><input type={showPw?"text":"password"} placeholder="Your password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} style={{paddingRight:48}}/><button type="button" onClick={()=>setShowPw(p=>!p)} style={{position:"absolute",right:10,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",fontSize:16,color:"rgba(255,255,255,0.4)",padding:4}}>{showPw?"🙈":"👁️"}</button></div></div>
        <button className="btn btn-gold" style={{width:"100%",marginTop:4}} onClick={go}>Sign In →</button>
        <div style={{textAlign:"right"}}><button className="link-btn" style={{fontSize:12}} onClick={()=>setForgot(true)}>Forgot password?</button></div>
        <div className="divider"><span>new here?</span></div>
        <div style={{textAlign:"center"}}><button className="link-btn" onClick={()=>onGo("signup")}>Create an account</button></div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────
function Dashboard({ user, users, setUsers, requests, setRequests, leaves, setLeaves, sundayReports, setSundayReports, attendance, setAttendance, announcements, setAnnouncements, pwdReqs, setPwdReqs, lccs, setLccs, onLogout }) {
  const [mod,setMod]=useState(null); const [tk,setTk]=useState(null);
  const [notifOpen,setNotifOpen]=useState(false);
  const [idCard,setIdCard]=useState(false);
  const toast=(m,t="success")=>{setTk({m,t});setTimeout(()=>setTk(null),4000);};

  // Build notifications for this user
  const myNotifs = [
    // Unread announcements
    ...announcements.filter(a=>{
      const vis=(a.audience==="all")||(a.audience==="office"&&user.category==="office")||(a.audience==="pastor"&&(user.category==="pastor"||user.role==="lo"));
      return vis&&!a.readBy.includes(user.email);
    }).map(a=>({id:"ann_"+a.id,icon:"📢",title:a.title,body:a.postedBy+" · "+fdate(a.date),date:a.date,read:false})),
    // Leave approvals pending
    ...leaves.filter(l=>canActLeave(user,l,users)!==null).map(l=>({id:"lv_"+l.id,icon:"📋",title:"Leave request awaiting your action",body:`${l.requester} — ${l.type}`,date:l.date,read:false})),
    // Finance pending
    ...(user.category==="office"?requests.filter(r=>{
      if(["secretary","ads","conf_secretary"].includes(user.role)) return r.status==="pending_secretary";
      if(user.role==="accountant") return r.status==="pending_finance";
      if(user.role==="auditor") return r.status==="pending_auditor";
      if(["chairman","vice_chairman"].includes(user.role)) return r.status==="pending_chairman";
      return false;
    }).map(r=>({id:"fin_"+r.id,icon:"💰",title:"Financial request needs your review",body:`${r.requester} — ${money(r.amount)}`,date:r.date,read:false})):[]),
    // Sunday report appeals pending admin action
    ...(["secretary","ads","conf_secretary","chairman","accountant"].includes(user.role)?sundayReports.filter(r=>r.appeal&&r.appeal.status==="pending").map(r=>({id:"sra_"+r.id,icon:"⚠️",title:"Sunday report appeal pending",body:`${r.pastorName} — ${r.lc_ph} · ${fdate(r.date)}`,date:r.appeal.date,read:false})):[] ),
    // Password reset requests for admin
    ...(["secretary","ads","conf_secretary","personnel"].includes(user.role)?pwdReqs.filter(r=>r.status==="pending").map(r=>({id:"pwd_"+r.id,icon:"🔐",title:"Password reset request",body:`${r.name} — ${r.email}`,date:r.requestDate,read:false})):[]),
  ];
  const [readNotifs,setReadNotifs]=useState([]);
  const notifs = myNotifs.map(n=>({...n,read:readNotifs.includes(n.id)}));
  const unreadCount = notifs.filter(n=>!n.read).length;
  const markRead = id => setReadNotifs(r=>[...r,id]);

  const isOffice = user.category==="office";
  const isPastor = user.category==="pastor";
  const isLO     = user.role==="lo";

  const canF = isOffice;
  const canL = true;
  const canS = isPastor||isLO;
  const canAtt = isOffice;
  const canAnn = true;
  const canPwdMgr = ["secretary","ads","conf_secretary","personnel"].includes(user.role);

  const pf = canF?requests.filter(r=>{
    if(["secretary","ads","conf_secretary"].includes(user.role)) return r.status==="pending_secretary";
    if(user.role==="accountant") return r.status==="pending_finance";
    if(user.role==="auditor") return r.status==="pending_auditor";
    if(["chairman","vice_chairman"].includes(user.role)) return r.status==="pending_chairman";
    return false;
  }).length:0;

  const pl = leaves.filter(l=>canActLeave(user,l,users)!==null).length;
  const unreadAnn = announcements.filter(a=>{
    const vis=(a.audience==="all")||(a.audience==="office"&&isOffice)||(a.audience==="pastor"&&(isPastor||isLO));
    return vis&&!a.readBy.includes(user.email);
  }).length;

  const tabs=[
    ...(canF?[{id:"finance",icon:"💰",label:"Finance",badge:pf}]:[]),
    ...(canL?[{id:"leave",icon:"📋",label:"Leave",badge:pl}]:[]),
    ...(canS?[{id:"sunday",icon:"⛪",label:"Sunday Reports",badge:0}]:[]),
    ...(canAtt?[{id:"attendance",icon:"🕐",label:"Attendance",badge:0}]:[]),
    ...(canAnn?[{id:"announcements",icon:"📢",label:"Notice Board",badge:unreadAnn}]:[]),
    {id:"profile",icon:isPastor?"⛪":"👤",label:["personnel","secretary","ads","conf_secretary","chairman","vice_chairman"].includes(user.role)?"Personnel":"My Profile",badge:0},
  ];

  if(mod===null&&tabs.length===1){setTimeout(()=>setMod(tabs[0].id),0);return <div style={{padding:40,textAlign:"center",color:"#888",fontSize:14}}>Loading...</div>;}

  const retWarn = yearsToRetire(user.dob,user.doj);
  const myStaffRecord = users.find(u=>u.id===user.id);

  return(
    <div className="app-root">
      {tk&&<Toasty msg={tk.m} type={tk.t}/>}
      {retWarn!==null&&retWarn<=5&&(
        <div className={retWarn<=0?"alert-banner":"warn-banner"}>
          {retWarn<=0?"🔴 Your retirement is due — please contact Admin & Personnel":`⚠️ You have ${retWarn} year${retWarn>1?"s":""} to retirement`}
        </div>
      )}
      <header style={{background:"#0b1f3a",position:"sticky",top:0,zIndex:100}}>
        {/* Desktop: single row */}
        <div style={{padding:"0 16px",display:"flex",alignItems:"center",justifyContent:"space-between",height:56}} className="header-desktop-row">
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <img src={LOGO} alt="ECWA" style={{width:34,height:34,borderRadius:"50%",objectFit:"cover",border:"1.5px solid #c9a84c",flexShrink:0}}/>
            <div><div style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:14,fontWeight:700,lineHeight:1.2}}>ECWA Lafia DCC</div><div style={{fontSize:9,color:"rgba(255,255,255,0.38)"}}>Staff Portal</div></div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{position:"relative"}}>
              <button className="btn-ghost" style={{fontSize:16,padding:"5px 8px"}} onClick={()=>setNotifOpen(o=>!o)}>
                🔔{unreadCount>0&&<span style={{background:"#c0392b",color:"#fff",borderRadius:10,padding:"1px 5px",fontSize:10,marginLeft:2}}>{unreadCount}</span>}
              </button>
              {notifOpen&&<NotifPanel notifs={notifs} onRead={markRead} onClose={()=>setNotifOpen(false)}/>}
            </div>
            <button className="btn-ghost" style={{fontSize:11,padding:"5px 8px"}} onClick={()=>setIdCard(true)}>📋 Biodata</button>
            <div style={{textAlign:"right",maxWidth:110}}>
              <div style={{color:"#fff",fontSize:11,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name.split(" ").slice(-1)[0]}</div>
              <div style={{color:"#c9a84c",fontSize:9,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{roleDisplay(user.role)}</div>
            </div>
            <button className="btn-ghost" style={{fontSize:11,padding:"5px 8px"}} onClick={onLogout}>Exit</button>
          </div>
        </div>

        {/* Mobile header — compact single row */}
        <div className="header-mobile" style={{padding:"8px 14px",display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:54}}>
          {/* Left: Logo + ECWA Lafia DCC full title + name & role */}
          <div style={{display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0}}>
            <img src={LOGO} alt="ECWA" style={{width:38,height:38,borderRadius:"50%",objectFit:"cover",border:"2px solid #c9a84c",flexShrink:0}}/>
            <div style={{minWidth:0}}>
              <div style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:13,fontWeight:700,lineHeight:1.2,letterSpacing:0.2}}>ECWA Lafia DCC</div>
              <div style={{color:"#c9a84c",fontSize:10,marginTop:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                {user.name?.split(" ").slice(0,2).join(" ")} · {roleDisplay(user.role)}
              </div>
            </div>
          </div>
          {/* Right: actions — evenly spaced */}
          <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,marginLeft:10}}>
            <div style={{position:"relative"}}>
              <button style={{background:"rgba(255,255,255,0.12)",border:"none",borderRadius:8,color:"#fff",padding:"7px 10px",cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",gap:3,minWidth:38,justifyContent:"center"}} onClick={()=>setNotifOpen(o=>!o)}>
                🔔{unreadCount>0&&<span style={{background:"#c0392b",color:"#fff",borderRadius:8,padding:"1px 5px",fontSize:9,fontWeight:700,marginLeft:1}}>{unreadCount}</span>}
              </button>
              {notifOpen&&<NotifPanel notifs={notifs} onRead={markRead} onClose={()=>setNotifOpen(false)}/>}
            </div>
            <button style={{background:"rgba(255,255,255,0.12)",border:"none",borderRadius:8,color:"#fff",padding:"7px 10px",cursor:"pointer",fontSize:16,minWidth:38,textAlign:"center"}} onClick={()=>setIdCard(true)}>📋</button>
            <button style={{background:"rgba(192,57,43,0.9)",border:"none",borderRadius:8,color:"#fff",padding:"7px 14px",cursor:"pointer",fontSize:12,fontWeight:700,letterSpacing:0.3}} onClick={onLogout}>Exit</button>
          </div>
        </div>
        {/* Bottom row: tabs scrollable */}
        {tabs.length>1&&(
          <div style={{overflowX:"auto",display:"flex",gap:0,borderTop:"1px solid rgba(255,255,255,0.12)",scrollbarWidth:"none",WebkitOverflowScrolling:"touch"}} className="mobile-tabs">
            {tabs.map(t=>(
              <button key={t.id} onClick={()=>setMod(t.id)} style={{flexShrink:0,padding:"9px 14px",background:mod===t.id?"rgba(201,168,76,0.15)":"none",border:"none",borderBottom:mod===t.id?"2.5px solid #c9a84c":"2.5px solid transparent",color:mod===t.id?"#c9a84c":"rgba(255,255,255,0.75)",fontSize:11,fontWeight:mod===t.id?700:500,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:5,transition:"all 0.15s"}}>
                <span style={{fontSize:14}}>{t.icon}</span>
                <span>{t.label}</span>
                {t.badge>0&&<span style={{background:"#c9a84c",color:"#0b1f3a",borderRadius:10,padding:"1px 5px",fontSize:9,fontWeight:700}}>{t.badge}</span>}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Home dashboard with pending summary */}
      {mod===null&&(
        <div style={{maxWidth:820,margin:"0 auto",padding:"20px 12px"}} className="fade-in">
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{fontFamily:"Georgia,serif",color:"#0b1f3a",fontSize:22,fontWeight:700,marginBottom:6}}>Welcome, {user.name.split(" ").slice(-1)[0]}</div>
            <p style={{color:"#888",fontSize:14}}>Select a module to get started</p>
          </div>
          {/* Pending summary widget */}
          {(pf>0||pl>0||unreadAnn>0||pwdReqs.filter(r=>r.status==="pending").length>0)&&(
            <div style={{background:"linear-gradient(135deg,#0b1f3a,#1a3a5c)",borderRadius:14,padding:"16px 18px",marginBottom:24}}>
              <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:0.5,marginBottom:12}}>⏳ Needs Attention</div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                {pf>0&&<div onClick={()=>setMod("finance")} style={{cursor:"pointer",flex:"1 1 auto",minWidth:80,background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:10,padding:"10px 14px",textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",color:"#c9a84c",fontSize:22,fontWeight:700}}>{pf}</div><div style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>Finance</div></div>}
                {pl>0&&<div onClick={()=>setMod("leave")} style={{cursor:"pointer",flex:"1 1 auto",minWidth:80,background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:10,padding:"10px 14px",textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",color:"#c9a84c",fontSize:22,fontWeight:700}}>{pl}</div><div style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>Leave</div></div>}
                {unreadAnn>0&&<div onClick={()=>setMod("announcements")} style={{cursor:"pointer",flex:"1 1 auto",minWidth:80,background:"rgba(201,168,76,0.15)",border:"1px solid rgba(201,168,76,0.3)",borderRadius:10,padding:"10px 14px",textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",color:"#c9a84c",fontSize:22,fontWeight:700}}>{unreadAnn}</div><div style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>Notices</div></div>}
                {canPwdMgr&&pwdReqs.filter(r=>r.status==="pending").length>0&&<div onClick={()=>setMod("profile")} style={{cursor:"pointer",flex:"1 1 auto",minWidth:80,background:"rgba(192,57,43,0.2)",border:"1px solid rgba(192,57,43,0.4)",borderRadius:10,padding:"10px 14px",textAlign:"center"}}><div style={{fontFamily:"Georgia,serif",color:"#e74c3c",fontSize:22,fontWeight:700}}>{pwdReqs.filter(r=>r.status==="pending").length}</div><div style={{color:"rgba(255,255,255,0.5)",fontSize:11}}>Pwd Resets</div></div>}
              </div>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12}}>
            {tabs.map(t=>(
              <div key={t.id} className="card" style={{padding:"20px 14px",cursor:"pointer",border:"2px solid transparent",transition:"all 0.2s",textAlign:"center",display:"flex",flexDirection:"column",alignItems:"center",gap:6}} onClick={()=>setMod(t.id)} onMouseEnter={e=>{e.currentTarget.style.borderColor="#c9a84c";e.currentTarget.style.transform="translateY(-3px)";}} onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.transform="none";}}>
                <div style={{fontSize:30,lineHeight:1}}>{t.icon}</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:14,fontWeight:700,color:"#0b1f3a",lineHeight:1.2}}>{t.label}</div>
                {t.badge>0&&<div style={{background:"#fef3e2",color:"#e67e22",padding:"3px 10px",borderRadius:8,fontSize:11,fontWeight:600}}>⏳ {t.badge} pending</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {mod&&(
        <div style={{padding:"16px 12px",maxWidth:1060,margin:"0 auto"}}>
          {tabs.length>1&&<div style={{marginBottom:14,display:"flex",alignItems:"center",gap:8}}><button onClick={()=>setMod(null)} style={{background:"none",border:"none",color:"#c9a84c",cursor:"pointer",fontSize:13,fontWeight:600,padding:0}}>← Modules</button><span style={{color:"#bbb",fontSize:13}}>/</span><span style={{fontSize:13,color:"#0b1f3a",fontWeight:600}}>{tabs.find(t=>t.id===mod)?.label}</span></div>}
          {mod==="finance"&&<FinanceMod user={user} users={users} requests={requests} setRequests={setRequests} toast={toast}/>}
          {mod==="leave"&&<LeaveMod user={user} users={users} leaves={leaves} setLeaves={setLeaves} toast={toast}/>}
          {mod==="sunday"&&<SundayMod user={user} users={users} sundayReports={sundayReports} setSundayReports={setSundayReports} toast={toast}/>}
          {mod==="attendance"&&<AttendanceMod user={user} users={users} attendance={attendance} setAttendance={setAttendance} leaves={leaves} toast={toast}/>}
          {mod==="announcements"&&<AnnouncementsMod user={user} announcements={announcements} setAnnouncements={setAnnouncements} toast={toast}/>}
          {mod==="profile"&&(
            <div>
              {canPwdMgr&&pwdReqs.filter(r=>r.status==="pending").length>0&&(
                <div style={{marginBottom:24}}>
                  <PwdResetManager pwdReqs={pwdReqs} setPwdReqs={setPwdReqs} users={users} setUsers={setUsers} toast={toast}/>
                </div>
              )}
              <PersonnelMod user={user} users={users} setUsers={setUsers} lccs={lccs} toast={toast}/>
            </div>
          )}
        </div>
      )}

      {idCard&&<IDCard staff={myStaffRecord||user} onClose={()=>setIdCard(false)}/>}

      {/* KrizTechs Footer */}
      <div style={{textAlign:"center",padding:"20px 16px 12px",marginTop:8}}>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#fff",border:"1px solid #e8e4dc",borderRadius:20,padding:"6px 16px",boxShadow:"0 2px 8px rgba(11,31,58,0.06)"}}>
          <span style={{fontSize:13}}>⚡</span>
          <span style={{color:"#aaa",fontSize:11}}>Powered by</span>
          <span style={{color:"#c9a84c",fontSize:12,fontWeight:700,letterSpacing:0.5}}>KrizTechs</span>
          <span style={{color:"#ddd",fontSize:11}}>·</span>
          <a href="tel:08166646683" style={{color:"#888",fontSize:11,textDecoration:"none"}}>08166646683</a>
        </div>
      </div>
    </div>
  );
}

// ── Supabase save helper ───────────────────────────────────────────────────────
async function sbSave(key, value) {
  try {
    await supabase.from("app_state").upsert({ key, value, updated_at: new Date().toISOString() });
  } catch(e) { console.error("Supabase save error:", e); }
}

// ── Isolated print helper — only prints the target element, nothing else ──────
function printElement(elementId) {
  const el = document.getElementById(elementId);
  if(!el) { window.print(); return; }
  const html = el.innerHTML;
  const logoSrc = document.querySelector('img[alt="ECWA"]')?.src || "";
  const win = window.open("","_blank","width=800,height=900");
  win.document.write(`<!DOCTYPE html><html><head><title>ECWA Lafia DCC</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Segoe UI',sans-serif;font-size:13px;color:#222;padding:20px;}
    table{width:100%;border-collapse:collapse;}
    td{padding:7px 12px;border-bottom:1px solid #e8e4dc;}
    img{max-width:100%;height:auto;}
    .no-print{display:none!important;}
    @media print{
      body{padding:0;}
      @page{margin:12mm;}
    }
  </style></head><body>${html}</body></html>`);
  win.document.close();
  setTimeout(()=>{win.focus();win.print();},400);
}

// ── Password hashing (SHA-256 via Web Crypto API — no library needed) ─────────
async function hashPassword(plain) {
  const enc = new TextEncoder();
  const buf = await window.crypto.subtle.digest("SHA-256", enc.encode(plain));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
}
async function checkPassword(plain, hashed) {
  // Support both plain (legacy demo) and hashed passwords
  if(hashed && hashed.length === 64) return (await hashPassword(plain)) === hashed;
  return plain === hashed; // fallback for demo accounts
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [loading,setLoading] = useState(true);
  const [users,setUsers]   = useState(USERS0);
  const [requests,setReqs] = useState(REQS0);
  const [leaves,setLeaves] = useState(LEAVES0);
  const [sundayReports,setSundayReports] = useState(SUNDAY_REPORTS0);
  const [attendance,setAttendance] = useState(ATTENDANCE0);
  const [announcements,setAnnouncements] = useState(ANNOUNCEMENTS0);
  const [pwdReqs,setPwdReqs] = useState(PWD_REQS0);
  const [lccs,setLccs]     = useState(LCCS_DEFAULT);
  const [me,setMe]         = useState(null);
  const [scr,setScr]       = useState("login");

  // ── Load all data from Supabase on startup ─────────────────────────────────
  useEffect(() => {
    async function loadAll() {
      try {
        const { data, error } = await supabase.from("app_state").select("*");
        if (error) { console.error("Load error:", error); setLoading(false); return; }
        if (data && data.length > 0) {
          const map = Object.fromEntries(data.map(r => [r.key, r.value]));
          if (map.users)         setUsers(map.users);
          if (map.requests)      setReqs(map.requests);
          if (map.leaves)        setLeaves(map.leaves);
          if (map.sundayReports) setSundayReports(map.sundayReports);
          if (map.attendance)    setAttendance(map.attendance);
          if (map.announcements) setAnnouncements(map.announcements);
          if (map.pwdReqs)       setPwdReqs(map.pwdReqs);
          if (map.lccs)          setLccs(map.lccs);
        }
      } catch(e) { console.error("Load failed:", e); }
      setLoading(false);
    }
    loadAll();
  }, []);

  // ── Auto-save each collection to Supabase when it changes ─────────────────
  useEffect(() => { if(!loading) sbSave("users", users); }, [users, loading]);
  useEffect(() => { if(!loading) sbSave("requests", requests); }, [requests, loading]);
  useEffect(() => { if(!loading) sbSave("leaves", leaves); }, [leaves, loading]);
  useEffect(() => { if(!loading) sbSave("sundayReports", sundayReports); }, [sundayReports, loading]);
  useEffect(() => { if(!loading) sbSave("attendance", attendance); }, [attendance, loading]);
  useEffect(() => { if(!loading) sbSave("announcements", announcements); }, [announcements, loading]);
  useEffect(() => { if(!loading) sbSave("pwdReqs", pwdReqs); }, [pwdReqs, loading]);
  useEffect(() => { if(!loading) sbSave("lccs", lccs); }, [lccs, loading]);

  // ── Loading screen ─────────────────────────────────────────────────────────
  if(loading) return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0b1f3a,#1a3a5c)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
      <img src={LOGO} alt="ECWA" style={{width:72,height:72,borderRadius:"50%",border:"2px solid #c9a84c"}}/>
      <div style={{color:"#c9a84c",fontFamily:"Georgia,serif",fontSize:18}}>ECWA Lafia DCC</div>
      <div style={{color:"rgba(255,255,255,0.4)",fontSize:13}}>Loading portal data…</div>
      <div style={{width:40,height:40,border:"3px solid rgba(201,168,76,0.2)",borderTop:"3px solid #c9a84c",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if(me)return(
    <><GlobalStyles/>
    <Dashboard user={me} users={users} setUsers={setUsers} requests={requests} setRequests={setReqs} leaves={leaves} setLeaves={setLeaves} sundayReports={sundayReports} setSundayReports={setSundayReports} attendance={attendance} setAttendance={setAttendance} announcements={announcements} setAnnouncements={setAnnouncements} pwdReqs={pwdReqs} setPwdReqs={setPwdReqs} lccs={lccs} setLccs={setLccs} onLogout={()=>setMe(null)}/>
    </>
  );

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0b1f3a 0%,#1a3a5c 60%,#0d2b47 100%)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"16px",position:"relative",overflow:"hidden"}}>
      <GlobalStyles/>
      <div style={{position:"absolute",width:350,height:350,border:"1px solid rgba(201,168,76,0.08)",borderRadius:"50%",top:-80,right:-80}}/>
      <div style={{position:"absolute",width:250,height:250,border:"1px solid rgba(201,168,76,0.06)",borderRadius:"50%",bottom:-60,left:-60}}/>
      <div style={{textAlign:"center",marginBottom:30}} className="fade-in">
        <img src={LOGO} alt="ECWA" style={{width:72,height:72,borderRadius:"50%",objectFit:"cover",border:"2px solid #c9a84c",margin:"0 auto 16px",display:"block"}}/>
        <h1 style={{fontFamily:"Georgia,serif",color:"#fff",fontSize:"clamp(20px,4vw,30px)",fontWeight:700,marginBottom:4}}>ECWA Lafia DCC</h1>
        <p style={{color:"#c9a84c",fontSize:11,letterSpacing:2,textTransform:"uppercase"}}>Staff Management Portal</p>
      </div>
      {scr==="login"
        ?<SignIn users={users} setUsers={setUsers} onLogin={setMe} onGo={setScr} pwdReqs={pwdReqs} setPwdReqs={setPwdReqs}/>
        :<SignUp users={users} lccs={lccs} setLccs={setLccs} onSignUp={u=>setUsers(us=>[...us,{id:Math.max(0,...us.map(x=>x.id))+1,...u}])} onGo={setScr}/>
      }
      {/* KrizTechs Branding */}
      <div style={{marginTop:32,textAlign:"center"}} className="fade-in">
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(201,168,76,0.15)",borderRadius:20,padding:"8px 18px"}}>
          <span style={{fontSize:14}}>⚡</span>
          <span style={{color:"rgba(255,255,255,0.35)",fontSize:11,letterSpacing:0.5}}>Powered by</span>
          <span style={{color:"#c9a84c",fontSize:12,fontWeight:700,letterSpacing:1}}>KrizTechs</span>
          <span style={{color:"rgba(255,255,255,0.2)",fontSize:11}}>·</span>
          <a href="tel:08166646683" style={{color:"rgba(201,168,76,0.7)",fontSize:11,textDecoration:"none",letterSpacing:0.5}}>08166646683</a>
        </div>
      </div>
    </div>
  );
}
