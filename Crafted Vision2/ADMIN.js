// Add this function for login redirection
function redirectToLogin() {
    window.location.href = 'Login.html';
}

// Add near the top with other utility functions
function logout() {
    try {
        // Clear admin session
        localStorage.removeItem('adminSession');
        // Clear artwork data
        localStorage.removeItem(localStorageKey);
        // Redirect to login page
        Swal.fire({
            icon: 'success',
            title: 'Logged Out',
            text: 'You have been successfully logged out',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            redirectToLogin();
        });
    } catch (error) {
        showError('Failed to logout');
    }
}

// Add to your initialization code
document.addEventListener('DOMContentLoaded', async function() {
    try {
        showLoader();
        if (checkAdminSession()) {
            await loadDashboardData();
            initializeCharts();
            initializeTableControls();
            await loadArtworks();
            
            // Add logout button event listener
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', logout);
            }
        } else {
            redirectToLogin();
        }
    } catch (error) {
        showError('Failed to initialize dashboard');
    } finally {
        hideLoader();
    }
});

//------------------------------------------------//
// Global variables
let currentSection = 'dashboard';
const localStorageKey = 'artworkData';
const transactionKey = 'transactions';
const userKey = 'users';
const settingsKey = 'siteSettings';

// Initialize dashboard when page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        showLoader();
        if (checkAdminSession()) {
            await loadDashboardData();
            initializeCharts();
            setupEventListeners();
            await loadAllData();
        } else {
            redirectToLogin();
        }
    } catch (error) {
        showError('Failed to initialize dashboard');
    } finally {
        hideLoader();
    }
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = e.target.getAttribute('href').substring(1);
            switchSection(section);
        });
    });

    // Search and Filters
    document.getElementById('artworkSearch')?.addEventListener('input', filterArtworks);
    document.getElementById('categoryFilter')?.addEventListener('change', filterArtworks);
    document.getElementById('transactionDateFilter')?.addEventListener('change', filterTransactions);
    document.getElementById('transactionStatusFilter')?.addEventListener('change', filterTransactions);

    // Settings Form
    document.getElementById('settingsForm')?.addEventListener('submit', saveSettings);
}

// Dashboard Data Loading
async function loadDashboardData() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const artworks = await fetchArtworks();
    const transactions = await fetchTransactions();
    const users = await fetchUsers();

    // Update stats
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalArtworks').textContent = artworks.length;
    document.getElementById('totalSales').textContent = calculateTotalSales(transactions);
    document.getElementById('activeUsers').textContent = users.filter(u => u.status === 'Active').length;

    updateCharts(transactions, artworks);
}

// Chart Initialization
function initializeCharts() {
    initSalesChart();
    initCategoryChart();
}

function initSalesChart() {
    const ctx = document.getElementById('salesChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: getLastSixMonths(),
            datasets: [{
                label: 'Monthly Sales',
                data: [0, 0, 0, 0, 0, 0],
                borderColor: '#2ecc71',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Artwork Management
async function loadArtworks() {
    const artworks = await fetchArtworks();
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Combine cart data with artwork data
    const combinedArtworks = artworks.map(art => {
        const cartItem = cart.find(item => item.id === art.id);
        return {
            ...art,
            inCart: !!cartItem
        };
    });

    displayArtworks(combinedArtworks);
}

async function addNewArtwork() {
    const { value: formData } = await Swal.fire({
        title: 'Add New Artwork',
        html: `
            <input id="artTitle" class="swal2-input" placeholder="Title">
            <input id="artArtist" class="swal2-input" placeholder="Artist">
            <input id="artPrice" class="swal2-input" placeholder="Price">
            <select id="artCategory" class="swal2-input">
                <option value="Painting">Painting</option>
                <option value="Digital">Digital Art</option>
                <option value="Photography">Photography</option>
            </select>
            <input type="file" id="artImage" class="swal2-file" accept="image/*">
        `,
        focusConfirm: false,
        preConfirm: () => ({
            title: document.getElementById('artTitle').value,
            artist: document.getElementById('artArtist').value,
            price: document.getElementById('artPrice').value,
            category: document.getElementById('artCategory').value,
            image: document.getElementById('artImage').files[0]
        })
    });

    if (formData) {
        await saveNewArtwork(formData);
    }
}

// Transaction Management
async function loadTransactions() {
    const transactions = await fetchTransactions();
    displayTransactions(transactions);
}

function displayTransactions(transactions) {
    const tbody = document.getElementById('transactionTable');
    if (!tbody) return;

    tbody.innerHTML = transactions.map(trans => `
        <tr>
            <td>${trans.id}</td>
            <td>${new Date(trans.date).toLocaleDateString()}</td>
            <td>${trans.customer}</td>
            <td>${trans.artwork}</td>
            <td>${trans.amount}</td>
            <td>
                <span class="badge badge-${getStatusColor(trans.status)}">
                    ${trans.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-info" onclick="viewTransaction(${trans.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Report Generation
async function generateReport() {
    const type = document.getElementById('reportType').value;
    const transactions = await fetchTransactions();
    const reportData = generateReportData(transactions, type);
    displayReport(reportData);
}

// Settings Management
async function saveSettings(e) {
    e.preventDefault();
    const settings = {
        siteTitle: document.getElementById('siteTitle').value,
        adminEmail: document.getElementById('adminEmail').value,
        currency: document.getElementById('currency').value,
        maintenanceMode: document.getElementById('maintenanceMode').checked
    };

    try {
        localStorage.setItem(settingsKey, JSON.stringify(settings));
        showSuccess('Settings saved successfully');
    } catch (error) {
        showError('Failed to save settings');
    }
}

// Utility Functions
function showLoader() {
    Swal.fire({
        title: 'Loading...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });
}

function hideLoader() {
    Swal.close();
}

function showError(message) {
    Swal.fire({
        icon: 'error',
        title: 'Error',
        text: message
    });
}

function showSuccess(message) {
    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: message,
        timer: 2000,
        showConfirmButton: false
    });
}

function getStatusColor(status) {
    const colors = {
        completed: 'success',
        pending: 'warning',
        cancelled: 'danger'
    };
    return colors[status.toLowerCase()] || 'secondary';
}

function getLastSixMonths() {
    const months = [];
    const current = new Date();
    for (let i = 5; i >= 0; i--) {
        const month = new Date(current.getFullYear(), current.getMonth() - i, 1);
        months.push(month.toLocaleString('default', { month: 'short' }));
    }
    return months;
}

// Data Fetching Functions
async function fetchArtworks() {
    const stored = localStorage.getItem(localStorageKey);
    return stored ? JSON.parse(stored) : [];
}

async function fetchTransactions() {
    const stored = localStorage.getItem(transactionKey);
    return stored ? JSON.parse(stored) : [];
}

async function fetchUsers() {
    const stored = localStorage.getItem(userKey);
    return stored ? JSON.parse(stored) : [];
}

// Initialize all data
async function loadAllData() {
    await Promise.all([
        loadArtworks(),
        loadTransactions(),
        loadUsers()
    ]);
}