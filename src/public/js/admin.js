document.addEventListener('DOMContentLoaded', () => {
  const addForm = document.getElementById('adminAddForm');

  if (addForm) {
    addForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(e.target));

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
  }

  //Show like and match
  const viewLikesButtons = document.querySelectorAll('.view-likes-btn');
  const likesModal = new bootstrap.Modal(document.getElementById('likesModal'));

  const likesLoading = document.getElementById('likesLoading');
  const likesEmpty = document.getElementById('likesEmpty');
  const likesList = document.getElementById('likesList');

  viewLikesButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const userId = button.dataset.id;

      likesModal.show();

      // Reset UI
      likesList.innerHTML = '';
      likesEmpty.classList.add('d-none');
      likesList.classList.add('d-none');

      // Show loading
      likesLoading.classList.remove('d-none');

      try {
        const response = await fetch(`/admin/users/${userId}/likes-detail`);
        const result = await response.json();

        likesLoading.classList.add('d-none');

        if (!result.success) {
          likesEmpty.textContent = result.message;
          likesEmpty.classList.remove('d-none');
          return;
        }

        if (result.total === 0) {
          likesEmpty.classList.remove('d-none');
          return;
        }

        // Show list
        likesList.classList.remove('d-none');

        result.data.forEach((u) => {
          const item = document.createElement('div');
          item.className = 'list-group-item';

          const name = document.createElement('div');
          name.className = 'fw-bold';
          name.textContent = u.name;

          const info = document.createElement('small');
          info.textContent = `${u.email} • ${u.gender} • ${u.age} yrs`;

          item.appendChild(name);
          item.appendChild(info);

          likesList.appendChild(item);
        });
      } catch (error) {
        console.error(error);
        likesLoading.classList.add('d-none');
        likesEmpty.textContent = 'Failed to load data.';
        likesEmpty.classList.remove('d-none');
      }
    });
  });
});
