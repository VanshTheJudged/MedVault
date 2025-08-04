document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const res = await fetch('https://medvault-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        alert('Login successful');
        window.location.href = 'home.html';
      } else {
        alert('Login failed: ' + data.message);
      }
    });