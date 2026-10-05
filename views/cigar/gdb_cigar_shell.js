(function () {
  "use strict";

  const tileCigar = document.getElementById("tileCigar");
  const tileStatCigar = document.getElementById("tileStatCigar");
  const dashboard = document.getElementById("dashboard");
  const app = document.getElementById("app");
  const cigarListView = document.getElementById("cigarListView");
  const cigarFrame = document.getElementById("cigarFrame");
  const cigarViewTitle = document.getElementById("cigarViewTitle");
  const cigarLoginOk = document.getElementById("cigarLoginOk");
  const cigarMsg = document.getElementById("cigarMsg");
  const cigarToolbar = document.querySelector(".cigar-toolbar");
  const cigarCount = document.getElementById("cigarCount");
  const cigarSearch = document.getElementById("cigarSearch");
  const cigarSort = document.getElementById("cigarSort");
  const cigarSortDir = document.getElementById("cigarSortDir");
  const cigarFilterMenu = document.getElementById("cigarFilterMenu");
  const cigarFilterSummary = document.getElementById("cigarFilterSummary");
  const cigarFilterOwnStock = document.getElementById("cigarFilterOwnStock");
  const cigarFilterCollector = document.getElementById("cigarFilterCollector");
  const cigarFilterIncomplete = document.getElementById("cigarFilterIncomplete");
  const cigarFilterWishlist = document.getElementById("cigarFilterWishlist");
  const cigarFilterWithoutImage = document.getElementById("cigarFilterWithoutImage");
  const cigarCompareStock = document.getElementById("cigarCompareStock");
  const btnCigarList = document.getElementById("btnCigarList");
  const btnNewCigar = document.getElementById("btnNewCigar");
  const backToDashFromCigarBtn = document.getElementById("backToDashFromCigarBtn");

  const cigarPliModal = document.getElementById("cigarPliModal");
  const cigarRatingsModal = document.getElementById("cigarRatingsModal");
  const cigarRatingsTitle = document.getElementById("cigarRatingsModalTitle");
  const cigarRatingsBody = document.getElementById("cigarRatingsModalContent");
  const cigarStocksModal = document.getElementById("cigarStocksModal");
  const cigarStocksTitle = document.getElementById("cigarStocksTitle");
  const cigarStocksBody = document.getElementById("cigarStocksBody");
  const cigarCompareStockModal = document.getElementById("cigarCompareStockModal");
  const cigarCompareStockUserList = document.getElementById("cigarCompareStockUserList");

  let cigarView = "list";
  let selectedCompareUserId = null;
  let compareUsers = [];

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setCigarMessage(text = "", kind = "hint") {
    if (!cigarMsg) return;
    cigarMsg.textContent = text;
    cigarMsg.className = text ? kind : "";
    cigarMsg.style.display = text ? "block" : "none";
  }

  function setTitle(text) {
    if (cigarViewTitle) cigarViewTitle.textContent = text || "Zigarren";
  }

  function setToolbarVisible(visible) {
    if (cigarToolbar) cigarToolbar.style.display = visible ? "" : "none";
  }

  function ensureCigarToolbarPlacement() {
    if (!cigarToolbar || !cigarListView) return;

    const titleCard = cigarListView.querySelector(".card");

    if (titleCard) {
      const alreadyPlaced =
        cigarToolbar.parentElement === cigarListView &&
        cigarToolbar.previousElementSibling === titleCard;

      if (alreadyPlaced) return;

      titleCard.insertAdjacentElement("afterend", cigarToolbar);
      return;
    }

    cigarListView.appendChild(cigarToolbar);
  }

  function postToCigarFrame(message) {
    cigarFrame?.contentWindow?.postMessage(message, "*");
  }

  function updateFilterSummary() {
    const activeCount = [
      cigarFilterOwnStock,
      cigarFilterCollector,
      cigarFilterIncomplete,
      cigarFilterWishlist,
      cigarFilterWithoutImage
    ].filter((input) => !!input?.checked).length;
    if (cigarFilterSummary) cigarFilterSummary.textContent = activeCount ? `Filter (${activeCount})` : "Filter";
    if (cigarFilterMenu) cigarFilterMenu.dataset.active = activeCount ? "true" : "false";
  }

  function syncToolbar() {
    postToCigarFrame({ type: "gdb-cigar-set-search", value: cigarSearch?.value || "" });
    postToCigarFrame({
      type: "gdb-cigar-set-sort",
      value: {
        mode: cigarSort?.value || "updated",
        dir: cigarSortDir?.dataset.dir || "desc"
      }
    });
    postToCigarFrame({
      type: "gdb-cigar-set-filters",
      value: {
        ownStock: !!cigarFilterOwnStock?.checked,
        collector: !!cigarFilterCollector?.checked,
        incomplete: !!cigarFilterIncomplete?.checked,
        wishlist: !!cigarFilterWishlist?.checked,
        withoutImage: !!cigarFilterWithoutImage?.checked
      }
    });
    postToCigarFrame({
      type: "gdb-cigar-set-compare-stock",
      value: {
        enabled: !!(cigarCompareStock?.checked && selectedCompareUserId),
        userId: selectedCompareUserId || null
      }
    });
  }

  function resetToolbar() {
    if (cigarSearch) cigarSearch.value = "";
    if (cigarSort) cigarSort.value = "updated";
    if (cigarSortDir) {
      cigarSortDir.dataset.dir = "desc";
      cigarSortDir.textContent = "↓";
      cigarSortDir.setAttribute("aria-label", "Sortierreihenfolge absteigend");
    }
    if (cigarFilterOwnStock) cigarFilterOwnStock.checked = false;
    if (cigarFilterCollector) cigarFilterCollector.checked = false;
    if (cigarFilterIncomplete) cigarFilterIncomplete.checked = false;
    if (cigarFilterWishlist) cigarFilterWishlist.checked = false;
    if (cigarFilterWithoutImage) cigarFilterWithoutImage.checked = false;
    if (cigarFilterMenu) cigarFilterMenu.open = false;
    updateFilterSummary();
    if (cigarCompareStock) cigarCompareStock.checked = false;
    if (cigarCount) cigarCount.textContent = "0 Zigarren";
    selectedCompareUserId = null;
  }

  function getCurrentUser() {
    return window.currentUser || null;
  }

  async function refreshPermissions() {
    const user = getCurrentUser();
    if (!user?.id || !window.GdbPermissions?.loadCurrentUserPermissions) return;
    await window.GdbPermissions.loadCurrentUserPermissions(user.id);
  }

  function showLoginName() {
    if (!cigarLoginOk) return;
    const user = getCurrentUser();
    const name = (user?.display_name || user?.username || "").trim();
    cigarLoginOk.textContent = name ? `Angemeldet als: ${name}` : "Angemeldet";
  }

  let tileStatsKey = null;
  let tileStatsRequestId = 0;

  async function loadTileStats() {
    const userId = getCurrentUser()?.id;
    if (!tileStatCigar || !window.supabaseClient || !userId) return;
    const canRead = !!window.GdbPermissions?.hasPermission?.("cigar", "read");
    const key = `${userId}:${canRead}`;
    if (tileStatsKey === key) return;
    tileStatsKey = key;
    const requestId = ++tileStatsRequestId;
    const isCurrent = () => requestId === tileStatsRequestId && getCurrentUser()?.id === userId;
    try {
      if (!canRead) {
        tileStatCigar.textContent = "kein Zugriff";
        return;
      }
      const { count, error: countError } = await window.supabaseClient
        .from("gdb_cigars")
        .select("id", { count: "exact", head: true });
      if (countError) throw countError;
      if (!isCurrent()) return;
      const { data, error } = await window.supabaseClient.from("gdb_cigars").select("country");
      if (error) throw error;
      if (!isCurrent()) return;
      const countries = new Set((data || []).map((row) => (row.country || "").trim()).filter(Boolean));
      const cigarCountValue = Number(count) || 0;
      const cigarText = cigarCountValue === 1 ? "1 Zigarre" : `${cigarCountValue} Zigarren`;
      const countryText = countries.size === 1 ? "einem Land" : `${countries.size} Ländern`;
      tileStatCigar.textContent = `${cigarText} aus ${countryText}`;
    } catch (error) {
      if (!isCurrent()) return;
      tileStatsKey = null;
      console.error("Zigarren-Stats konnten nicht geladen werden:", error);
      tileStatCigar.textContent = "Stats nicht verfügbar";
    }
  }

  function loadCigarListFrame() {
    if (!cigarFrame) return;
    ensureCigarToolbarPlacement();
    const uid = encodeURIComponent(getCurrentUser()?.id || "");
    cigarFrame.onload = syncToolbar;
    cigarFrame.src = `views/cigar/gdb_cigar.html?uid=${uid}&t=${Date.now()}`;
    cigarView = "list";
    setTitle("Zigarren");
    setToolbarVisible(true);
  }

  async function openCigarList() {
    if (!getCurrentUser()) return false;

    try {
      await refreshPermissions();
    } catch (error) {
      console.error(error);
      return false;
    }
    if (!window.GdbPermissions?.requirePermission?.("cigar", "read")) return false;

    document.body.classList.add("cigar-view-active");
    if (dashboard) dashboard.style.display = "none";
    if (app) app.style.display = "none";
    cigarListView?.classList.remove("hidden");
    showLoginName();
    resetToolbar();
    setCigarMessage("");
    loadCigarListFrame();
    await loadCompareUsers();
    return true;
  }

  function closeCigarToDashboard() {
    document.body.classList.remove("cigar-view-active");
    cigarListView?.classList.add("hidden");
    if (cigarFrame) {
      cigarFrame.onload = null;
      cigarFrame.setAttribute("src", "");
    }
    if (dashboard) dashboard.style.display = "block";
    if (app) app.style.display = "block";
    cigarView = "list";
    setTitle("Zigarren");
    setToolbarVisible(true);
    resetToolbar();
    closeAllModals();
  }

  function openModal(modal) {
    modal?.classList.remove("hidden");
    modal?.setAttribute("aria-hidden", "false");
    modal?.querySelector(".modal-card")?.focus?.();
  }

  function closeModal(modal) {
    modal?.classList.add("hidden");
    modal?.setAttribute("aria-hidden", "true");
  }

  function closeAllModals() {
    [cigarPliModal, cigarRatingsModal, cigarStocksModal, cigarCompareStockModal].forEach(closeModal);
  }

  async function loadCompareUsers() {
    const user = getCurrentUser();
    if (!user?.id || !window.supabaseClient) return;
    const { data, error } = await window.supabaseClient
      .from("gdb_users")
      .select("id,username,display_name")
      .neq("id", user.id)
      .order("display_name", { ascending: true });
    if (error) {
      console.error(error);
      compareUsers = [];
    } else {
      compareUsers = data || [];
    }
    renderCompareUsers();
  }

  function renderCompareUsers() {
    if (!cigarCompareStockUserList) return;
    if (!compareUsers.length) {
      cigarCompareStockUserList.innerHTML = '<div class="muted">Keine weiteren Nutzer gefunden.</div>';
      return;
    }
    cigarCompareStockUserList.innerHTML = compareUsers.map((user) => {
      const checked = selectedCompareUserId === user.id ? "checked" : "";
      const active = selectedCompareUserId === user.id ? " active" : "";
      const label = escapeHtml((user.display_name || user.username || "Unbekannt").trim());
      return `<label class="compare-stock-user-item${active}" data-user-id="${escapeHtml(user.id)}">
        <input type="radio" name="cigarCompareStockUser" value="${escapeHtml(user.id)}" ${checked}>
        <span>${label}</span>
      </label>`;
    }).join("");
  }

  function openDetail(data) {
    setToolbarVisible(false);
    cigarView = "detail";
    setTitle("Zigarren – Detailkarte");
    cigarFrame.src =
      `views/cigar/gdb_cigar_detail.html?id=${encodeURIComponent(data.id)}` +
      `&avg=${encodeURIComponent(data.avgRating ?? "")}` +
      `&cnt=${encodeURIComponent(data.cntRating ?? 0)}` +
      `&pli=${encodeURIComponent(data.avgPli ?? "")}` +
      `&pcnt=${encodeURIComponent(data.cntPli ?? 0)}` +
      `&plimin=${encodeURIComponent(data.pliMin ?? "")}` +
      `&plimax=${encodeURIComponent(data.pliMax ?? "")}` +
      `&mystock=${encodeURIComponent(data.myStockMl ?? 0)}` +
      `&myrating=${encodeURIComponent(data.myRating ?? "")}` +
      `&mypli=${encodeURIComponent(data.myPli ?? "")}` +
      `&notes=${encodeURIComponent(data.myNotes ?? "")}` +
      `&t_color=${encodeURIComponent(data.myColor ?? "")}` +
      `&t_nose=${encodeURIComponent(data.myNose ?? "")}` +
      `&t_palate=${encodeURIComponent(data.myPalate ?? "")}` +
      `&t_finish=${encodeURIComponent(data.myFinish ?? "")}` +
      `&t_summary=${encodeURIComponent(data.mySummary ?? "")}` +
      `&t_trinkgelegenheit=${encodeURIComponent(data.myTrinkgelegenheit ?? "")}` +
       `&t_band=${encodeURIComponent(data.extraTasting?.t_band ?? "")}` +
      `&t_draw=${encodeURIComponent(data.extraTasting?.t_draw ?? "")}` +
      `&t_burn=${encodeURIComponent(data.extraTasting?.t_burn ?? "")}` +
      `&t_smoke=${encodeURIComponent(data.extraTasting?.t_smoke ?? "")}` +
      `&t_strength=${encodeURIComponent(data.extraTasting?.t_strength ?? "")}` +
      `&t_development=${encodeURIComponent(data.extraTasting?.t_development ?? "")}` +
      `&myWishlist=${encodeURIComponent(data.myWishlist ?? "")}` +
      `&created_at=${encodeURIComponent(data.created_at ?? "")}` +
      `&updated_at=${encodeURIComponent(data.updated_at ?? "")}` +
      `&created_by=${encodeURIComponent(data.created_by ?? "")}` +
      `&updated_by=${encodeURIComponent(data.updated_by ?? "")}` +
      `&my_created_at=${encodeURIComponent(data.my_created_at ?? "")}` +
      `&my_updated_at=${encodeURIComponent(data.my_updated_at ?? "")}`;
  }

  tileCigar?.addEventListener("click", (event) => {
    event.preventDefault();
    void openCigarList();
  });

  backToDashFromCigarBtn?.addEventListener("click", () => {
    if (cigarView === "detail") loadCigarListFrame();
    else closeCigarToDashboard();
  });

  cigarSearch?.addEventListener("input", () => {
    postToCigarFrame({ type: "gdb-cigar-set-search", value: cigarSearch.value || "" });
  });

  cigarSort?.addEventListener("change", syncToolbar);
  cigarFilterOwnStock?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  cigarFilterCollector?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  cigarFilterIncomplete?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  cigarFilterWishlist?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  cigarFilterWithoutImage?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  cigarSortDir?.addEventListener("click", () => {
    const next = cigarSortDir.dataset.dir === "desc" ? "asc" : "desc";
    cigarSortDir.dataset.dir = next;
    cigarSortDir.textContent = next === "desc" ? "↓" : "↑";
    cigarSortDir.setAttribute("aria-label", next === "desc" ? "Sortierreihenfolge absteigend" : "Sortierreihenfolge aufsteigend");
    syncToolbar();
  });

  btnCigarList?.addEventListener("click", () => {
    resetToolbar();
    syncToolbar();
  });

  btnNewCigar?.addEventListener("click", () => {
    setCigarMessage("");
    if (!window.GdbPermissions?.requirePermission?.("cigar", "create")) return;
    setToolbarVisible(false);
    cigarView = "detail";
    setTitle("Zigarren – Neuer Eintrag");
    cigarFrame.src = `views/cigar/gdb_cigar_create.html?t=${Date.now()}`;
  });

  cigarCompareStock?.addEventListener("change", async () => {
    if (!cigarCompareStock.checked) {
      selectedCompareUserId = null;
      syncToolbar();
      return;
    }
    if (!compareUsers.length) await loadCompareUsers();
    openModal(cigarCompareStockModal);
  });

  cigarCompareStockUserList?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.name !== "cigarCompareStockUser") return;
    selectedCompareUserId = target.value || null;
    renderCompareUsers();
  });

  document.getElementById("cigarCompareStockApplyBtn")?.addEventListener("click", () => {
    if (cigarCompareStock) cigarCompareStock.checked = !!selectedCompareUserId;
    closeModal(cigarCompareStockModal);
    syncToolbar();
  });

  document.getElementById("cigarCompareStockCancelBtn")?.addEventListener("click", () => {
    if (cigarCompareStock) cigarCompareStock.checked = false;
    selectedCompareUserId = null;
    closeModal(cigarCompareStockModal);
    syncToolbar();
  });

  document.getElementById("cigarPliCloseBtn")?.addEventListener("click", () => closeModal(cigarPliModal));
  document.getElementById("cigarRatingsCloseBtn")?.addEventListener("click", () => closeModal(cigarRatingsModal));
  document.getElementById("cigarStocksCloseBtn")?.addEventListener("click", () => closeModal(cigarStocksModal));
  document.querySelectorAll("[data-close-cigar-modal]").forEach((element) => {
    element.addEventListener("click", () => closeModal(document.getElementById(element.dataset.closeCigarModal)));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
      if (cigarFilterMenu) cigarFilterMenu.open = false;
    }
  });

  document.addEventListener("click", (event) => {
    if (cigarFilterMenu?.open && !cigarFilterMenu.contains(event.target)) {
      cigarFilterMenu.open = false;
    }
  });

  window.addEventListener("message", (event) => {
    if (!cigarFrame || event.source !== cigarFrame.contentWindow) return;
    const data = event.data || {};
    if (data.type === "gdb-cigar-set-title") {
      setTitle(data.value || "Zigarren");
      return;
    }
    if (data.type === "gdb-cigar-count") {
      const count = Number(data.count);
      const safe = Number.isNaN(count) ? 0 : count;
      if (cigarCount) cigarCount.textContent = safe === 1 ? "1 Zigarre" : `${safe} Zigarren`;
      return;
    }
    if (data.type === "gdb-cigar-nav") {
      if (data.view === "cigarDetail" && data.id) openDetail(data);
      else if (data.view === "cigarList") {
        loadCigarListFrame();
        setCigarMessage(data.message || "", data.message ? "err" : "hint");
      }
      else if (data.view === "home") closeCigarToDashboard();
      return;
    }
    if (data.type === "gdb-cigar-open-pli") {
      openModal(cigarPliModal);
      return;
    }
    if (data.type === "gdb-cigar-open-ratings") {
      if (cigarRatingsTitle) cigarRatingsTitle.innerHTML = data.title || "Alle Bewertungen";
      if (cigarRatingsBody) cigarRatingsBody.innerHTML = data.html || "";
      openModal(cigarRatingsModal);
      return;
    }
    if (data.type === "gdb-cigar-open-stocks") {
      if (cigarStocksTitle) cigarStocksTitle.innerHTML = data.title || "Bestände";
      if (cigarStocksBody) cigarStocksBody.innerHTML = data.html || "";
      openModal(cigarStocksModal);
    }
  });

  window.addEventListener("gdb-permissions-loaded", (event) => {
    if (!event.detail?.userId || event.detail.userId !== getCurrentUser()?.id) return;
    if (event.detail.error) {
      tileStatsKey = null;
      ++tileStatsRequestId;
      if (tileStatCigar) tileStatCigar.textContent = "Stats nicht verfügbar";
      return;
    }
    void loadTileStats();
  });

  window.supabaseClient?.auth?.onAuthStateChange?.((event) => {
    if (event === "SIGNED_OUT") {
      tileStatsKey = null;
      ++tileStatsRequestId;
      if (tileStatCigar) tileStatCigar.textContent = "Lade Daten…";
      document.body.classList.remove("cigar-view-active");
      cigarListView?.classList.add("hidden");
      if (cigarFrame) cigarFrame.setAttribute("src", "");
      closeAllModals();
      return;
    }
    // Kachelzahlen erst nach dem App-Nutzerprofil und den geladenen Rechten abrufen.
  });

  window.GdbCigarShell = Object.freeze({
    open: openCigarList,
    close: closeCigarToDashboard,
    released: true
  });
})();
