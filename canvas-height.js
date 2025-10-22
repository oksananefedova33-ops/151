/*!
 * Модуль «Высота холста» (Variant A: глобально через CANVAS_H).
 * - Добавляет кнопку «Холст» в тулбар редактора
 * - Открывает модалку с range (1500–10000)
 * - Сохраняет в /admin/config.php (через /ui/canvas-height/api.php?action=set)
 * - После сохранения перезагружает редактор
 * - На загрузке подтягивает текущую высоту и выставляет CSS-переменные для сцены
 */
(function(){
  'use strict';
  const onReady = fn => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', fn) : fn());

  function setStageRatios(h){
    // Пересчитываем высоту сцены по брейкпоинтам (как на фронте/экспорте)
    const desktop = (h / 1200 * 100).toFixed(6) + 'vw';
    const tablet  = (h / 768  * 100).toFixed(6) + 'vw';
    const mobile  = h + 'px'; // как в редакторе было — px
    document.documentElement.style.setProperty('--canvas-ratio-desktop', desktop);
    document.documentElement.style.setProperty('--canvas-ratio-tablet',  tablet);
    document.documentElement.style.setProperty('--canvas-ratio-mobile',  mobile);
  }

  function makeModal(initial){
    const o = document.createElement('div');
    o.id = 'ch-modal-overlay';
    o.innerHTML = `
      <div id="ch-modal" role="dialog" aria-modal="true" aria-label="Высота холста">
        <h3>Высота холста (глобально)</h3>
        <div style="font-size:13px;color:#a7b7cc;margin-bottom:6px">
          Будет применяться в редакторе, на сайте и в экспортированных страницах.
        </div>
        <div id="ch-row">
          <input id="ch-range" type="range" min="1500" max="10000" step="10" value="${initial}">
          <input id="ch-num"   type="number" min="1500" max="10000" step="10" value="${initial}">
        </div>
        <div id="ch-foot">
          <button class="btn ghost" id="ch-cancel">Отмена</button>
          <button class="btn" id="ch-save">Сохранить</button>
        </div>
      </div>`;
    document.body.appendChild(o);

    const range = o.querySelector('#ch-range');
    const num   = o.querySelector('#ch-num');
    const cancel= o.querySelector('#ch-cancel');
    const save  = o.querySelector('#ch-save');

    const sync = v => { range.value = String(v); num.value = String(v); };
    range.addEventListener('input', e => sync(e.target.value));
    num.addEventListener('input',   e => sync(e.target.value));

    cancel.addEventListener('click', ()=> { o.style.display='none'; });
    save.addEventListener('click', async ()=>{
      const v = Math.max(1500, Math.min(10000, parseInt(num.value||'1500',10)));
      // отправляем на сервер
      const fd = new FormData();
      fd.append('action','set');
      fd.append('height', String(v));
      try{
        const r = await fetch('/ui/canvas-height/api.php', { method:'POST', body: fd, cache:'no-store' });
        const j = await r.json();
        if(j && j.ok){
          // локально обновим сцену и перезагрузим редактор, чтобы подтянулись константы
          setStageRatios(v);
          try { window.EDITOR_BASE_H = v; } catch(e){}
          // Чтобы редактор точно подхватил новое EDITOR_BASE_H, перезагрузим:
          location.reload();
        } else {
          alert('Не удалось сохранить: ' + (j && j.error ? j.error : 'неизвестная ошибка'));
        }
      }catch(e){
        alert('Ошибка сети: ' + e.message);
      }
    });

    return o;
  }

  function insertToolbarButton(open){
    const topbar = document.querySelector('.topbar');
    const ref = topbar ? (topbar.querySelector('#btnExport') || topbar.querySelector('#btnSave') || topbar.lastElementChild) : null;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'btn btn-ch';
    b.id = 'btnCanvasHeight';
    b.textContent = 'Холст';
    (ref && ref.parentNode) ? ref.parentNode.insertBefore(b, ref.nextSibling) : (topbar||document.body).appendChild(b);
    b.addEventListener('click', open);
  }

  async function fetchCurrentHeight(){
    try{
      const r = await fetch('/ui/canvas-height/api.php?action=get', { cache:'no-store' });
      const j = await r.json();
      if(j && j.ok){
        return { h: j.height||1500, w: j.width||1200 };
      }
    }catch(e){}
    return { h: 1500, w: 1200 };
  }

  onReady(async ()=>{
    // Тянем текущую высоту (из admin/config.php)
    const {h} = await fetchCurrentHeight();
    // Проставим CSS‑переменные для визуальной сцены редактора
    setStageRatios(h);

    // Подготовим модалку
    const modal = makeModal(h);
    const open  = ()=> { modal.style.display = 'flex'; };

    // Добавим кнопку в тулбар
    insertToolbarButton(open);
  });
})();
