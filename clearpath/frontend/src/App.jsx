import { useState, useEffect, useMemo, useCallback } from "react";
import api from "./api";

/* ─── FONTS & STYLES ─────────────────────────────────────────────────────── */
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');`;

const STYLES = `
* { margin:0; padding:0; box-sizing:border-box; }
:root {
  --bg:        #191919;
  --bg2:       #1f1f1f;
  --panel:     #252525;
  --panel2:    #2c2c2c;
  --hover:     #2f2f2f;
  --hover2:    #363636;
  --border:    #363636;
  --border2:   #404040;
  --text:      #e3e3e3;
  --text2:     #a8a8a8;
  --text3:     #666;
  --blue:      #5b8df5;
  --blue-bg:   rgba(91,141,245,.12);
  --green:     #4caf7d;
  --green-bg:  rgba(76,175,125,.12);
  --yellow:    #d4a843;
  --yellow-bg: rgba(212,168,67,.12);
  --red:       #e05c5c;
  --red-bg:    rgba(224,92,92,.12);
  --purple:    #9b7fe8;
  --purple-bg: rgba(155,127,232,.12);
  --teal:      #4db6ac;
  --teal-bg:   rgba(77,182,172,.12);
  --shadow:    0 1px 3px rgba(0,0,0,.4), 0 8px 24px rgba(0,0,0,.3);
  --r:  6px;
  --r2: 10px;
}
html { scroll-behavior:smooth; }
body {
  font-family:'DM Sans',sans-serif;
  background:var(--bg); color:var(--text);
  min-height:100vh; font-size:14px; line-height:1.6;
  -webkit-font-smoothing:antialiased;
}
::selection { background:rgba(91,141,245,.3); }
::-webkit-scrollbar { width:6px; height:6px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--border2); border-radius:3px; }

/* ── AUTH SCREEN ── */
.auth-wrap {
  min-height:100vh; display:flex; align-items:center; justify-content:center;
  background:var(--bg);
  background-image: radial-gradient(ellipse at 20% 50%, rgba(91,141,245,.06) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 20%, rgba(155,127,232,.05) 0%, transparent 50%);
  padding:24px;
}
.auth-card {
  width:100%; max-width:400px;
  background:var(--panel); border:1px solid var(--border2);
  border-radius:14px; padding:36px 32px;
  box-shadow:0 4px 24px rgba(0,0,0,.5);
  animation:slideup .25s;
}
.auth-logo { text-align:center; margin-bottom:28px; }
.auth-logo-icon {
  width:44px; height:44px; border-radius:10px;
  background:linear-gradient(135deg,#5b8df5,#9b7fe8);
  display:inline-flex; align-items:center; justify-content:center;
  font-size:20px; font-weight:700; color:#fff;
  margin-bottom:12px;
}
.auth-logo-name { font-family:'Instrument Serif',serif; font-size:1.5rem; font-weight:400; }
.auth-logo-sub  { font-size:12px; color:var(--text3); margin-top:2px; }

.auth-title   { font-family:'Instrument Serif',serif; font-size:1.3rem; font-weight:400; margin-bottom:6px; }
.auth-sub     { font-size:13px; color:var(--text2); margin-bottom:24px; }
.auth-divider { height:1px; background:var(--border); margin:20px 0; }
.auth-switch  { text-align:center; font-size:13px; color:var(--text3); }
.auth-switch a { color:var(--blue); cursor:pointer; text-decoration:none; }
.auth-switch a:hover { text-decoration:underline; }

.auth-error {
  background:var(--red-bg); border:1px solid rgba(224,92,92,.25);
  border-radius:var(--r); padding:10px 13px;
  font-size:13px; color:#f08080; margin-bottom:16px;
  display:flex; align-items:center; gap:8px;
}
.auth-success {
  background:var(--green-bg); border:1px solid rgba(76,175,125,.25);
  border-radius:var(--r); padding:10px 13px;
  font-size:13px; color:#6ac995; margin-bottom:16px;
  display:flex; align-items:center; gap:8px;
}

.demo-accounts {
  background:var(--bg2); border:1px solid var(--border);
  border-radius:var(--r2); padding:14px; margin-top:20px;
}
.demo-accounts-title { font-size:11px; font-weight:600; color:var(--text3); text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; }
.demo-row {
  display:flex; align-items:center; justify-content:space-between;
  padding:5px 0; border-bottom:1px solid rgba(54,54,54,.5);
  cursor:pointer; transition:all .1s; border-radius:3px; padding:6px 4px;
}
.demo-row:last-child { border-bottom:none; }
.demo-row:hover { background:var(--hover); }
.demo-row:hover .demo-fill { opacity:1; }
.demo-email { font-size:12px; color:var(--text2); font-family:'IBM Plex Mono',monospace; }
.demo-role  { font-size:11px; color:var(--text3); }
.demo-fill  { font-size:11px; color:var(--blue); opacity:0; transition:opacity .1s; }

/* ── APP LAYOUT ── */
.app { display:flex; min-height:100vh; }

/* ── SIDEBAR ── */
.sb {
  width:240px; min-height:100vh; background:var(--bg2);
  border-right:1px solid var(--border);
  display:flex; flex-direction:column;
  position:fixed; left:0; top:0; bottom:0; z-index:100;
  overflow-y:auto;
}
.sb-ws {
  padding:12px 10px 10px;
  display:flex; align-items:center; gap:9px;
  border-radius:var(--r); margin:6px 6px 2px;
}
.ws-icon {
  width:26px; height:26px; border-radius:5px;
  background:linear-gradient(135deg,#5b8df5,#9b7fe8);
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:700; color:#fff; flex-shrink:0;
}
.ws-name { font-size:13.5px; font-weight:600; }
.ws-plan { font-size:11px; color:var(--text3); margin-top:-1px; }

.sb-sec { padding:10px 12px 3px; font-size:10.5px; font-weight:600; color:var(--text3); text-transform:uppercase; letter-spacing:.06em; }
.sb-item {
  display:flex; align-items:center; gap:8px;
  padding:5px 10px; margin:1px 4px;
  border-radius:var(--r); cursor:pointer; transition:background .1s;
  color:var(--text2); font-size:13.5px; font-weight:400;
  white-space:nowrap; overflow:hidden;
}
.sb-item:hover  { background:var(--hover); color:var(--text); }
.sb-item.active { background:var(--hover); color:var(--text); font-weight:500; }
.sb-item .ico   { width:18px; height:18px; flex-shrink:0; opacity:.65; }
.sb-item.active .ico { opacity:1; }
.sb-item .badge {
  margin-left:auto; font-size:11px;
  background:var(--panel2); color:var(--text3);
  padding:1px 7px; border-radius:10px; font-weight:500;
}
.sb-footer { margin-top:auto; padding:8px; border-top:1px solid var(--border); }
.user-row {
  display:flex; align-items:center; gap:9px;
  padding:7px 8px; border-radius:var(--r);
}
.u-avatar {
  width:28px; height:28px; border-radius:6px;
  background:linear-gradient(135deg,#5b8df5,#9b7fe8);
  display:flex; align-items:center; justify-content:center;
  font-size:12px; font-weight:700; color:#fff; flex-shrink:0;
}
.u-name { font-size:13px; font-weight:500; }
.u-sub  { font-size:11px; color:var(--text3); margin-top:-1px; }
.signout-btn {
  display:flex; align-items:center; gap:7px;
  padding:5px 10px; margin:1px 4px;
  border-radius:var(--r); cursor:pointer; transition:background .1s;
  color:var(--red); font-size:13px; font-weight:500;
  background:transparent; border:none; font-family:'DM Sans',sans-serif;
  width:calc(100% - 8px);
}
.signout-btn:hover { background:var(--red-bg); }

/* ── MAIN ── */
.main { margin-left:240px; flex:1; display:flex; flex-direction:column; }
.topbar {
  padding:0 32px; display:flex; align-items:center; justify-content:space-between;
  border-bottom:1px solid var(--border); background:var(--bg);
  position:sticky; top:0; z-index:50; height:48px;
}
.breadcrumb { display:flex; align-items:center; gap:6px; font-size:13.5px; color:var(--text2); }
.bc-sep { opacity:.4; }
.bc-cur { color:var(--text); font-weight:500; }
.topbar-r { display:flex; align-items:center; gap:6px; }
.pg-head { padding:40px 48px 20px; }
.pg-emoji { font-size:2.6rem; margin-bottom:10px; display:block; }
.pg-title { font-family:'Instrument Serif',serif; font-size:2rem; font-weight:400; line-height:1.2; margin-bottom:5px; }
.pg-sub   { font-size:13.5px; color:var(--text2); }
.content  { padding:0 48px 48px; }
.ndiv     { height:1px; background:var(--border); margin:0 -48px 24px; opacity:.6; }

/* ── CALLOUTS ── */
.callout {
  display:flex; align-items:flex-start; gap:10px;
  padding:11px 13px; border-radius:var(--r2);
  font-size:13.5px; margin-bottom:16px; border:1px solid transparent;
}
.c-blue   { background:var(--blue-bg);   border-color:rgba(91,141,245,.2);  color:#8ab0f8; }
.c-green  { background:var(--green-bg);  border-color:rgba(76,175,125,.2);  color:#6ac995; }
.c-yellow { background:var(--yellow-bg); border-color:rgba(212,168,67,.2);  color:#e6ba5d; }
.c-red    { background:var(--red-bg);    border-color:rgba(224,92,92,.2);   color:#f08080; }
.c-icon   { font-size:15px; flex-shrink:0; margin-top:2px; }
.c-body   { line-height:1.6; }

/* ── STAT CARDS ── */
.stat-row { display:flex; gap:12px; margin-bottom:26px; flex-wrap:wrap; }
.sc {
  flex:1; min-width:140px;
  background:var(--panel); border:1px solid var(--border);
  border-radius:var(--r2); padding:16px 18px; transition:border-color .2s;
}
.sc:hover { border-color:var(--border2); }
.sc-lbl { font-size:11.5px; color:var(--text3); text-transform:uppercase; letter-spacing:.06em; margin-bottom:7px; }
.sc-val { font-family:'Instrument Serif',serif; font-size:2rem; font-weight:400; line-height:1; }
.sc-sub { font-size:11.5px; color:var(--text3); margin-top:5px; }
.sc-blue   .sc-val { color:var(--blue); }
.sc-green  .sc-val { color:var(--green); }
.sc-yellow .sc-val { color:var(--yellow); }
.sc-red    .sc-val { color:var(--red); }

/* ── TABLE ── */
.tbl-wrap { background:var(--panel); border:1px solid var(--border); border-radius:var(--r2); overflow:hidden; }
.tbl-head {
  padding:11px 16px; border-bottom:1px solid var(--border);
  font-size:12px; font-weight:600; color:var(--text2);
  display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;
}
table { width:100%; border-collapse:collapse; }
thead th {
  padding:8px 14px; text-align:left;
  font-size:11px; font-weight:600; text-transform:uppercase;
  letter-spacing:.05em; color:var(--text3);
  background:var(--panel); border-bottom:1px solid var(--border); white-space:nowrap;
}
tbody td { padding:10px 14px; font-size:13.5px; border-bottom:1px solid rgba(54,54,54,.6); vertical-align:middle; }
tbody tr:last-child td { border-bottom:none; }
tbody tr { transition:background .1s; }
tbody tr:hover td { background:var(--hover); }

/* ── TAGS ── */
.tag { display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:4px; font-size:11.5px; font-weight:500; white-space:nowrap; }
.t-blue   { background:var(--blue-bg);   color:#8ab0f8; }
.t-green  { background:var(--green-bg);  color:#6ac995; }
.t-yellow { background:var(--yellow-bg); color:#e6ba5d; }
.t-red    { background:var(--red-bg);    color:#f08080; }
.t-teal   { background:var(--teal-bg);   color:#6dccbe; }
.t-gray   { background:var(--panel2);    color:var(--text2); }
.t-purple { background:var(--purple-bg); color:#b99cf0; }

/* ── BUTTONS ── */
.btn {
  display:inline-flex; align-items:center; gap:6px;
  padding:6px 12px; border-radius:var(--r);
  font-family:'DM Sans',sans-serif; font-size:13px;
  font-weight:500; cursor:pointer; border:none; transition:all .15s; line-height:1.4;
}
.btn-pr { background:var(--blue); color:#fff; }
.btn-pr:hover { background:#6d9cf7; transform:translateY(-1px); box-shadow:0 3px 10px rgba(91,141,245,.35); }
.btn-pr:disabled { background:var(--panel2); color:var(--text3); cursor:not-allowed; transform:none; box-shadow:none; }
.btn-gh { background:transparent; color:var(--text2); border:1px solid var(--border); }
.btn-gh:hover { background:var(--hover); color:var(--text); border-color:var(--border2); }
.btn-ok { background:var(--green-bg); color:#6ac995; border:1px solid rgba(76,175,125,.3); }
.btn-ok:hover { background:rgba(76,175,125,.2); }
.btn-ng { background:var(--red-bg); color:#f08080; border:1px solid rgba(224,92,92,.3); }
.btn-ng:hover { background:rgba(224,92,92,.2); }
.btn-full { width:100%; justify-content:center; padding:9px 14px; font-size:14px; }
.btn-sm  { padding:4px 9px; font-size:12px; }
.btn-ico { padding:5px; width:28px; height:28px; justify-content:center; }

/* ── SEARCH ── */
.srch { display:flex; align-items:center; gap:7px; background:var(--panel); border:1px solid var(--border); border-radius:var(--r); padding:5px 10px; transition:border-color .15s; }
.srch:focus-within { border-color:var(--blue); }
.srch input { background:transparent; border:none; outline:none; color:var(--text); font-family:'DM Sans',sans-serif; font-size:13px; width:190px; }
.srch input::placeholder { color:var(--text3); }
.srch-ico { color:var(--text3); flex-shrink:0; }

/* ── SELECT ── */
.sel { background:var(--panel); border:1px solid var(--border); border-radius:var(--r); padding:5px 10px; color:var(--text2); font-family:'DM Sans',sans-serif; font-size:12.5px; cursor:pointer; outline:none; transition:border-color .15s; }
.sel:hover { border-color:var(--border2); }
.sel:focus { border-color:var(--blue); }
.sel option { background:var(--panel2); }

/* ── TABS ── */
.ttabs { display:flex; gap:2px; background:var(--panel); border:1px solid var(--border); border-radius:var(--r); padding:3px; }
.ttab { padding:4px 12px; border-radius:4px; font-size:12.5px; font-weight:500; cursor:pointer; color:var(--text3); transition:all .15s; border:none; background:transparent; font-family:'DM Sans',sans-serif; }
.ttab:hover { color:var(--text2); }
.ttab.on { background:var(--panel2); color:var(--text); box-shadow:0 1px 3px rgba(0,0,0,.3); }

/* ── PROGRESS TRACKER ── */
.prog-block { background:var(--panel); border:1px solid var(--border); border-radius:var(--r2); padding:22px; margin-bottom:20px; }
.prog-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
.prog-lbl { font-size:11.5px; font-weight:600; color:var(--text3); text-transform:uppercase; letter-spacing:.06em; }
.dept-track { display:grid; grid-template-columns:repeat(5,1fr); gap:0; position:relative; }
.dn { display:flex; flex-direction:column; align-items:center; position:relative; }
.dn::after { content:''; position:absolute; top:17px; left:50%; right:-50%; height:2px; z-index:0; }
.dn:last-child::after { display:none; }
.dn-done::after  { background:var(--green); }
.dn-act::after   { background:linear-gradient(90deg,var(--blue),var(--border)); }
.dn-rej::after   { background:var(--red); }
.dn-pend::after  { background:var(--border); }
.dc { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:600; z-index:1; border:2px solid; transition:all .25s; }
.dc-done { background:var(--green-bg); border-color:var(--green); color:var(--green); }
.dc-act  { background:var(--blue-bg);  border-color:var(--blue);  color:var(--blue);  box-shadow:0 0 12px rgba(91,141,245,.3); }
.dc-rej  { background:var(--red-bg);   border-color:var(--red);   color:var(--red); }
.dc-pend { background:var(--panel2);   border-color:var(--border2); color:var(--text3); }
.dl { font-size:11px; text-align:center; margin-top:7px; color:var(--text3); line-height:1.3; }
.dl-done { color:var(--green); } .dl-act { color:var(--blue); } .dl-rej { color:var(--red); }
.ds { font-size:10px; margin-top:3px; text-align:center; color:var(--text3); }

/* ── QUEUE ITEMS ── */
.qi { display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-radius:var(--r); transition:background .1s; gap:12px; }
.qi:hover { background:var(--hover); }
.qi + .qi { border-top:1px solid var(--border); }
.qi-name { font-size:13.5px; font-weight:500; }
.qi-meta { font-size:12px; color:var(--text3); margin-top:1px; }
.qi-act  { display:flex; gap:6px; flex-shrink:0; }

/* ── MODAL ── */
.overlay { position:fixed; inset:0; z-index:1000; background:rgba(0,0,0,.65); backdrop-filter:blur(6px); display:flex; align-items:center; justify-content:center; animation:fadein .15s; padding:24px; }
.modal { background:var(--panel); border:1px solid var(--border2); border-radius:12px; padding:28px; width:520px; max-width:100%; max-height:90vh; overflow-y:auto; box-shadow:var(--shadow); animation:slideup .2s; }
.modal-lg { width:660px; }
.modal-top { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:22px; gap:12px; }
.modal-h   { font-family:'Instrument Serif',serif; font-size:1.4rem; font-weight:400; }
.modal-sub { font-size:12px; color:var(--text3); margin-top:3px; }
.mx { width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:var(--r); cursor:pointer; color:var(--text3); background:transparent; border:1px solid transparent; transition:all .15s; flex-shrink:0; }
.mx:hover { background:var(--hover2); color:var(--text); border-color:var(--border); }
@keyframes fadein  { from{opacity:0} to{opacity:1} }
@keyframes slideup { from{transform:translateY(16px);opacity:0} to{transform:translateY(0);opacity:1} }

/* ── FORM ── */
.fg  { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.ff  { grid-column:1/-1; }
.fld { display:flex; flex-direction:column; gap:5px; }
.flbl { font-size:11.5px; font-weight:600; color:var(--text3); text-transform:uppercase; letter-spacing:.05em; }
.finp,.fsel,.ftxt {
  background:var(--bg2); border:1px solid var(--border); border-radius:var(--r);
  padding:8px 11px; color:var(--text); font-family:'DM Sans',sans-serif; font-size:13.5px; outline:none; transition:border-color .15s;
}
.finp:focus,.fsel:focus,.ftxt:focus { border-color:var(--blue); box-shadow:0 0 0 3px rgba(91,141,245,.1); }
.finp.err { border-color:var(--red); }
.ftxt { resize:vertical; min-height:72px; }
.fsel option { background:var(--bg2); }
.ffoot { display:flex; gap:8px; justify-content:flex-end; padding-top:18px; margin-top:6px; border-top:1px solid var(--border); }

/* password input wrapper */
.pw-wrap { position:relative; }
.pw-wrap .finp { width:100%; padding-right:38px; }
.pw-toggle { position:absolute; right:10px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--text3); padding:2px; transition:color .15s; }
.pw-toggle:hover { color:var(--text2); }

/* ── PROPERTIES ── */
.props { background:var(--bg2); border:1px solid var(--border); border-radius:var(--r2); overflow:hidden; margin-bottom:18px; }
.prow { display:flex; align-items:center; padding:7px 13px; border-bottom:1px solid var(--border); gap:12px; min-height:36px; }
.prow:last-child { border-bottom:none; }
.pname { font-size:12.5px; color:var(--text3); width:130px; flex-shrink:0; }
.pval  { font-size:13.5px; flex:1; }

/* ── DEPT STATUS ── */
.sb-block { background:var(--panel); border:1px solid var(--border); border-radius:var(--r2); overflow:hidden; }
.sb-bh { padding:11px 16px; border-bottom:1px solid var(--border); font-size:12px; font-weight:600; color:var(--text2); display:flex; align-items:center; justify-content:space-between; }
.dsr { display:flex; align-items:center; justify-content:space-between; padding:9px 14px; border-bottom:1px solid var(--border); transition:background .1s; }
.dsr:last-child { border-bottom:none; }
.dsr:hover { background:var(--hover); }
.dsr-l { display:flex; align-items:center; gap:8px; font-size:13.5px; }

/* ── ACTIVITY ── */
.act-feed { padding:0 16px; }
.act-item { display:flex; gap:11px; padding:9px 0; border-bottom:1px solid rgba(54,54,54,.5); }
.act-item:last-child { border-bottom:none; }
.a-dot  { width:7px; height:7px; border-radius:50%; flex-shrink:0; margin-top:5px; }
.a-text { font-size:12.5px; line-height:1.55; }
.a-time { font-size:11px; color:var(--text3); margin-top:2px; }

/* ── BAR CHART ── */
.bar-chart { display:flex; flex-direction:column; gap:10px; }
.bar-item { display:flex; align-items:center; gap:10px; }
.bar-lbl  { font-size:12.5px; color:var(--text2); width:115px; flex-shrink:0; }
.bar-track { flex:1; height:7px; background:var(--panel2); border-radius:4px; overflow:hidden; }
.bar-fill  { height:100%; border-radius:4px; transition:width .5s ease; }
.bar-cnt   { font-size:12px; font-weight:600; color:var(--text3); width:22px; text-align:right; }

/* ── CERT ── */
.cert { border:1px solid var(--border2); border-radius:var(--r2); padding:32px 36px; text-align:center; background:linear-gradient(160deg,var(--panel),var(--bg2)); }
.cert-mark { font-size:2.2rem; margin-bottom:12px; }
.cert-ttl  { font-family:'Instrument Serif',serif; font-size:1.8rem; font-weight:400; color:var(--text); margin-bottom:4px; }
.cert-org  { font-size:11.5px; color:var(--text3); letter-spacing:.1em; text-transform:uppercase; margin-bottom:24px; }
.cert-name { font-family:'Instrument Serif',serif; font-size:1.4rem; color:var(--text); }
.cert-idl  { font-size:12px; color:var(--text3); margin-bottom:18px; margin-top:2px; }
.cert-body { font-size:13px; color:var(--text2); line-height:1.8; max-width:380px; margin:0 auto 20px; }
.cert-depts { display:flex; flex-wrap:wrap; gap:6px; justify-content:center; margin-bottom:20px; }
.cert-chip { padding:3px 9px; border-radius:4px; font-size:11.5px; background:var(--green-bg); color:var(--green); border:1px solid rgba(76,175,125,.2); }
.cert-clrd { font-size:12.5px; font-weight:600; color:var(--green); letter-spacing:.05em; text-transform:uppercase; }
.cert-foot { font-size:11px; color:var(--text3); margin-top:20px; padding-top:16px; border-top:1px solid var(--border); }
.cert-ref  { font-family:'IBM Plex Mono',monospace; font-size:10px; color:var(--text3); margin-top:4px; }

/* ── NOTIF ── */
.npanel { position:absolute; top:calc(100% + 6px); right:0; width:320px; background:var(--panel); border:1px solid var(--border2); border-radius:var(--r2); box-shadow:var(--shadow); z-index:200; animation:slideup .15s; overflow:hidden; }
.np-head { padding:11px 14px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
.np-ttl  { font-size:13px; font-weight:600; }
.np-item { display:flex; gap:10px; padding:10px 14px; border-bottom:1px solid rgba(54,54,54,.5); cursor:pointer; transition:background .1s; }
.np-item:last-child { border-bottom:none; }
.np-item:hover { background:var(--hover); }
.np-dot  { width:7px; height:7px; border-radius:50%; flex-shrink:0; margin-top:5px; }
.np-txt  { font-size:12.5px; line-height:1.5; }
.np-time { font-size:11px; color:var(--text3); margin-top:2px; }

/* ── TOAST ── */
.toast { position:fixed; bottom:24px; right:24px; background:var(--panel); border:1px solid var(--border2); border-radius:var(--r2); padding:12px 16px; font-size:13px; font-weight:500; box-shadow:var(--shadow); z-index:9999; animation:slideup .25s; display:flex; align-items:center; gap:8px; max-width:340px; }

/* ── EMPTY ── */
.empty { text-align:center; padding:56px 24px; color:var(--text3); }
.empty-ico { font-size:2.5rem; margin-bottom:12px; opacity:.6; }
.empty-h   { font-size:14px; color:var(--text2); font-weight:500; margin-bottom:6px; }
.empty-p   { font-size:13px; }

/* ── PROFILE MODAL ── */
.profile-avatar-lg {
  width:64px; height:64px; border-radius:14px;
  background:linear-gradient(135deg,#5b8df5,#9b7fe8);
  display:flex; align-items:center; justify-content:center;
  font-size:26px; font-weight:700; color:#fff; margin:0 auto 16px;
}

/* ── MISC ── */
.mono  { font-family:'IBM Plex Mono',monospace; font-size:12px; }
.two-col { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.dp-dots { display:flex; gap:3px; }
.dp-dot  { width:10px; height:10px; border-radius:2px; }
.sep-or  { display:flex; align-items:center; gap:10px; font-size:12px; color:var(--text3); margin:16px 0; }
.sep-or::before,.sep-or::after { content:''; flex:1; height:1px; background:var(--border); }

/* ── SPINNER ── */
.spin { display:inline-block; width:14px; height:14px; border:2px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:spin .6s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

@media(max-width:1100px){.stat-row{flex-wrap:wrap;}.sc{min-width:calc(50% - 6px);}}
@media(max-width:860px){.sb{width:200px;}.main{margin-left:200px;}.pg-head,.content{padding-left:24px;padding-right:24px;}.two-col{grid-template-columns:1fr;}}
`;

