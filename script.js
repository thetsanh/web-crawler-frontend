console.log("JS is running");

let movies = [];
let originalMovies = [];
let currentMovies = [];
let sortState = 0; 
// 0 = Default
// 1 = A-Z
// 2 = Z-A

/* =========================
   LOAD DATA
========================= */

fetch("data.json")
    .then(response => response.json())
    .then(data => {
        movies = data;
        originalMovies = [...data];
        currentMovies = [...data];

        if (document.getElementById("movieGrid")) {
            displayMovies(currentMovies);
            setupHomeEvents();
        }

        if (document.getElementById("detailsContainer")) {
            showDetails();
        }
    });

/* =========================
   HOME PAGE
========================= */

function displayMovies(movieArray) {
    const grid = document.getElementById("movieGrid");
    if (!grid) return;

    grid.innerHTML = "";

    movieArray.forEach((movie, index) => {
        grid.innerHTML += `
            <div class="card" onclick="goToDetails(${movies.indexOf(movie)})">
                <div class="poster-wrapper">
                    <img src="https://picsum.photos/300/450?random=${index}" alt="${movie.title}">
                </div>
                <h3>${movie.title}</h3>
            </div>
        `;
    });
}

function setupHomeEvents() {

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                applyFilters();
            }
        });
    }

    const yearFilter = document.getElementById("yearFilter");
    if (yearFilter) {
        yearFilter.addEventListener("change", applyFilters);
    }

    const sortBtn = document.getElementById("sortBtn");
    if (sortBtn) {
        sortBtn.addEventListener("click", handleSort);
    }
}

/* =========================
   FILTER + SORT
========================= */

function applyFilters() {
    const searchValue = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const yearValue = document.getElementById("yearFilter")?.value || "All";

    currentMovies = originalMovies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchValue);
        const matchesYear = yearValue === "All" || movie.year == yearValue;
        return matchesSearch && matchesYear;
    });

    const grid = document.getElementById("movieGrid");
    const noResults = document.getElementById("noResults");

    if (currentMovies.length === 0) {
        grid.style.display = "none";
        noResults.style.display = "flex";
    } else {
        grid.style.display = "grid";
        noResults.style.display = "none";
        displayMovies(currentMovies);
    }
}
function handleSort() {

    sortState++;

    if (sortState === 1) {
        currentMovies.sort((a, b) => a.title.localeCompare(b.title));
        document.getElementById("sortBtn").textContent = "Sort: A-Z";
    }

    else if (sortState === 2) {
        currentMovies.sort((a, b) => b.title.localeCompare(a.title));
        document.getElementById("sortBtn").textContent = "Sort: Z-A";
    }

    else {
        currentMovies = [...originalMovies];
        applyFilters(); // reapply search + year
        sortState = 0;
        document.getElementById("sortBtn").textContent = "Sort: Default";
        return;
    }

    displayMovies(currentMovies);
}

/* =========================
   DETAILS PAGE
========================= */

function goToDetails(index) {
    localStorage.setItem("selectedMovieIndex", index);
    window.location.href = "details.html";
}

function showDetails() {
    const container = document.getElementById("detailsContainer");
    if (!container) return;

    const index = localStorage.getItem("selectedMovieIndex");

    if (index === null || !movies[index]) {
        container.innerHTML = "<h2 style='padding:50px;'>No movie selected.</h2>";
        return;
    }

    const movie = movies[index];

    container.innerHTML = `
        <div class="details-card">
            <img src="https://picsum.photos/300/450?random=${movies.indexOf(movie)}" alt="${movie.title}">
            <div class="details-text">
                <h2>${movie.title}</h2>
                <p><strong>Director:</strong> ${movie.director}</p>
                <p><strong>Starring:</strong> ${movie.starring.join(", ")}</p>
                <p><strong>Production:</strong> ${movie.production_companies.join(", ")}</p>
                <p><strong>Distributor:</strong> ${movie.distributor}</p>
                <p><strong>Running Time:</strong> ${movie.running_time} min</p>
                <p><strong>Country:</strong> ${movie.country}</p>
                <p><strong>Budget:</strong> $${movie.budget.toLocaleString()}</p>
                <p><strong>Box Office:</strong> $${movie.box_office.toLocaleString()}</p>
                <p><strong>Language:</strong> ${movie.language}</p>
            </div>
        </div>
    `;
}

function goBack() {
    window.location.href = "index.html";
}