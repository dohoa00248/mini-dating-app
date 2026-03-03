document.addEventListener('DOMContentLoaded', function () {
  var addBtn = document.getElementById('add-slot');
  var container = document.getElementById('slot-container');
  var form = document.getElementById('availability-form');
  var notification = document.getElementById('notification');

  function showNotification(message, type) {
    notification.className = 'alert text-center';
    notification.classList.add('alert-' + type);
    notification.textContent = message;
    notification.classList.remove('d-none');

    setTimeout(function () {
      notification.classList.add('d-none');
    }, 3000);
  }

  if (addBtn) {
    addBtn.addEventListener('click', function () {
      var firstSlot = document.querySelector('.slot-item');
      if (!firstSlot) return;

      var clone = firstSlot.cloneNode(true);
      var inputs = clone.querySelectorAll('input');

      for (var i = 0; i < inputs.length; i++) {
        inputs[i].value = '';
      }

      var removeBtn = clone.querySelector('.remove-slot');
      if (removeBtn) {
        removeBtn.classList.remove('d-none');
      }

      container.appendChild(clone);
    });
  }

  if (container) {
    container.addEventListener('click', function (e) {
      if (e.target.classList.contains('remove-slot')) {
        var slotItem = e.target.closest('.slot-item');
        if (slotItem) {
          slotItem.remove();
        }
      }
    });
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var dates = document.getElementsByName('date[]');
      var froms = document.getElementsByName('from[]');
      var tos = document.getElementsByName('to[]');

      var slots = [];

      for (var i = 0; i < dates.length; i++) {
        if (dates[i].value && froms[i].value && tos[i].value) {
          slots.push({
            start: dates[i].value + 'T' + froms[i].value,
            end: dates[i].value + 'T' + tos[i].value,
          });
        }
      }

      fetch(window.location.pathname, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots: slots }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          if (data.success) {
            showNotification(data.message, 'success');
            if (data.data && data.data.start) {
              form.remove();
            }
          } else {
            showNotification(data.message, 'danger');
          }
        })
        .catch(function () {
          showNotification('Server error. Please try again.', 'danger');
        });
    });
  }
});