/* ─── CONSTANTS ──────────────────────────────────────────────────────────── */
const DEPTS = [
  { id:"library",  name:"Library",   icon:"📚" },
  { id:"finance",  name:"Finance",   icon:"💰" },
  { id:"hostel",   name:"Hostel",    icon:"🏠" },
  { id:"academic", name:"Academic",  icon:"🎓" },
  { id:"ict",      name:"ICT / Lab", icon:"💻" },
];

// Seed user accounts — in production these would be hashed passwords in a DB
const SEED_USERS = [
  { id:"USR-001", email:"john@uni.edu",    password:"student123",  role:"student",    name:"John Amara",     studentId:"STU/2021/0042", program:"BSc Computer Science", year:"4" },
  { id:"USR-002", email:"ama@uni.edu",     password:"student123",  role:"student",    name:"Ama Owusu",      studentId:"STU/2021/0067", program:"BSc Accounting",       year:"4" },
  { id:"USR-003", email:"kofi@uni.edu",    password:"student123",  role:"student",    name:"Kofi Asante",    studentId:"STU/2020/0011", program:"BA Economics",         year:"5" },
  { id:"USR-004", email:"efua@uni.edu",    password:"student123",  role:"student",    name:"Efua Mensah",    studentId:"STU/2022/0093", program:"BSc Engineering",      year:"3" },
  { id:"USR-005", email:"samuel@uni.edu",  password:"student123",  role:"student",    name:"Samuel Darko",   studentId:"STU/2021/0088", program:"BSc IT",               year:"4" },
  { id:"USR-006", email:"abena@uni.edu",   password:"student123",  role:"student",    name:"Abena Kyei",     studentId:"STU/2022/0110", program:"BSc Nursing",          year:"3" },
  { id:"USR-007", email:"kwame@uni.edu",   password:"student123",  role:"student",    name:"Kwame Frimpong", studentId:"STU/2020/0034", program:"BSc Physics",          year:"5" },
  { id:"USR-008", email:"admin@uni.edu",   password:"admin123",    role:"admin",      name:"Dr. F. Osei",    staffId:"ADM/001" },
  { id:"USR-009", email:"library@uni.edu", password:"library123",  role:"department", name:"Mrs. A. Mensah", staffId:"DEP/LIB", dept:"library" },
  { id:"USR-010", email:"finance@uni.edu", password:"finance123",  role:"finance",    name:"Mr. K. Boateng", staffId:"FIN/003", dept:"finance" },
];

