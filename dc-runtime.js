/* Engineering Cockpit – schlanke Laufzeit für den Entwurf (ohne claude.ai).
   Versteht: {{pfad}}-Platzhalter in Text und Attributen, <sc-if value>, <sc-for list as>,
   on*-Ereignisse (click, input, dragstart, dragover, drop, dragend, keydown) und setState. */
(function () {
  'use strict';
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var EV = { onclick: 'click', oninput: 'input', ondragstart: 'dragstart', ondragover: 'dragover', ondrop: 'drop', ondragend: 'dragend', onkeydown: 'keydown', onchange: 'change' };

  function parts(str) {
    var out = [], last = 0, m; HOLE.lastIndex = 0;
    while ((m = HOLE.exec(str))) { if (m.index > last) out.push(str.slice(last, m.index)); out.push({ p: m[1].split('.') }); last = m.index + m[0].length; }
    if (last < str.length) out.push(str.slice(last));
    return out;
  }

  function compile(node) {
    var res = [];
    for (var i = 0; i < node.childNodes.length; i++) {
      var n = node.childNodes[i];
      if (n.nodeType === 3) { res.push({ t: 'x', parts: parts(n.nodeValue) }); continue; }
      if (n.nodeType !== 1) continue;
      var tag = n.localName;
      if (tag === 'helmet' || tag === 'script') continue;
      if (tag === 'sc-if') { res.push({ t: 'if', p: parts(n.getAttribute('value') || '')[0].p || [], c: compile(n) }); continue; }
      if (tag === 'sc-for') { res.push({ t: 'for', p: parts(n.getAttribute('list') || '')[0].p || [], as: n.getAttribute('as'), c: compile(n) }); continue; }
      var at = [], ev = [];
      for (var k = 0; k < n.attributes.length; k++) {
        var a = n.attributes[k], nm = a.name;
        if (EV[nm.toLowerCase()]) ev.push([EV[nm.toLowerCase()], parts(a.value)]);
        else at.push([nm, parts(a.value)]);
      }
      res.push({ t: 'e', tag: tag, ns: n.namespaceURI, at: at, ev: ev, c: compile(tag === 'template' ? n.content : n) });
    }
    return res;
  }

  function lookup(p, sc) {
    var v, i, f = false;
    for (i = sc.length - 1; i >= 0; i--) { if (sc[i] && Object.prototype.hasOwnProperty.call(sc[i], p[0])) { v = sc[i][p[0]]; f = true; break; } }
    if (!f) return undefined;
    for (i = 1; i < p.length; i++) { if (v == null) return undefined; v = v[p[i]]; }
    return v;
  }
  function val(ps, sc) {
    if (ps.length === 1 && typeof ps[0] === 'object') return lookup(ps[0].p, sc);
    var s = '';
    for (var i = 0; i < ps.length; i++) { var x = ps[i]; if (typeof x === 'string') s += x; else { var v = lookup(x.p, sc); s += v == null ? '' : String(v); } }
    return s;
  }

  function build(cn, sc, out) {
    for (var i = 0; i < cn.length; i++) {
      var c = cn[i];
      if (c.t === 'x') { var tv = val(c.parts, sc); out.push(tv == null ? '' : String(tv)); continue; }
      if (c.t === 'if') { if (lookup(c.p, sc)) build(c.c, sc, out); continue; }
      if (c.t === 'for') { var l = lookup(c.p, sc); if (Array.isArray(l)) for (var j = 0; j < l.length; j++) { var fr = {}; fr[c.as] = l[j]; build(c.c, sc.concat([fr]), out); } continue; }
      var at = {}, ev = {};
      for (var a = 0; a < c.at.length; a++) { var v = val(c.at[a][1], sc); if (v == null || v === false) continue; at[c.at[a][0]] = v === true ? '' : String(v); }
      for (var e = 0; e < c.ev.length; e++) { var h = val(c.ev[e][1], sc); if (typeof h === 'function') ev[c.ev[e][0]] = h; }
      var kids = []; build(c.c, sc, kids);
      out.push({ tag: c.tag, ns: c.ns, at: at, ev: ev, kids: kids });
    }
  }

  function setEv(el, ev) {
    el.__h = ev; el.__l = el.__l || {};
    for (var k in ev) if (!el.__l[k]) { el.__l[k] = 1; (function (type) { el.addEventListener(type, function (e) { var h = el.__h && el.__h[type]; if (typeof h === 'function') { try { h(e); } catch (er) { report(er); } } }); })(k); }
  }
  function setAttrs(el, at, fresh) {
    var isVal = (el.localName === 'input' && el.type !== 'file') || el.localName === 'textarea';
    if (!fresh) for (var i = el.attributes.length - 1; i >= 0; i--) { var n = el.attributes[i].name; if (!(n in at)) el.removeAttribute(n); }
    for (var k in at) {
      if (k === 'value' && isVal) { if (el.value !== at[k]) el.value = at[k]; if (fresh) el.setAttribute('value', at[k]); continue; }
      if (fresh || el.getAttribute(k) !== at[k]) el.setAttribute(k, at[k]);
    }
    if (isVal && !('value' in at) && el.value && el.localName === 'textarea' && !fresh) { /* unkontrolliert lassen */ }
  }
  function create(v) {
    if (typeof v === 'string') return document.createTextNode(v);
    var el = v.ns && v.ns !== 'http://www.w3.org/1999/xhtml' ? document.createElementNS(v.ns, v.tag) : document.createElement(v.tag);
    if (v.tag === 'input' && v.at.type) el.setAttribute('type', v.at.type);
    setAttrs(el, v.at, true); setEv(el, v.ev);
    for (var i = 0; i < v.kids.length; i++) el.appendChild(create(v.kids[i]));
    return el;
  }
  function same(d, v) {
    if (typeof v === 'string') return d.nodeType === 3;
    return d.nodeType === 1 && d.localName === v.tag && (d.namespaceURI || '') === (v.ns || d.namespaceURI || '') && (v.tag !== 'input' || (d.getAttribute('type') || '') === (v.at.type || ''));
  }
  function patch(parent, kids) {
    var i;
    for (i = 0; i < kids.length; i++) {
      var v = kids[i], d = parent.childNodes[i];
      if (!d) { parent.appendChild(create(v)); continue; }
      if (!same(d, v)) { parent.replaceChild(create(v), d); continue; }
      if (typeof v === 'string') { if (d.nodeValue !== v) d.nodeValue = v; continue; }
      setAttrs(d, v.at, false); setEv(d, v.ev); patch(d, v.kids);
    }
    while (parent.childNodes.length > kids.length) parent.removeChild(parent.lastChild);
  }

  var bar = null;
  function report(er) {
    if (window.console) console.error(er);
    if (!bar) { bar = document.createElement('div'); bar.setAttribute('role', 'alert'); bar.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:99999;max-width:560px;padding:10px 14px;border-radius:8px;background:#C50F1F;color:#fff;font:13px Segoe UI,system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.3);cursor:pointer'; bar.onclick = function () { bar.style.display = 'none'; }; document.body.appendChild(bar); }
    bar.style.display = 'block'; bar.textContent = 'Fehler im Entwurf (bitte melden): ' + (er && er.message ? er.message : String(er)) + ' – Klick blendet aus.';
  }

  var inst = null, root = null, compiled = null, pending = false;
  function render() {
    pending = false; var vals;
    try { vals = inst.renderVals(); } catch (er) { report(er); return; }
    var out = []; build(compiled, [vals], out); patch(root, out);
  }
  function schedule() { if (!pending) { pending = true; Promise.resolve().then(render); } }

  window.DCLogic = function DCLogic(props) { this.props = props || {}; };
  window.DCLogic.prototype.setState = function (o) { if (typeof o === 'function') o = o(this.state); Object.assign(this.state, o || {}); if (inst) schedule(); };

  window.dcMount = function (Component, props, tplEl, rootEl) {
    compiled = compile(tplEl.content || tplEl); root = rootEl;
    inst = new Component(props || {});
    window.dcApp = inst; render();
    return inst;
  };
  window.dcRenderNow = render;
})();
