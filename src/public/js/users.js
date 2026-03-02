// ===============================
// TOGGLE LIKE
// ===============================
async function toggleLike(targetId, button) {
  try {
    const res = await fetch(`/users/${targetId}/toggle-like`, {
      method: 'POST',
    });

    const result = await res.json();

    if (!result.success) {
      alert('Error occurred');
      return;
    }

    // Update button UI
    if (result.action === 'liked') {
      button.classList.remove('btn-outline-danger');
      button.classList.add('btn-danger');
      button.innerText = '❤️ Liked';
    } else {
      button.classList.remove('btn-danger');
      button.classList.add('btn-outline-danger');
      button.innerText = '💖 Like';
    }

    const card = document.querySelector(`.card[data-user-id="${targetId}"]`);

    if (!card) return;

    let matchLabel = card.querySelector('.match-label');

    if (result.isMatch) {
      if (!matchLabel) {
        const label = document.createElement('div');
        label.className = 'match-label';
        label.innerText = '💘 It’s a Match';
        card.prepend(label);
      }

      const popup = document.getElementById('matchPopup');
      if (popup) {
        popup.style.display = 'block';
        setTimeout(() => (popup.style.display = 'none'), 3000);
      }
    } else {
      if (matchLabel) {
        matchLabel.remove();
      }
    }
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
}

// ===============================
// LOAD LIKES
// ===============================
async function loadLikes() {
  const modalEl = document.getElementById('likesModal');
  const modal = new bootstrap.Modal(modalEl);

  const loading = document.getElementById('likesLoading');
  const empty = document.getElementById('likesEmpty');
  const list = document.getElementById('likesList');

  list.innerHTML = '';
  empty.classList.add('d-none');
  loading.classList.remove('d-none');

  modal.show();

  try {
    const res = await fetch('/users/likes-detail');
    const result = await res.json();

    loading.classList.add('d-none');

    if (!result.success || result.total === 0) {
      empty.classList.remove('d-none');
      return;
    }

    result.data.forEach((user) => {
      const col = document.createElement('div');
      col.className = 'col-md-4';

      const card = document.createElement('div');
      card.className = 'card shadow-sm text-center p-3 h-100';

      const avatar = document.createElement('div');
      avatar.style.fontSize = '40px';
      avatar.textContent =
        user.gender === 'Male' ? '👨' : user.gender === 'Female' ? '👩' : '👤';

      const name = document.createElement('h6');
      name.className = 'fw-bold mt-2';
      name.textContent = `${user.name}, ${user.age}`;

      const bio = document.createElement('p');
      bio.className = 'small text-muted';
      bio.textContent = user.bio || 'No bio';

      card.appendChild(avatar);
      card.appendChild(name);
      card.appendChild(bio);
      col.appendChild(card);
      list.appendChild(col);
    });
  } catch (err) {
    console.error(err);
    loading.classList.add('d-none');
    empty.classList.remove('d-none');
  }
}

// ===============================
// LOAD MATCHES
// ===============================
async function loadMatches() {
  const modalEl = document.getElementById('matchesModal');
  const modal = new bootstrap.Modal(modalEl);

  const loading = document.getElementById('matchesLoading');
  const empty = document.getElementById('matchesEmpty');
  const list = document.getElementById('matchesList');

  list.innerHTML = '';
  empty.classList.add('d-none');
  loading.classList.remove('d-none');

  modal.show();

  try {
    const res = await fetch('/users/matches-detail');
    const result = await res.json();

    loading.classList.add('d-none');

    if (!result.success || result.total === 0) {
      empty.classList.remove('d-none');
      return;
    }

    result.data.forEach((user) => {
      const col = document.createElement('div');
      col.className = 'col-md-4';

      const card = document.createElement('div');
      card.className = 'card shadow-sm text-center p-3 h-100 border-warning';

      const avatar = document.createElement('div');
      avatar.className = 'mb-2 fs-1';
      avatar.textContent =
        user.gender === 'Male' ? '👨' : user.gender === 'Female' ? '👩' : '👤';

      const name = document.createElement('h6');
      name.className = 'fw-bold';
      name.textContent = `${user.name}, ${user.age}`;

      const bio = document.createElement('p');
      bio.className = 'small text-muted';
      bio.textContent = user.bio || 'No bio';

      const badge = document.createElement('span');
      badge.className = 'badge bg-warning text-dark mt-2';
      badge.innerText = '💘 Match';

      card.appendChild(avatar);
      card.appendChild(name);
      card.appendChild(bio);
      card.appendChild(badge);

      col.appendChild(card);
      list.appendChild(col);
    });
  } catch (err) {
    console.error(err);
    loading.classList.add('d-none');
    empty.classList.remove('d-none');
  }
}

// ===============================
// MAKE FUNCTIONS GLOBAL (for onclick)
// ===============================
window.toggleLike = toggleLike;
window.loadLikes = loadLikes;
window.loadMatches = loadMatches;
