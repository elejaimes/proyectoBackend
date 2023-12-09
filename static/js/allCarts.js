const pathFetch = "http://localhost:8080/api/carts/allCarts";
const pathFetchNewCart = "http://localhost:8080/api/carts";

document.getElementById("newCart").addEventListener("click", newCart);
document.getElementById("cartList").addEventListener("click", selectCart);

async function loadCarts() {
  try {
    const resp = await fetch(pathFetch);
    const data = await resp.json();

    const targetDOM = document.getElementById("cartList");
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
  }
}

function selectCart(e) {
  const selectedId = e.target.id;
  if (selectedId !== "") {
    document.getElementById("allCarts").value = selectedId;
    localStorage.setItem("cart", JSON.stringify(selectedId));
    window.location = "/products";
  }
}

async function newCart() {
  try {
    const resp = await fetch(pathFetchNewCart, { method: "POST" });
    const data = await resp.json();

    const newID = data._id;
    localStorage.setItem("cart", JSON.stringify(newID));
    window.location = "/products";
  } catch (error) {
    console.error("Error al crear un nuevo carrito:", error);
  }
}

loadCarts();
