(function () {
  "use strict";

  // Nach ausgeführter Datenbankmigration und vollständigem E2E-Test freigegeben.
  const GIN_RELEASED = true;

  const tileGin = document.getElementById("tileGin");
  const tileStatGin = document.getElementById("tileStatGin");
  const dashboard = document.getElementById("dashboard");
  const app = document.getElementById("app");
  const ginListView = document.getElementById("ginListView");
  const ginFrame = document.getElementById("ginFrame");
  const ginViewTitle = document.getElementById("ginViewTitle");
  const ginLoginOk = document.getElementById("ginLoginOk");
  const ginMsg = document.getElementById("ginMsg");
  const ginToolbar = document.querySelector(".gin-toolbar");
  const ginCount = document.getElementById("ginCount");
  const ginSearch = document.getElementById("ginSearch");
  const ginSort = document.getElementById("ginSort");
  const ginSortDir = document.getElementById("ginSortDir");
  const ginFilterMenu = document.getElementById("ginFilterMenu");
  const ginFilterSummary = document.getElementById("ginFilterSummary");
  const ginFilterOwnStock = document.getElementById("ginFilterOwnStock");
  const ginFilterCollector = document.getElementById("ginFilterCollector");
  const ginFilterIncomplete = document.getElementById("ginFilterIncomplete");
  const ginFilterWishlist = document.getElementById("ginFilterWishlist");
  const ginFilterWithoutImage = document.getElementById("ginFilterWithoutImage");
  const ginCompareStock = document.getElementById("ginCompareStock");
  const btnGinList = document.getElementById("btnGinList");
  const btnNewGin = document.getElementById("btnNewGin");
  const backToDashFromGinBtn = document.getElementById("backToDashFromGinBtn");

  const ginPliModal = document.getElementById("ginPliModal");
  const ginRatingsModal = document.getElementById("ginRatingsModal");
  const ginRatingsTitle = document.getElementById("ginRatingsModalTitle");
  const ginRatingsBody = document.getElementById("ginRatingsModalContent");
  const ginStocksModal = document.getElementById("ginStocksModal");
  const ginStocksTitle = document.getElementById("ginStocksTitle");
  const ginStocksBody = document.getElementById("ginStocksBody");
  const ginCompareStockModal = document.getElementById("ginCompareStockModal");
  const ginCompareStockUserList = document.getElementById("ginCompareStockUserList");

  let ginView = "list";
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

  function setGinMessage(text = "", kind = "hint") {
    if (!ginMsg) return;
    ginMsg.textContent = text;
    ginMsg.className = text ? kind : "";
    ginMsg.style.display = text ? "block" : "none";
  }

  function setTitle(text) {
    if (ginViewTitle) ginViewTitle.textContent = text || "Gin";
  }

  function setToolbarVisible(visible) {
    if (ginToolbar) ginToolbar.style.display = visible ? "" : "none";
  }

  function ensureGinToolbarPlacement() {
    if (!ginToolbar || !ginListView) return;

    const titleCard = ginListView.querySelector(".card");

    if (titleCard) {
      const alreadyPlaced =
        ginToolbar.parentElement === ginListView &&
        ginToolbar.previousElementSibling === titleCard;

      if (alreadyPlaced) return;

      titleCard.insertAdjacentElement("afterend", ginToolbar);
      return;
    }

    ginListView.appendChild(ginToolbar);
  }

  function postToGinFrame(message) {
    ginFrame?.contentWindow?.postMessage(message, "*");
  }

  function updateFilterSummary() {
    const activeCount = [
      ginFilterOwnStock,
      ginFilterCollector,
      ginFilterIncomplete,
      ginFilterWishlist,
      ginFilterWithoutImage
    ].filter((input) => !!input?.checked).length;
    if (ginFilterSummary) ginFilterSummary.textContent = activeCount ? `Filter (${activeCount})` : "Filter";
    if (ginFilterMenu) ginFilterMenu.dataset.active = activeCount ? "true" : "false";
  }

  function syncToolbar() {
    postToGinFrame({ type: "gdb-gin-set-search", value: ginSearch?.value || "" });
    postToGinFrame({
      type: "gdb-gin-set-sort",
      value: {
        mode: ginSort?.value || "updated",
        dir: ginSortDir?.dataset.dir || "desc"
      }
    });
    postToGinFrame({
      type: "gdb-gin-set-filters",
      value: {
        ownStock: !!ginFilterOwnStock?.checked,
        collector: !!ginFilterCollector?.checked,
        incomplete: !!ginFilterIncomplete?.checked,
        wishlist: !!ginFilterWishlist?.checked,
        withoutImage: !!ginFilterWithoutImage?.checked
      }
    });
    postToGinFrame({
      type: "gdb-gin-set-compare-stock",
      value: {
        enabled: !!(ginCompareStock?.checked && selectedCompareUserId),
        userId: selectedCompareUserId || null
      }
    });
  }

  function resetToolbar() {
    if (ginSearch) ginSearch.value = "";
    if (ginSort) ginSort.value = "updated";
    if (ginSortDir) {
      ginSortDir.dataset.dir = "desc";
      ginSortDir.textContent = "↓";
      ginSortDir.setAttribute("aria-label", "Sortierreihenfolge absteigend");
    }
    if (ginFilterOwnStock) ginFilterOwnStock.checked = false;
    if (ginFilterCollector) ginFilterCollector.checked = false;
    if (ginFilterIncomplete) ginFilterIncomplete.checked = false;
    if (ginFilterWishlist) ginFilterWishlist.checked = false;
    if (ginFilterWithoutImage) ginFilterWithoutImage.checked = false;
    if (ginFilterMenu) ginFilterMenu.open = false;
    updateFilterSummary();
    if (ginCompareStock) ginCompareStock.checked = false;
    if (ginCount) ginCount.textContent = "0 Gins";
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
    if (!ginLoginOk) return;
    const user = getCurrentUser();
    const name = (user?.display_name || user?.username || "").trim();
    ginLoginOk.textContent = name ? `Angemeldet als: ${name}` : "Angemeldet";
  }

  async function loadTileStats() {
    if (!GIN_RELEASED || !tileStatGin || !window.supabaseClient || !getCurrentUser()) return;
    try {
      await refreshPermissions();
      if (!window.GdbPermissions?.hasPermission?.("gin", "read")) {
        tileStatGin.textContent = "kein Zugriff";
        return;
      }
      const { count, error: countError } = await window.supabaseClient
        .from("gdb_gins")
        .select("id", { count: "exact", head: true });
      if (countError) throw countError;
      const { data, error } = await window.supabaseClient.from("gdb_gins").select("country");
      if (error) throw error;
      const countries = new Set((data || []).map((row) => (row.country || "").trim()).filter(Boolean));
      const ginCountValue = Number(count) || 0;
      const ginText = ginCountValue === 1 ? "1 Gin" : `${ginCountValue} Gins`;
      const countryText = countries.size === 1 ? "einem Land" : `${countries.size} Ländern`;
      tileStatGin.textContent = `${ginText} aus ${countryText}`;
    } catch (error) {
      console.error("Gin-Stats konnten nicht geladen werden:", error);
      tileStatGin.textContent = "Stats nicht verfügbar";
    }
  }

  function loadGinListFrame() {
    if (!ginFrame) return;
    ensureGinToolbarPlacement();
    const uid = encodeURIComponent(getCurrentUser()?.id || "");
    ginFrame.onload = syncToolbar;
    ginFrame.src = `views/gin/gdb_gin.html?uid=${uid}&t=${Date.now()}`;
    ginView = "list";
    setTitle("Gin");
    setToolbarVisible(true);
  }

  async function openGinList(options = {}) {
    const preview = options.preview === true;
    if (!GIN_RELEASED && !preview) {
      if (tileStatGin) tileStatGin.textContent = "folgt nach Datenbankfreigabe";
      return false;
    }
    if (!getCurrentUser()) return false;

    try {
      await refreshPermissions();
    } catch (error) {
      console.error(error);
      return false;
    }
    if (!window.GdbPermissions?.requirePermission?.("gin", "read")) return false;

    document.body.classList.add("gin-view-active");
    if (dashboard) dashboard.style.display = "none";
    if (app) app.style.display = "none";
    ginListView?.classList.remove("hidden");
    showLoginName();
    resetToolbar();
    setGinMessage("");
    loadGinListFrame();
    await loadCompareUsers();
    return true;
  }

  function closeGinToDashboard() {
    document.body.classList.remove("gin-view-active");
    ginListView?.classList.add("hidden");
    if (ginFrame) {
      ginFrame.onload = null;
      ginFrame.setAttribute("src", "");
    }
    if (dashboard) dashboard.style.display = "block";
    if (app) app.style.display = "block";
    ginView = "list";
    setTitle("Gin");
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
    [ginPliModal, ginRatingsModal, ginStocksModal, ginCompareStockModal].forEach(closeModal);
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
    if (!ginCompareStockUserList) return;
    if (!compareUsers.length) {
      ginCompareStockUserList.innerHTML = '<div class="muted">Keine weiteren Nutzer gefunden.</div>';
      return;
    }
    ginCompareStockUserList.innerHTML = compareUsers.map((user) => {
      const checked = selectedCompareUserId === user.id ? "checked" : "";
      const active = selectedCompareUserId === user.id ? " active" : "";
      const label = escapeHtml((user.display_name || user.username || "Unbekannt").trim());
      return `<label class="compare-stock-user-item${active}" data-user-id="${escapeHtml(user.id)}">
        <input type="radio" name="ginCompareStockUser" value="${escapeHtml(user.id)}" ${checked}>
        <span>${label}</span>
      </label>`;
    }).join("");
  }

  function openDetail(data) {
    setToolbarVisible(false);
    ginView = "detail";
    setTitle("Gin – Detailkarte");
    ginFrame.src =
      `views/gin/gdb_gin_detail.html?id=${encodeURIComponent(data.id)}` +
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
      `&myWishlist=${encodeURIComponent(data.myWishlist ?? "")}` +
      `&created_at=${encodeURIComponent(data.created_at ?? "")}` +
      `&updated_at=${encodeURIComponent(data.updated_at ?? "")}` +
      `&created_by=${encodeURIComponent(data.created_by ?? "")}` +
      `&updated_by=${encodeURIComponent(data.updated_by ?? "")}` +
      `&my_created_at=${encodeURIComponent(data.my_created_at ?? "")}` +
      `&my_updated_at=${encodeURIComponent(data.my_updated_at ?? "")}`;
  }

  tileGin?.addEventListener("click", (event) => {
    event.preventDefault();
    void openGinList();
  });

  backToDashFromGinBtn?.addEventListener("click", () => {
    if (ginView === "detail") loadGinListFrame();
    else closeGinToDashboard();
  });

  ginSearch?.addEventListener("input", () => {
    postToGinFrame({ type: "gdb-gin-set-search", value: ginSearch.value || "" });
  });

  ginSort?.addEventListener("change", syncToolbar);
  ginFilterOwnStock?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  ginFilterCollector?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  ginFilterIncomplete?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  ginFilterWishlist?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  ginFilterWithoutImage?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  ginSortDir?.addEventListener("click", () => {
    const next = ginSortDir.dataset.dir === "desc" ? "asc" : "desc";
    ginSortDir.dataset.dir = next;
    ginSortDir.textContent = next === "desc" ? "↓" : "↑";
    ginSortDir.setAttribute("aria-label", next === "desc" ? "Sortierreihenfolge absteigend" : "Sortierreihenfolge aufsteigend");
    syncToolbar();
  });

  btnGinList?.addEventListener("click", () => {
    resetToolbar();
    syncToolbar();
  });

  btnNewGin?.addEventListener("click", () => {
    setGinMessage("");
    if (!window.GdbPermissions?.requirePermission?.("gin", "create")) return;
    setToolbarVisible(false);
    ginView = "detail";
    setTitle("Gin – Neuer Eintrag");
    ginFrame.src = `views/gin/gdb_gin_create.html?t=${Date.now()}`;
  });

  ginCompareStock?.addEventListener("change", async () => {
    if (!ginCompareStock.checked) {
      selectedCompareUserId = null;
      syncToolbar();
      return;
    }
    if (!compareUsers.length) await loadCompareUsers();
    openModal(ginCompareStockModal);
  });

  ginCompareStockUserList?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.name !== "ginCompareStockUser") return;
    selectedCompareUserId = target.value || null;
    renderCompareUsers();
  });

  document.getElementById("ginCompareStockApplyBtn")?.addEventListener("click", () => {
    if (ginCompareStock) ginCompareStock.checked = !!selectedCompareUserId;
    closeModal(ginCompareStockModal);
    syncToolbar();
  });

  document.getElementById("ginCompareStockCancelBtn")?.addEventListener("click", () => {
    if (ginCompareStock) ginCompareStock.checked = false;
    selectedCompareUserId = null;
    closeModal(ginCompareStockModal);
    syncToolbar();
  });

  document.getElementById("ginPliCloseBtn")?.addEventListener("click", () => closeModal(ginPliModal));
  document.getElementById("ginRatingsCloseBtn")?.addEventListener("click", () => closeModal(ginRatingsModal));
  document.getElementById("ginStocksCloseBtn")?.addEventListener("click", () => closeModal(ginStocksModal));
  document.querySelectorAll("[data-close-gin-modal]").forEach((element) => {
    element.addEventListener("click", () => closeModal(document.getElementById(element.dataset.closeGinModal)));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
      if (ginFilterMenu) ginFilterMenu.open = false;
    }
  });

  document.addEventListener("click", (event) => {
    if (ginFilterMenu?.open && !ginFilterMenu.contains(event.target)) {
      ginFilterMenu.open = false;
    }
  });

  window.addEventListener("message", (event) => {
    if (!ginFrame || event.source !== ginFrame.contentWindow) return;
    const data = event.data || {};
    if (data.type === "gdb-gin-set-title") {
      setTitle(data.value || "Gin");
      return;
    }
    if (data.type === "gdb-gin-count") {
      const count = Number(data.count);
      const safe = Number.isNaN(count) ? 0 : count;
      if (ginCount) ginCount.textContent = safe === 1 ? "1 Gin" : `${safe} Gins`;
      return;
    }
    if (data.type === "gdb-gin-nav") {
      if (data.view === "ginDetail" && data.id) openDetail(data);
      else if (data.view === "ginList") loadGinListFrame();
      else if (data.view === "home") closeGinToDashboard();
      return;
    }
    if (data.type === "gdb-gin-open-pli") {
      openModal(ginPliModal);
      return;
    }
    if (data.type === "gdb-gin-open-ratings") {
      if (ginRatingsTitle) ginRatingsTitle.innerHTML = data.title || "Alle Bewertungen";
      if (ginRatingsBody) ginRatingsBody.innerHTML = data.html || "";
      openModal(ginRatingsModal);
      return;
    }
    if (data.type === "gdb-gin-open-stocks") {
      if (ginStocksTitle) ginStocksTitle.innerHTML = data.title || "Bestände";
      if (ginStocksBody) ginStocksBody.innerHTML = data.html || "";
      openModal(ginStocksModal);
    }
  });

  window.supabaseClient?.auth?.onAuthStateChange?.((event) => {
    if (event === "SIGNED_OUT") {
      document.body.classList.remove("gin-view-active");
      ginListView?.classList.add("hidden");
      if (ginFrame) ginFrame.setAttribute("src", "");
      closeAllModals();
      return;
    }
    if (event === "SIGNED_IN" || event === "INITIAL_SESSION") void loadTileStats();
  });

  window.GdbGinShell = Object.freeze({
    open: openGinList,
    close: closeGinToDashboard,
    released: GIN_RELEASED
  });
})();
