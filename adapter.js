// Adaptador del Centro de datos v2.0: ofrece a la app la misma interfaz que claude.ai (mcp de Google Sheets)
// usando el puente Apps Script de Partido en vivo. Fotos y escudos salen de los documentos de Partido en vivo.
const LSK = "cdd2:";
const ls = {
  get(k, d, pre) { try { const v = localStorage.getItem((pre || LSK) + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(LSK + k, JSON.stringify(v)); return true; } catch (e) { return false; } },
  del(k) { try { localStorage.removeItem(LSK + k); } catch (e) {} }
};

// ---------- Acceso: propio o el que Partido en vivo ya guardó en este navegador (mismo sitio) ----------
let cfg = ls.get("cfg", null);
if (!cfg && !ls.get("nopev", false)) {
  const pev = ls.get("cfg", null, "pev3:");
  if (pev && pev.url && pev.clave && pev.rol === "dt") { cfg = { url: pev.url, clave: pev.clave, rol: "dt", desde: "pev" }; ls.set("cfg", cfg); }
}

async function puente(body, timeoutMs) {
  if (!cfg) throw { code: "not_granted", message: "Sin acceso configurado" };
  if (!navigator.onLine) throw { code: "server_unavailable", message: "Sin señal", retryable: true };
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs || 30000);
  let r;
  try { r = await fetch(cfg.url, { method: "POST", body: JSON.stringify(Object.assign({ clave: cfg.clave }, body)), signal: ctl.signal, redirect: "follow" }).then(x => x.json()); }
  catch (e) { throw { code: "server_unavailable", message: "El puente no respondió", retryable: true }; }
  finally { clearTimeout(t); }
  if (!r.ok) {
    if (r.error === "clave_incorrecta") { ls.del("cfg"); ls.set("nopev", true); cfg = null; throw { code: "needs_reauth", message: "La clave del puente ya no es válida" }; }
    throw { code: r.error || "tool_error", message: r.detalle || r.error };
  }
  return r;
}

// ---------- Hoja: lecturas agrupadas en un solo pedido (getMany) y escrituras con set ----------
const toBridgeValue = v => {
  if (typeof v === "string") { const m = /^=DATE\((\d+);(\d+);(\d+)\)$/.exec(v); if (m) return { fecha: m[1] + "-" + String(m[2]).padStart(2, "0") + "-" + String(m[3]).padStart(2, "0") }; }
  return v;
};
let lecturas = null;
function leerAgrupado(range) {
  return new Promise((res, rej) => {
    if (!lecturas) {
      const grupo = lecturas = { items: [] };
      setTimeout(async () => {
        if (lecturas === grupo) lecturas = null;
        try {
          const r = await puente({ op: "getMany", ranges: grupo.items.map(i => i.range) }, 90000);
          grupo.items.forEach((it, k) => it.res({ payload: { values: (r.valuesList || [])[k] || [] }, content: [] }));
        } catch (e) { grupo.items.forEach(it => it.rej(e)); }
      }, 60);
    }
    lecturas.items.push({ range, res, rej });
  });
}
const mcp = {
  async callTool(server, tool, input) {
    if (tool === "get_values") return leerAgrupado(input.range);
    if (tool === "update_values") {
      // null = no tocar esa celda (columnas con fórmula); el puente las salta.
      await puente({ op: "set", range: input.range, values: (input.values || []).map(r => r.map(toBridgeValue)) }, 60000);
      return { payload: {}, content: [] };
    }
    throw { code: "bad_request", message: "Operación no soportada" };
  }
};

// ---------- Fotos y escudos: documentos de Partido en vivo + caché del teléfono ----------
let IMG = ls.get("img", { since: 0, fotos: {}, logo: "", dt: "", escudos: { lista: [], alias: {} } });
const mapa = () => ({ fotos: IMG.fotos || {}, logo: IMG.logo || "", dt: IMG.dt || "", escudos: IMG.escudos || { lista: [], alias: {} } });
window.imagenesGuardadas = mapa;
window.cargarImagenes = async force => {
  const r = await puente({ op: "cambios", desde: force ? 0 : (IMG.since || 0) }, 90000);
  (r.docs || []).forEach(d => {
    IMG.since = Math.max(IMG.since || 0, d.actualizado || 0);
    const x = d.borrado ? null : d.data;
    if (d.ruta === "config/fotos") IMG.fotos = (x && x.map) || {};
    else if (d.ruta === "config/marca") { IMG.logo = (x && x.logo) || ""; IMG.dt = (x && x.dt) || ""; }
    else if (d.ruta === "config/escudos") IMG.escudos = { lista: (x && x.lista) || [], alias: (x && x.alias) || {} };
  });
  ls.set("img", IMG);
  if (force) { Object.keys(fotos).forEach(id => { delete fotos[id]; idbDel(id); }); pedidas.clear(); }
  return mapa();
};

