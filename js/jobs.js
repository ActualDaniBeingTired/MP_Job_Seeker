let jobsData = [];

let activeCategory = "all";

const urlParams =
new URLSearchParams(
    window.location.search
);

const initialSearch =
urlParams.get("search") || "";

const initialLocation =
urlParams.get("location") || "";

const initialCategory =
(urlParams.get("category") || "all").toLowerCase();

const jobModal = document.getElementById("jobModal");
const jobModalCloseBtn = document.querySelector(".close-modal");
const applyConfirmBtn = document.querySelector(".apply-confirm-btn");

// Tracks which job the apply modal is currently open for,
// so "Confirm" can actually record an application.
let pendingApplyJobId = null;

// Pagination: 9 per page lines up with the 3-column grid as a clean 3x3.
const JOBS_PER_PAGE = 9;
let currentPage = 1;
let currentFilteredJobs = [];

/* =========================
   LOAD JSON
========================= */

fetch("../data/jobs.json")
    .then(response => response.json())
    .then(data => {

        jobsData = data;

        activeCategory = initialCategory;

        renderCategoryPills();

        const searchInput =
        document.getElementById(
            "jobSearch"
        );

        const locationInput =
        document.getElementById(
            "locationSearch"
        );

        if (searchInput) {

            searchInput.value =
            initialSearch;

        }

        if (locationInput) {

            locationInput.value =
            initialLocation;

        }

        filterJobs();

    })
    .catch(error => {

        console.error(
            "Failed to load jobs:",
            error
        );

    });

/* =========================
   RENDER JOBS
========================= */

