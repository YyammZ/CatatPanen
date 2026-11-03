
/* =========================================
   CATATPANEN - DASHBOARD
   Vanilla JavaScript
========================================= */

// DATA CONTOH
// Nantinya akan diganti dengan data dari store.js.

function daysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    date.setHours(0, 0, 0, 0);
    return date;
}

const transactions = [
    { id: 1, seller: "Ahmad", weight: 125, price: 5000, date: daysAgo(0) },
    { id: 2, seller: "Rahman", weight: 90, price: 5000, date: daysAgo(0) },
    { id: 3, seller: "Sulaiman", weight: 150, price: 5200, date: daysAgo(0) },
    { id: 4, seller: "Hasan", weight: 110, price: 5000, date: daysAgo(1) },
    { id: 5, seller: "Ibrahim", weight: 85, price: 5100, date: daysAgo(2) },
    { id: 6, seller: "Amir", weight: 130, price: 5000, date: daysAgo(3) },
    { id: 7, seller: "Usman", weight: 95, price: 5200, date: daysAgo(4) },
    { id: 8, seller: "Ismail", weight: 145, price: 5000, date: daysAgo(5) },
    { id: 9, seller: "Hasan", weight: 105, price: 5100, date: daysAgo(6) },
    { id: 10, seller: "Ahmad", weight: 120, price: 5000, date: daysAgo(7) },
    { id: 11, seller: "Rahman", weight: 100, price: 5000, date: daysAgo(8) },
    { id: 12, seller: "Sulaiman", weight: 140, price: 5200, date: daysAgo(9) }
];


/* FORMAT DATA */

function formatCurrency(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value);
}

function formatNumber(value) {
    return new Intl.NumberFormat("id-ID", {
        maximumFractionDigits: 1
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(date);
}

function isSameDay(date1, date2) {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}


/* TANGGAL HARI INI */

function updateDate() {
    const now = new Date();

    const currentDate = document.getElementById("currentDate");
    const currentDay = document.getElementById("currentDay");
    const currentYear = document.getElementById("currentYear");

    if (currentDate) {
        currentDate.textContent = new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(now);
    }

    if (currentDay) {
        currentDay.textContent = new Intl.DateTimeFormat("id-ID", {
            weekday: "long"
        }).format(now);
    }

    if (currentYear) {
        currentYear.textContent = now.getFullYear();
    }
}


/* STATISTIK HARI INI */

function updateStatistics() {
    const today = new Date();

    const todayTransactions = transactions.filter(transaction =>
        isSameDay(transaction.date, today)
    );

    const totalWeight = todayTransactions.reduce(
        (total, transaction) => total + transaction.weight,
        0
    );

    const totalPayment = todayTransactions.reduce(
        (total, transaction) =>
            total + (transaction.weight * transaction.price),
        0
    );

    const uniqueSellers = new Set(
        todayTransactions.map(transaction => transaction.seller)
    );

    document.getElementById("totalWeight").innerHTML =
        `${formatNumber(totalWeight)} <small>kg</small>`;

    document.getElementById("totalSellers").textContent =
        uniqueSellers.size;

    document.getElementById("totalTransactions").textContent =
        todayTransactions.length;

    document.getElementById("totalPayment").textContent =
        formatCurrency(totalPayment);
}


/* GRAFIK HASIL PANEN */

function renderChart(days = 7) {
    const chartContainer = document.getElementById("harvestChart");
    const chartTotal = document.getElementById("chartTotal");

    if (!chartContainer || !chartTotal) return;

    const chartData = [];

    for (let i = days - 1; i >= 0; i--) {
        const date = daysAgo(i);

        const dailyTransactions = transactions.filter(transaction =>
            isSameDay(transaction.date, date)
        );

        const total = dailyTransactions.reduce(
            (sum, transaction) => sum + transaction.weight,
            0
        );

        chartData.push({ date, total });
    }

    const totalWeight = chartData.reduce(
        (sum, item) => sum + item.total,
        0
    );

    chartTotal.textContent = `${formatNumber(totalWeight)} kg`;

    const maxValue = Math.max(
        ...chartData.map(item => item.total),
        1
    );

    chartContainer.innerHTML = "";

    chartData.forEach((item, index) => {
        const percentage = (item.total / maxValue) * 100;

        const label = days === 7
            ? new Intl.DateTimeFormat("id-ID", {
                weekday: "short"
            }).format(item.date)
            : new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "short"
            }).format(item.date);

        const column = document.createElement("div");
        column.className = "chart-column";

        const barArea = document.createElement("div");
        barArea.className = "chart-bar-area";

        const bar = document.createElement("div");
        bar.className = "chart-bar";

        if (isSameDay(item.date, new Date())) {
            bar.classList.add("highlight");
        }

        bar.style.height = `${percentage}%`;
        bar.style.animationDelay = `${index * 0.04}s`;
        bar.title = `${formatDate(item.date)}: ${formatNumber(item.total)} kg`;

        const dayLabel = document.createElement("span");
        dayLabel.className = "chart-day";
        dayLabel.textContent = label;

        barArea.appendChild(bar);
        column.appendChild(barArea);
        column.appendChild(dayLabel);

        chartContainer.appendChild(column);
    });
}


/* TRANSAKSI TERBARU */

function renderRecentTransactions() {
    const tableBody = document.getElementById("recentTransactions");
    const emptyState = document.getElementById("emptyState");
    const tableWrapper = document.querySelector(".table-wrapper");

    if (!tableBody || !emptyState || !tableWrapper) return;

    const recentTransactions = [...transactions]
        .sort((a, b) => b.date - a.date || b.id - a.id)
        .slice(0, 5);

    tableBody.innerHTML = "";

    if (recentTransactions.length === 0) {
        emptyState.hidden = false;
        tableWrapper.hidden = true;
        return;
    }

    emptyState.hidden = true;
    tableWrapper.hidden = false;

    recentTransactions.forEach(transaction => {
        const total = transaction.weight * transaction.price;
        const row = document.createElement("tr");

        const values = [
            transaction.seller,
            formatDate(transaction.date),
            `${formatNumber(transaction.weight)} kg`,
            formatCurrency(transaction.price),
            formatCurrency(total)
        ];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}


/* SIDEBAR MOBILE */

function initializeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const closeSidebar = document.getElementById("closeSidebar");
    const overlay = document.getElementById("sidebarOverlay");

    if (!sidebar || !menuToggle || !overlay) return;

    function openMenu() {
        sidebar.classList.add("show");
        overlay.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeMenu() {
        sidebar.classList.remove("show");
        overlay.classList.remove("show");
        document.body.style.overflow = "";
    }

    menuToggle.addEventListener("click", openMenu);
    closeSidebar?.addEventListener("click", closeMenu);
    overlay.addEventListener("click", closeMenu);

    document.querySelectorAll(".sidebar-nav a").forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeMenu();
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 650) closeMenu();
    });
}


/* FILTER GRAFIK */

function initializeChartFilter() {
    const chartFilter = document.getElementById("chartFilter");

    if (!chartFilter) return;

    chartFilter.addEventListener("change", event => {
        renderChart(Number(event.target.value));
    });
}


/* JALANKAN DASHBOARD */

function initializeDashboard() {
    updateDate();
    updateStatistics();
    renderChart(7);
    renderRecentTransactions();
    initializeSidebar();
    initializeChartFilter();
}

document.addEventListener("DOMContentLoaded", initializeDashboard);
