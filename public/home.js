const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "login.html";
    }

    document.getElementById("downloadPdfBtn").onclick = async () => {
      const response = await fetch("https://medvault-production.up.railway.app/api/report/download", {
        method: "GET",
        headers: {
          "Authorization": token
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "AllReports.pdf";
        link.click();
        showToast("Download started!");
      } else {
        showToast("Download failed");
      }
    };

    function logout() {
      localStorage.removeItem("token");
      showToast("Logged out!");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    }

    function showToast(message) {
      const toast = document.getElementById("toast");
      toast.textContent = message;
      toast.style.display = "block";
      setTimeout(() => {
        toast.style.display = "none";
      }, 5000);
    }