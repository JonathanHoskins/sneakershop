// State
let allShoes = [];
let wishlistIds = new Set();
let currentFilter = 'all';
let currentUser = null;

// Elements
const shoesGrid = document.getElementById('shoes-grid');
const navBtns = document.querySelectorAll('.nav-btn');
const modal = document.getElementById('emailModal');
const closeModal = document.querySelector('.close');
const emailInput = document.getElementById('emailInput');
const subscribeBtn = document.getElementById('subscribeBtn');
const modalShoeName = document.getElementById('modalShoeName');
const toast = document.getElementById('toast');

// Auth elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const closeLoginModal = document.querySelector('.close-login');
const closeRegisterModal = document.querySelector('.close-register');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const authSection = document.getElementById('authSection');
const userSection = document.getElementById('userSection');
const userEmail = document.getElementById('userEmail');

let selectedShoeForNotification = null;

// Initialize
init();

async function init() {
    await checkAuthStatus();
    await loadShoes();
    if (currentUser) {
        await loadWishlist();
    }
    renderShoes();
    setupEventListeners();
}

// Check authentication status
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/auth/status');
        const data = await response.json();
        if (data.authenticated) {
            currentUser = data.user;
            updateAuthUI();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
    }
}

// Update UI based on auth state
function updateAuthUI() {
    if (currentUser) {
        loginBtn.style.display = 'none';
        registerBtn.style.display = 'none';
        userSection.style.display = 'flex';
        userEmail.textContent = currentUser.email;
    } else {
        loginBtn.style.display = 'inline-block';
        registerBtn.style.display = 'inline-block';
        userSection.style.display = 'none';
    }
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

    closeLoginModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    closeRegisterModal.addEventListener('click', () => {
        registerModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === registerModal) {
            registerModal.style.display = 'none';
        }
    });

    subscribeBtn.addEventListener('click', handleEmailSubscribe);
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });
    registerBtn.addEventListener('click', () => {
        registerModal.style.display = 'block';
    });
    logoutBtn.addEventListener('click', handleLogout);
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
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
    if (!currentUser) {
        wishlistIds = new Set();
        return;
    }
    
    try {
        const response = await fetch('/api/wishlist');
        if (response.status === 401) {
            // User not authenticated
            wishlistIds = new Set();
            return;
        }
        const wishlistShoes = await response.json();
        wishlistIds = new Set(wishlistShoes.map(shoe => shoe.id));
    } catch (error) {
        console.error('Error loading wishlist:', error);
        wishlistIds = new Set();
    }
}

async function toggleWishlist(shoeId) {
    if (!currentUser) {
        showToast('Please login to use the wishlist', 'error');
        loginModal.style.display = 'block';
        return;
    }
    
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
    
    // Create clickable store links
    let storeLinks = '';
    if (shoe.stores && shoe.stores.length > 0) {
        storeLinks = shoe.stores.map(store => {
            if (typeof store === 'object' && store.name && store.url) {
                return `<a href="${store.url}" target="_blank" rel="noopener noreferrer" class="store-link">${store.name}</a>`;
            } else {
                // Fallback for plain text store names
                return `<span class="store-name">${store}</span>`;
            }
        }).join(' ');
    }
    
    return `
        <div class="shoe-card">
            <img src="${shoe.image}" alt="${shoe.name}" class="shoe-image" onerror="this.src='https://via.placeholder.com/300x200/CCCCCC/FFFFFF?text=Image+Not+Available'">
            <h3 class="shoe-name">${shoe.name}</h3>
            <div class="shoe-price">$${shoe.price}</div>
            <span class="shoe-availability ${statusClass}">${shoe.availability}</span>
            ${releaseInfo}
            <div class="shoe-stores">
                <strong>🛒 Buy from:</strong><br>
                ${storeLinks}
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

// Authentication handlers
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            updateAuthUI();
            loginModal.style.display = 'none';
            loginForm.reset();
            showToast('Login successful!', 'success');
            await loadWishlist();
            renderShoes();
        } else {
            showToast(data.error || 'Login failed', 'error');
        }
    } catch (error) {
        showToast('Login failed', 'error');
        console.error('Error:', error);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showToast('Please enter a valid email', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            updateAuthUI();
            registerModal.style.display = 'none';
            registerForm.reset();
            showToast('Registration successful!', 'success');
            await loadWishlist();
            renderShoes();
        } else {
            showToast(data.error || 'Registration failed', 'error');
        }
    } catch (error) {
        showToast('Registration failed', 'error');
        console.error('Error:', error);
    }
}

async function handleLogout() {
    try {
        const response = await fetch('/api/auth/logout', {
            method: 'POST'
        });
        
        if (response.ok) {
            currentUser = null;
            wishlistIds = new Set();
            updateAuthUI();
            showToast('Logged out successfully', 'success');
            renderShoes();
        }
    } catch (error) {
        showToast('Logout failed', 'error');
        console.error('Error:', error);
    }
}