function renderJobs(jobs) {

    const container =
    document.getElementById("jobsContainer");

    if (!container) return;

    if (jobs.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <img src="../Icons/search.png" alt="">
                <h3>No jobs found</h3>
                <p>Try adjusting your search or filters to find more opportunities.</p>
                <button type="button" id="clearFiltersBtn">Clear all filters</button>
            </div>
        `;

        const clearBtn =
        document.getElementById("clearFiltersBtn");

        if (clearBtn) {

            clearBtn.addEventListener("click", clearAllFilters);

        }

        const pagination =
        document.getElementById("paginationSection");

        if (pagination) pagination.innerHTML = "";

        return;

    }

    const cardsHtml = jobs.map(job => `

        <div class="job-card">

            <div class="job-header">

                <div class="job-icon">

                    <img
                        src="${escapeHtml(job.icon)}"
                        alt="${escapeHtml(job.title)}"
                    >

                </div>

                <button
                    class="bookmark-btn"
                    data-id="${job.id}"
                >

                    <img
                        src="../Icons/bookmark.png"
                        alt="Bookmark"
                    >

                </button>

            </div>

            <h3>${escapeHtml(job.title)}</h3>

            <p class="company-name">
                ${escapeHtml(job.company)}
            </p>

            <div class="job-location">

                <img
                    src="../Icons/location-pin.png"
                    alt=""
                >

                <span>
                    ${escapeHtml(job.location)}
                </span>

            </div>

            <p class="salary">
                ${escapeHtml(job.salary)}
            </p>

            <p class="experience">
                ${escapeHtml(job.experience)}+ Years Experience
            </p>

            <button
                class="apply-btn"
                data-id="${job.id}"
            >
                Apply Now
            </button>

        </div>

    `).join("");

    container.innerHTML = cardsHtml;

    attachBookmarks();
    attachApplyButtons();

    if (typeof initScrollReveal === "function") {

        initScrollReveal(".job-card");

    }

}

/* =========================
   FILTER SYSTEM
========================= */

function filterJobs() {

    const searchText =
    document.getElementById("jobSearch")
    ?.value
    .toLowerCase()
    .trim() || "";

    const locationText =
    document.getElementById("locationSearch")
    ?.value
    .toLowerCase()
    .trim() || "";

    const selectedEmployment =

    Array.from(
        document.querySelectorAll(
            ".employment-filter:checked"
        )
    ).map(item => item.value);

    const selectedExperience =

    Array.from(
        document.querySelectorAll(
            ".experience-filter:checked"
        )
    ).map(item => Number(item.value));

    const filteredJobs =

    jobsData.filter(job => {

        const matchSearch =

            job.title
            .toLowerCase()
            .includes(searchText)

            ||

            job.company
            .toLowerCase()
            .includes(searchText)

            ||

            job.location
            .toLowerCase()
            .includes(searchText);

        const matchLocation =

            locationText === ""

            ||

            job.location
            .toLowerCase()
            .includes(locationText);

        const matchCategory =


            activeCategory === "all"

            ||

            (
                job.category &&
                job.category
                .trim()
                .toLowerCase() === activeCategory
            );

        const matchEmployment =

            selectedEmployment.length === 0

            ||

            selectedEmployment.includes(
                job.employment
            );

        const matchExperience =

            selectedExperience.length === 0

            ||

            selectedExperience.some(
                exp =>
                job.experience >= exp
            );

        return (

            matchSearch

            &&

            matchLocation

            &&

            matchCategory

            &&

            matchEmployment

            &&

            matchExperience

        );

    });

    currentFilteredJobs = filteredJobs;
    currentPage = 1;

    renderPage();

}

/* =========================
   PAGINATION
========================= */

function renderPage() {

    const start = (currentPage - 1) * JOBS_PER_PAGE;
    const pageJobs =
    currentFilteredJobs.slice(
        start,
        start + JOBS_PER_PAGE
    );

    renderJobs(pageJobs);
    renderPagination();

}

function clearAllFilters() {

    const searchInput = document.getElementById("jobSearch");
    const locationInput = document.getElementById("locationSearch");

    if (searchInput) searchInput.value = "";
    if (locationInput) locationInput.value = "";

    document
    .querySelectorAll(".employment-filter, .experience-filter")
    .forEach(input => { input.checked = false; });

    activeCategory = "all";

    document
    .querySelectorAll(".category-pill")
    .forEach(pill => {

        pill.classList.toggle(
            "active",
            pill.dataset.category === "all"
        );

    });

    filterJobs();

}

function renderPagination() {

    const container =
    document.getElementById("paginationSection");

    if (!container) return;

    const totalPages =
    Math.ceil(
        currentFilteredJobs.length / JOBS_PER_PAGE
    );

    if (totalPages <= 1) {

        container.innerHTML = "";
        return;

    }

    let buttonsHtml = `
        <button class="page-btn page-prev" ${currentPage === 1 ? "disabled" : ""}>
            &lt;
        </button>
    `;

    for (let i = 1; i <= totalPages; i++) {

        buttonsHtml += `
            <button class="page-btn${i === currentPage ? " active" : ""}" data-page="${i}">
                ${i}
            </button>
        `;

    }

    buttonsHtml += `
        <button class="page-btn page-next" ${currentPage === totalPages ? "disabled" : ""}>
            &gt;
        </button>
    `;

    container.innerHTML = buttonsHtml;

    container.querySelectorAll(".page-btn[data-page]").forEach(btn => {

        btn.addEventListener("click", () => {

            currentPage = Number(btn.dataset.page);
            renderPage();
            container.scrollIntoView({ behavior: "smooth", block: "nearest" });

        });

    });

    const prevBtn = container.querySelector(".page-prev");
    const nextBtn = container.querySelector(".page-next");

    if (prevBtn) {

        prevBtn.addEventListener("click", () => {

            if (currentPage > 1) {

                currentPage--;
                renderPage();
                container.scrollIntoView({ behavior: "smooth", block: "nearest" });

            }

        });

    }

    if (nextBtn) {

        nextBtn.addEventListener("click", () => {

            if (currentPage < totalPages) {

                currentPage++;
                renderPage();
                container.scrollIntoView({ behavior: "smooth", block: "nearest" });

            }

        });

    }

}

/* =========================
   CATEGORY FILTER
========================= */

function renderCategoryPills() {

    const container =
    document.getElementById("categoryPills");

    if (!container) return;

    // Unique categories actually present in the job data,
    // so a new category in jobs.json shows up here automatically.
    const categories =
    [...new Set(
        jobsData.map(job => job.category)
    )].sort();

    const pillsHtml =
    ["all", ...categories].map(cat => {

        const label =
        cat === "all"
        ? "All"
        : escapeHtml(
            cat.charAt(0).toUpperCase() + cat.slice(1)
        );

        const isActive =
        cat === activeCategory
        ? " active"
        : "";

        return `
            <button class="category-pill${isActive}" data-category="${escapeHtml(cat)}">
                ${label}
            </button>
        `;

    }).join("");

    container.innerHTML = pillsHtml;

    attachCategoryPillEvents();

}

function attachCategoryPillEvents() {

    document
    .querySelectorAll(".category-pill")
    .forEach(button => {

        button.addEventListener("click", () => {

            document
            .querySelectorAll(".category-pill")
            .forEach(btn => {

                btn.classList.remove("active");

            });

            button.classList.add("active");

            activeCategory =
            button.dataset.category;

            filterJobs();

        });

    });

}

/* =========================
   SEARCH EVENTS
========================= */

document
.getElementById("jobSearch")
?.addEventListener(
    "input",
    filterJobs
);

document
.getElementById("locationSearch")
?.addEventListener(
    "input",
    filterJobs
);

document
.querySelectorAll(
    ".employment-filter"
)
.forEach(input => {

    input.addEventListener(
        "change",
        filterJobs
    );

});

document
.querySelectorAll(
    ".experience-filter"
)
.forEach(input => {

    input.addEventListener(
        "change",
        filterJobs
    );

});

/* =========================
   BOOKMARK SYSTEM
========================= */

function attachBookmarks() {

    let savedJobs =

    JSON.parse(
        localStorage.getItem(
            "savedJobs"
        )
    ) || [];

    const setBookmarkIcon = (button, isSaved) => {

        const img = button.querySelector("img");

        if (img) {

            img.src =
            isSaved
            ? "../Icons/bookmark-filled.png"
            : "../Icons/bookmark.png";

        }

        button.classList.toggle("saved", isSaved);

    };

    document
    .querySelectorAll(
        ".bookmark-btn"
    )
    .forEach(button => {

        const id =
        Number(
            button.dataset.id
        );

        setBookmarkIcon(button, savedJobs.includes(id));

        button.onclick = () => {

            if (
                savedJobs.includes(id)
            ) {

                savedJobs =
                savedJobs.filter(
                    item =>
                    item !== id
                );

            } else {

                savedJobs.push(id);

            }

            localStorage.setItem(
                "savedJobs",
                JSON.stringify(
                    savedJobs
                )
            );

            setBookmarkIcon(button, savedJobs.includes(id));

            button.classList.remove("pop");
            // Force reflow so the animation can replay on repeated clicks.
            void button.offsetWidth;
            button.classList.add("pop");

        };

    });

}

/* =========================
   APPLY BUTTONS
========================= */

function populateApplyModal(job) {

    const setText = (id, value) => {

        const el = document.getElementById(id);
        if (el) el.textContent = value;

    };

    const icon = document.getElementById("modalJobIcon");
    if (icon) icon.src = job.icon;

    setText("modalJobTitle", job.title);
    setText("modalJobCompany", job.company);
    setText("modalJobLocation", job.location);
    setText("modalJobSalary", job.salary);
    setText("modalJobEmployment", job.employment);

    setText(
        "modalJobExperience",
        `${job.experience}+ Years Experience`
    );

}

function attachApplyButtons() {

    document
    .querySelectorAll(
        ".apply-btn"
    )
    .forEach(button => {

        button.onclick = () => {

            pendingApplyJobId =
            Number(button.dataset.id);

            const job =
            jobsData.find(
                j => j.id === pendingApplyJobId
            );

            if (job) {

                populateApplyModal(job);

            }

            if (jobModal) {

                jobModal.classList.add(
                    "active"
                );

            }

        };

    });

}

/* =========================
   MODAL
========================= */

if (jobModalCloseBtn) {

    jobModalCloseBtn.onclick = () => {

        jobModal.classList.remove(
            "active"
        );

    };

}

window.addEventListener(
    "click",
    (e) => {

        if (
            e.target === jobModal
        ) {

            jobModal.classList.remove(
                "active"
            );

        }

    }
);

if (applyConfirmBtn) {

    applyConfirmBtn.onclick = () => {

        const job =
        jobsData.find(
            j => j.id === pendingApplyJobId
        );

        if (job) {

            const applications =
            JSON.parse(
                localStorage.getItem(
                    "applications"
                )
            ) || [];

            const alreadyApplied =
            applications.some(
                app => app.jobId === job.id
            );

            if (!alreadyApplied) {

                applications.push({
                    jobId: job.id,
                    jobTitle: job.title,
                    company: job.company,
                    location: job.location,
                    salary: job.salary,
                    status: "Pending",
                    appliedDate:
                    new Date().toISOString()
                });

                localStorage.setItem(
                    "applications",
                    JSON.stringify(applications)
                );

            }

        }

        showToast(
            "Application submitted successfully!",
            "success"
        );

        pendingApplyJobId = null;

        jobModal.classList.remove(
            "active"
        );

    };

}