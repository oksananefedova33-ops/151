// /ui/rte-mini/rte-mini.js
(function(){
  function exec(editor, cmd, val){ 
    editor.focus(); 
    document.execCommand(cmd,false,val||null); 
  }
  
  function saveSel(){ 
    const s=window.getSelection(); 
    return (s && s.rangeCount)? s.getRangeAt(0).cloneRange():null; 
  }
  
  function restoreSel(r){ 
    if(!r) return; 
    const s=window.getSelection(); 
    s.removeAllRanges(); 
    s.addRange(r); 
  }

  function openPalette(trigger, onPick){
    const colors = [
      "#ffffff","#000000","#eab308","#22c55e","#06b6d4","#3b82f6","#a855f7","#ef4444","#f97316","#10b981",
      "#111827","#1f2937","#374151","#4b5563","#6b7280","#9ca3af","#d1d5db","#f3f4f6","#93c5fd","#f472b6",
      "#fde047","#86efac","#67e8f9","#60a5fa","#c084fc","#fca5a5","#fdba74","#34d399","#94a3b8","#cbd5e1",
      "#e5e7eb","#f1f5f9","#0ea5e9","#2563eb","#7c3aed","#dc2626","#ea580c","#059669","#1d4ed8","#6d28d9",
      "#b91c1c","#c2410c","#047857","#0f766e","#065f46","#7dd3fc","#d8b4fe","#fecaca","#fed7aa","#bbf7d0"
    ];
    const back = document.createElement('div'); 
    back.className='ri-modal-back';
    const box  = document.createElement('div'); 
    box.className='ri-modal';
    const grid = document.createElement('div'); 
    grid.className='ri-grid';
    
    ['mousedown','click','pointerdown'].forEach(evt=>{
      back.addEventListener(evt, e => e.stopPropagation());
      box.addEventListener(evt,  e => e.stopPropagation());
    });
    
    colors.forEach(c=>{
      const s=document.createElement('div'); 
      s.className='ri-swatch'; 
      s.style.background=c;
      s.addEventListener('mousedown', e=>e.preventDefault());
      s.addEventListener('click', ()=>{ 
        onPick(c); 
        if(back.parentNode) document.body.removeChild(back);
      });
      grid.appendChild(s);
    });
    
    box.appendChild(grid); 
    back.appendChild(box);
    back.addEventListener('click', e=>{ 
      if(e.target===back) document.body.removeChild(back); 
    });
    document.body.appendChild(back);
  }
  // === Popup выбора анимации ===
  function openAnimMenu(anchorEl, onPick){
    const back = document.createElement('div');
    back.className = 'ri-modal-back';
    const box  = document.createElement('div');
    box.className = 'ri-modal';
    const list = document.createElement('div');
    list.className = 'ri-list';

    const variants = [
      {key:'ta-appear',     title:'Появление'},
      {key:'ta-blink',      title:'Мерцание'},
      {key:'ta-colorcycle', title:'Мигание цвета'},
      {key:'__remove__',    title:'Снять анимацию'}
    ];

    variants.forEach(v=>{
      const b = document.createElement('button');
      b.type='button';
      b.className='ri-list-btn';
      b.textContent = v.title;
      b.addEventListener('mousedown', e=>e.preventDefault());
      b.addEventListener('click', ()=>{
        onPick(v.key);
        if(back.parentNode) document.body.removeChild(back);
      });
      list.appendChild(b);
    });

    box.appendChild(list);
    back.appendChild(box);
    back.addEventListener('click', e=>{
      if(e.target===back) document.body.removeChild(back);
    });
    document.body.appendChild(back);
  }

  // Новая функция для меню размера шрифта
  function openFontSizeMenu(trigger, onPick){
    const sizes = [
      {label: 'Очень мелкий', value: '12px'},
      {label: 'Мелкий', value: '14px'},
      {label: 'Обычный', value: '16px'},
      {label: 'Средний', value: '18px'},
      {label: 'Крупный', value: '20px'},
      {label: 'Очень крупный', value: '24px'},
      {label: 'Огромный', value: '32px'}
    ];
    
    const back = document.createElement('div'); 
    back.className='ri-modal-back';
    const box  = document.createElement('div'); 
    box.className='ri-modal ri-size-modal';
    
    ['mousedown','click','pointerdown'].forEach(evt=>{
      back.addEventListener(evt, e => e.stopPropagation());
      box.addEventListener(evt,  e => e.stopPropagation());
    });
    
    sizes.forEach(size=>{
      const btn = document.createElement('button');
      btn.className = 'ri-size-btn';
      btn.textContent = size.label;
      btn.style.fontSize = size.value;
      btn.addEventListener('mousedown', e=>e.preventDefault());
      btn.addEventListener('click', ()=>{ 
        onPick(size.value); 
        if(back.parentNode) document.body.removeChild(back);
      });
      box.appendChild(btn);
    });
    
    back.appendChild(box);
    back.addEventListener('click', e=>{ 
      if(e.target===back) document.body.removeChild(back); 
    });
    document.body.appendChild(back);
  }

  // Новая функция для меню заголовков
  function openHeadingMenu(trigger, onPick){
    const headings = [
      {label: 'Обычный текст', tag: 'p'},
      {label: 'Заголовок 1', tag: 'h1'},
      {label: 'Заголовок 2', tag: 'h2'},
      {label: 'Заголовок 3', tag: 'h3'},
      {label: 'Заголовок 4', tag: 'h4'},
      {label: 'Заголовок 5', tag: 'h5'},
      {label: 'Заголовок 6', tag: 'h6'}
    ];
    
    const back = document.createElement('div'); 
    back.className='ri-modal-back';
    const box  = document.createElement('div'); 
    box.className='ri-modal ri-heading-modal';
    
    ['mousedown','click','pointerdown'].forEach(evt=>{
      back.addEventListener(evt, e => e.stopPropagation());
      box.addEventListener(evt,  e => e.stopPropagation());
    });
    
    headings.forEach(heading=>{
      const btn = document.createElement('button');
      btn.className = 'ri-heading-btn';
      if(heading.tag !== 'p') {
        const el = document.createElement(heading.tag);
        el.textContent = heading.label;
        el.style.margin = '0';
        btn.appendChild(el);
      } else {
        btn.textContent = heading.label;
      }
      btn.addEventListener('mousedown', e=>e.preventDefault());
      btn.addEventListener('click', ()=>{ 
        onPick(heading.tag); 
        if(back.parentNode) document.body.removeChild(back);
      });
      box.appendChild(btn);
    });
    
    back.appendChild(box);
    back.addEventListener('click', e=>{ 
      if(e.target===back) document.body.removeChild(back); 
    });
    document.body.appendChild(back);
  }

  function initRTEMini(root, opts){
    const editor = root.querySelector('.ri-editor');
    
    // Создаем кнопки форматирования
    const toolbar = root.querySelector('.ri-tools');
    
    // Очищаем toolbar и создаем заново с новыми кнопками
    toolbar.innerHTML = '';
    
    // Кнопка заголовков
    const btnHeading = document.createElement('button');
    btnHeading.className = 'ri-btn';
    btnHeading.innerHTML = 'H';
    btnHeading.title = 'Заголовки';
    btnHeading.type = 'button';
    
    // Кнопка размера шрифта
    const btnFontSize = document.createElement('button');
    btnFontSize.className = 'ri-btn';
    btnFontSize.innerHTML = 'A';
    btnFontSize.title = 'Размер шрифта';
    btnFontSize.type = 'button';
    
    // Кнопка жирный
    const btnBold = document.createElement('button');
    btnBold.className = 'ri-btn';
    btnBold.innerHTML = '<b>B</b>';
    btnBold.title = 'Жирный';
    btnBold.type = 'button';
    
    // Кнопка курсив
    const btnItalic = document.createElement('button');
    btnItalic.className = 'ri-btn';
    btnItalic.innerHTML = '<i>I</i>';
    btnItalic.title = 'Курсив';
    btnItalic.type = 'button';
    
    // Кнопка подчеркивание
    const btnUnderline = document.createElement('button');
    btnUnderline.className = 'ri-btn';
    btnUnderline.innerHTML = '<u>U</u>';
    btnUnderline.title = 'Подчеркивание';
    btnUnderline.type = 'button';
    
    // Кнопка зачеркивание
    const btnStrike = document.createElement('button');
    btnStrike.className = 'ri-btn';
    btnStrike.innerHTML = '<s>S</s>';
    btnStrike.title = 'Зачеркивание';
    btnStrike.type = 'button';
    
    // Кнопка ссылки
    const btnUrl = document.createElement('button');
    btnUrl.id = 'riLink';
    btnUrl.className = 'ri-btn';
    btnUrl.innerHTML = '🔗';
    btnUrl.title = 'Ссылка';
    btnUrl.type = 'button';
    
    // Кнопка цвета
    const btnClr = document.createElement('button');
    btnClr.id = 'riColorBtn';
    btnClr.className = 'ri-trigger';
    btnClr.title = 'Цвет текста';
    btnClr.type = 'button';
    
    // Добавляем все кнопки
    toolbar.appendChild(btnHeading);
    toolbar.appendChild(btnFontSize);
    toolbar.appendChild(btnBold);
    toolbar.appendChild(btnItalic);
    toolbar.appendChild(btnUnderline);
    toolbar.appendChild(btnStrike);
    toolbar.appendChild(btnUrl);
    toolbar.appendChild(btnClr);
        // Кнопка Анимация
    const btnAnim = document.createElement('button');
    btnAnim.className = 'ri-btn';
    btnAnim.textContent = '✨';
    btnAnim.title = 'Анимация текста';
    btnAnim.type = 'button';

    // Добавляем в тулбар
    toolbar.appendChild(btnAnim);
    // Кнопка стилизации текста
const btnBeautify = document.createElement('button');
btnBeautify.className = 'ri-btn';
btnBeautify.textContent = '🧠 GPT РЕШЕНИЕ';
btnBeautify.title = 'Стилизовать текст';
btnBeautify.type = 'button';
// === НОВАЯ КНОПКА HTML PREVIEW ===
    const btnHtmlPreview = document.createElement('button');
    btnHtmlPreview.className = 'ri-btn';
    btnHtmlPreview.innerHTML = '💻 HTML';
    btnHtmlPreview.title = 'HTML Preview';
    btnHtmlPreview.type = 'button';

    btnHtmlPreview.addEventListener('click', () => {
      if (!window.HtmlPreviewModal) {
        alert('HtmlPreviewModal не загружен!');
        return;
      }

      const modal = new HtmlPreviewModal();
      modal.open('', (finalHtml) => {
        // Вставляем HTML в редактор текста
        if (editor) {
          editor.innerHTML = finalHtml;
          opts?.onChange?.(editor.innerHTML);
          if (typeof window.selectEl === 'function' && opts?.selectedEl) {
            requestAnimationFrame(() => {
              try { window.selectEl(opts.selectedEl); } catch(e){}
            });
          }
        }
      }, { wrapInIframe: false });
    });

    toolbar.appendChild(btnHtmlPreview);


// Добавляем в тулбар
toolbar.appendChild(btnBeautify);

// Обработчик кнопки
btnBeautify.addEventListener('click', () => {
  if (window.TextBeautifyUI) {
    window.TextBeautifyUI.init(editor, opts?.onChange);
    window.TextBeautifyUI.openStylePicker();
  }
});
    editor.setAttribute('contenteditable','true');
    editor.innerHTML = opts?.value || '';

    let saved = null;
    editor.addEventListener('mouseup', ()=> saved = saveSel());
    editor.addEventListener('keyup',   ()=> saved = saveSel());
    editor.addEventListener('input',   ()=> opts?.onChange?.(editor.innerHTML));

    // Обработчики для новых кнопок
    btnHeading.addEventListener('click', ()=>{
      saved = saveSel();
      openHeadingMenu(btnHeading, (tag)=>{
        restoreSel(saved);
        if(tag === 'p') {
          exec(editor, 'formatBlock', 'p');
        } else {
          exec(editor, 'formatBlock', tag);
        }
        opts?.onChange?.(editor.innerHTML);
        if (typeof window.selectEl === 'function' && opts?.selectedEl) {
          requestAnimationFrame(() => { try { window.selectEl(opts.selectedEl); } catch(e){} });
        }
      });
    });
    
    btnFontSize.addEventListener('click', ()=>{
      saved = saveSel();
      openFontSizeMenu(btnFontSize, (size)=>{
        restoreSel(saved);
        // Оборачиваем выделение в span с размером
        const sel = window.getSelection();
        if (sel.rangeCount > 0 && !sel.isCollapsed) {
          const range = sel.getRangeAt(0);
          const span = document.createElement('span');
          span.style.fontSize = size;
          try {
            range.surroundContents(span);
          } catch(e) {
            // Если не удается обернуть, используем альтернативный метод
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
          }
        }
        opts?.onChange?.(editor.innerHTML);
        if (typeof window.selectEl === 'function' && opts?.selectedEl) {
          requestAnimationFrame(() => { try { window.selectEl(opts.selectedEl); } catch(e){} });
        }
      });
    });
        // Обработчик "Анимация"
    btnAnim.addEventListener('click', ()=>{
      saved = saveSel();
      openAnimMenu(btnAnim, (key)=>{
        restoreSel(saved);
        const sel = window.getSelection();
        if (!sel || sel.rangeCount === 0) return;
        const range = sel.getRangeAt(0);

        if (key === '__remove__') {
          // снять анимацию внутри выделения
          const container = range.commonAncestorContainer.nodeType === 3
            ? range.commonAncestorContainer.parentNode
            : range.commonAncestorContainer;
          const spans = container.querySelectorAll('span.ta');
          spans.forEach(sp => {
            // разворачиваем span.ta
            const p = sp.parentNode;
            while (sp.firstChild) p.insertBefore(sp.firstChild, sp);
            p.removeChild(sp);
          });
          opts?.onChange?.(editor.innerHTML);
          if (typeof window.selectEl === 'function' && opts?.selectedEl) {
            requestAnimationFrame(() => { try { window.selectEl(opts.selectedEl); } catch(e){} });
          }
          return;
        }

        // применить анимацию к выделению
        if (!sel.isCollapsed) {
          const span = document.createElement('span');
          span.className = 'ta ' + key;
          span.setAttribute('data-ta', key);
          try {
            range.surroundContents(span);
          } catch(e) {
            const contents = range.extractContents();
            span.appendChild(contents);
            range.insertNode(span);
          }
          opts?.onChange?.(editor.innerHTML);
          if (typeof window.selectEl === 'function' && opts?.selectedEl) {
            requestAnimationFrame(() => { try { window.selectEl(opts.selectedEl); } catch(e){} });
          }
        }
      });
    });

    btnBold.addEventListener('click', ()=>{
      exec(editor, 'bold');
      opts?.onChange?.(editor.innerHTML);
    });
    
    btnItalic.addEventListener('click', ()=>{
      exec(editor, 'italic');
      opts?.onChange?.(editor.innerHTML);
    });
    
    btnUnderline.addEventListener('click', ()=>{
      exec(editor, 'underline');
      opts?.onChange?.(editor.innerHTML);
    });
    
    btnStrike.addEventListener('click', ()=>{
      exec(editor, 'strikeThrough');
      opts?.onChange?.(editor.innerHTML);
    });

    // URL
    btnUrl.addEventListener('click', ()=>{
      saved = saveSel();
      const url = prompt('Введите ссылку (http/https):','https://');
      if(!url) return;
      restoreSel(saved);
      exec(editor, 'createLink', url);
      opts?.onChange?.(editor.innerHTML);
      if (typeof window.selectEl === 'function' && opts?.selectedEl) {
        requestAnimationFrame(() => { try { window.selectEl(opts.selectedEl); } catch(e){} });
      }
    });

    // Цвет выделения — палитра в модалке
    btnClr.addEventListener('click', ()=>{
      saved = saveSel();
      openPalette(btnClr, (color)=>{
        restoreSel(saved);
        try { exec(editor,'foreColor', color); } catch(e){}
        opts?.onChange?.(editor.innerHTML);
        if (typeof window.selectEl === 'function' && opts?.selectedEl) {
          requestAnimationFrame(() => { try { window.selectEl(opts.selectedEl); } catch(e){} });
        }
      });
    });

    // клики в правой панели не должны снимать выделение на сцене
    ['mousedown','click','pointerdown'].forEach(evt=>{
      root.addEventListener(evt, e => e.stopPropagation());
      editor.addEventListener(evt, e => e.stopPropagation());
    });

    return {
      getHTML(){ return editor.innerHTML; },
      setHTML(h){ editor.innerHTML = h || ''; opts?.onChange?.(editor.innerHTML); }
    };
  }

  window.initRTEMini = initRTEMini;
})();
