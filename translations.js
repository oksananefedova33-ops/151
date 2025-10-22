(function(){
    'use strict';
    
    let currentLanguages = [];
    let isTranslating = false;
    
    // Добавляем кнопку в тулбар
    function addTranslationsButton() {
        const toolbar = document.querySelector('.topbar');
        if (!toolbar || document.getElementById('btnTranslations')) return;
        
        const langBtn = document.getElementById('btnLangs');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'btnTranslations';
        btn.className = 'btn';
        btn.textContent = '🌍 Переводы';
        btn.addEventListener('click', openTranslationsModal);
        
        if (langBtn && langBtn.nextSibling) {
            langBtn.parentNode.insertBefore(btn, langBtn.nextSibling);
        } else {
            toolbar.appendChild(btn);
        }
    }
    
    // Создаем модальное окно
    function createModal() {
        if (document.getElementById('transModalBackdrop')) return;
        
        const backdrop = document.createElement('div');
        backdrop.id = 'transModalBackdrop';
        backdrop.className = 'trans-backdrop hidden';
        
        const modal = document.createElement('div');
        modal.className = 'trans-modal';
        
        modal.innerHTML = `
            <div class="trans-modal__header">
                <div class="trans-modal__title">🌍 Управление переводами</div>
                <button type="button" class="trans-close">×</button>
            </div>
            <div class="trans-modal__body">
                <div class="trans-section">
                    <label class="trans-label">Выбранные языки для перевода:</label>
                    <div class="trans-langs" id="transLangsList">
                        <div style="color:#6b7280">Сначала выберите языки через кнопку "Языки"</div>
                    </div>
                </div>
                
                <div class="trans-section">
                    <label class="trans-label">Токен DeepL API:</label>
                    <input type="password" class="trans-input" id="transDeeplToken" placeholder="Введите ваш API токен DeepL">
                    <div class="trans-buttons" style="margin-top:8px">
                        <button type="button" class="trans-btn" id="transSaveToken">💾 Сохранить токен</button>
                        <button type="button" class="trans-btn danger" id="transDeleteToken">🗑️ Удалить токен</button>
                    </div>
                </div>
                
                <div class="trans-section">
                    <label class="trans-label">Управление переводами:</label>
                    <div class="trans-buttons">
                        <button type="button" class="trans-btn primary" id="transStartTranslate">🚀 Начать переводы</button>
                        <button type="button" class="trans-btn danger" id="transDeleteAll">🗑️ Удалить все переводы</button>
                    </div>
                </div>
                
                <div class="trans-section">
                    <label class="trans-label">Лог выполнения:</label>
                    <div class="trans-log" id="transLog">
                        <div class="trans-log-entry info">Готов к работе...</div>
                    </div>
                </div>
            </div>
        `;
        
        backdrop.appendChild(modal);
        document.body.appendChild(backdrop);
        
        // Обработчики
        modal.querySelector('.trans-close').addEventListener('click', closeModal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });
        
        document.getElementById('transSaveToken').addEventListener('click', saveToken);
        document.getElementById('transDeleteToken').addEventListener('click', deleteToken);
        document.getElementById('transStartTranslate').addEventListener('click', startTranslation);
        document.getElementById('transDeleteAll').addEventListener('click', deleteAllTranslations);
        
        // Загружаем токен
        loadToken();
    }
    
    function openTranslationsModal() {
        createModal();
        updateLanguagesList();
        document.getElementById('transModalBackdrop').classList.remove('hidden');
    }
    
    function closeModal() {
        document.getElementById('transModalBackdrop').classList.add('hidden');
    }
    
    function updateLanguagesList() {
        const container = document.getElementById('transLangsList');
        
        // Получаем выбранные языки из элемента langbadge
        const langBadge = document.querySelector('.el[data-type="langbadge"]');
        if (langBadge && langBadge.dataset.langs) {
            currentLanguages = langBadge.dataset.langs.split(',').filter(Boolean);
        }
        
        if (currentLanguages.length > 0) {
            const langNames = {
                'ru': '🇷🇺 Русский',
                'en': '🇬🇧 English',
                'zh-Hans': '🇨🇳 中文',
                'es': '🇪🇸 Español',
                'fr': '🇫🇷 Français',
                'de': '🇩🇪 Deutsch',
                'it': '🇮🇹 Italiano',
                'pt': '🇵🇹 Português',
                'ja': '🇯🇵 日本語',
                'ko': '🇰🇷 한국어',
                'nl': '🇳🇱 Nederlands',
                'pl': '🇵🇱 Polski',
                'tr': '🇹🇷 Türkçe',
                'ar': '🇸🇦 العربية',
                'cs': '🇨🇿 Čeština',
                'da': '🇩🇰 Dansk',
                'el': '🇬🇷 Ελληνικά',
                'fi': '🇫🇮 Suomi',
                'hu': '🇭🇺 Magyar',
                'id': '🇮🇩 Indonesia',
                'no': '🇳🇴 Norsk',
                'ro': '🇷🇴 Română',
                'sv': '🇸🇪 Svenska',
                'uk': '🇺🇦 Українська',
                'bg': '🇧🇬 Български',
                'et': '🇪🇪 Eesti',
                'lt': '🇱🇹 Lietuvių',
                'lv': '🇱🇻 Latviešu',
                'sk': '🇸🇰 Slovenčina',
                'sl': '🇸🇮 Slovenščina',
                'hi': '🇮🇳 हिन्दी'
            };
            
            container.innerHTML = currentLanguages.map(lang => 
                `<div class="trans-lang-chip ${lang === 'ru' ? 'active' : ''}">${langNames[lang] || lang}</div>`
            ).join('');
        } else {
            container.innerHTML = '<div style="color:#6b7280">Нет выбранных языков. Используйте кнопку "Языки" для выбора.</div>';
        }
    }
    
    function log(message, type = 'info') {
        const logEl = document.getElementById('transLog');
        const entry = document.createElement('div');
        entry.className = `trans-log-entry ${type}`;
        entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
        logEl.appendChild(entry);
        logEl.scrollTop = logEl.scrollHeight;
    }
    
    async function loadToken() {
        try {
            const response = await fetch('/editor/translations_api.php?action=getToken');
            const data = await response.json();
            if (data.ok && data.token) {
                document.getElementById('transDeeplToken').value = data.token;
                log('Токен DeepL загружен', 'success');
            }
        } catch (error) {
            log('Ошибка загрузки токена: ' + error.message, 'error');
        }
    }
    
    async function saveToken() {
        const token = document.getElementById('transDeeplToken').value.trim();
        if (!token) {
            log('Введите токен DeepL', 'error');
            return;
        }
        
        try {
            const fd = new FormData();
            fd.append('action', 'saveToken');
            fd.append('token', token);
            
            const response = await fetch('/editor/translations_api.php', {
                method: 'POST',
                body: fd
            });
            const data = await response.json();
            
            if (data.ok) {
                log('Токен успешно сохранен', 'success');
            } else {
                log('Ошибка сохранения токена', 'error');
            }
        } catch (error) {
            log('Ошибка: ' + error.message, 'error');
        }
    }
    
    async function deleteToken() {
        if (!confirm('Удалить сохраненный токен DeepL?')) return;
        
        try {
            const fd = new FormData();
            fd.append('action', 'deleteToken');
            
            const response = await fetch('/editor/translations_api.php', {
                method: 'POST',
                body: fd
            });
            const data = await response.json();
            
            if (data.ok) {
                document.getElementById('transDeeplToken').value = '';
                log('Токен удален', 'success');
            }
        } catch (error) {
            log('Ошибка: ' + error.message, 'error');
        }
    }
    
    async function startTranslation() {
        if (isTranslating) {
            log('Перевод уже выполняется...', 'error');
            return;
        }
        
        if (currentLanguages.length === 0) {
            log('Сначала выберите языки через кнопку "Языки"', 'error');
            return;
        }
        
        const token = document.getElementById('transDeeplToken').value.trim();
        if (!token) {
            log('Сначала сохраните токен DeepL', 'error');
            return;
        }
        
        isTranslating = true;
        log('Начинаю перевод...', 'info');
        
        try {
            // Получаем список всех страниц
            const pagesResponse = await fetch('/editor/api.php?action=listPages');
            const pagesData = await pagesResponse.json();
            
            if (!pagesData.ok || !pagesData.pages) {
                throw new Error('Не удалось получить список страниц');
            }
            
            // Переводим каждую страницу
            for (const page of pagesData.pages) {
                log(`Перевожу страницу: ${page.name}`, 'info');
                
                const fd = new FormData();
                fd.append('action', 'translate');
                fd.append('page_id', page.id);
                fd.append('languages', JSON.stringify(currentLanguages));
                
                const response = await fetch('/editor/translations_api.php', {
                    method: 'POST',
                    body: fd
                });
                
                const data = await response.json();
                
                if (data.ok) {
                    data.results.forEach(result => log(result, 'success'));
                } else {
                    log(`Ошибка перевода страницы ${page.name}: ${data.error}`, 'error');
                }
            }
            
            log('Перевод завершен!', 'success');
        } catch (error) {
            log('Ошибка: ' + error.message, 'error');
        } finally {
            isTranslating = false;
        }
    }
    
    async function deleteAllTranslations() {
        if (!confirm('Удалить ВСЕ переводы? Это действие нельзя отменить!')) return;
        
        try {
            const fd = new FormData();
            fd.append('action', 'deleteTranslations');
            
            const response = await fetch('/editor/translations_api.php', {
                method: 'POST',
                body: fd
            });
            const data = await response.json();
            
            if (data.ok) {
                log('Все переводы удалены', 'success');
            }
        } catch (error) {
            log('Ошибка: ' + error.message, 'error');
        }
    }
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', function() {
        addTranslationsButton();
    });
})();