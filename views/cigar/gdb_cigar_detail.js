// gdb_cigar_detail.js

function fmtDE(iso) {
  if (!iso) return "–";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "–";
  return d.toLocaleString("de-DE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

(function () {
  const params                  = new URLSearchParams(window.location.search);
  
  const id                      = params.get("id") || "";
  const avgParam                = params.get("avg");
  const cntParam                = params.get("cnt");

  const avgRating               = (avgParam === null || avgParam === "") ? null : Number(avgParam);
  const cntRating               = Number(cntParam || 0);

  const pliParam                = params.get("pli");
  const pcntParam               = params.get("pcnt");

  const avgPli                  = (pliParam === null || pliParam === "") ? null : Number(pliParam);
  const cntPli                  = Number(pcntParam || 0);

  let currentAvgRating          = (avgRating == null || Number.isNaN(avgRating)) ? null : Number(avgRating);
  let currentCntRating          = Number(cntRating || 0);
  let currentAvgPli             = (avgPli == null || Number.isNaN(avgPli)) ? null : Number(avgPli);
  let currentCntPli             = Number(cntPli || 0);

  const pliMinParam             = params.get("plimin");
  const pliMaxParam             = params.get("plimax");

  let pliMin                  = (pliMinParam === null || pliMinParam === "") ? null : Number(pliMinParam);
  let pliMax                  = (pliMaxParam === null || pliMaxParam === "") ? null : Number(pliMaxParam);

  const myStockParam            = params.get("mystock");
  const myStockMl               = Number(myStockParam || 0);

  const myRatingParam           = params.get("myrating");
  const myPliParam              = params.get("mypli");

  const myRating                = (myRatingParam === null || myRatingParam === "") ? null : Number(myRatingParam);
  const myPli                   = (myPliParam === null || myPliParam === "") ? null : Number(myPliParam);

  const notesParam              = params.get("notes");
  const myNotes                 = (notesParam ?? "");

  const colorParam              = params.get("t_color");
  const myColor                 = (colorParam ?? "");

  const noseParam               = params.get("t_nose");
  const myNose                  = (noseParam ?? "");

  const palateParam             = params.get("t_palate");
  const myPalate                = (palateParam ?? "");

  const finishParam             = params.get("t_finish");
  const myFinish                = (finishParam ?? "");

  const summaryParam            = params.get("t_summary");
  const mySummary               = (summaryParam ?? "");

  const trinkgelegenheitParam   = params.get("t_trinkgelegenheit");
  const myTrinkgelegenheit      = (trinkgelegenheitParam ?? "");

  const myWishlistParam         = params.get("myWishlist");
  const myWishlist              = (myWishlistParam === "1" || myWishlistParam === "true");

  const created_atParam         = params.get("created_at") || "";
  const updated_atParam         = params.get("updated_at") || "";

  const created_by              = params.get("created_by") || "";
  const updated_by              = params.get("updated_by") || "";

  const myCreatedAt             = params.get("my_created_at") || "";
  const myUpdatedAt             = params.get("my_updated_at") || "";

  const dbg                     = document.getElementById("detailDebug");

  // if (dbg) dbg.textContent = `cigar id=${id}`;

  // Ziel-Element in der HTML
  const titleEl                 = document.getElementById("cigarName");
  const brandEl            = document.getElementById("cigarBrand");
  const dotEl                   = document.getElementById("cigarDot");
  const manufacturerEl               = document.getElementById("cigarManufacturer");
  const countryFlagImg          = document.getElementById("countryFlagImg");
  const countryTextEl           = document.getElementById("countryText");
  const regionFlagImg           = document.getElementById("regionFlagImg");
  const regionTextEl            = document.getElementById("regionText");
  const originLine              = document.getElementById("cigarOriginLine");
  const imgWrapEl               = document.getElementById("cigarImageWrap");
  const imgEl                   = document.getElementById("cigarImage");
  const volumeEl                = document.getElementById("cigarLength");
  const abvEl                   = document.getElementById("cigarRingGauge");
  const statsLineEl             = document.getElementById("cigarStatsLine");
  const sepVolRingGaugeEl             = document.getElementById("sepVolRingGauge");
  const caskLineEl              = document.getElementById("cigarWrapperLine");
  const caskEl                  = document.getElementById("cigarWrapper");
  const priceEl                 = document.getElementById("cigarPrice");
  const outturnLineEl           = document.getElementById("cigarSeriesLine");
  const outturnEl               = document.getElementById("cigarSeries");
  const editSeriesEl     = document.getElementById("editSeries");
  const collectorBadgeEl        = document.getElementById("cigarCollectorBadge");
  const provisionalBadgeEl      = document.getElementById("cigarProvisionalBadge");
  const masterDataEditFieldsEl  = document.getElementById("masterDataEditFields");
  const editPriceEurEl          = document.getElementById("editPriceEur");
  const editLengthMmEl          = document.getElementById("editLengthMm");
  const editRingGaugeEl               = document.getElementById("editRingGauge");
  const editCigarNameEl        = document.getElementById("editCigarName");
  const editBrandEl        = document.getElementById("editBrand");
  const editManufacturerEl           = document.getElementById("editManufacturer");
  const editCountryEl            = document.getElementById("editCountry");
  const editRegionEl             = document.getElementById("editRegion");
  const editFlagUrlEl            = document.getElementById("editFlagUrl");
  const editRegionFlagUrlEl      = document.getElementById("editRegionFlagUrl");
  const editCountryFlagPreviewEl = document.getElementById("editCountryFlagPreview");
  const editRegionFlagPreviewEl  = document.getElementById("editRegionFlagPreview");
  const editIsIncompleteEl      = document.getElementById("editIsIncomplete");
  const editIsCollectorEl       = document.getElementById("editIsCollector");
  const editWrapperEl          = document.getElementById("editWrapper");
  const imageEditFieldsEl       = document.getElementById("imageEditFields");
  const editImageUploadEl       = document.getElementById("editImageUpload");
  const btnDeleteImageEl        = document.getElementById("btnDeleteImage");
  const imageEditHintEl         = document.getElementById("imageEditHint");
  const detailAvgRatingStarsEl  = document.getElementById("detailAvgRatingStars");
  const detailAvgRatingTextEl   = document.getElementById("detailAvgRatingText");
  const detailAvgPliTextEl      = document.getElementById("detailAvgPliText");
  const detailPliScaleEl        = document.getElementById("detailPliScale");
  const detailMyRatingStarsEl   = document.getElementById("detailMyRatingStars");
  const detailMyRatingTextEl    = document.getElementById("detailMyRatingText");
  const editMyRatingWrapEl      = document.getElementById("editMyRatingWrap");
  const editMyRatingStarsEl     = document.getElementById("editMyRatingStars");
  const detailMyPliTextEl       = document.getElementById("detailMyPliText");
  const detailMyPliScaleEl      = document.getElementById("detailMyPliScale");
  const btnEditMyDetails        = document.getElementById("btnEditMyDetails");
  const btnCancelMyDetailsEdit  = document.getElementById("btnCancelMyDetailsEdit");
  const myDetailsEditHintEl     = document.getElementById("myDetailsEditHint");
  const myDetailsViewModeEl     = document.getElementById("myDetailsViewMode");
  const btnEditMasterData       = document.getElementById("btnEditMasterData");
  const btnDeleteCigar         = document.getElementById("btnDeleteCigar");
  const btnCancelMasterDataEdit = document.getElementById("btnCancelMasterDataEdit");
  const deleteCigarModalEl     = document.getElementById("deleteCigarModal");
  const deleteCigarModalTextEl = document.getElementById("deleteCigarModalText");
  const btnCancelDeleteCigar   = document.getElementById("btnCancelDeleteCigar");
  const btnConfirmDeleteCigar  = document.getElementById("btnConfirmDeleteCigar");
  const masterDataEditHintEl    = document.getElementById("masterDataEditHint");
  const masterDataViewModeEl    = document.getElementById("masterDataViewMode");
  const notesEl                 = document.getElementById("detailMyNotes");
  const editMyNotesEl           = document.getElementById("editMyNotes");
  if (notesEl) notesEl.textContent = myNotes.trim() ? myNotes : "–";
  if (editMyNotesEl) editMyNotesEl.value = myNotes;
  const colorEl                 = document.getElementById("detailMyColor");
  if (colorEl) colorEl.textContent = myColor.trim() ? myColor : "–";
  const editMyColorEl           = document.getElementById("editMyColor");
  if (editMyColorEl) editMyColorEl.value = myColor;
  const noseEl                 = document.getElementById("detailMyNose");
  if (noseEl) noseEl.textContent = myNose.trim() ? myNose : "–";
  const editMyNoseEl           = document.getElementById("editMyNose");
  if (editMyNoseEl) editMyNoseEl.value = myNose;
  const palateEl                 = document.getElementById("detailMyPalate");
  if (palateEl) palateEl.textContent = myPalate.trim() ? myPalate : "–";
  const editMyPalateEl           = document.getElementById("editMyPalate");
  if (editMyPalateEl) editMyPalateEl.value = myPalate;
  const finishEl                 = document.getElementById("detailMyFinish");
  if (finishEl) finishEl.textContent = myFinish.trim() ? myFinish : "–";
  const editMyFinishEl           = document.getElementById("editMyFinish");
  if (editMyFinishEl) editMyFinishEl.value = myFinish;
  const summaryEl                 = document.getElementById("detailMySummary");
  if (summaryEl) summaryEl.textContent = mySummary.trim() ? mySummary : "–";
  const editMySummaryEl          = document.getElementById("editMySummary");
  if (editMySummaryEl) editMySummaryEl.value = mySummary;
  const trinkgelegenheitEl       = document.getElementById("detailMyTrinkgelegenheit");
  if (trinkgelegenheitEl) trinkgelegenheitEl.textContent = myTrinkgelegenheit.trim() ? myTrinkgelegenheit : "–";
  const editMyTrinkgelegenheitEl = document.getElementById("editMyTrinkgelegenheit");
  if (editMyTrinkgelegenheitEl) editMyTrinkgelegenheitEl.value = myTrinkgelegenheit;
  const wishlistEl = document.getElementById("detailMyWishlist");
  if (wishlistEl) wishlistEl.textContent = myWishlist ? "✔" : "–";
  const editMyWishlistEl        = document.getElementById("editMyWishlist");
  if (editMyWishlistEl) editMyWishlistEl.checked = !!myWishlist;
  const detailBottleWrapEl      = document.getElementById("detailBottleWrap");
  const detailChangelogListEl   = document.getElementById("detailChangelogList");

  const stockTextEl             = document.getElementById("detailStockText");
  const editMyStockWrapEl       = document.getElementById("editMyStockWrap");
  const editMyStockEl           = document.getElementById("editMyStock");
  const btnStockMinusOne        = document.getElementById("btnStockMinusOne");
  const btnStockPlusOne        = document.getElementById("btnStockPlusOne");
  if (editMyStockEl) editMyStockEl.value = Number.isFinite(myStockMl) ? String(myStockMl) : "0";

  const cEl = document.getElementById("detail_created_at");
  const uEl = document.getElementById("detail_updated_at");
  if (cEl) cEl.textContent = fmtDE(created_atParam);
  if (uEl) uEl.textContent = fmtDE(updated_atParam);

  const createdByEl = document.getElementById("detail_created_by");
  const updatedByEl = document.getElementById("detail_updated_by");

  if (createdByEl) createdByEl.textContent = created_by ? created_by : "–";
  if (updatedByEl) updatedByEl.textContent = updated_by ? updated_by : "–";

  const myCreatedEl = document.getElementById("detail_my_created_at");
  if (myCreatedEl) myCreatedEl.textContent = myCreatedAt ? fmtDE(myCreatedAt) : "–";

  const myUpdatedEl = document.getElementById("detail_my_updated_at");
  if (myUpdatedEl) myUpdatedEl.textContent = myUpdatedAt ? fmtDE(myUpdatedAt) : "–";

  let isMyDetailsEditMode = false;
  let isMasterDataEditMode = false;
  let savedCigarName = "";
  let savedBrand = "";
  let savedManufacturer = "";
  let savedCountry = "";
  let savedRegion = "";
  let savedFlagUrl = "";
  let savedRegionFlagUrl = "";
  let savedLengthMm = null;
  let savedRingGauge = null;
  let savedWrapper = "";
  let savedPriceEur = null;
  let savedProvisional = false;
  let savedCollector = false;
  let savedSeries = null;

  let savedImageUrl = "";
  let originalImageUrl = "";
  let savedThumbnailUrl = "";
  let originalThumbnailUrl = "";
  let pendingImageFile = null;
  let deleteImageOnSave = false;

  let originalCigarName = "";
  let originalBrand = "";
  let originalManufacturer = "";
  let originalCountry = "";
  let originalRegion = "";
  let originalFlagUrl = "";
  let originalRegionFlagUrl = "";
  let originalLengthMm = null;
  let originalRingGauge = null;
  let originalWrapper = "";
  let originalPriceEur = null;
  let originalProvisional = false;
  let originalCollector = false;
  let originalSeries = null;


  function getCountryFlagUrl(countryValue) {
    return window.GdbCigarFields.countryFlag((countryValue || "").trim());
  }

  function getRegionFlagUrl(regionValue) {
    return window.GdbCigarFields.regionFlag((editCountryEl?.value || "").trim(), (regionValue || "").trim());
  }

  function syncFlagFieldsFromSelection() {
    const countryValue = (editCountryEl?.value || "").trim();
    const regionValue = (editRegionEl?.value || "").trim();

    const nextFlagUrl = getCountryFlagUrl(countryValue);
    const nextRegionFlagUrl = getRegionFlagUrl(regionValue);

    if (editFlagUrlEl) editFlagUrlEl.value = nextFlagUrl;
    if (editRegionFlagUrlEl) editRegionFlagUrlEl.value = nextRegionFlagUrl;

    if (countryFlagImg) {
      if (nextFlagUrl) {
        countryFlagImg.src = nextFlagUrl;
        countryFlagImg.style.display = "inline";
      } else {
        countryFlagImg.style.display = "none";
      }
    }

    if (regionFlagImg) {
      if (nextRegionFlagUrl) {
        regionFlagImg.src = nextRegionFlagUrl;
        regionFlagImg.style.display = "inline";
      } else {
        regionFlagImg.style.display = "none";
      }
    }

    if (editCountryFlagPreviewEl) {
      if (nextFlagUrl) {
        editCountryFlagPreviewEl.src = nextFlagUrl;
        editCountryFlagPreviewEl.style.display = "inline-block";
      } else {
        editCountryFlagPreviewEl.style.display = "none";
      }
    }

    if (editRegionFlagPreviewEl) {
      if (nextRegionFlagUrl) {
        editRegionFlagPreviewEl.src = nextRegionFlagUrl;
        editRegionFlagPreviewEl.style.display = "inline-block";
      } else {
        editRegionFlagPreviewEl.style.display = "none";
      }
    }
  }

  function filterRegionsByCountry() {
    window.GdbCigarFields.updateRegions(editCountryEl?.value, editRegionEl, document.getElementById("cigarRegionOptions"));
  }

  const defaultMasterDataHintText = masterDataEditHintEl
    ? (masterDataEditHintEl.textContent || "Bearbeitungsmodus aktiv")
    : "Bearbeitungsmodus aktiv";

  let savedCigarFields = window.GdbCigarFields.normalize();
  let originalCigarFields = { ...savedCigarFields };
  window.GdbCigarFields.init();

  function renderMasterDataView() {
    window.GdbCigarFields.render(savedCigarFields);
    if (titleEl) {
      titleEl.textContent = savedCigarName || "";
    }

    if (brandEl) {
      brandEl.textContent = savedBrand || "";
    }

    if (manufacturerEl) {
      manufacturerEl.textContent = savedManufacturer || "";
    }

    const hasBrand = !!savedBrand;
    const hasManufacturer = !!savedManufacturer;

    if (dotEl) {
      dotEl.style.display = (hasBrand && hasManufacturer) ? "inline" : "none";
    }

    if (countryTextEl) countryTextEl.textContent = savedCountry || "";
    if (regionTextEl) regionTextEl.textContent = savedRegion || "";

    if (countryFlagImg) {
      if (savedFlagUrl) {
        countryFlagImg.src = savedFlagUrl;
        countryFlagImg.style.display = "inline";
      } else {
        countryFlagImg.style.display = "none";
      }
    }

    if (regionFlagImg) {
      if (savedRegionFlagUrl) {
        regionFlagImg.src = savedRegionFlagUrl;
        regionFlagImg.style.display = "inline";
      } else {
        regionFlagImg.style.display = "none";
      }
    }

    if (originLine) {
      const sep = originLine.querySelector(".sep");
      if (sep) {
        sep.style.display = (savedCountry && savedRegion) ? "inline" : "none";
      }
    }

    const hasVol = !!(savedLengthMm && Number(savedLengthMm) > 0);
    const hasRingGauge = !!(savedRingGauge && Number(savedRingGauge) > 0);

    if (volumeEl) {
      volumeEl.textContent = hasVol ? `${savedLengthMm} mm` : "";
      volumeEl.style.display = hasVol ? "inline" : "none";
    }

    if (abvEl) {
      abvEl.textContent = hasRingGauge ? `Ringmaß ${savedRingGauge}` : "";
      abvEl.style.display = hasRingGauge ? "inline" : "none";
    }

    if (sepVolRingGaugeEl) {
      sepVolRingGaugeEl.style.display = (hasVol && hasRingGauge) ? "inline" : "none";
    }

    if (statsLineEl) {
      statsLineEl.style.display = (hasVol || hasRingGauge) ? "" : "none";
    }

    const caskText = (savedWrapper ?? "").toString().trim();
    if (caskLineEl && caskEl) {
      caskEl.textContent = caskText || "-";
      caskLineEl.style.display = "";
    }

    if (priceEl) {
      const priceText = formatEuro(savedPriceEur);
      priceEl.textContent = `${priceText} € je Zigarre`;
    }

    if (outturnLineEl && outturnEl) {
      if (!!savedSeries) {
        outturnEl.textContent = savedSeries;
        outturnLineEl.style.display = "";
      } else {
        outturnLineEl.style.display = "none";
      }
    }
    updateStockVisual(savedMyStock);

    if (savedCigarName) {
      document.title = `Zigarren – ${savedCigarName}`;
      window.parent?.postMessage({ type: "gdb-cigar-set-title", value: `Zigarren – ${savedCigarName}` }, "*");
    }

    if (collectorBadgeEl) {
      collectorBadgeEl.style.display = savedCollector ? "inline-block" : "none";
    }

    if (provisionalBadgeEl) {
      provisionalBadgeEl.hidden = !savedProvisional;
      provisionalBadgeEl.style.display = savedProvisional ? "inline-block" : "none";
    }
  }

  function resolveCurrentUser() {
    const directUser = window.parent?.currentUser || window.currentUser || null;
    if (directUser?.id) return directUser;

    const candidateKeys = [
      "currentUser",
      "gdb_current_user",
      "gdbUser",
      "user"
    ];

    for (const key of candidateKeys) {
      try {
        const raw = window.localStorage?.getItem(key) || window.sessionStorage?.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (parsed?.id) return parsed;
      } catch {
        // ignore invalid storage data
      }
    }

    return null;
  }

  async function getAccessToken() {
    const parentSupabase = window.parent?.supabaseClient || window.supabaseClient || null;
    if (!parentSupabase?.auth?.getSession) {
      throw new Error("Supabase-Session ist nicht verfügbar");
    }
    const { data, error } = await parentSupabase.auth.getSession();
    if (error) throw error;
    const accessToken = data?.session?.access_token;
    if (!accessToken) throw new Error("Keine gültige Supabase-Session");
    return accessToken;
  }

  function requireUpdatePermission() {
    return window.parent?.GdbPermissions?.requirePermission?.('cigar', 'update') ?? false;
  }

  function requireDeletePermission() {
    return window.parent?.GdbPermissions?.requirePermission?.('cigar', 'delete') ?? false;
  }

  async function getResponseErrorMessage(response) {
    try {
      const payload = await response.json();
      return payload?.message || payload?.error_description || payload?.error || `HTTP ${response.status}`;
    } catch (_) {
      return `HTTP ${response.status}`;
    }
  }

  async function saveMasterDataToDb(nextMasterData) {
    const currentUser = resolveCurrentUser();

    if (!id) {
      throw new Error("Zigarren-ID fehlt");
    }

    const accessToken = await getAccessToken();

    const payload = {
      ...nextMasterData,
      updated_by: currentUser?.id || null
    };

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/gdb_cigars?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation"
        },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) {
      throw new Error(`Stammdaten speichern fehlgeschlagen: ${await getResponseErrorMessage(res)}`);
    }

    const rows = await res.json();
    if (!Array.isArray(rows) || rows.length !== 1) {
      throw new Error("Kein gespeicherter Datensatz zurückgegeben; bitte Berechtigungen prüfen.");
    }
    return rows;
  }

  async function deleteCigarFromDb() {
    const parentSupabase = window.parent?.supabaseClient || window.supabaseClient || null;
    if (!id) throw new Error("Zigarren-ID fehlt");
    const accessToken = await getAccessToken();
    const storagePaths = [
      getStoragePathFromPublicUrl(savedImageUrl || originalImageUrl || ""),
      getStoragePathFromPublicUrl(savedThumbnailUrl || originalThumbnailUrl || "")
    ].filter(Boolean);
    // Der FK-Cascade löscht persönliche Zeilen atomar mit dem Stammdatensatz.
    // Bilder erst danach entfernen: ein abgewiesenes DELETE darf nichts beschädigen.
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/gdb_cigars?id=eq.${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
          Prefer: "return=representation"
        }
      }
    );
    if (!response.ok) throw new Error(`Zigarre löschen fehlgeschlagen: ${await getResponseErrorMessage(response)}`);
    const deleted = await response.json();
    if (!Array.isArray(deleted) || deleted.length !== 1) throw new Error("Zigarren wurde nicht gelöscht; bitte Berechtigungen prüfen.");
    if (storagePaths.length) {
      try {
        if (!parentSupabase?.storage?.from) throw new Error("Storage nicht verfügbar");
        const { error } = await parentSupabase.storage.from("cigars").remove(storagePaths);
        if (error) throw error;
      } catch (error) {
        console.error("Zigarren gelöscht, Bildbereinigung fehlgeschlagen:", error);
        return "Zigarren wurde gelöscht. Originalbild/Thumbnail konnten nicht vollständig entfernt werden; bitte lokal im Admin-Bereich prüfen.";
      }
    }
    return "";
  }

  function openDeleteCigarModal(cigarLabel) {
  if (!deleteCigarModalEl) return;
  if (deleteCigarModalTextEl) {
    deleteCigarModalTextEl.innerHTML = `
      Soll „${cigarLabel}“ wirklich endgültig gelöscht werden?<br><br>
      Dabei werden die Stammdaten, alle zugehörigen Nutzerdaten, der Eintrag in der Gesamtübersicht und ein vorhandenes Bild dauerhaft entfernt.
    `;
  }
  deleteCigarModalEl.classList.remove("hidden");
  deleteCigarModalEl.setAttribute("aria-hidden", "false");
}

