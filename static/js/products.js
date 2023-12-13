document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search");
  const categoryFilter = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sort");
  const orderSelect = document.getElementById("order");
  const form = document.getElementById("filterForm");
  const productContainer = document.getElementById("productContainer");
  const filterButton = document.getElementById("filterButton");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    handleSearchAndFilter();
  });

  categoryFilter.addEventListener("change", function () {
    handleSearchAndFilter();
  });

  sortSelect.addEventListener("change", function () {
    handleSearchAndFilter();
  });

  orderSelect.addEventListener("change", function () {
    handleSearchAndFilter();
  });

  filterButton.addEventListener("click", function () {
    handleSearchAndFilter();
  });

  function handleSearchAndFilter() {
    const searchValue = searchInput.value;
    const categoryValue = categoryFilter.value;
    const sortValue = sortSelect.value;
    const orderValue = orderSelect.value;

    // Construir la URL de la solicitud AJAX con parámetros opcionales
    let url = `/products?`;

    // Agregar parámetros si tienen valores específicos
    if (searchValue) {
      url += `search=${encodeURIComponent(searchValue)}&`;
    }
    if (categoryValue !== "All") {
      url += `category=${encodeURIComponent(categoryValue)}&`;
    }
    if (sortValue) {
      url += `sort=${encodeURIComponent(sortValue)}&`;
    }
    if (orderValue) {
      url += `order=${encodeURIComponent(orderValue)}`;
    }

    // Realizar la solicitud AJAX al servidor para obtener resultados de búsqueda y filtrado
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        updateUI(data);
      })
      .catch((error) => {
        console.error("Error en la solicitud AJAX:", error);
      });
  }

  function updateUI(data) {
    // Limpiar el contenido existente
    productContainer.innerHTML = "";

    // Verificar si hay resultados
    if (data.products.length === 0) {
      productContainer.innerHTML = "<p>No se encontraron resultados.</p>";
      return;
    }

    // Iterar sobre los productos y agregarlos al contenedor
    data.products.forEach((product) => {
      const card = createProductCard(product);
      productContainer.appendChild(card);
    });
  }

  function createProductCard(product) {
    // Crear un elemento div para la tarjeta del producto
    const card = document.createElement("div");
    card.classList.add("col-md-4", "mb-4");

    // Estructura de la tarjeta (usando la plantilla Handlebars)
    card.innerHTML = `
      <div class="card">
        <img src="${product.photoUrl}" class="card-img-top" alt="${product.title}">
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text">${product.description}</p>
          <p class="card-text">Precio: $${product.price}</p>
          <!-- Botón de agregar al carrito -->
          <form action="/carts/${response.cart._id}/${product._id}" method="POST">
            <div class="form-row align-items-center">
              <div class="col-auto">
                <label class="sr-only" for="quantity${product._id}">Cantidad</label>
                <input type="number" class="form-control mb-2" id="quantity${product._id}" name="quantity" value="1" min="1">
              </div>
              <div class="col-auto">
                <button type="submit" class="btn btn-success mb-2">Agregar al carrito</button>
              </div>
            </div>
          </form>
          <a href="/products/${product._id}" class="btn btn-primary">Ver detalles</a>
        </div>
      </div>
    `;

    return card;
  }
});

// // // Script de control del cliente
// // const rutaFetch = "http://localhost:8080/productos/";
// // const stringFetch = rutaFetch;

// // prepareFront();

// // getProducts("");

// // document.getElementById("applyFilter").addEventListener("click", setFilters);

// // function getProducts(filtros) {
// //   fetch(rutaFetch + filtros)
// //     .then((resp) => resp.json())
// //     .then((data) => {
// //       const targetDOM = document.getElementById("productsContainer");
// //       targetDOM.addEventListener("click", addProduct);
// //       targetDOM.innerHTML = "";
// //       for (el of data.payload) {
// //         const newElement = document.createElement("tr");
// //         newElement.innerHTML = `
// //                 <th scope="row">${el.title}</th>
// //                 <td>${el.description}</td>
// //                 <td>${el.category}</td>
// //                 <td style="text-align: right">${el.price}</td>
// //                 <td style="text-align: right">${el.stock}</td>
// //                 <td style="text-align: center">
// //                 <button type="button" class="btn btn-success" id="${el._id}">add</button>
// //                 </td>
// //                 `;
// //         targetDOM.appendChild(newElement);
// //       }

