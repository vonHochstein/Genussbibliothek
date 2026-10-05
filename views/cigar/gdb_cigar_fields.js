(function () {
  "use strict";
  // Bestehende Zuordnungen; französische Herkunftsgebiete nutzen die Landesflagge.
  const FLAG_BASE_URL = "https://commons.wikimedia.org/wiki/Special:FilePath/";
  const COUNTRY_FLAG_MAP = {
  "Deutschland": "Flag_of_Germany.svg",
  "Kolumbien": "Flag_of_Colombia.svg",
  "Schottland": "Flag_of_the_United_Kingdom.svg",
  "England": "Flag_of_England.svg",
  "Nordirland": "Flag_of_the_United_Kingdom.svg",
  "Irland": "Flag_of_Ireland.svg",
  "Frankreich": "Flag_of_France.svg",
  "Niederlande": "Flag_of_the_Netherlands.svg",
  "Belgien": "Flag_of_Belgium.svg",
  "Spanien": "Flag_of_Spain.svg",
  "Österreich": "Flag_of_Austria.svg",
  "Tschechien": "Flag_of_the_Czech_Republic.svg",
  "Dänemark": "Flag_of_Denmark.svg",
  "Schweden": "Flag_of_Sweden.svg",
  "Norwegen": "Flag_of_Norway.svg",
  "Polen": "Flag_of_Poland.svg",
  "Italien": "Flag_of_Italy.svg",
  "USA": "Flag_of_the_United_States.svg",
  "Japan": "Flag_of_Japan.svg",
  "Australien": "Flag_of_Australia.svg",
  "Neuseeland": "Flag_of_New_Zealand.svg",
  "Kanada": "Flag_of_Canada_(Pantone).svg",
  "Indien": "Flag_of_India.svg",
  "Schweiz": "Flag_of_Switzerland.svg",
  "Taiwan": "Flag_of_Taiwan.svg",
  "Finnland": "Flag_of_Finland.svg",
  "Kuba": "Flag_of_Cuba.svg",
  "Jamaika": "Flag_of_Jamaica.svg",
  "Barbados": "Flag_of_Barbados.svg",
  "Dominikanische Republik": "Flag_of_the_Dominican_Republic.svg",
  "Guatemala": "Flag_of_Guatemala.svg",
  "Guyana": "Flag_of_Guyana.svg",
  "Panama": "Flag_of_Panama.svg",
  "Venezuela": "Flag_of_Venezuela.svg",
  "Trinidad und Tobago": "Flag_of_Trinidad_and_Tobago.svg",
  "Haiti": "Flag_of_Haiti.svg",
  "Puerto Rico": "Flag_of_Puerto_Rico.svg",
  "Martinique": "Flag_of_France.svg",
  "Guadeloupe": "Flag_of_France.svg",
  "Mauritius": "Flag_of_Mauritius.svg",
  "Réunion": "Flag_of_France.svg",
  "Philippinen": "Flag_of_the_Philippines.svg",
  "Brasilien": "Flag_of_Brazil.svg",
  "Nicaragua": "Flag_of_Nicaragua.svg",
  "Honduras": "Flag_of_Honduras.svg",
  "Mexiko": "Flag_of_Mexico.svg"
};
  const REGION_FLAG_MAP = {
  "Baden-Württemberg": "Flag_of_Baden-W%C3%BCrttemberg.svg",
  "Bayern": "Flag_of_Bavaria_(lozengy).svg",
  "Berlin": "Flag_of_Berlin.svg",
  "Brandenburg": "Flag_of_Brandenburg.svg",
  "Bremen": "Flag_of_Bremen.svg",
  "Hamburg": "Flag_of_Hamburg.svg",
  "Hessen": "Flag_of_Hesse.svg",
  "Mecklenburg-Vorpommern": "Flag_of_Mecklenburg-Western_Pomerania.svg",
  "Niedersachsen": "Flag_of_Lower_Saxony.svg",
  "Nordrhein-Westfalen": "Flag_of_North_Rhine-Westphalia.svg",
  "Rheinland-Pfalz": "Flag_of_Rhineland-Palatinate.svg",
  "Saarland": "Flag_of_Saarland.svg",
  "Sachsen": "Flag_of_Saxony_(state).svg",
  "Sachsen-Anhalt": "Flag_of_Saxony-Anhalt.svg",
  "Schleswig-Holstein": "Flag_of_Schleswig-Holstein.svg",
  "Thüringen": "Flag_of_Thuringia_(state).svg",
  "Highlands": "Flag_of_Scotland.svg",
  "Speyside": "Flag_of_Scotland.svg",
  "Lowlands": "Flag_of_Scotland.svg",
  "Islay": "Flag_of_Scotland.svg",
  "Islands": "Flag_of_Scotland.svg",
  "Campbeltown": "Flag_of_Scotland.svg",
  "Cumbria / Lake District": "Community_flag_of_Cumbria.svg",
  "Leinster": "Flag_of_Leinster.svg",
  "Cork/ Munster": "Flag_of_Munster.svg",
  "County Kerry": "Flag_of_county_Kerry.svg",
  "County Wicklow / Wicklow Mountains": "County_colors_of_Longford_and_Wicklow_(1x2_ratio).svg",
  "Antrim": "Flag_of_Northern_Ireland.svg",
  "County Down": "Flag_of_county_Down.svg",
  "Cognac": "Flag_of_France.svg",
  "Victoria/ Melbourne": "Flag_of_Victoria_(Australia).svg",
  "Marlborough": "Flag_of_New_Zealand.svg",
  "Kentucky": "Flag_of_Kentucky.svg",
  "Indiana": "Flag_of_Indiana.svg",
  "Pennsylvania": "Flag_of_Pennsylvania.svg",
  "Washington": "Flag_of_Washington.svg",
  "Manitoba": "Flag_of_Canada_(Pantone).svg",
  "Luzern": "Flag_of_Canton_of_Lucerne.svg",
  "Isokyrö / Südösterbotten": "Flag_of_Southern_Ostrobothnia.svg"
};
  const REGION_BY_COUNTRY = {
  "Deutschland": [
    "Baden-Württemberg",
    "Bayern",
    "Berlin",
    "Brandenburg",
    "Bremen",
    "Hamburg",
    "Hessen",
    "Mecklenburg-Vorpommern",
    "Niedersachsen",
    "Nordrhein-Westfalen",
    "Rheinland-Pfalz",
    "Saarland",
    "Sachsen",
    "Sachsen-Anhalt",
    "Schleswig-Holstein",
    "Thüringen"
  ],
  "Schottland": [
    "Highlands",
    "Speyside",
    "Lowlands",
    "Islay",
    "Islands",
    "Campbeltown"
  ],
  "England": [
    "Cumbria / Lake District"
  ],
  "Irland": [
    "Leinster",
    "Cork/ Munster",
    "County Kerry",
    "County Wicklow / Wicklow Mountains"
  ],
  "Nordirland": [
    "Antrim",
    "County Down"
  ],
  "Frankreich": [
    "Cognac"
  ],
  "USA": [
    "Kentucky",
    "Indiana",
    "Pennsylvania",
    "Washington"
  ],
  "Australien": [
    "Victoria/ Melbourne"
  ],
  "Neuseeland": [
    "Marlborough"
  ],
  "Kanada": [
    "Manitoba"
  ],
  "Schweiz": [
    "Luzern"
  ],
  "Finnland": [
    "Isokyrö / Südösterbotten"
  ]
};
  const MASTER = [["vitola","Vitola","Format / Vitola"],["binder","Binder","Umblatt"],["filler","Filler","Einlage"],["strength","Strength","Stärke (Herstellerangabe)"],["edition_batch","EditionBatch","Edition / Jahrgang / Batch"]];
  const TASTING = [["t_band","Band","Anilla / Bauchbinde"],["t_draw","Draw","Zugwiderstand"],["t_burn","Burn","Abbrand / Asche"],["t_smoke","Smoke","Rauchverhalten"],["t_strength","Strength","Persönlich empfundene Stärke"],["t_development","Development","Entwicklung / Rauchverlauf"]];
  const VITOLAS = ["Robusto", "Corona", "Toro", "Churchill", "Panetela", "Petit Corona", "Torpedo", "Belicoso", "Lancero", "Gordo"];
  const STRENGTHS = ["mild", "mild–mittel", "mittel", "mittel–kräftig", "kräftig"];
  function fillSuggestions(list, values) {
    if (!list) return;
    list.replaceChildren(...values.map(value => {
      const option = document.createElement("option"); option.value = value; return option;
    }));
  }
  function updateRegions(country, input, list) {
    if (input) input.disabled = false;
    fillSuggestions(list, REGION_BY_COUNTRY[country] || []);
  }
  function countryFlag(country) {
    return COUNTRY_FLAG_MAP[country] ? FLAG_BASE_URL + COUNTRY_FLAG_MAP[country] : "";
  }
  function regionFlag(country, region) {
    return (REGION_BY_COUNTRY[country] || []).includes(region) && REGION_FLAG_MAP[region]
      ? FLAG_BASE_URL + REGION_FLAG_MAP[region] : "";
  }
  function optionalNumber(id, label, {integer = false, positive = false} = {}, doc = document) {
    const raw = doc.getElementById(id)?.value.trim() || "";
    if (!raw) return null;
    const value = Number(raw);
    if (!Number.isFinite(value) || (integer && (!Number.isInteger(value) || value > 2147483647)) || (positive ? value <= 0 : value < 0)) {
      throw new Error(label + (positive ? " muss positiv" : " muss nichtnegativ") + (integer ? " und ganzzahlig" : "") + " sein.");
    }
    return value;
  }
  function validateNumbers(doc = document) {
    return {
      length_mm: optionalNumber("editLengthMm", "Länge", {positive:true}, doc),
      ring_gauge: optionalNumber("editRingGauge", "Ringmaß", {integer:true,positive:true}, doc),
      price_eur: optionalNumber("editPriceEur", "Stückpreis", {}, doc)
    };
  }
  function stock(value) {
    const number = Number(value);
    if (!Number.isSafeInteger(number) || number < 0 || number > 2147483647) {
      throw new Error("Bestand muss eine nichtnegative ganze Anzahl Zigarren sein.");
    }
    return number;
  }
  function normalize(row = {}) {
    return Object.fromEntries(MASTER.map(([key]) => [key, row[key] || null]));
  }
  function read(doc = document) {
    validateNumbers(doc);
    return Object.fromEntries(MASTER.map(([key, id]) => [key, doc.getElementById("edit"+id)?.value.trim() || null]));
  }
  function set(row, doc = document) {
    for (const [key, id] of MASTER) { const el = doc.getElementById("edit"+id); if (el) el.value = row[key] || ""; }
  }
  function render(row, doc = document) {
    for (const [key, id] of MASTER) { const el = doc.getElementById("cigar"+id); if (el) el.textContent = row[key] || "–"; }
  }
  function readTasting(doc = document) {
    return Object.fromEntries(TASTING.map(([key,id]) => [key,doc.getElementById("editMy"+id)?.value.trim() || null]));
  }
  function renderTasting(row, editing, doc = document) {
    for (const [key,id] of TASTING) {
      const display = doc.getElementById("detailMy"+id), input = doc.getElementById("editMy"+id);
      if (display) { display.textContent = row[key] || "–"; display.hidden = editing; display.style.display = editing ? "none" : ""; }
      if (input) { input.hidden = !editing; input.style.display = editing ? "" : "none"; if (!editing) input.value = row[key] || ""; }
    }
  }
  function init(doc = document) {
    const select = doc.getElementById("editCountry");
    if (select) for (const country of Object.keys(COUNTRY_FLAG_MAP)) {
      if (!Array.from(select.options).some(o => o.value === country)) {
        const option = doc.createElement("option"); option.value = option.textContent = country; select.appendChild(option);
      }
    }
    fillSuggestions(doc.getElementById("cigarVitolaOptions"), VITOLAS);
    fillSuggestions(doc.getElementById("cigarStrengthOptions"), STRENGTHS);
  }
  window.GdbCigarFields = {MASTER,TASTING,init,read,set,normalize,render,optionalNumber,validateNumbers,stock,readTasting,renderTasting,countryFlag,regionFlag,updateRegions};
})();
