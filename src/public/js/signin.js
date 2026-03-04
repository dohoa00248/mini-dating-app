document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('errorMessage');

  try {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = result.data.redirectTo;
    } else {
      errorDiv.textContent = result.message;
      errorDiv.style.display = 'block';
    }
  } catch (error) {
    console.error(error);
    alert('Something went wrong. Please try again.');
  }
});
