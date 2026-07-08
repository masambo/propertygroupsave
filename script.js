const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const filterButtons = document.querySelectorAll(".filter-button");
const propertyCards = document.querySelectorAll(".property-card");
const enquiryForm = document.querySelector("#enquiry-form");
const formMessage = document.querySelector("#form-message");
const heroSlides = document.querySelectorAll(".hero-slides img");
const servicesSection = document.querySelector(".services-section");
const serviceCarousel = document.querySelector(".service-grid");
const serviceCarouselProgress = document.querySelector(".carousel-hint span");
const applyModal = document.querySelector("#application-form");
const applyTriggers = document.querySelectorAll(".apply-trigger");
const closeApplyButtons = document.querySelectorAll("[data-close-apply]");
const downloadFormButton = document.querySelector(".download-form-button");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const transitionLayer = document.querySelector(".page-transition");
const internalPageLinks = document.querySelectorAll('a[href^="#"]:not(.apply-trigger)');

menuToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href").startsWith("#")) return;
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

const focusSection = (section) => {
  section.classList.remove("section-focus");
  void section.offsetWidth;
  section.classList.add("section-focus");
};

const navigateWithTransition = (targetId) => {
  const target = document.querySelector(targetId);
  if (!target || !transitionLayer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  transitionLayer.classList.remove("exit");
  transitionLayer.classList.add("active");

  window.setTimeout(() => {
    target.scrollIntoView({ behavior: "auto", block: "start" });
    history.pushState(null, "", targetId);
    setActiveNav(target.id);
    focusSection(target);
    siteNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    transitionLayer.classList.remove("active");
    transitionLayer.classList.add("exit");
  }, 520);

  window.setTimeout(() => {
    transitionLayer.classList.remove("exit");
  }, 980);
};

internalPageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    navigateWithTransition(targetId);
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const filter = button.dataset.filter;
    propertyCards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.location !== filter;
    });
  });
});

enquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  enquiryForm.reset();
  formMessage.textContent = "Thank you for contacting Property Group Save Namibia. Our team has received your enquiry and will contact you with more information about available unserviced land options.";
});

const updateCarouselProgress = () => {
  if (!serviceCarousel || !serviceCarouselProgress) return;

  const maxScroll = serviceCarousel.scrollWidth - serviceCarousel.clientWidth;
  if (maxScroll <= 0) {
    serviceCarouselProgress.style.width = "100%";
    serviceCarouselProgress.style.left = "0";
    return;
  }

  const progressWidth = Math.max((serviceCarousel.clientWidth / serviceCarousel.scrollWidth) * 100, 22);
  const travel = 100 - progressWidth;
  const progress = serviceCarousel.scrollLeft / maxScroll;

  serviceCarouselProgress.style.animation = "none";
  serviceCarouselProgress.style.width = `${progressWidth}%`;
  serviceCarouselProgress.style.left = `${progress * travel}%`;
};

if (serviceCarousel && servicesSection) {
  let carouselPaused = false;
  let carouselLoopPoint = 0;

  Array.from(serviceCarousel.children).forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    serviceCarousel.appendChild(clone);
  });

  const updateCarouselLoopPoint = () => {
    carouselLoopPoint = serviceCarousel.scrollWidth / 2;
  };

  const loopCarousel = () => {
    if (!carouselPaused && carouselLoopPoint > serviceCarousel.clientWidth) {
      serviceCarousel.scrollLeft += 0.65;

      if (serviceCarousel.scrollLeft >= carouselLoopPoint) {
        serviceCarousel.scrollLeft = 0;
      }

      updateCarouselProgress();
    }

    window.requestAnimationFrame(loopCarousel);
  };

  serviceCarousel.addEventListener("pointerdown", () => {
    carouselPaused = true;
  });

  window.addEventListener("pointerup", () => {
    carouselPaused = false;
  });

  serviceCarousel.addEventListener("scroll", updateCarouselProgress);
  window.addEventListener("resize", () => {
    updateCarouselLoopPoint();
    updateCarouselProgress();
  });
  updateCarouselLoopPoint();
  updateCarouselProgress();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.requestAnimationFrame(loopCarousel);
  }
}

const openApplyModal = () => {
  applyModal.classList.add("open");
  applyModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};

const closeApplyModal = () => {
  applyModal.classList.remove("open");
  applyModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
};

applyTriggers.forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    openApplyModal();
  });
});

closeApplyButtons.forEach((button) => {
  button.addEventListener("click", closeApplyModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && applyModal.classList.contains("open")) {
    closeApplyModal();
  }
});

downloadFormButton.addEventListener("click", () => {
  window.setTimeout(closeApplyModal, 250);
});

if (heroSlides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let activeSlide = 0;

  setInterval(() => {
    heroSlides[activeSlide].classList.remove("active");
    activeSlide = (activeSlide + 1) % heroSlides.length;
    heroSlides[activeSlide].classList.add("active");
  }, 4500);
}

const navSections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveNav = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
  });
};

if (navSections.length) {
  const updateActiveNavFromScroll = () => {
    const headerOffset = 130;
    let currentSection = navSections[0];

    navSections.forEach((section) => {
      if (section.getBoundingClientRect().top <= headerOffset) {
        currentSection = section;
      }
    });

    if (currentSection) {
      setActiveNav(currentSection.id);
    }
  };

  const navObserver = new IntersectionObserver((entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visibleEntry) {
      setActiveNav(visibleEntry.target.id);
    }
  }, {
    rootMargin: "-35% 0px -50% 0px",
    threshold: [0.08, 0.2, 0.45, 0.7]
  });

  navSections.forEach((section) => navObserver.observe(section));
  window.addEventListener("scroll", updateActiveNavFromScroll, { passive: true });
  window.addEventListener("resize", updateActiveNavFromScroll);
  updateActiveNavFromScroll();
}

const revealItems = document.querySelectorAll([
  ".section",
  ".property-card",
  ".service-grid article",
  ".development-card",
  ".mortgage-card",
  ".faq-list details",
  ".footer-top",
  ".footer-card"
].join(","));

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && revealItems.length) {
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 70}ms`);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: "0px 0px -12% 0px",
    threshold: 0.12
  });

  revealItems.forEach((item) => revealObserver.observe(item));
}
