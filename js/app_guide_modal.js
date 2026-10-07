(() => {
    const appGuideModalElement = document.getElementById('app-guide-modal'),
        appGuideContentElement = document.getElementById('app-guide-content'),
        appGuideCloseElement = document.getElementById('app-guide-close'),
        appGuideDoneElement = document.getElementById('app-guide-done');
    if (
        !appGuideModalElement ||
        !appGuideContentElement ||
        !appGuideCloseElement ||
        !appGuideDoneElement
    )
        return;
    let value = null,
        overflow_2 = '';
    function handleAction_3(element, value_7, className_2, value_9) {
        const element_10 = document.createElement(value_7);
        return (
            (element_10.className = className_2),
            (element_10.textContent = String(value_9 || '')),
            element.appendChild(element_10),
            element_10
        );
    }
    function handleAction_4({
        eyebrow = 'GUIDE',
        title = '使用指南',
        intro = '',
        sections = [],
        note = null,
    }) {
        appGuideContentElement.replaceChildren();
        handleAction_3(appGuideContentElement, 'span', 'app-guide-eyebrow', eyebrow);
        const handleAction_3_11 = handleAction_3(
            appGuideContentElement,
            'h2',
            'app-guide-title',
            title,
        );
        handleAction_3_11.id = 'app-guide-title';
        if (intro) handleAction_3(appGuideContentElement, 'p', 'app-guide-intro', intro);
        (Array.isArray(sections) ? sections : []).forEach((value_12, value_13) => {
            const element_14 = document.createElement('section');
            element_14.className = 'app-guide-section';
            handleAction_3(
                element_14,
                'span',
                'app-guide-section-label',
                value_12.label || String(value_13 + 1).padStart(2, '0'),
            );
            handleAction_3(element_14, 'h3', '', value_12.title);
            (Array.isArray(value_12.items) ? value_12.items : []).forEach((value_15) => {
                const element_16 = document.createElement('div');
                element_16.className = 'app-guide-point';
                if (typeof value_15 === 'string') handleAction_3(element_16, 'p', '', value_15);
                else {
                    if (value_15 && typeof value_15 === 'object') {
                        if (value_15.title)
                            handleAction_3(element_16, 'strong', '', value_15.title);
                        if (value_15.text) handleAction_3(element_16, 'p', '', value_15.text);
                    }
                }
                element_14.appendChild(element_16);
            });
            appGuideContentElement.appendChild(element_14);
        });
        if (note && typeof note === 'object') {
            const element_17 = document.createElement('aside');
            element_17.className = 'app-guide-note';
            if (note.title) handleAction_3(element_17, 'strong', '', note.title);
            if (note.text) handleAction_3(element_17, 'p', '', note.text);
            appGuideContentElement.appendChild(element_17);
        }
        appGuideContentElement.scrollTop = 0;
    }
    function closeAppGuideModal_2() {
        if (appGuideModalElement.hidden) return false;
        appGuideModalElement.hidden = true;
        appGuideModalElement.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = overflow_2;
        overflow_2 = '';
        const value_18 = value;
        return ((value = null), value_18?.focus?.(), true);
    }
    function openAppGuideModal_2(value_19 = {}) {
        if (!value_19 || typeof value_19 !== 'object') return false;
        return (
            appGuideModalElement.hidden &&
                ((value = document.activeElement), (overflow_2 = document.body.style.overflow)),
            handleAction_4(value_19),
            (appGuideModalElement.hidden = false),
            appGuideModalElement.setAttribute('aria-hidden', 'false'),
            (document.body.style.overflow = 'hidden'),
            appGuideCloseElement.focus(),
            true
        );
    }
    appGuideCloseElement.addEventListener('click', closeAppGuideModal_2);
    appGuideDoneElement.addEventListener('click', closeAppGuideModal_2);
    appGuideModalElement.addEventListener('click', (event) => {
        if (event.target === appGuideModalElement) closeAppGuideModal_2();
    });
    document.addEventListener(
        'keydown',
        (event_20) => {
            if (appGuideModalElement.hidden) return;
            if (event_20.key === 'Escape') {
                event_20.preventDefault();
                event_20.stopPropagation();
                closeAppGuideModal_2();
            } else {
                if (event_20.key === 'Tab') {
                    const value_21 = appGuideCloseElement,
                        value_22 = appGuideDoneElement;
                    if (
                        event_20.shiftKey &&
                        (document.activeElement === value_21 ||
                            !appGuideModalElement.contains(document.activeElement))
                    ) {
                        event_20.preventDefault();
                        value_22.focus();
                    } else
                        !event_20.shiftKey &&
                            (document.activeElement === value_22 ||
                                !appGuideModalElement.contains(document.activeElement)) &&
                            (event_20.preventDefault(), value_21.focus());
                }
            }
        },
        true,
    );
    window.openAppGuideModal = openAppGuideModal_2;
    window.closeAppGuideModal = closeAppGuideModal_2;
})();
