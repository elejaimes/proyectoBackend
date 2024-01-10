document.addEventListener("DOMContentLoaded", function () {
  // Obtener todos los botones de "Ver Carrito"
  const viewCartButtons = document.querySelectorAll(".view-cart-btn");

  // Agregar un evento clic a cada botón de "Ver Carrito"
  viewCartButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();

      // Obtener el ID del carrito desde el atributo data-cart-id
      const cartId = button.dataset.cartId;

      // Redirigir a la página de detalle del carrito
      window.location.href = `/allCarts/${cartId}`;
    });
  });
});
