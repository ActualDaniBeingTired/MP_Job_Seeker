/* =========================
   PROFILE DATA
========================= */

let profileData = {};

let applicationData = [];

/* =========================
   ELEMENTS
========================= */

const profileTab =
document.getElementById(
    "profileTab"
);

const applicationTab =
document.getElementById(
    "applicationTab"
);

const savedTab =
document.getElementById(
    "savedTab"
);

const tabButtons =
document.querySelectorAll(
    ".tab-btn"
);

const editModal =
document.getElementById(
    "editModal"
);

const editProfileBtn =
document.getElementById(
    "editProfileBtn"
);

const profileModalCloseBtn =
document.querySelector(
    ".close-modal"
);

const saveProfileBtn =
document.getElementById(
    "saveProfileBtn"
);

const profileUpload =
document.getElementById(
    "profileUpload"
);

/* =========================
   LOAD PROFILE
========================= */

function loadProfile() {

    const savedProfile =

    JSON.parse(
        localStorage.getItem(
            "profileData"
        )
    );

    if (savedProfile) {

        profileData =
        savedProfile;

    } else {

        const user =

        JSON.parse(
            localStorage.getItem(
                "registeredUser"
            )
        );

        profileData = {

            name:
            user?.fullName || "",

            email:
            user?.email || "",

            phone:
            user?.phone || "",

            location:
            user?.address || "",

            jobTitle:
            "Healthcare Professional",

            about:
            "Tell employers about yourself.",

            skills: [],

            certifications: [],

            profileImage:
            "../Icons/person.png"

        };

    }

    renderProfile();

}

loadProfile();

/* =========================
   RENDER PROFILE
========================= */

function renderProfile() {

    const profileName =
    document.getElementById(
        "profileName"
    );

    const profileJob =
    document.getElementById(
        "profileJob"
    );

    const profilePhone =
    document.getElementById(
        "profilePhone"
    );

    const profileEmail =
    document.getElementById(
        "profileEmail"
    );

    const profileLocation =
    document.getElementById(
        "profileLocation"
    );

    const profileAbout =
    document.getElementById(
        "profileAbout"
    );

    if (profileName)
        profileName.textContent =
        profileData.name;

    if (profileJob)
        profileJob.textContent =
        profileData.jobTitle;

    if (profilePhone)
        profilePhone.textContent =
        profileData.phone;

    if (profileEmail)
        profileEmail.textContent =
        profileData.email;

    if (profileLocation)
        profileLocation.textContent =
        profileData.location;

    if (profileAbout)
        profileAbout.textContent =
        profileData.about;

    const profileImage =
    document.getElementById(
        "profileImage"
    );

    if (profileImage) {

        profileImage.src =
        profileData.profileImage;

    }

    renderSkills();
    renderCertifications();

}
/* =========================
   SKILLS
========================= */

function renderSkills() {

    const container =
    document.getElementById(
        "skillsContainer"
    );

    if (!container) return;

    container.innerHTML =
    profileData.skills
    .map(skill => `
        <span class="tag">
            ${escapeHtml(skill)}
        </span>
    `)
    .join("");

}

/* =========================
   CERTIFICATIONS
========================= */

function renderCertifications() {

    const container =
    document.getElementById(
        "certificationContainer"
    );

    if (!container) return;

    container.innerHTML =
    profileData.certifications
    .map(cert => `
        <span class="tag">
            ${escapeHtml(cert)}
        </span>
    `)
    .join("");

}

/* =========================
   APPLICATIONS
========================= */

function loadApplications() {

    applicationData =

    JSON.parse(
        localStorage.getItem(
            "applications"
        )
    ) || [];

    renderApplications();

}

loadApplications();

