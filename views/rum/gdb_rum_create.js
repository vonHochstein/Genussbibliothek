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
  const imgEl = document.getElementById('rumImage');
  const editRumNameEl = document.getElementById('editRumName');
  const editDistilleryEl = document.getElementById('editDistillery');
  const editBottlerEl = document.getElementById('editBottler');
  const editCountryEl = document.getElementById('editCountry');
  const editRegionEl = document.getElementById('editRegion');
  const editFlagUrlEl = document.getElementById('editFlagUrl');
  const editRegionFlagUrlEl = document.getElementById('editRegionFlagUrl');
  const editCountryFlagPreviewEl = document.getElementById('editCountryFlagPreview');
  const editRegionFlagPreviewEl = document.getElementById('editRegionFlagPreview');
  const editVolumeMlEl = document.getElementById('editVolumeMl');
  const editAbvEl = document.getElementById('editAbv');
  const editCaskTypeEl = document.getElementById('editCaskType');
  const editPriceEurEl = document.getElementById('editPriceEur');
  const editBottleOutturnEl = document.getElementById('editBottleOutturn');
  const editIsCollectorEl = document.getElementById('editIsCollector');
  const editIsIncompleteEl = document.getElementById('editIsIncomplete');
  const editImageUploadEl = document.getElementById('editImageUpload');
  const btnDeleteImageEl = document.getElementById('btnDeleteImage');
  const imageEditHintEl = document.getElementById('imageEditHint');
  const fileNameEl = document.getElementById('editImageFileName');
  const collectorBadgeEl = document.getElementById('rumCollectorBadge');
  const provisionalBadgeEl = document.getElementById('rumProvisionalBadge');
  const hintEl = document.getElementById('masterDataEditHint');
  const btnSave = document.getElementById('btnSaveMasterData');
  const btnCancel = document.getElementById('btnCancelMasterDataEdit');

  let pendingImageFile = null;
  let deleteImageOnSave = false;

  function resolveCurrentUser() {
    return window.parent?.currentUser || window.currentUser || null;
  }

  function requireCreatePermission() {
    return window.parent?.GdbPermissions?.requirePermission?.('rum', 'create') ?? false;
  }

  function getCountryFlagUrl(countryValue) {
    return window.GdbRumFields.countryFlag((countryValue || "").trim());
  }

  function getRegionFlagUrl(regionValue) {
    return window.GdbRumFields.regionFlag((editCountryEl?.value || "").trim(), (regionValue || "").trim());
  }

  function filterRegionsByCountry() {
    window.GdbRumFields.updateRegions(editCountryEl?.value, editRegionEl, document.getElementById("rumRegionOptions"));
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
    addLine('Brennerei', payload?.distillery);
    addLine('Abfüller', payload?.bottler);
    addLine('Land', payload?.country);
    addLine('Region', payload?.region);
    addLine('Volumen', payload?.volume_ml);
    addLine('Vol.-%', payload?.abv);
    addLine('Fassart / Reifung / Finish', payload?.fasstyp);
    addLine('Alter', window.GdbRumFields.ageText(payload));
    addLine('Keine Altersangabe', payload?.no_age_statement ? 'Ja' : 'Nein');
    addLine('Stil / Produktart', payload?.style);
    addLine('Ausgangsstoff', payload?.raw_material);
    addLine('Preis (EUR)', payload?.price_eur);
    addLine('Flaschenanzahl', payload?.bottle_outturn);
    addLine('Sammler', payload?.collector ? 'Ja' : 'Nein');
    addLine('Unvollständig', payload?.provisional ? 'Ja' : 'Nein');

    return lines.join('\n') || 'Rum angelegt';
  }

  async function saveImageToStorage(newId, thumbnailBlob) {
    const parentSupabase = window.parent?.supabaseClient || window.parent?.supabase || window.supabaseClient || window.supabase || null;
    if (!parentSupabase?.storage?.from || !pendingImageFile) return null;

    const ext = (pendingImageFile.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
    const timestamp = Date.now();
    const originalPath = `rum_${newId}_${timestamp}.${ext}`;
    const thumbnailIsWebp = thumbnailBlob.type === 'image/webp';
    const thumbnailExtension = thumbnailIsWebp ? 'webp' : 'jpg';
    const thumbnailContentType = thumbnailIsWebp ? 'image/webp' : 'image/jpeg';
    const thumbnailPath = `thumbnails/rum_${newId}_${timestamp}.${thumbnailExtension}`;
    const uploadedPaths = [];

    try {
      const { error: originalUploadError } = await parentSupabase.storage
        .from('rums')
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
        .from('rums')
        .upload(thumbnailPath, thumbnailBlob, {
          cacheControl: '31536000',
          upsert: false,
          contentType: thumbnailContentType
        });
      if (thumbnailUploadError) {
        throw new Error(`Thumbnail-Upload fehlgeschlagen: ${thumbnailUploadError.message || 'Unbekannter Storage-Fehler'}`);
      }
      uploadedPaths.push(thumbnailPath);

      const originalUrl = parentSupabase.storage.from('rums').getPublicUrl(originalPath).data?.publicUrl || '';
      const thumbnailUrl = parentSupabase.storage.from('rums').getPublicUrl(thumbnailPath).data?.publicUrl || '';
      if (!originalUrl || !thumbnailUrl) {
        throw new Error('Bild-URLs konnten nicht erzeugt werden');
      }

      return { originalUrl, thumbnailUrl, uploadedPaths };
    } catch (error) {
      if (uploadedPaths.length) {
        const { error: cleanupError } = await parentSupabase.storage.from('rums').remove(uploadedPaths);
        if (cleanupError) console.error('Bild-Upload konnte nicht vollständig bereinigt werden:', cleanupError);
      }
      throw error;
    }
  }

  async function cleanupUploadedImages(paths) {
    const parentSupabase = window.parent?.supabaseClient || window.parent?.supabase || window.supabaseClient || window.supabase || null;
    if (!parentSupabase?.storage?.from || !paths?.length) return;
    const { error } = await parentSupabase.storage.from('rums').remove(paths);
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

  function goBackToRumList() {
    window.parent?.postMessage({ type: 'gdb-rum-nav', view: 'rumList' }, '*');
  }

  function buildPayload() {
    const currentUser = resolveCurrentUser();
    const country = (editCountryEl?.value || '').trim() || null;
    const region = (editRegionEl?.value || '').trim() || null;

    return {
      ...window.GdbRumFields.read(),
      id: crypto.randomUUID(),
      name: (editRumNameEl?.value || '').trim() || null,
      distillery: (editDistilleryEl?.value || '').trim() || null,
      bottler: (editBottlerEl?.value || '').trim() || null,
      country,
      region,
      flag_url: getCountryFlagUrl(country),
      region_flag_url: getRegionFlagUrl(region),
      volume_ml: (editVolumeMlEl?.value === '' || editVolumeMlEl?.value == null) ? null : Math.max(1, Number(editVolumeMlEl.value)),
      abv: (editAbvEl?.value === '' || editAbvEl?.value == null) ? null : Math.max(0, Number(editAbvEl.value)),
      fasstyp: (editCaskTypeEl?.value || '').trim() || null,
      price_eur: (editPriceEurEl?.value === '' || editPriceEurEl?.value == null) ? null : Math.max(0, Number(editPriceEurEl.value)),
      bottle_outturn: (editBottleOutturnEl?.value === '' || editBottleOutturnEl?.value == null) ? null : Math.max(0, Number(editBottleOutturnEl.value)),
      provisional: !!editIsIncompleteEl?.checked,
      collector: !!editIsCollectorEl?.checked,
      created_by: currentUser?.id || null,
      updated_by: currentUser?.id || null
    };
  }

  async function saveRum() {
    if (!requireCreatePermission()) {
      return;
    }
    let payload;
    try { payload = buildPayload(); } catch (err) { setHint(err.message, 'err'); return; }
    if (!payload.name) {
      setHint('Bitte zuerst einen Rumnamen eingeben', 'err');
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
        if (!window.GdbRumImages?.createThumbnail) {
          throw new Error('Thumbnail-Erzeugung ist nicht verfügbar');
        }
        thumbnailBlob = await window.GdbRumImages.createThumbnail(pendingImageFile);
      }

      if (thumbnailBlob) {
        const uploadedImages = await saveImageToStorage(payload.id, thumbnailBlob);
        if (!uploadedImages) throw new Error('Bild-Upload fehlgeschlagen');
        uploadedImagePaths = uploadedImages.uploadedPaths;
        payload.image_url = uploadedImages.originalUrl;
        payload.thumbnail_url = uploadedImages.thumbnailUrl;
      }

      const accessToken = await getAccessToken();
      const res = await fetch(`${SUPABASE_URL}/rest/v1/gdb_rums`, {
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
          itemType: 'rum',
          itemId: newId,
          itemName: payload.name || data?.[0]?.name || 'Unbekannter Rum',
          details: buildCreateLogDetails(payload)
        });
      } catch (logError) {
        console.error(logError);
      }

      window.location.href = `gdb_rum_detail.html?id=${encodeURIComponent(newId)}&t=${Date.now()}`;
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
    window.GdbRumFields.init();
    document.title = 'Rum – Neuer Eintrag';
    window.parent?.postMessage({ type: 'gdb-rum-set-title', value: 'Rum – Neuer Eintrag' }, '*');
    if (!requireCreatePermission()) {
      btnSave.disabled = true;
      setHint('Keine Berechtigung zum Anlegen neuer Rum-Einträge.', 'err');
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
    btnCancel?.addEventListener('click', goBackToRumList);
    btnSave?.addEventListener('click', saveRum);
  }

  init();
})();
