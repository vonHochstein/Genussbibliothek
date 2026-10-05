(function () {
  const appSupabase = window.parent?.supabaseClient || window.supabaseClient;
  const SUPABASE_URL = appSupabase?.supabaseUrl || '';
  const SUPABASE_ANON_KEY = appSupabase?.supabaseKey || '';
  function getAppBasePath() {
    const path = window.location.pathname || "";
    const repoSegment = "/Genussbibliothek/";
    if (window.location.hostname.includes("github.io") && path.includes(repoSegment)) {
      return repoSegment;
    }
    return "/";
  }

  const DEFAULT_IMAGE_URL = `${getAppBasePath()}img/fallback_image.jpg`;
  const imgEl = document.getElementById('cigarImage');
  const editCigarNameEl = document.getElementById('editCigarName');
  const editBrandEl = document.getElementById('editBrand');
  const editManufacturerEl = document.getElementById('editManufacturer');
  const editCountryEl = document.getElementById('editCountry');
  const editRegionEl = document.getElementById('editRegion');
  const editFlagUrlEl = document.getElementById('editFlagUrl');
  const editRegionFlagUrlEl = document.getElementById('editRegionFlagUrl');
  const editCountryFlagPreviewEl = document.getElementById('editCountryFlagPreview');
  const editRegionFlagPreviewEl = document.getElementById('editRegionFlagPreview');
  const editLengthMmEl = document.getElementById('editLengthMm');
  const editRingGaugeEl = document.getElementById('editRingGauge');
  const editWrapperEl = document.getElementById('editWrapper');
  const editPriceEurEl = document.getElementById('editPriceEur');
  const editSeriesEl = document.getElementById('editSeries');
  const editIsCollectorEl = document.getElementById('editIsCollector');
  const editIsIncompleteEl = document.getElementById('editIsIncomplete');
  const editImageUploadEl = document.getElementById('editImageUpload');
  const btnDeleteImageEl = document.getElementById('btnDeleteImage');
  const imageEditHintEl = document.getElementById('imageEditHint');
  const fileNameEl = document.getElementById('editImageFileName');
  const collectorBadgeEl = document.getElementById('cigarCollectorBadge');
  const provisionalBadgeEl = document.getElementById('cigarProvisionalBadge');
  const hintEl = document.getElementById('masterDataEditHint');
  const btnSave = document.getElementById('btnSaveMasterData');
  const btnCancel = document.getElementById('btnCancelMasterDataEdit');

  let pendingImageFile = null;
  let deleteImageOnSave = false;

  function resolveCurrentUser() {
    return window.parent?.currentUser || window.currentUser || null;
  }

  function requireCreatePermission() {
    return window.parent?.GdbPermissions?.requirePermission?.('cigar', 'create') ?? false;
  }

  function getCountryFlagUrl(countryValue) {
    return window.GdbCigarFields.countryFlag((countryValue || "").trim());
  }

  function getRegionFlagUrl(regionValue) {
    return window.GdbCigarFields.regionFlag((editCountryEl?.value || "").trim(), (regionValue || "").trim());
  }

  function filterRegionsByCountry() {
    window.GdbCigarFields.updateRegions(editCountryEl?.value, editRegionEl, document.getElementById("cigarRegionOptions"));
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
    addLine('Marke', payload?.brand);
    addLine('Hersteller', payload?.manufacturer);
    addLine('Land', payload?.country);
    addLine('Region', payload?.region);
    addLine('Länge (mm)', payload?.length_mm);
    addLine('Ringmaß', payload?.ring_gauge);
    addLine('Deckblatt', payload?.wrapper);
    addLine('Format / Vitola', payload?.vitola);
    addLine('Umblatt', payload?.binder);
    addLine('Einlage', payload?.filler);
    addLine('Stärke (Herstellerangabe)', payload?.strength);
    addLine('Edition / Jahrgang / Batch', payload?.edition_batch);
    addLine('Preis je Zigarre (EUR)', payload?.price_eur);
    addLine('Serie', payload?.series);
    addLine('Sammler', payload?.collector ? 'Ja' : 'Nein');
    addLine('Unvollständig', payload?.provisional ? 'Ja' : 'Nein');

    return lines.join('\n') || 'Zigarre angelegt';
  }

  async function saveImageToStorage(newId, thumbnailBlob) {
    const parentSupabase = window.parent?.supabaseClient || window.parent?.supabase || window.supabaseClient || window.supabase || null;
    if (!parentSupabase?.storage?.from || !pendingImageFile) return null;

    const ext = (pendingImageFile.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const timestamp = Date.now();
    const originalPath = `cigar_${newId}_${timestamp}.${ext}`;
    const thumbnailIsWebp = thumbnailBlob.type === 'image/webp';
    const thumbnailExtension = thumbnailIsWebp ? 'webp' : 'jpg';
    const thumbnailContentType = thumbnailIsWebp ? 'image/webp' : 'image/jpeg';
    const thumbnailPath = `thumbnails/cigar_${newId}_${timestamp}.${thumbnailExtension}`;
    const uploadedPaths = [];

    try {
      const { error: originalUploadError } = await parentSupabase.storage
        .from('cigars')
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
        .from('cigars')
        .upload(thumbnailPath, thumbnailBlob, {
          cacheControl: '31536000',
          upsert: false,
          contentType: thumbnailContentType
        });
      if (thumbnailUploadError) {
        throw new Error(`Thumbnail-Upload fehlgeschlagen: ${thumbnailUploadError.message || 'Unbekannter Storage-Fehler'}`);
      }
      uploadedPaths.push(thumbnailPath);

      const originalUrl = parentSupabase.storage.from('cigars').getPublicUrl(originalPath).data?.publicUrl || '';
      const thumbnailUrl = parentSupabase.storage.from('cigars').getPublicUrl(thumbnailPath).data?.publicUrl || '';
      if (!originalUrl || !thumbnailUrl) {
        throw new Error('Bild-URLs konnten nicht erzeugt werden');
      }

      return { originalUrl, thumbnailUrl, uploadedPaths };
    } catch (error) {
      if (uploadedPaths.length) {
        const { error: cleanupError } = await parentSupabase.storage.from('cigars').remove(uploadedPaths);
        if (cleanupError) console.error('Bild-Upload konnte nicht vollständig bereinigt werden:', cleanupError);
      }
      throw error;
    }
  }

  async function cleanupUploadedImages(paths) {
    const parentSupabase = window.parent?.supabaseClient || window.parent?.supabase || window.supabaseClient || window.supabase || null;
    if (!parentSupabase?.storage?.from || !paths?.length) return;
    const { error } = await parentSupabase.storage.from('cigars').remove(paths);
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

  function goBackToCigarList() {
    window.parent?.postMessage({ type: 'gdb-cigar-nav', view: 'cigarList' }, '*');
  }

  function buildPayload() {
    const currentUser = resolveCurrentUser();
    const country = (editCountryEl?.value || '').trim() || null;
    const region = (editRegionEl?.value || '').trim() || null;

    return {
      ...window.GdbCigarFields.read(),
      id: crypto.randomUUID(),
      name: (editCigarNameEl?.value || '').trim() || null,
      brand: (editBrandEl?.value || '').trim() || null,
      manufacturer: (editManufacturerEl?.value || '').trim() || null,
      country,
      region,
      flag_url: getCountryFlagUrl(country),
      region_flag_url: getRegionFlagUrl(region),
      length_mm: (editLengthMmEl?.value === '' || editLengthMmEl?.value == null) ? null : Number(editLengthMmEl.value),
      ring_gauge: (editRingGaugeEl?.value === '' || editRingGaugeEl?.value == null) ? null : Number(editRingGaugeEl.value),
      wrapper: (editWrapperEl?.value || '').trim() || null,
      price_eur: (editPriceEurEl?.value === '' || editPriceEurEl?.value == null) ? null : Number(editPriceEurEl.value),
      series: (editSeriesEl?.value || '').trim() || null,
      provisional: !!editIsIncompleteEl?.checked,
      collector: !!editIsCollectorEl?.checked,
      created_by: currentUser?.id || null,
      updated_by: currentUser?.id || null
    };
  }

  async function saveCigar() {
    if (!requireCreatePermission()) {
      return;
    }
    let payload;
    try { payload = buildPayload(); } catch (err) { setHint(err.message, 'err'); return; }
    if (!payload.name) {
      setHint('Bitte zuerst einen Zigarrennamen eingeben', 'err');
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
        if (!window.GdbCigarImages?.createThumbnail) {
          throw new Error('Thumbnail-Erzeugung ist nicht verfügbar');
        }
        thumbnailBlob = await window.GdbCigarImages.createThumbnail(pendingImageFile);
      }

      if (thumbnailBlob) {
        const uploadedImages = await saveImageToStorage(payload.id, thumbnailBlob);
        if (!uploadedImages) throw new Error('Bild-Upload fehlgeschlagen');
        uploadedImagePaths = uploadedImages.uploadedPaths;
        payload.image_url = uploadedImages.originalUrl;
        payload.thumbnail_url = uploadedImages.thumbnailUrl;
      }

      const accessToken = await getAccessToken();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/gdb_cigars`, {
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
      const newId = data?.[0]?.id;
      if (!newId) throw new Error('Keine ID zurückgegeben');

      creationCompleted = true;

      try {
        await writeLogEntry({
          action: 'create',
          itemType: 'cigar',
          itemId: newId,
          itemName: payload.name || data?.[0]?.name || 'Unbekannte Zigarre',
          details: buildCreateLogDetails(payload)
        });
      } catch (logError) {
        console.error(logError);
      }

      window.location.href = `gdb_cigar_detail.html?id=${encodeURIComponent(newId)}&t=${Date.now()}`;
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
    window.GdbCigarFields.init();
    document.title = 'Zigarren – Neuer Eintrag';
    window.parent?.postMessage({ type: 'gdb-cigar-set-title', value: 'Zigarren – Neuer Eintrag' }, '*');
    if (!requireCreatePermission()) {
      btnSave.disabled = true;
      setHint('Keine Berechtigung zum Anlegen neuer Zigarren-Einträge.', 'err');
    }
    if (imgEl) {
      imgEl.src = DEFAULT_IMAGE_URL;
      imgEl.onerror = () => { imgEl.src = DEFAULT_IMAGE_URL; };
    }
    filterRegionsByCountry();
    syncFlagFieldsFromSelection();
    if (editIsIncompleteEl) {
      editIsIncompleteEl.checked = true;
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
    btnCancel?.addEventListener('click', goBackToCigarList);
    btnSave?.addEventListener('click', saveCigar);
  }

  init();
})();
