(function () {
  "use strict";

  // Regulärer Zugang nach Datenbankprüfung und ausdrücklicher Nutzerfreigabe.
  const RUM_RELEASED = true;

  const tileRum = document.getElementById("tileRum");
  const tileStatRum = document.getElementById("tileStatRum");
  const dashboard = document.getElementById("dashboard");
  const app = document.getElementById("app");
  const rumListView = document.getElementById("rumListView");
  const rumFrame = document.getElementById("rumFrame");
  const rumViewTitle = document.getElementById("rumViewTitle");
  const rumLoginOk = document.getElementById("rumLoginOk");
  const rumMsg = document.getElementById("rumMsg");
  const rumToolbar = document.querySelector(".rum-toolbar");
  const rumCount = document.getElementById("rumCount");
  const rumSearch = document.getElementById("rumSearch");
  const rumSort = document.getElementById("rumSort");
  const rumSortDir = document.getElementById("rumSortDir");
  const rumFilterMenu = document.getElementById("rumFilterMenu");
  const rumFilterSummary = document.getElementById("rumFilterSummary");
  const rumFilterOwnStock = document.getElementById("rumFilterOwnStock");
  const rumFilterCollector = document.getElementById("rumFilterCollector");
  const rumFilterIncomplete = document.getElementById("rumFilterIncomplete");
  const rumFilterWishlist = document.getElementById("rumFilterWishlist");
  const rumFilterWithoutImage = document.getElementById("rumFilterWithoutImage");
  const rumCompareStock = document.getElementById("rumCompareStock");
  const btnRumList = document.getElementById("btnRumList");
  const btnNewRum = document.getElementById("btnNewRum");
  const backToDashFromRumBtn = document.getElementById("backToDashFromRumBtn");

  const rumPliModal = document.getElementById("rumPliModal");
  const rumRatingsModal = document.getElementById("rumRatingsModal");
  const rumRatingsTitle = document.getElementById("rumRatingsModalTitle");
  const rumRatingsBody = document.getElementById("rumRatingsModalContent");
  const rumStocksModal = document.getElementById("rumStocksModal");
  const rumStocksTitle = document.getElementById("rumStocksTitle");
  const rumStocksBody = document.getElementById("rumStocksBody");
  const rumCompareStockModal = document.getElementById("rumCompareStockModal");
  const rumCompareStockUserList = document.getElementById("rumCompareStockUserList");

  let rumView = "list";
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

  function setRumMessage(text = "", kind = "hint") {
    if (!rumMsg) return;
    rumMsg.textContent = text;
    rumMsg.className = text ? kind : "";
    rumMsg.style.display = text ? "block" : "none";
  }

  function setTitle(text) {
    if (rumViewTitle) rumViewTitle.textContent = text || "Rum";
  }

  function setToolbarVisible(visible) {
    if (rumToolbar) rumToolbar.style.display = visible ? "" : "none";
  }

  function ensureRumToolbarPlacement() {
    if (!rumToolbar || !rumListView) return;

    const titleCard = rumListView.querySelector(".card");

    if (titleCard) {
      const alreadyPlaced =
        rumToolbar.parentElement === rumListView &&
        rumToolbar.previousElementSibling === titleCard;

      if (alreadyPlaced) return;

      titleCard.insertAdjacentElement("afterend", rumToolbar);
      return;
    }

    rumListView.appendChild(rumToolbar);
  }

  function postToRumFrame(message) {
    rumFrame?.contentWindow?.postMessage(message, "*");
  }

  function updateFilterSummary() {
    const activeCount = [
      rumFilterOwnStock,
      rumFilterCollector,
      rumFilterIncomplete,
      rumFilterWishlist,
      rumFilterWithoutImage
    ].filter((input) => !!input?.checked).length;
    if (rumFilterSummary) rumFilterSummary.textContent = activeCount ? `Filter (${activeCount})` : "Filter";
    if (rumFilterMenu) rumFilterMenu.dataset.active = activeCount ? "true" : "false";
  }

  function syncToolbar() {
    postToRumFrame({ type: "gdb-rum-set-search", value: rumSearch?.value || "" });
    postToRumFrame({
      type: "gdb-rum-set-sort",
      value: {
        mode: rumSort?.value || "updated",
        dir: rumSortDir?.dataset.dir || "desc"
      }
    });
    postToRumFrame({
      type: "gdb-rum-set-filters",
      value: {
        ownStock: !!rumFilterOwnStock?.checked,
        collector: !!rumFilterCollector?.checked,
        incomplete: !!rumFilterIncomplete?.checked,
        wishlist: !!rumFilterWishlist?.checked,
        withoutImage: !!rumFilterWithoutImage?.checked
      }
    });
    postToRumFrame({
      type: "gdb-rum-set-compare-stock",
      value: {
        enabled: !!(rumCompareStock?.checked && selectedCompareUserId),
        userId: selectedCompareUserId || null
      }
    });
  }

  function resetToolbar() {
    if (rumSearch) rumSearch.value = "";
    if (rumSort) rumSort.value = "updated";
    if (rumSortDir) {
      rumSortDir.dataset.dir = "desc";
      rumSortDir.textContent = "↓";
      rumSortDir.setAttribute("aria-label", "Sortierreihenfolge absteigend");
    }
    if (rumFilterOwnStock) rumFilterOwnStock.checked = false;
    if (rumFilterCollector) rumFilterCollector.checked = false;
    if (rumFilterIncomplete) rumFilterIncomplete.checked = false;
    if (rumFilterWishlist) rumFilterWishlist.checked = false;
    if (rumFilterWithoutImage) rumFilterWithoutImage.checked = false;
    if (rumFilterMenu) rumFilterMenu.open = false;
    updateFilterSummary();
    if (rumCompareStock) rumCompareStock.checked = false;
    if (rumCount) rumCount.textContent = "0 Rums";
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
    if (!rumLoginOk) return;
    const user = getCurrentUser();
    const name = (user?.display_name || user?.username || "").trim();
    rumLoginOk.textContent = name ? `Angemeldet als: ${name}` : "Angemeldet";
  }

  let tileStatsKey = null;
  let tileStatsRequestId = 0;

  async function loadTileStats() {
    const userId = getCurrentUser()?.id;
    if (!RUM_RELEASED || !tileStatRum || !window.supabaseClient || !userId) return;
    const canRead = !!window.GdbPermissions?.hasPermission?.("rum", "read");
    const key = `${userId}:${canRead}`;
    if (tileStatsKey === key) return;
    tileStatsKey = key;
    const requestId = ++tileStatsRequestId;
    const isCurrent = () => requestId === tileStatsRequestId && getCurrentUser()?.id === userId;
    try {
      if (!canRead) {
        tileStatRum.textContent = "kein Zugriff";
        return;
      }
      const { count, error: countError } = await window.supabaseClient
        .from("gdb_rums")
        .select("id", { count: "exact", head: true });
      if (countError) throw countError;
      if (!isCurrent()) return;
      const { data, error } = await window.supabaseClient.from("gdb_rums").select("country");
      if (error) throw error;
      if (!isCurrent()) return;
      const countries = new Set((data || []).map((row) => (row.country || "").trim()).filter(Boolean));
      const rumCountValue = Number(count) || 0;
      const rumText = rumCountValue === 1 ? "1 Rum" : `${rumCountValue} Rums`;
      const countryText = countries.size === 1 ? "einem Land" : `${countries.size} Ländern`;
      tileStatRum.textContent = `${rumText} aus ${countryText}`;
    } catch (error) {
      if (!isCurrent()) return;
      tileStatsKey = null;
      console.error("Rum-Stats konnten nicht geladen werden:", error);
      tileStatRum.textContent = "Stats nicht verfügbar";
    }
  }

  function loadRumListFrame() {
    if (!rumFrame) return;
    ensureRumToolbarPlacement();
    const uid = encodeURIComponent(getCurrentUser()?.id || "");
    rumFrame.onload = syncToolbar;
    rumFrame.src = `views/rum/gdb_rum.html?uid=${uid}&t=${Date.now()}`;
    rumView = "list";
    setTitle("Rum");
    setToolbarVisible(true);
  }

  async function openRumList() {
    if (!RUM_RELEASED) {
      if (tileStatRum) tileStatRum.textContent = "folgt nach Datenbankfreigabe";
      return false;
    }
    if (!getCurrentUser()) return false;

    try {
      await refreshPermissions();
    } catch (error) {
      console.error(error);
      return false;
    }
    if (!window.GdbPermissions?.requirePermission?.("rum", "read")) return false;

    document.body.classList.add("rum-view-active");
    if (dashboard) dashboard.style.display = "none";
    if (app) app.style.display = "none";
    rumListView?.classList.remove("hidden");
    showLoginName();
    resetToolbar();
    setRumMessage("");
    loadRumListFrame();
    await loadCompareUsers();
    return true;
  }

  function closeRumToDashboard() {
    document.body.classList.remove("rum-view-active");
    rumListView?.classList.add("hidden");
    if (rumFrame) {
      rumFrame.onload = null;
      rumFrame.setAttribute("src", "");
    }
    if (dashboard) dashboard.style.display = "block";
    if (app) app.style.display = "block";
    rumView = "list";
    setTitle("Rum");
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
    [rumPliModal, rumRatingsModal, rumStocksModal, rumCompareStockModal].forEach(closeModal);
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
    if (!rumCompareStockUserList) return;
    if (!compareUsers.length) {
      rumCompareStockUserList.innerHTML = '<div class="muted">Keine weiteren Nutzer gefunden.</div>';
      return;
    }
    rumCompareStockUserList.innerHTML = compareUsers.map((user) => {
      const checked = selectedCompareUserId === user.id ? "checked" : "";
      const active = selectedCompareUserId === user.id ? " active" : "";
      const label = escapeHtml((user.display_name || user.username || "Unbekannt").trim());
      return `<label class="compare-stock-user-item${active}" data-user-id="${escapeHtml(user.id)}">
        <input type="radio" name="rumCompareStockUser" value="${escapeHtml(user.id)}" ${checked}>
        <span>${label}</span>
      </label>`;
    }).join("");
  }

  function openDetail(data) {
    setToolbarVisible(false);
    rumView = "detail";
    setTitle("Rum – Detailkarte");
    rumFrame.src =
      `views/rum/gdb_rum_detail.html?id=${encodeURIComponent(data.id)}` +
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

  tileRum?.addEventListener("click", (event) => {
    event.preventDefault();
    void openRumList();
  });

  backToDashFromRumBtn?.addEventListener("click", () => {
    if (rumView === "detail") loadRumListFrame();
    else closeRumToDashboard();
  });

  rumSearch?.addEventListener("input", () => {
    postToRumFrame({ type: "gdb-rum-set-search", value: rumSearch.value || "" });
  });

  rumSort?.addEventListener("change", syncToolbar);
  rumFilterOwnStock?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  rumFilterCollector?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  rumFilterIncomplete?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  rumFilterWishlist?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  rumFilterWithoutImage?.addEventListener("change", () => {
    updateFilterSummary();
    syncToolbar();
  });
  rumSortDir?.addEventListener("click", () => {
    const next = rumSortDir.dataset.dir === "desc" ? "asc" : "desc";
    rumSortDir.dataset.dir = next;
    rumSortDir.textContent = next === "desc" ? "↓" : "↑";
    rumSortDir.setAttribute("aria-label", next === "desc" ? "Sortierreihenfolge absteigend" : "Sortierreihenfolge aufsteigend");
    syncToolbar();
  });

  btnRumList?.addEventListener("click", () => {
    resetToolbar();
    syncToolbar();
  });

  btnNewRum?.addEventListener("click", () => {
    setRumMessage("");
    if (!window.GdbPermissions?.requirePermission?.("rum", "create")) return;
    setToolbarVisible(false);
    rumView = "detail";
    setTitle("Rum – Neuer Eintrag");
    rumFrame.src = `views/rum/gdb_rum_create.html?t=${Date.now()}`;
  });

  rumCompareStock?.addEventListener("change", async () => {
    if (!rumCompareStock.checked) {
      selectedCompareUserId = null;
      syncToolbar();
      return;
    }
    if (!compareUsers.length) await loadCompareUsers();
    openModal(rumCompareStockModal);
  });

  rumCompareStockUserList?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.name !== "rumCompareStockUser") return;
    selectedCompareUserId = target.value || null;
    renderCompareUsers();
  });

  document.getElementById("rumCompareStockApplyBtn")?.addEventListener("click", () => {
    if (rumCompareStock) rumCompareStock.checked = !!selectedCompareUserId;
    closeModal(rumCompareStockModal);
    syncToolbar();
  });

  document.getElementById("rumCompareStockCancelBtn")?.addEventListener("click", () => {
    if (rumCompareStock) rumCompareStock.checked = false;
    selectedCompareUserId = null;
    closeModal(rumCompareStockModal);
    syncToolbar();
  });

  document.getElementById("rumPliCloseBtn")?.addEventListener("click", () => closeModal(rumPliModal));
  document.getElementById("rumRatingsCloseBtn")?.addEventListener("click", () => closeModal(rumRatingsModal));
  document.getElementById("rumStocksCloseBtn")?.addEventListener("click", () => closeModal(rumStocksModal));
  document.querySelectorAll("[data-close-rum-modal]").forEach((element) => {
    element.addEventListener("click", () => closeModal(document.getElementById(element.dataset.closeRumModal)));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAllModals();
      if (rumFilterMenu) rumFilterMenu.open = false;
    }
  });

  document.addEventListener("click", (event) => {
    if (rumFilterMenu?.open && !rumFilterMenu.contains(event.target)) {
      rumFilterMenu.open = false;
    }
  });

  window.addEventListener("message", (event) => {
    if (!rumFrame || event.source !== rumFrame.contentWindow) return;
    const data = event.data || {};
    if (data.type === "gdb-rum-set-title") {
      setTitle(data.value || "Rum");
      return;
    }
    if (data.type === "gdb-rum-count") {
      const count = Number(data.count);
      const safe = Number.isNaN(count) ? 0 : count;
      if (rumCount) rumCount.textContent = safe === 1 ? "1 Rum" : `${safe} Rums`;
      return;
    }
    if (data.type === "gdb-rum-nav") {
      if (data.view === "rumDetail" && data.id) openDetail(data);
      else if (data.view === "rumList") {
        loadRumListFrame();
        setRumMessage(data.message || "", data.message ? "err" : "hint");
      }
      else if (data.view === "home") closeRumToDashboard();
      return;
    }
    if (data.type === "gdb-rum-open-pli") {
      openModal(rumPliModal);
      return;
    }
    if (data.type === "gdb-rum-open-ratings") {
      if (rumRatingsTitle) rumRatingsTitle.innerHTML = data.title || "Alle Bewertungen";
      if (rumRatingsBody) rumRatingsBody.innerHTML = data.html || "";
      openModal(rumRatingsModal);
      return;
    }
    if (data.type === "gdb-rum-open-stocks") {
      if (rumStocksTitle) rumStocksTitle.innerHTML = data.title || "Bestände";
      if (rumStocksBody) rumStocksBody.innerHTML = data.html || "";
      openModal(rumStocksModal);
    }
  });

  window.addEventListener("gdb-permissions-loaded", (event) => {
    if (!RUM_RELEASED) return;
    if (!event.detail?.userId || event.detail.userId !== getCurrentUser()?.id) return;
    if (event.detail.error) {
      tileStatsKey = null;
      ++tileStatsRequestId;
      if (tileStatRum) tileStatRum.textContent = "Stats nicht verfügbar";
      return;
    }
    void loadTileStats();
  });

  window.supabaseClient?.auth?.onAuthStateChange?.((event) => {
    if (event === "SIGNED_OUT") {
      tileStatsKey = null;
      ++tileStatsRequestId;
      if (tileStatRum) tileStatRum.textContent = RUM_RELEASED ? "Lade Daten…" : "folgt nach Datenbankfreigabe";
      document.body.classList.remove("rum-view-active");
      rumListView?.classList.add("hidden");
      if (rumFrame) rumFrame.setAttribute("src", "");
      closeAllModals();
      return;
    }
    // Kachelzahlen erst nach dem App-Nutzerprofil und den geladenen Rechten abrufen.
  });

  window.GdbRumShell = Object.freeze({
    open: openRumList,
    close: closeRumToDashboard,
    released: RUM_RELEASED
  });
})();
