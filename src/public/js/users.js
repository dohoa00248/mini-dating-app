/* TOGGLE LIKE */
async function toggleLike(targetId, button) {
  try {
    const res = await fetch(`/users/${targetId}/toggle-like`, {
      method: 'POST',
    });

    const { success, action, isMatch } = await res.json();
    if (!success) return alert('Action failed');

    // 1️⃣ Update like button UI
    const liked = action === 'liked';
    button.classList.toggle('btn-danger', liked);
    button.classList.toggle('btn-outline-danger', !liked);
    button.textContent = liked ? '❤️ Liked' : '💖 Like';

    const card = document.querySelector(`.card[data-user-id="${targetId}"]`);
    if (!card) return;

    updateMatchUI(card, targetId, isMatch);
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
}

/* ======================================================
   UPDATE MATCH UI (label + schedule button)
====================================================== */
function updateMatchUI(card, targetId, isMatch) {
  const matchLabel = card.querySelector('.match-label');
  const scheduleBtn = card.querySelector('.schedule-btn');

  if (isMatch) {
    // Add match label
    if (!matchLabel) {
      const label = document.createElement('div');
      label.className = 'match-label';
      label.textContent = '💘 It’s a Match';
      card.prepend(label);
    }

    // Add schedule button
    if (!scheduleBtn) {
      const btn = document.createElement('button');
      btn.className = 'btn btn-success btn-sm schedule-btn mt-2 w-100';
      btn.textContent = '📅 Suggest a Date';
      btn.onclick = () =>
        (window.location.href = `/users/${targetId}/availability`);

      card.querySelector('.card-body').appendChild(btn);
    }

    showMatchPopup();
  } else {
    if (matchLabel) matchLabel.remove();
    if (scheduleBtn) scheduleBtn.remove();
  }
}

/* ======================================================
   MATCH POPUP EFFECT
====================================================== */
function showMatchPopup() {
  const popup = document.getElementById('matchPopup');
  if (!popup) return;

  popup.classList.add('show');
  setTimeout(() => popup.classList.remove('show'), 3000);
}

/* ======================================================
   LOAD LIKES (Modal)
====================================================== */
async function loadLikes() {
  await loadUserList({
    url: '/users/likes',
    modalId: 'likesModal',
    listId: 'likesList',
    loadingId: 'likesLoading',
    emptyId: 'likesEmpty',
  });
}

/* ======================================================
   LOAD MATCHES (Modal)
====================================================== */
async function loadMatches() {
  await loadUserList({
    url: '/users/matches',
    modalId: 'matchesModal',
    listId: 'matchesList',
    loadingId: 'matchesLoading',
    emptyId: 'matchesEmpty',
    isMatch: true,
  });
}

/* ======================================================
   GENERIC USER LIST LOADER (Reusable)
====================================================== */
async function loadUserList({
  url,
  modalId,
  listId,
  loadingId,
  emptyId,
  isMatch = false,
}) {
  const modal = new bootstrap.Modal(document.getElementById(modalId));
  const list = document.getElementById(listId);
  const loading = document.getElementById(loadingId);
  const empty = document.getElementById(emptyId);

  list.innerHTML = '';
  empty.classList.add('d-none');
  loading.classList.remove('d-none');
  modal.show();

  try {
    const res = await fetch(url);
    const { success, total, data } = await res.json();

    loading.classList.add('d-none');
    if (!success || total === 0) return empty.classList.remove('d-none');

    data.forEach((user) => list.appendChild(createUserCard(user, isMatch)));
  } catch (err) {
    console.error(err);
    loading.classList.add('d-none');
    empty.classList.remove('d-none');
  }
}

/* ======================================================
   CREATE USER CARD (Reusable)
====================================================== */
function createUserCard(user, isMatch = false) {
  const col = document.createElement('div');
  col.className = 'col-md-4';

  const card = document.createElement('div');
  card.className = `card shadow-sm text-center p-3 h-100 ${
    isMatch ? 'border-warning' : ''
  }`;

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

  card.append(avatar, name, bio);

  if (isMatch) {
    const badge = document.createElement('span');
    badge.className = 'badge bg-warning text-dark mt-2';
    badge.textContent = '💘 Match';
    card.appendChild(badge);
    slotBox = document.createElement('div');
    slotBox.className = 'mt-3';

    if (user.myProposedSlots && user.myProposedSlots.length > 0) {
      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };

      let slotHTML = `
        <div class="alert alert-info p-2 small text-start">
          <strong>📅 Your Proposed Time:</strong><br>
      `;

      user.myProposedSlots.forEach((slot) => {
        const start = new Date(slot.start);
        const end = new Date(slot.end);

        slotHTML += `
          ${start.toLocaleString('en-US', options)}
          <br>→ ${end.toLocaleString('en-US', options)}<br><br>
        `;
      });

      slotHTML += `</div>`;
      slotBox.innerHTML = slotHTML;
    } else {
      slotBox.innerHTML = `
        <div class="text-muted small">
          You haven’t proposed a time yet
        </div>
      `;
    }

    card.appendChild(slotBox);
  }

  col.appendChild(card);
  return col;
}
/* ======================================================
   LOAD CONFIRMED SCHEDULES
====================================================== */
async function loadSchedules() {
  const modal = new bootstrap.Modal(document.getElementById('scheduleModal'));

  const list = document.getElementById('scheduleList');
  const loading = document.getElementById('scheduleLoading');
  const empty = document.getElementById('scheduleEmpty');

  list.innerHTML = '';
  empty.classList.add('d-none');
  loading.classList.remove('d-none');

  modal.show();

  try {
    const res = await fetch('/users/schedules');
    const { success, total, data } = await res.json();

    loading.classList.add('d-none');

    if (!success || total === 0) {
      return empty.classList.remove('d-none');
    }

    data.forEach((user) => {
      const col = document.createElement('div');
      col.className = 'col-md-6';

      const card = document.createElement('div');
      card.className = 'card shadow-sm p-3 h-100';

      const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };

      const start = new Date(user.finalDate.start).toLocaleString(
        'vi-VN',
        options,
      );

      const end = new Date(user.finalDate.end).toLocaleString('vi-VN', options);

      card.innerHTML = `
        <h6 class="fw-bold">${user.name}, ${user.age}</h6>
        <p class="small text-muted">${user.bio || ''}</p>
        <div class="alert alert-success small">
          <strong>📅 Confirmed Date:</strong><br>
          ${start}<br>
          → ${end}
        </div>
      `;

      col.appendChild(card);
      list.appendChild(col);
    });
  } catch (err) {
    console.error(err);
    loading.classList.add('d-none');
    empty.classList.remove('d-none');
  }
}
/* ======================================================
   EXPORT TO GLOBAL (for onclick in EJS)
====================================================== */
window.toggleLike = toggleLike;
window.loadLikes = loadLikes;
window.loadMatches = loadMatches;