function renderApplications() {

    const container =
    document.getElementById(
        "applicationContainer"
    );

    if (!container) return;

    if (applicationData.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <img src="../Icons/resume.png" alt="">
                <h3>No applications yet</h3>
                <p>Jobs you apply to will show up here so you can track their status.</p>
                <a href="../html/Jobs.html" class="empty-state-btn">Browse Jobs</a>
            </div>
        `;

        updateStats();
        return;

    }

    container.innerHTML =
    applicationData.map(app => `
        <div class="application-card">

            <div class="application-icon">
                <img src="../Icons/career.png" alt="">
            </div>

            <div class="application-info">

                <div class="application-top">

                    <div>
                        <h3>
                            ${escapeHtml(app.jobTitle)}
                        </h3>

                        <p class="application-company">
                            ${escapeHtml(app.company)}
                        </p>
                    </div>

                    <span
                        class="status ${escapeHtml((app.status || "").toLowerCase())}"
                    >
                        ${escapeHtml(app.status)}
                    </span>

                </div>

                <div class="application-meta">

                    <span>
                        <img src="../Icons/location-pin.png" alt="">
                        ${escapeHtml(app.location)}
                    </span>

                    <span>
                        <img src="../Icons/wallet.png" alt="">
                        ${escapeHtml(app.salary)}
                    </span>

                </div>

            </div>

        </div>
    `)
    .join("");

    updateStats();

}

/* =========================
   STATS
========================= */

function renderSavedJobs() {

    const container =
    document.getElementById("savedJobsContainer");

    if (!container) return;

    const savedIds =
    JSON.parse(
        localStorage.getItem("savedJobs")
    ) || [];

    if (savedIds.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <img src="../Icons/bookmark.png" alt="">
                <h3>No saved jobs yet</h3>
                <p>Bookmark jobs you're interested in and they'll show up here.</p>
                <a href="../html/Jobs.html" class="empty-state-btn">Browse Jobs</a>
            </div>
        `;

        return;

    }

    container.innerHTML = `<p class="saved-loading">Loading saved jobs...</p>`;

    fetch("../data/jobs.json")
        .then(response => response.json())
        .then(allJobs => {

            const savedJobs =
            allJobs.filter(
                job => savedIds.includes(job.id)
            );

            if (savedJobs.length === 0) {

                container.innerHTML = `
                    <div class="empty-state">
                        <img src="../Icons/bookmark.png" alt="">
                        <h3>No saved jobs yet</h3>
                        <p>Bookmark jobs you're interested in and they'll show up here.</p>
                        <a href="../html/Jobs.html" class="empty-state-btn">Browse Jobs</a>
                    </div>
                `;

                return;

            }

            container.innerHTML =
            savedJobs.map(job => `
                <div class="application-card">

                    <div class="application-icon">
                        <img src="${escapeHtml(job.icon)}" alt="">
                    </div>

                    <div class="application-info">

                        <div class="application-top">

                            <div>
                                <h3>
                                    ${escapeHtml(job.title)}
                                </h3>

                                <p class="application-company">
                                    ${escapeHtml(job.company)}
                                </p>
                            </div>

                            <button
                                class="remove-saved-btn"
                                data-id="${job.id}"
                                title="Remove from saved"
                            >
                                &times;
                            </button>

                        </div>

                        <div class="application-meta">

                            <span>
                                <img src="../Icons/location-pin.png" alt="">
                                ${escapeHtml(job.location)}
                            </span>

                            <span>
                                <img src="../Icons/wallet.png" alt="">
                                ${escapeHtml(job.salary)}
                            </span>

                        </div>

                    </div>

                </div>
            `)
            .join("");

            container.querySelectorAll(".remove-saved-btn").forEach(btn => {

                btn.addEventListener("click", () => {

                    const id = Number(btn.dataset.id);

                    const updated =
                    (JSON.parse(localStorage.getItem("savedJobs")) || [])
                    .filter(item => item !== id);

                    localStorage.setItem(
                        "savedJobs",
                        JSON.stringify(updated)
                    );

                    if (typeof showToast === "function") {

                        showToast("Removed from saved jobs.", "info");

                    }

                    updateStats();
                    renderSavedJobs();

                });

            });

        })
        .catch(() => {

            container.innerHTML = `<p class="saved-loading">Couldn't load saved jobs.</p>`;

        });

}

