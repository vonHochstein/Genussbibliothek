(function () {
  'use strict';
  function parseStock(value) {
    const text = String(value ?? '').trim().replace(',', '.');
    const amount = text === '' ? 0 : Number(text);
    if (!Number.isFinite(amount) || amount < 0 || !Number.isSafeInteger(amount * 4)) {
      throw new Error('Bestand bitte als nichtnegative Anzahl in Viertelflaschen eingeben (z. B. 0,25 oder 2,5).');
    }
    return amount;
  }
  function formatStock(value) {
    return Number(value ?? 0).toLocaleString('de-DE', { maximumFractionDigits: 2 });
  }
  function stockLabel(value) {
    return `${formatStock(value)} ${Number(value) === 1 ? 'Flasche' : 'Flaschen'}`;
  }
  function bindVintage(year, checkbox) {
    if (!year || !checkbox) return;
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) year.value = '';
      year.readOnly = checkbox.checked;
    });
    const unset = () => { checkbox.checked = false; year.readOnly = false; };
    year.addEventListener('focus', unset);
    year.addEventListener('input', () => { if (year.value) unset(); });
  }
  function parseAnalysisValue(input, label) {
    const text = String(input?.value ?? '').trim().replace(',', '.');
    const value = text === '' ? null : Number(text);
    if (input?.validity?.badInput || (value !== null && (!Number.isFinite(value) || value < 0))) {
      throw new Error(`${label} bitte als nichtnegative Zahl in g/l eingeben oder leer lassen.`);
    }
    return value;
  }
  function formatAnalysisValue(value) {
    return value == null || value === '' ? '–' : `${Number(value).toLocaleString('de-DE', { maximumFractionDigits: 20 })} g/l`;
  }
  function setMaster(year, checkbox, sweetness, data, residualSugar, totalAcidity) {
    if (year) { year.value = data.vintage ?? ''; year.readOnly = !!data.no_vintage; }
    if (checkbox) checkbox.checked = !!data.no_vintage;
    if (sweetness) sweetness.value = data.sweetness || '';
    if (residualSugar) residualSugar.value = data.residual_sugar_g_l ?? '';
    if (totalAcidity) totalAcidity.value = data.total_acidity_g_l ?? '';
  }
  function readMaster(year, checkbox, sweetness, residualSugar, totalAcidity) {
    const noVintage = !!checkbox?.checked;
    const text = String(year?.value ?? '').trim();
    const vintage = noVintage || !text ? null : Number(text);
    if (vintage !== null && (!Number.isInteger(vintage) || vintage < 1 || vintage > 9999)) {
      throw new Error('Jahrgang bitte als ganze Jahreszahl eingeben oder leer lassen.');
    }
    if (noVintage && text) throw new Error('Jahrgang und „Ohne Jahrgang“ dürfen nicht gleichzeitig gesetzt sein.');
    return {
      vintage, no_vintage: noVintage, sweetness: String(sweetness?.value ?? '').trim() || null,
      residual_sugar_g_l: parseAnalysisValue(residualSugar, 'Restzucker'),
      total_acidity_g_l: parseAnalysisValue(totalAcidity, 'Gesamtsäure')
    };
  }
  function formatVintage(year, noVintage) {
    return noVintage ? 'Ohne Jahrgang' : year == null || year === '' ? '–' : String(year);
  }
  window.GdbWineFields = Object.freeze({ parseStock, formatStock, stockLabel, bindVintage, setMaster, readMaster, formatVintage, formatAnalysisValue });
})();
