// Початкові дані семінарів
const initialSeminars = [
    {
        id: 1,
        name: "АНТИДРОБЛЕННЯ-2026: РИЗИКИ, ПЕРЕВІРКИ, ДОНАРАХУВАННЯ, СТРАТЕГІЯ ЗАХИСТУ",
        date: "27.05.2026",
        time: "11:30",
        location: "Онлайн",
        description: "Вебінар Вікторія Величко про антидроблення, ризики, перевірки ДПС і стратегію захисту бізнесу",
        price: 3900,
        earlyPrice: 2960,
        earlyDeadline: "20.05.2026",
        lecturer: "Вікторія Величко",
        duration: "3 години",
        schedule: "11:30-13:00 – 1 частина\n13:30-15:00 – 2 частина\n15:30-16:30 – 3 частина і відповіді на запитання"
    },
    {
        id: 2,
        name: "СОБІВАРТІСТЬ ПРОДУКЦІЇ (ПОСЛУГ) БЕЗ ПОМИЛОК: ВІД ФОРМУВАННЯ ВИТРАТ ДО ЗАХИСТУ ПІД ЧАС ПЕРЕВІРКИ ДПС",
        date: "26.05.2026",
        time: "12:00",
        location: "Онлайн",
        description: "Онлайн-семінар для бухгалтерів, керівників, аудиторів про формування собівартості продукції та послуг",
        price: 3910,
        earlyPrice: 2970,
        earlyDeadline: "20.05.2026",
        lecturer: "Вікторія Величко",
        duration: "4 години",
        schedule: "11:30-12:00 – реєстрація, налаштування\n12:00-13:30 – 1 частина\n13:30-14:00 – перерва\n14:00-15:30 – 2 частина\n15:30-16:00 – перерва\n16:00-17:00 – 3 частина та відповіді на запитання"
    }
];

let seminars = [];
let adminVisible = false;

// Ініціалізація
document.addEventListener('DOMContentLoaded', function() {
    loadSeminars();
    renderSeminars();
});

// Завантаження семінарів з localStorage
function loadSeminars() {
    const stored = localStorage.getItem('seminars');
    if (stored) {
        seminars = JSON.parse(stored);
    } else {
        seminars = JSON.parse(JSON.stringify(initialSeminars));
        saveSeminars();
    }
}

// Збереження семінарів у localStorage
function saveSeminars() {
    localStorage.setItem('seminars', JSON.stringify(seminars));
}

// Перекладення адмін-панелі
function toggleAdmin() {
    adminVisible = !adminVisible;
    const adminPanel = document.getElementById('adminPanel');
    if (adminVisible) {
        adminPanel.classList.remove('hidden');
        // Прокрутка до форми
        adminPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
        adminPanel.classList.add('hidden');
    }
}

// Додавання нового семінару
function addSeminar(event) {
    event.preventDefault();

    const newSeminar = {
        id: Date.now(),
        name: document.getElementById('name').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        location: document.getElementById('location').value || 'Онлайн',
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        earlyPrice: parseFloat(document.getElementById('earlyPrice').value) || 0,
        earlyDeadline: document.getElementById('earlyDeadline').value,
        lecturer: document.getElementById('lecturer').value || 'Вікторія Величко'
    };

    seminars.push(newSeminar);
    saveSeminars();
    renderSeminars();

    // Очистка форми
    document.querySelector('.seminar-form').reset();
    alert('✅ Семінар успішно додано!');
}

// Видалення семінару
function deleteSeminar(id) {
    if (confirm('❓ Ви впевнені, що хочете видалити цей семінар?')) {
        seminars = seminars.filter(s => s.id !== id);
        saveSeminars();
        renderSeminars();
        closeModal();
        alert('✅ Семінар видалено!');
    }
}

// Редагування семінару
function editSeminar(id) {
    const seminar = seminars.find(s => s.id === id);
    if (!seminar) return;

    // Заповнення форми даними
    document.getElementById('name').value = seminar.name;
    document.getElementById('date').value = seminar.date;
    document.getElementById('time').value = seminar.time;
    document.getElementById('location').value = seminar.location;
    document.getElementById('description').value = seminar.description;
    document.getElementById('price').value = seminar.price;
    document.getElementById('earlyPrice').value = seminar.earlyPrice || '';
    document.getElementById('earlyDeadline').value = seminar.earlyDeadline || '';
    document.getElementById('lecturer').value = seminar.lecturer;

    // Видалення старого семінару
    seminars = seminars.filter(s => s.id !== id);
    saveSeminars();
    renderSeminars();
    closeModal();

    // Прокрутка до форми
    const adminPanel = document.getElementById('adminPanel');
    adminPanel.classList.remove('hidden');
    adminVisible = true;
    adminPanel.scrollIntoView({ behavior: 'smooth' });
    alert('✅ Редагуйте форму вище та натисніть "Додати семінар"');
}