// //       let opcionesPaginacion = {
// //         page: data.page,
// //         totalPages: data.totalPages,
// //         hasNextPage: data.hasNextPage,
// //         hasPrevPage: data.hasPrevPage,
// //         nextPage: data.nextPage,
// //         prevPage: data.prevPage,
// //         prevLink: data.prevLink,
// //         nextLink: data.nextLink,
// //       };
// //       navSetup(opcionesPaginacion);
// //     });
// // }

// // async function navSetup(opcionesPaginacion) {
// //   const {
// //     page,
// //     totalPages,
// //     hasNextPage,
// //     hasPrevPage,
// //     nextPage,
// //     prevPage,
// //     prevLink,
// //     nextLink,
// //   } = await opcionesPaginacion;
// //   const targetDOM = document.getElementById("navBar");
// //   targetDOM.addEventListener("click", pageMove);
// //   targetDOM.innerHTML = "";
// //   let contentDOM;
// //   // PrevPage
// //   const prevPageDisabled = hasPrevPage
// //     ? { status: "", goto: "m" + prevPage }
// //     : { status: "disabled", goto: "none" };
// //   const nextPageDisabled = hasNextPage
// //     ? { status: "", goto: "m" + nextPage }
// //     : { status: "disabled", goto: "none" };
// //   contentDOM = `<li class="page-item ${prevPageDisabled.status}">
// //                  <a class="page-link" href='#' id=${prevPageDisabled.goto}>Anterior</a>
// //                  </li>
// //                  `;
// //   targetDOM.innerHTML += contentDOM;
// //   for (i = 1; i <= totalPages; i++) {
// //     const actualPage = page === i ? "active" : "";
// //     const id = "p" + i;
// //     contentDOM = `
// //         <li class="page-item"> <a class="page-link ${actualPage}" href="#" id='${id}' name='pageRef'>${i}</a></li>
// //         `;
// //     targetDOM.innerHTML += contentDOM;
// //   }
// //   contentDOM = `<li class="page-item ${nextPageDisabled.status}">
// //     <a class="page-link" href='#' id=${nextPageDisabled.goto}>Siguiente</a>
// //     </li>
// //     `;
// //   targetDOM.innerHTML += contentDOM;
// // }

// // function pageMove(e) {
// //   const pagina = e.target.id.substring(1);
// //   if (pagina) {
// //     setFilters(e, pagina);
// //   }
// // }

// // function prepareFront() {
// //   fetch("http://localhost:8080/products/cat/")
// //     .then((resp) => resp.json())
// //     .then((data) => {
// //       const targetCombo = document.getElementById("setCategories");
// //       targetCombo.innerHTML = "";
// //       const defaultOption = document.createElement("option");
// //       defaultOption.value = "";
// //       defaultOption.text = "";
// //       defaultOption.selected = true;
// //       defaultOption.disable = true;
// //       defaultOption.hidden = true;
// //       targetCombo.append(defaultOption);
// //       for (el of data) {
// //         const newOption = document.createElement("option");
// //         newOption.value = el._id;
// //         newOption.text = el._id;
// //         targetCombo.append(newOption);
// //       }
// //     });
// //   const comboPages = document.getElementById("setPages");
// //   comboPages.innerHTML = "";
// //   const optionPages = document.createElement("option");
// //   optionPages.value = "";
// //   optionPages.text = "";
// //   optionPages.selected = true;
// //   optionPages.disable = true;
// //   optionPages.hidden = true;
// //   comboPages.append(optionPages);
// //   const optionPages1 = document.createElement("option");
// //   optionPages1.value = 3;
// //   optionPages1.text = 3;
// //   comboPages.append(optionPages1);
// //   const optionPages2 = document.createElement("option");
// //   optionPages2.value = 5;
// //   optionPages2.text = 5;
// //   comboPages.append(optionPages2);
// //   const optionPages3 = document.createElement("option");
// //   optionPages3.value = 10;
// //   optionPages3.text = 10;
// //   comboPages.append(optionPages3);

// //   const comboSort = document.getElementById("setOrder");
// //   comboSort.innerHTML = "";
// //   const optionSort = document.createElement("option");
// //   optionSort.value = "";
// //   optionSort.text = "";
// //   optionSort.selected = true;
// //   optionSort.disable = true;
// //   optionSort.hidden = true;
// //   comboSort.append(optionSort);
// //   const optionSort1 = document.createElement("option");
// //   optionSort1.value = "asc";
// //   optionSort1.text = "Ascendente";
// //   comboSort.append(optionSort1);
// //   const optionSort2 = document.createElement("option");
// //   optionSort2.value = "desc";
// //   optionSort2.text = "Descendente";
// //   comboSort.append(optionSort2);
// // }

