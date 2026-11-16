/* =====================================
   HOMEPAGE SEARCH
===================================== */

const searchBtn =
document.getElementById("searchBtn");

if (searchBtn) {

    searchBtn.addEventListener(
        "click",
        () => {

            const jobInput =
            document.getElementById(
                "jobInput"
            );

            const locationSelect =
            document.getElementById(
                "locationSelect"
            );

            const job =
            jobInput
            ? jobInput.value.trim()
            : "";

            const location =
            locationSelect
            ? locationSelect.value
            : "";

            if (!job) {

                showToast(
                    "Please enter a job title.",
                    "error"
                );

                return;

            }

            const params =
            new URLSearchParams({

                search: job,
                location: location

            });

            window.location.href =
            `Jobs.html?${params.toString()}`;

        }
    );

}

/* =====================================
   CATEGORY CARDS
   Clicking a card (or its arrow button)
   goes to the Jobs page pre-filtered to
   that category. Open-position counts
   are pulled live from jobs.json so they
   stay accurate as the data changes.
===================================== */

const categoryCards =
document.querySelectorAll(".category-card");

categoryCards.forEach(card => {

    const category = card.dataset.category;

    if (!category) return;

    card.addEventListener("click", () => {

        window.location.href =
        `Jobs.html?category=${encodeURIComponent(category)}`;

    });

});

fetch("../data/jobs.json")
    .then(response => response.json())
    .then(jobs => {

        categoryCards.forEach(card => {

            const category = card.dataset.category;
            const countEl = card.querySelector(".open-count");

            if (!category || !countEl) return;

            const count =
            jobs.filter(
                job => (job.category || "").toLowerCase() === category
            ).length;

            countEl.textContent =
            count === 1
            ? "1 Open Position"
            : `${count} Open Positions`;

        });

    })
    .catch(error => {

        console.error(
            "Failed to load job counts:",
            error
        );

    });