// Перевірка, чи діє рання ціна
function isEarlyPriceActive(deadline) {
    if (!deadline) return false;
    const deadlineDate = parseDate(deadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today <= deadlineDate;
}

// Парсинг дати у форматі дд.мм.рррр
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('.');
    return new Date(year, month - 1, day);
}

// Рендеринг карток семінарів
function renderSeminars() {
    const grid = document.getElementById('seminarsGrid');
    grid.innerHTML = '';

    if (seminars.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>🎓 Семінари не знайдено</p></div>';
        return;
    }

    seminars.forEach(seminar => {
        const card = createSeminarCard(seminar);
        grid.appendChild(card);
    });
}

// Створення картки семінару
function createSeminarCard(seminar) {
    const card = document.createElement('div');
    card.className = 'seminar-card';
    card.onclick = () => openModal(seminar);

    const isEarlyActive = isEarlyPriceActive(seminar.earlyDeadline);
    const displayPrice = isEarlyActive && seminar.earlyPrice ? seminar.earlyPrice : seminar.price;

    card.innerHTML = `
        <div class="card-header">
            <h3>${seminar.name}</h3>
            <div class="date">📅 ${seminar.date} о ${seminar.time}</div>
        </div>
        <div class="card-body">
            <p><strong>📍 ${seminar.location}</strong></p>
            <p>${seminar.description.substring(0, 100)}...</p>
            <div class="price-section">
                ${isEarlyActive && seminar.earlyPrice ? `
                    <span class="early-price">Звичайна: ${seminar.price} грн</span>
                    <span class="current-price">🎉 ${displayPrice} грн</span>
                    <div class="early-info">Рання ціна до ${seminar.earlyDeadline}</div>
                ` : `
                    <div class="current-price">💰 ${displayPrice} грн</div>
                `}
            </div>
        </div>
        <div class="card-footer">
            <button class="btn btn-primary" onclick="event.stopPropagation();">🔍 Детальніше</button>
        </div>
    `;

    return card;
}

// Відкриття модального вікна
function openModal(seminar) {
    const modal = document.getElementById('modal');
    const modalBody = document.getElementById('modalBody');
    const modalActions = document.getElementById('modalActions');

    const isEarlyActive = isEarlyPriceActive(seminar.earlyDeadline);
    const displayPrice = isEarlyActive && seminar.earlyPrice ? seminar.earlyPrice : seminar.price;

    modalBody.innerHTML = `
        <h2>${seminar.name}</h2>
        <p><strong>📅 Дата:</strong> ${seminar.date}</p>
        <p><strong>⏰ Час:</strong> ${seminar.time}</p>
        <p><strong>📍 Місце:</strong> ${seminar.location}</p>
        <p><strong>👨‍🏫 Лектор:</strong> ${seminar.lecturer}</p>
        <p><strong>📝 Опис:</strong> ${seminar.description}</p>
        ${seminar.schedule ? `<p><strong>⏱️ Регламент:</strong></p><pre>${seminar.schedule}</pre>` : ''}
        <p><strong>💰 Вартість:</strong></p>
        <div class="price-section">
            ${isEarlyActive && seminar.earlyPrice ? `
                <span class="early-price">Звичайна: ${seminar.price} грн</span>
                <span class="current-price">🎉 ${displayPrice} грн</span>
                <div class="early-info">Рання ціна до ${seminar.earlyDeadline}</div>
            ` : `
                <div class="current-price">💰 ${displayPrice} грн</div>
            `}
        </div>
    `;

    if (adminVisible) {
        modalActions.innerHTML = `
            <button class="btn btn-edit" onclick="event.stopPropagation(); editSeminar(${seminar.id})">✏️ Редагувати</button>
            <button class="btn btn-danger" onclick="event.stopPropagation(); deleteSeminar(${seminar.id})">🗑️ Видалити</button>
            <button class="btn btn-primary" onclick="closeModal()">Закрити</button>
        `;
    } else {
        modalActions.innerHTML = `
            <button class="btn btn-primary" onclick="closeModal()">Закрити</button>
        `;
    }

    modal.classList.remove('hidden');
    modal.classList.add('show');
}

// Закриття модального вікна
function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('hidden');
    modal.classList.remove('show');
}

// Закриття модалю при кліку поза ним
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
};