// // function setFilters(e, page) {
// //   if (!page) page = 1;
// //   const pagesPerViewDOM = document.getElementById("setPages");
// //   const pagesPerView =
// //     pagesPerViewDOM.options[pagesPerViewDOM.selectedIndex].text;
// //   const categoryPerViewDOM = document.getElementById("setCategories");
// //   const categoryPerView =
// //     categoryPerViewDOM.options[categoryPerViewDOM.selectedIndex].text;
// //   const orderPerViewDOM = document.getElementById("setOrder");
// //   const orderPerView =
// //     orderPerViewDOM.options[orderPerViewDOM.selectedIndex].value;
// //   const validaFiltro =
// //     pagesPerView || categoryPerView || orderPerView || page ? "?" : false;
// //   const optFiltro = [];
// //   if (validaFiltro) {
// //     if (pagesPerView) {
// //       optFiltro.push(`itemsPorPagina=${pagesPerView}`);
// //     }
// //     if (orderPerView) {
// //       optFiltro.push(`order=${orderPerView}`);
// //     }
// //     if (categoryPerView) {
// //       optFiltro.push(`filtro=${categoryPerView}`);
// //     }
// //     if (page) {
// //       optFiltro.push(`pagina=${page}`);
// //     }
// //   }
// //   const strFiltro = "?" + optFiltro.join("&");
// //   getProducts(strFiltro);
// // }

// // function addProduct(e) {
// //   const idProducto = e.target.id;
// //   const activeCart = JSON.parse(localStorage.getItem("carts"));
// //   if (!idProducto) {
// //     return;
// //   }
// //   if (!activeCart) {
// //     return alert("No hay carrito seleccionado");
// //   }
// //   const rutaFetchPut = `http://localhost:8080/api/carritos/${activeCart}/add/${idProducto}`; // /:cid/add/:pid
// //   fetch(rutaFetchPut, {
// //     method: "PUT",
// //     headers: {
// //       "Content-Type": "application/json",
// //     },
// //   })
// //     .then((resp) => resp.json())
// //     .then((data) => {
// //       if (data.message === "Producto Agregado") {
// //         Toastify({
// //           text: "Producto agregado",
// //           style: {
// //             background: "linear-gradient(to right, #00b09b, #96c93d)",
// //           },
// //         }).showToast();
// //       } else if (data.message === "Producto Actualizado") {
// //         Toastify({
// //           text: "Producto actualizado",
// //           style: {
// //             background: "linear-gradient(to right, #898910, #FAFA08)",
// //           },
// //         }).showToast();
// //       } else if (data.message === "not found") {
// //         Toastify({
// //           text: "No seleccionó ningun carrito",
// //           style: {
// //             background: "linear-gradient(to right, #A30404, #F94646)",
// //           },
// //         }).showToast();
// //       }
// //     });
// // }

// document.addEventListener("DOMContentLoaded", function () {
//   // Función para actualizar la tabla de productos
//   function updateProductTable(products) {
//     const productsContainer = document.getElementById("productsContainer");
//     productsContainer.innerHTML = "";

//     products.forEach((product) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//         <td>${product.title}</td>
//         <td>${product.description}</td>
//         <td>${product.category}</td>
//         <td>${product.price}</td>
//         <td>${product.stock}</td>
//         <td><button type="button" class="btn btn-success">Agregar</button></td>
//       `;
//       productsContainer.appendChild(row);
//     });
//   }

//   // Evento para cargar opciones en los elementos select
//   function loadFilterOptions() {
//     // Puedes personalizar esta lógica según tus necesidades
//     const categories = [
//       "Panadería",
//       "Pastelería",
//       "Postres",
//       "Repostería",
//       "Heladería",
//       "Bebidas",
//     ];
//     const pages = [1, 2, 3]; // Ejemplo, reemplazar con la lógica real de paginación
//     const orders = ["Ascendente", "Descendente"]; // Puedes personalizar esto según tus necesidades

//     // Cargar opciones en los elementos select
//     const setCategories = document.getElementById("setCategories");
//     const setPages = document.getElementById("setPages");
//     const setOrder = document.getElementById("setOrder");

