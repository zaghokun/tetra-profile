document.addEventListener('DOMContentLoaded', function() {
    const floatingContact = document.getElementById('floating-contact');
    const contactToggle   = document.getElementById('contact-toggle');
    const whatsappContainer = document.getElementById('whatsapp-container');
    const whatsappMain    = whatsappContainer.querySelector('.whatsapp-main');
    const floatingMenu    = floatingContact.querySelector('.floating-contact-menu');

    let menuOpenedByClick = false;

    // Saat hover keluar dan menu tidak di-pin by click, tutup
    floatingContact.addEventListener('mouseleave', function() {
        if (!menuOpenedByClick) {
            floatingContact.classList.remove('active');
            whatsappContainer.classList.remove('open');
        }
    });

    // WhatsApp submenu toggle
    whatsappMain.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        whatsappContainer.classList.toggle('open');
    });

    // Tutup saat klik di luar
    document.addEventListener('click', function(e) {
        if (!floatingContact.contains(e.target)) {
            floatingContact.classList.remove('active');
            whatsappContainer.classList.remove('open');
            menuOpenedByClick = false;
        }
    });

    // Tutup saat klik WhatsApp card
    document.querySelectorAll('.whatsapp-card').forEach(card => {
        card.addEventListener('click', function() {
            whatsappContainer.classList.remove('open');
            floatingContact.classList.remove('active');
            menuOpenedByClick = false;
        });
    });
});