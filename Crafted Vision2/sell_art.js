// Initialize page elements and event listeners
document.addEventListener('DOMContentLoaded', function() {
    initializeForm();
    loadArtistData();
    setupImageUpload();
    setupFormValidation();
});

function initializeForm() {
    const form = document.getElementById('sellArtForm');
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('artImage');
    const imagePreview = document.getElementById('imagePreview');

    // Price calculation based on category and options
    document.getElementById('artCategory').addEventListener('change', calculatePrice);
    document.getElementById('allowPrints').addEventListener('change', calculatePrice);
    document.getElementById('isOriginal').addEventListener('change', calculatePrice);
}

function loadArtistData() {
    const artistName = localStorage.getItem('artistName') || 'Guest Artist';
    const profilePic = localStorage.getItem('profilePic') || 'default-profile.jpg';
    const artworksCount = JSON.parse(localStorage.getItem('artCollection'))?.length || 0;
    const averageRating = calculateAverageRating();

    document.getElementById('artistNameDisplay').textContent = artistName;
    document.getElementById('profilePic').src = profilePic;
    document.getElementById('artworksCount').textContent = artworksCount;
    document.getElementById('averageRating').textContent = averageRating.toFixed(1);
}

function setupImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('artImage');

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length) {
            handleImageUpload(files[0]);
        }
    });

    imageInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleImageUpload(e.target.files[0]);
        }
    });
}

function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('imagePreviewImg').src = e.target.result;
        document.getElementById('imagePreview').style.display = 'block';
        document.getElementById('uploadArea').style.display = 'none';
    };
    reader.readAsDataURL(file);
}

function removeImage() {
    document.getElementById('artImage').value = '';
    document.getElementById('imagePreviewImg').src = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('uploadArea').style.display = 'block';
}

function calculatePrice() {
    const category = document.getElementById('artCategory').value;
    const allowPrints = document.getElementById('allowPrints').checked;
    const isOriginal = document.getElementById('isOriginal').checked;

    let basePrice = 50;
    
    // Category-based pricing
    const categoryPrices = {
        'painting': 100,
        'sculpture': 150,
        'digitalArts': 75,
        'photography': 60,
        'oilPainting': 120,
        'waterPainting': 90
    };

    basePrice = categoryPrices[category] || basePrice;

    // Adjustments
    if (isOriginal) basePrice *= 2;
    if (allowPrints) basePrice *= 1.5;

    document.getElementById('artPrice').value = Math.round(basePrice);
}

function setupFormValidation() {
    const form = document.getElementById('sellArtForm');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        if (!form.checkValidity()) {
            event.stopPropagation();
            showToast('Please fill in all required fields', 'error');
            return;
        }

        submitArtwork();
    });
}

function submitArtwork() {
    const formData = {
        title: document.getElementById('artTitle').value,
        description: document.getElementById('artDescription').value,
        category: document.getElementById('artCategory').value,
        price: document.getElementById('artPrice').value,
        allowPrints: document.getElementById('allowPrints').checked,
        isOriginal: document.getElementById('isOriginal').checked,
        image: document.getElementById('imagePreviewImg').src,
        timestamp: Date.now()
    };

    let artCollection = JSON.parse(localStorage.getItem('artCollection')) || [];
    artCollection.push(formData);
    localStorage.setItem('artCollection', JSON.stringify(artCollection));

    showToast('Artwork submitted successfully!', 'success');
    document.getElementById('sellArtForm').reset();
    removeImage();
}

function calculateAverageRating() {
    const artCollection = JSON.parse(localStorage.getItem('artCollection')) || [];
    if (!artCollection.length) return 0;

    const totalRating = artCollection.reduce((sum, art) => sum + (art.rating || 0), 0);
    return totalRating / artCollection.length;
}

function showToast(message, type = 'info') {
    const toast = new bootstrap.Toast(document.getElementById('toast'));
    const toastBody = document.querySelector('.toast-body');
    const toast_element = document.getElementById('toast');
    
    toast_element.className = `toast ${type}`;
    toastBody.textContent = message;
    toast.show();
}

// Profile picture upload handling
document.getElementById('profilePicUpload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('profilePic').src = e.target.result;
            localStorage.setItem('profilePic', e.target.result);
            showToast('Profile picture updated successfully!', 'success');
        };
        reader.readAsDataURL(file);
    }
});