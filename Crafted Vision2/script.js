// JavaScript for Art Marketplace

// Add event listener to the form submission
document.getElementById("artForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from refreshing the page

    // Get form input values
    const artTitle = document.getElementById("artTitle").value;
    const artDescription = document.getElementById("artDescription").value;
    const artPrice = document.getElementById("artPrice").value;

    // Mock API call to save the art details
    // Replace '/api/addArt' with your backend API endpoint
    fetch('/api/addArt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: artTitle,
            description: artDescription,
            price: artPrice,
            image: 'https://via.placeholder.com/200', // Placeholder for art image
        }),
    })
    .then(response => {
        if (response.ok) {
            alert('Art Added Successfully!');
            // Clear the form fields
            document.getElementById("artForm").reset();
            // Fetch and display the updated art collection
            fetchArt();
        } else {
            alert('Failed to add art. Please try again.');
        }
    })
    .catch(err => {
        console.error('Error adding art:', err);
        alert('An error occurred while adding art.');
    });
});

// Function to fetch and display art from the API
function fetchArt() {
    // Mock API call to fetch art details
    // Replace '/api/getArt' with your backend API endpoint
    fetch('/api/getArt')
        .then(response => response.json())
        .then(artData => {
            const grid = document.getElementById('artGrid');
            grid.innerHTML = ''; // Clear the grid before adding new items

            // Loop through the fetched art data and create art cards
            artData.forEach(art => {
                const artCard = document.createElement('div');
                artCard.innerHTML = `
                    <img src="${art.image}" alt="${art.title}">
                    <h3>${art.title}</h3>
                    <p>${art.description}</p>
                    <p><strong>Price:</strong> $${art.price}</p>
                `;
                grid.appendChild(artCard);
            });
        })
        .catch(err => {
            console.error('Error fetching art:', err);
            alert('An error occurred while fetching art.');
        });
}

// Fetch art data on page load
fetchArt();
