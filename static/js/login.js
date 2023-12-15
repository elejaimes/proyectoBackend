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
      });

      if (response.status === 201) {
        window.location.href = "/products";
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An unexpected error occurred during login.");
    }
  });
});
