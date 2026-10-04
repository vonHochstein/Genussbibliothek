(function () {
  "use strict";

  // Nach technischer Datenbank-/Rechteprüfung auf Nutzeranweisung lokal freigegeben.
  const WINE_RELEASED = true;

  const tileWein = document.getElementById("tileWein");
  const tileStatWein = document.getElementById("tileStatWein");
  const dashboard = document.getElementById("dashboard");
  const app = document.getElementById("app");
  const wineListView = document.getElementById("wineListView");
  const wineFrame = document.getElementById("wineFrame");
  const wineViewTitle = document.getElementById("wineViewTitle");
  const wineLoginOk = document.getElementById("wineLoginOk");
  const wineMsg = document.getElementById("wineMsg");
  const wineToolbar = document.querySelector(".wine-toolbar");
  const wineCount = document.getElementById("wineCount");
  const wineSearch = document.getElementById("wineSearch");
  const wineSort = document.getElementById("wineSort");
  const wineSortDir = document.getElementById("wineSortDir");
  const wineFilterMenu = document.getElementById("wineFilterMenu");
  const wineFilterSummary = document.getElementById("wineFilterSummary");
  const wineFilterOwnStock = document.getElementById("wineFilterOwnStock");
  const wineFilterCollector = document.getElementById("wineFilterCollector");
  const wineFilterIncomplete = document.getElementById("wineFilterIncomplete");
  const wineFilterWishlist = document.getElementById("wineFilterWishlist");
  const wineFilterWithoutImage = document.getElementById("wineFilterWithoutImage");
  const wineCompareStock = document.getElementById("wineCompareStock");
  const btnWeinList = document.getElementById("btnWeinList");
  const btnNewWein = document.getElementById("btnNewWein");
  const backToDashFromWeinBtn = document.getElementById("backToDashFromWeinBtn");

  const winePliModal = document.getElementById("winePliModal");
  const wineRatingsModal = document.getElementById("wineRatingsModal");
  const wineRatingsTitle = document.getElementById("wineRatingsModalTitle");
  const wineRatingsBody = document.getElementById("wineRatingsModalContent");
  const wineStocksModal = document.getElementById("wineStocksModal");
  const wineStocksTitle = document.getElementById("wineStocksTitle");
  const wineStocksBody = document.getElementById("wineStocksBody");
  const wineCompareStockModal = document.getElementById("wineCompareStockModal");
  const wineCompareStockUserList = document.getElementById("wineCompareStockUserList");

  let wineView = "list";
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

  function setWeinMessage(text = "", kind = "hint") {
    if (!wineMsg) return;
    wineMsg.textContent = text;
    wineMsg.className = text ? kind : "";
    wineMsg.style.display = text ? "block" : "none";
  }

  function setTitle(text) {
    if (wineViewTitle) wineViewTitle.textContent = text || "Wein";
  }

  function setToolbarVisible(visible) {
    if (wineToolbar) wineToolbar.style.display = visible ? "" : "none";
  }

  function ensureWeinToolbarPlacement() {
    if (!wineToolbar || !wineListView) return;

    const titleCard = wineListView.querySelector(".card");

    if (titleCard) {
      const alreadyPlaced =
        wineToolbar.parentElement === wineListView &&
        wineToolbar.previousElementSibling === titleCard;

      if (alreadyPlaced) return;

      titleCard.insertAdjacentElement("afterend", wineToolbar);
      return;
    }

    wineListView.appendChild(wineToolbar);
  }

  function postToWeinFrame(message) {
    wineFrame?.contentWindow?.postMessage(message, "*");
  }

  function updateFilterSummary() {
    const activeCount = [
      wineFilterOwnStock,
      wineFilterCollector,
      wineFilterIncomplete,
      wineFilterWishlist,
      wineFilterWithoutImage
    ].filter((input) => !!input?.checked).length;
    if (wineFilterSummary) wineFilterSummary.textContent = activeCount ? `Filter (${activeCount})` : "Filter";
    if (wineFilterMenu) wineFilterMenu.dataset.active = activeCount ? "true" : "false";
  }

  function syncToolbar() {
    postToWeinFrame({ type: "gdb-wine-set-search", value: wineSearch?.value || "" });
    postToWeinFrame({
      type: "gdb-wine-set-sort",
      value: {
        mode: wineSort?.value || "updated",
        dir: wineSortDir?.dataset.dir || "desc"
      }
    });
    postToWeinFrame({
      type: "gdb-wine-set-filters",
      value: {
        ownStock: !!wineFilterOwnStock?.checked,
        collector: !!wineFilterCollector?.checked,
        incomplete: !!wineFilterIncomplete?.checked,
        wishlist: !!wineFilterWishlist?.checked,
        withoutImage: !!wineFilterWithoutImage?.checked
      }
    });
    postToWeinFrame({
      type: "gdb-wine-set-compare-stock",
      value: {
        enabled: !!(wineCompareStock?.checked && selectedCompareUserId),
        userId: selectedCompareUserId || null
      }
    });
  }

  function resetToolbar() {
    if (wineSearch) wineSearch.value = "";
    if (wineSort) wineSort.value = "updated";
    if (wineSortDir) {
      wineSortDir.dataset.dir = "desc";
      wineSortDir.textContent = "↓";
      wineSortDir.setAttribute("aria-label", "Sortierreihenfolge absteigend");
    }
    if (wineFilterOwnStock) wineFilterOwnStock.checked = false;
    if (wineFilterCollector) wineFilterCollector.checked = false;
    if (wineFilterIncomplete) wineFilterIncomplete.checked = false;
    if (wineFilterWishlist) wineFilterWishlist.checked = false;
    if (wineFilterWithoutImage) wineFilterWithoutImage.checked = false;
    if (wineFilterMenu) wineFilterMenu.open = false;
    updateFilterSummary();
    if (wineCompareStock) wineCompareStock.checked = false;
    if (wineCount) wineCount.textContent = "0 Weine";
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
    if (!wineLoginOk) return;
    const user = getCurrentUser();
    const name = (user?.display_name || user?.username || "").trim();
    wineLoginOk.textContent = name ? `Angemeldet als: ${name}` : "Angemeldet";
  }

  async function loadTileStats() {
    if (!WINE_RELEASED || !tileStatWein || !window.supabaseClient || !getCurrentUser()) return;
    try {
      await refreshPermissions();
      if (!window.GdbPermissions?.hasPermission?.("wine", "read")) {
        tileStatWein.textContent = "kein Zugriff";
        return;
      }
      const { count, error: countError } = await window.supabaseClient
        .from("gdb_wines")
        .select("id", { count: "exact", head: true });
      if (countError) throw countError;
      const { data, error } = await window.supabaseClient.from("gdb_wines").select("country");
      if (error) throw error;
      const countries = new Set((data || []).map((row) => (row.country || "").trim()).filter(Boolean));
      const wineCountValue = Number(count) || 0;
      const wineText = wineCountValue === 1 ? "1 Wein" : `${wineCountValue} Weine`;
      const countryText = countries.size === 1 ? "einem Land" : `${countries.size} Ländern`;
      tileStatWein.textContent = `${wineText} aus ${countryText}`;
    } catch (error) {
      console.error("Wein-Stats konnten nicht geladen werden:", error);
      tileStatWein.textContent = "Stats nicht verfügbar";
    }
  }

  function loadWeinListFrame() {
    if (!wineFrame) return;
    ensureWeinToolbarPlacement();
    const uid = encodeURIComponent(getCurrentUser()?.id || "");
    wineFrame.onload = syncToolbar;
    wineFrame.src = `views/wine/gdb_wine.html?uid=${uid}&t=${Date.now()}`;
    wineView = "list";
    setTitle("Wein");
    setToolbarVisible(true);
  }

  async function openWeinList(options = {}) {
    const preview = options.preview === true;
    if (!WINE_RELEASED && !preview) {
      if (tileStatWein) tileStatWein.textContent = "folgt nach Datenbankfreigabe";
      return false;
    }
    if (!getCurrentUser()) return false;

    try {
      await refreshPermissions();
    } catch (error) {
      console.error(error);
      return false;
    }
    if (!window.GdbPermissions?.requirePermission?.("wine", "read")) return false;

    document.body.classList.add("wine-view-active");
    if (dashboard) dashboard.style.display = "none";
    if (app) app.style.display = "none";
    wineListView?.classList.remove("hidden");
    showLoginName();
    resetToolbar();
    setWeinMessage("");
    loadWeinListFrame();
    await loadCompareUsers();
    return true;
  }

  function closeWeinToDashboard() {
    document.body.classList.remove("wine-view-active");
    wineListView?.classList.add("hidden");
    if (wineFrame) {
      wineFrame.onload = null;
      wineFrame.setAttribute("src", "");
    }
    if (dashboard) dashboard.style.display = "block";
    if (app) app.style.display = "block";
    wineView = "list";
    setTitle("Wein");
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
    [winePliModal, wineRatingsModal, wineStocksModal, wineCompareStockModal].forEach(closeModal);
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
    if (!wineCompareStockUserList) return;
    if (!compareUsers.length) {
      wineCompareStockUserList.innerHTML = '<div class="muted">Keine weiteren Nutzer gefunden.</div>';
      return;
    }
    wineCompareStockUserList.innerHTML = compareUsers.map((user) => {
      const checked = selectedCompareUserId === user.id ? "checked" : "";
      const active = selectedCompareUserId === user.id ? " active" : "";
      const label = escapeHtml((user.display_name || user.username || "Unbekannt").trim());
      return `<label class="compare-stock-user-item${active}" data-user-id="${escapeHtml(user.id)}">
        <input type="radio" name="wineCompareStockUser" value="${escapeHtml(user.id)}" ${checked}>
        <span>${label}</span>
      </label>`;
    }).join("");
  }

  function openDetail(data) {
    setToolbarVisible(false);
    wineView = "detail";
    setTitle("Wein – Detailkarte");
    wineFrame.src =
      `views/wine/gdb_wine_detail.html?id=${encodeURIComponent(data.id)}` +
      `&avg=${encodeURIComponent(data.avgRating ?? "")}` +
      `&cnt=${encodeURIComponent(data.cntRating ?? 0)}` +
      `&pli=${encodeURIComponent(data.avgPli ?? "")}` +
      `&pcnt=${encodeURIComponent(data.cntPli ?? 0)}` +
      `&plimin=${encodeURIComponent(data.pliMin ?? "")}` +
      `&plimax=${encodeURIComponent(data.pliMax ?? "")}` +
      `&mystock=${encodeURIComponent(data.myStockUnits ?? 0)}` +
      `&myrating=${encodeURIComponent(data.myRating ?? "")}` +
      `&mypli=${encodeURIComponent(data.myPli ?? "")}` +
      `&notes=${encodeURIComponent(data.myNotes ?? "")}` +
      `&t_color=${encodeURIComponent(data.myColor ?? "")}` +
      `&t_acidity=${encodeURIComponent(data.myAcidity ?? "")}` +
      `&t_nose=${encodeURIComponent(data.myNose ?? "")}` +
      `&t_palate=${encodeURIComponent(data.myPalate ?? "")}` +
      `&t_sweetness=${encodeURIComponent(data.mySweetness ?? "")}` +
      `&t_body=${encodeURIComponent(data.myBody ?? "")}` +
      `&t_finish=${encodeURIComponent(data.myFinish ?? "")}` +
      `&t_summary=${encodeURIComponent(data.mySummary ?? "")}` +
      `&t_trinkgelegenheit=${encodeURIComponent(data.myTrinkgelegenheit ?? "")}` +
      `&myWishlist=${encodeURIComponent(data.myWishlist ?? "")}` +
      `&created_at=${encodeURIComponent(data.created_at ?? "")}` +
      `&updated_at=${encodeURIComponent(data.updated_at ?? "")}` +
      `&created_by=${encodeURIComponent(data.created_by ?? "")}` +
      `&updated_by=${encodeURIComponent(data.updated_by ?? "")}` +
      `&my_created_at=${encodeURIComponent(data.my_created_at ?? "")}` +
      `&my_updated_at=${encodeURIComponent(data.my_updated_at ?? "")}`;
  }

  tileWein?.addEventListener("click", (event) => {
    event.preventDefault();
    void openWeinList();
  });

  backToDashFromWeinBtn?.addEventListener("click", () => {
    if (wineView === "detail") loadWeinListFrame();
    else closeWeinToDashboard();
  });

  wineSearch?.addEventListener("input", () => {
    postToWeinFrame({ type: "gdb-wine-set-search", value: wineSearch.value || "" });
  });

  wineSort?.addEventListener("change", syncToolbar);
  wineFilterOwnStock?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  wineFilterCollector?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  wineFilterIncomplete?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  wineFilterWishlist?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  wineFilterWithoutImage?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  wineSortDir?.addEventListener("click", () => {
    const next = wineSortDir.dataset.dir === "desc" ? "asc" : "desc";
    wineSortDir.dataset.dir = next;
    wineSortDir.textContent = next === "desc" ? "↓" : "↑";
    wineSortDir.setAttribute("aria-label", next === "desc" ? "Sortierreihenfolge absteigend" : "Sortierreihenfolge aufsteigend");
    syncToolbar();
  });

  btnWeinList?.addEventListener("click", () => {
    resetToolbar();
    syncToolbar();
  });

  btnNewWein?.addEventListener("click", () => {
    setWeinMessage("");
    if (!window.GdbPermissions?.requirePermission?.("wine", "create")) return;
    setToolbarVisible(false);
    wineView = "detail";
    setTitle("Wein – Neuer Eintrag");
    wineFrame.src = `views/wine/gdb_wine_create.html?t=${Date.now()}`;
  });

  wineCompareStock?.addEventListener("change", async () => {
    if (!wineCompareStock.checked) {
      selectedCompareUserId = null;
      syncToolbar();
      return;
    }
    if (!compareUsers.length) await loadCompareUsers();
    openModal(wineCompareStockModal);
  });

  wineCompareStockUserList?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.name !== "wineCompareStockUser") return;
    selectedCompareUserId = target.value || null;
    renderCompareUsers();
  });

  document.getElementById("wineCompareStockApplyBtn")?.addEventListener("click", () => {
    if (wineCompareStock) wineCompareStock.checked = !!selectedCompareUserId;
    closeModal(wineCompareStockModal);
    syncToolbar();
  });

  document.getElementById("wineCompareStockCancelBtn")?.addEventListener("click", () => {
    if (wineCompareStock) wineCompareStock.checked = false;
    selectedCompareUserId = null;
    closeModal(wineCompareStockModal);
    syncToolbar();
  });

  document.getElementById("winePliCloseBtn")?.addEventListener("click", () => closeModal(winePliModal));
  document.getElementById("wineRatingsCloseBtn")?.addEventListener("click", () => closeModal(wineRatingsModal));
  document.getElementById("wineStocksCloseBtn")?.addEventListener("click", () => closeModal(wineStocksModal));
  document.querySelectorAll("[data-close-wine-modal]").forEach((element) => {
    element.addEventListener("click", () => closeModal(document.getElementById(element.dataset.closeWeinModal)));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
      if (wineFilterMenu) wineFilterMenu.open = false;
    }
  });

  document.addEventListener("click", (event) => {
    if (wineFilterMenu?.open && !wineFilterMenu.contains(event.target)) {
      wineFilterMenu.open = false;
    }
  });

  window.addEventListener("message", (event) => {
    if (!wineFrame || event.source !== wineFrame.contentWindow) return;
    const data = event.data || {};
    if (data.type === "gdb-wine-set-title") {
      setTitle(data.value || "Wein");
      return;
    }
    if (data.type === "gdb-wine-count") {
      const count = Number(data.count);
      const safe = Number.isNaN(count) ? 0 : count;
      if (wineCount) wineCount.textContent = safe === 1 ? "1 Wein" : `${safe} Weine`;
      return;
    }
    if (data.type === "gdb-wine-nav") {
      if (data.view === "wineDetail" && data.id) openDetail(data);
      else if (data.view === "wineList") loadWeinListFrame();
      else if (data.view === "home") closeWeinToDashboard();
      return;
    }
    if (data.type === "gdb-wine-open-pli") {
      openModal(winePliModal);
      return;
    }
    if (data.type === "gdb-wine-open-ratings") {
      if (wineRatingsTitle) wineRatingsTitle.innerHTML = data.title || "Alle Bewertungen";
      if (wineRatingsBody) wineRatingsBody.innerHTML = data.html || "";
      openModal(wineRatingsModal);
      return;
    }
    if (data.type === "gdb-wine-open-stocks") {
      if (wineStocksTitle) wineStocksTitle.innerHTML = data.title || "Bestände";
      if (wineStocksBody) wineStocksBody.innerHTML = data.html || "";
      openModal(wineStocksModal);
    }
  });

  window.supabaseClient?.auth?.onAuthStateChange?.((event) => {
    if (event === "SIGNED_OUT") {
      document.body.classList.remove("wine-view-active");
      wineListView?.classList.add("hidden");
      if (wineFrame) wineFrame.setAttribute("src", "");
      closeAllModals();
      return;
    }
    if (event === "SIGNED_IN" || event === "INITIAL_SESSION") void loadTileStats();
  });

  window.GdbWeinShell = Object.freeze({
    open: openWeinList,
    close: closeWeinToDashboard,
    released: WINE_RELEASED
  });
})();