//     categories.forEach((category) => {
//       const option = document.createElement("option");
//       option.value = category;
//       option.text = category;
//       setCategories.appendChild(option);
//     });

//     pages.forEach((page) => {
//       const option = document.createElement("option");
//       option.value = page;
//       option.text = page;
//       setPages.appendChild(option);
//     });

//     orders.forEach((order) => {
//       const option = document.createElement("option");
//       option.value = order;
//       option.text = order;
//       setOrder.appendChild(option);
//     });
//   }

//   // Cargar opciones al inicio
//   loadFilterOptions();

//   document
//     .getElementById("applyFilter")
//     .addEventListener("click", async function () {
//       try {
//         // Obtener valores de los filtros
//         const selectedPage = document.getElementById("setPages").value;
//         const selectedCategory = document.getElementById("setCategories").value;
//         const selectedOrder = document.getElementById("setOrder").value;

//         // Realizar una solicitud Fetch para obtener los productos filtrados
//         const response = await fetch(
//           `/products?page=${selectedPage}&category=${selectedCategory}&sort=${selectedOrder}`
//         );

//         if (!response.ok) {
//           // Mostrar un mensaje de error al usuario
//           console.error(
//             `Error al cargar productos. Código: ${response.status}`
//           );
//           return;
//         }

//         const data = await response.json();

//         // Actualizar la tabla de productos
//         updateProductTable(data.products);

//         // Actualizar la paginación, si es necesario
//         // ...

//         // Puedes agregar más lógica aquí según tus necesidades
//       } catch (error) {
//         console.error("Error fetching or parsing data:", error);
//       }
//     });
//   // Otras funciones y eventos relacionados con la paginación aquí...
// });

// // // Definición de la URL de la API
// // const apiUrl = "http://localhost:8080/products/";

// // // Función para realizar una solicitud de datos a la API
// // async function fetchData(endpoint, options = {}) {
// //   try {
// //     const response = await fetch(endpoint, options);
// //     if (!response.ok) {
// //       throw new Error(`Error en la solicitud: ${response.statusText}`);
// //     }
// //     return response.json();
// //   } catch (error) {
// //     throw new Error(`Error de red: ${error.message}`);
// //   }
// // }

// // // Función para obtener productos y actualizar la interfaz de usuario
// // function getProducts(filters) {
// //   fetch(apiUrl + filters)
// //     .then((resp) => resp.json())
// //     .then((data) => {
// //       // Actualizar la tabla de productos en el DOM
// //       const targetDOM = document.getElementById("productsContainer");
// //       targetDOM.innerHTML = data.payload
// //         .map(
// //           (element) => `
// //         <tr>
// //           <th scope="row">${element.title}</th>
// //           <td>${element.description}</td>
// //           <td>${element.category}</td>
// //           <td style="text-align: right">${element.price}</td>
// //           <td style="text-align: right">${element.stock}</td>
// //           <td style="text-align: center">
// //             <button type="button" class="btn btn-success" id="${element._id}">add</button>
// //           </td>
// //         </tr>
// //       `
// //         )
// //         .join("");

// //       // Configuración de la barra de navegación
// //       const pagetionOptions = {
// //         page: data.page,
// //         totalPages: data.totalPages,
// //         hasNextPage: data.hasNextPage,
// //         hasPrevPage: data.hasPrevPage,
// //         nextPage: data.nextPage,
// //         prevPage: data.prevPage,
// //         prevLink: data.prevLink,
// //         nextLink: data.nextLink,
// //       };
// //       navSetup(pagetionOptions);
// //     });
// // }

// // // Función asincrónica para configurar la barra de navegación
// // async function navSetup(pagetionOptions) {
// //   const {
// //     page,
// //     totalPages,
// //     hasNextPage,
// //     hasPrevPage,
// //     nextPage,
// //     prevPage,
// //     prevLink,
// //     nextLink,
// //   } = await pagetionOptions;

// //   // Actualizar la barra de navegación en el DOM
// //   const targetDOM = document.getElementById("navBar");
// //   targetDOM.innerHTML = `
// //     <li class="page-item ${hasPrevPage ? "" : "disabled"}">
// //       <a class="page-link" href='#' id="m${prevPage}">Anterior</a>
// //     </li>
// //     ${Array.from(
// //       { length: totalPages },
// //       (_, i) => `
// //       <li class="page-item">
// //         <a class="page-link ${page === i + 1 ? "active" : ""}" href="#" id='p${
// //         i + 1
// //       }' name='pageRef'>${i + 1}</a>
// //       </li>
// //     `
// //     ).join("")}
// //     <li class="page-item ${hasNextPage ? "" : "disabled"}">
// //       <a class="page-link" href='#' id="m${nextPage}">Siguiente</a>
// //     </li>
// //   `;
// // }