// Misma base que Partido en vivo ("pev3-fotos"): si esa app ya trajo las fotos, aquí abren al instante.
const fotos = {};
let idb = null;
function abrirIDB() {
  return new Promise(res => {
    try {
      const rq = indexedDB.open("pev3-fotos", 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore("f");
      rq.onsuccess = () => { idb = rq.result; res(); };
      rq.onerror = () => res();
    } catch (e) { res(); }
  });
}
function idbAll() {
  return new Promise(res => {
    if (!idb) return res();
    try {
      const rq = idb.transaction("f", "readonly").objectStore("f").openCursor();
      rq.onsuccess = () => { const c = rq.result; if (c) { fotos[c.key] = c.value; c.continue(); } else res(); };
      rq.onerror = () => res();
    } catch (e) { res(); }
  });
}
function idbPut(id, v) { try { idb && idb.transaction("f", "readwrite").objectStore("f").put(v, id); } catch (e) {} }
function idbDel(id) { try { idb && idb.transaction("f", "readwrite").objectStore("f").delete(id); } catch (e) {} }
const faltan = new Set(), pedidas = new Set();
let pidiendo = false, pedirT = null;
window.foto = id => {
  if (!id) return null;
  if (fotos[id]) return fotos[id];
  if (!pedidas.has(id)) { faltan.add(id); clearTimeout(pedirT); pedirT = setTimeout(pedirFotos, 80); }
  return null;
};
async function pedirFotos() {
  if (pidiendo || !faltan.size || !navigator.onLine || !cfg) return;
  pidiendo = true;
  const ids = [...faltan].slice(0, 20);
  ids.forEach(id => { faltan.delete(id); pedidas.add(id); });
  try {
    const r = await puente({ op: "fotoLeer", ids }, 60000);
    let nuevas = 0;
    for (const id in (r.fotos || {})) { fotos[id] = r.fotos[id]; idbPut(id, r.fotos[id]); nuevas++; }
    if (nuevas && typeof window.__fotosNuevas === "function") try { window.__fotosNuevas(); } catch (e) {}
  } catch (e) { ids.forEach(id => pedidas.delete(id)); }
  finally { pidiendo = false; if (faltan.size) setTimeout(pedirFotos, 300); }
}
addEventListener("online", () => { pedidas.clear(); });

window.cerrarSesion = () => { ls.del("cfg"); ls.del("snap"); location.reload(); };
window.puenteDT = (body, ms) => puente(body, ms || 60000);
window.__acceso = () => cfg ? { desde: cfg.desde || "", url: cfg.url } : null;

// ---------- Pantalla de acceso ----------
function gate(html) {
  window.__booted = true;
  let el = document.getElementById("gate");
  if (!el) { el = document.createElement("div"); el.id = "gate"; document.body.appendChild(el); }
  el.innerHTML = html; el.hidden = !html;
}
const escH = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function pantallaAcceso(pre, msg) {
  gate(`<div style="position:fixed;inset:0;z-index:100;background:var(--bg);display:grid;place-items:center;padding:24px;overflow:auto"><div class="sec" style="max-width:440px;width:100%">
    <h2 style="text-align:center">Centro de datos</h2><p class="hint" style="text-align:center">Usa la misma URL del puente y la clave del DT de Partido en vivo.</p>
    ${msg ? `<div class="banner err">${escH(msg)}</div>` : ""}
    <label class="f">URL del puente<input id="accUrl" value="${escH(pre && pre.url)}" placeholder="https://script.google.com/macros/s/…/exec"></label>
    <label class="f">Clave del DT<input id="accClave" type="password" value="${escH(pre && pre.clave)}" autocomplete="off"></label>
    <button class="btn pri wide" id="accBtn">Entrar</button></div></div>`);
  document.getElementById("accBtn").onclick = async e => {
    const b = e.currentTarget; b.disabled = true; b.textContent = "Verificando…";
    const url = document.getElementById("accUrl").value.trim(), clave = document.getElementById("accClave").value.trim();
    try {
      if (!/^https:\/\/script\.google(usercontent)?\.com\/.+/.test(url) && !/^http:\/\/(localhost|127\.0\.0\.1)/.test(url)) throw new Error("La URL debe ser la del puente (termina en /exec).");
      const r = await fetch(url, { method: "POST", body: JSON.stringify({ clave, op: "quien" }) }).then(x => x.json());
      if (!r.ok) throw new Error(r.error === "clave_incorrecta" ? "La clave no es correcta." : "El puente respondió con un error: " + (r.detalle || r.error));
      if (r.rol !== "dt") throw new Error("Esta app es solo para el DT: usa la clave del DT, no la del asistente.");
      cfg = { url, clave, rol: "dt" }; ls.set("cfg", cfg); location.reload();
    } catch (err) { pantallaAcceso({ url, clave }, (err && err.message) || "No se pudo contactar el puente. Revisa la señal y la URL."); }
  };
}

// ---------- Arranque ----------
const api = { use: async name => (name === "mcp" ? mcp : null) };
(async function arranque() {
  if (!cfg) { pantallaAcceso(null, ""); return; }
  await abrirIDB(); await idbAll();
  gate("");
  if (window.__setReady) window.__setReady(api);
})();
addEventListener("online", () => { if (window.__alVolverSenal) try { window.__alVolverSenal(); } catch (e) {} });

if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
