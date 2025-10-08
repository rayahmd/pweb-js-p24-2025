// Get form elements
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const signinBtn = document.getElementById('signin-btn');
const errorMessage = document.getElementById('error-message');
const successMessage = document.getElementById('success-message');

// Function to show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  successMessage.classList.remove('show');
  
  setTimeout(() => {
    errorMessage.classList.remove('show');
  }, 5000);
}

// Function to show success message
function showSuccess(message) {
  successMessage.textContent = message;
  successMessage.classList.add('show');
  errorMessage.classList.remove('show');
}

// Function to set loading state
function setLoading(isLoading) {
  if (isLoading) {
    signinBtn.classList.add('loading');
    signinBtn.disabled = true;
    usernameInput.disabled = true;
    passwordInput.disabled = true;
  } else {
    signinBtn.classList.remove('loading');
    signinBtn.disabled = false;
    usernameInput.disabled = false;
    passwordInput.disabled = false;
  }
}

// Function to fetch all users from API
async function fetchUsers() {
  try {
    const response = await fetch('https://dummyjson.com/users');
    
    if (!response.ok) {
      throw new Error('Failed to fetch users from API');
    }
    
    const data = await response.json();
    return data.users;
  } catch (error) {
    throw new Error('Network error: Unable to connect to authentication server');
  }
}

// Function to validate login
async function validateLogin(username, password) {
  // Check if password is empty
  if (!password || password.trim() === '') {
    throw new Error('Password cannot be empty');
  }
  
  // Fetch users from API
  const users = await fetchUsers();
  
  // Find user with matching username or email
  const user = users.find(u => u.username === username || u.email === username);
  
  if (!user) {
    throw new Error('Invalid username or email. User not found.');
  }
  
  // Validate password matches
  if (user.password !== password) {
    throw new Error('Invalid password. Please try again.');
  }
  
  // Return user data if found and password matches
  return user;
}

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Get input values
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  
  // Clear previous messages
  errorMessage.classList.remove('show');
  successMessage.classList.remove('show');
  
  // Set loading state
  setLoading(true);
  
  try {
    // Validate login
    const user = await validateLogin(username, password);
    
    // Show success message
    showSuccess('Login successful! Redirecting to recipes...');
    
    // Save firstName to localStorage
    localStorage.setItem('firstName', user.firstName);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userEmail', user.email);
    
    // Redirect to recipes page after 1.5 seconds
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
    
  } catch (error) {
    // Show error message
    showError(error.message);
    setLoading(false);
  }
});

// Clear error message when user starts typing
usernameInput.addEventListener('input', () => {
  errorMessage.classList.remove('show');
});

passwordInput.addEventListener('input', () => {
  errorMessage.classList.remove('show');
});
