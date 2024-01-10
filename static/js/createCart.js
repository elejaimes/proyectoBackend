document.addEventListener("DOMContentLoaded", function () {
  const createCartBtn = document.getElementById("createCartBtn");

  if (createCartBtn) {
    createCartBtn.addEventListener("click", function (event) {
      event.preventDefault();

      // Realizar una solicitud POST al servidor para crear un nuevo carrito
      fetch("/carts/create", {
        method: "POST",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al crear el carrito");
          }
          return response.json();
        })
        .then((cartData) => {
          // Redirigir al usuario al carrito recién creado
          window.location.href = `/carts/${cartData._id}`;
        })
        .catch((error) => console.error(error));
    });
  }
});
