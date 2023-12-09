const idCarrito = JSON.parse(localStorage.getItem("carrito"));
const rutaFetch = "http://localhost:8080/api/carritos/";

document.getElementById("delCarrito").addEventListener("click", deleteCart);
getCarritoInfo();

function getCarritoInfo() {
  document.getElementById("carritoID").innerText = `Carrito ID ${idCarrito}`;
  const targetDOM = document.getElementById("listaProductos");
  targetDOM.innerHTML = "";
  targetDOM.addEventListener("click", botonera);

  fetch(`${rutaFetch}${idCarrito}`)
    .then((resp) => resp.json())
    .then((data) => {
      data.carrito.forEach((elem) => {
        const newElement = createTableRow(elem);
        targetDOM.appendChild(newElement);
      });
    });
}

function createTableRow(elem) {
  const newElement = document.createElement("tr");
  newElement.innerHTML = `
    <th scope="row">${elem.productID.title}</th>
    <td>${elem.productID.description}</td>
    <td>${elem.productID.category}</td>
    <td>${elem.productID.title}</td>
    <td style="text-align: center;">${elem.cant}</td>
    <td>
      <button type="button" class="btn btn-secondary" id="del${elem._id}">
        <svg xmlns="http://www.w3.org/2000/svg" id="del${elem._id}" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
          <!-- SVG Path -->
        </svg>
      </button>
      <button type="button" class="btn btn-secondary" id="upd${elem._id}">
        <svg xmlns="http://www.w3.org/2000/svg" id="upd${elem._id}" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
          <!-- SVG Path -->
        </svg>
      </button>
    </td>
  `;
  return newElement;
}

function botonera(e) {
  const selectedId = e.target.id;
  const action = selectedId.substring(0, 3);
  const id = selectedId.substring(3);

  if (action === "del") {
    const rutaDelete = `${rutaFetch}${idCarrito}/producto/${id}`;
    deleteProduct(rutaDelete);
  } else if (action === "upd") {
    renderEditFilds(e, id);
  } else if (action === "sav") {
    updateProduct(id);
  }
}

function deleteProduct(rutaDelete) {
  fetch(rutaDelete, {
    method: "DELETE",
  })
    .then((resp) => resp.json())
    .then(() => {
      showToast("Producto Eliminado");
      getCarritoInfo();
    });
}

function updateProduct(id) {
  const valorUpdate = document.getElementById("edit" + id).value;
  const rutaUpdate = `${rutaFetch}${idCarrito}/producto/${id}`;

  fetch(rutaUpdate, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ cant: parseInt(valorUpdate) }),
  })
    .then((resp) => resp.json())
    .then(() => {
      window.location.reload();
    });
}

function renderEditFilds(domElement, id) {
  let targetEdit;
  let targetOrigin;

  switch (domElement.target.nodeName) {
    case "path":
      targetOrigin = domElement.target.parentNode.parentNode.parentNode;
      targetEdit = targetOrigin.previousElementSibling;
      break;
    case "svg":
      targetOrigin = domElement.target.parentNode.parentNode;
      targetEdit = targetOrigin.previousElementSibling;
      break;
    case "BUTTON":
      targetOrigin = domElement.target.parentNode;
      targetEdit = targetOrigin.previousElementSibling;
      break;
  }

  const value = targetEdit.innerText;
  targetEdit.innerHTML = `<input type="text" class="form-control" aria-label="Username" aria-describedby="basic-addon1" id='edit${id}' value=${value}>`;
  targetOrigin.innerHTML = `<button type="button" class="btn btn-secondary" id="sav${id}">
      <svg id="sav${id}" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
        <!-- SVG Path -->
      </svg>
    </button>`;
}

function deleteCart() {
  fetch(`${rutaFetch}${idCarrito}`, {
    method: "DELETE",
  })
    .then((resp) => resp.json())
    .then(() => {
      showToast("Carrito Eliminado");
      window.location = "/";
    });
}

function showToast(message) {
  Toastify({
    text: message,
    style: {
      background: "linear-gradient(to right, #A30404, #F94646)",
    },
  }).showToast();
}
