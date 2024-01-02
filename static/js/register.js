document.addEventListener("DOMContentLoaded", () => {
  const formRegister = document.querySelector("#registerForm");

  formRegister?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(formRegister);
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    console.log("FormData Objetc:", formDataObject);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
      });

      if (response.status === 201) {
        window.location.href = "/products";
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An unexpected error occurred during registration.");
    }
  });
});

// document.addEventListener("DOMContentLoaded", () => {
//   const formRegister = document.querySelector("#registerForm");

//   formRegister?.addEventListener("submit", async (event) => {
//     event.preventDefault();

//     try {
//       const response = await fetch("/api/users", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//         body: new URLSearchParams(new FormData(formRegister)),
//       });

//       if (response.status === 201) {
//         window.location.href = "/products";
//       } else {
//         const error = await response.json();
//         alert(error.message);
//       }
//     } catch (error) {
//       console.error("Error during registration:", error);
//       alert("An unexpected error occurred during registration.");
//     }
//   });
// });
