// Formatear precio en EUR
export function formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
    }).format(price);
}

// Nombre legible de categoría
export function getCategoryName(cat) {
    const names = {
        alimentacion: 'Alimentación',
        cosmetica: 'Cosmética',
        artesania: 'Artesanía',
        textil: 'Textil',
        decoracion: 'Decoración'
    };
    return names[cat] || cat;
}

// Mostrar toast notification
export function showToast(msg) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}