const SEED_REQUESTS = [
  { id:"CLR-2025-001", studentId:"STU/2021/0042", student:"John Amara",     program:"BSc Computer Science", year:"4", session:"2024/2025", reason:"Graduation",         status:"inprogress", submitted:"2025-05-10", notes:"",                    depts:{library:"approved",finance:"approved",hostel:"pending", academic:"pending", ict:"pending" } },
  { id:"CLR-2025-002", studentId:"STU/2021/0067", student:"Ama Owusu",      program:"BSc Accounting",       year:"4", session:"2024/2025", reason:"Graduation",         status:"pending",    submitted:"2025-05-12", notes:"",                    depts:{library:"pending", finance:"pending", hostel:"pending", academic:"pending", ict:"pending" } },
  { id:"CLR-2025-003", studentId:"STU/2020/0011", student:"Kofi Asante",    program:"BA Economics",         year:"5", session:"2024/2025", reason:"Transcript Request", status:"cleared",    submitted:"2025-04-28", notes:"Needed for NYSC.",    depts:{library:"approved",finance:"approved",hostel:"approved",academic:"approved",ict:"approved"} },
  { id:"CLR-2025-004", studentId:"STU/2022/0093", student:"Efua Mensah",    program:"BSc Engineering",      year:"3", session:"2024/2025", reason:"Transfer",           status:"rejected",   submitted:"2025-05-08", notes:"Transfer to KNUST.", depts:{library:"approved",finance:"rejected",hostel:"pending", academic:"pending", ict:"pending" } },
  { id:"CLR-2025-005", studentId:"STU/2021/0088", student:"Samuel Darko",   program:"BSc IT",               year:"4", session:"2024/2025", reason:"Graduation",         status:"inprogress", submitted:"2025-05-14", notes:"",                    depts:{library:"approved",finance:"pending", hostel:"approved",academic:"pending", ict:"approved"} },
  { id:"CLR-2025-006", studentId:"STU/2022/0110", student:"Abena Kyei",     program:"BSc Nursing",          year:"3", session:"2024/2025", reason:"Withdrawal",         status:"pending",    submitted:"2025-05-18", notes:"Medical withdrawal.", depts:{library:"pending", finance:"pending", hostel:"pending", academic:"pending", ict:"pending" } },
  { id:"CLR-2025-007", studentId:"STU/2020/0034", student:"Kwame Frimpong", program:"BSc Physics",          year:"5", session:"2024/2025", reason:"Graduation",         status:"inprogress", submitted:"2025-05-16", notes:"",                    depts:{library:"approved",finance:"approved",hostel:"pending", academic:"approved",ict:"pending" } },
];

const FEES_MAP = { "CLR-2025-001":9200,"CLR-2025-002":8750,"CLR-2025-003":10100,"CLR-2025-004":8400,"CLR-2025-005":9600,"CLR-2025-006":8200,"CLR-2025-007":9800 };
const getFee = id => FEES_MAP[id] || 8800;

const ACTIVITY = [
  { color:"var(--green)",  text:"Library approved clearance for John Amara",        time:"2 mins ago" },
  { color:"var(--yellow)", text:"New withdrawal request by Abena Kyei",              time:"18 mins ago" },
  { color:"var(--red)",    text:"Finance rejected Efua Mensah — outstanding fees",   time:"1 hr ago" },
  { color:"var(--teal)",   text:"Kofi Asante fully cleared — certificate ready",     time:"3 hrs ago" },
  { color:"var(--blue)",   text:"Admin override: ICT cleared Samuel Darko",          time:"Yesterday" },
  { color:"var(--green)",  text:"Hostel cleared Kwame Frimpong",                     time:"Yesterday" },
];

