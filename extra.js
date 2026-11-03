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
.rp-page{width:794px;height:1123px;background:#fff;color:#0f2a22;padding:30px 40px 22px;box-sizing:border-box;display:flex;flex-direction:column;font-family:"Barlow","Segoe UI",Arial,sans-serif;font-size:13px;line-height:1.35;margin-bottom:10px}
.rp-head{display:flex;align-items:center;gap:12px;background:#0d6b43;color:#fff;border-radius:10px;padding:10px 14px;flex:none}
.rp-head img{width:46px;height:46px;object-fit:contain}
.rp-head .t{flex:1;display:flex;flex-direction:column}
.rp-head b{font-family:"Barlow Condensed",Arial,sans-serif;font-weight:800;font-size:21px;text-transform:uppercase;letter-spacing:.03em;line-height:1}
.rp-head span{font-size:12px;opacity:.9}
.rp-head .r{text-align:right;font-size:12px}
.rp-head .r b{font-size:16px}
.rp-body{flex:1;overflow:hidden;display:flex;flex-direction:column;gap:12px;padding-top:12px}
.rp-foot{flex:none;display:flex;justify-content:space-between;font-size:10.5px;color:#53706a;border-top:1px solid #cfe0db;padding-top:6px}
.rp-blk h4{font-family:"Barlow Condensed",Arial,sans-serif;font-weight:700;font-size:16px;text-transform:uppercase;letter-spacing:.05em;margin:0 0 6px;color:#0b5d3a;border-bottom:2px solid #0d6b43;padding-bottom:3px}
.rp-hero{display:flex;gap:16px;align-items:center}
.rp-ph{width:104px;height:104px;border-radius:50%;overflow:hidden;border:4px solid #0d6b43;display:grid;place-items:center;background:#d6eef8;font-family:"Barlow Condensed",Arial,sans-serif;font-weight:800;font-size:34px;flex:none}
.rp-ph img{width:100%;height:100%;object-fit:cover}
.rp-hero .n{font-family:"Barlow Condensed",Arial,sans-serif;font-weight:800;font-size:28px;text-transform:uppercase;line-height:1}
.rp-facts{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}
.rp-fact{background:#e7f1ee;border-radius:8px;padding:5px 8px}
.rp-fact span{display:block;font-size:9.5px;text-transform:uppercase;letter-spacing:.06em;color:#53706a;font-weight:700}
.rp-fact b{font-size:13px}
.rp-kpis{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}
.rp-kpi{background:#e7f1ee;border-radius:8px;padding:6px 8px;text-align:center}
.rp-kpi b{display:block;font-family:"Barlow Condensed",Arial,sans-serif;font-weight:800;font-size:24px;line-height:1}
.rp-kpi span{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:#53706a;font-weight:700}
.rp-t{width:100%;border-collapse:collapse;font-size:12px}
.rp-t th{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:#53706a;text-align:left;padding:4px 5px;border-bottom:1px solid #cfe0db}
.rp-t td{padding:4px 5px;border-bottom:1px solid #e7f1ee;vertical-align:middle}
.rp-t .c{text-align:center}
.rp-bar{height:8px;border-radius:4px;background:#e7f1ee;width:70px;display:inline-block;vertical-align:middle;overflow:hidden;margin-right:5px}
.rp-bar i{display:block;height:100%;border-radius:4px}
.rp-res{display:inline-block;width:18px;height:18px;border-radius:4px;color:#fff;font-weight:800;text-align:center;line-height:18px;font-size:11px;margin-left:4px}
.rp-dots{display:flex;flex-wrap:wrap;gap:3px;margin:6px 0}
.rp-dots i{width:12px;height:12px;border-radius:3px;display:block}
.rp-leg{display:flex;gap:12px;font-size:10.5px;color:#53706a}
.rp-leg i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px}
.rp-2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.rp-card{background:#f3f8f6;border:1px solid #cfe0db;border-radius:8px;padding:8px 10px}
.rp-card .h{display:flex;justify-content:space-between;font-weight:700;margin-bottom:4px}
.rp-tb{display:flex;align-items:flex-end;gap:6px;height:70px;margin:4px 0}
.rp-tb div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;font-size:10px;color:#53706a}
.rp-tb i{display:block;width:100%;max-width:34px;background:#0b7a4b;border-radius:4px 4px 0 0}
.rp-tb b{font-size:11px;color:#0f2a22}
.rp-area{display:grid;grid-template-columns:110px 1fr 24px;align-items:center;gap:8px;margin:3px 0}
.rp-sc{display:flex;gap:4px}.rp-sc i{width:26px;height:10px;border-radius:3px;background:#e7f1ee}.rp-sc i.on{background:#0b7a4b}
.rp-txt{margin:2px 0 6px}.rp-txt span{font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;color:#53706a;font-weight:700;display:block}
.rp-firma{display:flex;justify-content:flex-end;margin-top:26px}
.rp-firma div{width:250px;border-top:1px solid #0f2a22;text-align:center;padding-top:4px;font-size:12px}
.rp-empty{color:#53706a;font-style:italic}
`;
const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

/* ---------- Librerías del PDF (se guardan en el teléfono para usarlas sin señal) ---------- */
const LIBS = { h2c: ["https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js", () => window.html2canvas], pdf: ["https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js", () => window.jspdf && window.jspdf.jsPDF] };
const cargando = {};
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
const C = { ok: "#1f8a4c", warn: "#c98a00", bad: "#c3352b", sky: "#2ea3d4", mut: "#93b0a8", acc: "#0b7a4b" };
const ASIS_C = { Presente: C.ok, Ausente: C.bad, Justificado: C.warn, Lesionado: C.sky };
function bloques(j, R) {
  const out = [], v = x => x == null || x === "" ? "–" : esc(x);
  const foto = FOTOS[j.id] && window.foto(FOTOS[j.id]);
  out.push(`<div class="rp-hero"><div class="rp-ph">${foto ? `<img src="${foto}">` : esc(initials(j.nombre))}</div><div style="flex:1">
    <div class="n">${esc(j.nombre)}</div><div style="font-size:14px;margin-top:4px">${j.dorsal ? "<b>#" + esc(j.dorsal) + "</b> · " : ""}${esc(j.pos1 || "")}${j.pos2 ? " · alternativa: " + esc(j.pos2) : ""}</div>
    <div class="rp-facts"><div class="rp-fact"><span>Edad</span><b>${v(j.edad)}</b></div><div class="rp-fact"><span>Pierna hábil</span><b>${v(j.pierna)}</b></div>
    <div class="rp-fact"><span>Estatura</span><b>${j.est ? esc(j.est) + " cm" : "–"}</b></div><div class="rp-fact"><span>Peso</span><b>${j.peso ? esc(j.peso) + " kg" : "–"}</b></div></div></div></div>`);
  // Partidos
  const ms = S.partidos.filter(m => enRango(m.fecha, R)), s = pStats(j.id, ms);
  out.push(`<h4>Partidos</h4><div class="rp-kpis"><div class="rp-kpi"><b>${s.conv}</b><span>Convocado de ${ms.length}</span></div><div class="rp-kpi"><b>${s.pj}</b><span>Jugados</span></div><div class="rp-kpi"><b>${s.tit}</b><span>Titular</span></div><div class="rp-kpi"><b>${s.min}'</b><span>Minutos</span></div><div class="rp-kpi"><b>${fmt1(s.nota)}</b><span>Nota media</span></div>
    <div class="rp-kpi"><b>${s.g}</b><span>Goles</span></div><div class="rp-kpi"><b>${s.a}</b><span>Asistencias</span></div><div class="rp-kpi"><b>${s.mvp}</b><span>MVP</span></div><div class="rp-kpi"><b>${s.am}</b><span>Amarillas</span></div><div class="rp-kpi"><b>${s.ro}</b><span>Rojas</span></div></div>`);
  if (ms.length) {
    const filas = ms.slice().reverse().map(m => {
      const r = S.stats.find(x => x.pt === m.id && x.jid === j.id), dur = m.dur || S.config.duracion || 80;
      const cond = !r ? "No convocado" : r.min > 0 ? (r.cond === "Titular" ? "Titular" : "Suplente") : "No jugó";
      const min = r ? r.min : 0;
      return `<tr><td>${esc(dShort(m.fecha))}</td><td>${esc(m.rival)}<br><span style="color:#53706a;font-size:10.5px">${esc(m.comp)}</span></td><td class="c">${m.gf}-${m.gc}<span class="rp-res" style="background:${m.res === "G" ? C.ok : m.res === "E" ? C.mut : C.bad}">${m.res}</span></td>
        <td>${cond}</td><td>${(w => `<span class="rp-bar" style="background:linear-gradient(90deg,${r && r.cond === "Titular" ? C.acc : C.sky} ${w}%,#e7f1ee ${w}%)"></span>`)(Math.round(Math.min(100, min / dur * 100)))}${min}'</td>
        <td class="c">${r && r.g ? r.g : ""}</td><td class="c">${r && r.a ? r.a : ""}</td><td class="c">${r && r.min > 0 && r.nota != null ? fmt1(r.nota) : ""}</td><td class="c">${r ? (r.am ? r.am + " TA " : "") + (r.ro ? r.ro + " TR" : "") : ""}</td></tr>`;
    });
    const head = `<table class="rp-t"><tr><th>Fecha</th><th>Rival</th><th class="c">Resultado</th><th>Condición</th><th>Minutos</th><th class="c">G</th><th class="c">A</th><th class="c">Nota</th><th class="c">Tarjetas</th></tr>`;
    for (let i = 0; i < filas.length; i += 16) out.push(`<h4>Partido a partido${i ? " (continuación)" : ""}</h4>${head}${filas.slice(i, i + 16).join("")}</table>`);
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
    return `<div class="rp-card"><div class="h"><span>${esc(n)}</span><span style="color:#53706a;font-weight:500">${esc(m.u)} · mejor si es ${esc(String(m.mejor || "Mayor").toLowerCase())}</span></div>
      <div class="rp-tb">${a.slice(-6).map(x => `<div><b>${fmtR(x.res)}</b><i style="height:${Math.max(4, x.res / max * 48)}px"></i>${esc(x.toma || dShort(x.f))}</div>`).join("")}</div>
      ${dif != null && dif !== 0 ? `<div style="font-size:11.5px;color:${mejora ? C.ok : C.bad};font-weight:700">${mejora ? "Mejoró" : "Bajó"} ${fmtR(Math.abs(dif))} ${esc(m.u)} desde la primera toma</div>` : dif === 0 ? '<div style="font-size:11.5px;color:#53706a">Igual que en la primera toma</div>' : '<div style="font-size:11.5px;color:#53706a">Una sola toma</div>'}</div>`;
  });
  if (!tarjetas.length) out.push('<h4>Tests físicos</h4><p class="rp-empty">Sin tests registrados en el periodo.</p>');
  for (let i = 0; i < tarjetas.length; i += 4) out.push(`<h4>Tests físicos${i ? " (continuación)" : ""}</h4><div class="rp-2">${tarjetas.slice(i, i + 4).join("")}</div>`);
  // Evaluación formativa
  const evs = S.evals.filter(e => e.jid === j.id && enRango(e.f, R));
  if (!evs.length) out.push('<h4>Evaluación formativa</h4><p class="rp-empty">Sin evaluaciones en el periodo.</p>');
  else {
    const e = evs[evs.length - 1], prev = evs.slice(0, -1);
    out.push(`<h4>Evaluación formativa · ${esc(e.per || "")} (${esc(dLong(e.f))})</h4><div class="rp-2"><div>${AREAS.map(([k, t]) => `<div class="rp-area"><span>${t}</span><span class="rp-sc">${[1, 2, 3, 4, 5].map(n => `<i class="${e[k] != null && n <= e[k] ? "on" : ""}"></i>`).join("")}</span><b>${e[k] != null ? fmt1(e[k]) : "–"}</b></div>`).join("")}
      <p style="font-size:10.5px;color:#53706a;margin:4px 0 0">Escala 1 a 5: 3 es lo esperado para su edad.</p>
      ${prev.length ? `<table class="rp-t" style="margin-top:6px"><tr><th>Anteriores</th>${AREAS.map(a => `<th class="c">${a[1].slice(0, 3)}</th>`).join("")}</tr>${prev.slice(-4).map(p => `<tr><td>${esc(p.per || dShort(p.f))}</td>${AREAS.map(([k]) => `<td class="c">${p[k] != null ? fmt1(p[k]) : "–"}</td>`).join("")}</tr>`).join("")}</table>` : ""}</div>
      <div>${[["Fortalezas", e.fort], ["Aspectos a mejorar", e.mej], ["Objetivo a corto plazo", e.oc], ["Objetivo a mediano plazo", e.om], ["Objetivo a largo plazo", e.ol]].filter(x => x[1]).map(x => `<div class="rp-txt"><span>${x[0]}</span>${esc(x[1])}</div>`).join("") || '<p class="rp-empty">Sin comentarios.</p>'}</div></div>`);
  }
  // Lesiones y sanciones
  const les = S.lesiones.filter(l => l.jid === j.id && enRango(l.fecha, R)), san = S.sanciones.filter(x => x.jid === j.id && enRango(x.fecha, R));
  out.push(`<h4>Lesiones y sanciones</h4>${les.length || san.length ? `<table class="rp-t"><tr><th>Fecha</th><th>Tipo</th><th>Detalle</th><th>Estado</th></tr>${les.map(l => `<tr><td>${esc(dShort(l.fecha))}</td><td>Lesión</td><td>${esc(l.zona)}${l.desc ? " · " + esc(l.desc) : ""}${l.dias != null ? " · " + l.dias + " días" : ""}</td><td>${l.altaReal ? "Alta " + esc(dShort(l.altaReal)) : esc(l.estado || "En recuperación")}</td></tr>`).join("")}
    ${san.map(x => `<tr><td>${esc(dShort(x.fecha))}</td><td>Sanción</td><td>${esc(x.motivo)}${x.fechas != null ? " · " + x.fechas + " fechas" : ""}</td><td>${esc(x.estado || "")}</td></tr>`).join("")}</table>` : '<p class="rp-empty">Sin lesiones ni sanciones en el periodo.</p>'}
    <div class="rp-firma"><div>${esc(CLUB.dt || "")}<br><span style="color:#53706a">Entrenador${CLUB.nombre ? " · " + esc(CLUB.nombre) : ""}</span></div></div>`);
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
})();
