// Función para manejar el boton de ver detalle
document.addEventListener("DOMContentLoaded", function () {
  // Agrega un evento de clic para cada botón "Ver detalles"
  const viewDetailsButtons = document.querySelectorAll(".view-details");
  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const productId = this.getAttribute("data-product");
      const detailsContainer = document.getElementById(`details_${productId}`);

      // Si el contenedor de detalles está visible, ocúltalo; de lo contrario, muéstralo
      if (detailsContainer.style.display === "block") {
        detailsContainer.style.display = "none";
      } else {
        // Oculta todos los detalles antes de mostrar el seleccionado
        document.querySelectorAll(".details-container").forEach((container) => {
          container.style.display = "none";
        });

        // Muestra los detalles del producto seleccionado
        detailsContainer.style.display = "block";
      }
    });
  });
});
