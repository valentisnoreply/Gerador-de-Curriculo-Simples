const form = document.querySelector("#profileForm");
const preview = document.querySelector("#preview");
const printButton = document.querySelector(".print-button");

const textBindings = [
  "name",
  "headline",
  "age",
  "location",
  "phone",
  "email",
  "linkedin",
  "summary",
  "objective",
];

const getValue = (name) => {
  const field = form.elements[name];
  return field ? field.value.trim() : "";
};

const updateTextBindings = () => {
  textBindings.forEach((key) => {
    const target = preview.querySelector(`[data-bind="${key}"]`);
    if (target) {
      target.textContent = getValue(key);
    }
  });
};

const updateInitials = () => {
  const name = getValue("name");
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
  const target = preview.querySelector('[data-bind="initials"]');
  if (target) {
    target.textContent = initials || "??";
  }
};

const createItem = (title, meta, description) => {
  const wrapper = document.createElement("div");
  wrapper.className = "item";

  if (title) {
    const titleEl = document.createElement("p");
    titleEl.className = "item-title";
    titleEl.textContent = title;
    wrapper.appendChild(titleEl);
  }

  if (meta) {
    const metaEl = document.createElement("p");
    metaEl.className = "item-meta";
    metaEl.textContent = meta;
    wrapper.appendChild(metaEl);
  }

  if (description) {
    const descEl = document.createElement("p");
    descEl.textContent = description;
    wrapper.appendChild(descEl);
  }

  return wrapper;
};

const updateEducation = () => {
  const container = preview.querySelector('[data-bind="education"]');
  if (!container) return;
  container.innerHTML = "";

  const lines = getValue("education")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  lines.forEach((line) => {
    const parts = line.split("|").map((part) => part.trim());
    const title = parts[0] || "";
    const meta = parts.slice(1).join(" | ");
    container.appendChild(createItem(title, meta, ""));
  });
};

const updateProjects = () => {
  const container = preview.querySelector('[data-bind="projects"]');
  if (!container) return;
  container.innerHTML = "";

  const blocks = getValue("projects")
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  blocks.forEach((block) => {
    const lines = block.split("\n").map((line) => line.trim());
    const header = lines.shift() || "";
    const parts = header.split("|").map((part) => part.trim());
    const title = parts[0] || "";
    const meta = parts.slice(1).join(" | ");
    const description = lines.join(" ");
    container.appendChild(createItem(title, meta, description));
  });
};

const updateSkills = () => {
  const container = preview.querySelector('[data-bind="skills"]');
  if (!container) return;
  container.innerHTML = "";

  getValue("skills")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .forEach((skill) => {
      const tag = document.createElement("span");
      tag.textContent = skill;
      container.appendChild(tag);
    });
};

const updateExtras = () => {
  const container = preview.querySelector('[data-bind="extras"]');
  if (!container) return;
  container.innerHTML = "";

  getValue("extras")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      container.appendChild(li);
    });
};

const updateToggles = () => {
  const toggles = form.querySelectorAll("input[type='checkbox'][data-target]");
  toggles.forEach((toggle) => {
    const section = preview.querySelector(
      `[data-section="${toggle.dataset.target}"]`
    );
    if (section) {
      section.style.display = toggle.checked ? "" : "none";
    }
  });
};

const updatePreview = () => {
  updateTextBindings();
  updateInitials();
  updateEducation();
  updateProjects();
  updateSkills();
  updateExtras();
  updateToggles();
};

const updateLayout = () => {
  const layout = getValue("layout");
  const theme = getValue("theme");
  preview.classList.toggle("is-a4", layout === "classic");
  preview.classList.toggle("is-classic", layout === "classic");
  document.body.dataset.theme = theme || "warm";
};

form.addEventListener("input", updatePreview);
form.addEventListener("change", updatePreview);
printButton.addEventListener("click", () => window.print());

updatePreview();
updateLayout();

form.addEventListener("change", updateLayout);
form.addEventListener("input", (event) => {
  if (event.target.name === "layout" || event.target.name === "theme") {
    updateLayout();
  }
});
