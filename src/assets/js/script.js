"use-strict";

// variables
const accordion = document.getElementById("accordion");
const accordionTitle = accordion.querySelectorAll("dt");
const accordionContent = accordion.querySelectorAll("dd");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24"><path fill="currentColor" fill-rule="evenodd" d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"/></svg>`;

// Assign id to content section for accessibility
accordionContent.forEach((item, index) => {
  item.setAttribute("id", `section-content-${index + 1}`);
});

// Setup section title element with accessibility attributes and toggle functionality
accordionTitle.forEach((title, index) => {
  title.setAttribute("aria-controls", `section-content-${index + 1}`);
  title.setAttribute("aria-expanded", "false");
  title.insertAdjacentHTML("beforeend", svg);

  title.addEventListener("click", () => {
    const expanded = title.getAttribute("aria-expanded") === "true";
    title.setAttribute("aria-expanded", `${!expanded}`);

    // Close all other sections
    Array.from(accordionTitle)
      .filter((other) => other !== title)
      .forEach((el) => el.setAttribute("aria-expanded", "false"));
  });
});

// BONUS
const bonusAccordion = document.getElementById("accordion-bonus");
class AccordionContainer {
  constructor(container) {
    this.container = container;
    this.dl = this.createContainer();
    this.container.appendChild(this.dl);
  }

  createContainer() {
    const dl = document.createElement("dl");
    dl.classList.add("accordion");
    return dl;
  }

  get element() {
    return this.dl;
  }
}

class AccordionSection {
  constructor(data, container) {
    this.data = data;
    this.container = container;
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.svg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="24" viewBox="0 0 12 24"><path fill="currentColor" fill-rule="evenodd" d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"/></svg>`;

    this.dt = this.createTitleSection();
    this.dd = this.createContentSection();
    this.container.appendChild(this.dt);
    this.container.appendChild(this.dd);
  }

  createTitleSection() {
    const dt = document.createElement("dt");
    dt.textContent = this.title;
    dt.setAttribute("aria-expanded", "false");
    dt.setAttribute("aria-controls", `section-content-${this.id}`);
    dt.insertAdjacentHTML("beforeend", this.svg);
    dt.addEventListener("click", (e) => this.onClick(e));
    return dt;
  }

  createContentSection() {
    const dd = document.createElement("dd");
    dd.textContent = this.content;
    dd.setAttribute("id", `section-content-${this.id}`);
    return dd;
  }

  onClick(e) {
    e.preventDefault();
    const isExpanded = this.dt.getAttribute("aria-expanded") === "true";
    this.dt.setAttribute("aria-expanded", !isExpanded);
    if (
      AccordionSection.lastOpened &&
      AccordionSection.lastOpened !== this.dt
    ) {
      this.closeLastOpened(AccordionSection.lastOpened);
    }
    AccordionSection.lastOpened = this.dt;
  }

  closeLastOpened(el) {
    el.setAttribute("aria-expanded", "false");
  }

  // Alternative approach. Closes all other sections by first scanning the DOM
  // Not used for potential performance issues in larger projects.

  //   closeOtherSections(arr) {
  //     arr
  //       .filter((other) => {
  //         const otherId = other.getAttribute("aria-controls").split("-").pop();
  //         return otherId !== `${this.id}`;
  //       })
  //       .forEach((el) => el.setAttribute("aria-expanded", "false"));
  //   }
  //   get allSections() {
  //     return Array.from(this.container.querySelectorAll("dt"));
  //   }
}

fetch("./assets/js/data.json")
  .then((response) => {
    if (!response.ok) throw new Error(`Data not found (${response.status})`);
    return response.json();
  })
  .then((data) => {
    const accordionContainer = new AccordionContainer(bonusAccordion);
    data.forEach(
      (data) => new AccordionSection(data, accordionContainer.element)
    );
  })
  .catch((err) => {
    console.error(`Something went wrong. ${err}`);
  });
