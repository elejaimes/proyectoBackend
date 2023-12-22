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

      console.log("Response:", response);

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          console.log(data);
          window.location.href = data.redirect; // Manejar la redirección
          console.log("Redirecting to products page");
        } else {
          console.log("Redirecting to products page");
          window.location.href = response.url; // Redireccionar sin analizar JSON
        }
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An unexpected error occurred during login.");
    }
  });
});
