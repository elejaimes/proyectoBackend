// Definición de la URL de la API
const apiUrl = "http://localhost:8080/api/products/";

// Función para realizar una solicitud de datos a la API
function fetchData(endpoint, options = {}) {
  return fetch(endpoint, options).then((response) => response.json());
}

// Función para obtener productos y actualizar la interfaz de usuario
function getProducts(filters) {
  fetch(apiUrl + filters)
    .then((resp) => resp.json())
    .then((data) => {
      // Actualizar la tabla de productos en el DOM
      const targetDOM = document.getElementById("productsContainer");
      targetDOM.innerHTML = data.payload
        .map(
          (element) => `
        <tr>
          <th scope="row">${element.title}</th>
          <td>${element.description}</td>
          <td>${element.category}</td>
          <td style="text-align: right">${element.price}</td>
          <td style="text-align: right">${element.stock}</td>
          <td style="text-align: center">
            <button type="button" class="btn btn-success" id="${element._id}">add</button>
          </td>
        </tr>
      `
        )
        .join("");

      // Configuración de la barra de navegación
      const pagetionOptions = {
        page: data.page,
        totalPages: data.totalPages,
        hasNextPage: data.hasNextPage,
        hasPrevPage: data.hasPrevPage,
        nextPage: data.nextPage,
        prevPage: data.prevPage,
        prevLink: data.prevLink,
        nextLink: data.nextLink,
      };
      navSetup(pagetionOptions);
    });
}

// Función asincrónica para configurar la barra de navegación
async function navSetup(pagetionOptions) {
  const {
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    prevLink,
    nextLink,
  } = await pagetionOptions;

  // Actualizar la barra de navegación en el DOM
  const targetDOM = document.getElementById("navBar");
  targetDOM.innerHTML = `
    <li class="page-item ${hasPrevPage ? "" : "disabled"}">
      <a class="page-link" href='#' id="m${prevPage}">Anterior</a>
    </li>
    ${Array.from(
      { length: totalPages },
      (_, i) => `
      <li class="page-item">
        <a class="page-link ${page === i + 1 ? "active" : ""}" href="#" id='p${
        i + 1
      }' name='pageRef'>${i + 1}</a>
      </li>
    `
    ).join("")}
    <li class="page-item ${hasNextPage ? "" : "disabled"}">
      <a class="page-link" href='#' id="m${nextPage}">Siguiente</a>
    </li>
  `;
}

// Función para preparar la interfaz de usuario
function prepareFront() {
  // Obtener y cargar las categorías en el set de categorías
  fetchData("http://localhost:8080/api/products/cat/").then((data) => {
    const targetSet = document.getElementById("setCategories");
    targetSet.innerHTML = data
      .map(
        (element) => `<option value="${element._id}">${element._id}</option>`
      )
      .join("");
  });

  // Configurar las opciones predeterminadas para los sets de páginas y Order
  ["setPages", "setOrder"].forEach((id) => {
    const set = document.getElementById(id);
    set.innerHTML = `<option value="" selected disabled hidden></option>`;
    const options = [3, 5, 10];
    options.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.text = value;
      set.append(option);
    });
  });
}

// Función para aplicar filters y obtener productos
function setFilters(e, page) {
  if (!page) page = 1;

  // Obtener valores de los sets
  const pagesPerView = document.getElementById("setPages").value;
  const categoryPerView = document.getElementById("setCategories").value;
  const orderPerView = document.getElementById("setOrder").value;

  // Construir parámetros de la consulta
  const params = new URLSearchParams();
  if (pagesPerView) params.append("itemsPerPage", pagesPerView);
  if (orderPerView) params.append("order", orderPerView);
  if (categoryPerView) params.append("filter", categoryPerView);
  params.append("page", page);

  // Construir la cadena de filter y obtener productos
  const strfilter = "?" + params.toString();
  getProducts(strfilter);
}

// Función para agregar un producto al carts
function addProduct(e) {
  const idProduct = e.target.id;
  const activeCart = JSON.parse(localStorage.getItem("carts"));
  if (!idProduct || !activeCart) return alert("No hay carts seleccionado");

  const pathFetchPut = `http://localhost:8080/api/carts/${activeCart}/add/${idProduct}`;
  fetchData(pathFetchPut, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  }).then((data) => {
    // Mostrar mensaje con estilo de fondo correspondiente
    const message = data.message;
    const bgColor =
      message === "Producto Agregado"
        ? "linear-gradient(to right, #00b09b, #96c93d)"
        : message === "Producto Actualizado"
        ? "linear-gradient(to right, #898910, #FAFA08)"
        : message === "not found"
        ? "linear-gradient(to right, #A30404, #F94646)"
        : "";

    Toastify({
      text: message,
      style: { background: bgColor },
    }).showToast();
  });
}

// Event listeners para el botón de aplicar filters y la barra de navegación
document.getElementById("applyFilter").addEventListener("click", setFilters);
document.getElementById("navBar").addEventListener("click", (e) => {
  const page = e.target.id.substring(1);
  if (page) setFilters(null, page);
});

// Configuración inicial de la interfaz de usuario
prepareFront();
getProducts("");
