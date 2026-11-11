"use strict";

const methods = [
  { id: "hazy", zh: "原始有雾图", en: "Hazy Image" },
  { id: "fmrp", zh: "FMRP", en: "FMRP" },
  { id: "mrp", zh: "MRP", en: "MRP" },
  { id: "gapsf", zh: "GAPSF", en: "GAPSF" },
  { id: "nighthaze", zh: "NightHaze", en: "NightHaze" },
  { id: "hdp-net", zh: "HDP-NET", en: "HDP-NET" },
  { id: "osfd", zh: "OSFD", en: "OSFD" },
  { id: "pdda", zh: "PDDA", en: "PDDA" },
  { id: "sfsnid", zh: "SFSNiD", en: "SFSNiD" },
  { id: "ours", zh: "本文方法", en: "Ours" },
];

const config = window.projectConfig;
const scenes = window.realNightHazeScenes;
const byId = (id) => document.getElementById(id);
const methodLabel = (id) => methods.find((method) => method.id === id)[language];
const asset = (sceneId, methodId) =>
  "./assets/realnighthaze/" + encodeURIComponent(sceneId) + "/" + methodId + ".webp";

const sceneSelect = byId("scene-select");
const stage = byId("comparison-stage");
const slider = byId("comparison-slider");
const panels = ["left", "right"].map((side) => ({
  method: side === "left" ? "hazy" : "ours",
  image: byId(side + "-image"),
  select: byId(side + "-method"),
  list: byId(side + "-method-list"),
}));
const languageLinks = Array.from(document.querySelectorAll("[data-language]"));
let language = new URLSearchParams(location.search).get("lang") === "en" ? "en" : "zh";
let currentScene = scenes[0];

const textTranslations = Array.from(document.querySelectorAll("[data-en]"), (element) => ({
  element, zh: element.textContent.trim(), en: element.dataset.en,
}));
const attributeTranslations = [
  ["aria-label", "enLabel", "[data-en-label]"],
  ["alt", "enAlt", "[data-en-alt]"],
].flatMap(([attribute, key, selector]) =>
  Array.from(document.querySelectorAll(selector), (element) => ({
    element, attribute, zh: element.getAttribute(attribute), en: element.dataset[key],
  })),
);

function fillOptionalField(id, content) {
  const field = byId(id);
  field.textContent = content;
  field.hidden = !content.trim();
}

function updateLanguage() {
  document.documentElement.lang = language === "en" ? "en" : "zh-CN";
  for (const entry of textTranslations) entry.element.textContent = entry[language];
  for (const entry of attributeTranslations) entry.element.setAttribute(entry.attribute, entry[language]);
  for (const link of languageLinks) {
    if (link.dataset.language === language) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
  document.title = byId("paper-title").textContent.trim();
  for (const panel of panels) {
    for (const option of panel.select.options) option.textContent = methodLabel(option.value);
    for (const button of panel.list.children) button.textContent = methodLabel(button.dataset.method);
    updatePanel(panel);
  }
  byId("authors").textContent = config.authors[language];
  fillOptionalField("affiliation", config.affiliation[language]);
  fillOptionalField("venue", config.venue[language]);
  fillOptionalField("abstract-text", config.abstract[language]);
  byId("bibtex").textContent = config.bibtex;
  byId("citation").hidden = !config.bibtex.trim();
  for (const heading of document.querySelectorAll(".method-column")) {
    heading.textContent = language === "en" ? "Method" : "方法";
  }
  for (const label of document.querySelectorAll(".ours-label")) label.textContent = methodLabel("ours");
}

function updatePanel(panel) {
  panel.select.value = panel.method;
  for (const button of panel.list.children) {
    button.setAttribute("aria-pressed", String(button.dataset.method === panel.method));
  }
  panel.image.src = asset(currentScene.id, panel.method);
  panel.image.alt = currentScene.name + " · " + methodLabel(panel.method);
}

function chooseScene(scene) {
  currentScene = scene;
  sceneSelect.value = scene.id;
  sceneSelect.title = scene.name;
  stage.style.setProperty("--scene-ratio", scene.width + " / " + scene.height);
  panels.forEach(updatePanel);
}

function moveDivider() {
  stage.style.setProperty("--split", slider.value + "%");
}

function createTable(dataset, rows) {
  const fragment = byId("metrics-template").content.cloneNode(true);
  fragment.querySelector(".table-scroll").setAttribute("aria-label", dataset);
  fragment.querySelector("caption").textContent = dataset;
  const body = fragment.querySelector("tbody");
  for (const [label, ...scores] of rows) {
    const row = body.insertRow();
    const name = document.createElement("th");
    name.scope = "row";
    name.textContent = label;
    if (label === "Ours") name.classList.add("ours-label");
    row.append(name);
    for (const [value, rank] of scores) {
      const cell = row.insertCell();
      if (rank) {
        const score = document.createElement(rank === "best" ? "strong" : "u");
        score.textContent = value;
        cell.append(score);
      } else {
        cell.textContent = value;
      }
    }
  }
  return fragment;
}

for (const scene of scenes) sceneSelect.add(new Option(scene.name, scene.id));
sceneSelect.addEventListener("change", () => chooseScene(scenes[sceneSelect.selectedIndex]));
slider.addEventListener("input", moveDivider);

for (const panel of panels) {
  for (const method of methods) {
    panel.select.add(new Option(method[language], method.id));
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.method = method.id;
    button.addEventListener("click", () => {
      panel.method = method.id;
      updatePanel(panel);
    });
    panel.list.append(button);
  }
  panel.select.addEventListener("change", () => {
    panel.method = panel.select.value;
    updatePanel(panel);
  });
}

for (const [dataset, rows] of Object.entries(window.projectMetrics)) {
  byId("results-tables").append(createTable(dataset, rows));
}

for (const link of languageLinks) {
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    language = link.dataset.language;
    const url = new URL(location.href);
    if (language === "en") url.searchParams.set("lang", "en");
    else url.searchParams.delete("lang");
    if (location.protocol !== "file:") history.replaceState(null, "", url);
    updateLanguage();
  });
}

if (config.githubUrl) {
  const link = byId("github-link");
  link.href = config.githubUrl;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.removeAttribute("aria-disabled");
}
if (config.paperUrl) {
  const link = byId("paper-link");
  link.href = config.paperUrl;
  link.hidden = false;
}

chooseScene(currentScene);
moveDivider();
updateLanguage();
