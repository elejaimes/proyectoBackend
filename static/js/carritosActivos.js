const rutaFetch = "http://localhost:8080/api/carritos/carritosActivos";
const rutaFetchNewCarrito = "http://localhost:8080/api/carritos";

document.getElementById("newCarrito").addEventListener("click", newCarrito);
document
  .getElementById("listaCarritos")
  .addEventListener("click", selectCarrito);

async function loadCarritos() {
  try {
    const resp = await fetch(rutaFetch);
    const data = await resp.json();

    const targetDOM = document.getElementById("listaCarritos");
    targetDOM.innerHTML = "";

    if (data.length > 0) {
      for (const elem of data) {
        targetDOM.innerHTML += `
          <tr>
            <th scope="row" style="vertical-align: middle;">${elem._id}</th>
            <td style="vertical-align: middle;">Subtotal: ${elem.total}</td>
            <td style="vertical-align: middle;">
              <input type="radio" class="btn-check" name="options-outlined" id="${elem._id}" autocomplete="off">
              <label class="btn btn-outline-success" for="${elem._id}">Continuar</label>
            </td>
          </tr>`;
      }
    } else {
      targetDOM.innerHTML = `
        <div class="alert alert-success" role="alert">
          No hay carritos activos. Crea uno nuevo!
        </div>`;
    }
  } catch (error) {
    console.error("Error al cargar carritos:", error);
    // Puedes agregar un mensaje de error al usuario si lo deseas
  }
}

function selectCarrito(e) {
  const selectedId = e.target.id;
  if (selectedId !== "") {
    document.getElementById("carritoActivo").value = selectedId;
    localStorage.setItem("carrito", JSON.stringify(selectedId));
    window.location = "/productos";
  }
}

async function newCarrito() {
  try {
    const resp = await fetch(rutaFetchNewCarrito, { method: "POST" });
    const data = await resp.json();

    const newID = data._id;
    localStorage.setItem("carrito", JSON.stringify(newID));
    window.location = "/productos";
  } catch (error) {
    console.error("Error al crear un nuevo carrito:", error);
    // Puedes agregar un mensaje de error al usuario si lo deseas
  }
}

// Llamar a loadCarritos al cargar la página
loadCarritos();
