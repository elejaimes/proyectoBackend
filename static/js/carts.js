document.addEventListener("DOMContentLoaded", function () {
  // Obtener la lista de productos del carrito
  const cartItemList = document.getElementById("cart-item-list");

  // Agregar un evento clic al contenedor de la lista de productos del carrito
  cartItemList.addEventListener("click", function (event) {
    const target = event.target;

    // Verificar si el clic fue en un botón de eliminar
    if (target.classList.contains("delete-btn")) {
      event.preventDefault();

      // Obtener el ID del producto y del carrito
      const productId = target.getAttribute("data-product-id");
      const cartId = target.closest("li").id.split("-").pop();

      // Realizar una solicitud DELETE al servidor
      deleteCartItem(cartId, productId);
    }
  });

  // Función para realizar la solicitud DELETE al servidor usando Fetch API
  async function deleteCartItem(cartId, productId) {
    try {
      const response = await fetch(`/carts/${cartId}/${productId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el producto del carrito");
      }

      const cartData = await response.json();
      updateCartView(cartData);
    } catch (error) {
      console.error(error);
    }
  }

  // Función para actualizar la vista del carrito en el DOM
  function updateCartView(cartData) {
    // Elimina todos los elementos hijos actuales de la lista
    cartItemList.innerHTML = "";

    // Recorre los nuevos datos del carrito y crea elementos para cada producto
    cartData.cartItems.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className = "list-group-item";
      listItem.id = `cart-item-${item.productId._id}`;

      const content = `
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 id="product-title-${item.productId._id}">${item.productId.title}</h5>
            <p>Precio: $${item.productId.price}</p>
          </div>
          <div class="quantity-section">
            <p id="quantity-label-${item.productId._id}">Cantidad: ${item.quantity}</p>
            <form action="/carts/${cartData._id}/${item.productId._id}" method="POST" id="delete-form-${item.productId._id}">
              <input type="hidden" name="_method" value="DELETE">
              <button type="submit" class="btn btn-danger delete-btn" data-product-id="${item.productId._id}">Eliminar</button>
            </form>
          </div>
        </div>`;

      listItem.innerHTML = content;
      cartItemList.appendChild(listItem);
    });

    // Actualiza el total del carrito
    const totalLabel = document.getElementById("total-label");
    if (totalLabel) {
      totalLabel.textContent = `Total: $${calculateTotal(cartData.cartItems)}`;
    }
  }

  // Función para calcular el total del carrito
  function calculateTotal(cartItems) {
    // Verificar si hay elementos en el carrito
    if (!cartItems || cartItems.length === 0) {
      return 0;
    }

    // Sumar los precios multiplicados por las cantidades
    const total = cartItems.reduce((acc, item) => {
      const itemTotal = item.productId.price * item.quantity;
      return acc + itemTotal;
    }, 0);

    return total.toFixed(2); // Redondear a dos decimales
  }
});

function isCartEmpty(cartItems) {
  return cartItems.length === 0;
}

function formatCurrency(amount) {
  // Lógica para formatear el precio a moneda (por ejemplo, utilizando toFixed, Intl.NumberFormat, etc.)
  return amount.toFixed(2); // Ejemplo básico, puedes personalizar según tus necesidades
}
