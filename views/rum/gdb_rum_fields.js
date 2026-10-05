(function () {
  "use strict";
  // Bestehende Zuordnungen; französische Herkunftsgebiete nutzen die Landesflagge.
  const FLAG_BASE_URL = "https://commons.wikimedia.org/wiki/Special:FilePath/";
  const COUNTRY_FLAG_MAP = {
  "Deutschland": "Flag_of_Germany.svg",
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
  "Brasilien": "Flag_of_Brazil.svg"
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
  const STYLES = ["Weißer Rum", "Brauner Rum", "Goldener Rum", "Rum Agricole", "Rhum traditionnel", "Overproof Rum", "Spiced Spirit", "Spirituose auf Rumbasis"];
  const RAW_MATERIALS = ["Melasse", "Zuckerrohrsaft", "Zuckerrohrhonig", "Mischung"];
  function fillSuggestions(list, values) {
    if (!list) return;
    list.replaceChildren(...values.map(value => {
      const option = document.createElement("option");
      option.value = value;
      return option;
    }));
  }
  function updateRegions(country, input, list) {
    if (!input) return;
    input.disabled = false;
    fillSuggestions(list, REGION_BY_COUNTRY[country] || []);
    // Freitext und unbekannte Bestandswerte niemals verwerfen.
  }
  function countryFlag(country) {
    const name = COUNTRY_FLAG_MAP[country];
    return name ? FLAG_BASE_URL + name : "";
  }
  function regionFlag(country, region) {
    const name = (REGION_BY_COUNTRY[country] || []).includes(region) && REGION_FLAG_MAP[region];
    return name ? FLAG_BASE_URL + name : "";
  }
  function normalize(row = {}) {
    return {
      age_years: row.age_years == null ? null : Number(row.age_years),
      no_age_statement: !!row.no_age_statement,
      style: row.style || null,
      raw_material: row.raw_material || null
    };
  }
  function read(doc = document) {
    const age = doc.getElementById("editAgeYears");
    const noAge = !!doc.getElementById("editNoAgeStatement")?.checked;
    const value = noAge || !age?.value ? null : Number(age.value);
    if (value != null && (!Number.isInteger(value) || value < 0)) {
      throw new Error("Alter muss eine nichtnegative ganze Jahreszahl sein.");
    }
    return {
      age_years: value,
      no_age_statement: noAge,
      style: doc.getElementById("editStyle")?.value.trim() || null,
      raw_material: doc.getElementById("editRawMaterial")?.value.trim() || null
    };
  }
  function set(row, doc = document) {
    const data = normalize(row);
    const age = doc.getElementById("editAgeYears");
    const noAge = doc.getElementById("editNoAgeStatement");
    if (age) { age.value = data.no_age_statement || data.age_years == null ? "" : String(data.age_years); age.disabled = data.no_age_statement; }
    if (noAge) noAge.checked = data.no_age_statement;
    const style = doc.getElementById("editStyle"), material = doc.getElementById("editRawMaterial");
    if (style) style.value = data.style || "";
    if (material) material.value = data.raw_material || "";
  }
  function ageText(row) {
    return row.no_age_statement ? "Keine Altersangabe" : row.age_years == null ? "–" : row.age_years + (Number(row.age_years) === 1 ? " Jahr" : " Jahre");
  }
  function render(row, doc = document) {
    for (const [id, value] of [["rumAge", ageText(row)], ["rumStyle", row.style || "–"], ["rumRawMaterial", row.raw_material || "–"]]) {
      const el = doc.getElementById(id);
      if (el) el.textContent = value;
    }
  }
  function init(doc = document) {
    const select = doc.getElementById("editCountry");
    if (select) for (const country of Object.keys(COUNTRY_FLAG_MAP)) {
      if (!Array.from(select.options).some(o => o.value === country)) {
        const option = doc.createElement("option"); option.value = country; option.textContent = country; select.appendChild(option);
      }
    }
    fillSuggestions(doc.getElementById("rumStyleOptions"), STYLES);
    fillSuggestions(doc.getElementById("rumRawMaterialOptions"), RAW_MATERIALS);
    const age = doc.getElementById("editAgeYears"), noAge = doc.getElementById("editNoAgeStatement");
    noAge?.addEventListener("change", () => {
      if (age) { if (noAge.checked) age.value = ""; age.disabled = noAge.checked; }
    });
    age?.addEventListener("input", () => {
      if (age.value && noAge) { noAge.checked = false; age.disabled = false; }
    });
  }
  window.GdbRumFields = { init, read, set, normalize, render, ageText, countryFlag, regionFlag, updateRegions };
})();
