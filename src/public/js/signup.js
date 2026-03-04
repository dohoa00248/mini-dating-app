document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    age: document.getElementById('age').value,
    gender: document.getElementById('gender').value,
    bio: document.getElementById('bio').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };

  const errorDiv = document.getElementById('errorMessage');

  try {
    const response = await fetch('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      window.location.href = '/auth/login';
    } else {
      errorDiv.textContent = result.message;
      errorDiv.style.display = 'block';
    }
  } catch (err) {
    errorDiv.textContent = 'Something went wrong';
    errorDiv.style.display = 'block';
  }
});
