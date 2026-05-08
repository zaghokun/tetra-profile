document.addEventListener('DOMContentLoaded', function () {
    const floatingContact    = document.getElementById('floating-contact');
    const contactToggle      = document.getElementById('contact-toggle');
    const whatsappContainer  = document.getElementById('whatsapp-container');
    const whatsappMain       = whatsappContainer
                                 ? whatsappContainer.querySelector('.whatsapp-main')
                                 : null;
    const floatingMenu       = floatingContact
                                 ? floatingContact.querySelector('.floating-contact-menu')
                                 : null;

    if (!floatingContact || !floatingMenu) return;

    let menuOpenedByClick = false;

    /* ──────────────────────────────────────────────
       Smart positioning: always open UPWARD
       so the menu never goes below the viewport
    ────────────────────────────────────────────── */
    function positionMenu() {
        // Reset sebelum menghitung
        floatingMenu.style.top    = '';
        floatingMenu.style.bottom = '';
        floatingMenu.style.right  = '';
        floatingMenu.style.left   = '';

        const btnRect  = floatingContact.getBoundingClientRect();
        const menuH    = floatingMenu.offsetHeight || 260; // fallback estimasi
        const menuW    = floatingMenu.offsetWidth  || 220;
        const vpH      = window.innerHeight;
        const vpW      = window.innerWidth;

        // Vertikal: buka ke atas secara default
        // Jika ruang di atas kurang → buka ke bawah
        const spaceAbove = btnRect.top;
        const spaceBelow = vpH - btnRect.bottom;

        if (spaceAbove >= menuH || spaceAbove >= spaceBelow) {
            // Buka ke atas (normal)
            floatingMenu.style.bottom = (vpH - btnRect.top + 8) + 'px';
            floatingMenu.style.top    = 'auto';
        } else {
            // Ruang atas tidak cukup, buka ke bawah
            floatingMenu.style.top    = (btnRect.bottom + 8) + 'px';
            floatingMenu.style.bottom = 'auto';
        }

        // Horizontal: ratakan ke kanan tombol, tapi jangan keluar viewport
        const rightEdge = vpW - btnRect.right;
        floatingMenu.style.right = Math.max(rightEdge, 8) + 'px';
        floatingMenu.style.left  = 'auto';

        // Pastikan lebar menu tidak melewati viewport
        const maxW = vpW - 16;
        floatingMenu.style.maxWidth = maxW + 'px';
    }

    /* ──────────────────────────────────────────────
       Posisi WhatsApp sub-menu (kartu agen)
    ────────────────────────────────────────────── */
    function positionWhatsappMenu() {
        if (!whatsappContainer) return;
        const subMenu = whatsappContainer.querySelector('.whatsapp-card-menu');
        if (!subMenu) return;

        subMenu.style.top    = '';
        subMenu.style.bottom = '';
        subMenu.style.right  = '';
        subMenu.style.left   = '';

        const parentRect = whatsappContainer.getBoundingClientRect();
        const subH       = subMenu.offsetHeight || 180;
        const subW       = subMenu.offsetWidth  || 260;
        const vpH        = window.innerHeight;
        const vpW        = window.innerWidth;

        // Vertikal: default ke atas
        if (parentRect.top >= subH) {
            subMenu.style.bottom = '100%';
            subMenu.style.top    = 'auto';
        } else {
            subMenu.style.top    = '100%';
            subMenu.style.bottom = 'auto';
        }

        // Horizontal: buka ke kiri jika tidak cukup ruang di kanan
        const spaceRight = vpW - parentRect.right;
        if (spaceRight >= subW) {
            subMenu.style.left  = '0';
            subMenu.style.right = 'auto';
        } else {
            subMenu.style.right = '0';
            subMenu.style.left  = 'auto';
        }

        // Batas lebar
        subMenu.style.maxWidth = (vpW - 16) + 'px';
    }

    /* ──────────────────────────────────────────────
       Toggle utama
    ────────────────────────────────────────────── */
    function openMenu() {
        positionMenu();
        floatingContact.classList.add('active');
        menuOpenedByClick = true;
    }

    function closeMenu() {
        floatingContact.classList.remove('active');
        if (whatsappContainer) whatsappContainer.classList.remove('open');
        menuOpenedByClick = false;
    }

    // Klik tombol utama
    if (contactToggle) {
        contactToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            if (floatingContact.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    // Hover (desktop only — diabaikan di touch device)
    floatingContact.addEventListener('mouseenter', function () {
        if (!('ontouchstart' in window)) {
            positionMenu();
            floatingContact.classList.add('active');
        }
    });

    floatingContact.addEventListener('mouseleave', function () {
        if (!menuOpenedByClick) {
            floatingContact.classList.remove('active');
            if (whatsappContainer) whatsappContainer.classList.remove('open');
        }
    });

    /* ──────────────────────────────────────────────
       WhatsApp sub-menu
    ────────────────────────────────────────────── */
    if (whatsappMain) {
        whatsappMain.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const willOpen = !whatsappContainer.classList.contains('open');
            whatsappContainer.classList.toggle('open');
            if (willOpen) positionWhatsappMenu();
        });
    }

    /* ──────────────────────────────────────────────
       Tutup saat klik di luar
    ────────────────────────────────────────────── */
    document.addEventListener('click', function (e) {
        if (!floatingContact.contains(e.target)) {
            closeMenu();
        }
    });

    // Tutup setelah pilih kontak WhatsApp
    document.querySelectorAll('.whatsapp-card').forEach(function (card) {
        card.addEventListener('click', function () {
            closeMenu();
        });
    });

    /* ──────────────────────────────────────────────
       Reposisi saat resize / orientasi berubah
    ────────────────────────────────────────────── */
    window.addEventListener('resize', function () {
        if (floatingContact.classList.contains('active')) positionMenu();
        if (whatsappContainer && whatsappContainer.classList.contains('open')) positionWhatsappMenu();
    });
});