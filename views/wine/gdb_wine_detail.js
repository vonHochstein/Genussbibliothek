// gdb_wine_detail.js

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

  const pliMin                  = (pliMinParam === null || pliMinParam === "") ? null : Number(pliMinParam);
  const pliMax                  = (pliMaxParam === null || pliMaxParam === "") ? null : Number(pliMaxParam);

  const myStockParam            = params.get("mystock");
  const myStockUnits            = Number(myStockParam || 0);

  const myRatingParam           = params.get("myrating");
  const myPliParam              = params.get("mypli");

  const myRating                = (myRatingParam === null || myRatingParam === "") ? null : Number(myRatingParam);
  const myPli                   = (myPliParam === null || myPliParam === "") ? null : Number(myPliParam);

  const notesParam              = params.get("notes");
  const myNotes                 = (notesParam ?? "");

  const colorParam              = params.get("t_color");
  const myColor                 = (colorParam ?? "");

  const acidityParam               = params.get("t_acidity");
  const myAcidity                  = (acidityParam ?? "");

  const noseParam               = params.get("t_nose");
  const myNose                  = (noseParam ?? "");

  const palateParam             = params.get("t_palate");
  const myPalate                = (palateParam ?? "");

  const sweetnessParam         = params.get("t_sweetness");
  const mySweetness            = (sweetnessParam ?? "");

  const bodyParam          = params.get("t_body");
  const myBody             = (bodyParam ?? "");

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

  // if (dbg) dbg.textContent = `wine id=${id}`;

  // Ziel-Element in der HTML
  const titleEl                 = document.getElementById("wineName");
  const wineryEl            = document.getElementById("wineWinery");
  const dotEl                   = document.getElementById("wineDot");
  const grapeVarietyEl               = document.getElementById("wineGrapeVariety");
  const countryFlagImg          = document.getElementById("countryFlagImg");
  const countryTextEl           = document.getElementById("countryText");
  const regionFlagImg           = document.getElementById("regionFlagImg");
  const regionTextEl            = document.getElementById("regionText");
  const originLine              = document.getElementById("wineOriginLine");
  const imgWrapEl               = document.getElementById("wineImageWrap");
  const imgEl                   = document.getElementById("wineImage");
  const volumeEl                = document.getElementById("wineVolume");
  const abvEl                   = document.getElementById("wineAbv");
  const statsLineEl             = document.getElementById("wineStatsLine");
  const sepVolAbvEl             = document.getElementById("sepVolAbv");
  const typeLineEl              = document.getElementById("wineTypeLine");
  const typeEl                  = document.getElementById("wineWineType");
  const colorLineEl           = document.getElementById("wineColorLine");
  const wineColorEl = document.getElementById("wineWineColor");
  const priceEl                 = document.getElementById("winePrice");
  const editionBatchLineEl           = document.getElementById("wineAppellationLine");
  const editionBatchEl               = document.getElementById("wineAppellation");
  const editAppellationEl     = document.getElementById("editAppellation");
  const collectorBadgeEl        = document.getElementById("wineCollectorBadge");
  const provisionalBadgeEl      = document.getElementById("wineProvisionalBadge");
  const masterDataEditFieldsEl  = document.getElementById("masterDataEditFields");
  const editPriceEurEl          = document.getElementById("editPriceEur");
  const editVolumeMlEl          = document.getElementById("editVolumeMl");
  const editAbvEl               = document.getElementById("editAbv");
  const editWeinNameEl        = document.getElementById("editWeinName");
  const editWineryEl        = document.getElementById("editWinery");
  const editGrapeVarietyEl           = document.getElementById("editGrapeVariety");
  const editCountryEl            = document.getElementById("editCountry");
  const editRegionEl             = document.getElementById("editRegion");
  const editFlagUrlEl            = document.getElementById("editFlagUrl");
  const editRegionFlagUrlEl      = document.getElementById("editRegionFlagUrl");
  const editCountryFlagPreviewEl = document.getElementById("editCountryFlagPreview");
  const editRegionFlagPreviewEl  = document.getElementById("editRegionFlagPreview");
  const editIsIncompleteEl      = document.getElementById("editIsIncomplete");
  const editIsCollectorEl       = document.getElementById("editIsCollector");
  const editWineTypeEl          = document.getElementById("editWineType");
  const editWineColorEl       = document.getElementById("editWineColor");
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
  const btnDeleteWein         = document.getElementById("btnDeleteWein");
  const btnCancelMasterDataEdit = document.getElementById("btnCancelMasterDataEdit");
  const deleteWeinModalEl     = document.getElementById("deleteWeinModal");
  const deleteWeinModalTextEl = document.getElementById("deleteWeinModalText");
  const btnCancelDeleteWein   = document.getElementById("btnCancelDeleteWein");
  const btnConfirmDeleteWein  = document.getElementById("btnConfirmDeleteWein");
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
  const acidityEl                  = document.getElementById("detailMyAcidity");
  if (acidityEl) acidityEl.textContent = myAcidity.trim() ? myAcidity : "–";
  const editMyAcidityEl            = document.getElementById("editMyAcidity");
  if (editMyAcidityEl) editMyAcidityEl.value = myAcidity;
  const noseEl                 = document.getElementById("detailMyNose");
  if (noseEl) noseEl.textContent = myNose.trim() ? myNose : "–";
  const editMyNoseEl           = document.getElementById("editMyNose");
  if (editMyNoseEl) editMyNoseEl.value = myNose;
  const palateEl                 = document.getElementById("detailMyPalate");
  if (palateEl) palateEl.textContent = myPalate.trim() ? myPalate : "–";
  const editMyPalateEl           = document.getElementById("editMyPalate");
  if (editMyPalateEl) editMyPalateEl.value = myPalate;
  const sweetnessEl            = document.getElementById("detailMySweetness");
  if (sweetnessEl) sweetnessEl.textContent = mySweetness.trim() ? mySweetness : "–";
  const editMySweetnessEl      = document.getElementById("editMySweetness");
  if (editMySweetnessEl) editMySweetnessEl.value = mySweetness;
  const bodyEl             = document.getElementById("detailMyBody");
  if (bodyEl) bodyEl.textContent = myBody.trim() ? myBody : "–";
  const editMyBodyEl       = document.getElementById("editMyBody");
  if (editMyBodyEl) editMyBodyEl.value = myBody;
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
  const btnStockMinus2cl        = document.getElementById("btnStockMinus2cl");
  const btnStockMinus4cl        = document.getElementById("btnStockMinus4cl");
  if (editMyStockEl) editMyStockEl.value = Number.isFinite(myStockUnits) ? String(myStockUnits) : "0";

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
  const editVintageEl = document.getElementById('editVintage');
  const editNoVintageEl = document.getElementById('editNoVintage');
  const editSweetnessEl = document.getElementById('editSweetness');
  const editResidualSugarEl = document.getElementById('editResidualSugar');
  const editTotalAcidityEl = document.getElementById('editTotalAcidity');
  const residualSugarLineEl = document.getElementById('wineResidualSugarLine');
  const residualSugarEl = document.getElementById('wineResidualSugar');
  const totalAcidityLineEl = document.getElementById('wineTotalAcidityLine');
  const totalAcidityEl = document.getElementById('wineTotalAcidity');
  window.GdbWineFields.bindVintage(editVintageEl, editNoVintageEl);
  const vintageLineEl = document.getElementById('wineVintageLine');
  const vintageEl = document.getElementById('wineVintage');
  const masterSweetnessLineEl = document.getElementById('wineSweetnessLine');
  const masterSweetnessEl = document.getElementById('wineSweetness');
  let savedWineFields = { vintage: null, no_vintage: false, sweetness: null, residual_sugar_g_l: null, total_acidity_g_l: null };
  let originalWineFields = { ...savedWineFields };
  let savedWeinName = "";
  let savedWinery = "";
  let savedGrapeVariety = "";
  let savedCountry = "";
  let savedRegion = "";
  let savedFlagUrl = "";
  let savedRegionFlagUrl = "";
  let savedVolumeMl = null;
  let savedAbv = null;
  let savedWineType = "";
  let savedWineColor = "";
  let savedPriceEur = null;
  let savedPricePerLiter = null;
  let savedProvisional = false;
  let savedCollector = false;
  let savedAppellation = null;

  let savedImageUrl = "";
  let originalImageUrl = "";
  let savedThumbnailUrl = "";
  let originalThumbnailUrl = "";
  let pendingImageFile = null;
  let deleteImageOnSave = false;

  let originalWeinName = "";
  let originalWinery = "";
  let originalGrapeVariety = "";
  let originalCountry = "";
  let originalRegion = "";
  let originalFlagUrl = "";
  let originalRegionFlagUrl = "";
  let originalVolumeMl = null;
  let originalAbv = null;
  let originalWineType = "";
  let originalWineColor = "";
  let originalPriceEur = null;
  let originalProvisional = false;
  let originalCollector = false;
  let originalAppellation = null;
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
    "Deutschland": ["Baden-Württemberg", "Bayern", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hessen", "Mecklenburg-Vorpommern", "Niedersachsen", "Nordrhein-Westfalen", "Rheinland-Pfalz", "Saarland", "Sachsen", "Sachsen-Anhalt", "Schleswig-Holstein", "Thüringen"],
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

  function getCountryFlagUrl(countryValue) {
    const key = (countryValue ?? "").toString().trim();
    return key && COUNTRY_FLAG_MAP[key] ? `${FLAG_BASE_URL}${COUNTRY_FLAG_MAP[key]}` : "";
  }

  function getRegionFlagUrl(regionValue) {
    const key = (regionValue ?? "").toString().trim();
    return key && REGION_FLAG_MAP[key] ? `${FLAG_BASE_URL}${REGION_FLAG_MAP[key]}` : "";
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
    if (editRegionEl) editRegionEl.disabled = false;
  }

  const defaultMasterDataHintText = masterDataEditHintEl
    ? (masterDataEditHintEl.textContent || "Bearbeitungsmodus aktiv")
    : "Bearbeitungsmodus aktiv";

  function renderMasterDataView() {
    if (titleEl) {
      titleEl.textContent = savedWeinName || "";
    }

    if (wineryEl) {
      wineryEl.textContent = savedWinery || "";
    }

    if (grapeVarietyEl) {
      grapeVarietyEl.textContent = savedGrapeVariety || "";
    }

    const hasWinery = !!savedWinery;
    const hasGrapeVariety = !!savedGrapeVariety;

    if (dotEl) {
      dotEl.style.display = (hasWinery && hasGrapeVariety) ? "inline" : "none";
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

    const hasVol = !!(savedVolumeMl && Number(savedVolumeMl) > 0);
    const hasAbv = !!(savedAbv && Number(savedAbv) > 0);

    if (volumeEl) {
      volumeEl.textContent = hasVol ? `${savedVolumeMl} ml` : "";
      volumeEl.style.display = hasVol ? "inline" : "none";
    }

    if (abvEl) {
      abvEl.textContent = hasAbv ? `${savedAbv} % vol` : "";
      abvEl.style.display = hasAbv ? "inline" : "none";
    }

    if (sepVolAbvEl) {
      sepVolAbvEl.style.display = (hasVol && hasAbv) ? "inline" : "none";
    }

    if (statsLineEl) {
      statsLineEl.style.display = (hasVol || hasAbv) ? "" : "none";
    }

    const typeText = (savedWineType ?? "").toString().trim();
    if (typeLineEl && typeEl) {
      typeEl.textContent = typeText || "-";
      typeLineEl.style.display = typeText ? "" : "none";
    }

    const colorText = (savedWineColor ?? "").toString().trim();
    if (colorLineEl && wineColorEl) {
      wineColorEl.textContent = colorText || "-";
      colorLineEl.style.display = colorText ? "" : "none";
    }

    if (priceEl) {
      const priceText = formatEuro(savedPriceEur);
      const literText = formatEuro(savedPricePerLiter);
      priceEl.textContent = `${priceText} € (${literText} €/L)`;
    }

    if (editionBatchLineEl && editionBatchEl) {
      if ((savedAppellation ?? "").toString().trim()) {
        editionBatchEl.textContent = savedAppellation;
        editionBatchLineEl.style.display = "";
      } else {
        editionBatchLineEl.style.display = "none";
      }
    }

    if (vintageEl) vintageEl.textContent = window.GdbWineFields.formatVintage(savedWineFields.vintage, savedWineFields.no_vintage);
    if (masterSweetnessEl) masterSweetnessEl.textContent = savedWineFields.sweetness || "–";
    if (residualSugarEl) residualSugarEl.textContent = window.GdbWineFields.formatAnalysisValue(savedWineFields.residual_sugar_g_l);
    if (totalAcidityEl) totalAcidityEl.textContent = window.GdbWineFields.formatAnalysisValue(savedWineFields.total_acidity_g_l);
    updateStockVisual(savedMyStock);

    if (savedWeinName) {
      document.title = `Wein – ${savedWeinName}`;
      window.parent?.postMessage({ type: "gdb-wine-set-title", value: `Wein – ${savedWeinName}` }, "*");
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
    return window.parent?.GdbPermissions?.requirePermission?.('wine', 'update') ?? true;
  }

  function requireDeletePermission() {
    return window.parent?.GdbPermissions?.requirePermission?.('wine', 'delete') ?? true;
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
      throw new Error("Wein-ID fehlt");
    }

    const accessToken = await getAccessToken();

    const payload = {
      ...nextMasterData,
      updated_by: currentUser?.id || null
    };

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/gdb_wines?id=eq.${encodeURIComponent(id)}`,
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

    return await res.json();
  }

  async function deleteWeinFromDb() {
    const parentSupabase = window.parent?.supabaseClient || window.supabaseClient || null;

    if (!id) {
      throw new Error("Wein-ID fehlt");
    }

    const accessToken = await getAccessToken();

    const imagePath = getStoragePathFromPublicUrl(savedImageUrl || originalImageUrl || "");
    const thumbnailPath = getStoragePathFromPublicUrl(savedThumbnailUrl || originalThumbnailUrl || "");
    const storagePaths = [imagePath, thumbnailPath].filter(Boolean);

    if (storagePaths.length && parentSupabase?.storage?.from) {
      const { error: storageError } = await parentSupabase.storage
        .from("wines")
        .remove(storagePaths);

      if (storageError) {
        throw storageError;
      }
    }

    const deleteUserRes = await fetch(
      `${SUPABASE_URL}/rest/v1/gdb_wine_user?wine_id=eq.${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!deleteUserRes.ok) {
      throw new Error(`Wein-Nutzerdaten löschen fehlgeschlagen (HTTP ${deleteUserRes.status})`);
    }

    const deleteWeinRes = await fetch(
      `${SUPABASE_URL}/rest/v1/gdb_wines?id=eq.${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!deleteWeinRes.ok) {
      throw new Error(`Wein löschen fehlgeschlagen (HTTP ${deleteWeinRes.status})`);
    }
  }

  function openDeleteWeinModal(wineLabel) {
  if (!deleteWeinModalEl) return;
  if (deleteWeinModalTextEl) {
    deleteWeinModalTextEl.innerHTML = `
      Soll „${wineLabel}“ wirklich endgültig gelöscht werden?<br><br>
      Dabei werden die Stammdaten, alle zugehörigen Nutzerdaten, der Eintrag in der Gesamtübersicht und ein vorhandenes Bild dauerhaft entfernt.
    `;
  }
  deleteWeinModalEl.classList.remove("hidden");
  deleteWeinModalEl.setAttribute("aria-hidden", "false");
}

function closeDeleteWeinModal() {
  if (!deleteWeinModalEl) return;
  deleteWeinModalEl.classList.add("hidden");
  deleteWeinModalEl.setAttribute("aria-hidden", "true");
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
    if (type === "abv") return `${Number(value)} % vol`;
    if (type === "volume") return `${Number(value)} ml`;
    if (type === "analysis") return window.GdbWineFields.formatAnalysisValue(value);
    return String(value);
  }

  function buildMasterDataLogDetails(originalData, nextData, extraChanges = []) {
    const changes = [];

    const fields = [
      ["Name", originalData.name, nextData.name, "text"],
      ["Weingut / Erzeuger", originalData.winery, nextData.winery, "text"],
      ["Rebsorte(n) / Cuvée", originalData.grape_variety, nextData.grape_variety, "text"],
      ["Jahrgang", originalData.vintage, nextData.vintage, "text"],
      ["Ohne Jahrgang", originalData.no_vintage, nextData.no_vintage, "boolean"],
      ["Geschmacksrichtung / Süße", originalData.sweetness, nextData.sweetness, "text"],
      ["Restzucker", originalData.residual_sugar_g_l, nextData.residual_sugar_g_l, "analysis"],
      ["Gesamtsäure", originalData.total_acidity_g_l, nextData.total_acidity_g_l, "analysis"],
      ["Land", originalData.country, nextData.country, "text"],
      ["Region", originalData.region, nextData.region, "text"],
      ["Volumen", originalData.volume_ml, nextData.volume_ml, "volume"],
      ["Alkohol", originalData.abv, nextData.abv, "abv"],
      ["Weinart", originalData.wine_type, nextData.wine_type, "text"],
      ["Weinfarbe", originalData.wine_color, nextData.wine_color, "text"],
      ["Preis", originalData.price_eur, nextData.price_eur, "price"],
      ["Herkunftsbezeichnung / Appellation", originalData.appellation, nextData.appellation, "text"],
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
      `?item_type=eq.wine` +
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
      const marker = "/storage/v1/object/public/wines/";
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
      throw new Error("Wein-ID fehlt");
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
        const { error: cleanupError } = await parentSupabase.storage.from("wines").remove(oldPaths);
        if (cleanupError) throw cleanupError;
      }

      pendingImageFile = null;
      deleteImageOnSave = false;
      return savedImageUrl;
    }

    if (!pendingImageFile) {
      return savedImageUrl;
    }

    if (!window.GdbWeinImages?.createThumbnail) {
      throw new Error("Thumbnail-Erzeugung ist nicht verfügbar");
    }

    const ext = (pendingImageFile.name.split(".").pop() || "jpg").toLowerCase();
    const safeExt = ext.replace(/[^a-z0-9]/g, "") || "jpg";
    const timestamp = Date.now();
    const filePath = `wine_${id}_${timestamp}.${safeExt}`;
    const thumbnailBlob = await window.GdbWeinImages.createThumbnail(pendingImageFile);
    const thumbnailIsWebp = thumbnailBlob.type === "image/webp";
    const thumbnailExtension = thumbnailIsWebp ? "webp" : "jpg";
    const thumbnailContentType = thumbnailIsWebp ? "image/webp" : "image/jpeg";
    const thumbnailPath = `thumbnails/wine_${id}_${timestamp}.${thumbnailExtension}`;
    const uploadedPaths = [];
    let imageUrlsUpdated = false;

    try {
      const { error: uploadError } = await parentSupabase.storage
        .from("wines")
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
        .from("wines")
        .upload(thumbnailPath, thumbnailBlob, {
          cacheControl: "31536000",
          upsert: false,
          contentType: thumbnailContentType
        });
      if (thumbnailUploadError) {
        throw new Error(`Thumbnail-Upload fehlgeschlagen: ${thumbnailUploadError.message || "Unbekannter Storage-Fehler"}`);
      }
      uploadedPaths.push(thumbnailPath);

      const publicUrl = parentSupabase.storage.from("wines").getPublicUrl(filePath).data?.publicUrl || "";
      const thumbnailUrl = parentSupabase.storage.from("wines").getPublicUrl(thumbnailPath).data?.publicUrl || "";
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
          const { error: cleanupError } = await parentSupabase.storage.from("wines").remove(pathsToRemove);
          if (cleanupError) throw cleanupError;
        }
      }

      pendingImageFile = null;
      deleteImageOnSave = false;
      return savedImageUrl;
    } catch (error) {
      if (uploadedPaths.length && !imageUrlsUpdated) {
        const { error: cleanupError } = await parentSupabase.storage.from("wines").remove(uploadedPaths);
        if (cleanupError) console.error("Neue Bilddateien konnten nicht vollständig bereinigt werden:", cleanupError);
      }
      throw error;
    }
  }
  function applyMasterDataEditMode() {
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

    if (wineryEl) {
      wineryEl.hidden = isMasterDataEditMode;
      wineryEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (dotEl) {
      dotEl.hidden = isMasterDataEditMode;

      if (isMasterDataEditMode) {
        dotEl.style.display = "none";
      } else {
        const hasWinery = !!((savedWinery ?? "").toString().trim());
        const hasGrapeVariety = !!((savedGrapeVariety ?? "").toString().trim());
        dotEl.style.display = (hasWinery && hasGrapeVariety) ? "inline" : "none";
      }
    }

    if (grapeVarietyEl) {
      grapeVarietyEl.hidden = isMasterDataEditMode;
      grapeVarietyEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (originLine) {
      originLine.hidden = isMasterDataEditMode;
      originLine.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (statsLineEl) {
      statsLineEl.hidden = isMasterDataEditMode;
      statsLineEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (typeLineEl) {
      typeLineEl.hidden = isMasterDataEditMode;
      typeLineEl.style.display = isMasterDataEditMode ? "none" : (savedWineType ? "" : "none");
    }

    if (colorLineEl) {
      colorLineEl.hidden = isMasterDataEditMode;
      colorLineEl.style.display = isMasterDataEditMode ? "none" : (savedWineColor ? "" : "none");
    }

    if (priceEl) {
      priceEl.hidden = isMasterDataEditMode;
      priceEl.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (editionBatchLineEl) {
      editionBatchLineEl.hidden = isMasterDataEditMode;
      editionBatchLineEl.style.display = isMasterDataEditMode ? "none" : ((savedAppellation ?? "").toString().trim() ? "" : "none");
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

    const avgRatingContainer = detailAvgRatingTextEl?.closest(".metrics-block") || document.getElementById("detailRatingBlock");
    if (avgRatingContainer) {
      avgRatingContainer.hidden = isMasterDataEditMode;
      avgRatingContainer.style.display = isMasterDataEditMode ? "none" : "";
    }

    const avgPliContainer = detailAvgPliTextEl?.closest(".metrics-block") || document.getElementById("detailPliBlock");
    if (avgPliContainer) {
      avgPliContainer.hidden = isMasterDataEditMode;
      avgPliContainer.style.display = isMasterDataEditMode ? "none" : "";
    }

    if (vintageLineEl) vintageLineEl.style.display = isMasterDataEditMode ? 'none' : '';
    if (masterSweetnessLineEl) masterSweetnessLineEl.style.display = isMasterDataEditMode ? 'none' : '';
    if (residualSugarLineEl) residualSugarLineEl.style.display = isMasterDataEditMode ? 'none' : '';
    if (totalAcidityLineEl) totalAcidityLineEl.style.display = isMasterDataEditMode ? 'none' : '';
    if (masterDataEditFieldsEl) {
      masterDataEditFieldsEl.hidden = !isMasterDataEditMode;
      masterDataEditFieldsEl.style.display = isMasterDataEditMode ? "block" : "none";
    }
    if (imageEditFieldsEl) {
      imageEditFieldsEl.hidden = !isMasterDataEditMode;
      imageEditFieldsEl.style.display = isMasterDataEditMode ? "block" : "none";
    }

    if (isMasterDataEditMode) {
      if (editWeinNameEl) editWeinNameEl.value = originalWeinName || "";
      if (editWineryEl) editWineryEl.value = originalWinery || "";
      if (editGrapeVarietyEl) editGrapeVarietyEl.value = originalGrapeVariety || "";
      if (editCountryEl) editCountryEl.value = originalCountry || "";
      if (editRegionEl) editRegionEl.value = originalRegion || "";
      filterRegionsByCountry();
      if (editFlagUrlEl) editFlagUrlEl.value = originalFlagUrl || "";
      if (editRegionFlagUrlEl) editRegionFlagUrlEl.value = originalRegionFlagUrl || "";
      syncFlagFieldsFromSelection();
      if (editVolumeMlEl) editVolumeMlEl.value = originalVolumeMl == null ? "" : String(originalVolumeMl);
      if (editAbvEl) editAbvEl.value = originalAbv == null ? "" : String(originalAbv);
      if (editWineTypeEl) editWineTypeEl.value = originalWineType || "";
      if (editWineColorEl) editWineColorEl.value = originalWineColor || "";
      if (editPriceEurEl) editPriceEurEl.value = originalPriceEur == null ? "" : String(originalPriceEur);
      if (editAppellationEl) editAppellationEl.value = originalAppellation == null ? "" : String(originalAppellation);
      window.GdbWineFields.setMaster(editVintageEl, editNoVintageEl, editSweetnessEl, originalWineFields, editResidualSugarEl, editTotalAcidityEl);
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

    if (btnDeleteWein) {
      btnDeleteWein.hidden = isMasterDataEditMode;
      btnDeleteWein.style.display = isMasterDataEditMode ? "none" : "";
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

      originalWeinName = savedWeinName;
        originalWinery = savedWinery;
        originalGrapeVariety = savedGrapeVariety;
        originalWineFields = { ...savedWineFields };
        originalCountry = savedCountry;
        originalRegion = savedRegion;
        originalFlagUrl = savedFlagUrl;
        originalRegionFlagUrl = savedRegionFlagUrl;
        originalVolumeMl = savedVolumeMl;
        originalAbv = savedAbv;
        originalWineType = savedWineType;
        originalWineColor = savedWineColor;
        originalPriceEur = savedPriceEur;
        originalProvisional = savedProvisional;
        originalCollector = savedCollector;
        originalAppellation = savedAppellation;
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

      const nextWeinName = (editWeinNameEl?.value || "").trim();
      const nextWinery = (editWineryEl?.value || "").trim();
      const nextGrapeVariety = (editGrapeVarietyEl?.value || "").trim();
      const nextCountry = (editCountryEl?.value || "").trim();
      const nextRegion = (editRegionEl?.value || "").trim();
      const nextFlagUrl = getCountryFlagUrl(nextCountry);
      const nextRegionFlagUrl = getRegionFlagUrl(nextRegion);
      const nextVolumeMl = (editVolumeMlEl?.value === "" || editVolumeMlEl?.value == null)
        ? null
        : Math.max(1, Number(editVolumeMlEl.value));
      const nextAbv = (editAbvEl?.value === "" || editAbvEl?.value == null)
        ? null
        : Math.max(0, Number(editAbvEl.value));
      const nextWineType = (editWineTypeEl?.value || "").trim();
      const nextWineColor = (editWineColorEl?.value || "").trim();
      const nextPriceEur = (editPriceEurEl?.value === "" || editPriceEurEl?.value == null)
        ? null
        : Math.max(0, Number(editPriceEurEl.value));
      const nextAppellation = (editAppellationEl?.value || "").trim() || null;
      const nextProvisional = !!editIsIncompleteEl?.checked;
      const nextCollector = !!editIsCollectorEl?.checked;
      const hadPendingImageFile = !!pendingImageFile;
      const hadDeleteImageOnSave = !!deleteImageOnSave;

      if (!nextWeinName) {
        if (masterDataEditHintEl) {
          masterDataEditHintEl.hidden = false;
          masterDataEditHintEl.textContent = "Bitte zuerst einen Weinnamen eingeben";
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
        const nextWineFields = window.GdbWineFields.readMaster(editVintageEl, editNoVintageEl, editSweetnessEl, editResidualSugarEl, editTotalAcidityEl);
        const savedRows = await saveMasterDataToDb({
          ...nextWineFields,
          name: nextWeinName || null,
          winery: nextWinery || null,
          grape_variety: nextGrapeVariety || null,
          country: nextCountry || null,
          region: nextRegion || null,
          flag_url: nextFlagUrl || null,
          region_flag_url: nextRegionFlagUrl || null,
          volume_ml: nextVolumeMl,
          abv: nextAbv,
          wine_type: nextWineType || null,
          wine_color: nextWineColor || null,
          price_eur: nextPriceEur,
          appellation: nextAppellation,
          provisional: nextProvisional,
          collector: nextCollector
        });

        const savedRow = Array.isArray(savedRows) ? savedRows[0] : null;
        savedWineFields = {
          vintage: savedRow?.vintage ?? nextWineFields.vintage,
          no_vintage: savedRow?.no_vintage ?? nextWineFields.no_vintage,
          sweetness: savedRow?.sweetness ?? nextWineFields.sweetness,
          residual_sugar_g_l: savedRow?.residual_sugar_g_l ?? nextWineFields.residual_sugar_g_l,
          total_acidity_g_l: savedRow?.total_acidity_g_l ?? nextWineFields.total_acidity_g_l
        };

        savedWeinName = (savedRow?.name ?? nextWeinName ?? "").toString();
        savedWinery = (savedRow?.winery ?? nextWinery ?? "").toString();
        savedGrapeVariety = (savedRow?.grape_variety ?? nextGrapeVariety ?? "").toString();
        savedCountry = (savedRow?.country ?? nextCountry ?? "").toString();
        savedRegion = (savedRow?.region ?? nextRegion ?? "").toString();
        savedFlagUrl = (savedRow?.flag_url ?? nextFlagUrl ?? "").toString();
        savedRegionFlagUrl = (savedRow?.region_flag_url ?? nextRegionFlagUrl ?? "").toString();
        savedVolumeMl = (savedRow?.volume_ml == null || Number.isNaN(Number(savedRow?.volume_ml))) ? null : Number(savedRow.volume_ml);
        savedAbv = (savedRow?.abv == null || Number.isNaN(Number(savedRow?.abv))) ? null : Number(savedRow.abv);
        savedWineType = (savedRow?.wine_type ?? nextWineType ?? "").toString();
        savedWineColor = (savedRow?.wine_color ?? nextWineColor ?? "").toString();
        savedPriceEur = (savedRow?.price_eur == null || Number.isNaN(Number(savedRow?.price_eur))) ? null : Number(savedRow.price_eur);
        savedPricePerLiter = (savedRow?.price_per_liter_eur == null || Number.isNaN(Number(savedRow?.price_per_liter_eur))) ? null : Number(savedRow.price_per_liter_eur);
        savedAppellation = (savedRow?.appellation ?? nextAppellation ?? "").toString();
        savedProvisional = !!(savedRow?.provisional ?? nextProvisional);
        savedCollector = !!(savedRow?.collector ?? nextCollector);

        const logOriginalData = {
          ...originalWineFields,
          name: originalWeinName || null,
          winery: originalWinery || null,
          grape_variety: originalGrapeVariety || null,
          country: originalCountry || null,
          region: originalRegion || null,
          volume_ml: originalVolumeMl,
          abv: originalAbv,
          wine_type: originalWineType || null,
          wine_color: originalWineColor || null,
          price_eur: originalPriceEur,
          appellation: originalAppellation,
          provisional: !!originalProvisional,
          collector: !!originalCollector
        };

        await saveImageToStorage();

        const logNextData = {
          ...savedWineFields,
          name: savedWeinName || null,
          winery: savedWinery || null,
          grape_variety: savedGrapeVariety || null,
          country: savedCountry || null,
          region: savedRegion || null,
          volume_ml: savedVolumeMl,
          abv: savedAbv,
          wine_type: savedWineType || null,
          wine_color: savedWineColor || null,
          price_eur: savedPriceEur,
          appellation: savedAppellation,
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
              itemType: "wine",
              itemId: id,
              itemName: savedWeinName || nextWeinName || null,
              details: logDetails
            });
            await loadDetailChangelog();
          } catch (logErr) {
            console.error(logErr);
          }
        }

        originalWeinName = savedWeinName;
        originalWinery = savedWinery;
        originalGrapeVariety = savedGrapeVariety;
        originalWineFields = { ...savedWineFields };
        originalCountry = savedCountry;
        originalRegion = savedRegion;
        originalFlagUrl = savedFlagUrl;
        originalRegionFlagUrl = savedRegionFlagUrl;
        originalVolumeMl = savedVolumeMl;
        originalAbv = savedAbv;
        originalWineType = savedWineType;
        originalWineColor = savedWineColor;
        originalPriceEur = savedPriceEur;
        originalProvisional = savedProvisional;
        originalCollector = savedCollector;
        originalAppellation = savedAppellation;
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
      if (editWeinNameEl) editWeinNameEl.value = originalWeinName || "";
      if (editWineryEl) editWineryEl.value = originalWinery || "";
      if (editGrapeVarietyEl) editGrapeVarietyEl.value = originalGrapeVariety || "";
      if (editCountryEl) editCountryEl.value = originalCountry || "";
      if (editRegionEl) editRegionEl.value = originalRegion || "";
      filterRegionsByCountry();
      if (editFlagUrlEl) editFlagUrlEl.value = originalFlagUrl || "";
      if (editRegionFlagUrlEl) editRegionFlagUrlEl.value = originalRegionFlagUrl || "";
      syncFlagFieldsFromSelection();
      if (editVolumeMlEl) editVolumeMlEl.value = originalVolumeMl == null ? "" : String(originalVolumeMl);
      if (editAbvEl) editAbvEl.value = originalAbv == null ? "" : String(originalAbv);
      if (editWineTypeEl) editWineTypeEl.value = originalWineType || "";
      if (editWineColorEl) editWineColorEl.value = originalWineColor || "";
      if (editPriceEurEl) editPriceEurEl.value = originalPriceEur == null ? "" : String(originalPriceEur);
      if (editAppellationEl) editAppellationEl.value = originalAppellation == null ? "" : String(originalAppellation);
      window.GdbWineFields.setMaster(editVintageEl, editNoVintageEl, editSweetnessEl, originalWineFields, editResidualSugarEl, editTotalAcidityEl);
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

if (btnDeleteWein) {
  btnDeleteWein.addEventListener("click", () => {
    if (!requireDeletePermission()) {
      return;
    }

    const wineLabel = (savedWeinName || originalWeinName || "dieses Wein").trim();
    openDeleteWeinModal(wineLabel);
  });
}

if (btnCancelDeleteWein) {
  btnCancelDeleteWein.addEventListener("click", () => {
    closeDeleteWeinModal();
  });
}

if (btnConfirmDeleteWein) {
  btnConfirmDeleteWein.addEventListener("click", async () => {
    if (!requireDeletePermission()) {
      return;
    }

    const wineLabel = (savedWeinName || originalWeinName || "dieses Wein").trim();
    const originalDeleteText = btnDeleteWein?.textContent || "Wein löschen";
    const originalHintText = masterDataEditHintEl?.textContent || defaultMasterDataHintText;

    closeDeleteWeinModal();

    if (btnDeleteWein) btnDeleteWein.disabled = true;
    if (btnEditMasterData) btnEditMasterData.disabled = true;
    if (masterDataEditHintEl) {
      masterDataEditHintEl.hidden = false;
      masterDataEditHintEl.textContent = "Lösche Wein…";
    }

    try {
      await deleteWeinFromDb();

      try {
        await writeLogEntry({
          action: "delete",
          itemType: "wine",
          itemId: id,
          itemName: wineLabel,
          details: "Wein gelöscht"
        });
      } catch (logErr) {
        console.error(logErr);
      }

      window.parent?.postMessage({ type: "gdb-wine-nav", view: "wineList" }, "*");
    } catch (err) {
      console.error(err);
      if (masterDataEditHintEl) {
        masterDataEditHintEl.hidden = false;
        masterDataEditHintEl.textContent = "Löschen fehlgeschlagen";
      }
    } finally {
      if (btnDeleteWein) {
        btnDeleteWein.disabled = false;
        btnDeleteWein.textContent = originalDeleteText;
      }
      if (btnEditMasterData) btnEditMasterData.disabled = false;
      if (masterDataEditHintEl && !isMasterDataEditMode) {
        masterDataEditHintEl.hidden = true;
        masterDataEditHintEl.textContent = originalHintText;
      }
    }
  });
}

if (deleteWeinModalEl) {
  deleteWeinModalEl.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLElement && target.hasAttribute("data-close-delete-modal")) {
      closeDeleteWeinModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (deleteWeinModalEl && !deleteWeinModalEl.classList.contains("hidden")) {
    closeDeleteWeinModal();
  }
});

  let savedMyNotes = myNotes;
  let originalMyNotes = savedMyNotes;
  let savedMyRating = (myRating == null || Number.isNaN(myRating)) ? null : Number(myRating);
  let originalMyRating = savedMyRating;
  let currentEditMyRating = savedMyRating;
  let savedMyPli = (myPli == null || Number.isNaN(myPli)) ? null : Number(myPli);
  let originalMyPli = savedMyPli;
  let savedMyColor = myColor;
  let originalMyColor = myColor;
  let savedMyAcidity = myAcidity;
  let originalMyAcidity = myAcidity;
  let savedMyNose = myNose;
  let originalMyNose = myNose;
  let savedMyPalate = myPalate;
  let originalMyPalate = myPalate;
  let savedMySweetness = mySweetness;
  let originalMySweetness = mySweetness;
  let savedMyBody = myBody;
  let originalMyBody = myBody;
  let savedMyFinish = myFinish;
  let originalMyFinish = myFinish;
  let savedMySummary = mySummary;
  let originalMySummary = mySummary;
  let savedMyTrinkgelegenheit = myTrinkgelegenheit;
  let originalMyTrinkgelegenheit = myTrinkgelegenheit;
  let savedMyWishlist = !!myWishlist;
  let originalMyWishlist = !!myWishlist;
  let savedMyStock = Number.isFinite(myStockUnits) ? Math.max(0, myStockUnits) : 0;
  let originalMyStock = savedMyStock;

  const defaultMyDetailsHintText = myDetailsEditHintEl
    ? (myDetailsEditHintEl.textContent || "Bearbeitungsmodus aktiv")
    : "Bearbeitungsmodus aktiv";

  async function saveMyDetailsToDb(nextNotes, nextColor, nextAcidity, nextNose, nextPalate, nextSweetness, nextBody, nextFinish, nextSummary, nextTrinkgelegenheit, nextWishlist, nextStock, nextRating) {
    const parentSupabase = window.parent?.supabaseClient || window.supabaseClient || null;
    const parentCurrentUser = window.parent?.currentUser || window.currentUser || null;

    if (!id) {
      throw new Error("Wein-ID fehlt");
    }

    if (!parentCurrentUser?.id) {
      throw new Error("Kein eingeloggter Nutzer gefunden");
    }

    const accessToken = await getAccessToken();

    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/gdb_wine_user?on_conflict=wine_id,user_id`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=representation"
        },
        body: JSON.stringify({
          wine_id: id,
          user_id: parentCurrentUser.id,
          notes: nextNotes,
          t_color: nextColor,
          t_acidity: nextAcidity,
          t_nose: nextNose,
          t_palate: nextPalate,
          t_sweetness: nextSweetness,
          t_body: nextBody,
          t_finish: nextFinish,
          t_summary: nextSummary,
          t_trinkgelegenheit: nextTrinkgelegenheit,
          wishlist: nextWishlist,
          stock_bottles: nextStock,
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

    if (bottleWrapEl) {
      bottleWrapEl.hidden = true;
      bottleWrapEl.style.display = "none";
      bottleWrapEl.innerHTML = "";
    }

    if (stockTextEl) {
      stockTextEl.textContent = window.GdbWineFields.stockLabel(stock);
    }
  }

  function applyMyDetailsEditMode() {
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
      detailBottleWrapEl.style.display = "none";
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
          : savedMyNotes;
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
          : savedMyColor;
      }
    }

    if (acidityEl) {
      acidityEl.hidden = isMyDetailsEditMode;
      acidityEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMyAcidityEl) {
      editMyAcidityEl.hidden = !isMyDetailsEditMode;
      editMyAcidityEl.style.display = isMyDetailsEditMode ? "block" : "none";
      if (isMyDetailsEditMode) {
        editMyAcidityEl.value = acidityEl && acidityEl.textContent && acidityEl.textContent !== "–"
          ? acidityEl.textContent
          : savedMyAcidity;
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
          : savedMyNose;
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
          : savedMyPalate;
      }
    }

    if (sweetnessEl) {
      sweetnessEl.hidden = isMyDetailsEditMode;
      sweetnessEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMySweetnessEl) {
      editMySweetnessEl.hidden = !isMyDetailsEditMode;
      editMySweetnessEl.style.display = isMyDetailsEditMode ? "block" : "none";
      if (isMyDetailsEditMode) {
        editMySweetnessEl.value = sweetnessEl && sweetnessEl.textContent && sweetnessEl.textContent !== "–"
          ? sweetnessEl.textContent
          : savedMySweetness;
      }
    }

    if (bodyEl) {
      bodyEl.hidden = isMyDetailsEditMode;
      bodyEl.style.display = isMyDetailsEditMode ? "none" : "";
    }

    if (editMyBodyEl) {
      editMyBodyEl.hidden = !isMyDetailsEditMode;
      editMyBodyEl.style.display = isMyDetailsEditMode ? "block" : "none";
      if (isMyDetailsEditMode) {
        editMyBodyEl.value = bodyEl && bodyEl.textContent && bodyEl.textContent !== "–"
          ? bodyEl.textContent
          : savedMyBody;
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
          : savedMyFinish;
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
          : savedMySummary;
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
          : savedMyTrinkgelegenheit;
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
          : savedMyNotes;
        originalMyColor = colorEl && colorEl.textContent && colorEl.textContent !== "–"
          ? colorEl.textContent
          : savedMyColor;
        originalMyAcidity = acidityEl && acidityEl.textContent && acidityEl.textContent !== "–"
          ? acidityEl.textContent
          : savedMyAcidity;
        originalMyNose = noseEl && noseEl.textContent && noseEl.textContent !== "–"
          ? noseEl.textContent
          : savedMyNose;
        originalMyPalate = palateEl && palateEl.textContent && palateEl.textContent !== "–"
          ? palateEl.textContent
          : savedMyPalate;
        originalMySweetness = sweetnessEl && sweetnessEl.textContent && sweetnessEl.textContent !== "–"
          ? sweetnessEl.textContent
          : savedMySweetness;
        originalMyBody = bodyEl && bodyEl.textContent && bodyEl.textContent !== "–"
          ? bodyEl.textContent
          : savedMyBody;
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
      const nextAcidity = (editMyAcidityEl?.value || "").trim();
      const nextNose = (editMyNoseEl?.value || "").trim();
      const nextPalate = (editMyPalateEl?.value || "").trim();
      const nextSweetness = (editMySweetnessEl?.value || "").trim();
      const nextBody = (editMyBodyEl?.value || "").trim();
      const nextFinish = (editMyFinishEl?.value || "").trim();
      const nextSummary = (editMySummaryEl?.value || "").trim();
      const nextTrinkgelegenheit = (editMyTrinkgelegenheitEl?.value || "").trim();
      const nextWishlist = !!editMyWishlistEl?.checked;
      let nextStock;
      try { nextStock = window.GdbWineFields.parseStock(editMyStockEl?.validity?.badInput ? NaN : editMyStockEl?.value); }
      catch (error) {
        if (myDetailsEditHintEl) { myDetailsEditHintEl.hidden = false; myDetailsEditHintEl.textContent = error.message; }
        return;
      }
      const nextRating = (currentEditMyRating == null || Number.isNaN(currentEditMyRating)) ? null : Number(currentEditMyRating);

      if (btnEditMyDetails) btnEditMyDetails.disabled = true;
      if (btnCancelMyDetailsEdit) btnCancelMyDetailsEdit.disabled = true;
      if (myDetailsEditHintEl) {
        myDetailsEditHintEl.hidden = false;
        myDetailsEditHintEl.textContent = "Speichere…";
      }

      try {
        const savedRows = await saveMyDetailsToDb(nextNotes, nextColor, nextAcidity, nextNose, nextPalate, nextSweetness, nextBody, nextFinish, nextSummary, nextTrinkgelegenheit, nextWishlist, nextStock, nextRating);
        const savedRow = Array.isArray(savedRows) ? savedRows[0] : null;
        const nextPli = (savedRow && savedRow.pli != null && !Number.isNaN(Number(savedRow.pli)))
          ? Number(savedRow.pli)
          : null;

        const prevRating = savedMyRating;
        const prevPli = savedMyPli;

        notesEl.textContent = nextNotes ? nextNotes : "–";
        savedMyNotes = nextNotes;
        originalMyNotes = nextNotes;
        if (colorEl) {
          colorEl.textContent = nextColor ? nextColor : "–";
        }
        savedMyColor = nextColor;
        originalMyColor = nextColor;
        if (acidityEl) {
          acidityEl.textContent = nextAcidity ? nextAcidity : "–";
        }
        savedMyAcidity = nextAcidity;
        originalMyAcidity = nextAcidity;
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

        if (sweetnessEl) {
          sweetnessEl.textContent = nextSweetness ? nextSweetness : "–";
        }
        savedMySweetness = nextSweetness;
        originalMySweetness = nextSweetness;

        if (bodyEl) {
          bodyEl.textContent = nextBody ? nextBody : "–";
        }
        savedMyBody = nextBody;
        originalMyBody = nextBody;

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
          myDetailsEditHintEl.textContent = "Speichern fehlgeschlagen";
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

      if (acidityEl) {
        acidityEl.textContent = originalMyAcidity && originalMyAcidity.trim() ? originalMyAcidity : "–";
      }

      if (editMyAcidityEl) {
        editMyAcidityEl.value = originalMyAcidity || "";
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

      if (sweetnessEl) {
        sweetnessEl.textContent = originalMySweetness && originalMySweetness.trim() ? originalMySweetness : "–";
      }

      if (editMySweetnessEl) {
        editMySweetnessEl.value = originalMySweetness || "";
      }

      if (bodyEl) {
        bodyEl.textContent = originalMyBody && originalMyBody.trim() ? originalMyBody : "–";
      }

      if (editMyBodyEl) {
        editMyBodyEl.value = originalMyBody || "";
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

  if (btnStockMinus2cl) {
    btnStockMinus2cl.addEventListener("click", () => {
      if (!editMyStockEl) return;
      const current = Math.max(0, Number(editMyStockEl.value || 0));
      editMyStockEl.value = String(Math.max(0, current - 0.25));
    });
  }

  if (btnStockMinus4cl) {
    btnStockMinus4cl.addEventListener("click", () => {
      if (!editMyStockEl) return;
      const current = Math.max(0, Number(editMyStockEl.value || 0));
      editMyStockEl.value = String(current + 0.25);
    });
  }

  applyMasterDataEditMode();
  applyMyDetailsEditMode();

  // Supabase REST (wir nutzen hier bewusst kein supabase-js import, weil diese Datei kein module ist)
  const SUPABASE_URL = window.parent?.supabaseClient?.supabaseUrl || '';
  const SUPABASE_ANON_KEY = window.parent?.supabaseClient?.supabaseKey || '';
  
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
  window.parent?.postMessage({ type: "gdb-wine-set-title", value: "Wein – Detailkarte" }, "*");

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

  function renderBottleSvg(fillPct){
    // clamp 0..1
    const p = Math.max(0, Math.min(1, Number(fillPct) || 0));

    // Wir füllen von unten nach oben: yStart hängt von p ab
    // ViewBox-Höhe = 200. Flüssigkeitsbereich: y=40..190 (150px Höhe)
    const FILL_TOP_Y = 75;     // 100% beginnt erst hier (tiefer = realistischer)
    const FILL_BOTTOM_Y = 196; // Boden innen (bei uns ist der Boden auf y=196)
    const liquidTop = FILL_TOP_Y + (1 - p) * (FILL_BOTTOM_Y - FILL_TOP_Y);

    return `
    <svg class="bottle-svg" viewBox="0 0 100 200" width="100%" height="100%" aria-label="Flaschenfüllstand">

      <defs>
        <linearGradient id="goldLiquid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="rgba(212,175,55,0.55)"/>
          <stop offset="60%" stop-color="rgba(212,175,55,0.35)"/>
          <stop offset="100%" stop-color="rgba(212,175,55,0.20)"/>
        </linearGradient>

        <!-- Innenform der Flasche als Clip -->
        <clipPath id="bottleClip">
          <path d="
                M 40 8
                Q 40 4 44 4
                H 56
                Q 60 4 60 8
                V 28
                Q 60 34 54 34
                H 46
                Q 40 34 40 28
                C 40 48 38 53 36 58
                C 34 64 34 72 36 80
                C 37 86 34 92 29 97
                C 22 104 18 116 18 132
                V 170
                C 18 186 28 196 42 196
                H 58
                C 72 196 82 186 82 170
                V 132
                C 82 116 78 104 71 97
                C 66 92 63 86 64 80
                C 66 72 66 64 64 58
                C 62 53 60 48 60 42
                V 28
                Z    
                  "/>
        </clipPath>
      </defs>

      <!-- Flüssigkeit -->
      <g clip-path="url(#bottleClip)">
        <rect x="0" y="${liquidTop}" width="100" height="${FILL_BOTTOM_Y - liquidTop}" fill="url(#goldLiquid)"></rect>

        <!-- leichter Glanz -->
        <rect x="22" y="45" width="12" height="140" fill="rgba(255,255,255,0.10)"></rect>
      </g>

      <!-- Flaschen-Outline -->
      <path d="
                M 40 8
                Q 40 4 44 4
                H 56
                Q 60 4 60 8
                V 28
                Q 60 34 54 34
                H 46
                Q 40 34 40 28
                Z
              "
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"/>

      <path d="
                M 40 42
                C 40 48 38 53 36 58
                C 34 64 34 72 36 80
                C 37 86 34 92 29 97
                C 22 104 18 116 18 132
                V 170
                C 18 186 28 196 42 196
                H 58
                C 72 196 82 186 82 170
                V 132
                C 82 116 78 104 71 97
                C 66 92 63 86 64 80
                C 66 72 66 64 64 58
                C 62 53 60 48 60 42
                Z
              "
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"/>

    </svg>`;
  }

  async function loadWeinName() {
    try {
      const accessToken = await getAccessToken();
      const url =
        `${SUPABASE_URL}/rest/v1/gdb_wines` +
        `?id=eq.${encodeURIComponent(id)}` +
        `&select=name,winery,grape_variety,vintage,no_vintage,sweetness,residual_sugar_g_l,total_acidity_g_l,country,region,flag_url,region_flag_url,image_url,thumbnail_url,volume_ml,abv,wine_type,wine_color,price_eur,price_per_liter_eur,appellation,provisional,collector,created_at,updated_at,created_by,updated_by`;
      const res = await fetch(url, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const rows            = await res.json();
      const name            = rows?.[0]?.name;
      const winery      = rows?.[0]?.winery;
      const style         = rows?.[0]?.grape_variety;

      const row             = rows?.[0] || {};
      savedWineFields = { vintage: row.vintage ?? null, no_vintage: !!row.no_vintage, sweetness: row.sweetness ?? null, residual_sugar_g_l: row.residual_sugar_g_l ?? null, total_acidity_g_l: row.total_acidity_g_l ?? null };
      originalWineFields = { ...savedWineFields };

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

      const wineCreatedAt = rows?.[0]?.created_at || "";
      const wineUpdatedAt = rows?.[0]?.updated_at || "";
      const wineCreatedBy = rows?.[0]?.created_by || "";
      const wineUpdatedBy = rows?.[0]?.updated_by || "";

      const volumeMl        = rows?.[0]?.volume_ml;
      const abv             = rows?.[0]?.abv;

      const wine_type         = rows?.[0]?.wine_type;
      const colorType      = rows?.[0]?.wine_color;

      const priceEur        = rows?.[0]?.price_eur;
      const pricePerLiter   = rows?.[0]?.price_per_liter_eur;
      const editionBatch   = rows?.[0]?.appellation;
      savedWeinName       = (name ?? "").toString();
      savedWinery       = (winery ?? "").toString();
      savedGrapeVariety          = (style ?? "").toString();
      savedCountry          = (country ?? "").toString();
      savedRegion           = (region ?? "").toString();
      savedFlagUrl          = (countryFlagUrl ?? "").toString();
      savedRegionFlagUrl    = (regionFlagUrl ?? "").toString();
      savedVolumeMl         = (volumeMl == null || Number.isNaN(Number(volumeMl))) ? null : Number(volumeMl);
      savedAbv              = (abv == null || Number.isNaN(Number(abv))) ? null : Number(abv);
      savedWineType         = (wine_type ?? "").toString();
      savedWineColor      = (colorType ?? "").toString();
      savedPriceEur         = (priceEur == null || Number.isNaN(Number(priceEur))) ? null : Number(priceEur);
      savedPricePerLiter    = (pricePerLiter == null || Number.isNaN(Number(pricePerLiter))) ? null : Number(pricePerLiter);
      savedAppellation    = (editionBatch ?? "").toString();
      savedProvisional      = !!row.provisional;
      savedCollector        = !!row.collector;

      originalWeinName    = savedWeinName;
      originalWinery    = savedWinery;
      originalGrapeVariety       = savedGrapeVariety;
      originalCountry       = savedCountry;
      originalRegion        = savedRegion;
      originalFlagUrl       = savedFlagUrl;
      originalRegionFlagUrl = savedRegionFlagUrl;
      originalVolumeMl      = savedVolumeMl;
      originalAbv           = savedAbv;
      originalWineType      = savedWineType;
      originalWineColor   = savedWineColor;
      originalPriceEur      = savedPriceEur;
      originalAppellation = savedAppellation;
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

      if (cEl) cEl.textContent = fmtDE(wineCreatedAt);
      if (uEl) uEl.textContent = fmtDE(wineUpdatedAt);

      try {
        const userMap = await fetchUserDisplayMap([wineCreatedBy, wineUpdatedBy]);
        if (createdByEl) createdByEl.textContent = wineCreatedBy ? (userMap[wineCreatedBy] || "–") : "–";
        if (updatedByEl) updatedByEl.textContent = wineUpdatedBy ? (userMap[wineUpdatedBy] || "–") : "–";
      } catch (userErr) {
        console.error(userErr);
        if (createdByEl) createdByEl.textContent = wineCreatedBy ? wineCreatedBy : "–";
        if (updatedByEl) updatedByEl.textContent = wineUpdatedBy ? wineUpdatedBy : "–";
      }

      if (imgEl && imgWrapEl) {
        const src = savedImageUrl || DEFAULT_IMAGE_URL;

        imgEl.src = src;
        imgEl.alt = name ? `${name}` : "Wein";

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

    } catch (e) {
      console.error("Wein-Stammdaten konnten nicht geladen werden:", e);
      if (btnEditMasterData) btnEditMasterData.disabled = true;
      if (btnDeleteWein) btnDeleteWein.disabled = true;
      if (masterDataEditHintEl) {
        masterDataEditHintEl.hidden = false;
        masterDataEditHintEl.textContent = "Stammdaten konnten nicht geladen werden. Bitte erneut öffnen.";
      }
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
    loadWeinName(),
  ]);
  
})();

function formatEuro(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "-";
  return n.toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
