/* Centro de datos v2.1 · Informe PDF del jugador y Acceso de jugadores ("Mi progreso").
   Script clásico: usa las funciones y el estado (S) de la app principal. */
(function () {
const css = `
.ovl{position:fixed;inset:0;z-index:60;background:rgba(4,20,13,.55);display:grid;place-items:end center;padding:0}
@media (min-width:640px){.ovl{place-items:center;padding:24px}}
.ovl .box{background:var(--surface);color:var(--ink);width:100%;max-width:520px;max-height:92vh;overflow:auto;border-radius:18px 18px 0 0;padding:18px 16px calc(18px + env(safe-area-inset-bottom,0px));display:flex;flex-direction:column;gap:12px}
@media (min-width:640px){.ovl .box{border-radius:18px}}
.codebox{font-family:var(--display);font-weight:800;font-size:2.6rem;letter-spacing:.18em;text-align:center;background:var(--surface-2);border-radius:12px;padding:10px;font-variant-numeric:tabular-nums}
.msgbox{white-space:pre-wrap;background:var(--surface-2);border-radius:10px;padding:10px;font-size:.88rem;overflow-wrap:anywhere}
/* Informe A4 (se dibuja fuera de la vista y se convierte en PDF) */
.rp-host{position:fixed;left:0;top:0;z-index:-5;pointer-events:none}
.rp-page{width:794px;height:1123px;background:#fff;color:#0E2A40;padding:30px 40px 22px;box-sizing:border-box;display:flex;flex-direction:column;font-family:"Barlow","Segoe UI",Arial,sans-serif;font-size:13px;line-height:1.35;margin-bottom:10px}
.rp-head{display:flex;align-items:center;gap:12px;background:#0B4F7C;color:#fff;border-radius:10px;padding:10px 14px;flex:none}
.rp-head img{width:46px;height:46px;object-fit:contain}
.rp-head .t{flex:1;display:flex;flex-direction:column}
.rp-head b{font-family:"Barlow Condensed",Arial,sans-serif;font-weight:800;font-size:21px;text-transform:uppercase;letter-spacing:.03em;line-height:1}
.rp-head span{font-size:12px;opacity:.9}
.rp-head .r{text-align:right;font-size:12px}
.rp-head .r b{font-size:16px}
.rp-body{flex:1;overflow:hidden;display:flex;flex-direction:column;gap:12px;padding-top:12px}
.rp-foot{flex:none;display:flex;justify-content:space-between;font-size:10.5px;color:#46607A;border-top:1px solid #C9E4F4;padding-top:6px}
.rp-blk h4{font-family:"Barlow Condensed",Arial,sans-serif;font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:.05em;margin:0 0 6px;color:#0B4F7C;border-bottom:2px solid #0B4F7C;padding-bottom:3px}
.rp-hero{display:flex;gap:16px;align-items:center}
.rp-ph{width:104px;height:104px;border-radius:50%;overflow:hidden;border:4px solid #0B4F7C;display:grid;place-items:center;background:#d6eef8;font-family:"Barlow Condensed",Arial,sans-serif;font-weight:800;font-size:34px;flex:none}
.rp-ph img{width:100%;height:100%;object-fit:cover}
.rp-hero .n{font-family:"Barlow Condensed",Arial,sans-serif;font-weight:800;font-size:28px;text-transform:uppercase;line-height:1}
.rp-facts{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}
.rp-fact{background:#EAF4FB;border-radius:8px;padding:5px 8px}
.rp-fact span{display:block;font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:#46607A;font-weight:700}
.rp-fact b{font-size:13px}
.rp-kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
.rp-kpi{background:#EAF4FB;border-radius:8px;padding:6px 8px;text-align:center}
.rp-kpi b{display:block;font-family:"Barlow Condensed",Arial,sans-serif;font-weight:800;font-size:24px;line-height:1}
.rp-kpi span{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:#46607A;font-weight:700}
.rp-t{width:100%;border-collapse:collapse;font-size:12px}
.rp-t th{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:#46607A;text-align:left;padding:4px 5px;border-bottom:1px solid #C9E4F4}
.rp-t td{padding:4px 5px;border-bottom:1px solid #EAF4FB;vertical-align:middle}
.rp-t .c{text-align:center}
.rp-bar{height:8px;border-radius:4px;background:#EAF4FB;width:70px;display:inline-block;vertical-align:middle;overflow:hidden;margin-right:5px}
.rp-bar i{display:block;height:100%;border-radius:4px}
.rp-res{display:inline-block;width:18px;height:18px;border-radius:4px;color:#fff;font-weight:800;text-align:center;line-height:18px;font-size:11px;margin-left:4px}
.rp-dots{display:flex;flex-wrap:wrap;gap:3px;margin:6px 0}
.rp-dots i{width:12px;height:12px;border-radius:3px;display:block}
.rp-leg{display:flex;gap:12px;font-size:10.5px;color:#46607A}
.rp-leg i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px}
.rp-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rp-card{background:#F7FBFE;border:1px solid #C9E4F4;border-radius:8px;padding:8px 10px}
.rp-card .h{display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px}
.rp-tb{display:flex;align-items:flex-end;gap:6px;height:70px;margin:4px 0}
.rp-tb div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;font-size:10px;color:#46607A}
.rp-tb i{display:block;width:100%;max-width:34px;background:#1874B0;border-radius:4px 4px 0 0}
.rp-tb b{font-size:11px;color:#0E2A40}
.rp-area{display:grid;grid-template-columns:110px 1fr 24px;align-items:center;gap:8px;margin:3px 0}
.rp-sc{display:flex;gap:4px}.rp-sc i{width:26px;height:10px;border-radius:3px;background:#EAF4FB}.rp-sc i.on{background:#1874B0}
.rp-txt{margin:2px 0 6px}.rp-txt span{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:#46607A;font-weight:700;display:block}
.rp-firma{display:flex;justify-content:flex-end;margin-top:26px}
.rp-firma div{width:250px;border-top:1px solid #0E2A40;text-align:center;padding-top:4px;font-size:12px}
.rp-empty{color:#46607A;font-style:italic}
`;
const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

/* ---------- Librerías del PDF (se guardan en el teléfono para usarlas sin señal) ---------- */
const LIBS = { h2c: ["https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", () => window.html2canvas], pdf: ["https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", () => window.jspdf && window.jspdf.jsPDF] };
const cargando = {};
window.__cddLib = k => lib(k);
function lib(k) {
  const [url, ok] = LIBS[k];
  if (ok()) return Promise.resolve();
  if (cargando[k]) return cargando[k];
  return cargando[k] = new Promise((res, rej) => {
    const s = document.createElement("script"); s.src = url; s.crossOrigin = "anonymous";
    s.onload = () => ok() ? res() : rej({ code: "sin_libreria" });
    s.onerror = () => { delete cargando[k]; s.remove(); rej({ code: "sin_libreria" }); };
    document.head.appendChild(s);
  });
}

/* ---------- Periodo ---------- */
const PERIODOS = [["temp", "Toda la temporada"], ["30", "Últimos 30 días"], ["90", "Últimos 90 días"], ["fechas", "Elegir fechas"]];
function rango(I) {
  const hoy = today0();
  if (I.per === "30" || I.per === "90") { const d = new Date(hoy); d.setDate(d.getDate() - Number(I.per)); return { desde: d, hasta: null, txt: "Últimos " + I.per + " días" }; }
  if (I.per === "fechas") { const d = I.desde ? isoToDate(I.desde) : null, h = I.hasta ? isoToDate(I.hasta) : null; return { desde: d, hasta: h, txt: (d ? dLong(d) : "Inicio") + " – " + (h ? dLong(h) : "hoy") }; }
  return { desde: null, hasta: null, txt: "Temporada" + (S.config.temporada ? " " + S.config.temporada : "") };
}
const enRango = (d, R) => !!d && (!R.desde || d >= R.desde) && (!R.hasta || d <= R.hasta);

/* ---------- Contenido del informe (sin comparaciones con el equipo) ---------- */
const C = { ok: "#1f8a4c", warn: "#c98a00", bad: "#c3352b", sky: "#2ea3d4", mut: "#93b0a8", acc: "#1874B0" };
const ASIS_C = { Presente: C.ok, Ausente: C.bad, Justificado: C.warn, Lesionado: C.sky };
function bloques(j, R) {
  const out = [], v = x => x == null || x === "" ? "–" : esc(x);
  const foto = FOTOS[j.id] && window.foto(FOTOS[j.id]);
  out.push(`<div class="rp-hero"><div class="rp-ph">${foto ? `<img src="${foto}">` : esc(initials(j.nombre))}</div><div style="flex:1">
    <div class="n">${esc(j.nombre)}</div><div style="font-size:14px;margin-top:4px">${j.dorsal ? "<b>#" + esc(j.dorsal) + "</b> · " : ""}${esc(j.pos1 || "")}${j.pos2 ? " · alternativa: " + esc(j.pos2) : ""}</div>
    <div class="rp-facts"><div class="rp-fact"><span>Edad</span><b>${v(j.edad)}</b></div><div class="rp-fact"><span>Pierna hábil</span><b>${v(j.pierna)}</b></div>
    <div class="rp-fact"><span>Estatura</span><b>${j.est ? esc(j.est) + " cm" : "–"}</b></div><div class="rp-fact"><span>Peso</span><b>${j.peso ? esc(j.peso) + " kg" : "–"}</b></div></div></div></div>`);
  // Partidos
  const ms = S.partidos.filter(m => enRango(m.fecha, R)), s = pStats(j.id, ms), gk = isGK(j), k = gk ? gkStats(j.id, ms) : null;
  const kp = (b, t) => `<div class="rp-kpi"><b>${b}</b><span>${t}</span></div>`;
  out.push(`<h4>Partidos</h4><div class="rp-kpis">${kp(s.conv, "Convocado de " + ms.length)}${kp(s.pj, "Jugados")}${kp(s.tit, "Titular")}${kp(s.min + "'", "Minutos")}${kp(fmt1(s.nota), "Nota media")}
    ${gk ? kp(k.inv, "Vallas invictas") + kp(k.gr, "Goles recibidos") + kp(k.pa, "Penales atajados") + kp(s.mvp, "MVP") + kp(s.am + " / " + s.ro, "Amarillas / rojas")
         : kp(s.g, "Goles") + kp(s.a, "Asistencias") + kp(s.mvp, "MVP") + kp(s.am, "Amarillas") + kp(s.ro, "Rojas")}</div>`);
  if (ms.length) {
    const filas = ms.slice().reverse().map(m => {
      const r = S.stats.find(x => x.pt === m.id && x.jid === j.id), dur = m.dur || S.config.duracion || 80;
      const cond = !r ? "No convocado" : r.min > 0 ? (r.cond === "Titular" ? "Titular" : "Suplente") : "No jugó";
      const min = r ? r.min : 0;
      return `<tr><td>${esc(dShort(m.fecha))}</td><td>${esc(m.rival)}<br><span style="color:#46607A;font-size:10.5px">${esc(m.comp)}</span></td><td class="c">${m.gf}-${m.gc}<span class="rp-res" style="background:${m.res === "G" ? C.ok : m.res === "E" ? C.mut : C.bad}">${m.res}</span></td>
        <td>${cond}</td><td>${(w => `<span class="rp-bar" style="background:linear-gradient(90deg,${r && r.cond === "Titular" ? C.acc : C.sky} ${w}%,#EAF4FB ${w}%)"></span>`)(Math.round(Math.min(100, min / dur * 100)))}${min}'</td>
        ${gk ? (g => `<td class="c">${g == null ? "" : g === 0 ? "0 ✓" : g}</td><td class="c">${r && r.pa ? r.pa : ""}</td>`)(r && r.min > 0 ? (r.gr != null ? r.gr : (r.min >= dur ? m.gc : null)) : null) : `<td class="c">${r && r.g ? r.g : ""}</td><td class="c">${r && r.a ? r.a : ""}</td>`}<td class="c">${r && r.min > 0 && r.nota != null ? fmt1(r.nota) : ""}</td><td class="c">${r ? (r.am ? r.am + " TA " : "") + (r.ro ? r.ro + " TR" : "") : ""}</td></tr>`;
    });
    const head = `<table class="rp-t"><tr><th>Fecha</th><th>Rival</th><th class="c">Resultado</th><th>Condición</th><th>Minutos</th>${gk ? '<th class="c">GR</th><th class="c">PA</th>' : '<th class="c">G</th><th class="c">A</th>'}<th class="c">Nota</th><th class="c">Tarjetas</th></tr>`;
    const nota = gk ? '<p style="font-size:10.5px;color:#46607A;margin:4px 0 0">GR: goles recibidos con él en cancha (✓ valla invicta). PA: penales atajados.</p>' : "";
    for (let i = 0; i < filas.length; i += 16) out.push(`<h4>Partido a partido${i ? " (continuación)" : ""}</h4>${head}${filas.slice(i, i + 16).join("")}</table>${i + 16 >= filas.length ? nota : ""}`);
  }
  // Asistencia
  const ses = sessionsOf(j.id).filter(x => enRango(x.fecha, R)), cnt = a => ses.filter(x => x.asis === a).length;
  out.push(`<h4>Asistencia a entrenamientos</h4>${ses.length ? `<div class="rp-kpis"><div class="rp-kpi"><b>${pct(asisPct(ses))}</b><span>Asistencia</span></div><div class="rp-kpi"><b>${ses.length}</b><span>Sesiones</span></div><div class="rp-kpi"><b>${cnt("Presente")}</b><span>Presente</span></div><div class="rp-kpi"><b>${cnt("Ausente")}</b><span>Ausente</span></div><div class="rp-kpi"><b>${cnt("Justificado") + cnt("Lesionado")}</b><span>Justif. / lesión</span></div></div>
    <div class="rp-dots">${ses.slice(-90).map(x => `<i style="background:${ASIS_C[x.asis] || C.mut}"></i>`).join("")}</div>
    <div class="rp-leg">${Object.keys(ASIS_C).map(a => `<span><i style="background:${ASIS_C[a]}"></i>${a}</span>`).join("")}<span><i style="background:${C.mut}"></i>Otro</span><span>· El porcentaje cuenta presentes sobre presentes más ausentes.</span></div>` : '<p class="rp-empty">Sin sesiones registradas en el periodo.</p>'}`);
  // Tests
  const ts = S.tests.filter(t => t.jid === j.id && (!t.f || enRango(t.f, R)));
  const porTest = {}; ts.forEach(t => (porTest[t.test] = porTest[t.test] || []).push(t));
  const tarjetas = Object.keys(porTest).map(n => {
    const m = testMeta(n), a = porTest[n].slice().sort((x, y) => (x.f || 0) - (y.f || 0)), max = Math.max(...a.map(x => x.res), 0) || 1;
    const dif = a.length > 1 ? a[a.length - 1].res - a[0].res : null, mejora = dif == null ? null : (m.mejor === "Menor" ? dif < 0 : dif > 0);
    return `<div class="rp-card"><div class="h"><span>${esc(n)}</span><span style="color:#46607A;font-weight:500">${esc(m.u === "s" && a.some(x => x.res >= 60) ? "min:s" : m.u)} · mejor si es ${esc(String(m.mejor || "Mayor").toLowerCase())}</span></div>
      <div class="rp-tb">${a.slice(-6).map(x => `<div><b>${fmtV(x.res, m.u)}</b><i style="height:${Math.max(4, x.res / max * 48)}px"></i>${esc(x.toma || dShort(x.f))}</div>`).join("")}</div>
      ${dif != null && dif !== 0 ? `<div style="font-size:11.5px;color:${mejora ? C.ok : C.bad};font-weight:700">${mejora ? "Mejoró" : "Bajó"} ${esc(fmtT(Math.abs(dif), m.u))} desde la primera toma</div>` : dif === 0 ? '<div style="font-size:11.5px;color:#46607A">Igual que en la primera toma</div>' : '<div style="font-size:11.5px;color:#46607A">Una sola toma</div>'}</div>`;
  });
  if (!tarjetas.length) out.push('<h4>Tests físicos</h4><p class="rp-empty">Sin tests registrados en el periodo.</p>');
  for (let i = 0; i < tarjetas.length; i += 4) out.push(`<h4>Tests físicos${i ? " (continuación)" : ""}</h4><div class="rp-2">${tarjetas.slice(i, i + 4).join("")}</div>`);
  // Evaluación formativa
  const evs = S.evals.filter(e => e.jid === j.id && enRango(e.f, R));
  if (!evs.length) out.push('<h4>Evaluación formativa</h4><p class="rp-empty">Sin evaluaciones en el periodo.</p>');
  else {
    const e = evs[evs.length - 1], prev = evs.slice(0, -1);
    out.push(`<h4>Evaluación formativa · ${esc(e.per || "")} (${esc(dLong(e.f))})</h4><div class="rp-2"><div>${AREAS.map(([k, t]) => `<div class="rp-area"><span>${t}</span><span class="rp-sc">${[1, 2, 3, 4, 5].map(n => `<i class="${e[k] != null && n <= e[k] ? "on" : ""}"></i>`).join("")}</span><b>${e[k] != null ? fmt1(e[k]) : "–"}</b></div>`).join("")}
      <p style="font-size:10.5px;color:#46607A;margin:4px 0 0">Escala 1 a 5: 3 es lo esperado para su edad.</p>
      ${prev.length ? `<table class="rp-t" style="margin-top:6px"><tr><th>Anteriores</th>${AREAS.map(a => `<th class="c">${a[1].slice(0, 3)}</th>`).join("")}</tr>${prev.slice(-4).map(p => `<tr><td>${esc(p.per || dShort(p.f))}</td>${AREAS.map(([k]) => `<td class="c">${p[k] != null ? fmt1(p[k]) : "–"}</td>`).join("")}</tr>`).join("")}</table>` : ""}</div>
      <div>${[["Fortalezas", e.fort], ["Aspectos a mejorar", e.mej], ["Objetivo a corto plazo", e.oc], ["Objetivo a mediano plazo", e.om], ["Objetivo a largo plazo", e.ol]].filter(x => x[1]).map(x => `<div class="rp-txt"><span>${x[0]}</span>${esc(x[1])}</div>`).join("") || '<p class="rp-empty">Sin comentarios.</p>'}</div></div>`);
  }
  // Lesiones y sanciones
  const les = S.lesiones.filter(l => l.jid === j.id && enRango(l.fecha, R)), san = S.sanciones.filter(x => x.jid === j.id && enRango(x.fecha, R));
  out.push(`<h4>Lesiones y sanciones</h4>${les.length || san.length ? `<table class="rp-t"><tr><th>Fecha</th><th>Tipo</th><th>Detalle</th><th>Estado</th></tr>${les.map(l => `<tr><td>${esc(dShort(l.fecha))}</td><td>Lesión</td><td>${esc(l.zona)}${l.desc ? " · " + esc(l.desc) : ""}${l.dias != null ? " · " + l.dias + " días" : ""}</td><td>${l.altaReal ? "Alta " + esc(dShort(l.altaReal)) : esc(l.estado || "En recuperación")}</td></tr>`).join("")}
    ${san.map(x => `<tr><td>${esc(dShort(x.fecha))}</td><td>Sanción</td><td>${esc(x.motivo)}${x.fechas != null ? " · " + x.fechas + " fechas" : ""}</td><td>${esc(x.estado || "")}</td></tr>`).join("")}</table>` : '<p class="rp-empty">Sin lesiones ni sanciones en el periodo.</p>'}
    <div class="rp-firma"><div>${esc(CLUB.dt || "")}<br><span style="color:#46607A">Entrenador${CLUB.nombre ? " · " + esc(CLUB.nombre) : ""}</span></div></div>`);
  return out;
}
function cabecera(R) {
  const L = LOGO && window.foto(LOGO);
  return `<div class="rp-head">${L ? `<img src="${L}">` : ""}<div class="t"><b>${esc(CLUB.nombre || "Informe")}</b><span>${esc(CLUB.cat || "")}</span></div><div class="r"><b>Informe del jugador</b><br>${esc(R.txt)}</div></div>`;
}
async function paginas(j, R) {
  const host = document.createElement("div"); host.className = "rp-host"; document.body.appendChild(host);
  const pages = []; let body;
  const nueva = () => { const p = document.createElement("div"); p.className = "rp-page"; p.innerHTML = cabecera(R) + '<div class="rp-body"></div><div class="rp-foot"></div>'; host.appendChild(p); body = p.querySelector(".rp-body"); pages.push(p); };
  nueva();
  try { if (document.fonts && document.fonts.ready) await document.fonts.ready; } catch (e) {}
  for (const b of bloques(j, R)) {
    const el = document.createElement("div"); el.className = "rp-blk"; el.innerHTML = b; body.appendChild(el);
    if (body.scrollHeight > body.clientHeight + 1 && body.children.length > 1) { el.remove(); nueva(); body.appendChild(el); }
  }
  const hoy = dLong(new Date());
  pages.forEach((p, i) => { p.querySelector(".rp-foot").innerHTML = `<span>${esc(CLUB.nombre || "")} · Centro de datos</span><span>Generado el ${hoy} · Página ${i + 1} de ${pages.length}</span>`; });
  return { host, pages };
}
function archivo(j) { return `Informe_${j.id}_${shortName(j.nombre).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Za-z0-9]+/g, "_")}_${todayISO()}.pdf`; }

/* ---------- Ventana del informe ---------- */
let I = null;
function ventana() {
  let el = document.getElementById("inf-ovl");
  if (!I) { if (el) el.remove(); document.body.style.overflow = ""; return; }
  if (!el) { el = document.createElement("div"); el.id = "inf-ovl"; el.className = "ovl"; document.body.appendChild(el); document.body.style.overflow = "hidden"; }
  const j = jById(I.id), R = rango(I);
  el.innerHTML = `<div class="box" role="dialog" aria-label="Informe PDF"><div class="sec-h"><h2>Informe PDF</h2><button class="btn sm" data-act="inf-close">Cerrar</button></div>
    <p style="margin:0"><b>${esc(j ? j.nombre : "")}</b></p>
    ${I.blob ? `<div class="banner ok">Listo: ${esc(I.name)} (${I.paginas} ${I.paginas === 1 ? "página" : "páginas"}).</div>
      <div class="fgrid">${navigator.canShare ? '<button class="btn pri" data-act="inf-share">Compartir</button>' : ""}<button class="btn ${navigator.canShare ? "" : "pri"}" data-act="inf-dl" ${navigator.canShare ? "" : 'style="grid-column:1/-1"'}>Descargar</button></div>
      <button class="linkbtn" data-act="inf-again">Generar con otro periodo</button>` : `
    <div class="chips" role="group" aria-label="Periodo">${PERIODOS.map(p => `<button class="fchip" aria-pressed="${I.per === p[0]}" data-act="inf-per" data-v="${p[0]}">${p[1]}</button>`).join("")}</div>
    ${I.per === "fechas" ? `<div class="fgrid"><label class="f">Desde<input type="date" id="inf-desde" value="${esc(I.desde || "")}"></label><label class="f">Hasta<input type="date" id="inf-hasta" value="${esc(I.hasta || "")}"></label></div>` : ""}
    <p class="hint">Incluye datos del jugador, partidos, asistencia, tests físicos, evaluación formativa, lesiones y sanciones de: <b>${esc(R.txt)}</b>. No incluye comparaciones con el equipo.</p>
    ${I.err ? `<div class="banner err">${esc(I.err)}</div>` : ""}
    <button class="btn pri wide" data-act="inf-gen" ${I.busy ? "disabled" : ""}>${I.busy ? esc(I.busy) : "Generar PDF"}</button>`}</div>`;
}
async function generar() {
  const j = jById(I.id); if (!j) return;
  if (I.per === "fechas" && I.desde && I.hasta && I.hasta < I.desde) { I.err = "La fecha final no puede ser antes de la inicial."; ventana(); return; }
  I.err = null; I.busy = "Preparando…"; ventana();
  let host = null;
  try {
    await Promise.all([lib("h2c"), lib("pdf")]);
    const R = rango(I), r = await paginas(j, R); host = r.host;
    const pdf = new window.jspdf.jsPDF({ unit: "mm", format: "a4", compress: true });
    for (let i = 0; i < r.pages.length; i++) {
      I.busy = `Generando página ${i + 1} de ${r.pages.length}…`; ventana();
      const cv = await window.html2canvas(r.pages[i], { scale: 2, backgroundColor: "#ffffff", logging: false, scrollX: 0, scrollY: 0, windowWidth: 794 });
      if (i) pdf.addPage();
      pdf.addImage(cv.toDataURL("image/jpeg", 0.9), "JPEG", 0, 0, 210, 297);
    }
    I.blob = pdf.output("blob"); I.name = archivo(j); I.paginas = r.pages.length; I.busy = null;
  } catch (e) {
    I.busy = null;
    I.err = e && e.code === "sin_libreria" ? "Se necesita señal la primera vez para preparar el generador de PDF. Conéctate e intenta de nuevo." : "No se pudo generar el PDF: " + ((e && e.message) || "error");
  } finally { if (host) host.remove(); ventana(); }
}
window.__informe = { abrir: id => { I = { id, per: "temp", desde: "", hasta: "" }; ventana(); }, estado: () => I };
document.addEventListener("click", async ev => {
  const t = ev.target.closest("[data-act^='inf-']"); if (!t) return;
  const a = t.dataset.act;
  if (a === "inf-open") { window.__informe.abrir(t.dataset.id); return; }
  if (!I) return;
  if (a === "inf-close") { I = null; ventana(); }
  else if (a === "inf-per") { I.per = t.dataset.v; I.err = null; ventana(); }
  else if (a === "inf-gen") { if (!I.busy) generar(); }
  else if (a === "inf-again") { I.blob = null; ventana(); }
  else if (a === "inf-dl") { const u = URL.createObjectURL(I.blob), x = document.createElement("a"); x.href = u; x.download = I.name; document.body.appendChild(x); x.click(); x.remove(); setTimeout(() => URL.revokeObjectURL(u), 5000); }
  else if (a === "inf-share") { const f = new File([I.blob], I.name, { type: "application/pdf" }); try { if (navigator.canShare({ files: [f] })) await navigator.share({ files: [f], title: I.name }); else t.nextElementSibling && t.nextElementSibling.click(); } catch (e) {} }
});
document.addEventListener("input", ev => { if (!I) return; if (ev.target.id === "inf-desde") I.desde = ev.target.value; if (ev.target.id === "inf-hasta") I.hasta = ev.target.value; });
document.addEventListener("change", ev => { if (I && (ev.target.id === "inf-desde" || ev.target.id === "inf-hasta")) ventana(); });
// Las librerías se dejan listas en segundo plano para poder generar sin señal más adelante.
setTimeout(() => { if (navigator.onLine) { lib("h2c").catch(() => {}); lib("pdf").catch(() => {}); } }, 8000);

/* ---------- Acceso de jugadores (Mi progreso) ---------- */
const A = { cod: LS.get("accCod", {}), sinDoc: LS.get("accSinDoc", []), cargado: 0, err: null, busy: null, nuevo: null };
function enlace() {
  const u = window.__acceso && window.__acceso();
  if (!u || !u.url) return "";
  const tok = btoa(unescape(encodeURIComponent(JSON.stringify({ url: u.url }))));
  return new URL("jugador.html", location.href).href.split("#")[0] + "#p=" + encodeURIComponent(tok);
}
function errTxt(e) {
  const c = e && e.code;
  if (c === "operacion_desconocida") return "Falta actualizar el puente a la versión 10. Pega el código nuevo en Apps Script y publica una versión nueva.";
  if (c === "sin_documento") return "Falta el número de documento de ese jugador en la pestaña Plantilla (columna R).";
  if (c === "server_unavailable") return "Sin señal: la gestión de códigos necesita conexión.";
  return gsErrorText(e);
}
async function cargar(force) {
  if (A.busy || (!force && Date.now() - A.cargado < 60000)) return;
  A.busy = "lista"; render();
  try { const r = await window.puenteDT({ op: "jugCodigos" }); A.cod = r.codigos || {}; A.sinDoc = r.sinDoc || []; A.cargado = Date.now(); A.err = null; LS.set("accCod", A.cod); LS.set("accSinDoc", A.sinDoc); }
  catch (e) { A.err = errTxt(e); A.cargado = Date.now(); }
  A.busy = null; render();
}
function mensaje(j, codigo) {
  const n = shortName(j.nombre);
  return `Hola, familia de ${j.nombre}. Este es el acceso a «Mi progreso» de ${n}${CLUB.nombre ? " en " + CLUB.nombre : ""}${CLUB.cat ? " (" + CLUB.cat + ")" : ""}:\n${enlace()}\n\nUsuario: número de documento de ${n}\nCódigo personal: ${codigo}\n\nAhí pueden ver su asistencia, sus partidos, sus tests físicos y su evaluación formativa. Por favor no compartan el código.`;
}
window.vAccesos = function () {
  setTimeout(() => cargar(false), 0);
  const pl = activePl(), con = pl.filter(j => A.cod[j.id]).length;
  let h = `${subnav(SUBJ, "accesos")}<h2>Acceso de jugadores</h2>
   <section class="sec"><p class="hint">Cada jugador y su familia consultan «Mi progreso» con el <b>número de documento</b> del jugador y un <b>código personal</b> de 6 dígitos. Ven solo su asistencia, sus partidos, sus tests y su evaluación formativa: nada de otros jugadores, notas por partido, lesiones ni comparaciones.</p>
   <div class="kpis"><div class="kpi"><b>${con}</b><span>Con acceso</span></div><div class="kpi"><b>${pl.length - con}</b><span>Sin código</span></div></div>
   ${A.err ? `<div class="banner err">${esc(A.err)}</div>` : ""}
   <button class="btn sm" data-act="acc-reload" style="align-self:flex-start" ${A.busy ? "disabled" : ""}>${A.busy === "lista" ? "Cargando…" : "Actualizar estado"}</button></section>`;
  if (A.nuevo) {
    const j = jById(A.nuevo.id), m = mensaje(j, A.nuevo.codigo);
    h += `<section class="sec" style="border:2px solid var(--accent)"><h3>Código de ${esc(shortName(j.nombre))}</h3><div class="codebox">${esc(A.nuevo.codigo)}</div>
     <p class="hint"><b>Solo se muestra esta vez.</b> Envíalo ahora a la familia. Si se pierde, genera uno nuevo.</p><div class="msgbox">${esc(m)}</div>
     <div class="fgrid"><a class="btn pri" style="text-decoration:none;display:grid;place-items:center" href="https://wa.me/?text=${encodeURIComponent(m)}" target="_blank" rel="noopener">Enviar por WhatsApp</a><button class="btn" data-act="acc-copy">Copiar mensaje</button></div>
     <button class="btn wide" data-act="acc-done">Listo</button></section>`;
  }
  h += `<section class="sec"><div class="list">${pl.map(j => {
    const c = A.cod[j.id], sd = A.sinDoc.includes(j.id);
    return `<div class="li">${avatar(j, "sm")}<div class="meta"><span class="nm">${j.dorsal ? `<span class="ab">${esc(j.dorsal)}</span> · ` : ""}${esc(shortName(j.nombre))}</span>
      <span class="sub">${c ? `<span class="chip ok">Con acceso</span> desde ${esc(dLong(new Date(c.desde)))}` : sd ? '<span class="chip sus">Falta documento</span> en Plantilla' : '<span class="chip ina">Sin código</span>'}</span></div>
      <div class="end" style="flex-direction:row;gap:6px">${sd && !c ? "" : `<button class="btn sm ${c ? "" : "pri"}" data-act="acc-gen" data-id="${j.id}" ${A.busy ? "disabled" : ""}>${A.busy === j.id ? "…" : c ? "Cambiar" : "Generar"}</button>`}${c ? `<button class="btn sm" data-act="acc-del" data-id="${j.id}" ${A.busy ? "disabled" : ""}>Quitar</button>` : ""}</div></div>`;
  }).join("")}</div></section>`;
  return h;
};
document.addEventListener("click", async ev => {
  const t = ev.target.closest("[data-act^='acc-']"); if (!t) return;
  const a = t.dataset.act, id = t.dataset.id;
  if (a === "acc-reload") { cargar(true); return; }
  if (a === "acc-done") { A.nuevo = null; render(); return; }
  if (a === "acc-copy") { try { await navigator.clipboard.writeText(mensaje(jById(A.nuevo.id), A.nuevo.codigo)); toast("Mensaje copiado."); } catch (e) { toast("No se pudo copiar: selecciona el texto y cópialo."); } return; }
  if (A.busy) return;
  const j = jById(id); if (!j) return;
  if (a === "acc-gen") {
    if (A.cod[id] && !confirm(`¿Cambiar el código de ${shortName(j.nombre)}? El código anterior dejará de funcionar.`)) return;
    A.busy = id; render();
    try { const r = await window.puenteDT({ op: "jugCodigo", id }); A.nuevo = { id, codigo: r.codigo }; A.cod[id] = { desde: Date.now() }; LS.set("accCod", A.cod); A.err = null; window.scrollTo(0, 0); }
    catch (e) { A.err = errTxt(e); }
    A.busy = null; render();
  }
  if (a === "acc-del") {
    if (!confirm(`¿Quitar el acceso de ${shortName(j.nombre)}? Su código dejará de funcionar.`)) return;
    A.busy = id; render();
    try { await window.puenteDT({ op: "jugQuitar", id }); delete A.cod[id]; LS.set("accCod", A.cod); if (A.nuevo && A.nuevo.id === id) A.nuevo = null; toast("Acceso quitado."); A.err = null; }
    catch (e) { A.err = errTxt(e); }
    A.busy = null; render();
  }
});

/* ---------- Modo día / noche ---------- */
const TEMAS = ["auto", "light", "dark"];
const ICON = { auto: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/></svg>', light: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>', dark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>' };
const NOMBRE = { auto: "Automático (como el teléfono)", light: "Modo día", dark: "Modo noche" };
function aplicarTema() {
  const t = LS.get("theme", "auto"), el = document.documentElement;
  if (t === "auto") el.removeAttribute("data-theme"); else el.setAttribute("data-theme", t);
  const b = document.getElementById("thm"); if (b) { b.innerHTML = ICON[t]; b.title = NOMBRE[t]; }
}
document.addEventListener("click", ev => { if (!ev.target.closest("#thm")) return; const t = LS.get("theme", "auto"); const n = TEMAS[(TEMAS.indexOf(t) + 1) % 3]; LS.set("theme", n); aplicarTema(); toast(NOMBRE[n]); });
aplicarTema();

/* ---------- Seguimiento de lesión (formulario) ---------- */
document.addEventListener("input", ev => { const t = ev.target; if (!S.act || S.act.t !== "segui") return; if (t.id === "sg-prev") S.act.prev = t.value; if (t.id === "sg-seg") S.act.seg = t.value; });
document.addEventListener("change", ev => { const t = ev.target; if (!S.act || S.act.t !== "segui") return; if (t.id === "sg-indef") { S.act.indef = t.checked; render(); } if (t.id === "sg-seg") S.act.seg = t.value; });

/* ---------- Gestión del jugador: quitar foto, retirado ---------- */
window.gestionCard = function (j) {
  const conFoto = !!FOTOS[j.id];
  return `<section class="sec"><h3>Gestión del jugador</h3>
   ${j.promovido ? '<div class="banner ok">Promovido a otra categoría. Su historial se conserva y sigue viendo «Mi progreso», pero no aparece en listas, asistencia, convocatoria, registros ni en Equipo.</div>' : j.retirado ? '<div class="banner warn">Retirado del equipo. Su historial se conserva, pero no aparece en listas, convocatoria ni registros, y no tiene acceso a «Mi progreso».</div>' : ""}
   <div class="row">${conFoto ? `<button class="btn sm" data-act="g-foto" data-id="${j.id}">Quitar foto</button>` : ""}
   ${j.retirado ? `<button class="btn sm" data-act="g-ret" data-v="Activo" data-id="${j.id}">Reincorporar al equipo</button>` : `<button class="btn sm" data-act="g-ret" data-v="Promovido" data-id="${j.id}">Promover a otra categoría</button><button class="btn sm" data-act="g-ret" data-v="Retirado" data-id="${j.id}">Marcar como retirado</button>`}</div>
   <p class="hint">${conFoto ? "Quitar foto la borra en las dos apps; el jugador vuelve a mostrar sus iniciales. Si la foto equivocada está en la carpeta FOTOS APP de Drive, cámbiala o bórrala allí para que no vuelva al importar. " : ""}Para una pausa temporal usa «Inactivo» en la columna Estado de Plantilla.</p></section>`;
};
window.retiradosCard = function () {
  const r = S.jug.filter(j => j.retirado);
  if (!r.length) return "";
  return `<section class="sec"><details><summary style="cursor:pointer;font-weight:700">Fuera de la plantilla: promovidos y retirados (${r.length})</summary><div class="list" style="margin-top:10px">${r.map(j => `<a class="li" href="#jugador-${j.id}" style="text-decoration:none">${avatar(j, "sm")}<div class="meta"><span class="nm">${esc(j.nombre)}</span><span class="sub">${esc(j.pos1 || "")}</span></div><span class="chip ${j.promovido ? "ok" : "ina"}">${j.promovido ? "Promovido" : "Retirado"}</span></a>`).join("")}</div></details></section>`;
};
document.addEventListener("click", async ev => {
  const t = ev.target.closest('[data-act="g-foto"],[data-act="g-ret"]'); if (!t || S.busy) return;
  const j = jById(t.dataset.id); if (!j) return;
  if (!navigator.onLine) { toast("Se necesita señal para hacer este cambio."); return; }
  if (t.dataset.act === "g-foto") {
    if (!confirm(`¿Quitar la foto de ${shortName(j.nombre)}? Se borra en el Centro y en Partido en vivo.`)) return;
    S.busy = true; render();
    try { await window.quitarFoto(j.id); aplicarImagenes(window.imagenesGuardadas()); toast("Foto quitada."); }
    catch (e) { toast("No se pudo quitar la foto: " + ((e && e.message) || "sin señal")); }
    S.busy = false; render(); return;
  }
  const v = t.dataset.v, ret = v === "Retirado", pro = v === "Promovido";
  let destino = "";
  if (pro) { destino = prompt(`¿A qué equipo o categoría pasa ${shortName(j.nombre)}? (por ejemplo: Sub-17A)`, ""); if (destino === null) return; destino = destino.trim().slice(0, 40); if (!destino) { toast("Escribe el equipo de destino."); return; } }
  else if (!confirm(ret ? `¿Marcar a ${j.nombre} como retirado del equipo? Se conserva su historial y se quita su acceso a «Mi progreso».` : `¿Reincorporar a ${j.nombre} al equipo?`)) return;
  S.busy = true; render();
  try {
    await window.puenteDT({ op: "set", range: `Plantilla!P${j.row}`, values: [[v]] });
    if (ret) { try { await window.puenteDT({ op: "jugQuitar", id: j.id }); } catch (e) {} }
    if (pro || v === "Activo") {
      const data = { promo: pro ? { a: destino, ts: Date.now() } : null }, ruta = "comunidad/" + j.id;
      try { const w = await window.puenteDT({ op: "escribir", ops: [{ id: "g1", tipo: "update", ruta, data }] }); if (pro && !(w.resultados || []).every(x => x.ok)) await window.puenteDT({ op: "escribir", ops: [{ id: "g2", tipo: "set", ruta, data }] }); } catch (e) {}
    }
    toast(pro ? `${shortName(j.nombre)} promovido a ${destino}. Se publica en el muro.` : ret ? "Jugador marcado como retirado." : "Jugador reincorporado.");
    S.busy = false; await loadAll();
  } catch (e) { toast("No se pudo guardar: " + gsErrorText(e)); }
  S.busy = false; render();
});

/* ---------- Comunidad (v2.2): aprobar perfiles, anuncios, muro y visibilidad ---------- */
const CM = { d: LS.get("com", null), busy: null, err: null, t: 0, ver: {} };
const RXI = { aplauso: "👏", fuego: "🔥", fuerza: "💪", corazon: "❤️", balon: "⚽" };
const ICOM = { victoria: "🏆", mvp: "⭐", gol: "⚽", hattrick: "⚽⚽⚽", asis: "🎯", valla: "🧤", debut: "🌟", test: "📈", cumple: "🎂", anuncio: "📣", promocion: "🚀", post: "💬" };
async function comCargar(force) {
  if (CM.busy || (!force && Date.now() - CM.t < 30000)) return;
  CM.busy = "carga"; render();
  try { CM.d = await window.puenteDT({ op: "comMuro" }, 90000); CM.err = null; LS.set("com", CM.d); }
  catch (e) { CM.err = e && e.code === "operacion_desconocida" ? "Falta actualizar el puente a la versión 12. Pega el código nuevo en Apps Script y publica una versión nueva." : e && e.code === "server_unavailable" ? "Sin señal: se muestra la última copia." : gsErrorText(e); }
  CM.t = Date.now(); CM.busy = null; render();
}
async function comEscribir(ops, ok) {
  if (CM.busy) return; CM.busy = "w"; render();
  try {
    const r = await window.puenteDT({ op: "escribir", ops: ops.map((o, i) => Object.assign({ id: "c" + Date.now() + i }, o)) });
    if (!(r.resultados || []).every(x => x.ok)) throw { code: "tool_error", message: "La base no aceptó el cambio" };
    toast(ok); CM.busy = null; CM.t = 0; await comCargar(true);
  } catch (e) { CM.busy = null; toast("No se pudo guardar: " + ((e && e.message) || "sin señal")); render(); }
}
/* Cambia solo los campos indicados del documento (si no existe, lo crea): no borra emoji, gustos ni ascenso. */
async function comUpsert(ruta, data, ok) {
  if (CM.busy) return; CM.busy = "w"; render();
  try {
    let w = await window.puenteDT({ op: "escribir", ops: [{ id: "u" + Date.now(), tipo: "update", ruta, data }] });
    if (!(w.resultados || []).every(x => x.ok)) w = await window.puenteDT({ op: "escribir", ops: [{ id: "s" + Date.now(), tipo: "set", ruta, data }] });
    if (!(w.resultados || []).every(x => x.ok)) throw { message: "La base no aceptó el cambio" };
    toast(ok); CM.busy = null; CM.t = 0; await comCargar(true);
  } catch (e) { CM.busy = null; toast("No se pudo guardar: " + ((e && e.message) || "sin señal")); render(); }
}
window.vComunidad = function () {
  setTimeout(() => comCargar(false), 0);
  const d = CM.d;
  let h = `${subnav(SUBJ, "comunidad")}<h2>Comunidad</h2>${CM.err ? `<div class="banner ${d ? "warn" : "err"}">${esc(CM.err)}</div>` : ""}`;
  if (!d) return h + `<section class="sec"><p class="empty">${CM.busy ? "Cargando…" : "Toca Actualizar."}</p><button class="btn sm" data-act="cm-reload">Actualizar</button></section>`;
  const pend = d.perfiles.filter(p => p.prop);
  h += `<section class="sec"><div class="sec-h"><h3>Por aprobar</h3><span class="hint">${pend.length}</span></div>${pend.length ? `<div class="list">${pend.map(p => { const j = jById(p.id) || { id: p.id, nombre: p.nombre };
    return `<div class="ccard"><div class="att-top">${avatar(j, "sm")}<div class="meta" style="flex:1;min-width:0"><span class="nm" style="font-weight:700">${esc(p.nombre)}</span>${p.prop.apodo ? `<span class="sub">Apodo: <b style="color:var(--ink)">${esc(p.prop.apodo)}</b>${p.apodo && p.apodo !== p.prop.apodo ? ` (antes: ${esc(p.apodo)})` : ""}</span>` : '<span class="sub">Sin apodo</span>'}</div></div>
      ${p.prop.desc ? `<p style="margin:0">“${esc(p.prop.desc)}”</p>` : '<p class="hint">Sin descripción</p>'}
      <div class="fgrid"><button class="btn sm" data-act="cm-rech" data-id="${p.id}" ${CM.busy ? "disabled" : ""}>Rechazar</button><button class="btn pri sm" data-act="cm-ok" data-id="${p.id}" ${CM.busy ? "disabled" : ""}>Aprobar</button></div></div>`; }).join("")}</div>` : '<p class="empty">No hay perfiles por aprobar.</p>'}</section>`;
  const pp = (d.posts || []).filter(x => x.estado === "pendiente");
  h += `<section class="sec"><div class="sec-h"><h3>Publicaciones por aprobar</h3><span class="hint">${pp.length}</span></div>${pp.length ? `<div class="list">${pp.map(x => { const j = jById(x.autor) || { id: x.autor, nombre: x.nombre }, f = x.foto && window.foto(x.foto);
    return `<div class="ccard"><div class="att-top">${avatar(j, "sm")}<div class="meta" style="flex:1;min-width:0"><span class="nm" style="font-weight:700">${esc(x.nombre)}</span><span class="sub">${esc(dLong(new Date(x.ts)))}</span></div></div>
      ${x.texto ? `<p style="margin:0;white-space:pre-line">${esc(x.texto)}</p>` : ""}${x.foto ? (f ? `<img src="${f}" alt="Foto de la publicación" style="width:100%;max-height:360px;object-fit:cover;border-radius:12px">` : '<p class="hint">Cargando foto…</p>') : ""}
      <div class="fgrid"><button class="btn sm" data-act="cm-prech" data-id="${esc(x.id)}" ${CM.busy ? "disabled" : ""}>Rechazar</button><button class="btn pri sm" data-act="cm-pok" data-id="${esc(x.id)}" ${CM.busy ? "disabled" : ""}>Aprobar y publicar</button></div></div>`; }).join("")}</div>` : '<p class="empty">No hay publicaciones por aprobar.</p>'}</section>`;
  if (d.emojis) {
    const G = d.gustos || [], dt = d.dt || {}, gu = CM.gu || (CM.gu = JSON.parse(JSON.stringify(dt.tags || {})));
    h += `<section class="sec"><div class="sec-h"><h3>Mi perfil de entrenador</h3>${dt.emo ? `<span style="font-size:1.6rem">${dt.emo}</span>` : ""}</div>
      <p class="hint">Tu emoji del día (24 horas) y tus gustos se ven en tu tarjeta de «Equipo». Los demás datos salen de Config (filas «Perfil DT · …»).</p>
      <div style="display:grid;grid-template-columns:repeat(8,1fr);gap:6px">${d.emojis.map(x => `<button class="btn sm" style="font-size:1.25rem;padding:0;min-height:40px;${dt.emo === x ? "border:2px solid var(--accent);background:var(--sky-soft)" : ""}" data-act="cm-emo" data-v="${x}" ${CM.busy ? "disabled" : ""}>${x}</button>`).join("")}</div>
      ${dt.emo ? `<button class="btn sm" data-act="cm-emo" data-v="" style="align-self:flex-start" ${CM.busy ? "disabled" : ""}>Quitar emoji</button>` : ""}
      ${G.map(g => { const sel = gu[g.k] || []; return `<div><span class="hint" style="font-weight:700;text-transform:uppercase;letter-spacing:.05em;font-size:.74rem">${esc(g.t)} · ${sel.length}/${g.max}</span><div class="row" style="gap:6px;margin-top:6px">${g.l.map(x => { const on = sel.includes(x); return `<button class="fchip" aria-pressed="${on}" data-act="cm-tag" data-k="${g.k}" data-v="${esc(x)}" ${!on && sel.length >= g.max && g.max > 1 ? "disabled" : ""}>${esc(x)}</button>`; }).join("")}</div></div>`; }).join("")}
      <button class="btn pri" data-act="cm-gustos" ${CM.busy ? "disabled" : ""}>Guardar mis gustos</button></section>`;
  }
  h += `<section class="sec"><h3>Anuncio en el muro</h3><label class="f">Texto<textarea id="cm-anuncio" rows="2" maxlength="280" placeholder="Ej.: Mañana entreno a las 3 p. m. en la sede.">${esc(CM.borrador || "")}</textarea></label>
    <button class="btn pri" data-act="cm-pub" ${CM.busy ? "disabled" : ""}>Publicar anuncio</button>
    ${d.anuncios.length ? `<div class="list">${d.anuncios.sort((a, b) => b.ts - a.ts).map(a => `<div class="li"><div class="meta"><span class="nm">📣 ${esc(a.texto)}</span><span class="sub">${esc(dLong(new Date(a.ts)))}</span></div><button class="btn sm" data-act="cm-borrar" data-id="${esc(a.id)}" ${CM.busy ? "disabled" : ""}>Borrar</button></div>`).join("")}</div>` : ""}</section>`;
  h += `<section class="sec"><div class="sec-h"><h3>Muro</h3><button class="btn sm" data-act="cm-reload" ${CM.busy ? "disabled" : ""}>${CM.busy === "carga" ? "Cargando…" : "Actualizar"}</button></div>
    <p class="hint">Jugadores y familias ven solo los totales de reacciones. Tú ves quién reaccionó. Lo oculto no lo ve nadie más.</p>
    ${d.muro.length ? `<div class="list">${d.muro.map(p => { const c = {}; p.quien.forEach(q => c[q.tipo] = (c[q.tipo] || 0) + 1); const open = CM.ver[p.id];
      return `<div class="ccard" style="${p.oculto ? "opacity:.55" : ""}"><div class="att-top"><span style="font-size:1.4rem">${ICOM[p.tipo] || "⭐"}</span><div class="meta" style="flex:1;min-width:0"><span class="nm" style="font-weight:700">${p.tipo === "post" ? esc(p.autor) + ": " : ""}${esc(p.texto)}</span><span class="sub">${esc(p.fecha)}${p.oculto ? " · oculta" : ""}</span></div>${p.tipo === "post" ? `<button class="btn sm" data-act="cm-pdel" data-id="${esc(p.id.replace(/^post_/, ""))}" ${CM.busy ? "disabled" : ""}>Borrar</button>` : ""}<button class="btn sm" data-act="cm-oc" data-id="${esc(p.id)}" data-v="${p.oculto ? 0 : 1}" ${CM.busy ? "disabled" : ""}>${p.oculto ? "Mostrar" : "Ocultar"}</button></div>
        ${p.quien.length ? `<button class="linkbtn" data-act="cm-ver" data-id="${esc(p.id)}">${Object.keys(c).map(k => RXI[k] + " " + c[k]).join("  ")} · ${open ? "ocultar nombres" : "ver quién"}</button>${open ? `<p class="hint" style="margin:0">${p.quien.map(q => esc(q.nombre) + " " + (RXI[q.tipo] || "")).join(" · ")}</p>` : ""}` : '<span class="hint">Sin reacciones</span>'}</div>`; }).join("")}</div>` : '<p class="empty">Aún no hay publicaciones.</p>'}</section>`;
  h += `<section class="sec"><h3>Perfiles y visibilidad</h3><p class="hint">Si una familia prefiere que su hijo no aparezca en Equipo ni en el Muro, apaga «Visible». Él sigue viendo su propio progreso.</p>
    <div class="list">${d.perfiles.map(p => { const j = jById(p.id) || { id: p.id, nombre: p.nombre };
      const nt = Object.values(p.tags || {}).reduce((a, x) => a + (x || []).length, 0);
      return `<div class="li">${avatar(j, "sm")}<div class="meta"><span class="nm">${p.emo ? p.emo + " " : ""}${esc(p.nombre)}${p.apodo ? ` <span class="chip b">${esc(p.apodo)}</span>` : ""}</span><span class="sub">${p.desc ? esc(p.desc) : "Sin descripción aprobada"}${nt ? ` · ${nt} gustos` : ""}</span>${p.emo ? `<button class="linkbtn" data-act="cm-quitaremo" data-id="${p.id}">Quitar su emoji</button>` : ""}</div>
        <label class="row" style="gap:6px;font-size:.85rem;font-weight:700;flex:none"><input type="checkbox" data-act="cm-vis" data-id="${p.id}" ${p.visible ? "checked" : ""} ${CM.busy ? "disabled" : ""} style="width:22px;height:22px">Visible</label></div>`; }).join("")}</div></section>`;
  return h;
};
document.addEventListener("input", ev => { if (ev.target.id === "cm-anuncio") CM.borrador = ev.target.value; });
document.addEventListener("click", ev => {
  const t = ev.target.closest("[data-act^='cm-']"); if (!t || !CM.d) return;
  const a = t.dataset.act, id = t.dataset.id, P = id && CM.d.perfiles.find(x => x.id === id);
  const full = p => ({ apodo: p.apodo || "", desc: p.desc || "", prop: p.prop || null, rech: p.rech || null, visible: p.visible !== false });
  if (a === "cm-reload") { comCargar(true); return; }
  if (a === "cm-ver") { CM.ver[id] = !CM.ver[id]; render(); return; }
  if (a === "cm-tag") { const g = (CM.d.gustos || []).find(x => x.k === t.dataset.k), v = t.dataset.v, arr = CM.gu[g.k] = CM.gu[g.k] || []; const i = arr.indexOf(v); if (i >= 0) arr.splice(i, 1); else if (g.max === 1) arr.splice(0, 1, v); else if (arr.length < g.max) arr.push(v); render(); return; }
  if (!navigator.onLine) { toast("Se necesita señal para este cambio."); ev.preventDefault(); return; }
  if (a === "cm-ok" && P) comUpsert("comunidad/" + id, { apodo: P.prop.apodo || "", desc: P.prop.desc || "", prop: null, rech: null }, "Perfil aprobado.");
  else if (a === "cm-rech" && P) { const m = prompt("Motivo para el jugador (opcional):", ""); if (m === null) return; comUpsert("comunidad/" + id, { prop: null, rech: { motivo: m.trim().slice(0, 200), ts: Date.now() } }, "Propuesta rechazada."); }
  else if (a === "cm-vis" && P) comUpsert("comunidad/" + id, { visible: t.checked }, t.checked ? "Visible para el equipo." : "Oculto para el equipo.");
  else if (a === "cm-oc") { const ids = {}; CM.d.muro.forEach(p => { if (p.oculto) ids[p.id] = true; }); if (t.dataset.v === "1") ids[id] = true; else delete ids[id]; comEscribir([{ tipo: "set", ruta: "comunidad/ocultos", data: { ids } }], t.dataset.v === "1" ? "Publicación oculta." : "Publicación visible."); }
  else if (a === "cm-pub") { const x = String(CM.borrador || "").trim(); if (!x) { toast("Escribe el anuncio."); return; } comEscribir([{ tipo: "set", ruta: "anuncios/a" + Date.now().toString(36), data: { texto: x.slice(0, 280), ts: Date.now() } }], "Anuncio publicado."); CM.borrador = ""; }
  else if (a === "cm-pok") comEscribir([{ tipo: "update", ruta: "posts/" + id, data: { estado: "aprobado", tsAprob: Date.now(), motivo: "" } }], "Publicación aprobada.");
  else if (a === "cm-prech") { const m = prompt("Motivo para el jugador (opcional):", ""); if (m === null) return; comEscribir([{ tipo: "update", ruta: "posts/" + id, data: { estado: "rechazado", motivo: m.trim().slice(0, 200) } }], "Publicación rechazada."); }
  else if (a === "cm-pdel") { if (!confirm("¿Borrar esta publicación del muro? No se puede deshacer.")) return; const x = (CM.d.posts || []).find(q => q.id === id); comEscribir([{ tipo: "delete", ruta: "posts/" + id }], "Publicación borrada.").then(() => { if (x && x.foto) window.puenteDT({ op: "fotoBorrar", id: x.foto }).catch(() => {}); }); }
  else if (a === "cm-emo") { const dt = CM.d.dt || {}; comEscribir([{ tipo: "set", ruta: "comunidad/DT", data: { emo: t.dataset.v ? { e: t.dataset.v, ts: Date.now() } : null, tags: dt.tags || {} } }], t.dataset.v ? "Emoji del día publicado." : "Emoji quitado."); }
  else if (a === "cm-gustos") { const dt = CM.d.dt || {}; comEscribir([{ tipo: "set", ruta: "comunidad/DT", data: { emo: dt.emoRaw || null, tags: CM.gu || {} } }], "Gustos guardados."); CM.gu = null; }
  else if (a === "cm-quitaremo" && P) comUpsert("comunidad/" + id, { emo: null }, "Emoji quitado.");
  else if (a === "cm-borrar") { if (!confirm("¿Borrar este anuncio del muro?")) return; comEscribir([{ tipo: "delete", ruta: "anuncios/" + id }], "Anuncio borrado."); }
});

/* ============ v4.1 · Calendario de próximos partidos (hoja «Calendario») ============
   Columnas: ID · Fecha · Hora · Rival · Competición · Localía · Cancha / Sede · Citación · Nota · Estado.
   Los partidos ya jugados (con marcador en Partidos) y los de fechas pasadas salen solos de la lista. */
const ESTADOS_CAL = ["Programado", "Aplazado", "Cancelado"];
const horaTxt = h => { const m = /^(\d{1,2}):(\d{2})/.exec(String(h || "")); if (!m) return String(h || ""); let H = +m[1]; const ap = H >= 12 ? "p. m." : "a. m."; H = H % 12 || 12; return H + ":" + m[2] + " " + ap; };
const DIAS3 = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
window.calFusionar = function (r) {
  const clave = (f, rv) => (f ? f.getTime() : "") + "|" + String(rv || "").trim().toLowerCase();
  const jugados = new Set(S.partidos.map(p => clave(p.fecha, p.rival)));
  S.cal = (r.cal || []).map((x, i) => x && x[3] ? { row: i + 2, id: x[0] || "", fecha: pDate(x[1]), hora: x[2] || "", rival: x[3], comp: x[4] || "", loc: x[5] || "", cancha: x[6] || "", cit: x[7] || "", nota: x[8] || "", estado: x[9] || "Programado" } : null).filter(Boolean);
  S.calFilas = (r.cal || []).length;
  const hoy = today0(), visto = new Set(), out = [];
  S.cal.forEach(c => { if (!c.fecha || c.fecha < hoy || /cancel/i.test(c.estado)) return; const k = clave(c.fecha, c.rival); if (jugados.has(k) || visto.has(k)) return; visto.add(k); out.push(Object.assign({ src: "cal" }, c)); });
  (S.fixtures || []).forEach(f => { const k = clave(f.fecha, f.rival); if (visto.has(k)) return; visto.add(k); out.push(Object.assign({ hora: "", cancha: "", cit: "", nota: "", estado: "" }, f)); });
  out.sort((a, b) => a.fecha - b.fecha || String(a.hora).localeCompare(String(b.hora)));
  S.fixtures = out;
};
const fechaCorta = d => d ? DIAS3[d.getDay()] + " " + d.getDate() + " " + MES[d.getMonth()] : "";
window.calDetalle = function (f) { return [f.hora ? horaTxt(f.hora) : "", f.cancha, f.cit ? "Citación " + horaTxt(f.cit) : ""].filter(Boolean).join(" · "); };
window.calDespues = function () {
  const sig = (S.fixtures || []).slice(1, 4); if (!sig.length) return "";
  return `<div class="list" style="margin-top:12px">${sig.map(f => `<div class="li" style="cursor:default"><span class="nm" style="flex:1"><b>Después: ${esc(f.rival)}</b><br><span class="hint">${esc([fechaCorta(f.fecha), f.hora ? horaTxt(f.hora) : "", f.loc].filter(Boolean).join(" · "))}</span></span>${/aplaz/i.test(f.estado) ? '<span class="chip sus">Aplazado</span>' : ""}</div>`).join("")}</div>`;
};
let CAL = null; // ventana de edición
window.vCalendario = function () {
  const hoy = today0();
  const prox = (S.cal || []).filter(c => c.fecha && c.fecha >= hoy).sort((a, b) => a.fecha - b.fecha || String(a.hora).localeCompare(String(b.hora)));
  const pasados = (S.cal || []).filter(c => c.fecha && c.fecha < hoy).length;
  let h = `<section class="sec" id="calendario"><div class="sec-h"><h3>Próximos partidos</h3><button class="btn sm pri" data-act="cal-nuevo">Agregar partido</button></div>`;
  if (!prox.length) h += `<p class="empty">No hay partidos programados. Agrégalos aquí: aparecen en Inicio y en Mi progreso de cada jugador.</p>`;
  else h += `<div class="list">${prox.map(c => `<button class="li" data-act="cal-editar" data-row="${c.row}" style="text-align:left;width:100%">${rivalCrest(c.rival, 36)}<span class="nm" style="flex:1"><b>vs ${esc(c.rival)}</b><br><span class="hint">${esc([fechaCorta(c.fecha), c.hora ? horaTxt(c.hora) : "", c.loc, c.comp].filter(Boolean).join(" · "))}</span>${c.cancha || c.cit ? `<br><span class="hint">${esc([c.cancha, c.cit ? "Citación " + horaTxt(c.cit) : ""].filter(Boolean).join(" · "))}</span>` : ""}</span>${/aplaz/i.test(c.estado) ? '<span class="chip sus">Aplazado</span>' : /cancel/i.test(c.estado) ? '<span class="chip les">Cancelado</span>' : ""}</button>`).join("")}</div>`;
  h += `<p class="hint">Lo ven los jugadores y las familias en Mi progreso (fecha, hora, cancha, citación y nota). Los partidos jugados o con fecha pasada salen solos${pasados ? ` (${pasados} en el historial de la hoja «Calendario»)` : ""}.</p></section>`;
  return h;
};
function calVentana() {
  let el = document.getElementById("cal-ovl");
  if (!CAL) { if (el) el.remove(); document.body.style.overflow = ""; return; }
  if (!el) { el = document.createElement("div"); el.id = "cal-ovl"; el.className = "ovl"; document.body.appendChild(el); document.body.style.overflow = "hidden"; }
  const c = CAL.c, rivales = [...new Set([...(S.partidos || []).map(p => p.rival), ...(S.cal || []).map(x => x.rival)].filter(Boolean))].sort();
  const comps = [...new Set([...(CLUB.comps || []), ...(S.partidos || []).map(p => p.comp), "Amistoso"].filter(Boolean))];
  const iso = d => d ? d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0") : "";
  const hhmm = h => { const m = /^(\d{1,2}):(\d{2})/.exec(String(h || "")); return m ? m[1].padStart(2, "0") + ":" + m[2] : ""; };
  el.innerHTML = `<div class="box" role="dialog" aria-label="${c.row ? "Editar partido" : "Agregar partido"}"><div class="sec-h"><h2>${c.row ? "Editar partido" : "Agregar partido"}</h2><button class="btn sm" data-act="cal-cerrar">Cerrar</button></div>
    <div class="fgrid">
      <label class="f">Fecha<input type="date" id="cal-fecha" value="${iso(c.fecha)}" required></label>
      <label class="f">Hora<input type="time" id="cal-hora" value="${hhmm(c.hora)}"></label>
      <label class="f" style="grid-column:1/-1">Rival<input id="cal-rival" list="cal-rivales" autocomplete="off" value="${esc(c.rival || "")}" placeholder="Ej. Cordeajax"></label>
      <datalist id="cal-rivales">${rivales.map(x => `<option value="${esc(x)}">`).join("")}</datalist>
      <label class="f">Competición<input id="cal-comp" list="cal-comps" autocomplete="off" value="${esc(c.comp || "")}"></label>
      <datalist id="cal-comps">${comps.map(x => `<option value="${esc(x)}">`).join("")}</datalist>
      <label class="f">Localía<select id="cal-loc">${["", "Local", "Visitante", "Neutral"].map(x => `<option ${x === c.loc ? "selected" : ""} value="${x}">${x || "—"}</option>`).join("")}</select></label>
      <label class="f">Cancha / sede<input id="cal-cancha" value="${esc(c.cancha || "")}" placeholder="Ej. Ciudad Jaguares"></label>
      <label class="f">Citación<input type="time" id="cal-cit" value="${hhmm(c.cit)}"></label>
      <label class="f" style="grid-column:1/-1">Nota para jugadores y familias<input id="cal-nota" maxlength="140" value="${esc(c.nota || "")}" placeholder="Ej. Uniforme azul, llevar hidratación"></label>
      ${c.row ? `<label class="f" style="grid-column:1/-1">Estado<select id="cal-estado">${ESTADOS_CAL.map(x => `<option ${x === (c.estado || "Programado") ? "selected" : ""}>${x}</option>`).join("")}</select></label>` : ""}
    </div>
    ${CAL.err ? `<div class="banner err">${esc(CAL.err)}</div>` : ""}
    <button class="btn pri wide" data-act="cal-guardar" ${CAL.busy ? "disabled" : ""}>${CAL.busy ? "Guardando…" : "Guardar"}</button>
    ${c.row ? `<button class="linkbtn" data-act="cal-quitar" ${CAL.busy ? "disabled" : ""} style="color:var(--danger)">Quitar del calendario</button>` : ""}</div>`;
}
document.addEventListener("click", async ev => {
  const t = ev.target.closest("[data-act^='cal-']"); if (!t) return;
  const a = t.dataset.act, $v = id => { const x = document.getElementById(id); return x ? String(x.value || "").trim() : ""; };
  if (a === "cal-nuevo") { CAL = { c: { loc: "", estado: "Programado" } }; calVentana(); return; }
  if (a === "cal-editar") { const c = (S.cal || []).find(x => x.row === +t.dataset.row); if (c) { CAL = { c: Object.assign({}, c) }; calVentana(); } return; }
  if (a === "cal-cerrar") { CAL = null; calVentana(); return; }
  if (!CAL || CAL.busy) return;
  if (!navigator.onLine) { CAL.err = "Se necesita señal para guardar el calendario."; calVentana(); return; }
  const c = CAL.c;
  let fila, ok;
  if (a === "cal-quitar") {
    if (!confirm("¿Quitar este partido del calendario?")) return;
    fila = ["", "", "", "", "", "", "", "", "", ""]; ok = "Partido quitado del calendario.";
  } else if (a === "cal-guardar") {
    const fecha = $v("cal-fecha"), rival = $v("cal-rival");
    if (!fecha || !rival) { CAL.err = "Escribe la fecha y el rival."; calVentana(); return; }
    fila = [c.id || "C" + Date.now().toString(36), dateFormula(fecha), $v("cal-hora"), rival.slice(0, 60), $v("cal-comp").slice(0, 60), $v("cal-loc"), $v("cal-cancha").slice(0, 80), $v("cal-cit"), $v("cal-nota").slice(0, 140), c.row ? ($v("cal-estado") || "Programado") : "Programado"];
    ok = c.row ? "Partido actualizado." : "Partido agregado al calendario.";
  } else return;
  const row = c.row || (2 + (S.calFilas || 0));
  CAL.busy = true; CAL.err = null; calVentana();
  try { await gs("update_values", { range: `Calendario!A${row}:J${row}`, values: [fila] }); CAL = null; calVentana(); toast(ok); await loadAll(); }
  catch (e) { CAL.busy = false; CAL.err = "No se pudo guardar: " + gsErrorText(e) + (e && /operacion|Calendario|hoja/i.test(String(e.message || e.code || "")) ? " ¿Ya pegaste el puente v16?" : ""); calVentana(); }
});

/* ============ v4.2 · Bienestar semanal dentro de Mi progreso ============ */
let BE = null; // estado de la pestaña Bienestar (¿vinculada a un Google Forms?)
async function bienEstadoCargar() { if (BE && BE.cargando) return; BE = { cargando: true }; try { BE = await window.puenteDT({ op: "bienEstado" }); } catch (e) { BE = { error: true }; } render(); }
function enlaceBien() {
  const u = window.__acceso && window.__acceso(); if (!u || !u.url) return "";
  const tok = btoa(unescape(encodeURIComponent(JSON.stringify({ url: u.url }))));
  return location.origin + "/sige-jaguares/#p=" + encodeURIComponent(tok) + "&ir=bienestar";
}
window.bienExtra = function (act, resp) {
  if (!BE) setTimeout(bienEstadoCargar, 0);
  const n = act.filter(j => resp.has(j.id)).length, link = enlaceBien();
  return `<div class="kpis" style="margin:4px 0 10px"><div class="kpi"><b>${n}</b><span>Respondieron</span></div><div class="kpi"><b>${act.length - n}</b><span>Faltan</span></div></div>
    ${BE && BE.vinculada ? '<div class="banner warn">La pestaña Bienestar todavía recibe respuestas de un Google Forms. Ciérralo («No aceptar respuestas») o desvincúlalo para no mezclar filas.</div>' : ""}
    ${BE && BE.existe === false ? '<div class="banner err">No existe la pestaña «Bienestar» en la hoja.</div>' : ""}
    ${BE && BE.error ? '<div class="banner warn">Para el formulario dentro de la app hace falta el puente v17.</div>' : ""}
    ${link ? `<button class="btn sm" data-act="bien-copiar">Copiar enlace para WhatsApp</button> <span class="hint">Siempre es el mismo: abre Mi progreso directo en el formulario. Se pide responder el viernes después del último entrenamiento y se recibe hasta el sábado.</span>` : ""}`;
};
document.addEventListener("click", async ev => {
  const t = ev.target.closest("[data-act='bien-copiar']"); if (!t) return;
  const txt = "📋 Formulario de bienestar de la semana (Jaguares). Respóndelo HOY VIERNES, después del entrenamiento (se recibe hasta el sábado). Son 2 minutos: " + enlaceBien();
  try { await navigator.clipboard.writeText(txt); toast("Enlace copiado. Pégalo en el grupo de WhatsApp."); } catch (e) { prompt("Copia este mensaje:", txt); }
});
})();

/* ---------- v4.3 · Tests físicos: informe gráfico (podio, mejoras, niveles, ranking, líneas, alertas, imagen) ---------- */
(function () {
const cssT = `
.tst-pod{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));align-items:end;gap:8px;text-align:center;margin-top:6px}
.tst-pod .nm{font-weight:700;font-size:.86rem;line-height:1.15;overflow-wrap:normal;word-break:normal}
.tst-pod .vv{color:var(--muted);font-size:.82rem;margin:2px 0 4px}
.tst-pod .bl{border-radius:8px 8px 0 0;color:#fff;font-family:var(--display);font-weight:800;font-size:1.3rem;padding-top:6px}
.tst-niv{display:flex;height:22px;border-radius:8px;overflow:hidden;gap:2px;margin:6px 0 8px}
.tst-niv button{border:0;padding:0;min-width:0;cursor:pointer}
.tst-lg{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px 10px;font-size:.84rem}
.tst-lg button{display:flex;align-items:center;gap:6px;background:none;border:0;padding:4px 0;text-align:left;color:var(--ink)}
.tst-lg button[aria-pressed="true"]{font-weight:700}
.tst-lg i,.tst-dot{width:10px;height:10px;border-radius:3px;flex:none;display:inline-block}
.tst-rk{display:flex;flex-direction:column;gap:8px}
.tst-rk a{text-decoration:none;color:inherit}
.tst-rk .lb{display:flex;justify-content:space-between;gap:8px;font-size:.92rem}
.tst-rk .tr{position:relative;height:9px;background:var(--surface-2);border-radius:5px;margin-top:3px}
.tst-rk .tr i{display:block;height:9px;border-radius:5px}
.tst-rk .md{position:absolute;top:-4px;width:2px;height:17px;background:var(--ink);opacity:.55}
.tst-db{position:relative;height:16px;margin:2px 0 4px}
.tst-db .ln{position:absolute;top:7px;height:2px;background:var(--sky)}
.tst-db .pt{position:absolute;top:3px;width:10px;height:10px;border-radius:50%;margin-left:-5px}
.tst-al{border-left:4px solid var(--warn);border-radius:0;padding:4px 0 4px 10px;margin:6px 0}
.tst-msg{background:var(--surface-2);border-radius:10px;padding:10px 12px;font-size:.92rem}
`;
const stT = document.createElement("style"); stT.textContent = cssT; document.head.appendChild(stT);

const NIV = [["Excelente", "var(--ok)"], ["Bueno", "var(--sky)"], ["Regular", "var(--warn)"], ["A mejorar", "var(--danger)"]];
const nivCol = n => (NIV.find(x => x[0] === n) || [0, "var(--accent)"])[1];
// Mismas reglas que el puente (testsEquipo_ en Code.gs)
function tstNivel(puesto, n) { if (n < 6 || !puesto) return ""; const f = (puesto - 1) / n; return f < 0.25 ? "Excelente" : f < 0.5 ? "Bueno" : f < 0.75 ? "Regular" : "A mejorar"; }
window.tstNivel = tstNivel;
const LINEAS = [["por", "Porteros"], ["def", "Defensas"], ["med", "Medios"], ["del", "Delanteros"]];
const ALERTA = 0.05;
S.tstToma = S.tstToma || {}; S.tstNiv = "";

function fechaToma(test, toma) { let f = null; S.tests.forEach(t => { if (t.test === test && t.toma === toma && t.f && (!f || t.f > f)) f = t.f; }); return f; }
function datos(test) {
  const m = testMeta(test), menor = m.mejor === "Menor";
  const tomas = tomasOf(test).map(tk => {
    const arr = S.jug.map(j => ({ j, v: (tomaVals(j.id, test)[tk] || {}).res })).filter(x => x.v != null).sort((a, b) => menor ? a.v - b.v : b.v - a.v);
    arr.forEach(x => { x.p = 1 + arr.filter(y => menor ? y.v < x.v : y.v > x.v).length; x.nivel = tstNivel(x.p, arr.length); });
    return { toma: tk, arr, n: arr.length, media: arr.length ? arr.reduce((s, x) => s + x.v, 0) / arr.length : null, fecha: fechaToma(test, tk) };
  });
  tomas.forEach((k, i) => { const a = i ? tomas[i - 1] : null; k.ant = a; k.arr.forEach(x => { const y = a && a.arr.find(z => z.j.id === x.j.id); x.ant = y ? y.v : null; x.mej = y ? improve(test, y.v, x.v) : null; }); });
  return { m, menor, tomas };
}
window.tstDatos = datos;
const pct = p => (p >= 0 ? "+" : "−") + Math.abs(Math.round(p * 100)) + "%";
function difTxt(a, b, m) { // cambio de la media: texto «mejor/peor»
  if (a == null || b == null) return ""; const d = b - a, mej = m.mejor === "Menor" ? d < 0 : d > 0;
  if (Math.abs(d) < 1e-9) return '<span class="hint">igual que la toma anterior</span>';
  const v = m.u === "s" && Math.abs(d) >= 60 ? fmtV(Math.abs(d), m.u) + " min" : fmtR(Math.round(Math.abs(d) * 10) / 10) + " " + m.u;
  return `<span style="color:var(--${mej ? "ok" : "danger"});font-weight:700">${mej ? "▲" : "▼"} ${esc(v)} ${mej ? "mejor" : "peor"}</span><span class="hint"> que la toma anterior</span>`;
}
function escala(vals, menor) { const mn = Math.min(...vals), mx = Math.max(...vals); return v => mx === mn ? 50 : 6 + 88 * (menor ? (mx - v) / (mx - mn) : (v - mn) / (mx - mn)); }
function contexto(j, f) {
  const out = [], lim = f ? f.getTime() - 14 * 864e5 : 0, B = S.bien.filter(b => b.jid === j.id && (!f || (b.f.getTime() >= lim && b.f.getTime() <= f.getTime() + 864e5)));
  if (B.some(b => b.idx != null && b.idx < (S.config.bienBajo || 60))) out.push("bienestar bajo");
  if (B.some(b => b.mol && !/^ninguna/i.test(b.mol))) out.push("reportó molestias");
  try { const s = semaforo(j); if (s && s.acwr != null && s.acwr > (S.config.acwrHi || 1.5)) out.push("carga alta (ACWR " + fmtR(s.acwr) + ")"); } catch (e) {}
  return out;
}

window.tstVista = function () {
  let h = `${subnav(SUBS, "tests")}<h2>Tests físicos</h2>`;
  const tp = testsPresent();
  if (!tp.length) return h + `<section class="sec">${pendingBox("Pendiente", "Aún no hay tests registrados. Cuando tomes el primero verás el podio, los niveles del equipo, el ranking y quiénes más mejoraron.", btnLink("#reg-test", "Registrar un test", true))}</section>`;
  if (!tp.includes(S.testSel)) S.testSel = tp[0];
  const test = S.testSel, D = datos(test), m = D.m;
  const tk = D.tomas.some(k => k.toma === S.tstToma[test]) ? S.tstToma[test] : D.tomas[D.tomas.length - 1].toma;
  const K = D.tomas.find(k => k.toma === tk), ant = K.ant, arr = K.arr;
  h += `<div class="chips">${tp.map(t => `<button class="fchip" data-act="t3-test" data-v="${esc(t)}" aria-pressed="${t === test}">${esc(t)}</button>`).join("")}</div>`;
  if (D.tomas.length > 1) h += `<div class="chips" role="group" aria-label="Toma">${D.tomas.map(k => `<button class="fchip" data-act="tst-toma" data-v="${esc(k.toma)}" aria-pressed="${k.toma === tk}">${esc(k.toma)}</button>`).join("")}</div>`;
  const act = activePl(), sin = act.filter(j => !arr.some(x => x.j.id === j.id));
  const uTxt = m.u === "s" && arr.some(x => x.v >= 60) ? "min:s" : m.u;
  // 1. Resumen
  h += `<section class="sec"><div class="sec-h"><h3>${esc(test)} · ${esc(tk)}</h3><span class="hint">${esc(uTxt)} · mejor si es ${esc(String(m.mejor || "").toLowerCase())}${K.fecha ? " · " + esc(dLong(K.fecha)) : ""}</span></div>
   <div class="kpis"><div class="kpi"><b>${fmtV(K.media, m.u)}</b><span>Media del equipo</span></div><div class="kpi"><b>${K.n}${act.length ? `<small style="font-size:.55em"> de ${act.length}</small>` : ""}</b><span>Evaluados</span></div><div class="kpi"><b>${arr.length ? fmtV(arr[0].v, m.u) : "–"}</b><span>Mejor marca</span></div></div>
   ${ant ? `<p style="margin:8px 0 0">${difTxt(ant.media, K.media, m)}</p>` : ""}
   ${sin.length ? `<p class="hint" style="margin:8px 0 4px">Sin test en esta toma (${sin.length}):</p><div class="row">${sin.map(j => `<span class="chip ina" style="text-transform:none;font-size:.8rem">${esc(shortName(j.nombre))}</span>`).join("")}</div>` : ""}
   <button class="btn sm" data-act="tst-img" style="margin-top:10px;align-self:flex-start">Imagen para el grupo</button></section>`;
  // 2. Podio y 3. Más mejoraron
  const pod = arr.filter(x => x.p <= 3).slice(0, 3), ord = [pod[1], pod[0], pod[2]], alto = [70, 96, 52], col = ["#5BA9DC", "#1874B0", "#8CC8EA"];
  h += `<div class="cols"><section class="sec"><h3>Podio</h3>${pod.length ? `<div class="tst-pod">${ord.map((x, i) => x ? `<a href="#jugador-${x.j.id}" style="text-decoration:none;color:inherit"><div class="nm">${esc(shortName(x.j.nombre))}</div><div class="vv">${esc(fmtT(x.v, m.u))}</div><div class="bl" style="height:${alto[i]}px;background:${col[i]}">${x.p}</div></a>` : "<div></div>").join("")}</div>` : '<p class="empty">Sin resultados.</p>'}</section>`;
  const mj = arr.filter(x => x.mej != null && x.mej > 0).sort((a, b) => b.mej - a.mej).slice(0, 3);
  if (ant) {
    const sc = escala([...arr.map(x => x.v), ...ant.arr.map(x => x.v)], D.menor);
    h += `<section class="sec"><div class="sec-h"><h3>Más mejoraron</h3><span class="hint">${esc(ant.toma)} → ${esc(tk)}</span></div>${mj.length ? mj.map(x => `<div><div class="lb" style="display:flex;justify-content:space-between"><a href="#jugador-${x.j.id}" style="color:inherit;font-weight:600;text-decoration:none">${esc(shortName(x.j.nombre))}</a><b style="color:var(--ok)">${pct(x.mej)}</b></div>
       <div class="tst-db" aria-label="${esc(fmtT(x.ant, m.u) + " a " + fmtT(x.v, m.u))}"><span class="ln" style="left:${Math.min(sc(x.ant), sc(x.v))}%;width:${Math.abs(sc(x.v) - sc(x.ant))}%"></span><span class="pt" style="left:${sc(x.ant)}%;background:var(--surface-2);border:2px solid var(--sky)"></span><span class="pt" style="left:${sc(x.v)}%;background:var(--accent)"></span></div>
       <div class="hint" style="font-size:.8rem">${esc(fmtT(x.ant, m.u))} → ${esc(fmtT(x.v, m.u))}</div></div>`).join("") + '<p class="hint" style="margin-top:8px">Punto vacío: toma anterior · punto lleno: esta toma. Hacia la derecha es mejor.</p>' : '<p class="empty">Nadie mejoró frente a la toma anterior.</p>'}</section>`;
  } else h += `<section class="sec"><h3>Más mejoraron</h3><p class="empty">Aparece desde la segunda toma (${esc(test)} T2).</p></section>`;
  h += `</div>`;
  // 4. Niveles
  if (K.n >= 6) {
    const cnt = NIV.map(([n]) => arr.filter(x => x.nivel === n));
    const sel = NIV.some(x => x[0] === S.tstNiv) ? S.tstNiv : "";
    h += `<section class="sec"><div class="sec-h"><h3>Niveles del equipo</h3><span class="hint">comparado con el propio equipo</span></div>
     <div class="tst-niv">${NIV.map(([n, c], i) => cnt[i].length ? `<button data-act="tst-niv" data-v="${n}" style="flex:${cnt[i].length};background:${c}" aria-label="${n}: ${cnt[i].length}"></button>` : "").join("")}</div>
     <div class="tst-lg">${NIV.map(([n, c], i) => `<button data-act="tst-niv" data-v="${n}" aria-pressed="${sel === n}"><i style="background:${c}"></i>${n} · ${cnt[i].length}</button>`).join("")}</div>
     ${sel ? `<div class="row" style="margin-top:8px">${cnt[NIV.findIndex(x => x[0] === sel)].map(x => `<span class="chip" style="text-transform:none;font-size:.8rem">${esc(shortName(x.j.nombre))}</span>`).join("") || '<span class="hint">Nadie en este nivel.</span>'}</div>` : '<p class="hint" style="margin:6px 0 0">Toca un nivel para ver quiénes están. Excelente: el 25 % mejor del equipo; A mejorar: el 25 % que más debe trabajar.</p>'}</section>`;
  }
  // 5. Ranking
  const sc2 = escala(arr.map(x => x.v), D.menor), mdx = K.media != null ? sc2(K.media) : null;
  h += `<div class="cols"><section class="sec"><div class="sec-h"><h3>Ranking · ${esc(tk)}</h3><span class="hint">línea: media ${esc(fmtT(K.media, m.u))}</span></div><div class="tst-rk">${arr.map(x => `<a href="#jugador-${x.j.id}"><div class="lb"><span>${x.p}. ${esc(shortName(x.j.nombre))} <span class="hint ab">${esc(POS_AB[x.j.pos1] || "")}</span></span><span class="num">${esc(fmtT(x.v, m.u))}</span></div><div class="tr"><i style="width:${Math.max(4, sc2(x.v))}%;background:${x.nivel ? nivCol(x.nivel) : "var(--accent)"}"></i>${mdx != null ? `<span class="md" style="left:${mdx}%"></span>` : ""}</div></a>`).join("")}</div></section>`;
  // 6. Media por línea
  const L = LINEAS.map(([g, t]) => { const a = arr.filter(x => posGroup(x.j.pos1) === g); return { t, n: a.length, v: a.length ? a.reduce((s, x) => s + x.v, 0) / a.length : null }; }).filter(x => x.n);
  const sc3 = L.length ? escala([...L.map(x => x.v), ...arr.map(x => x.v)], D.menor) : null;
  h += `<section class="sec"><h3>Media por línea</h3>${L.length ? `<div class="tst-rk">${L.map(x => `<div><div class="lb"><span>${x.t} <span class="hint">${x.n} jug.</span></span><span class="num">${esc(fmtT(x.v, m.u))}</span></div><div class="tr"><i style="width:${Math.max(4, sc3(x.v))}%;background:var(--accent)"></i>${mdx != null ? `<span class="md" style="left:${sc3(K.media)}%"></span>` : ""}</div></div>`).join("")}</div><p class="hint" style="margin-top:8px">Barra más larga = mejor resultado. La línea es la media del equipo.</p>` : '<p class="empty">Falta la posición de los jugadores.</p>'}`;
  // 7. Evolución y alertas
  if (D.tomas.length > 1) h += `<span class="hint" style="display:block;margin-top:12px">Media del equipo por toma</span>` + colBars(D.tomas.map(k => ({ x: k.toma, v: k.media || 0, t: fmtV(k.media, m.u), s: k.n + " jug.", c: k.toma === tk ? "var(--accent)" : "var(--sky)" })), { aria: "Media del equipo por toma", h: 150 });
  h += `</section></div>`;
  const al = arr.filter(x => x.mej != null && x.mej < -ALERTA).sort((a, b) => a.mej - b.mej);
  if (ant) h += `<section class="sec"><div class="sec-h"><h3>Revisar</h3><span class="hint">empeoraron más del ${ALERTA * 100} %</span></div>${al.length ? al.map(x => { const c = contexto(x.j, K.fecha); return `<div class="tst-al"><a href="#jugador-${x.j.id}" style="color:inherit;font-weight:700;text-decoration:none">${esc(shortName(x.j.nombre))}</a> <b style="color:var(--danger)">${pct(x.mej)}</b><div class="hint">${esc(fmtT(x.ant, m.u))} → ${esc(fmtT(x.v, m.u))}${c.length ? " · " + esc(c.join(" · ")) : ""}</div></div>`; }).join("") + '<p class="hint">Es un aviso para conversar con el jugador: puede ser cansancio, sueño, molestias o un mal día.</p>' : '<p class="empty">Nadie empeoró más del 5 % frente a la toma anterior.</p>'}</section>`;
  return h;
};

// Ficha del jugador: una tarjeta por test con su evolución, nivel, puesto y mejora
function linea(vals, menor, u) {
  const W = 300, H = 92, L = 8, R = 8, T = 18, B = 22, n = vals.length, v = vals.map(x => x.v);
  const mn = Math.min(...v), mx = Math.max(...v), y = a => mx === mn ? (T + H - B) / 2 : T + (H - T - B) * (menor ? (a - mn) / (mx - mn) : (mx - a) / (mx - mn));
  const x = i => n === 1 ? W / 2 : L + 14 + i * (W - L - R - 28) / (n - 1);
  let g = `<polyline points="${vals.map((p, i) => x(i) + "," + y(p.v)).join(" ")}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>`;
  vals.forEach((p, i) => { g += `<circle cx="${x(i)}" cy="${y(p.v)}" r="4.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2"/><text x="${x(i)}" y="${y(p.v) - 9}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:var(--ink)">${esc(fmtV(p.v, u))}</text><text x="${x(i)}" y="${H - 5}" text-anchor="middle" style="font-size:11px;fill:var(--muted)">${esc(p.t)}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Evolución por toma">${g}</svg>`;
}
window.tstFicha = function (j) {
  const tl = testsPresent().filter(t => S.tests.some(x => x.jid === j.id && x.test === t));
  if (!tl.length) return `<section class="sec"><h3>Tests físicos</h3>${pendingBox("Pendiente", "Este jugador aún no tiene tests registrados.")}</section>`;
  return `<section class="sec"><h3>Tests físicos</h3>${tl.map(t => {
    const D = datos(t), m = D.m, mios = D.tomas.map(k => ({ k, x: k.arr.find(z => z.j.id === j.id) })).filter(o => o.x), u = mios[mios.length - 1], x = u.x;
    const c = x.mej != null && x.mej < -ALERTA ? contexto(j, u.k.fecha) : null;
    return `<div style="padding:8px 0;border-top:1px solid var(--border)"><div class="sec-h"><b>${esc(t)}</b><span class="hint">${esc(u.k.toma)} · puesto ${x.p} de ${u.k.n}</span></div>
     <div class="row" style="gap:6px;align-items:center">${x.nivel ? `<span class="chip" style="text-transform:none;background:${nivCol(x.nivel)};color:#fff">${x.nivel}</span>` : ""}<b>${esc(fmtT(x.v, m.u))}</b>${x.mej != null ? `<b style="color:var(--${x.mej >= 0 ? "ok" : "danger"})">${pct(x.mej)}</b><span class="hint">vs ${esc(u.k.ant.toma)}</span>` : ""}<span class="hint">· media ${esc(fmtT(u.k.media, m.u))}</span></div>
     ${c ? `<div class="tst-al"><b>Revisar:</b> empeoró ${pct(-x.mej).slice(1)}${c.length ? " · " + esc(c.join(" · ")) : ""}</div>` : ""}
     ${mios.length > 1 ? linea(mios.map(o => ({ v: o.x.v, t: o.k.toma })), D.menor, m.u) + '<p class="hint" style="margin:0">Arriba es mejor.</p>' : ""}</div>`;
  }).join("")}</section>`;
};

// Imagen para el grupo de WhatsApp: podio y los que más mejoraron (solo reconocimiento positivo)
function marco(html) {
  return new Promise(res => {
    const D = window.document, f = D.createElement("iframe"); f.setAttribute("aria-hidden", "true"); f.tabIndex = -1;
    f.style.cssText = "position:fixed;left:-12000px;top:0;width:560px;height:1400px;border:0";
    f.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@500;600;700&display=swap"></head><body style="margin:0">' + html + "</body></html>";
    f.onload = () => res(f); D.body.appendChild(f);
  });
}
function htmlImagen(test, tk) {
  const D = datos(test), m = D.m, K = D.tomas.find(k => k.toma === tk), arr = K.arr, pod = arr.filter(x => x.p <= 3).slice(0, 3);
  const mj = K.ant ? arr.filter(x => x.mej != null && x.mej > 0).sort((a, b) => b.mej - a.mej).slice(0, 3) : [];
  const club = (S.config && (S.config["Ficha · Nombre"] || S.config.club)) || "Jaguares de Córdoba";
  const F = "font-family:'Barlow',Arial,sans-serif", Dp = "font-family:'Barlow Condensed','Arial Narrow',Arial,sans-serif";
  const ord = [pod[1], pod[0], pod[2]], alto = [118, 160, 92], col = ["#5BA9DC", "#1874B0", "#8CC8EA"], med = ["#B9C3CC", "#E7B416", "#C98A5A"];
  return `<div id="img" style="width:540px;background:#F7FBFE;${F};color:#0E2A40">
   <div style="background:#0B4F7C;color:#fff;padding:26px 28px 22px"><div style="${Dp};font-weight:600;letter-spacing:.14em;font-size:15px;opacity:.85;text-transform:uppercase">${esc(club)} · Tests físicos</div>
   <div style="${Dp};font-weight:800;font-size:44px;line-height:1;margin-top:6px;text-transform:uppercase">${esc(test)}</div><div style="font-size:16px;margin-top:6px;opacity:.9">${esc(tk)}${K.fecha ? " · " + esc(dLong(K.fecha)) : ""} · ${K.n} evaluados</div></div>
   <div style="padding:22px 28px 6px"><div style="${Dp};font-weight:700;font-size:20px;letter-spacing:.08em;text-transform:uppercase;color:#0B4F7C">Podio</div>
   <div style="display:flex;align-items:flex-end;gap:12px;margin-top:12px;text-align:center">${ord.map((x, i) => x ? `<div style="flex:1"><div style="width:22px;height:22px;border-radius:50%;background:${med[i]};margin:0 auto 6px"></div><div style="font-weight:700;font-size:17px;line-height:1.15">${esc(shortName(x.j.nombre))}</div><div style="font-size:15px;color:#46607A;margin:3px 0 6px">${esc(fmtT(x.v, m.u))}</div><div style="height:${alto[i]}px;background:${col[i]};border-radius:10px 10px 0 0;color:#fff;${Dp};font-weight:800;font-size:34px;padding-top:8px">${x.p}</div></div>` : '<div style="flex:1"></div>').join("")}</div></div>
   ${mj.length ? `<div style="padding:18px 28px 4px"><div style="${Dp};font-weight:700;font-size:20px;letter-spacing:.08em;text-transform:uppercase;color:#0B4F7C">Más mejoraron · ${esc(K.ant.toma)} → ${esc(tk)}</div>${mj.map(x => `<div style="display:flex;justify-content:space-between;align-items:center;background:#fff;border:1px solid #C9E4F4;border-radius:12px;padding:12px 16px;margin-top:10px"><span style="font-weight:700;font-size:18px">${esc(shortName(x.j.nombre))}</span><span style="${Dp};font-weight:800;font-size:26px;color:#1f8a4c">${pct(x.mej)}</span></div>`).join("")}</div>` : ""}
   <div style="padding:18px 28px 24px;font-size:15px;color:#46607A">Media del equipo: <b style="color:#0E2A40">${esc(fmtT(K.media, m.u))}</b> · ¡A seguir trabajando, Jaguares!</div></div>`;
}
async function imagen(test, tk) {
  let f = null;
  try {
    toast("Preparando la imagen…");
    await window.__cddLib("h2c");
    f = await marco(htmlImagen(test, tk));
    try { await f.contentDocument.fonts.ready; } catch (e) {}
    const cv = await window.html2canvas(f.contentDocument.getElementById("img"), { scale: 2, backgroundColor: "#F7FBFE", logging: false });
    const blob = await new Promise(r => cv.toBlob(r, "image/png")), name = ("Test " + test + " " + tk).replace(/[^\w áéíóúñÁÉÍÓÚÑ-]+/g, "") + ".png";
    const file = new File([blob], name, { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) { try { await navigator.share({ files: [file], title: name }); return; } catch (e) { if (e && e.name === "AbortError") return; } }
    const u = URL.createObjectURL(blob), a = window.document.createElement("a"); a.href = u; a.download = name; window.document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 5000);
  } catch (e) { toast(e && e.code === "sin_libreria" ? "Se necesita señal la primera vez para preparar la imagen." : "No se pudo generar la imagen."); }
  finally { if (f) f.remove(); }
}
window.tstImagenHTML = htmlImagen;
document.addEventListener("click", ev => {
  const t = ev.target.closest("[data-act^='tst-']"); if (!t) return;
  const a = t.dataset.act;
  if (a === "tst-toma") { S.tstToma[S.testSel] = t.dataset.v; S.tstNiv = ""; render(); }
  else if (a === "tst-niv") { S.tstNiv = S.tstNiv === t.dataset.v ? "" : t.dataset.v; render(); }
  else if (a === "tst-img") { const D = datos(S.testSel), tk = D.tomas.some(k => k.toma === S.tstToma[S.testSel]) ? S.tstToma[S.testSel] : D.tomas[D.tomas.length - 1].toma; imagen(S.testSel, tk); }
});
})();