const DEMO_ACCOUNTS = [
  { email:"john@uni.edu",    password:"student123", label:"Student (John Amara)" },
  { email:"ama@uni.edu",     password:"student123", label:"Student (Ama Owusu)" },
  { email:"admin@uni.edu",   password:"admin123",   label:"Administrator" },
  { email:"library@uni.edu", password:"library123", label:"Library Officer" },
  { email:"finance@uni.edu", password:"finance123", label:"Finance Officer" },
];

/* ─── HELPERS ────────────────────────────────────────────────────────────── */
const recompute = d => {
  const v = Object.values(d);
  if (v.every(x => x === "approved")) return "cleared";
  if (v.some(x => x === "rejected"))  return "rejected";
  if (v.some(x => x === "approved"))  return "inprogress";
  return "pending";
};
const todayStr = () => new Date().toISOString().slice(0,10);

// localStorage helpers
const LS = {
  get: key => { try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : null; } catch { return null; } },
  set: (key, val) => { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} },
  del: key => { try { localStorage.removeItem(key); } catch {} },
};

/* ─── ICONS ──────────────────────────────────────────────────────────────── */
const Ico = ({ n, s = 15 }) => {
  const paths = {
    home:    ["M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z","M9 22V12h6v10"],
    users:   ["M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2","M9 7a4 4 0 100 8 4 4 0 000-8","M23 21v-2a4 4 0 00-3-3.87","M16 3.13a4 4 0 010 7.75"],
    bar:     ["M18 20V10","M12 20V4","M6 20v-6"],
    bell:    ["M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9","M13.73 21a2 2 0 01-3.46 0"],
    plus:    ["M12 5v14","M5 12h14"],
    srch:    ["M11 19a8 8 0 100-16 8 8 0 000 16z","M21 21l-4.35-4.35"],
    eye:     ["M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z","M12 9a3 3 0 100 6 3 3 0 000-6"],
    eyeoff:  ["M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24","M1 1l22 22"],
    dn:      ["M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4","M7 10l5 5 5-5","M12 15V3"],
    chk:     ["M20 6L9 17l-5-5"],
    x:       ["M18 6L6 18","M6 6l12 12"],
    cert:    ["M12 15l-2 5L7 9l11 4-5-2z"],
    inbox:   ["M22 12h-6l-2 3H10L8 12H2","M5.45 5.11L2 12v6a2 2 0 002 2h16a2 2 0 002-2v-6l-3.45-6.89A2 2 0 0016.76 4H7.24a2 2 0 00-1.79 1.11z"],
    rst:     ["M1 4v6h6","M3.51 15a9 9 0 102.13-9.36L1 10"],
    logout:  ["M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4","M16 17l5-5-5-5","M21 12H9"],
    user:    ["M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2","M12 11a4 4 0 100-8 4 4 0 000 8"],
    mail:    ["M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z","M22 6l-10 7L2 6"],
    lock:    ["M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z","M7 11V7a5 5 0 0110 0v4"],
    info:    ["M12 22a10 10 0 100-20 10 10 0 000 20z","M12 8h.01","M12 12v4"],
    shield:  ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"],
  };
  const ps = paths[n] || [];
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {ps.map((d, i) => <path key={i} d={d}/>)}
    </svg>
  );
};

/* ─── TAG ────────────────────────────────────────────────────────────────── */
const Tag = ({ status }) => {
  const m = { pending:["t-yellow","Pending"], approved:["t-green","Approved"], rejected:["t-red","Rejected"], cleared:["t-teal","Cleared"], inprogress:["t-blue","In Progress"] };
  const [c, l] = m[status] || ["t-gray", status];
  return <span className={`tag ${c}`}>{l}</span>;
};

/* ─── DEPT DOTS ──────────────────────────────────────────────────────────── */
const DeptDots = ({ depts }) => (
  <div className="dp-dots">
    {DEPTS.map(d => (
      <div key={d.id} title={`${d.name}: ${depts[d.id]}`} className="dp-dot" style={{
        background: depts[d.id]==="approved" ? "var(--green)" : depts[d.id]==="rejected" ? "var(--red)" : "var(--border2)"
      }}/>
    ))}
  </div>
);

/* ─── PROGRESS TRACKER ───────────────────────────────────────────────────── */
const ProgressTracker = ({ req }) => (
  <div className="prog-block">
    <div className="prog-top">
      <span className="prog-lbl">Clearance Progress</span>
      <Tag status={req.status}/>
    </div>
    <div className="dept-track">
      {DEPTS.map(dept => {
        const s = req.depts[dept.id];
        const nc = s==="approved"?"dn-done":s==="rejected"?"dn-rej":"dn-pend";
        const dc = s==="approved"?"dc-done":s==="rejected"?"dc-rej":"dc-pend";
        const lc = s==="approved"?"dl-done":s==="rejected"?"dl-rej":"";
        return (
          <div key={dept.id} className={`dn ${nc}`}>
            <div className={`dc ${dc}`}>{s==="approved"?"✓":s==="rejected"?"✗":dept.icon}</div>
            <div className={`dl ${lc}`}>{dept.name}</div>
            <div className="ds">{s==="approved"?"Cleared":s==="rejected"?"Rejected":"Awaiting"}</div>
          </div>
        );
      })}
    </div>
  </div>
);

/* ─── REQUEST DETAIL MODAL ───────────────────────────────────────────────── */
const ReqModal = ({ req, onClose, canAct, deptId, onAction }) => {
  const apv = Object.values(req.depts).filter(v=>v==="approved").length;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
        <div className="modal-top">
          <div>
            <div className="modal-h">{req.id}</div>
            <div className="modal-sub mono">{req.studentId} · {req.session} · {req.submitted}</div>
          </div>
          <button className="mx" onClick={onClose}><Ico n="x"/></button>
        </div>
        <div className="props">
          {[["Student",req.student],["Student ID",<span className="mono">{req.studentId}</span>],["Programme",req.program],["Year",`Year ${req.year}`],["Reason",req.reason],["Session",req.session],["Submitted",req.submitted],["Status",<Tag status={req.status}/>],["Progress",`${apv} / ${DEPTS.length} cleared`]].map(([k,v])=>(
            <div className="prow" key={k}><div className="pname">{k}</div><div className="pval">{v}</div></div>
          ))}
          {req.notes && <div className="prow"><div className="pname">Notes</div><div className="pval" style={{color:"var(--text2)",fontStyle:"italic"}}>{req.notes}</div></div>}
        </div>
        <div style={{fontSize:11,fontWeight:600,color:"var(--text3)",textTransform:"uppercase",letterSpacing:".06em",marginBottom:8}}>Departmental Status</div>
        <div className="sb-block" style={{marginBottom:18}}>
          {DEPTS.map(d=>(
            <div key={d.id} className="dsr"><div className="dsr-l"><span>{d.icon}</span><span>{d.name}</span></div><Tag status={req.depts[d.id]}/></div>
          ))}
        </div>
        {canAct && req.depts[deptId]==="pending" ? (
          <div className="ffoot" style={{paddingTop:0,marginTop:0,borderTop:"none"}}>
            <button className="btn btn-gh" onClick={onClose}>Cancel</button>
            <button className="btn btn-ng" onClick={()=>{onAction(req.id,"rejected");onClose();}}><Ico n="x" s={12}/> Reject</button>
            <button className="btn btn-ok" onClick={()=>{onAction(req.id,"approved");onClose();}}><Ico n="chk" s={12}/> Approve</button>
          </div>
        ) : (
          <div className="ffoot" style={{paddingTop:0,marginTop:0,borderTop:"none"}}>
            <button className="btn btn-gh" onClick={onClose}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── CERTIFICATE MODAL ──────────────────────────────────────────────────── */
const CertModal = ({ req, onClose }) => {
  const issued = new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});
  const ref = `CERT-${req.studentId.replace(/\//g,"")}-${req.id}`;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={e=>e.stopPropagation()}>
        <div className="modal-top">
          <div className="modal-h">Clearance Certificate</div>
          <button className="mx" onClick={onClose}><Ico n="x"/></button>
        </div>
        <div className="cert">
          <div className="cert-mark">🎓</div>
          <div className="cert-ttl">Certificate of Clearance</div>
          <div className="cert-org">University of Academic Excellence · ClearPath</div>
          <div style={{fontSize:12,color:"var(--text3)",marginBottom:12}}>This is to certify that</div>
          <div className="cert-name">{req.student}</div>
          <div className="cert-idl">{req.studentId} · {req.program} · Year {req.year}</div>
          <div className="cert-body">has been duly cleared by all university departments for the academic session <strong style={{color:"var(--text)"}}>{req.session}</strong>, for the purpose of <strong style={{color:"var(--text)"}}>{req.reason}</strong>.</div>
          <div className="cert-depts">{DEPTS.map(d=><span key={d.id} className="cert-chip">{d.icon} {d.name} ✓</span>)}</div>
          <div className="cert-clrd">✅ All Departments Cleared</div>
          <div className="cert-foot">Issued {issued} · ClearPath University Management System<div className="cert-ref">{ref}</div></div>
        </div>
        <div className="ffoot">
          <button className="btn btn-gh" onClick={onClose}>Close</button>
          <button className="btn btn-pr" onClick={()=>alert("In production, this generates a digitally signed PDF.")}><Ico n="dn" s={13}/> Download PDF</button>
        </div>
      </div>
    </div>
  );
};

