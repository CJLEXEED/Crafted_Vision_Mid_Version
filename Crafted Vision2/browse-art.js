// Art Collection Management
let artCollection = [];

document.addEventListener('DOMContentLoaded', () => {
    loadArtCollection();
    updateCartCount();
    displayArt(artCollection);
});

function loadArtCollection() {
    const savedCollection = localStorage.getItem('artCollection');
    artCollection = savedCollection ? JSON.parse(savedCollection) : [];
}

function searchArt() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('artCategory').value;
    
    const filteredArt = artCollection.filter(art => {
        const matchesSearch = art.title.toLowerCase().includes(searchTerm) || 
                            art.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === 'all' || art.category === category;
        return matchesSearch && matchesCategory;
    });

    displayArt(filteredArt);
}

function displayArt(artworks) {
    const grid = document.querySelector('.art-grid');
    const noResults = document.getElementById('noResults');
    
    if (artworks.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'flex';
        return;
    }

    noResults.style.display = 'none';
    grid.innerHTML = artworks.map(art => `
        <div class="art-card" onclick="openModal('${art.id}')">
            <div class="art-image">
                <img src="${art.imageUrl}" alt="${art.title}">
                <div class="art-overlay">
                    <span class="view-details">View Details</span>
                </div>
            </div>
            <div class="art-info">
                <h3>${art.title}</h3>
                <p class="artist-name">${art.artist}</p>
                <p class="price">$${art.price}</p>
            </div>
        </div>
    `).join('');
}

function openModal(artId) {
    const art = artCollection.find(a => a.id === artId);
    if (!art) return;

    document.getElementById('modalImage').src = art.imageUrl;
    document.getElementById('modalTitle').textContent = art.title;
    document.getElementById('modalArtist').textContent = art.artist;
    document.getElementById('modalPrice').textContent = art.price;
    document.getElementById('modalDescription').textContent = art.description;
    
    document.getElementById('artModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('artModal').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function addToCart() {
    const dimensions = document.getElementById('modalDimensions').value;
    // Add to cart logic here
    updateCartCount();
    
    // Show success message
    showNotification('Added to cart successfully!', 'success');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cartCount').textContent = cart.length;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function sortArtworks() {
    const sortBy = document.getElementById('sortBy').value;
    
    switch(sortBy) {
        case 'newest':
            artCollection.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'priceAsc':
            artCollection.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'priceDesc':
            artCollection.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'nameAsc':
            artCollection.sort((a, b) => a.title.localeCompare(b.title));
            break;
    }
    
    displayArt(artCollection);
}

function joinDiscussion() {
    // Implement discussion functionality
    window.location.href = 'community.html';
}