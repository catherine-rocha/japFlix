document.addEventListener("DOMContentLoaded", () => {

    let botónBuscar = document.getElementById("btnBuscar");
    let lista = document.getElementById("lista");

    // Click en botón buscar
    botónBuscar.addEventListener("click", () => {
        let peliculaBuscada = document.getElementById("inputBuscar").value.toLowerCase(); // Convertir a minúsculas para evitar problemas con mayúsculas/minúsculas.

        // Petición a URL
        fetch("https://japceibal.github.io/japflix_api/movies-data.json")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error en la respuesta de la red");
                }
                return response.json();
            })
            .then(data => {
                filtrarPeliculas(data, peliculaBuscada);
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });

    function filtrarPeliculas(peliculas, peliculaBuscada) {
        lista.innerHTML = "";

        peliculas.forEach(pelicula => {

            let tituloLower = pelicula.title.toLowerCase(); // Para que no haya problema con may. o min.
            let genresName = pelicula.genres.map(genre => genre.name.toLowerCase()).join(", "); // Recorro géneros para extraer solo nombre
            let taglineLower = pelicula.tagline.toLowerCase();

            // Buscar Coincidencias
            if (tituloLower.includes(peliculaBuscada) || genresName.includes(peliculaBuscada) || taglineLower.includes(peliculaBuscada) || pelicula.overview.includes(peliculaBuscada)) {
                // Crear un contenedor para el título y el tagline
                let titleContainer = document.createElement("div");
                titleContainer.className = "title-container"; // Clase para el contenedor

                // Crear y añadir el título
                let element1 = document.createElement("h3");
                element1.textContent = pelicula.title;
                titleContainer.appendChild(element1);

                // Agregar el evento click para abrir OffCanvas
                titleContainer.addEventListener("click", () => {
                    mostrarDetallesPelicula(pelicula); // Mostrar detalles
                });

                function mostrarDetallesPelicula(pelicula) {
                    // Actualizar el contenido del OffCanvas
                    document.getElementById("movieTitle").textContent = pelicula.title;
                    document.getElementById("movieOverview").textContent = pelicula.overview;

                    // Limpiar y agregar los géneros
                    let genresList = document.getElementById("movieGenres");
                    genresList.innerHTML = ""; // Limpiar la lista anterior

                    pelicula.genres.forEach(genre => {
                        let li = document.createElement("li");
                        li.textContent = genre.name; // Agregar nombre del género
                        genresList.appendChild(li);
                    });

                    // Agregar más información al Dropdown
                    const releaseDate = new Date(pelicula.release_date); // Convertir a objeto Date
                    document.getElementById("releaseYear").textContent = `Año de lanzamiento: ${releaseDate.getFullYear()}`;
                    document.getElementById("runtime").textContent = `Duración: ${pelicula.runtime} minutos`;
                    document.getElementById("budget").textContent = `Presupuesto: $${pelicula.budget.toLocaleString()}`;
                    document.getElementById("revenue").textContent = `Ganancias: $${pelicula.revenue.toLocaleString()}`;

                    // Abrir el OffCanvas
                    let offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasExample'));
                    offcanvas.show(); // Mostrar el OffCanvas
                }



                // Crear y añadir el tagline
                if (pelicula.tagline) {
                    let element2 = document.createElement("p");
                    element2.textContent = pelicula.tagline;
                    element2.className = "tagline";
                    titleContainer.appendChild(element2);
                }

                // Contenedor para las estrellas
                let starContainer = document.createElement("div");
                starContainer.className = "star-rating-container";

                if (pelicula.vote_average) {
                    let voteAverage = pelicula.vote_average;
                    let element3 = document.createElement("div");
                    element3.className = "star-rating";

                    // Crear estrellas según la calificación
                    for (let i = 1; i <= 10; i++) {
                        let star = document.createElement("i");
                        if (i <= voteAverage) {
                            star.className = "fas fa-star"; // Estrella llena
                        } else {
                            star.className = "far fa-star"; // Estrella vacía
                        }

                        element3.appendChild(star);
                    }

                    starContainer.appendChild(element3); // Añadir las estrellas al contenedor de estrellas
                }

                titleContainer.appendChild(starContainer); // Añadir el contenedor de estrellas al contenedor de título
                lista.appendChild(titleContainer); // Añadir el contenedor al DOM
            }


        });
    }
}); 