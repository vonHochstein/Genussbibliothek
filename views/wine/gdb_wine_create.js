(function () {
  const SUPABASE_URL = window.parent?.supabaseClient?.supabaseUrl || '';
  const SUPABASE_ANON_KEY = window.parent?.supabaseClient?.supabaseKey || '';
  function getAppBasePath() {
    const path = window.location.pathname || "";
    const repoSegment = "/Genussbibliothek/";
    if (window.location.hostname.includes("github.io") && path.includes(repoSegment)) {
      return repoSegment;
    }
    return "/";
  }

  const DEFAULT_IMAGE_URL = `${getAppBasePath()}img/fallback_image.jpg`;
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
    "Finnland": "Flag_of_Finland.svg"
  };

  const REGION_FLAG_MAP = {
    // Keine eigene Flagge des länderübergreifenden Weinbaugebiets: Landesflagge als Fallback.
    "Saale-Unstrut": "Flag_of_Germany.svg",
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
    "Deutschland": ["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen", "Saale-Unstrut"],
    "Schottland": ["Highlands", "Speyside", "Lowlands", "Islay", "Islands", "Campbeltown"],
    "England": ["Cumbria / Lake District"],
    "Irland": ["Leinster", "Cork/ Munster", "County Kerry", "County Wicklow / Wicklow Mountains"],
    "Nordirland": ["Antrim", "County Down"],
    "Frankreich": ["Cognac"],
    "USA": ["Kentucky", "Indiana", "Pennsylvania", "Washington"],
    "Australien": ["Victoria/ Melbourne"],
    "Neuseeland": ["Marlborough"],
    "Kanada": ["Manitoba"],
    "Schweiz": ["Luzern"],
    "Finnland": ["Isokyrö / Südösterbotten"]
  };

  const imgEl = document.getElementById('wineImage');
  const editWeinNameEl = document.getElementById('editWeinName');
  const editWineryEl = document.getElementById('editWinery');
  const editGrapeVarietyEl = document.getElementById('editGrapeVariety');
  const editCountryEl = document.getElementById('editCountry');
  const editRegionEl = document.getElementById('editRegion');
  const editFlagUrlEl = document.getElementById('editFlagUrl');
  const editRegionFlagUrlEl = document.getElementById('editRegionFlagUrl');
  const editCountryFlagPreviewEl = document.getElementById('editCountryFlagPreview');
  const editRegionFlagPreviewEl = document.getElementById('editRegionFlagPreview');
  const editVolumeMlEl = document.getElementById('editVolumeMl');
  const editAbvEl = document.getElementById('editAbv');
  const editWineTypeEl = document.getElementById('editWineType');
  const editWineColorEl = document.getElementById('editWineColor');
  const editPriceEurEl = document.getElementById('editPriceEur');
  const editAppellationEl = document.getElementById('editAppellation');
  const editIsCollectorEl = document.getElementById('editIsCollector');
  const editIsIncompleteEl = document.getElementById('editIsIncomplete');
  const editImageUploadEl = document.getElementById('editImageUpload');
  const btnDeleteImageEl = document.getElementById('btnDeleteImage');
  const imageEditHintEl = document.getElementById('imageEditHint');
  const fileNameEl = document.getElementById('editImageFileName');
  const collectorBadgeEl = document.getElementById('wineCollectorBadge');
  const provisionalBadgeEl = document.getElementById('wineProvisionalBadge');
  const hintEl = document.getElementById('masterDataEditHint');
  const btnSave = document.getElementById('btnSaveMasterData');
  const btnCancel = document.getElementById('btnCancelMasterDataEdit');

  const editVintageEl = document.getElementById('editVintage');
  const editNoVintageEl = document.getElementById('editNoVintage');
  const editSweetnessEl = document.getElementById('editSweetness');
  const editResidualSugarEl = document.getElementById('editResidualSugar');
  const editTotalAcidityEl = document.getElementById('editTotalAcidity');
  window.GdbWineFields.bindVintage(editVintageEl, editNoVintageEl);
  let pendingImageFile = null;
  let deleteImageOnSave = false;

  function resolveCurrentUser() {
    return window.parent?.currentUser || window.currentUser || null;
  }

  function requireCreatePermission() {
    return window.parent?.GdbPermissions?.requirePermission?.('wine', 'create') ?? true;
  }

  function getCountryFlagUrl(countryValue) {
    const key = (countryValue ?? '').toString().trim();
    return key && COUNTRY_FLAG_MAP[key] ? `${FLAG_BASE_URL}${COUNTRY_FLAG_MAP[key]}` : '';
  }

  function getRegionFlagUrl(regionValue) {
    const key = (regionValue ?? '').toString().trim();
    return key && REGION_FLAG_MAP[key] ? `${FLAG_BASE_URL}${REGION_FLAG_MAP[key]}` : '';
  }

  function filterRegionsByCountry() {
    if (editRegionEl) editRegionEl.disabled = false;
  }

  function syncFlagFieldsFromSelection() {
    const countryValue = (editCountryEl?.value || '').trim();
    const regionValue = (editRegionEl?.value || '').trim();
    const nextFlagUrl = getCountryFlagUrl(countryValue);
    const nextRegionFlagUrl = getRegionFlagUrl(regionValue);

    if (editFlagUrlEl) editFlagUrlEl.value = nextFlagUrl;
    if (editRegionFlagUrlEl) editRegionFlagUrlEl.value = nextRegionFlagUrl;

    if (editCountryFlagPreviewEl) {
      if (nextFlagUrl) {
        editCountryFlagPreviewEl.src = nextFlagUrl;
        editCountryFlagPreviewEl.style.display = 'inline-block';
      } else {
        editCountryFlagPreviewEl.style.display = 'none';
      }
    }

    if (editRegionFlagPreviewEl) {
      if (nextRegionFlagUrl) {
        editRegionFlagPreviewEl.src = nextRegionFlagUrl;
        editRegionFlagPreviewEl.style.display = 'inline-block';
      } else {
        editRegionFlagPreviewEl.style.display = 'none';
      }
    }
  }

  async function getAccessToken() {
    const parentSupabase = window.parent?.supabaseClient || window.supabaseClient || null;
    if (!parentSupabase?.auth?.getSession) {
      throw new Error('Supabase-Session ist nicht verfügbar');
    }
    const { data, error } = await parentSupabase.auth.getSession();
    if (error) throw error;
    const accessToken = data?.session?.access_token;
    if (!accessToken) throw new Error('Keine gültige Supabase-Session');
    return accessToken;
  }

  function getLogDisplayName(user) {
    return user?.display_name || user?.username || null;
  }

  async function writeLogEntry({ action, itemType, itemId, itemName, details }) {
    const currentUser = resolveCurrentUser();
    const accessToken = await getAccessToken();
    const payload = {
      user_id: currentUser?.id || null,
      username: getLogDisplayName(currentUser),
      action: action || null,
      item_type: itemType || null,
      item_id: itemId || null,
      item_name: itemName || null,
      details: details || null
    };

    const res = await fetch(`${SUPABASE_URL}/rest/v1/gdb_log`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error(`Logeintrag fehlgeschlagen (HTTP ${res.status})`);
    }
  }

  function buildCreateLogDetails(payload) {
    const lines = [];
    const addLine = (label, value) => {
      const normalized = value == null || value === '' ? null : String(value).trim();
      if (!normalized) return;
      lines.push(`${label}: ${normalized}`);
    };

    addLine('Name', payload?.name);
    addLine('Weingut / Erzeuger', payload?.winery);
    addLine('Rebsorte(n) / Cuvée', payload?.grape_variety);
    addLine('Jahrgang', window.GdbWineFields.formatVintage(payload?.vintage, payload?.no_vintage));
    addLine('Geschmacksrichtung / Süße', payload?.sweetness);
    if (payload?.residual_sugar_g_l != null) addLine('Restzucker', window.GdbWineFields.formatAnalysisValue(payload.residual_sugar_g_l));
    if (payload?.total_acidity_g_l != null) addLine('Gesamtsäure', window.GdbWineFields.formatAnalysisValue(payload.total_acidity_g_l));
    addLine('Land', payload?.country);
    addLine('Region', payload?.region);
    addLine('Volumen', payload?.volume_ml);
    addLine('Vol.-%', payload?.abv);
    addLine('Weinart', payload?.wine_type);
    addLine('Weinfarbe', payload?.wine_color);
    addLine('Preis (EUR)', payload?.price_eur);
    addLine('Herkunftsbezeichnung / Appellation', payload?.appellation);
    addLine('Sammlerstück / Sonderedition', payload?.collector ? 'Ja' : 'Nein');
    addLine('Unvollständig', payload?.provisional ? 'Ja' : 'Nein');

    return lines.join('\n') || 'Wein angelegt';
  }

  async function saveImageToStorage(newId, thumbnailBlob) {
    const parentSupabase = window.parent?.supabaseClient || window.parent?.supabase || window.supabaseClient || window.supabase || null;
    if (!parentSupabase?.storage?.from || !pendingImageFile) return null;

    const ext = (pendingImageFile.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const timestamp = Date.now();
    const originalPath = `wine_${newId}_${timestamp}.${ext}`;
    const thumbnailIsWebp = thumbnailBlob.type === 'image/webp';
    const thumbnailExtension = thumbnailIsWebp ? 'webp' : 'jpg';
    const thumbnailContentType = thumbnailIsWebp ? 'image/webp' : 'image/jpeg';
    const thumbnailPath = `thumbnails/wine_${newId}_${timestamp}.${thumbnailExtension}`;
    const uploadedPaths = [];

    try {
      const { error: originalUploadError } = await parentSupabase.storage
        .from('wines')
        .upload(originalPath, pendingImageFile, {
          cacheControl: '31536000',
          upsert: false,
          contentType: pendingImageFile.type || undefined
        });
      if (originalUploadError) {
        throw new Error(`Originalbild-Upload fehlgeschlagen: ${originalUploadError.message || 'Unbekannter Storage-Fehler'}`);
      }
      uploadedPaths.push(originalPath);

      const { error: thumbnailUploadError } = await parentSupabase.storage
        .from('wines')
        .upload(thumbnailPath, thumbnailBlob, {
          cacheControl: '31536000',
          upsert: false,
          contentType: thumbnailContentType
        });
      if (thumbnailUploadError) {
        throw new Error(`Thumbnail-Upload fehlgeschlagen: ${thumbnailUploadError.message || 'Unbekannter Storage-Fehler'}`);
      }
      uploadedPaths.push(thumbnailPath);

      const originalUrl = parentSupabase.storage.from('wines').getPublicUrl(originalPath).data?.publicUrl || '';
      const thumbnailUrl = parentSupabase.storage.from('wines').getPublicUrl(thumbnailPath).data?.publicUrl || '';
      if (!originalUrl || !thumbnailUrl) {
        throw new Error('Bild-URLs konnten nicht erzeugt werden');
      }

      return { originalUrl, thumbnailUrl, uploadedPaths };
    } catch (error) {
      if (uploadedPaths.length) {
        const { error: cleanupError } = await parentSupabase.storage.from('wines').remove(uploadedPaths);
        if (cleanupError) console.error('Bild-Upload konnte nicht vollständig bereinigt werden:', cleanupError);
      }
      throw error;
    }
  }

  async function cleanupUploadedImages(paths) {
    const parentSupabase = window.parent?.supabaseClient || window.parent?.supabase || window.supabaseClient || window.supabase || null;
    if (!parentSupabase?.storage?.from || !paths?.length) return;
    const { error } = await parentSupabase.storage.from('wines').remove(paths);
    if (error) console.error('Bild-Upload konnte nicht vollständig bereinigt werden:', error);
  }

  async function getResponseErrorMessage(response) {
    try {
      const payload = await response.json();
      return payload?.message || payload?.error_description || payload?.error || `HTTP ${response.status}`;
    } catch (_) {
      return `HTTP ${response.status}`;
    }
  }

  function setHint(text = '', kind = 'muted') {
    if (!hintEl) return;
    hintEl.hidden = !text;
    hintEl.textContent = text;
    hintEl.className = `detail-edit-hint ${kind}`.trim();
  }

  function goBackToWeinList() {
    window.parent?.postMessage({ type: 'gdb-wine-nav', view: 'wineList' }, '*');
  }

  function buildPayload() {
    const currentUser = resolveCurrentUser();
    const country = (editCountryEl?.value || '').trim() || null;
    const region = (editRegionEl?.value || '').trim() || null;

    return {
      id: crypto.randomUUID(),
      ...window.GdbWineFields.readMaster(editVintageEl, editNoVintageEl, editSweetnessEl, editResidualSugarEl, editTotalAcidityEl),
      name: (editWeinNameEl?.value || '').trim() || null,
      winery: (editWineryEl?.value || '').trim() || null,
      grape_variety: (editGrapeVarietyEl?.value || '').trim() || null,
      country,
      region,
      flag_url: getCountryFlagUrl(country),
      region_flag_url: getRegionFlagUrl(region),
      volume_ml: (editVolumeMlEl?.value === '' || editVolumeMlEl?.value == null) ? null : Math.max(1, Number(editVolumeMlEl.value)),
      abv: (editAbvEl?.value === '' || editAbvEl?.value == null) ? null : Math.max(0, Number(editAbvEl.value)),
      wine_type: (editWineTypeEl?.value || '').trim() || null,
      wine_color: (editWineColorEl?.value || '').trim() || null,
      price_eur: (editPriceEurEl?.value === '' || editPriceEurEl?.value == null) ? null : Math.max(0, Number(editPriceEurEl.value)),
      appellation: (editAppellationEl?.value || '').trim() || null,
      provisional: !!editIsIncompleteEl?.checked,
      collector: !!editIsCollectorEl?.checked,
      created_by: currentUser?.id || null,
      updated_by: currentUser?.id || null
    };
  }

  async function saveWein() {
    if (!requireCreatePermission()) {
      return;
    }
    let payload;
    try { payload = buildPayload(); } catch (error) { setHint(error.message, 'err'); return; }
    if (!payload.name) {
      setHint('Bitte zuerst einen Weinnamen eingeben', 'err');
      return;
    }

    btnSave.disabled = true;
    btnCancel.disabled = true;
    setHint('Speichere…');
    let uploadedImagePaths = [];
    let creationCompleted = false;

    try {
      let thumbnailBlob = null;
      if (pendingImageFile && !deleteImageOnSave) {
        if (!window.GdbWeinImages?.createThumbnail) {
          throw new Error('Thumbnail-Erzeugung ist nicht verfügbar');
        }
        thumbnailBlob = await window.GdbWeinImages.createThumbnail(pendingImageFile);
      }

      if (thumbnailBlob) {
        const uploadedImages = await saveImageToStorage(payload.id, thumbnailBlob);
        if (!uploadedImages) throw new Error('Bild-Upload fehlgeschlagen');
        uploadedImagePaths = uploadedImages.uploadedPaths;
        payload.image_url = uploadedImages.originalUrl;
        payload.thumbnail_url = uploadedImages.thumbnailUrl;
      }

      const accessToken = await getAccessToken();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/gdb_wines`, {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error(`Datensatz anlegen fehlgeschlagen: ${await getResponseErrorMessage(res)}`);
      const data = await res.json();
      const newId = data?.[0]?.id || payload.id;
      if (!newId) throw new Error('Keine ID zurückgegeben');

      creationCompleted = true;

      try {
        await writeLogEntry({
          action: 'create',
          itemType: 'wine',
          itemId: newId,
          itemName: payload.name || data?.[0]?.name || 'Unbekannter Wein',
          details: buildCreateLogDetails(payload)
        });
      } catch (logError) {
        console.error(logError);
      }

      window.location.href = `gdb_wine_detail.html?id=${encodeURIComponent(newId)}&t=${Date.now()}`;
    } catch (err) {
      console.error(err);
      if (!creationCompleted && uploadedImagePaths.length) {
        await cleanupUploadedImages(uploadedImagePaths);
      }
      setHint(`Speichern fehlgeschlagen: ${err?.message || 'Unbekannter Fehler'}`, 'err');
    } finally {
      btnSave.disabled = false;
      btnCancel.disabled = false;
    }
  }

  function init() {
    document.title = 'Wein – Neuer Eintrag';
    window.parent?.postMessage({ type: 'gdb-wine-set-title', value: 'Wein – Neuer Eintrag' }, '*');
    if (!requireCreatePermission()) {
      btnSave.disabled = true;
      setHint('Keine Berechtigung zum Anlegen neuer Wein-Einträge.', 'err');
    }
    if (imgEl) {
      imgEl.src = DEFAULT_IMAGE_URL;
      imgEl.onerror = () => { imgEl.src = DEFAULT_IMAGE_URL; };
    }
    filterRegionsByCountry();
    syncFlagFieldsFromSelection();
    if (editIsIncompleteEl) {
      editIsIncompleteEl.checked = false;
    }
    if (provisionalBadgeEl && editIsIncompleteEl) {
      provisionalBadgeEl.hidden = !editIsIncompleteEl.checked;
      provisionalBadgeEl.style.display = editIsIncompleteEl.checked ? 'inline-block' : 'none';
    }

    setHint('* Pflichtfeld');

    editCountryEl?.addEventListener('change', () => {
      filterRegionsByCountry();
      syncFlagFieldsFromSelection();
    });
    editRegionEl?.addEventListener('change', syncFlagFieldsFromSelection);
    editIsCollectorEl?.addEventListener('change', () => {
      if (collectorBadgeEl) collectorBadgeEl.style.display = editIsCollectorEl.checked ? 'inline-flex' : 'none';
    });
    editIsIncompleteEl?.addEventListener('change', () => {
      if (!provisionalBadgeEl) return;
      provisionalBadgeEl.hidden = !editIsIncompleteEl.checked;
      provisionalBadgeEl.style.display = editIsIncompleteEl.checked ? 'inline-block' : 'none';
    });
    editImageUploadEl?.addEventListener('change', () => {
      const file = editImageUploadEl.files?.[0];
      if (!file) {
        if (fileNameEl) fileNameEl.textContent = 'Keine Datei ausgewählt';
        return;
      }
      pendingImageFile = file;
      deleteImageOnSave = false;
      if (fileNameEl) fileNameEl.textContent = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        if (imgEl && e.target?.result) imgEl.src = e.target.result;
      };
      reader.readAsDataURL(file);
      if (imageEditHintEl) {
        imageEditHintEl.hidden = false;
        imageEditHintEl.textContent = 'Neues Bild ausgewählt (wird beim Speichern hochgeladen)';
      }
    });
    btnDeleteImageEl?.addEventListener('click', () => {
      pendingImageFile = null;
      deleteImageOnSave = true;
      if (imgEl) imgEl.src = DEFAULT_IMAGE_URL;
      if (editImageUploadEl) editImageUploadEl.value = '';
      if (fileNameEl) fileNameEl.textContent = 'Keine Datei ausgewählt';
      if (imageEditHintEl) {
        imageEditHintEl.hidden = false;
        imageEditHintEl.textContent = 'Bild wird nicht übernommen';
      }
    });
    btnCancel?.addEventListener('click', goBackToWeinList);
    btnSave?.addEventListener('click', saveWein);
  }

  init();
})();