function closeDeleteCigarModal() {
  if (!deleteCigarModalEl) return;
  deleteCigarModalEl.classList.add("hidden");
  deleteCigarModalEl.setAttribute("aria-hidden", "true");
}

  async function fetchUserDisplayMap(userIds) {
    const ids = Array.from(new Set((userIds || []).filter(Boolean)));
    if (ids.length === 0) return {};

    const accessToken = await getAccessToken();

    const idList = ids.map(v => `"${v}"`).join(",");
    const url =
      `${SUPABASE_URL}/rest/v1/gdb_users` +
      `?id=in.(${encodeURIComponent(idList)})` +
      `&select=id,username,display_name`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok) {
      throw new Error(`Benutzerdaten laden fehlgeschlagen (HTTP ${res.status})`);
    }

    const rows = await res.json();
    const map = {};
    rows.forEach((row) => {
      if (!row?.id) return;
      map[row.id] = (row.display_name || row.username || "–").toString();
    });
    return map;
  }

  function formatLogValue(value, type = "text") {
    if (value == null || value === "") return "–";

    if (type === "boolean") return value ? "Ja" : "Nein";
    if (type === "price") return `${formatEuro(value)} €`;
    if (type === "ring_gauge") return String(value);
    if (type === "volume") return `${Number(value)} mm`;

    return String(value);
  }

  function buildMasterDataLogDetails(originalData, nextData, extraChanges = []) {
    const changes = [];

    const fields = [
      ["Format / Vitola", originalData.vitola, nextData.vitola, "text"],
      ["Umblatt", originalData.binder, nextData.binder, "text"],
      ["Einlage", originalData.filler, nextData.filler, "text"],
      ["Stärke (Herstellerangabe)", originalData.strength, nextData.strength, "text"],
      ["Edition / Jahrgang / Batch", originalData.edition_batch, nextData.edition_batch, "text"],
      ["Name", originalData.name, nextData.name, "text"],
      ["Marke", originalData.brand, nextData.brand, "text"],
      ["Hersteller", originalData.manufacturer, nextData.manufacturer, "text"],
      ["Land", originalData.country, nextData.country, "text"],
      ["Region", originalData.region, nextData.region, "text"],
      ["Länge", originalData.length_mm, nextData.length_mm, "volume"],
      ["Ringmaß", originalData.ring_gauge, nextData.ring_gauge, "ring_gauge"],
      ["Deckblatt", originalData.wrapper, nextData.wrapper, "text"],
      ["Preis", originalData.price_eur, nextData.price_eur, "price"],
      ["Serie", originalData.series, nextData.series, "text"],
      ["Vorläufig", originalData.provisional, nextData.provisional, "boolean"],
      ["Sammlerstück / Sonderedition", originalData.collector, nextData.collector, "boolean"]
    ];

    fields.forEach(([label, before, after, type]) => {
      const left = before == null ? null : String(before);
      const right = after == null ? null : String(after);
      if (left === right) return;
      changes.push(`${label}: ${formatLogValue(before, type)} → ${formatLogValue(after, type)}`);
    });

    extraChanges.forEach((entry) => {
      if (entry) changes.push(entry);
    });

    return changes.join(" | ");
  }

  function getLogDisplayName(user) {
    return user?.display_name || user?.username || null;
  }

  async function writeLogEntry({ action, itemType, itemId, itemName, details }) {
    const currentUser = resolveCurrentUser();
    const accessToken = await getAccessToken();

    const res = await fetch(`${SUPABASE_URL}/rest/v1/gdb_log`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: currentUser?.id || null,
        username: getLogDisplayName(currentUser),
        action,
        item_type: itemType,
        item_id: itemId,
        item_name: itemName || null,
        details: details || null
      })
    });

    if (!res.ok) {
      throw new Error(`Logeintrag schreiben fehlgeschlagen (HTTP ${res.status})`);
    }
  }

  function renderDetailChangelog(entries) {
    if (!detailChangelogListEl) return;

    if (!Array.isArray(entries) || entries.length === 0) {
      detailChangelogListEl.innerHTML = `<div class="detail-changelog-empty">Noch keine Änderungen vorhanden.</div>`;
      return;
    }

    detailChangelogListEl.innerHTML = entries.map((entry) => {
      const ts = fmtDE(entry.timestamp);
      const userText = entry.display_name || entry.username || "–";
      const detailsText = entry.details || "–";
      return `
        <div class="detail-changelog-entry">
          <div class="detail-changelog-meta">${ts} · ${userText}</div>
          <div class="detail-changelog-details">${detailsText}</div>
        </div>
      `;
    }).join("");
  }

  async function loadDetailChangelog() {
    if (!detailChangelogListEl || !id) return;

    const accessToken = await getAccessToken();

    const url =
      `${SUPABASE_URL}/rest/v1/gdb_log` +
      `?item_type=eq.cigar` +
      `&item_id=eq.${encodeURIComponent(id)}` +
      `&order=timestamp.desc` +
      `&limit=10` +
      `&select=timestamp,username,user_id,details`;

    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok) {
      throw new Error(`Änderungsverlauf laden fehlgeschlagen (HTTP ${res.status})`);
    }

  const rows = await res.json();

  try {
    const userIds = rows.map(r => r.user_id).filter(Boolean);
    const userMap = await fetchUserDisplayMap(userIds);

    rows.forEach(r => {
      if (r.user_id && userMap[r.user_id]) {
        r.display_name = userMap[r.user_id];
      }
    });
  } catch (e) {
    console.error(e);
  }

  renderDetailChangelog(rows);
  }  

  function getStoragePathFromPublicUrl(publicUrl) {
    if (!publicUrl) return null;

    try {
      const url = new URL(publicUrl, window.location.origin);
      const marker = "/storage/v1/object/public/cigars/";
      const idx = url.pathname.indexOf(marker);
      if (idx === -1) return null;
      return decodeURIComponent(url.pathname.slice(idx + marker.length));
    } catch {
      return null;
    }
  }

  async function saveImageToStorage() {
    const parentSupabase = window.parent?.supabaseClient || window.parent?.supabase || window.supabaseClient || window.supabase || null;

    if (!id) {
      throw new Error("Zigarren-ID fehlt");
    }

    if (!parentSupabase?.storage?.from) {
      throw new Error("Supabase Storage nicht verfügbar");
    }

    const oldPath = getStoragePathFromPublicUrl(originalImageUrl);
    const oldThumbnailPath = getStoragePathFromPublicUrl(originalThumbnailUrl);
    const oldPaths = [oldPath, oldThumbnailPath].filter(Boolean);

    if (deleteImageOnSave) {
      const rows = await saveMasterDataToDb({ image_url: null, thumbnail_url: null });
      const row = Array.isArray(rows) ? rows[0] : null;
      savedImageUrl = (row?.image_url ?? "").toString();
      savedThumbnailUrl = (row?.thumbnail_url ?? "").toString();
      originalImageUrl = savedImageUrl;
      originalThumbnailUrl = savedThumbnailUrl;

      if (oldPaths.length) {
        const { error: cleanupError } = await parentSupabase.storage.from("cigars").remove(oldPaths);
        if (cleanupError) throw cleanupError;
      }

      pendingImageFile = null;
      deleteImageOnSave = false;
      return savedImageUrl;
    }

    if (!pendingImageFile) {
      return savedImageUrl;
    }

    if (!window.GdbCigarImages?.createThumbnail) {
      throw new Error("Thumbnail-Erzeugung ist nicht verfügbar");
    }

    const ext = (pendingImageFile.name.split(".").pop() || "jpg").toLowerCase();
    const safeExt = ext.replace(/[^a-z0-9]/g, "") || "jpg";
    const timestamp = Date.now();
    const filePath = `cigar_${id}_${timestamp}.${safeExt}`;
    const thumbnailBlob = await window.GdbCigarImages.createThumbnail(pendingImageFile);
    const thumbnailIsWebp = thumbnailBlob.type === "image/webp";
    const thumbnailExtension = thumbnailIsWebp ? "webp" : "jpg";
    const thumbnailContentType = thumbnailIsWebp ? "image/webp" : "image/jpeg";
    const thumbnailPath = `thumbnails/cigar_${id}_${timestamp}.${thumbnailExtension}`;
    const uploadedPaths = [];
    let imageUrlsUpdated = false;

    try {
      const { error: uploadError } = await parentSupabase.storage
        .from("cigars")
        .upload(filePath, pendingImageFile, {
          cacheControl: "31536000",
          upsert: false,
          contentType: pendingImageFile.type || undefined
        });
      if (uploadError) {
        throw new Error(`Originalbild-Upload fehlgeschlagen: ${uploadError.message || "Unbekannter Storage-Fehler"}`);
      }
      uploadedPaths.push(filePath);

      const { error: thumbnailUploadError } = await parentSupabase.storage
        .from("cigars")
        .upload(thumbnailPath, thumbnailBlob, {
          cacheControl: "31536000",
          upsert: false,
          contentType: thumbnailContentType
        });
      if (thumbnailUploadError) {
        throw new Error(`Thumbnail-Upload fehlgeschlagen: ${thumbnailUploadError.message || "Unbekannter Storage-Fehler"}`);
      }
      uploadedPaths.push(thumbnailPath);

      const publicUrl = parentSupabase.storage.from("cigars").getPublicUrl(filePath).data?.publicUrl || "";
      const thumbnailUrl = parentSupabase.storage.from("cigars").getPublicUrl(thumbnailPath).data?.publicUrl || "";
      if (!publicUrl || !thumbnailUrl) throw new Error("Bild-URLs konnten nicht erzeugt werden");

      const rows = await saveMasterDataToDb({
        image_url: publicUrl,
        thumbnail_url: thumbnailUrl
      });
      const row = Array.isArray(rows) ? rows[0] : null;

      savedImageUrl = (row?.image_url ?? publicUrl).toString();
      savedThumbnailUrl = (row?.thumbnail_url ?? thumbnailUrl).toString();
      originalImageUrl = savedImageUrl;
      originalThumbnailUrl = savedThumbnailUrl;
      imageUrlsUpdated = true;

      if (oldPaths.length) {
        const pathsToRemove = oldPaths.filter((path) => path !== filePath && path !== thumbnailPath);
        if (pathsToRemove.length) {
          const { error: cleanupError } = await parentSupabase.storage.from("cigars").remove(pathsToRemove);
          if (cleanupError) throw cleanupError;
        }
      }

      pendingImageFile = null;
      deleteImageOnSave = false;
      return savedImageUrl;
    } catch (error) {
      if (uploadedPaths.length && !imageUrlsUpdated) {
        const { error: cleanupError } = await parentSupabase.storage.from("cigars").remove(uploadedPaths);
        if (cleanupError) console.error("Neue Bilddateien konnten nicht vollständig bereinigt werden:", cleanupError);
      }
      throw error;
    }
  }
  function applyMasterDataEditMode() {
    document.querySelectorAll(".cigar-extra-master").forEach(el => { el.hidden = isMasterDataEditMode; el.style.display = isMasterDataEditMode ? "none" : ""; });
    if (masterDataEditHintEl) {
      masterDataEditHintEl.hidden = !isMasterDataEditMode;
    }

    if (masterDataViewModeEl) {
      masterDataViewModeEl.dataset.editMode = isMasterDataEditMode ? "on" : "off";
    }

    if (titleEl) {
      titleEl.hidden = isMasterDataEditMode;
      titleEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (brandEl) {
      brandEl.hidden = isMasterDataEditMode;
      brandEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (dotEl) {
      dotEl.hidden = isMasterDataEditMode;

      if (isMasterDataEditMode) {
        dotEl.style.display = "none";
      } else {
        const hasBrand = !!((savedBrand ?? "").toString().trim());
        const hasManufacturer = !!((savedManufacturer ?? "").toString().trim());
        dotEl.style.display = (hasBrand && hasManufacturer) ? "inline" : "none";
      }
    }

    if (manufacturerEl) {
      manufacturerEl.hidden = isMasterDataEditMode;
      manufacturerEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (originLine) {
      originLine.hidden = isMasterDataEditMode;
      originLine.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (statsLineEl) {
      statsLineEl.hidden = isMasterDataEditMode;
      statsLineEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (caskLineEl) {
      caskLineEl.hidden = isMasterDataEditMode;
      caskLineEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (priceEl) {
      priceEl.hidden = isMasterDataEditMode;
      priceEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (outturnLineEl) {
      outturnLineEl.hidden = isMasterDataEditMode;
      outturnLineEl.style.display = isMasterDataEditMode ? "none" : (!!savedSeries ? "" : "none");
    }

    if (detailAvgRatingStarsEl) {
      detailAvgRatingStarsEl.hidden = isMasterDataEditMode;
      detailAvgRatingStarsEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (detailAvgRatingTextEl) {
      detailAvgRatingTextEl.hidden = isMasterDataEditMode;
      detailAvgRatingTextEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (detailAvgPliTextEl) {
      detailAvgPliTextEl.hidden = isMasterDataEditMode;
      detailAvgPliTextEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (detailPliScaleEl) {
      detailPliScaleEl.hidden = isMasterDataEditMode;
      detailPliScaleEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    const avgRatingContainer = detailAvgRatingTextEl?.closest(".metrics-block") || document.getElementById("detailAvgRatingBlock");
    if (avgRatingContainer) {
      avgRatingContainer.hidden = isMasterDataEditMode;
      avgRatingContainer.style.display = isMasterDataEditMode ? "none" : "";
    }

    const avgPliContainer = detailAvgPliTextEl?.closest(".metrics-block") || document.getElementById("detailAvgPliBlock");
    if (avgPliContainer) {
      avgPliContainer.hidden = isMasterDataEditMode;
      avgPliContainer.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (masterDataEditFieldsEl) {
      masterDataEditFieldsEl.hidden = !isMasterDataEditMode;
      masterDataEditFieldsEl.style.display = isMasterDataEditMode ? "block" : "none";
    }
    if (imageEditFieldsEl) {
      imageEditFieldsEl.hidden = !isMasterDataEditMode;
      imageEditFieldsEl.style.display = isMasterDataEditMode ? "block" : "none";
    }

    if (isMasterDataEditMode) {
      window.GdbCigarFields.set(originalCigarFields);
      if (editCigarNameEl) editCigarNameEl.value = originalCigarName || "";
      if (editBrandEl) editBrandEl.value = originalBrand || "";
      if (editManufacturerEl) editManufacturerEl.value = originalManufacturer || "";
      if (editCountryEl) editCountryEl.value = originalCountry || "";
      if (editRegionEl) editRegionEl.value = originalRegion || "";
      filterRegionsByCountry();
      if (editFlagUrlEl) editFlagUrlEl.value = originalFlagUrl || "";
      if (editRegionFlagUrlEl) editRegionFlagUrlEl.value = originalRegionFlagUrl || "";
      syncFlagFieldsFromSelection();
      if (editLengthMmEl) editLengthMmEl.value = originalLengthMm == null ? "" : String(originalLengthMm);
      if (editRingGaugeEl) editRingGaugeEl.value = originalRingGauge == null ? "" : String(originalRingGauge);
      if (editWrapperEl) editWrapperEl.value = originalWrapper || "";
      if (editPriceEurEl) editPriceEurEl.value = originalPriceEur == null ? "" : String(originalPriceEur);
      if (editSeriesEl) editSeriesEl.value = originalSeries == null ? "" : String(originalSeries);
      if (editIsIncompleteEl) editIsIncompleteEl.checked = !!originalProvisional;
      if (editIsCollectorEl) editIsCollectorEl.checked = !!originalCollector;
      if (collectorBadgeEl) {
        collectorBadgeEl.style.display = originalCollector ? "inline-flex" : "none";
      }
      if (provisionalBadgeEl) {
        provisionalBadgeEl.hidden = !originalProvisional;
        provisionalBadgeEl.style.display = originalProvisional ? "inline-block" : "none";
      }
      pendingImageFile = null;
      deleteImageOnSave = false;
      if (editImageUploadEl) {
        editImageUploadEl.value = "";
      }
      if (imageEditHintEl) {
        imageEditHintEl.hidden = true;
        imageEditHintEl.textContent = "";
      }
    }

    if (btnEditMasterData) {
      btnEditMasterData.textContent = isMasterDataEditMode
        ? "Speichern & Bearbeitung beenden"
        : "Stammdaten bearbeiten";
      btnEditMasterData.setAttribute("aria-pressed", isMasterDataEditMode ? "true" : "false");
    }

    if (btnDeleteCigar) {
      btnDeleteCigar.hidden = isMasterDataEditMode;
      btnDeleteCigar.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (btnCancelMasterDataEdit) {
      btnCancelMasterDataEdit.hidden = !isMasterDataEditMode;
    }
  }
if (btnEditMasterData) {
  btnEditMasterData.addEventListener("click", async () => {
    if (!isMasterDataEditMode) {
      if (!requireUpdatePermission()) {
        return;
      }

      originalCigarFields = { ...savedCigarFields };
        originalCigarName = savedCigarName;
        originalBrand = savedBrand;
        originalManufacturer = savedManufacturer;
        originalCountry = savedCountry;
        originalRegion = savedRegion;
        originalFlagUrl = savedFlagUrl;
        originalRegionFlagUrl = savedRegionFlagUrl;
        originalLengthMm = savedLengthMm;
        originalRingGauge = savedRingGauge;
        originalWrapper = savedWrapper;
        originalPriceEur = savedPriceEur;
        originalProvisional = savedProvisional;
        originalCollector = savedCollector;
        originalSeries = savedSeries;
        originalImageUrl = savedImageUrl;
        originalThumbnailUrl = savedThumbnailUrl;

        if (masterDataEditHintEl) {
          masterDataEditHintEl.textContent = defaultMasterDataHintText;
        }

        isMasterDataEditMode = true;
        applyMasterDataEditMode();
        return;
      }

      if (!requireUpdatePermission()) {
        return;
      }

      const nextCigarName = (editCigarNameEl?.value || "").trim();
      const nextBrand = (editBrandEl?.value || "").trim();
      const nextManufacturer = (editManufacturerEl?.value || "").trim();
      const nextCountry = (editCountryEl?.value || "").trim();
      const nextRegion = (editRegionEl?.value || "").trim();
      const nextFlagUrl = getCountryFlagUrl(nextCountry);
      const nextRegionFlagUrl = getRegionFlagUrl(nextRegion);
      const nextLengthMm = (editLengthMmEl?.value === "" || editLengthMmEl?.value == null)
        ? null
        : Number(editLengthMmEl.value);
      const nextRingGauge = (editRingGaugeEl?.value === "" || editRingGaugeEl?.value == null)
        ? null
        : Number(editRingGaugeEl.value);
      const nextWrapper = (editWrapperEl?.value || "").trim();
      const nextPriceEur = (editPriceEurEl?.value === "" || editPriceEurEl?.value == null)
        ? null
        : Number(editPriceEurEl.value);
      const nextSeries = (editSeriesEl?.value || "").trim() || null;
      const nextProvisional = !!editIsIncompleteEl?.checked;
      const nextCollector = !!editIsCollectorEl?.checked;
      const hadPendingImageFile = !!pendingImageFile;
      const hadDeleteImageOnSave = !!deleteImageOnSave;

      if (!nextCigarName) {
        if (masterDataEditHintEl) {
          masterDataEditHintEl.hidden = false;
          masterDataEditHintEl.textContent = "Bitte zuerst einen Zigarrennamen eingeben";
        }
        return;
      }

      if (btnEditMasterData) btnEditMasterData.disabled = true;
      if (btnCancelMasterDataEdit) btnCancelMasterDataEdit.disabled = true;
      if (masterDataEditHintEl) {
        masterDataEditHintEl.hidden = false;
        masterDataEditHintEl.textContent = "Speichere…";
      }

      try {
        const nextCigarFields = window.GdbCigarFields.read();
        const savedRows = await saveMasterDataToDb({
          ...nextCigarFields,
          name: nextCigarName || null,
          brand: nextBrand || null,
          manufacturer: nextManufacturer || null,
          country: nextCountry || null,
          region: nextRegion || null,
          flag_url: nextFlagUrl || null,
          region_flag_url: nextRegionFlagUrl || null,
          length_mm: nextLengthMm,
          ring_gauge: nextRingGauge,
          wrapper: nextWrapper || null,
          price_eur: nextPriceEur,
          series: nextSeries,
          provisional: nextProvisional,
          collector: nextCollector
        });

        const savedRow = Array.isArray(savedRows) ? savedRows[0] : null;
        if (!savedRow) throw new Error('Kein gespeicherter Datensatz zurückgegeben.');
        savedCigarFields = window.GdbCigarFields.normalize(savedRow);

        savedCigarName = (savedRow?.name ?? nextCigarName ?? "").toString();
        savedBrand = (savedRow?.brand ?? nextBrand ?? "").toString();
        savedManufacturer = (savedRow?.manufacturer ?? nextManufacturer ?? "").toString();
        savedCountry = (savedRow?.country ?? nextCountry ?? "").toString();
        savedRegion = (savedRow?.region ?? nextRegion ?? "").toString();
        savedFlagUrl = (savedRow?.flag_url ?? nextFlagUrl ?? "").toString();
        savedRegionFlagUrl = (savedRow?.region_flag_url ?? nextRegionFlagUrl ?? "").toString();
        savedLengthMm = (savedRow?.length_mm == null || Number.isNaN(Number(savedRow?.length_mm))) ? null : Number(savedRow.length_mm);
        savedRingGauge = (savedRow?.ring_gauge == null || Number.isNaN(Number(savedRow?.ring_gauge))) ? null : Number(savedRow.ring_gauge);
        savedWrapper = (savedRow?.wrapper ?? nextWrapper ?? "").toString();
        savedPriceEur = (savedRow?.price_eur == null || Number.isNaN(Number(savedRow?.price_eur))) ? null : Number(savedRow.price_eur);
        savedSeries = (savedRow?.series ?? nextSeries ?? "").toString();
        savedProvisional = !!(savedRow?.provisional ?? nextProvisional);
        savedCollector = !!(savedRow?.collector ?? nextCollector);

        const logOriginalData = {
          ...originalCigarFields,
          name: originalCigarName || null,
          brand: originalBrand || null,
          manufacturer: originalManufacturer || null,
          country: originalCountry || null,
          region: originalRegion || null,
          length_mm: originalLengthMm,
          ring_gauge: originalRingGauge,
          wrapper: originalWrapper || null,
          price_eur: originalPriceEur,
          series: originalSeries,
          provisional: !!originalProvisional,
          collector: !!originalCollector
        };

        await saveImageToStorage();

        const logNextData = {
          ...savedCigarFields,
          name: savedCigarName || null,
          brand: savedBrand || null,
          manufacturer: savedManufacturer || null,
          country: savedCountry || null,
          region: savedRegion || null,
          length_mm: savedLengthMm,
          ring_gauge: savedRingGauge,
          wrapper: savedWrapper || null,
          price_eur: savedPriceEur,
          series: savedSeries,
          provisional: !!savedProvisional,
          collector: !!savedCollector
        };

        const extraLogChanges = [];
        if (hadDeleteImageOnSave) extraLogChanges.push("Bild: gelöscht");
        else if (hadPendingImageFile) extraLogChanges.push("Bild: geändert");

        const logDetails = buildMasterDataLogDetails(logOriginalData, logNextData, extraLogChanges);
        if (logDetails) {
          try {
            await writeLogEntry({
              action: "update",
              itemType: "cigar",
              itemId: id,
              itemName: savedCigarName || nextCigarName || null,
              details: logDetails
            });
            await loadDetailChangelog();
          } catch (logErr) {
            console.error(logErr);
          }
        }

        originalCigarFields = { ...savedCigarFields };
        originalCigarName = savedCigarName;
        originalBrand = savedBrand;
        originalManufacturer = savedManufacturer;
        originalCountry = savedCountry;
        originalRegion = savedRegion;
        originalFlagUrl = savedFlagUrl;
        originalRegionFlagUrl = savedRegionFlagUrl;
        originalLengthMm = savedLengthMm;
        originalRingGauge = savedRingGauge;
        originalWrapper = savedWrapper;
        originalPriceEur = savedPriceEur;
        originalProvisional = savedProvisional;
        originalCollector = savedCollector;
        originalSeries = savedSeries;
        originalImageUrl = savedImageUrl;
        originalThumbnailUrl = savedThumbnailUrl;

        if (imgEl) {
          imgEl.src = savedImageUrl || DEFAULT_IMAGE_URL;
        }

        if (editImageUploadEl) {
          editImageUploadEl.value = "";
        }
        if (imageEditHintEl) {
          imageEditHintEl.hidden = true;
          imageEditHintEl.textContent = "";
        }

        renderMasterDataView();

        if (cEl) cEl.textContent = fmtDE(savedRow?.created_at || "");
        if (uEl) uEl.textContent = fmtDE(savedRow?.updated_at || "");

        try {
          const savedCreatedBy = savedRow?.created_by || "";
          const savedUpdatedBy = savedRow?.updated_by || "";
          const userMap = await fetchUserDisplayMap([savedCreatedBy, savedUpdatedBy]);
          if (createdByEl) createdByEl.textContent = savedCreatedBy ? (userMap[savedCreatedBy] || "–") : "–";
          if (updatedByEl) updatedByEl.textContent = savedUpdatedBy ? (userMap[savedUpdatedBy] || "–") : "–";
        } catch (userErr) {
          console.error(userErr);
        }

        isMasterDataEditMode = false;
        if (masterDataEditHintEl) {
          masterDataEditHintEl.textContent = defaultMasterDataHintText;
        }
        applyMasterDataEditMode();
        try { await refreshPersonalData(); }
        catch (refreshError) {
          console.error(refreshError);
          masterDataEditHintEl.hidden = false;
          masterDataEditHintEl.textContent = "Gespeichert; persönliche Daten bitte durch erneutes Öffnen aktualisieren.";
        }
      } catch (err) {
        console.error(err);
        if (masterDataEditHintEl) {
          masterDataEditHintEl.hidden = false;
          masterDataEditHintEl.textContent = `Speichern fehlgeschlagen: ${err?.message || "Unbekannter Fehler"}`;
        }
      } finally {
        if (btnEditMasterData) btnEditMasterData.disabled = false;
        if (btnCancelMasterDataEdit) btnCancelMasterDataEdit.disabled = false;
      }
    });
  }

  if (btnCancelMasterDataEdit) {
    btnCancelMasterDataEdit.addEventListener("click", () => {
      window.GdbCigarFields.set(originalCigarFields);
      if (editCigarNameEl) editCigarNameEl.value = originalCigarName || "";
      if (editBrandEl) editBrandEl.value = originalBrand || "";
      if (editManufacturerEl) editManufacturerEl.value = originalManufacturer || "";
      if (editCountryEl) editCountryEl.value = originalCountry || "";
      if (editRegionEl) editRegionEl.value = originalRegion || "";
      filterRegionsByCountry();
      if (editFlagUrlEl) editFlagUrlEl.value = originalFlagUrl || "";
      if (editRegionFlagUrlEl) editRegionFlagUrlEl.value = originalRegionFlagUrl || "";
      syncFlagFieldsFromSelection();
      if (editLengthMmEl) editLengthMmEl.value = originalLengthMm == null ? "" : String(originalLengthMm);
      if (editRingGaugeEl) editRingGaugeEl.value = originalRingGauge == null ? "" : String(originalRingGauge);
      if (editWrapperEl) editWrapperEl.value = originalWrapper || "";
      if (editPriceEurEl) editPriceEurEl.value = originalPriceEur == null ? "" : String(originalPriceEur);
      if (editSeriesEl) editSeriesEl.value = originalSeries == null ? "" : String(originalSeries);
      if (editIsIncompleteEl) editIsIncompleteEl.checked = !!originalProvisional;
      if (editIsCollectorEl) editIsCollectorEl.checked = !!originalCollector;
      if (collectorBadgeEl) {
        collectorBadgeEl.style.display = originalCollector ? "inline-flex" : "none";
      }
      if (provisionalBadgeEl) {
        provisionalBadgeEl.hidden = !originalProvisional;
        provisionalBadgeEl.style.display = originalProvisional ? "inline-block" : "none";
      }
      pendingImageFile = null;
      deleteImageOnSave = false;
      savedImageUrl = originalImageUrl;
      if (imgEl) {
        imgEl.src = savedImageUrl || DEFAULT_IMAGE_URL;
      }
      if (editImageUploadEl) {
        editImageUploadEl.value = "";
      }
      if (imageEditHintEl) {
        imageEditHintEl.hidden = true;
        imageEditHintEl.textContent = "";
      }
      isMasterDataEditMode = false;
      applyMasterDataEditMode();
    });
  }

if (btnDeleteCigar) {
  btnDeleteCigar.addEventListener("click", () => {
    if (!requireDeletePermission()) {
      return;
    }

    const cigarLabel = (savedCigarName || originalCigarName || "diese Zigarre").trim();
    openDeleteCigarModal(cigarLabel);
  });
}

if (btnCancelDeleteCigar) {
  btnCancelDeleteCigar.addEventListener("click", () => {
    closeDeleteCigarModal();
  });
}

if (btnConfirmDeleteCigar) {
  btnConfirmDeleteCigar.addEventListener("click", async () => {
    if (!requireDeletePermission()) {
      return;
    }

    const cigarLabel = (savedCigarName || originalCigarName || "diese Zigarre").trim();
    const originalDeleteText = btnDeleteCigar?.textContent || "Zigarre löschen";
    const originalHintText = masterDataEditHintEl?.textContent || defaultMasterDataHintText;

    closeDeleteCigarModal();

    if (btnDeleteCigar) btnDeleteCigar.disabled = true;
    if (btnEditMasterData) btnEditMasterData.disabled = true;
    if (masterDataEditHintEl) {
      masterDataEditHintEl.hidden = false;
      masterDataEditHintEl.textContent = "Lösche Zigarre…";
    }

    let deletionCompleted = false;
    try {
      const cleanupWarning = await deleteCigarFromDb();
      deletionCompleted = true;

      try {
        await writeLogEntry({
          action: "delete",
          itemType: "cigar",
          itemId: id,
          itemName: cigarLabel,
          details: cleanupWarning ? `Zigarren gelöscht | ${cleanupWarning}` : "Zigarren gelöscht"
        });
      } catch (logErr) {
        console.error(logErr);
      }

      window.parent?.postMessage({ type: "gdb-cigar-nav", view: "cigarList", message: cleanupWarning }, "*");
    } catch (err) {
      console.error(err);
      if (masterDataEditHintEl) {
        masterDataEditHintEl.hidden = false;
        masterDataEditHintEl.textContent = `Löschen fehlgeschlagen: ${err?.message || "Unbekannter Fehler"}`;
      }
    } finally {
      if (btnDeleteCigar) {
        btnDeleteCigar.disabled = false;
        btnDeleteCigar.textContent = originalDeleteText;
      }
      if (btnEditMasterData) btnEditMasterData.disabled = false;
      if (masterDataEditHintEl && !isMasterDataEditMode && deletionCompleted) {
        masterDataEditHintEl.hidden = true;
        masterDataEditHintEl.textContent = originalHintText;
      }
    }
  });
}

if (deleteCigarModalEl) {
  deleteCigarModalEl.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.hasAttribute("data-close-delete-modal")) {
      closeDeleteCigarModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (deleteCigarModalEl && !deleteCigarModalEl.classList.contains("hidden")) {
    closeDeleteCigarModal();
  }
});

  let savedExtraTasting = Object.fromEntries(window.GdbCigarFields.TASTING.map(([key]) => [key, params.get(key) || null]));
  let originalMyNotes = myNotes;
  let savedMyRating = (myRating == null || Number.isNaN(myRating)) ? null : Number(myRating);
  let originalMyRating = savedMyRating;
  let currentEditMyRating = savedMyRating;
  let savedMyPli = (myPli == null || Number.isNaN(myPli)) ? null : Number(myPli);
  let originalMyPli = savedMyPli;
  let savedMyColor = myColor;
  let originalMyColor = myColor;
  let savedMyNose = myNose;
  let originalMyNose = myNose;
  let savedMyPalate = myPalate;
  let originalMyPalate = myPalate;
  let savedMyFinish = myFinish;
  let originalMyFinish = myFinish;
  let savedMySummary = mySummary;
  let originalMySummary = mySummary;
  let savedMyTrinkgelegenheit = myTrinkgelegenheit;
  let originalMyTrinkgelegenheit = myTrinkgelegenheit;
  let savedMyWishlist = !!myWishlist;
  let originalMyWishlist = !!myWishlist;
  let savedMyStock = Number.isFinite(myStockMl) ? Math.max(0, myStockMl) : 0;
  let originalMyStock = savedMyStock;


  const defaultMyDetailsHintText = myDetailsEditHintEl
    ? (myDetailsEditHintEl.textContent || "Bearbeitungsmodus aktiv")
    : "Bearbeitungsmodus aktiv";

  async function saveMyDetailsToDb(nextNotes, nextColor, nextNose, nextPalate, nextFinish, nextSummary, nextTrinkgelegenheit, nextWishlist, nextStock, nextRating) {
    const parentSupabase = window.parent?.supabaseClient || window.supabaseClient || null;
    const parentCurrentUser = window.parent?.currentUser || window.currentUser || null;

    if (!id) {
      throw new Error("Zigarren-ID fehlt");
    }

    if (!parentCurrentUser?.id) {
      throw new Error("Kein eingeloggter Nutzer gefunden");
    }

    const accessToken = await getAccessToken();

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/gdb_cigar_user?on_conflict=cigar_id,user_id`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=representation"
        },
        body: JSON.stringify({
          cigar_id: id,
          user_id: parentCurrentUser.id,
          ...window.GdbCigarFields.readTasting(),
          notes: nextNotes,
          t_color: nextColor,
          t_nose: nextNose,
          t_palate: nextPalate,
          t_finish: nextFinish,
          t_summary: nextSummary,
          t_trinkgelegenheit: nextTrinkgelegenheit,
          wishlist: nextWishlist,
          stock: nextStock,
          rating: nextRating
        })
      }
    );

    if (!res.ok) {
      throw new Error(`Speichern fehlgeschlagen (HTTP ${res.status})`);
    }

    return await res.json();
  }

  function updateMyRatingView(ratingValue) {
    const val = (ratingValue == null || Number.isNaN(ratingValue)) ? null : Number(ratingValue);

    if (detailMyRatingStarsEl) {
      detailMyRatingStarsEl.innerHTML = renderStars(val);
    }

    if (detailMyRatingTextEl) {
      detailMyRatingTextEl.textContent = (val == null)
        ? "-/10"
        : `${Math.round(val)}/10`;
    }
  }

  function updateMyPliView(pliValue) {
    const val = (pliValue == null || Number.isNaN(pliValue)) ? null : Number(pliValue);

    if (detailMyPliTextEl) {
      detailMyPliTextEl.textContent = (val == null) ? "–" : val.toFixed(2);
    }

    if (detailMyPliScaleEl) {
      if (val == null || pliMin == null || pliMax == null) {
        detailMyPliScaleEl.innerHTML = `<span class="muted">–</span>`;
      } else {
        detailMyPliScaleEl.innerHTML = renderPliScaleDetail(val, pliMin, pliMax);
      }
    }
  }

  function updateAvgRatingView(avgValue, countValue) {
    const val = (avgValue == null || Number.isNaN(avgValue)) ? null : Number(avgValue);
    const cnt = Math.max(0, Number(countValue) || 0);

    if (detailAvgRatingStarsEl) {
      detailAvgRatingStarsEl.innerHTML = renderStars(val);
    }

    if (detailAvgRatingTextEl) {
      detailAvgRatingTextEl.textContent = (val == null || cnt === 0)
        ? "-/10 (0)"
        : `${Math.round(val)}/10 (${cnt})`;
    }
  }

  function updateAvgPliView(avgValue, countValue) {
    const val = (avgValue == null || Number.isNaN(avgValue)) ? null : Number(avgValue);
    const cnt = Math.max(0, Number(countValue) || 0);

    if (detailAvgPliTextEl) {
      detailAvgPliTextEl.textContent = (val == null || cnt === 0)
        ? "– (0)"
        : `${val.toFixed(2)} (${cnt})`;
    }

    if (detailPliScaleEl) {
      if (val == null || cnt === 0) {
        detailPliScaleEl.innerHTML = `<span class="muted">–</span>`;
      } else {
        detailPliScaleEl.innerHTML = renderPliScaleDetail(val, pliMin, pliMax);
      }
    }
  }

  function renderEditableRatingStars(value) {
    if (!editMyRatingStarsEl) return;

    const current = (value == null || Number.isNaN(value)) ? null : Number(value);
    editMyRatingStarsEl.innerHTML = "";

    for (let i = 1; i <= 10; i++) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "detail-rating-star-btn";
      btn.setAttribute("aria-label", `Bewertung ${i} von 10`);
      btn.setAttribute("aria-checked", current === i ? "true" : "false");
      btn.dataset.value = String(i);
      btn.textContent = i <= (current || 0) ? "★" : "☆";
      btn.addEventListener("click", () => {
        currentEditMyRating = (currentEditMyRating === i) ? null : i;
        renderEditableRatingStars(currentEditMyRating);
      });
      editMyRatingStarsEl.appendChild(btn);
    }
  }

  function updateStockVisual(stockUnits) {
    const stock = Math.max(0, Number(stockUnits) || 0);
    const bottleWrapEl = detailBottleWrapEl || document.getElementById("detailBottleWrap");
    if (bottleWrapEl) { bottleWrapEl.hidden = true; bottleWrapEl.style.display = "none"; bottleWrapEl.replaceChildren(); }
    if (stockTextEl) stockTextEl.textContent = stock + (stock === 1 ? " Zigarre" : " Zigarren");
  }

  function applyMyDetailsEditMode() {
    window.GdbCigarFields.renderTasting(savedExtraTasting, isMyDetailsEditMode);
    if (wishlistEl) {
      wishlistEl.hidden = isMyDetailsEditMode;
      wishlistEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMyWishlistEl) {
      editMyWishlistEl.hidden = !isMyDetailsEditMode;
      editMyWishlistEl.style.display = isMyDetailsEditMode ? "inline-block" : "none";
      if (isMyDetailsEditMode) {
        editMyWishlistEl.checked = !!savedMyWishlist;
      }
    }
    if (stockTextEl) {
      stockTextEl.hidden = isMyDetailsEditMode;
      stockTextEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMyStockWrapEl) {
      editMyStockWrapEl.hidden = !isMyDetailsEditMode;
      editMyStockWrapEl.style.display = isMyDetailsEditMode ? "block" : "none";
    }

    if (editMyStockEl && isMyDetailsEditMode) {
      editMyStockEl.value = String(Math.max(0, Number(savedMyStock) || 0));
    }
    if (detailBottleWrapEl) {
      detailBottleWrapEl.hidden = isMyDetailsEditMode;
      detailBottleWrapEl.style.display = isMyDetailsEditMode ? "none" : "block";
    }
    if (myDetailsEditHintEl) {
      myDetailsEditHintEl.hidden = !isMyDetailsEditMode;
    }

    if (myDetailsViewModeEl) {
      myDetailsViewModeEl.dataset.editMode = isMyDetailsEditMode ? "on" : "off";
    }

    if (detailMyRatingStarsEl) {
      detailMyRatingStarsEl.hidden = isMyDetailsEditMode;
      detailMyRatingStarsEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (detailMyRatingTextEl) {
      detailMyRatingTextEl.hidden = isMyDetailsEditMode;
      detailMyRatingTextEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (detailMyPliTextEl) {
      detailMyPliTextEl.hidden = isMyDetailsEditMode;
      detailMyPliTextEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (detailMyPliScaleEl) {
      detailMyPliScaleEl.hidden = isMyDetailsEditMode;
      detailMyPliScaleEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    const pliContainer = detailMyPliTextEl?.closest(".metrics-block") || document.getElementById("detailMyPliBlock");
    if (pliContainer) {
      pliContainer.hidden = isMyDetailsEditMode;
      pliContainer.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMyRatingWrapEl) {
      editMyRatingWrapEl.hidden = !isMyDetailsEditMode;
      editMyRatingWrapEl.style.display = isMyDetailsEditMode ? "flex" : "none";
      if (isMyDetailsEditMode) {
        renderEditableRatingStars(currentEditMyRating);
      }
    }

    if (notesEl) {
      notesEl.hidden = isMyDetailsEditMode;
      notesEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMyNotesEl) {
      editMyNotesEl.hidden = !isMyDetailsEditMode;
      editMyNotesEl.style.display = isMyDetailsEditMode ? "block" : "none";
      if (isMyDetailsEditMode) {
        editMyNotesEl.value = notesEl && notesEl.textContent && notesEl.textContent !== "–"
          ? notesEl.textContent
          : myNotes;
      }
    }

    if (colorEl) {
      colorEl.hidden = isMyDetailsEditMode;
      colorEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMyColorEl) {
      editMyColorEl.hidden = !isMyDetailsEditMode;
      editMyColorEl.style.display = isMyDetailsEditMode ? "block" : "none";
      if (isMyDetailsEditMode) {
        editMyColorEl.value = colorEl && colorEl.textContent && colorEl.textContent !== "–"
          ? colorEl.textContent
          : myColor;
      }
    }

    if (noseEl) {
      noseEl.hidden = isMyDetailsEditMode;
      noseEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMyNoseEl) {
      editMyNoseEl.hidden = !isMyDetailsEditMode;
      editMyNoseEl.style.display = isMyDetailsEditMode ? "block" : "none";
      if (isMyDetailsEditMode) {
        editMyNoseEl.value = noseEl && noseEl.textContent && noseEl.textContent !== "–"
          ? noseEl.textContent
          : myNose;
      }
    }

    if (palateEl) {
      palateEl.hidden = isMyDetailsEditMode;
      palateEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMyPalateEl) {
      editMyPalateEl.hidden = !isMyDetailsEditMode;
      editMyPalateEl.style.display = isMyDetailsEditMode ? "block" : "none";
      if (isMyDetailsEditMode) {
        editMyPalateEl.value = palateEl && palateEl.textContent && palateEl.textContent !== "–"
          ? palateEl.textContent
          : myPalate;
      }
    }

    if (finishEl) {
      finishEl.hidden = isMyDetailsEditMode;
      finishEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMyFinishEl) {
      editMyFinishEl.hidden = !isMyDetailsEditMode;
      editMyFinishEl.style.display = isMyDetailsEditMode ? "block" : "none";
      if (isMyDetailsEditMode) {
        editMyFinishEl.value = finishEl && finishEl.textContent && finishEl.textContent !== "–"
          ? finishEl.textContent
          : myFinish;
      }
    }

    if (summaryEl) {
      summaryEl.hidden = isMyDetailsEditMode;
      summaryEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMySummaryEl) {
      editMySummaryEl.hidden = !isMyDetailsEditMode;
      editMySummaryEl.style.display = isMyDetailsEditMode ? "block" : "none";
      if (isMyDetailsEditMode) {
        editMySummaryEl.value = summaryEl && summaryEl.textContent && summaryEl.textContent !== "–"
          ? summaryEl.textContent
          : mySummary;
      }
    }

    if (trinkgelegenheitEl) {
      trinkgelegenheitEl.hidden = isMyDetailsEditMode;
      trinkgelegenheitEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMyTrinkgelegenheitEl) {
      editMyTrinkgelegenheitEl.hidden = !isMyDetailsEditMode;
      editMyTrinkgelegenheitEl.style.display = isMyDetailsEditMode ? "block" : "none";
      if (isMyDetailsEditMode) {
        editMyTrinkgelegenheitEl.value = trinkgelegenheitEl && trinkgelegenheitEl.textContent && trinkgelegenheitEl.textContent !== "–"
          ? trinkgelegenheitEl.textContent
          : myTrinkgelegenheit;
      }
    }

    if (btnEditMyDetails) {
      btnEditMyDetails.textContent = isMyDetailsEditMode
        ? "Speichern & Bearbeitung beenden"
        : "Meine Eindrücke bearbeiten";
      btnEditMyDetails.setAttribute("aria-pressed", isMyDetailsEditMode ? "true" : "false");
    }

    if (btnCancelMyDetailsEdit) {
      btnCancelMyDetailsEdit.hidden = !isMyDetailsEditMode;
    }
  }

  if (btnEditMyDetails) {
    btnEditMyDetails.addEventListener("click", async () => {
      if (!requireUpdatePermission()) {
        return;
      }

      if (!isMyDetailsEditMode) {
        originalMyNotes = notesEl && notesEl.textContent && notesEl.textContent !== "–"
          ? notesEl.textContent
          : myNotes;
        originalMyColor = colorEl && colorEl.textContent && colorEl.textContent !== "–"
          ? colorEl.textContent
          : savedMyColor;
        originalMyNose = noseEl && noseEl.textContent && noseEl.textContent !== "–"
          ? noseEl.textContent
          : savedMyNose;
        originalMyPalate = palateEl && palateEl.textContent && palateEl.textContent !== "–"
          ? palateEl.textContent
          : savedMyPalate;
        originalMyFinish = finishEl && finishEl.textContent && finishEl.textContent !== "–"
          ? finishEl.textContent
          : savedMyFinish;
        originalMySummary = summaryEl && summaryEl.textContent && summaryEl.textContent !== "–"
          ? summaryEl.textContent
          : savedMySummary;
        originalMyTrinkgelegenheit = trinkgelegenheitEl && trinkgelegenheitEl.textContent && trinkgelegenheitEl.textContent !== "–"
          ? trinkgelegenheitEl.textContent
          : savedMyTrinkgelegenheit;
        originalMyWishlist = !!savedMyWishlist;
        originalMyStock = Math.max(0, Number(savedMyStock) || 0);
        originalMyRating = savedMyRating;
        currentEditMyRating = savedMyRating;

        if (myDetailsEditHintEl) {
          myDetailsEditHintEl.textContent = defaultMyDetailsHintText;
        }

        isMyDetailsEditMode = true;
        applyMyDetailsEditMode();
        return;
      }

      if (!notesEl || !editMyNotesEl) return;

      const nextNotes = (editMyNotesEl.value || "").trim();
      const nextColor = (editMyColorEl?.value || "").trim();
      const nextNose = (editMyNoseEl?.value || "").trim();
      const nextPalate = (editMyPalateEl?.value || "").trim();
      const nextFinish = (editMyFinishEl?.value || "").trim();
      const nextSummary = (editMySummaryEl?.value || "").trim();
      const nextTrinkgelegenheit = (editMyTrinkgelegenheitEl?.value || "").trim();
      const nextWishlist = !!editMyWishlistEl?.checked;
      let nextStock;
      try { nextStock = window.GdbCigarFields.stock(editMyStockEl?.value || 0); }
      catch (err) { myDetailsEditHintEl.hidden = false; myDetailsEditHintEl.textContent = err.message; return; }
      const nextRating = (currentEditMyRating == null || Number.isNaN(currentEditMyRating)) ? null : Number(currentEditMyRating);

      if (btnEditMyDetails) btnEditMyDetails.disabled = true;
      if (btnCancelMyDetailsEdit) btnCancelMyDetailsEdit.disabled = true;
      if (myDetailsEditHintEl) {
        myDetailsEditHintEl.hidden = false;
        myDetailsEditHintEl.textContent = "Speichere…";
      }

      try {
        const savedRows = await saveMyDetailsToDb(nextNotes, nextColor, nextNose, nextPalate, nextFinish, nextSummary, nextTrinkgelegenheit, nextWishlist, nextStock, nextRating);
        const savedRow = Array.isArray(savedRows) ? savedRows[0] : null;
        if (!savedRow) throw new Error("Keine gespeicherten persönlichen Daten zurückgegeben.");
        savedExtraTasting = Object.fromEntries(window.GdbCigarFields.TASTING.map(([key]) => [key, savedRow[key] || null]));
        if (myCreatedEl) myCreatedEl.textContent = fmtDE(savedRow.created_at || "");
        if (myUpdatedEl) myUpdatedEl.textContent = fmtDE(savedRow.updated_at || "");
        try {
          const labels = [["Bewertung",nextRating],["Bestand (Zigarren)",nextStock],["Notizen",nextNotes],["Aussehen / Verarbeitung",nextColor],["Kaltgeruch / Kaltzug",nextNose],["Aromen / Geschmack",nextPalate],["Nachgeschmack",nextFinish],["Gesamteindruck",nextSummary],["Rauchgelegenheit / Begleitung",nextTrinkgelegenheit],["Wunschliste",nextWishlist ? "Ja" : "Nein"],...window.GdbCigarFields.TASTING.map(([key,,label]) => [label,savedExtraTasting[key]])];
          await writeLogEntry({action:"update",itemType:"cigar",itemId:id,itemName:savedCigarName,details:"Persönliche Daten: " + labels.map(([label,value]) => label + ": " + (value ?? "–")).join(" | ")});
        } catch (logError) { console.error(logError); }
        const nextPli = (savedRow && savedRow.pli != null && !Number.isNaN(Number(savedRow.pli)))
          ? Number(savedRow.pli)
          : null;

        const prevRating = savedMyRating;
        const prevPli = savedMyPli;

        notesEl.textContent = nextNotes ? nextNotes : "–";
        originalMyNotes = nextNotes;
        if (colorEl) {
          colorEl.textContent = nextColor ? nextColor : "–";
        }
        savedMyColor = nextColor;
        originalMyColor = nextColor;
        if (noseEl) {
          noseEl.textContent = nextNose ? nextNose : "–";
        }
        savedMyNose = nextNose;
        originalMyNose = nextNose;
        if (palateEl) {
          palateEl.textContent = nextPalate ? nextPalate : "–";
        }
        savedMyPalate = nextPalate;
        originalMyPalate = nextPalate;

        if (finishEl) {
          finishEl.textContent = nextFinish ? nextFinish : "–";
        }
        savedMyFinish = nextFinish;
        originalMyFinish = nextFinish;

        if (summaryEl) {
          summaryEl.textContent = nextSummary ? nextSummary : "–";
        }
        savedMySummary = nextSummary;
        originalMySummary = nextSummary;

        if (trinkgelegenheitEl) {
          trinkgelegenheitEl.textContent = nextTrinkgelegenheit ? nextTrinkgelegenheit : "–";
        }
        savedMyTrinkgelegenheit = nextTrinkgelegenheit;
        originalMyTrinkgelegenheit = nextTrinkgelegenheit;
        if (wishlistEl) {
          wishlistEl.textContent = nextWishlist ? "✔" : "–";
        }
        savedMyWishlist = nextWishlist;
        originalMyWishlist = nextWishlist;
        savedMyStock = nextStock;
        originalMyStock = nextStock;
        updateStockVisual(nextStock);
        savedMyRating = nextRating;
        originalMyRating = nextRating;
        currentEditMyRating = nextRating;
        updateMyRatingView(nextRating);
        savedMyPli = nextPli;
        originalMyPli = nextPli;
        updateMyPliView(nextPli);

        const prevRatingHadValue = !(prevRating == null || Number.isNaN(prevRating));
        const nextRatingHadValue = !(nextRating == null || Number.isNaN(nextRating));

        if (!prevRatingHadValue && nextRatingHadValue) {
          currentAvgRating = currentCntRating > 0 && currentAvgRating != null
            ? ((currentAvgRating * currentCntRating) + nextRating) / (currentCntRating + 1)
            : nextRating;
          currentCntRating += 1;
        } else if (prevRatingHadValue && !nextRatingHadValue) {
          if (currentCntRating <= 1) {
            currentAvgRating = null;
            currentCntRating = 0;
          } else {
            currentAvgRating = ((currentAvgRating * currentCntRating) - prevRating) / (currentCntRating - 1);
            currentCntRating -= 1;
          }
        } else if (prevRatingHadValue && nextRatingHadValue && currentCntRating > 0 && currentAvgRating != null) {
          currentAvgRating = ((currentAvgRating * currentCntRating) - prevRating + nextRating) / currentCntRating;
        }

        const prevPliHadValue = !(prevPli == null || Number.isNaN(prevPli));
        const nextPliHadValue = !(nextPli == null || Number.isNaN(nextPli));

        if (!prevPliHadValue && nextPliHadValue) {
          currentAvgPli = currentCntPli > 0 && currentAvgPli != null
            ? ((currentAvgPli * currentCntPli) + nextPli) / (currentCntPli + 1)
            : nextPli;
          currentCntPli += 1;
        } else if (prevPliHadValue && !nextPliHadValue) {
          if (currentCntPli <= 1) {
            currentAvgPli = null;
            currentCntPli = 0;
          } else {
            currentAvgPli = ((currentAvgPli * currentCntPli) - prevPli) / (currentCntPli - 1);
            currentCntPli -= 1;
          }
        } else if (prevPliHadValue && nextPliHadValue && currentCntPli > 0 && currentAvgPli != null) {
          currentAvgPli = ((currentAvgPli * currentCntPli) - prevPli + nextPli) / currentCntPli;
        }

        updateAvgRatingView(currentAvgRating, currentCntRating);
        updateAvgPliView(currentAvgPli, currentCntPli);

        isMyDetailsEditMode = false;

        if (myDetailsEditHintEl) {
          myDetailsEditHintEl.textContent = defaultMyDetailsHintText;
        }

        applyMyDetailsEditMode();
      } catch (err) {
        console.error(err);
        if (myDetailsEditHintEl) {
          myDetailsEditHintEl.hidden = false;
          myDetailsEditHintEl.textContent = `Speichern fehlgeschlagen: ${err?.message || "Unbekannter Fehler"}`;
        }
      } finally {
        if (btnEditMyDetails) btnEditMyDetails.disabled = false;
        if (btnCancelMyDetailsEdit) btnCancelMyDetailsEdit.disabled = false;
      }
    });
  }

  if (btnCancelMyDetailsEdit) {
    btnCancelMyDetailsEdit.addEventListener("click", () => {
      if (notesEl) {
        notesEl.textContent = originalMyNotes && originalMyNotes.trim()
          ? originalMyNotes
          : "–";
      }

      if (editMyNotesEl) {
        editMyNotesEl.value = originalMyNotes || "";
      }

      if (colorEl) {
        colorEl.textContent = originalMyColor && originalMyColor.trim()
          ? originalMyColor
          : "–";
      }

      if (editMyColorEl) {
        editMyColorEl.value = originalMyColor || "";
      }

      if (noseEl) {
        noseEl.textContent = originalMyNose && originalMyNose.trim()
          ? originalMyNose
          : "–";
      }

      if (editMyNoseEl) {
        editMyNoseEl.value = originalMyNose || "";
      }

      if (palateEl) {
        palateEl.textContent = originalMyPalate && originalMyPalate.trim()
          ? originalMyPalate
          : "–";
      }

      if (editMyPalateEl) {
        editMyPalateEl.value = originalMyPalate || "";
      }

      if (finishEl) {
        finishEl.textContent = originalMyFinish && originalMyFinish.trim()
          ? originalMyFinish
          : "–";
      }

      if (editMyFinishEl) {
        editMyFinishEl.value = originalMyFinish || "";
      }

      if (summaryEl) {
        summaryEl.textContent = originalMySummary && originalMySummary.trim()
          ? originalMySummary
          : "–";
      }

      if (editMySummaryEl) {
        editMySummaryEl.value = originalMySummary || "";
      }

      if (trinkgelegenheitEl) {
        trinkgelegenheitEl.textContent = originalMyTrinkgelegenheit && originalMyTrinkgelegenheit.trim()
          ? originalMyTrinkgelegenheit
          : "–";
      }

      if (editMyTrinkgelegenheitEl) {
        editMyTrinkgelegenheitEl.value = originalMyTrinkgelegenheit || "";
      }

      if (wishlistEl) {
        wishlistEl.textContent = originalMyWishlist ? "✔" : "–";
      }

      if (editMyWishlistEl) {
        editMyWishlistEl.checked = !!originalMyWishlist;
      }

      if (editMyStockEl) {
        editMyStockEl.value = String(Math.max(0, Number(originalMyStock) || 0));
      }

      updateStockVisual(originalMyStock);
      currentEditMyRating = originalMyRating;
      updateMyRatingView(originalMyRating);
      updateMyPliView(originalMyPli);

      if (myDetailsEditHintEl) {
        myDetailsEditHintEl.textContent = defaultMyDetailsHintText;
      }
      isMyDetailsEditMode = false;
      applyMyDetailsEditMode();
    });
  }

  if (btnStockMinusOne) {
    btnStockMinusOne.addEventListener("click", () => {
      if (!editMyStockEl) return;
      try { const current = window.GdbCigarFields.stock(editMyStockEl.value || 0); editMyStockEl.value = String(Math.max(0, current - 1)); } catch (err) { myDetailsEditHintEl.hidden = false; myDetailsEditHintEl.textContent = err.message; }
    });
  }

  if (btnStockPlusOne) {
    btnStockPlusOne.addEventListener("click", () => {
      if (!editMyStockEl) return;
      try { const current = window.GdbCigarFields.stock(editMyStockEl.value || 0); editMyStockEl.value = String(window.GdbCigarFields.stock(current + 1)); } catch (err) { myDetailsEditHintEl.hidden = false; myDetailsEditHintEl.textContent = err.message; }
    });
  }

  applyMasterDataEditMode();
  applyMyDetailsEditMode();

  // Supabase REST (wir nutzen hier bewusst kein supabase-js import, weil diese Datei kein module ist)
  const appSupabase = window.parent?.supabaseClient || window.supabaseClient;
  const SUPABASE_URL = appSupabase?.supabaseUrl || '';
  const SUPABASE_ANON_KEY = appSupabase?.supabaseKey || '';
  
  // Fallback-Bild-URL
  function getAppBasePath() {
    const path = window.location.pathname || "";
    const repoSegment = "/Genussbibliothek/";
    if (window.location.hostname.includes("github.io") && path.includes(repoSegment)) {
      return repoSegment;
    }
    return "/";
  }

  const DEFAULT_IMAGE_URL = `${getAppBasePath()}img/fallback_image.jpg`;

  // Fallback-Titel (falls Laden fehlschlägt)
  window.parent?.postMessage({ type: "gdb-cigar-set-title", value: "Zigarren – Detailkarte" }, "*");

  if (!id || !titleEl) return;

  function renderStars(value){
    if (value == null || isNaN(value)) return '<span class="muted">nicht bewertet</span>';
    const starsHalf = Math.round((value / 2) * 2) / 2; // 0..5 in 0.5
    let html = '<span class="stars readonly">';
    for (let i = 1; i <= 5; i++) {
      if (starsHalf >= i) html += `<span class="star full"></span>`;
      else if (starsHalf + 0.5 === i) html += `<span class="star half"></span>`;
      else html += `<span class="star"></span>`;
    }
    html += '</span>';
    return html;
  }

  function renderPliScaleDetail(v, min, max) {
    if (v === null || v === undefined || v === "") return `<span class="muted">–</span>`;

    const val = Number(v);
    let pct = 50;

    if (min !== null && max !== null && max !== min) {
      const t = (val - min) / (max - min);
      const clamped = Math.max(0, Math.min(1, t));
      pct = clamped * 100;
    }

    return `
      <div class="pli-scale" title="PLI Skala: min/max dynamisch">
        <span class="pli-marker" style="left:${pct}%;"></span>
      </div>
    `;
  }

  // Detaildaten frisch lesen: URL-Werte sind nur Navigationskontext, keine gespeicherte Wahrheit.
  async function refreshPersonalData() {
    const userId = resolveCurrentUser()?.id;
    if (!userId || isMyDetailsEditMode) return;
    const token = await getAccessToken();
    const fields = "rating,stock,pli,notes,wishlist,created_at,updated_at,t_color,t_nose,t_palate,t_finish,t_summary,t_trinkgelegenheit," + window.GdbCigarFields.TASTING.map(([key]) => key).join(",");
    const base = SUPABASE_URL + "/rest/v1/gdb_cigar_user?cigar_id=eq." + encodeURIComponent(id);
    const request = async url => {
      const response = await fetch(url,{headers:{apikey:SUPABASE_ANON_KEY,Authorization:"Bearer "+token}});
      if (!response.ok) throw new Error("Persönliche Daten laden fehlgeschlagen: " + await getResponseErrorMessage(response));
      return response.json();
    };
    const [ownRows, allRows] = await Promise.all([
      request(base+"&user_id=eq."+encodeURIComponent(userId)+"&select="+fields),
      request(base+"&select=rating,pli")
    ]);
    if (isMyDetailsEditMode || resolveCurrentUser()?.id !== userId) return;
    const row = ownRows[0] || {};
    const textFields = [
      ["t_color",colorEl,editMyColorEl],["t_nose",noseEl,editMyNoseEl],
      ["t_palate",palateEl,editMyPalateEl],["t_finish",finishEl,editMyFinishEl],
      ["t_summary",summaryEl,editMySummaryEl],["t_trinkgelegenheit",trinkgelegenheitEl,editMyTrinkgelegenheitEl]
    ];
    for (const [key,display,input] of textFields) {
      if (display) display.textContent = row[key] || "–";
      if (input) input.value = row[key] || "";
    }
    savedMyColor = originalMyColor = row.t_color || "";
    savedMyNose = originalMyNose = row.t_nose || "";
    savedMyPalate = originalMyPalate = row.t_palate || "";
    savedMyFinish = originalMyFinish = row.t_finish || "";
    savedMySummary = originalMySummary = row.t_summary || "";
    savedMyTrinkgelegenheit = originalMyTrinkgelegenheit = row.t_trinkgelegenheit || "";
    originalMyNotes = row.notes || "";
    if (notesEl) notesEl.textContent = originalMyNotes || "–";
    if (editMyNotesEl) editMyNotesEl.value = originalMyNotes;
    savedExtraTasting = Object.fromEntries(window.GdbCigarFields.TASTING.map(([key]) => [key,row[key] || null]));
    savedMyWishlist = originalMyWishlist = !!row.wishlist;
    if (wishlistEl) wishlistEl.textContent = savedMyWishlist ? "✔" : "–";
    if (editMyWishlistEl) editMyWishlistEl.checked = savedMyWishlist;
    savedMyStock = originalMyStock = window.GdbCigarFields.stock(row.stock || 0);
    if (editMyStockEl) editMyStockEl.value = String(savedMyStock);
    savedMyRating = originalMyRating = currentEditMyRating = row.rating == null ? null : Number(row.rating);
    savedMyPli = originalMyPli = row.pli == null ? null : Number(row.pli);
    if (myCreatedEl) myCreatedEl.textContent = fmtDE(row.created_at);
    if (myUpdatedEl) myUpdatedEl.textContent = fmtDE(row.updated_at);
    const ratings = allRows.filter(r => r.rating != null).map(r => Number(r.rating));
    const plis = allRows.filter(r => r.pli != null).map(r => Number(r.pli));
    currentCntRating = ratings.length;
    currentAvgRating = ratings.length ? ratings.reduce((a,b) => a+b,0)/ratings.length : null;
    currentCntPli = plis.length;
    currentAvgPli = plis.length ? plis.reduce((a,b) => a+b,0)/plis.length : null;
    pliMin = plis.length ? Math.min(...plis) : null;
    pliMax = plis.length ? Math.max(...plis) : null;
    updateMyRatingView(savedMyRating); updateMyPliView(savedMyPli); updateStockVisual(savedMyStock);
    updateAvgRatingView(currentAvgRating,currentCntRating); updateAvgPliView(currentAvgPli,currentCntPli);
    window.GdbCigarFields.renderTasting(savedExtraTasting,false);
  }

  async function loadCigarName() {
    try {
      const accessToken = await getAccessToken();
      const url =
        `${SUPABASE_URL}/rest/v1/gdb_cigars` +
        `?id=eq.${encodeURIComponent(id)}` +
        `&select=vitola,binder,filler,strength,edition_batch,name,brand,manufacturer,country,region,flag_url,region_flag_url,image_url,thumbnail_url,length_mm,ring_gauge,wrapper,price_eur,series,provisional,collector,created_at,updated_at,created_by,updated_by`;
      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const rows            = await res.json();
      const name            = rows?.[0]?.name;
      const brand      = rows?.[0]?.brand;
      const manufacturer         = rows?.[0]?.manufacturer;

      const row             = rows?.[0];
      if (!row) throw new Error("Zigarren nicht gefunden oder keine Leseberechtigung.");
      savedCigarFields = window.GdbCigarFields.normalize(row);
      originalCigarFields = { ...savedCigarFields };

      const country         = row.country;
      const region          = row.region;

      const countryFlagUrl  = row.flag_url;
      const regionFlagUrl   = row.region_flag_url;

      const imageUrl        = rows?.[0]?.image_url;
      const thumbnailUrl    = rows?.[0]?.thumbnail_url;
      savedImageUrl         = (imageUrl ?? "").toString();
      savedThumbnailUrl     = (thumbnailUrl ?? "").toString();
      originalImageUrl      = savedImageUrl;
      originalThumbnailUrl  = savedThumbnailUrl;

      const cigarCreatedAt = rows?.[0]?.created_at || "";
      const cigarUpdatedAt = rows?.[0]?.updated_at || "";
      const cigarCreatedBy = rows?.[0]?.created_by || "";
      const cigarUpdatedBy = rows?.[0]?.updated_by || "";

      const lengthMm        = rows?.[0]?.length_mm;
      const ring_gauge             = rows?.[0]?.ring_gauge;

      const wrapper         = rows?.[0]?.wrapper;

      const priceEur        = rows?.[0]?.price_eur;
      const series   = rows?.[0]?.series;
      savedCigarName       = (name ?? "").toString();
      savedBrand       = (brand ?? "").toString();
      savedManufacturer          = (manufacturer ?? "").toString();
      savedCountry          = (country ?? "").toString();
      savedRegion           = (region ?? "").toString();
      savedFlagUrl          = (countryFlagUrl ?? "").toString();
      savedRegionFlagUrl    = (regionFlagUrl ?? "").toString();
      savedLengthMm         = (lengthMm == null || Number.isNaN(Number(lengthMm))) ? null : Number(lengthMm);
      savedRingGauge              = (ring_gauge == null || Number.isNaN(Number(ring_gauge))) ? null : Number(ring_gauge);
      savedWrapper         = (wrapper ?? "").toString();
      savedPriceEur         = (priceEur == null || Number.isNaN(Number(priceEur))) ? null : Number(priceEur);
      savedSeries = (series ?? "").toString();
      savedProvisional      = !!row.provisional;
      savedCollector        = !!row.collector;

      originalCigarName    = savedCigarName;
      originalBrand    = savedBrand;
      originalManufacturer       = savedManufacturer;
      originalCountry       = savedCountry;
      originalRegion        = savedRegion;
      originalFlagUrl       = savedFlagUrl;
      originalRegionFlagUrl = savedRegionFlagUrl;
      originalLengthMm      = savedLengthMm;
      originalRingGauge           = savedRingGauge;
      originalWrapper      = savedWrapper;
      originalPriceEur      = savedPriceEur;
      originalSeries = savedSeries;
      originalProvisional   = savedProvisional;
      originalCollector     = savedCollector;

      // Land-Flagge
      if (countryFlagImg) {
        if (countryFlagUrl) {
          countryFlagImg.src = countryFlagUrl;
          countryFlagImg.style.display = "inline";
        } else {
          countryFlagImg.style.display = "none";
        }
      }

      // Region-Flagge
      if (regionFlagImg) {
        if (region && country) {
          regionFlagImg.src = regionFlagUrl;
          regionFlagImg.style.display = "inline";
        } else {
          regionFlagImg.style.display = "none";
        }
      }

      renderMasterDataView();

      if (cEl) cEl.textContent = fmtDE(cigarCreatedAt);
      if (uEl) uEl.textContent = fmtDE(cigarUpdatedAt);

      try {
        const userMap = await fetchUserDisplayMap([cigarCreatedBy, cigarUpdatedBy]);
        if (createdByEl) createdByEl.textContent = cigarCreatedBy ? (userMap[cigarCreatedBy] || "–") : "–";
        if (updatedByEl) updatedByEl.textContent = cigarUpdatedBy ? (userMap[cigarUpdatedBy] || "–") : "–";
      } catch (userErr) {
        console.error(userErr);
        if (createdByEl) createdByEl.textContent = cigarCreatedBy ? cigarCreatedBy : "–";
        if (updatedByEl) updatedByEl.textContent = cigarUpdatedBy ? cigarUpdatedBy : "–";
      }

      if (imgEl && imgWrapEl) {
        const src = savedImageUrl || DEFAULT_IMAGE_URL;

        imgEl.src = src;
        imgEl.alt = name ? `${name}` : "Zigarren";

        // falls selbst das Fallback mal nicht lädt (theoretisch)
        imgEl.onerror = () => {
          imgEl.src = DEFAULT_IMAGE_URL;
        };

        imgWrapEl.style.display = "";
      }

      try {
        await loadDetailChangelog();
      } catch (logLoadErr) {
        console.error(logLoadErr);
        renderDetailChangelog([]);
      }

      updateAvgRatingView(currentAvgRating, currentCntRating);

      updateAvgPliView(currentAvgPli, currentCntPli);
      updateStockVisual(savedMyStock);

      // --- Meine Eindrücke: Bewertung (persönlich) ---
      if (detailMyRatingStarsEl) {
        detailMyRatingStarsEl.innerHTML = renderStars(myRating);
      }

      if (detailMyRatingTextEl) {
        if (myRating == null || Number.isNaN(myRating)) {
          detailMyRatingTextEl.textContent = "-/10";
        } else {
          detailMyRatingTextEl.textContent = `${Math.round(myRating)}/10`;
        }
      }

      // --- Meine Eindrücke: PLI (persönlich) ---
      updateMyPliView(savedMyPli);
      await refreshPersonalData();

    } catch (e) {
      console.error(e);
      if (masterDataEditHintEl) {
        masterDataEditHintEl.hidden = false;
        masterDataEditHintEl.textContent = "Daten laden fehlgeschlagen: " + (e?.message || "Unbekannter Fehler");
      }
      if (btnEditMasterData) btnEditMasterData.disabled = true;
      if (btnEditMyDetails) btnEditMyDetails.disabled = true;
      if (btnDeleteCigar) btnDeleteCigar.disabled = true;
      if (dbg) dbg.textContent += ` | name-load-error`;
    }
  }

  if (editCountryEl) {
    editCountryEl.addEventListener("change", () => {
      filterRegionsByCountry();
      syncFlagFieldsFromSelection();
    });
  }

  if (editRegionEl) {
    editRegionEl.addEventListener("change", () => {
      syncFlagFieldsFromSelection();
    });
  }

  // Live update for collector badge while editing
  if (editIsCollectorEl) {
    editIsCollectorEl.addEventListener("change", () => {
      if (collectorBadgeEl) {
        collectorBadgeEl.style.display = editIsCollectorEl.checked ? "inline-flex" : "none";
      }
    });
  }

  if (editIsIncompleteEl) {
    editIsIncompleteEl.addEventListener("change", () => {
      if (provisionalBadgeEl) {
        provisionalBadgeEl.hidden = !editIsIncompleteEl.checked;
        provisionalBadgeEl.style.display = editIsIncompleteEl.checked ? "inline-block" : "none";
      }
    });
  }

  if (editImageUploadEl) {
    editImageUploadEl.addEventListener("change", () => {
      const file = editImageUploadEl.files?.[0];

      const fileNameEl = document.getElementById("editImageFileName");

      if (!file) {
        if (fileNameEl) fileNameEl.textContent = "Keine Datei ausgewählt";
        return;
      }

      pendingImageFile = file;
      deleteImageOnSave = false;

      const reader = new FileReader();
      reader.onload = (e) => {
        if (imgEl && e.target?.result) {
          imgEl.src = e.target.result;
        }
      };
      reader.readAsDataURL(file);

      if (fileNameEl) {
        fileNameEl.textContent = file.name;
      }

      if (imageEditHintEl) {
        imageEditHintEl.hidden = false;
        imageEditHintEl.textContent = "Neues Bild ausgewählt (wird beim Speichern hochgeladen)";
      }
    });
  }

  if (btnDeleteImageEl) {
    btnDeleteImageEl.addEventListener("click", () => {
      pendingImageFile = null;
      deleteImageOnSave = true;
      savedImageUrl = "";

      if (imgEl) {
        imgEl.src = DEFAULT_IMAGE_URL;
      }

      if (editImageUploadEl) {
        editImageUploadEl.value = "";
      }

      const fileNameEl = document.getElementById("editImageFileName");
      if (fileNameEl) {
        fileNameEl.textContent = "Keine Datei ausgewählt";
      }

      if (imageEditHintEl) {
        imageEditHintEl.hidden = false;
        imageEditHintEl.textContent = "Bild wird beim Speichern gelöscht";
      }
    });
  }

  Promise.all([
    loadCigarName(),
  ]);
  
})();

function formatEuro(value) {
  if (value == null || value === "") return "–";
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