/* ─── NEW REQUEST MODAL ──────────────────────────────────────────────────── */
const NewReqModal = ({ user, onClose, onSubmit }) => {
  const [f,setF] = useState({ reason:"Graduation", session:"2024/2025", program:user.program||"", year:user.year||"1", notes:"" });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-top">
          <div><div className="modal-h">New Clearance Request</div><div className="modal-sub">As {user.name} · {user.studentId}</div></div>
          <button className="mx" onClick={onClose}><Ico n="x"/></button>
        </div>
        <div className="callout c-blue" style={{marginBottom:16}}>
          <span className="c-icon">ℹ️</span>
          <div className="c-body">Your request will be sent to all 5 departments simultaneously. Each will independently approve or reject.</div>
        </div>
        <div className="fg">
          <div className="fld"><label className="flbl">Session</label>
            <select className="fsel" value={f.session} onChange={e=>s("session",e.target.value)}>
              <option>2024/2025</option><option>2023/2024</option><option>2022/2023</option>
            </select>
          </div>
          <div className="fld"><label className="flbl">Reason</label>
            <select className="fsel" value={f.reason} onChange={e=>s("reason",e.target.value)}>
              <option>Graduation</option><option>Transcript Request</option><option>Transfer</option><option>Withdrawal</option>
            </select>
          </div>
          <div className="fld ff"><label className="flbl">Programme of Study</label>
            <input className="finp" value={f.program} onChange={e=>s("program",e.target.value)} placeholder="e.g. BSc Computer Science"/>
          </div>
          <div className="fld"><label className="flbl">Year of Study</label>
            <select className="fsel" value={f.year} onChange={e=>s("year",e.target.value)}>
              {[1,2,3,4,5].map(y=><option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="fld ff"><label className="flbl">Notes (optional)</label>
            <textarea className="ftxt" placeholder="Any additional information…" value={f.notes} onChange={e=>s("notes",e.target.value)}/>
          </div>
        </div>
        <div style={{marginTop:14,marginBottom:4}}>
          <div style={{fontSize:11,color:"var(--text3)",marginBottom:8,fontWeight:600,textTransform:"uppercase",letterSpacing:".05em"}}>Sent to</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>{DEPTS.map(d=><span key={d.id} className="tag t-gray">{d.icon} {d.name}</span>)}</div>
        </div>
        <div className="ffoot">
          <button className="btn btn-gh" onClick={onClose}>Cancel</button>
          <button className="btn btn-pr" onClick={()=>{onSubmit(f);onClose();}}><Ico n="plus" s={13}/> Submit</button>
        </div>
      </div>
    </div>
  );
};

/* ─── PROFILE MODAL ──────────────────────────────────────────────────────── */
const ProfileModal = ({ user, onClose, onChangePassword }) => {
  const [tab, setTab]     = useState("profile");
  const [pw, setPw]       = useState({ current:"", next:"", confirm:"" });
  const [showPw, setShowPw] = useState({ cur:false, nxt:false, cnf:false });
  const [msg, setMsg]     = useState(null);

  const handleChangePw = () => {
    if (!pw.current || !pw.next || !pw.confirm) { setMsg({ t:"err", m:"All fields required." }); return; }
    if (pw.next.length < 6) { setMsg({ t:"err", m:"Password must be at least 6 characters." }); return; }
    if (pw.next !== pw.confirm) { setMsg({ t:"err", m:"New passwords do not match." }); return; }
    const ok = onChangePassword(pw.current, pw.next);
    if (ok) { setMsg({ t:"ok", m:"Password updated successfully." }); setPw({ current:"", next:"", confirm:"" }); }
    else     setMsg({ t:"err", m:"Current password is incorrect." });
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-top">
          <div className="modal-h">Account</div>
          <button className="mx" onClick={onClose}><Ico n="x"/></button>
        </div>
        <div className="ttabs" style={{marginBottom:20}}>
          <button className={`ttab ${tab==="profile"?"on":""}`} onClick={()=>setTab("profile")}>Profile</button>
          <button className={`ttab ${tab==="security"?"on":""}`} onClick={()=>setTab("security")}>Security</button>
        </div>

        {tab==="profile" && (
          <>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div className="profile-avatar-lg">{user.name[0]}</div>
              <div style={{fontSize:"1.1rem",fontWeight:600}}>{user.name}</div>
              <div style={{fontSize:12,color:"var(--text3)",marginTop:3}}>{user.email}</div>
            </div>
            <div className="props">
              <div className="prow"><div className="pname">Role</div><div className="pval"><span className={`tag ${user.role==="student"?"t-blue":user.role==="admin"?"t-yellow":"t-green"}`}>{user.role}</span></div></div>
              {user.studentId && <div className="prow"><div className="pname">Student ID</div><div className="pval mono">{user.studentId}</div></div>}
              {user.staffId   && <div className="prow"><div className="pname">Staff ID</div>  <div className="pval mono">{user.staffId}</div></div>}
              {user.program   && <div className="prow"><div className="pname">Programme</div> <div className="pval">{user.program}</div></div>}
              {user.year      && <div className="prow"><div className="pname">Year</div>      <div className="pval">Year {user.year}</div></div>}
              <div className="prow"><div className="pname">Email</div><div className="pval">{user.email}</div></div>
            </div>
          </>
        )}

        {tab==="security" && (
          <>
            {msg && <div className={msg.t==="ok"?"auth-success":"auth-error"}><Ico n={msg.t==="ok"?"chk":"info"} s={14}/>{msg.m}</div>}
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[
                { label:"Current Password", key:"current", show:"cur" },
                { label:"New Password",     key:"next",    show:"nxt" },
                { label:"Confirm Password", key:"confirm", show:"cnf" },
              ].map(({label,key,show})=>(
                <div key={key} className="fld">
                  <label className="flbl">{label}</label>
                  <div className="pw-wrap">
                    <input className="finp" type={showPw[show]?"text":"password"} value={pw[key]}
                      onChange={e=>setPw(p=>({...p,[key]:e.target.value}))} placeholder="••••••••"/>
                    <button className="pw-toggle" onClick={()=>setShowPw(p=>({...p,[show]:!p[show]}))} type="button">
                      <Ico n={showPw[show]?"eyeoff":"eye"} s={14}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="ffoot">
              <button className="btn btn-gh" onClick={onClose}>Cancel</button>
              <button className="btn btn-pr" onClick={handleChangePw}><Ico n="shield" s={13}/> Update Password</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── NOTIFICATION PANEL ─────────────────────────────────────────────────── */
const NotifPanel = ({ onClose }) => (
  <div className="npanel">
    <div className="np-head"><span className="np-ttl">Notifications</span><button style={{fontSize:11.5,color:"var(--text3)",background:"none",border:"none",cursor:"pointer"}} onClick={onClose}>Mark all read</button></div>
    {ACTIVITY.map((a,i)=>(
      <div key={i} className="np-item"><div className="np-dot" style={{background:a.color}}/><div><div className="np-txt">{a.text}</div><div className="np-time">{a.time}</div></div></div>
    ))}
  </div>
);

/* ════════════════════════════════════════════════════════════════════════════
   AUTH SCREENS
══════════════════════════════════════════════════════════════════════════════*/

/* ─── LOGIN SCREEN ───────────────────────────────────────────────────────── */
const LoginScreen = ({ onLogin, onGoRegister }) => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) { setError("Please enter your email and password."); return; }
    setLoading(true);
    const err = await onLogin(email.trim().toLowerCase(), password);
    setLoading(false);
    if (err) setError(err);
  };

  const fillDemo = (acc) => { setEmail(acc.email); setPassword(acc.password); setError(""); };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">C</div>
          <div className="auth-logo-name">ClearPath</div>
          <div className="auth-logo-sub">University Clearance System</div>
        </div>

        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your account to continue</div>

        {error && <div className="auth-error"><Ico n="info" s={14}/>{error}</div>}

        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="fld">
            <label className="flbl">Email Address</label>
            <div style={{position:"relative"}}>
              <input className="finp" style={{width:"100%",paddingLeft:36}} type="email" placeholder="you@uni.edu"
                value={email} onChange={e=>{setEmail(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
              <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"var(--text3)",pointerEvents:"none"}}><Ico n="mail" s={14}/></span>
            </div>
          </div>
          <div className="fld">
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <label className="flbl">Password</label>
              <button onClick={()=>{}} style={{fontSize:11.5,color:"var(--blue)",background:"none",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Forgot password?</button>
            </div>
            <div className="pw-wrap">
              <input className="finp" type={showPw?"text":"password"} placeholder="••••••••"
                value={password} onChange={e=>{setPassword(e.target.value);setError("");}}
                onKeyDown={e=>e.key==="Enter"&&handleLogin()}/>
              <button className="pw-toggle" onClick={()=>setShowPw(v=>!v)} type="button">
                <Ico n={showPw?"eyeoff":"eye"} s={14}/>
              </button>
            </div>
          </div>
          <button className="btn btn-pr btn-full" onClick={handleLogin} disabled={loading}>
            {loading ? <><span className="spin"/>&nbsp;Signing in…</> : <><Ico n="user" s={14}/> Sign In</>}
          </button>
        </div>

        <div className="auth-divider"/>
        <div className="auth-switch">Don't have an account? <a onClick={onGoRegister}>Create one</a></div>

        {/* Demo shortcuts */}
        <div className="demo-accounts">
          <div className="demo-accounts-title">Demo Accounts — click to fill</div>
          {DEMO_ACCOUNTS.map(acc=>(
            <div key={acc.email} className="demo-row" onClick={()=>fillDemo(acc)}>
              <div>
                <div className="demo-email">{acc.email}</div>
                <div className="demo-role">{acc.label}</div>
              </div>
              <div className="demo-fill">Fill ↗</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── REGISTER SCREEN ────────────────────────────────────────────────────── */
const RegisterScreen = ({ onRegister, onGoLogin }) => {
  const [f, setF] = useState({ name:"", email:"", studentId:"", program:"", year:"1", password:"", confirm:"" });
  const [showPw, setShowPw] = useState(false);
  const [error,  setError]  = useState("");
  const [loading,setLoading]= useState(false);
  const set = (k,v) => { setF(p=>({...p,[k]:v})); setError(""); };

  const handleRegister = async () => {
    setError("");
    if (!f.name.trim())      { setError("Full name is required."); return; }
    if (!f.email.trim())     { setError("Email address is required."); return; }
    if (!/\S+@\S+\.\S+/.test(f.email)) { setError("Please enter a valid email address."); return; }
    if (!f.studentId.trim()) { setError("Student ID is required."); return; }
    if (!f.program.trim())   { setError("Programme of study is required."); return; }
    if (f.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (f.password !== f.confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const err = await onRegister({
      email: f.email.trim().toLowerCase(),
      password: f.password,
      name: f.name.trim(),
      studentId: f.studentId.trim().toUpperCase(),
      program: f.program.trim(),
      year: f.year,
    });
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card" style={{maxWidth:460}}>
        <div className="auth-logo">
          <div className="auth-logo-icon">C</div>
          <div className="auth-logo-name">ClearPath</div>
          <div className="auth-logo-sub">University Clearance System</div>
        </div>

        <div className="auth-title">Create your account</div>
        <div className="auth-sub">Register as a student to apply for clearance</div>

        {error && <div className="auth-error"><Ico n="info" s={14}/>{error}</div>}

        <div className="fg" style={{gap:14}}>
          <div className="fld ff">
            <label className="flbl">Full Name</label>
            <input className="finp" placeholder="e.g. John Amara" value={f.name} onChange={e=>set("name",e.target.value)}/>
          </div>
          <div className="fld ff">
            <label className="flbl">University Email</label>
            <input className="finp" type="email" placeholder="you@uni.edu" value={f.email} onChange={e=>set("email",e.target.value)}/>
          </div>
          <div className="fld">
            <label className="flbl">Student ID</label>
            <input className="finp" placeholder="e.g. STU/2024/0001" value={f.studentId} onChange={e=>set("studentId",e.target.value)}/>
          </div>
          <div className="fld">
            <label className="flbl">Year of Study</label>
            <select className="fsel" value={f.year} onChange={e=>set("year",e.target.value)}>
              {[1,2,3,4,5].map(y=><option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="fld ff">
            <label className="flbl">Programme of Study</label>
            <input className="finp" placeholder="e.g. BSc Computer Science" value={f.program} onChange={e=>set("program",e.target.value)}/>
          </div>
          <div className="fld">
            <label className="flbl">Password</label>
            <div className="pw-wrap">
              <input className="finp" type={showPw?"text":"password"} placeholder="Min. 6 characters"
                value={f.password} onChange={e=>set("password",e.target.value)}/>
              <button className="pw-toggle" onClick={()=>setShowPw(v=>!v)} type="button"><Ico n={showPw?"eyeoff":"eye"} s={14}/></button>
            </div>
          </div>
          <div className="fld">
            <label className="flbl">Confirm Password</label>
            <input className="finp" type="password" placeholder="Repeat password"
              value={f.confirm} onChange={e=>set("confirm",e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&handleRegister()}/>
          </div>
        </div>

        <button className="btn btn-pr btn-full" style={{marginTop:20}} onClick={handleRegister} disabled={loading}>
          {loading ? <><span className="spin"/>&nbsp;Creating account…</> : <><Ico n="user" s={14}/> Create Account</>}
        </button>

        <div className="auth-divider"/>
        <div className="auth-switch">Already have an account? <a onClick={onGoLogin}>Sign in</a></div>

        <div className="callout c-blue" style={{marginTop:16,marginBottom:0}}>
          <span className="c-icon">🔒</span>
          <div className="c-body" style={{fontSize:12}}>Staff accounts (admin, library, finance) are created by the university IT department and cannot self-register.</div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   DASHBOARD VIEWS
══════════════════════════════════════════════════════════════════════════════*/

/* ─── STUDENT VIEW ───────────────────────────────────────────────────────── */
const StudentView = ({ user, requests, setModal, setCert }) => {
  const mine = requests.filter(r=>r.studentId===user.studentId);
  const lat  = mine[mine.length-1];
  const done   = lat ? Object.values(lat.depts).filter(v=>v==="approved").length : 0;
  const issues = lat ? Object.values(lat.depts).filter(v=>v==="rejected").length : 0;
  const [vr, setVr] = useState(null);

  return (
    <>
      <div className="stat-row">
        <div className="sc sc-blue"><div className="sc-lbl">Status</div><div className="sc-val">{lat?(lat.status==="cleared"?"✓":`${done}/5`):"—"}</div><div className="sc-sub">{lat?"depts cleared":"no request"}</div></div>
        <div className="sc sc-yellow"><div className="sc-lbl">Pending</div><div className="sc-val">{lat?5-done-issues:"—"}</div><div className="sc-sub">depts awaiting</div></div>
        <div className="sc sc-red"><div className="sc-lbl">Issues</div><div className="sc-val">{lat?issues:0}</div><div className="sc-sub">depts rejected</div></div>
        <div className="sc sc-green"><div className="sc-lbl">Requests</div><div className="sc-val">{mine.length}</div><div className="sc-sub">total submitted</div></div>
      </div>

      {!lat && <div className="callout c-blue"><span className="c-icon">ℹ️</span><div className="c-body">No clearance request yet. Click <strong>New Request</strong> to begin.</div></div>}
      {lat?.status==="cleared"  && <div className="callout c-green"><span className="c-icon">🎉</span><div className="c-body"><strong>Fully Cleared!</strong> All departments approved. Download your certificate below.</div></div>}
      {lat?.status==="rejected" && <div className="callout c-red"><span className="c-icon">⛔</span><div className="c-body"><strong>Clearance Blocked.</strong> Contact the relevant department(s) to resolve the issue.</div></div>}

      {lat && <ProgressTracker req={lat}/>}

      <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
        <button className="btn btn-pr" onClick={()=>setModal("new")}><Ico n="plus" s={13}/> New Request</button>
        {lat?.status==="cleared" && <button className="btn btn-ok" onClick={()=>setCert(lat)}><Ico n="cert" s={13}/> Certificate</button>}
      </div>

      <div className="tbl-wrap">
        <div className="tbl-head">
          <span>MY REQUESTS</span>
          <span style={{fontSize:12,color:"var(--text3)"}}>{mine.length} total</span>
        </div>
        {mine.length===0 ? (
          <div className="empty"><div className="empty-ico">📋</div><div className="empty-h">No requests yet</div><div className="empty-p">Click New Request to start.</div></div>
        ) : (
          <table>
            <thead><tr><th>Request ID</th><th>Reason</th><th>Session</th><th>Date</th><th>Progress</th><th>Status</th><th></th></tr></thead>
            <tbody>
              {mine.map(r=>(
                <tr key={r.id}>
                  <td><span className="mono" style={{color:"var(--blue)"}}>{r.id}</span></td>
                  <td>{r.reason}</td>
                  <td style={{color:"var(--text2)"}}>{r.session}</td>
                  <td style={{color:"var(--text3)"}}>{r.submitted}</td>
                  <td><DeptDots depts={r.depts}/></td>
                  <td><Tag status={r.status}/></td>
                  <td>
                    <div style={{display:"flex",gap:4}}>
                      <button className="btn btn-gh btn-sm" onClick={()=>setVr(r)}><Ico n="eye" s={12}/> View</button>
                      {r.status==="cleared" && <button className="btn btn-ok btn-sm" onClick={()=>setCert(r)}><Ico n="cert" s={11}/></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {vr && <ReqModal req={vr} onClose={()=>setVr(null)} canAct={false}/>}
    </>
  );
};

/* ─── ADMIN VIEW ─────────────────────────────────────────────────────────── */
const AdminView = ({ requests, setRequests }) => {
  const [tab,  setTab]  = useState("overview");
  const [q,    setQ]    = useState("");
  const [fil,  setFil]  = useState("all");
  const [vr,   setVr]   = useState(null);

  const st = { total:requests.length, cleared:requests.filter(r=>r.status==="cleared").length, prog:requests.filter(r=>r.status==="inprogress").length, block:requests.filter(r=>r.status==="pending"||r.status==="rejected").length };

  const filtered = useMemo(()=>requests.filter(r=>{
    const m = !q || [r.student,r.studentId,r.id,r.program].some(v=>v.toLowerCase().includes(q.toLowerCase()));
    return m && (fil==="all"||r.status===fil);
  }),[requests,q,fil]);

  return (
    <>
      <div className="stat-row">
        <div className="sc sc-blue"><div className="sc-lbl">Total</div><div className="sc-val">{st.total}</div><div className="sc-sub">this session</div></div>
        <div className="sc sc-green"><div className="sc-lbl">Cleared</div><div className="sc-val">{st.cleared}</div><div className="sc-sub">certs ready</div></div>
        <div className="sc sc-yellow"><div className="sc-lbl">In Progress</div><div className="sc-val">{st.prog}</div><div className="sc-sub">processing</div></div>
        <div className="sc sc-red"><div className="sc-lbl">Needs Attention</div><div className="sc-val">{st.block}</div><div className="sc-sub">pending/blocked</div></div>
      </div>
      <div className="ttabs" style={{marginBottom:20}}>
        {["overview","requests","reports"].map(t=>(
          <button key={t} className={`ttab ${tab===t?"on":""}`} onClick={()=>setTab(t)}>{t.charAt(0).toUpperCase()+t.slice(1)}</button>
        ))}
      </div>

      {tab==="overview" && (
        <div className="two-col">
          <div className="sb-block">
            <div className="sb-bh">Department Queues</div>
            {DEPTS.map(dept=>{
              const pend=requests.filter(r=>r.depts[dept.id]==="pending").length;
              const appr=requests.filter(r=>r.depts[dept.id]==="approved").length;
              const pct=requests.length?Math.round((appr/requests.length)*100):0;
              return (
                <div key={dept.id} style={{display:"flex",alignItems:"center",padding:"10px 16px",borderBottom:"1px solid var(--border)",gap:10}}>
                  <span style={{fontSize:17}}>{dept.icon}</span>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13.5,fontWeight:500}}>{dept.name}</div>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginTop:4}}>
                      <div className="bar-track" style={{flex:1}}><div className="bar-fill" style={{width:`${pct}%`,background:"var(--green)"}}/></div>
                      <span style={{fontSize:11,color:"var(--text3)"}}>{appr}/{requests.length}</span>
                    </div>
                  </div>
                  <span className="tag t-yellow">{pend} pending</span>
                </div>
              );
            })}
          </div>
          <div className="sb-block">
            <div className="sb-bh">Recent Activity</div>
            <div className="act-feed">
              {ACTIVITY.map((a,i)=>(
                <div key={i} className="act-item">
                  <div className="a-dot" style={{background:a.color}}/>
                  <div><div className="a-text">{a.text}</div><div className="a-time">{a.time}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab==="requests" && (
        <div className="tbl-wrap">
          <div className="tbl-head">
            <span>ALL REQUESTS ({filtered.length})</span>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <div className="srch"><span className="srch-ico"><Ico n="srch" s={13}/></span><input placeholder="Search…" value={q} onChange={e=>setQ(e.target.value)}/></div>
              <select className="sel" value={fil} onChange={e=>setFil(e.target.value)}>
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="cleared">Cleared</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          {filtered.length===0 ? <div className="empty"><div className="empty-ico">🔍</div><div className="empty-h">No results</div></div> : (
            <table>
              <thead><tr><th>ID</th><th>Student</th><th>Programme</th><th>Reason</th><th>Date</th><th>Progress</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filtered.map(r=>(
                  <tr key={r.id}>
                    <td><span className="mono" style={{color:"var(--blue)"}}>{r.id}</span></td>
                    <td><div style={{fontWeight:500}}>{r.student}</div><div className="mono" style={{color:"var(--text3)",fontSize:11}}>{r.studentId}</div></td>
                    <td style={{color:"var(--text2)",fontSize:12.5}}>{r.program}</td>
                    <td>{r.reason}</td>
                    <td style={{color:"var(--text3)"}}>{r.submitted}</td>
                    <td><DeptDots depts={r.depts}/></td>
                    <td><Tag status={r.status}/></td>
                    <td><button className="btn btn-gh btn-sm" onClick={()=>setVr(r)}><Ico n="eye" s={12}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab==="reports" && <AdminReports requests={requests}/>}
      {vr && <ReqModal req={vr} onClose={()=>setVr(null)} canAct={false}/>}
    </>
  );
};

/* ─── ADMIN REPORTS ──────────────────────────────────────────────────────── */
const AdminReports = ({ requests }) => {
  const total = requests.length||1;
  return (
    <>
      <div className="two-col" style={{marginBottom:16}}>
        <div className="sb-block">
          <div className="sb-bh">Status Breakdown</div>
          <div style={{padding:18}}>
            <div className="bar-chart">
              {[["Cleared","cleared","var(--teal)"],["In Progress","inprogress","var(--blue)"],["Pending","pending","var(--yellow)"],["Rejected","rejected","var(--red)"]].map(([l,s,c])=>{
                const n=requests.filter(r=>r.status===s).length;
                return <div key={l} className="bar-item"><span className="bar-lbl">{l}</span><div className="bar-track"><div className="bar-fill" style={{width:`${(n/total)*100}%`,background:c}}/></div><span className="bar-cnt">{n}</span></div>;
              })}
            </div>
          </div>
        </div>
        <div className="sb-block">
          <div className="sb-bh">By Reason</div>
          <div style={{padding:18}}>
            <div className="bar-chart">
              {["Graduation","Transcript Request","Transfer","Withdrawal"].map(r=>{
                const n=requests.filter(x=>x.reason===r).length;
                return <div key={r} className="bar-item"><span className="bar-lbl">{r}</span><div className="bar-track"><div className="bar-fill" style={{width:`${(n/total)*100}%`,background:"var(--purple)"}}/></div><span className="bar-cnt">{n}</span></div>;
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="tbl-wrap">
        <div className="tbl-head">Department Clearance Rates</div>
        <table>
          <thead><tr><th>Department</th><th>Approved</th><th>Rejected</th><th>Pending</th><th>Rate</th></tr></thead>
          <tbody>
            {DEPTS.map(d=>{
              const a=requests.filter(r=>r.depts[d.id]==="approved").length;
              const j=requests.filter(r=>r.depts[d.id]==="rejected").length;
              const p=requests.filter(r=>r.depts[d.id]==="pending").length;
              const rt=Math.round((a/total)*100);
              return (
                <tr key={d.id}>
                  <td>{d.icon} {d.name}</td>
                  <td style={{color:"var(--green)",fontWeight:600}}>{a}</td>
                  <td style={{color:"var(--red)",fontWeight:600}}>{j}</td>
                  <td style={{color:"var(--yellow)",fontWeight:600}}>{p}</td>
                  <td><div style={{display:"flex",alignItems:"center",gap:10}}><div className="bar-track"><div className="bar-fill" style={{width:`${rt}%`,background:"var(--green)"}}/></div><span style={{fontSize:12.5,fontWeight:600,color:"var(--green)",minWidth:32}}>{rt}%</span></div></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

/* ─── DEPT VIEW ──────────────────────────────────────────────────────────── */
const DeptView = ({ user, requests, setRequests }) => {
  const DEPT = user.dept || "library";
  const info = DEPTS.find(d=>d.id===DEPT);
  const [tab, setTab] = useState("queue");
  const [vr,  setVr]  = useState(null);
  const queue = requests.filter(r=>r.depts[DEPT]==="pending");
  const done  = requests.filter(r=>r.depts[DEPT]!=="pending");

  const act = (reqId, action) => {
    setRequests({ _apiAction: true, reqId, dept: DEPT, action });
  };

  return (
    <>
      <div className="stat-row">
        <div className="sc sc-blue"><div className="sc-lbl">Department</div><div className="sc-val" style={{fontSize:"1.5rem"}}>{info?.icon}</div><div className="sc-sub">{info?.name}</div></div>
        <div className="sc sc-yellow"><div className="sc-lbl">Queue</div><div className="sc-val">{queue.length}</div><div className="sc-sub">awaiting</div></div>
        <div className="sc sc-green"><div className="sc-lbl">Approved</div><div className="sc-val">{requests.filter(r=>r.depts[DEPT]==="approved").length}</div><div className="sc-sub">cleared</div></div>
        <div className="sc sc-red"><div className="sc-lbl">Rejected</div><div className="sc-val">{requests.filter(r=>r.depts[DEPT]==="rejected").length}</div><div className="sc-sub">declined</div></div>
      </div>

      {queue.length>0 && <div className="callout c-yellow"><span className="c-icon">📬</span><div className="c-body"><strong>{queue.length} student{queue.length>1?"s":""}</strong> in your approval queue.</div></div>}

      <div className="ttabs" style={{marginBottom:20}}>
        <button className={`ttab ${tab==="queue"?"on":""}`} onClick={()=>setTab("queue")}>Queue{queue.length>0&&` (${queue.length})`}</button>
        <button className={`ttab ${tab==="done"?"on":""}`} onClick={()=>setTab("done")}>Processed</button>
      </div>

      {tab==="queue" && (
        <div className="tbl-wrap">
          <div className="tbl-head">{info?.icon} {info?.name} — Pending Approvals</div>
          {queue.length===0 ? <div className="empty"><div className="empty-ico">✅</div><div className="empty-h">All caught up!</div></div> : queue.map(r=>(
            <div key={r.id} className="qi">
              <div>
                <div className="qi-name">{r.student} <span className="mono" style={{color:"var(--text3)",fontWeight:400}}>{r.studentId}</span></div>
                <div className="qi-meta">{r.program} · {r.reason} · {r.submitted}</div>
              </div>
              <div className="qi-act">
                <button className="btn btn-gh btn-sm" onClick={()=>setVr(r)}><Ico n="eye" s={12}/></button>
                <button className="btn btn-ng btn-sm" onClick={()=>act(r.id,"rejected")}><Ico n="x" s={11}/> Reject</button>
                <button className="btn btn-ok btn-sm" onClick={()=>act(r.id,"approved")}><Ico n="chk" s={11}/> Approve</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab==="done" && (
        <div className="tbl-wrap">
          <div className="tbl-head">Processed Records ({done.length})</div>
          {done.length===0 ? <div className="empty"><div className="empty-ico">📂</div><div className="empty-h">Nothing processed yet</div></div> : (
            <table>
              <thead><tr><th>Student</th><th>Programme</th><th>Reason</th><th>Date</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {done.map(r=>(
                  <tr key={r.id}>
                    <td><div style={{fontWeight:500}}>{r.student}</div><div className="mono" style={{color:"var(--text3)",fontSize:11}}>{r.studentId}</div></td>
                    <td style={{color:"var(--text2)",fontSize:12.5}}>{r.program}</td>
                    <td>{r.reason}</td>
                    <td style={{color:"var(--text3)"}}>{r.submitted}</td>
                    <td><Tag status={r.depts[DEPT]}/></td>
                    <td><button className="btn btn-gh btn-sm" onClick={()=>setVr(r)}><Ico n="eye" s={12}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      {vr && <ReqModal req={vr} onClose={()=>setVr(null)} canAct={true} deptId={DEPT} onAction={act}/>}
    </>
  );
};

/* ─── FINANCE VIEW ───────────────────────────────────────────────────────── */
const FinanceView = ({ requests, setRequests }) => {
  const DEPT = "finance";
  const [tab, setTab] = useState("queue");
  const [vr,  setVr]  = useState(null);
  const pend = requests.filter(r=>r.depts[DEPT]==="pending");
  const appr = requests.filter(r=>r.depts[DEPT]==="approved");
  const rej  = requests.filter(r=>r.depts[DEPT]==="rejected");
  const total = appr.reduce((s,r)=>s+getFee(r.id),0);

  const act = (reqId, action) => {
    setRequests({ _apiAction: true, reqId, dept: DEPT, action });
  };

  return (
    <>
      <div className="stat-row">
        <div className="sc sc-green"><div className="sc-lbl">Verified Revenue</div><div className="sc-val" style={{fontSize:"1.5rem"}}>GH₵{(total/1000).toFixed(0)}k</div><div className="sc-sub">fees settled</div></div>
        <div className="sc sc-yellow"><div className="sc-lbl">Pending</div><div className="sc-val">{pend.length}</div><div className="sc-sub">to verify</div></div>
        <div className="sc sc-blue"><div className="sc-lbl">Cleared</div><div className="sc-val">{appr.length}</div><div className="sc-sub">fees settled</div></div>
        <div className="sc sc-red"><div className="sc-lbl">Outstanding</div><div className="sc-val">{rej.length}</div><div className="sc-sub">unpaid</div></div>
      </div>

      {pend.length>0 && <div className="callout c-yellow"><span className="c-icon">⚠️</span><div className="c-body"><strong>{pend.length} students</strong> awaiting fee verification.</div></div>}

      <div className="ttabs" style={{marginBottom:20}}>
        <button className={`ttab ${tab==="queue"?"on":""}`} onClick={()=>setTab("queue")}>Queue{pend.length>0&&` (${pend.length})`}</button>
        <button className={`ttab ${tab==="report"?"on":""}`} onClick={()=>setTab("report")}>Finance Report</button>
      </div>

      {tab==="queue" && (
        <div className="tbl-wrap">
          <div className="tbl-head">💰 Fee Verification Queue</div>
          {pend.length===0 ? <div className="empty"><div className="empty-ico">✅</div><div className="empty-h">Queue empty</div></div> : (
            <table>
              <thead><tr><th>Student</th><th>Programme</th><th>Yr</th><th>Reason</th><th>Amount Due</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {pend.map(r=>(
                  <tr key={r.id}>
                    <td><div style={{fontWeight:500}}>{r.student}</div><div className="mono" style={{color:"var(--text3)",fontSize:11}}>{r.studentId}</div></td>
                    <td style={{color:"var(--text2)",fontSize:12.5}}>{r.program}</td>
                    <td>{r.year}</td>
                    <td>{r.reason}</td>
                    <td style={{color:"var(--yellow)",fontWeight:600}}>GH₵ {getFee(r.id).toLocaleString()}</td>
                    <td><Tag status="pending"/></td>
                    <td>
                      <div style={{display:"flex",gap:5}}>
                        <button className="btn btn-gh btn-sm" onClick={()=>setVr(r)}><Ico n="eye" s={12}/></button>
                        <button className="btn btn-ng btn-sm" onClick={()=>act(r.id,"rejected")}>Outstanding</button>
                        <button className="btn btn-ok btn-sm" onClick={()=>act(r.id,"approved")}><Ico n="chk" s={11}/> Cleared</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab==="report" && (
        <div className="tbl-wrap">
          <div className="tbl-head">
            Finance Report — 2024/2025
            <button className="btn btn-gh btn-sm" onClick={()=>alert("CSV export — would download in production.")}><Ico n="dn" s={12}/> Export CSV</button>
          </div>
          <table>
            <thead><tr><th>Student</th><th>Programme</th><th>Session</th><th>Amount</th><th>Finance</th><th>Overall</th><th></th></tr></thead>
            <tbody>
              {requests.map(r=>(
                <tr key={r.id}>
                  <td><div style={{fontWeight:500}}>{r.student}</div><div className="mono" style={{color:"var(--text3)",fontSize:11}}>{r.studentId}</div></td>
                  <td style={{color:"var(--text2)",fontSize:12.5}}>{r.program}</td>
                  <td style={{color:"var(--text3)"}}>{r.session}</td>
                  <td style={{fontWeight:600,color:r.depts[DEPT]==="approved"?"var(--green)":"var(--text3)"}}>{r.depts[DEPT]!=="pending"?`GH₵ ${getFee(r.id).toLocaleString()}`:"—"}</td>
                  <td><Tag status={r.depts[DEPT]}/></td>
                  <td><Tag status={r.status}/></td>
                  <td><button className="btn btn-gh btn-sm" onClick={()=>setVr(r)}><Ico n="eye" s={12}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {vr && <ReqModal req={vr} onClose={()=>setVr(null)} canAct={true} deptId={DEPT} onAction={act}/>}
    </>
  );
};

/* ════════════════════════════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════════════════════════════*/
export default function App() {
  // ── State ──
  const [currentUser, setCurrentUser] = useState(() => LS.get("cp_current_user") || null);
  const [requests,    setRequests]    = useState([]);

  // ── UI State ──
  const [authScreen, setAuthScreen] = useState("login");
  const [modal,      setModal]      = useState(null);
  const [cert,       setCert]       = useState(null);
  const [toast,      setToast]      = useState(null);
  const [notif,      setNotif]      = useState(false);
  const [showProfile,setShowProfile]= useState(false);

  // ── Persist session ──
  useEffect(() => { LS.set("cp_current_user", currentUser); }, [currentUser]);

  // ── Load requests from backend when logged in ──
  useEffect(() => {
    if (currentUser) {
      api.getRequests().then(data => {
        if (Array.isArray(data)) setRequests(data);
      });
    }
  }, [currentUser]);

  const showToast = useCallback((msg, color="var(--green)") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3200);
  }, []);

  /* ── Auth handlers ── */
  const handleLogin = async (emailVal, passwordVal) => {
    const user = await api.login(emailVal, passwordVal);
    if (user.error) return user.error;
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name.split(" ")[0]}! 👋`);
    return null;
  };

  const handleRegister = async (data) => {
    const user = await api.register(data);
    if (user.error) return user.error;
    setCurrentUser(user);
    showToast(`Account created! Welcome, ${user.name.split(" ")[0]}! 🎉`);
    return null;
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setRequests([]);
    setAuthScreen("login");
    setModal(null);
    LS.del("cp_current_user");
    showToast("Signed out successfully");
  };

  const handleChangePassword = (current, next) => {
    if (!currentUser || currentUser.password !== current) return false;
    setCurrentUser(prev => ({ ...prev, password: next }));
    return true;
  };

  /* ── Request handlers ── */
  const handleNewRequest = async (f) => {
    if (!currentUser) return;
    await api.createRequest({
      studentId: currentUser.studentId,
      student:   currentUser.name,
      program:   f.program,
      year:      f.year,
      session:   f.session,
      reason:    f.reason,
      notes:     f.notes,
    });
    const updated = await api.getRequests();
    if (Array.isArray(updated)) setRequests(updated);
    showToast("✅ Request submitted — Admin notified by email!");
  };

  const wrapRequests = useCallback(async (updater) => {
    if (updater && updater._apiAction) {
      const { reqId, dept, action } = updater;
      await api.deptAction(reqId, dept, action, currentUser?.name || "Officer");
      const updated = await api.getRequests();
      if (Array.isArray(updated)) setRequests(updated);
      showToast("✅ Action saved — Student notified by email!");
    } else {
      setRequests(updater);
      showToast("Changes saved");
    }
  }, [showToast, currentUser]);

  const handleReset = async () => {
    if (!window.confirm("Reset all clearance data to default? User accounts will be kept.")) return;
    await api.resetData();
    const updated = await api.getRequests();
    if (Array.isArray(updated)) setRequests(updated);
    showToast("Clearance data reset", "var(--yellow)");
  };

  /* ── If not logged in, show auth ── */
  if (!currentUser) {
    return (
      <>
        <style>{FONTS}{STYLES}</style>
        {authScreen === "login"
          ? <LoginScreen    onLogin={handleLogin} onGoRegister={()=>setAuthScreen("register")}/>
          : <RegisterScreen onRegister={handleRegister} onGoLogin={()=>setAuthScreen("login")}/>
        }
        {toast && <div className="toast" style={{borderLeft:`3px solid ${toast.color}`,color:toast.color}}>{toast.msg}</div>}
      </>
    );
  }

  /* ── Page meta by role ── */
  const roleInfo = {
    student:    { emoji:"🎓", title:"My Clearance",      sub:`Welcome, ${currentUser.name}` },
    admin:      { emoji:"🏛️",  title:"Clearance Overview", sub:"2024/2025 Academic Session" },
    department: { emoji: DEPTS.find(d=>d.id===currentUser.dept)?.icon || "🏢", title:`${DEPTS.find(d=>d.id===currentUser.dept)?.name || ""} Portal`, sub:"Clearance approvals" },
    finance:    { emoji:"💰", title:"Finance Portal",     sub:"Fee verification & records" },
  };
  const pi = roleInfo[currentUser.role] || roleInfo.student;

  const queueCount = currentUser.role==="department"
    ? requests.filter(r=>r.depts[currentUser.dept||"library"]==="pending").length
    : currentUser.role==="finance"
    ? requests.filter(r=>r.depts.finance==="pending").length
    : 0;

  /* ── Render dashboard ── */
  return (
    <>
      <style>{FONTS}{STYLES}</style>
      <div className="app">
        {/* SIDEBAR */}
        <aside className="sb">
          <div className="sb-ws">
            <div className="ws-icon">C</div>
            <div><div className="ws-name">ClearPath</div><div className="ws-plan">University System</div></div>
          </div>

          <div className="sb-sec">Main</div>
          <div className="sb-item active"><span className="ico"><Ico n="home" s={15}/></span>Dashboard</div>
          {currentUser.role==="student" && (
            <div className="sb-item" onClick={()=>setModal("new")}><span className="ico"><Ico n="plus" s={15}/></span>New Request</div>
          )}
          {currentUser.role==="admin" && (
            <>
              <div className="sb-item"><span className="ico"><Ico n="users" s={15}/></span>Students<span className="badge">{requests.length}</span></div>
              <div className="sb-item"><span className="ico"><Ico n="bar" s={15}/></span>Reports</div>
            </>
          )}
          {(currentUser.role==="department"||currentUser.role==="finance") && (
            <div className="sb-item"><span className="ico"><Ico n="inbox" s={15}/></span>Queue<span className="badge">{queueCount}</span></div>
          )}

          <div className="sb-sec">Account</div>
          <div className="sb-item" onClick={()=>setShowProfile(true)}><span className="ico"><Ico n="user" s={15}/></span>Profile & Security</div>
          {currentUser.role==="admin" && (
            <div className="sb-item" onClick={handleReset}><span className="ico"><Ico n="rst" s={15}/></span>Reset Data</div>
          )}

          <div className="sb-footer">
            <div className="user-row">
              <div className="u-avatar">{currentUser.name[0]}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="u-name" style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{currentUser.name}</div>
                <div className="u-sub">{currentUser.role}</div>
              </div>
            </div>
            <button className="signout-btn" onClick={handleSignOut}>
              <Ico n="logout" s={14}/> Sign Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          {/* Topbar */}
          <div className="topbar">
            <div className="breadcrumb">
              <span>ClearPath</span><span className="bc-sep">/</span><span className="bc-cur">{pi.title}</span>
            </div>
            <div className="topbar-r">
              {currentUser.role==="student" && (
                <button className="btn btn-pr btn-sm" onClick={()=>setModal("new")}><Ico n="plus" s={13}/> New Request</button>
              )}
              <button className="btn btn-gh btn-ico" onClick={()=>setShowProfile(true)} title="Account">
                <Ico n="user" s={15}/>
              </button>
              <div style={{position:"relative"}}>
                <button className="btn btn-gh btn-ico" onClick={()=>setNotif(v=>!v)} title="Notifications">
                  <Ico n="bell" s={15}/>
                </button>
                {notif && (
                  <>
                    <div style={{position:"fixed",inset:0,zIndex:199}} onClick={()=>setNotif(false)}/>
                    <NotifPanel onClose={()=>setNotif(false)}/>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Page header */}
          <div className="pg-head">
            <span className="pg-emoji">{pi.emoji}</span>
            <div className="pg-title">{pi.title}</div>
            <div className="pg-sub">{pi.sub}</div>
          </div>
          <div className="ndiv"/>

          {/* Role-gated content */}
          <div className="content">
            {currentUser.role==="student" && (
              <StudentView user={currentUser} requests={requests} setModal={setModal} setCert={setCert}/>
            )}
            {currentUser.role==="admin" && (
              <AdminView requests={requests} setRequests={wrapRequests}/>
            )}
            {currentUser.role==="department" && (
              <DeptView user={currentUser} requests={requests} setRequests={wrapRequests}/>
            )}
            {currentUser.role==="finance" && (
              <FinanceView requests={requests} setRequests={wrapRequests}/>
            )}
          </div>
        </main>

        {/* MODALS */}
        {modal==="new" && currentUser.role==="student" && (
          <NewReqModal user={currentUser} onClose={()=>setModal(null)} onSubmit={handleNewRequest}/>
        )}
        {cert && <CertModal req={cert} onClose={()=>setCert(null)}/>}
        {showProfile && (
          <ProfileModal
            user={currentUser}
            onClose={()=>setShowProfile(false)}
            onChangePassword={handleChangePassword}
          />
        )}

        {/* TOAST */}
        {toast && (
          <div className="toast" style={{borderLeft:`3px solid ${toast.color}`,color:toast.color}}>
            {toast.msg}
          </div>
        )}
      </div>
    </>
  );
}
