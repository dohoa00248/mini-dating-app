document
  .getElementById('adminAddForm')
  .addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));

    // Thêm loading state
    const btn = e.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = 'Creating...';
    btn.disabled = true;

    try {
      const response = await fetch('/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        location.reload();
      } else {
        alert('Error: ' + result.message);
        btn.innerText = originalText;
        btn.disabled = false;
      }
    } catch (err) {
      console.error(err);
      btn.innerText = originalText;
      btn.disabled = false;
    }
  });
