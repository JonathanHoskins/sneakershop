// State
let allShoes = [];
let wishlistIds = new Set();
let currentFilter = 'all';

// Elements
const shoesGrid = document.getElementById('shoes-grid');
const navBtns = document.querySelectorAll('.nav-btn');
const modal = document.getElementById('emailModal');
const closeModal = document.querySelector('.close');
const emailInput = document.getElementById('emailInput');
const subscribeBtn = document.getElementById('subscribeBtn');
const modalShoeName = document.getElementById('modalShoeName');
const toast = document.getElementById('toast');

let selectedShoeForNotification = null;

// Initialize
init();

async function init() {
    await loadShoes();
    await loadWishlist();
    renderShoes();
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderShoes();
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    subscribeBtn.addEventListener('click', handleEmailSubscribe);
}

// API Calls
async function loadShoes() {
    try {
        const response = await fetch('/api/shoes');
        allShoes = await response.json();
    } catch (error) {
        showToast('Error loading shoes', 'error');
        console.error('Error:', error);
    }
}

async function loadWishlist() {
    try {
        const response = await fetch('/api/wishlist');
        const wishlistShoes = await response.json();
        wishlistIds = new Set(wishlistShoes.map(shoe => shoe.id));
    } catch (error) {
        console.error('Error loading wishlist:', error);
    }
}

async function toggleWishlist(shoeId) {
    const isInWishlist = wishlistIds.has(shoeId);
    
    try {
        if (isInWishlist) {
            const response = await fetch(`/api/wishlist/${shoeId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                wishlistIds.delete(shoeId);
                showToast('Removed from wishlist', 'success');
            }
        } else {
            const response = await fetch(`/api/wishlist/${shoeId}`, {
                method: 'POST'
            });
            if (response.ok) {
                wishlistIds.add(shoeId);
                showToast('Added to wishlist!', 'success');
            }
        }
        renderShoes();
    } catch (error) {
        showToast('Error updating wishlist', 'error');
        console.error('Error:', error);
    }
}

async function handleEmailSubscribe() {
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('Please enter an email address', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                shoeId: selectedShoeForNotification
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showToast(data.message, 'success');
            modal.style.display = 'none';
            emailInput.value = '';
        } else {
            showToast(data.error || 'Subscription failed', 'error');
        }
    } catch (error) {
        showToast('Error subscribing', 'error');
        console.error('Error:', error);
    }
}

// Rendering
function renderShoes() {
    let shoesToDisplay = [];
    
    if (currentFilter === 'all') {
        shoesToDisplay = allShoes;
    } else if (currentFilter === 'wishlist') {
        shoesToDisplay = allShoes.filter(shoe => wishlistIds.has(shoe.id));
    } else {
        shoesToDisplay = allShoes.filter(shoe => shoe.status === currentFilter);
    }
    
    if (shoesToDisplay.length === 0) {
        shoesGrid.innerHTML = `
            <div class="empty-state">
                <h3>😔</h3>
                <p>${currentFilter === 'wishlist' ? 'Your wishlist is empty' : 'No shoes found'}</p>
            </div>
        `;
        return;
    }
    
    shoesGrid.innerHTML = shoesToDisplay.map(shoe => createShoeCard(shoe)).join('');
    
    // Add event listeners to buttons
    shoesToDisplay.forEach(shoe => {
        const wishlistBtn = document.getElementById(`wishlist-${shoe.id}`);
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => toggleWishlist(shoe.id));
        }
        
        const notifyBtn = document.getElementById(`notify-${shoe.id}`);
        if (notifyBtn) {
            notifyBtn.addEventListener('click', () => openEmailModal(shoe));
        }
    });
}

function createShoeCard(shoe) {
    const isInWishlist = wishlistIds.has(shoe.id);
    const statusClass = `status-${shoe.status}`;
    
    let wishlistBtnText = isInWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist';
    let wishlistBtnClass = isInWishlist ? 'btn btn-success in-wishlist' : 'btn btn-secondary';
    
    let notifyButton = '';
    if (shoe.status === 'coming-soon') {
        notifyButton = `
            <button id="notify-${shoe.id}" class="btn btn-primary">
                🔔 Notify Me
            </button>
        `;
    }
    
    let releaseInfo = '';
    if (shoe.releaseDate) {
        releaseInfo = `<div class="release-date">📅 Release: ${shoe.releaseDate}</div>`;
    }
    
    return `
        <div class="shoe-card">
            <img src="${shoe.image}" alt="${shoe.name}" class="shoe-image">
            <h3 class="shoe-name">${shoe.name}</h3>
            <div class="shoe-price">$${shoe.price}</div>
            <span class="shoe-availability ${statusClass}">${shoe.availability}</span>
            ${releaseInfo}
            <div class="shoe-stores">
                <strong>Available at:</strong>
                ${shoe.stores.join(', ')}
            </div>
            <div class="shoe-actions">
                <button id="wishlist-${shoe.id}" class="${wishlistBtnClass}">
                    ${wishlistBtnText}
                </button>
                ${notifyButton}
            </div>
        </div>
    `;
}

// Modal
function openEmailModal(shoe) {
    selectedShoeForNotification = shoe.id;
    modalShoeName.textContent = `Get notified when ${shoe.name} releases on ${shoe.releaseDate}`;
    modal.style.display = 'block';
}

// Utilities
function isValidEmail(email) {
    // More robust email validation regex
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(email);
}

function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}
