(function () {
  "use strict";

  // Nach ausgeführter Datenbankmigration und erfolgreicher technischer Prüfung freigegeben.
  const BEER_RELEASED = true;

  const tileBier = document.getElementById("tileBier");
  const tileStatBier = document.getElementById("tileStatBier");
  const dashboard = document.getElementById("dashboard");
  const app = document.getElementById("app");
  const beerListView = document.getElementById("beerListView");
  const beerFrame = document.getElementById("beerFrame");
  const beerViewTitle = document.getElementById("beerViewTitle");
  const beerLoginOk = document.getElementById("beerLoginOk");
  const beerMsg = document.getElementById("beerMsg");
  const beerToolbar = document.querySelector(".beer-toolbar");
  const beerCount = document.getElementById("beerCount");
  const beerSearch = document.getElementById("beerSearch");
  const beerSort = document.getElementById("beerSort");
  const beerSortDir = document.getElementById("beerSortDir");
  const beerFilterMenu = document.getElementById("beerFilterMenu");
  const beerFilterSummary = document.getElementById("beerFilterSummary");
  const beerFilterOwnStock = document.getElementById("beerFilterOwnStock");
  const beerFilterCollector = document.getElementById("beerFilterCollector");
  const beerFilterIncomplete = document.getElementById("beerFilterIncomplete");
  const beerFilterWishlist = document.getElementById("beerFilterWishlist");
  const beerFilterWithoutImage = document.getElementById("beerFilterWithoutImage");
  const beerCompareStock = document.getElementById("beerCompareStock");
  const btnBierList = document.getElementById("btnBierList");
  const btnNewBier = document.getElementById("btnNewBier");
  const backToDashFromBierBtn = document.getElementById("backToDashFromBierBtn");

  const beerPliModal = document.getElementById("beerPliModal");
  const beerRatingsModal = document.getElementById("beerRatingsModal");
  const beerRatingsTitle = document.getElementById("beerRatingsModalTitle");
  const beerRatingsBody = document.getElementById("beerRatingsModalContent");
  const beerStocksModal = document.getElementById("beerStocksModal");
  const beerStocksTitle = document.getElementById("beerStocksTitle");
  const beerStocksBody = document.getElementById("beerStocksBody");
  const beerCompareStockModal = document.getElementById("beerCompareStockModal");
  const beerCompareStockUserList = document.getElementById("beerCompareStockUserList");

  let beerView = "list";
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

  function setBierMessage(text = "", kind = "hint") {
    if (!beerMsg) return;
    beerMsg.textContent = text;
    beerMsg.className = text ? kind : "";
    beerMsg.style.display = text ? "block" : "none";
  }

  function setTitle(text) {
    if (beerViewTitle) beerViewTitle.textContent = text || "Bier";
  }

  function setToolbarVisible(visible) {
    if (beerToolbar) beerToolbar.style.display = visible ? "" : "none";
  }

  function ensureBierToolbarPlacement() {
    if (!beerToolbar || !beerListView) return;

    const titleCard = beerListView.querySelector(".card");

    if (titleCard) {
      const alreadyPlaced =
        beerToolbar.parentElement === beerListView &&
        beerToolbar.previousElementSibling === titleCard;

      if (alreadyPlaced) return;

      titleCard.insertAdjacentElement("afterend", beerToolbar);
      return;
    }

    beerListView.appendChild(beerToolbar);
  }

  function postToBierFrame(message) {
    beerFrame?.contentWindow?.postMessage(message, "*");
  }

  function updateFilterSummary() {
    const activeCount = [
      beerFilterOwnStock,
      beerFilterCollector,
      beerFilterIncomplete,
      beerFilterWishlist,
      beerFilterWithoutImage
    ].filter((input) => !!input?.checked).length;
    if (beerFilterSummary) beerFilterSummary.textContent = activeCount ? `Filter (${activeCount})` : "Filter";
    if (beerFilterMenu) beerFilterMenu.dataset.active = activeCount ? "true" : "false";
  }

  function syncToolbar() {
    postToBierFrame({ type: "gdb-beer-set-search", value: beerSearch?.value || "" });
    postToBierFrame({
      type: "gdb-beer-set-sort",
      value: {
        mode: beerSort?.value || "updated",
        dir: beerSortDir?.dataset.dir || "desc"
      }
    });
    postToBierFrame({
      type: "gdb-beer-set-filters",
      value: {
        ownStock: !!beerFilterOwnStock?.checked,
        collector: !!beerFilterCollector?.checked,
        incomplete: !!beerFilterIncomplete?.checked,
        wishlist: !!beerFilterWishlist?.checked,
        withoutImage: !!beerFilterWithoutImage?.checked
      }
    });
    postToBierFrame({
      type: "gdb-beer-set-compare-stock",
      value: {
        enabled: !!(beerCompareStock?.checked && selectedCompareUserId),
        userId: selectedCompareUserId || null
      }
    });
  }

  function resetToolbar() {
    if (beerSearch) beerSearch.value = "";
    if (beerSort) beerSort.value = "updated";
    if (beerSortDir) {
      beerSortDir.dataset.dir = "desc";
      beerSortDir.textContent = "↓";
      beerSortDir.setAttribute("aria-label", "Sortierreihenfolge absteigend");
    }
    if (beerFilterOwnStock) beerFilterOwnStock.checked = false;
    if (beerFilterCollector) beerFilterCollector.checked = false;
    if (beerFilterIncomplete) beerFilterIncomplete.checked = false;
    if (beerFilterWishlist) beerFilterWishlist.checked = false;
    if (beerFilterWithoutImage) beerFilterWithoutImage.checked = false;
    if (beerFilterMenu) beerFilterMenu.open = false;
    updateFilterSummary();
    if (beerCompareStock) beerCompareStock.checked = false;
    if (beerCount) beerCount.textContent = "0 Biere";
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
    if (!beerLoginOk) return;
    const user = getCurrentUser();
    const name = (user?.display_name || user?.username || "").trim();
    beerLoginOk.textContent = name ? `Angemeldet als: ${name}` : "Angemeldet";
  }

  async function loadTileStats() {
    if (!BEER_RELEASED || !tileStatBier || !window.supabaseClient || !getCurrentUser()) return;
    try {
      await refreshPermissions();
      if (!window.GdbPermissions?.hasPermission?.("beer", "read")) {
        tileStatBier.textContent = "kein Zugriff";
        return;
      }
      const { count, error: countError } = await window.supabaseClient
        .from("gdb_beers")
        .select("id", { count: "exact", head: true });
      if (countError) throw countError;
      const { data, error } = await window.supabaseClient.from("gdb_beers").select("country");
      if (error) throw error;
      const countries = new Set((data || []).map((row) => (row.country || "").trim()).filter(Boolean));
      const beerCountValue = Number(count) || 0;
      const beerText = beerCountValue === 1 ? "1 Bier" : `${beerCountValue} Biere`;
      const countryText = countries.size === 1 ? "einem Land" : `${countries.size} Ländern`;
      tileStatBier.textContent = `${beerText} aus ${countryText}`;
    } catch (error) {
      console.error("Bier-Stats konnten nicht geladen werden:", error);
      tileStatBier.textContent = "Stats nicht verfügbar";
    }
  }

  function loadBierListFrame() {
    if (!beerFrame) return;
    ensureBierToolbarPlacement();
    const uid = encodeURIComponent(getCurrentUser()?.id || "");
    beerFrame.onload = syncToolbar;
    beerFrame.src = `views/beer/gdb_beer.html?uid=${uid}&t=${Date.now()}`;
    beerView = "list";
    setTitle("Bier");
    setToolbarVisible(true);
  }

  async function openBierList(options = {}) {
    const preview = options.preview === true;
    if (!BEER_RELEASED && !preview) {
      if (tileStatBier) tileStatBier.textContent = "folgt nach Datenbankfreigabe";
      return false;
    }
    if (!getCurrentUser()) return false;

    try {
      await refreshPermissions();
    } catch (error) {
      console.error(error);
      return false;
    }
    if (!window.GdbPermissions?.requirePermission?.("beer", "read")) return false;

    document.body.classList.add("beer-view-active");
    if (dashboard) dashboard.style.display = "none";
    if (app) app.style.display = "none";
    beerListView?.classList.remove("hidden");
    showLoginName();
    resetToolbar();
    setBierMessage("");
    loadBierListFrame();
    await loadCompareUsers();
    return true;
  }

  function closeBierToDashboard() {
    document.body.classList.remove("beer-view-active");
    beerListView?.classList.add("hidden");
    if (beerFrame) {
      beerFrame.onload = null;
      beerFrame.setAttribute("src", "");
    }
    if (dashboard) dashboard.style.display = "block";
    if (app) app.style.display = "block";
    beerView = "list";
    setTitle("Bier");
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
    [beerPliModal, beerRatingsModal, beerStocksModal, beerCompareStockModal].forEach(closeModal);
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
    if (!beerCompareStockUserList) return;
    if (!compareUsers.length) {
      beerCompareStockUserList.innerHTML = '<div class="muted">Keine weiteren Nutzer gefunden.</div>';
      return;
    }
    beerCompareStockUserList.innerHTML = compareUsers.map((user) => {
      const checked = selectedCompareUserId === user.id ? "checked" : "";
      const active = selectedCompareUserId === user.id ? " active" : "";
      const label = escapeHtml((user.display_name || user.username || "Unbekannt").trim());
      return `<label class="compare-stock-user-item${active}" data-user-id="${escapeHtml(user.id)}">
        <input type="radio" name="beerCompareStockUser" value="${escapeHtml(user.id)}" ${checked}>
        <span>${label}</span>
      </label>`;
    }).join("");
  }

  function openDetail(data) {
    setToolbarVisible(false);
    beerView = "detail";
    setTitle("Bier – Detailkarte");
    beerFrame.src =
      `views/beer/gdb_beer_detail.html?id=${encodeURIComponent(data.id)}` +
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
      `&t_foam=${encodeURIComponent(data.myFoam ?? "")}` +
      `&t_nose=${encodeURIComponent(data.myNose ?? "")}` +
      `&t_palate=${encodeURIComponent(data.myPalate ?? "")}` +
      `&t_bitterness=${encodeURIComponent(data.myBitterness ?? "")}` +
      `&t_mouthfeel=${encodeURIComponent(data.myMouthfeel ?? "")}` +
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

  tileBier?.addEventListener("click", (event) => {
    event.preventDefault();
    void openBierList();
  });

  backToDashFromBierBtn?.addEventListener("click", () => {
    if (beerView === "detail") loadBierListFrame();
    else closeBierToDashboard();
  });

  beerSearch?.addEventListener("input", () => {
    postToBierFrame({ type: "gdb-beer-set-search", value: beerSearch.value || "" });
  });

  beerSort?.addEventListener("change", syncToolbar);
  beerFilterOwnStock?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  beerFilterCollector?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  beerFilterIncomplete?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  beerFilterWishlist?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  beerFilterWithoutImage?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  beerSortDir?.addEventListener("click", () => {
    const next = beerSortDir.dataset.dir === "desc" ? "asc" : "desc";
    beerSortDir.dataset.dir = next;
    beerSortDir.textContent = next === "desc" ? "↓" : "↑";
    beerSortDir.setAttribute("aria-label", next === "desc" ? "Sortierreihenfolge absteigend" : "Sortierreihenfolge aufsteigend");
    syncToolbar();
  });

  btnBierList?.addEventListener("click", () => {
    resetToolbar();
    syncToolbar();
  });

  btnNewBier?.addEventListener("click", () => {
    setBierMessage("");
    if (!window.GdbPermissions?.requirePermission?.("beer", "create")) return;
    setToolbarVisible(false);
    beerView = "detail";
    setTitle("Bier – Neuer Eintrag");
    beerFrame.src = `views/beer/gdb_beer_create.html?t=${Date.now()}`;
  });

  beerCompareStock?.addEventListener("change", async () => {
    if (!beerCompareStock.checked) {
      selectedCompareUserId = null;
      syncToolbar();
      return;
    }
    if (!compareUsers.length) await loadCompareUsers();
    openModal(beerCompareStockModal);
  });

  beerCompareStockUserList?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.name !== "beerCompareStockUser") return;
    selectedCompareUserId = target.value || null;
    renderCompareUsers();
  });

  document.getElementById("beerCompareStockApplyBtn")?.addEventListener("click", () => {
    if (beerCompareStock) beerCompareStock.checked = !!selectedCompareUserId;
    closeModal(beerCompareStockModal);
    syncToolbar();
  });

  document.getElementById("beerCompareStockCancelBtn")?.addEventListener("click", () => {
    if (beerCompareStock) beerCompareStock.checked = false;
    selectedCompareUserId = null;
    closeModal(beerCompareStockModal);
    syncToolbar();
  });

  document.getElementById("beerPliCloseBtn")?.addEventListener("click", () => closeModal(beerPliModal));
  document.getElementById("beerRatingsCloseBtn")?.addEventListener("click", () => closeModal(beerRatingsModal));
  document.getElementById("beerStocksCloseBtn")?.addEventListener("click", () => closeModal(beerStocksModal));
  document.querySelectorAll("[data-close-beer-modal]").forEach((element) => {
    element.addEventListener("click", () => closeModal(document.getElementById(element.dataset.closeBierModal)));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
      if (beerFilterMenu) beerFilterMenu.open = false;
    }
  });

  document.addEventListener("click", (event) => {
    if (beerFilterMenu?.open && !beerFilterMenu.contains(event.target)) {
      beerFilterMenu.open = false;
    }
  });

  window.addEventListener("message", (event) => {
    if (!beerFrame || event.source !== beerFrame.contentWindow) return;
    const data = event.data || {};
    if (data.type === "gdb-beer-set-title") {
      setTitle(data.value || "Bier");
      return;
    }
    if (data.type === "gdb-beer-count") {
      const count = Number(data.count);
      const safe = Number.isNaN(count) ? 0 : count;
      if (beerCount) beerCount.textContent = safe === 1 ? "1 Bier" : `${safe} Biere`;
      return;
    }
    if (data.type === "gdb-beer-nav") {
      if (data.view === "beerDetail" && data.id) openDetail(data);
      else if (data.view === "beerList") loadBierListFrame();
      else if (data.view === "home") closeBierToDashboard();
      return;
    }
    if (data.type === "gdb-beer-open-pli") {
      openModal(beerPliModal);
      return;
    }
    if (data.type === "gdb-beer-open-ratings") {
      if (beerRatingsTitle) beerRatingsTitle.innerHTML = data.title || "Alle Bewertungen";
      if (beerRatingsBody) beerRatingsBody.innerHTML = data.html || "";
      openModal(beerRatingsModal);
      return;
    }
    if (data.type === "gdb-beer-open-stocks") {
      if (beerStocksTitle) beerStocksTitle.innerHTML = data.title || "Bestände";
      if (beerStocksBody) beerStocksBody.innerHTML = data.html || "";
      openModal(beerStocksModal);
    }
  });

  window.supabaseClient?.auth?.onAuthStateChange?.((event) => {
    if (event === "SIGNED_OUT") {
      document.body.classList.remove("beer-view-active");
      beerListView?.classList.add("hidden");
      if (beerFrame) beerFrame.setAttribute("src", "");
      closeAllModals();
      return;
    }
    if (event === "SIGNED_IN" || event === "INITIAL_SESSION") void loadTileStats();
  });

  window.GdbBierShell = Object.freeze({
    open: openBierList,
    close: closeBierToDashboard,
    released: BEER_RELEASED
  });
})();
