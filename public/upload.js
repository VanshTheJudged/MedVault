document.getElementById('uploadForm').addEventListener('submit', async (e) => {e.preventDefault();

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first');
        return;
      }

      const formData = new FormData();
      formData.append('report', document.getElementById('report').files[0]);

      const res = await fetch('https://medvault-production.up.railway.app/api/report/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        alert('Upload successful: ' + data.fileId);
      } else {
        alert('Upload failed: ' + (data.message || 'Invalid file'));
      }
    });
function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}