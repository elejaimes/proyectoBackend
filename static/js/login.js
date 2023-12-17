document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.querySelector("#loginForm");

  formLogin?.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(new FormData(formLogin)),
        credentials: "include",
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.ok) {
          window.location.href = data.redirect; // Manejar la redirección
          console.log("Redirecting to products page");
        } else {
          alert(data.message);
        }
      } else {
        console.error("Unexpected response:", response);
        alert("An unexpected error occurred during login.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An unexpected error occurred during login.");
    }
  });
});