// // // Función para preparar la interfaz de usuario
// // function prepareFront() {
// //   // Obtener y cargar las categorías en el set de categorías
// //   fetchData("http://localhost:8080/api/products/cat/").then((data) => {
// //     const targetSet = document.getElementById("setCategories");
// //     targetSet.innerHTML = data
// //       .map(
// //         (element) => `<option value="${element._id}">${element._id}</option>`
// //       )
// //       .join("");
// //   });

// //   // Configurar las opciones predeterminadas para los sets de páginas y Order
// //   ["setPages", "setOrder"].forEach((id) => {
// //     const set = document.getElementById(id);
// //     set.innerHTML = `<option value="" selected disabled hidden></option>`;
// //     const options = [3, 5, 10];
// //     options.forEach((value) => {
// //       const option = document.createElement("option");
// //       option.value = value;
// //       option.text = value;
// //       set.append(option);
// //     });
// //   });
// // }

// // // Función para aplicar filters y obtener productos
// // function setFilters(e, page) {
// //   if (!page) page = 1;

// //   // Obtener valores de los sets
// //   const pagesPerView = document.getElementById("setPages").value;
// //   const categoryPerView = document.getElementById("setCategories").value;
// //   const orderPerView = document.getElementById("setOrder").value;

// //   // Construir parámetros de la consulta
// //   const params = new URLSearchParams();
// //   if (pagesPerView) params.append("itemsPerPage", pagesPerView);
// //   if (orderPerView) params.append("order", orderPerView);
// //   if (categoryPerView) params.append("filter", categoryPerView);
// //   params.append("page", page);

// //   // Construir la cadena de filter y obtener productos
// //   const strfilter = "?" + params.toString();
// //   getProducts(strfilter);
// // }

// // // Función para agregar un producto al carrito
// // function addProduct(e) {
// //   const idProduct = e.target.id;
// //   const activeCart = JSON.parse(localStorage.getItem("carts"));

// //   // Verificar si se obtuvo correctamente el ID del producto y si hay un carrito activo
// //   if (!idProduct || !activeCart) {
// //     console.error(
// //       "Error: No se pudo obtener el ID del producto o no hay carrito activo"
// //     );
// //     return;
// //   }

// //   const pathFetchPut = `http://localhost:8080/api/carts/${activeCart}/add/${idProduct}`;

// //   // Enviar solicitud PUT al servidor para agregar o actualizar el producto en el carrito
// //   fetchData(pathFetchPut, {
// //     method: "PUT",
// //     headers: { "Content-Type": "application/json" },
// //   })
// //     .then((data) => {
// //       // Verificar si la respuesta del servidor contiene la información esperada
// //       if (data && data.message) {
// //         const message = data.message;

// //         // Determinar el fondo del mensaje en función de la respuesta del servidor
// //         const bgColor =
// //           message === "Producto Agregado"
// //             ? "linear-gradient(to right, #00b09b, #96c93d)"
// //             : message === "Producto Actualizado"
// //             ? "linear-gradient(to right, #898910, #FAFA08)"
// //             : message === "not found"
// //             ? "linear-gradient(to right, #A30404, #F94646)"
// //             : "";

// //         // Mostrar mensaje con estilo de fondo correspondiente
// //         Toastify({
// //           text: message,
// //           style: { background: bgColor },
// //         }).showToast();

// //         // Actualizar la interfaz del carrito después de agregar o actualizar el producto
// //         getCartInfo();
// //       } else {
// //         console.error("Error: Respuesta del servidor inesperada", data);
// //       }
// //     })
// //     .catch((error) => {
// //       console.error("Error al procesar la solicitud", error);
// //     });
// // }

// // // Event listeners para el botón de aplicar filters y la barra de navegación
// // document.getElementById("applyFilter").addEventListener("click", setFilters);
// // document.getElementById("navBar").addEventListener("click", (e) => {
// //   const page = e.target.id.substring(1);
// //   if (page) setFilters(null, page);
// // });

// // // Configuración inicial de la interfaz de usuario
// // prepareFront();
// // getProducts("");
