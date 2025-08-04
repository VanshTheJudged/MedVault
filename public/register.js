document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const res = await fetch('https://medvault-production.up.railway.app/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });

  const data = await res.json();
  if (res.ok) {
    alert('Registration successful. You can now log in.');
    window.location.href = 'login.html';
  } else {
    alert('Registration failed: ' + data.message);
  }
});
