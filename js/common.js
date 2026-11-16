/* =====================================
   SAFE MESSAGE FUNCTION
===================================== */

function showMessage(id, message, type) {

    const box = document.getElementById(id);

    if (!box) return;

    box.textContent = message;
    box.className = "form-message " + type;
}

/* =====================================
   PASSWORD TOGGLE
===================================== */

function togglePassword(inputId) {

    const input = document.getElementById(inputId);

    if (!input) return;

    input.type =
        input.type === "password"
        ? "text"
        : "password";
}

/* =====================================
   HTML ESCAPE (prevents injected markup
   from job data / user profile fields
   being rendered as live HTML)
===================================== */

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/* =====================================
   SCROLL TO TOP
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.createElement("button");
    btn.id = "scrollTopBtn";
    btn.setAttribute("aria-label", "Scroll to top");
    btn.innerHTML = "&uarr;";
    document.body.appendChild(btn);

    window.addEventListener("scroll", () => {

        if (window.scrollY > 500) {

            btn.classList.add("show");

        } else {

            btn.classList.remove("show");

        }

    });

    btn.addEventListener("click", () => {

        window.scrollTo({ top: 0, behavior: "smooth" });

    });

});

/* =====================================
   MOBILE NAV TOGGLE
===================================== */

/* =====================================
   SCROLL REVEAL
   Applies a fade/slide-in effect to common
   card and section types as they scroll
   into view. Works across every page
   without needing per-page markup changes.
===================================== */

/* =====================================
   TOAST NOTIFICATIONS
===================================== */

function showToast(message, type) {

    type = type || "info";

    let container = document.getElementById("toastContainer");

    if (!container) {

        container = document.createElement("div");
        container.id = "toastContainer";
        document.body.appendChild(container);

    }

    const toast = document.createElement("div");
    toast.className = "toast " + type;

    const icon =
    type === "success" ? "\u2713" :
    type === "error" ? "\u2715" :
    "i";

    toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span class="toast-message"></span>
    `;

    toast.querySelector(".toast-message").textContent = message;

    container.appendChild(toast);

    requestAnimationFrame(() => {

        toast.classList.add("show");

    });

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => toast.remove(), 300);

    }, 3500);

}

function initScrollReveal(selector) {

    const els = document.querySelectorAll(selector);
    const newEls = [...els].filter(
        el => !el.classList.contains("reveal")
    );

    if (!newEls.length) return;

    newEls.forEach(el => el.classList.add("reveal"));

    const observer = new IntersectionObserver((entries) => {

        entries.forEach((entry, i) => {

            if (entry.isIntersecting) {

                // Small stagger within a group so grids feel lively
                // rather than popping in all at once.
                setTimeout(() => {

                    entry.target.classList.add("visible");

                }, (i % 6) * 70);

                observer.unobserve(entry.target);

            }

        });

    }, { threshold: 0, rootMargin: "0px 0px 0px 0px" });

    newEls.forEach(el => observer.observe(el));

}

document.addEventListener("DOMContentLoaded", () => {

    // Static content present at load time.
    initScrollReveal(
        ".category-card, .why-card, .card, .stat-card, " +
        ".info-sidebar, .content-panel, .register-container, " +
        ".login-card, .profile-card"
    );

});

document.addEventListener("DOMContentLoaded", () => {

    const navToggle = document.getElementById("navToggle");
    const navLinks = document.querySelector(".nav-links");

    if (!navToggle || !navLinks) return;

    navToggle.addEventListener("click", (e) => {

        e.stopPropagation();

        navToggle.classList.toggle("active");
        navLinks.classList.toggle("active");

        navToggle.setAttribute(
            "aria-expanded",
            navToggle.classList.contains("active")
        );

    });

    // Close the menu after picking a link, and on outside click
    navLinks.querySelectorAll("a").forEach(link => {

        link.addEventListener("click", () => {

            navToggle.classList.remove("active");
            navLinks.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");

        });

    });

    document.addEventListener("click", (e) => {

        if (
            navLinks.classList.contains("active") &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)
        ) {

            navToggle.classList.remove("active");
            navLinks.classList.remove("active");
            navToggle.setAttribute("aria-expanded", "false");

        }

    });

});