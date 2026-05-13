const modal = document.getElementById('joinModal');
const joinButtons = document.querySelectorAll('a[href="#join"]');
const closeButtons = document.querySelectorAll('[data-close-modal]');
const registrationForm = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const formFeedback = document.getElementById('formFeedback');
const modalMessage = document.getElementById('modalMessage');
const waitingPopup = document.getElementById('waitingPopup');
const waitingPopupCopy = document.getElementById('waitingPopupCopy');

let modalHideTimer = null;
let waitPollTimer = null;

function openModal() {
  if (modalHideTimer) {
    clearTimeout(modalHideTimer);
    modalHideTimer = null;
  }

  closeWaitingPopup();
  modal.classList.remove('hidden');
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  modalHideTimer = setTimeout(() => {
    modal.classList.add('hidden');
    modalHideTimer = null;
  }, 180);
}

function openWaitingPopup(message) {
  waitingPopupCopy.textContent = message;
  waitingPopup.classList.remove('hidden');
  waitingPopup.setAttribute('aria-hidden', 'false');
}

function closeWaitingPopup() {
  waitingPopup.classList.add('hidden');
  waitingPopup.setAttribute('aria-hidden', 'true');
}

function stopWaitingPoll() {
  if (waitPollTimer) {
    clearInterval(waitPollTimer);
    waitPollTimer = null;
  }
}

async function loadStatus() {
  const response = await fetch('/api/status');
  return response.json();
}

joinButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    openModal();
  });
});

closeButtons.forEach((button) => {
  button.addEventListener('click', closeModal);
});

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeModal();
  }
});

registrationForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();

  if (!fullName || !email || !phone) {
    formFeedback.textContent = 'Please complete all three fields.';
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  formFeedback.textContent = '';

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName, email, phone })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Registration failed');
    }

    if (result.status && result.status.isLive) {
      stopWaitingPoll();
      closeWaitingPopup();

      const meetingUrl = new URL('/meeting.html', window.location.origin);
      meetingUrl.searchParams.set('name', fullName);
      meetingUrl.searchParams.set('mn', result.meetingNumber || '');
      meetingUrl.searchParams.set('pwd', result.meetingPassword || '');
      meetingUrl.searchParams.set('role', '0');
      window.location.assign(meetingUrl.toString());
      return;
    }

    registrationForm.reset();
    closeModal();
    openWaitingPopup('Kindly wait for the meeting to start.');
    stopWaitingPoll();
  } catch (error) {
    formFeedback.textContent = error.message || 'Something went wrong. Please try again.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit & Continue';
  }
});

loadStatus().catch(() => {
  // Status is only used for live-vs-waiting checks; failing closed keeps the form usable.
});