function updateStats() {

    document.getElementById(
        "appliedCount"
    ).textContent =
    applicationData.length;

    const savedJobs =

    JSON.parse(
        localStorage.getItem(
            "savedJobs"
        )
    ) || [];

    document.getElementById(
        "savedCount"
    ).textContent =
    savedJobs.length;

    document.getElementById(
        "interviewCount"
    ).textContent =

    applicationData.filter(
        app =>
        app.status ===
        "Accepted"
    ).length;

}

/* =========================
   TAB SWITCHING
========================= */

const tabPanels = {
    profile: profileTab,
    application: applicationTab,
    saved: savedTab
};

tabButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            tabButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });

            button.classList.add(
                "active"
            );

            const tab =
            button.dataset.tab;

            Object.values(tabPanels).forEach(panel => {

                if (panel) panel.classList.remove("active");

            });

            if (tabPanels[tab]) {

                tabPanels[tab].classList.add("active");

            }

            if (tab === "saved") {

                renderSavedJobs();

            }

        }
    );

});

/* =========================
   OPEN MODAL
========================= */

if (editProfileBtn) {

    editProfileBtn.onclick = () => {

        document.getElementById(
            "editName"
        ).value =
        profileData.name;

        document.getElementById(
            "editJob"
        ).value =
        profileData.jobTitle;

        document.getElementById(
            "editPhone"
        ).value =
        profileData.phone;

        document.getElementById(
            "editEmail"
        ).value =
        profileData.email;

        document.getElementById(
            "editLocation"
        ).value =
        profileData.location;

        document.getElementById(
            "editAbout"
        ).value =
        profileData.about;

        document.getElementById(
            "editSkills"
        ).value =
        profileData.skills.join(", ");

        document.getElementById(
            "editCertifications"
        ).value =
        profileData.certifications.join(", ");

        editModal.classList.add(
            "active"
        );

    };

}

/* =========================
   CLOSE MODAL
========================= */

if (profileModalCloseBtn) {

    profileModalCloseBtn.onclick = () => {

        editModal.classList.remove(
            "active"
        );

    };

}

/* =========================
   PHOTO UPLOAD
========================= */

if (profileUpload) {

    profileUpload.addEventListener(
        "change",
        function () {

            const file =
            this.files[0];

            if (!file) return;

            const reader =
            new FileReader();

            reader.onload =
            function(event){

                profileData.profileImage =
                event.target.result;

                document
                .getElementById(
                    "profileImage"
                )
                .src =
                event.target.result;

                const navProfile =
                document.getElementById(
                    "navProfileImage"
                );

                if (navProfile) {

                    navProfile.src =
                    event.target.result;

                }

            };

            reader.readAsDataURL(
                file
            );

        }
    );

}

/* =========================
   SAVE PROFILE
========================= */

if (saveProfileBtn) {

    saveProfileBtn.onclick = () => {

        profileData.name =
        document.getElementById(
            "editName"
        ).value;

        profileData.jobTitle =
        document.getElementById(
            "editJob"
        ).value;

        profileData.phone =
        document.getElementById(
            "editPhone"
        ).value;

        profileData.email =
        document.getElementById(
            "editEmail"
        ).value;

        profileData.location =
        document.getElementById(
            "editLocation"
        ).value;

        profileData.about =
        document.getElementById(
            "editAbout"
        ).value;

        profileData.skills =
        document
        .getElementById(
            "editSkills"
        )
        .value
        .split(",")
        .map(skill =>
            skill.trim()
        )
        .filter(skill =>
            skill.length > 0
        );

        profileData.certifications =

        document
        .getElementById(
            "editCertifications"
        )
        .value
        .split(",")

        .map(cert =>
            cert.trim()
        )

        .filter(cert =>
            cert !== ""
        );

        localStorage.setItem(

            "profileData",

            JSON.stringify(
                profileData
            )

        );

        renderProfile();

        editModal.classList.remove(
            "active"
        );

        showToast(
            "Profile updated successfully!",
            "success"
        );

    };

}

window.addEventListener(
    "click",
    (e) => {

        if (
            e.target === editModal
        ) {

            editModal.classList.remove(
                "active"
            );

        }

    }
);
