// ==========================================================
    // 1) SUPABASE KONFIG (gemeinsamer angemeldeter App-Client)
    // ==========================================================
  const appSupabase = window.parent?.supabaseClient || window.supabaseClient;
  const SUPABASE_URL = appSupabase?.supabaseUrl || '';
  const SUPABASE_ANON_KEY = appSupabase?.supabaseKey || '';

    const supabase = appSupabase;

    // User-ID der aktuellen Anmeldung auslesen
    const CURRENT_UID = window.parent?.currentUser?.id || null;

    // User-spezifische Daten (Stock) werden nachgeladen und gemappt
    let MY_STOCK_BY_ID = new Map();       // cigar_id -> stock (Zigarren) vom eingeloggten User
    let OTHERS_STOCK_BY_ID = new Map();   // cigar_id -> stock-Summe (Zigarren) aller anderen

    // User-spezifische Daten (Rating) werden nachgeladen und gemappt
    let MY_RATING_BY_ID = new Map();
    let AVG_RATING_BY_ID = new Map();   // cigar_id -> avg (0..10)
    let CNT_RATING_BY_ID = new Map();   // cigar_id -> count

    // User-spezifische Daten (PLI)
    let MY_PLI_BY_ID = new Map();
    let AVG_PLI_BY_ID = new Map();
    let CNT_PLI_BY_ID = new Map();

    // Alle Bestände pro Cigar (für Infobox)
    let STOCKS_BY_ID = new Map();      // cigar_id -> [{ user_id, stock }]

    // Bewertungen pro Cigar (für Infobox)
    let RATINGS_BY_ID = new Map(); // cigar_id -> Array<{ user_id, rating }>
    let USER_NAME_BY_ID = new Map(); // user_id -> display_name

    // Cigar-Name nach ID (für Parent-Popup-Titel)
    let CIGAR_NAME_BY_ID = new Map(); // cigar_id -> name

    // PLI Min/Max Index (für Skala in Cigar Karte)
    let PLI_MIN = null;
    let PLI_MAX = null;

    //  User-spezifische Notizen
    let MY_NOTES_BY_ID = new Map();

    //  User-spezifische Farbe
    let MY_COLOR_BY_ID = new Map();

    //  User-spezifischer Geruch
    let MY_NOSE_BY_ID = new Map();

    //  User-spezifischer Geschmack
    let MY_PALATE_BY_ID = new Map();

    // User-spezifischer Finish
    let MY_FINISH_BY_ID = new Map();

    // User-spezifische Zusammenfassung
    let MY_SUMMARY_BY_ID = new Map();

    // User-spezifische Trinkgelegenheit
    let MY_TRINKGELEGENHEIT_BY_ID = new Map();

    let MY_WISHLIST_BY_ID = new Map();
    let MY_EXTRA_TASTING_BY_ID = new Map();

    // cigar_id -> { created_at, updated_at }
    let CIGAR_META_BY_ID = new Map();

    // cigar_id -> created_at / updated_at (für Detail-View)
    let CIGAR_CREATED_AT_BY_ID = new Map();
    let CIGAR_UPDATED_AT_BY_ID = new Map();

    // cigar_id -> created_by / updated_by (für Detail-View)
    let CIGAR_CREATED_BY_BY_ID = new Map();
    let CIGAR_UPDATED_BY_BY_ID = new Map();

    // cigar_id -> my_created_at / my_updated_at (für Detail-View)
    let MY_CREATED_AT_BY_CIGAR_ID = new Map();
    let MY_UPDATED_AT_BY_CIGAR_ID = new Map();

    // Listenzustand (Toolbar / Filter)
    let ALL_CIGARS = [];
    let CURRENT_SEARCH_TERM = "";
    let CURRENT_SORT_MODE = "name";
    let CURRENT_SORT_DIRECTION = "asc";
    let CURRENT_FILTER_OWN_STOCK = false;
    let CURRENT_FILTER_COLLECTOR = false;
    let CURRENT_FILTER_INCOMPLETE = false;
    let CURRENT_FILTER_WISHLIST = false;
    let CURRENT_FILTER_WITHOUT_IMAGE = false;
    let CURRENT_COMPARE_STOCK = false;
    let CURRENT_COMPARE_USER_ID = null;

    // ==========================================================
    // 2) THEME (minimal: Default dunkel, optional umstellbar später)
    // ==========================================================
    (function initTheme(){
      const saved = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const useDark = saved ? (saved === "dark") : (prefersDark || true);
      document.body.classList.toggle("dark", useDark);
    })();

    // Parent benachrichtigen bei Popup-Öffnung/Schließung
    function notifyParentPopupOpen(){
      window.parent?.postMessage({ type: "gdb-cigar-popup-open" }, "*");
    }

    function notifyParentPopupClose(){
      window.parent?.postMessage({ type: "gdb-cigar-popup-close" }, "*");
    }

    function getAppBasePath() {
      const path = window.location.pathname || "";
      const repoSegment = "/Genussbibliothek/";
      if (window.location.hostname.includes("github.io") && path.includes(repoSegment)) {
        return repoSegment;
      }
      return "/";
    }

    const DEFAULT_IMAGE_URL = `${getAppBasePath()}img/fallback_image.jpg`;
    // ==========================================================
    // 3) HELFER: Sterne, Durchschnitt, Stock-Farbe
    // ==========================================================

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

    function escapeHtml(s){
      return s
        ? String(s).replace(/[&<>"']/g, c =>
            ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])
          )
        : '';
    }

    function notifyParentCigarCount(count) {
      window.parent?.postMessage({ type: "gdb-cigar-count", count }, "*");
    }

    function getFilteredAndSortedList(list) {
    const search = (CURRENT_SEARCH_TERM || "").trim().toLowerCase();
    const terms = search.split(/\s+/).filter(Boolean);
      let result = Array.isArray(list) ? [...list] : [];

      if (terms.length) {
        result = result.filter((w) => {
          const haystack = [
            w.name,
            w.brand,
            w.manufacturer,
            w.country,
            w.region,
            w.wrapper,
            w.vitola,w.binder,w.filler,w.strength,w.edition_batch, w.series, w.filler,
            MY_NOTES_BY_ID.get(w.id), ...Object.values(MY_EXTRA_TASTING_BY_ID.get(w.id) || {}),
            MY_COLOR_BY_ID.get(w.id),
            MY_NOSE_BY_ID.get(w.id),
            MY_PALATE_BY_ID.get(w.id),
            MY_FINISH_BY_ID.get(w.id),
            MY_SUMMARY_BY_ID.get(w.id),
            MY_TRINKGELEGENHEIT_BY_ID.get(w.id)
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return terms.every(term => haystack.includes(term));
        });
      }

      if (CURRENT_FILTER_OWN_STOCK) {
        result = result.filter((w) => Number(MY_STOCK_BY_ID.get(w.id) ?? 0) > 0);
      }

      if (CURRENT_FILTER_COLLECTOR) {
        result = result.filter((w) => !!w.collector);
      }

      if (CURRENT_FILTER_INCOMPLETE) {
        result = result.filter((w) => !!w.provisional);
      }

      if (CURRENT_FILTER_WISHLIST) {
        result = result.filter((w) => !!MY_WISHLIST_BY_ID.get(w.id));
      }

      if (CURRENT_FILTER_WITHOUT_IMAGE) {
        result = result.filter((w) => !(w.image_url || "").trim());
      }

      if (CURRENT_COMPARE_STOCK && CURRENT_COMPARE_USER_ID) {
        result = result.filter((w) => {
          const myStock = Number(MY_STOCK_BY_ID.get(w.id) ?? 0);
          if (!(myStock > 0)) return false;

          const stockRows = STOCKS_BY_ID.get(w.id) || [];
          return stockRows.some((row) =>
            row.user_id === CURRENT_COMPARE_USER_ID && Number(row.stock ?? 0) > 0
          );
        });
      }

      const dir = CURRENT_SORT_DIRECTION === "desc" ? -1 : 1;

      if (CURRENT_SORT_MODE === "rating_avg") {
        result.sort((a, b) => {
          const av = AVG_RATING_BY_ID.get(a.id);
          const bv = AVG_RATING_BY_ID.get(b.id);
          const aVal = (av == null || Number.isNaN(Number(av))) ? -1 : Number(av);
          const bVal = (bv == null || Number.isNaN(Number(bv))) ? -1 : Number(bv);

          if (aVal !== bVal) return (aVal - bVal) * dir;
          return (a.name || "").localeCompare((b.name || ""), "de", { sensitivity: "base" }) * dir;
        });

      } else if (CURRENT_SORT_MODE === "rating_user") {
        result.sort((a, b) => {
          const av = MY_RATING_BY_ID.get(a.id);
          const bv = MY_RATING_BY_ID.get(b.id);
          const aVal = (av == null || Number.isNaN(Number(av))) ? -1 : Number(av);
          const bVal = (bv == null || Number.isNaN(Number(bv))) ? -1 : Number(bv);

          if (aVal !== bVal) return (aVal - bVal) * dir;
          return (a.name || "").localeCompare((b.name || ""), "de", { sensitivity: "base" }) * dir;
        });

      } else if (CURRENT_SORT_MODE === "pli_avg") {
        result.sort((a, b) => {
          const av = AVG_PLI_BY_ID.get(a.id);
          const bv = AVG_PLI_BY_ID.get(b.id);
          const aVal = (av == null || Number.isNaN(Number(av))) ? -1 : Number(av);
          const bVal = (bv == null || Number.isNaN(Number(bv))) ? -1 : Number(bv);

          if (aVal !== bVal) return (aVal - bVal) * dir;
          return (a.name || "").localeCompare((b.name || ""), "de", { sensitivity: "base" }) * dir;
        });

      } else if (CURRENT_SORT_MODE === "pli_user") {
        result.sort((a, b) => {
          const av = MY_PLI_BY_ID.get(a.id);
          const bv = MY_PLI_BY_ID.get(b.id);
          const aVal = (av == null || Number.isNaN(Number(av))) ? -1 : Number(av);
          const bVal = (bv == null || Number.isNaN(Number(bv))) ? -1 : Number(bv);

          if (aVal !== bVal) return (aVal - bVal) * dir;
          return (a.name || "").localeCompare((b.name || ""), "de", { sensitivity: "base" }) * dir;
        });

      } else if (CURRENT_SORT_MODE === "price") {
        result.sort((a, b) => {
          const aVal = (a.price_eur == null || Number.isNaN(Number(a.price_eur))) ? Infinity : Number(a.price_eur);
          const bVal = (b.price_eur == null || Number.isNaN(Number(b.price_eur))) ? Infinity : Number(b.price_eur);

          if (aVal !== bVal) return (aVal - bVal) * dir;
          return (a.name || "").localeCompare((b.name || ""), "de", { sensitivity: "base" }) * dir;
        });

      } else if (CURRENT_SORT_MODE === "created") {
        result.sort((a, b) => {
          const aVal = new Date(a.created_at || 0).getTime();
          const bVal = new Date(b.created_at || 0).getTime();
          return (aVal - bVal) * dir;
        });

      } else if (CURRENT_SORT_MODE === "updated") {
        result.sort((a, b) => {
          const aVal = new Date(a.updated_at || 0).getTime();
          const bVal = new Date(b.updated_at || 0).getTime();
          return (aVal - bVal) * dir;
        });

      } else {
        result.sort((a, b) =>
          (a.name || "").localeCompare((b.name || ""), "de", { sensitivity: "base" }) * dir
        );
      }

      return result;
    }

    function rerenderCurrentList() {
      const nextList = getFilteredAndSortedList(ALL_CIGARS);
      renderList(nextList);
      notifyParentCigarCount(nextList.length);
    }    

    // PLI Skala rendern
    function renderPliScale(v) {
      if (v === null || v === undefined || v === "") return `<span class="muted">–</span>`;

      const val = Number(v);
      let pct = 50;

      if (PLI_MIN !== null && PLI_MAX !== null && PLI_MAX !== PLI_MIN) {
        const t = (val - PLI_MIN) / (PLI_MAX - PLI_MIN);
        const clamped = Math.max(0, Math.min(1, t));
        pct = clamped * 100;
      }

      return `
        <div class="pli-scale" title="PLI Skala: min/max dynamisch">
          <span class="pli-marker" style="left:${pct}%;"></span>
        </div>
      `;
    }

// ==========================================================
// 4) RENDER: Nur Listenkarte (Übersichtskarte), NICHT klickbar
// ==========================================================
function renderList(list){
  const content = document.getElementById("content");

  if(!list || !list.length){
    content.innerHTML = "<p class='muted'>Keine Einträge gefunden.</p>";
    notifyParentCigarCount(0);
    return;
  }

  const stockScaleMax = Math.max(1, ...list.flatMap(w => [Number(MY_STOCK_BY_ID.get(w.id) || 0),Number(OTHERS_STOCK_BY_ID.get(w.id) || 0)]));
  content.innerHTML = list.map(w => {
    const myRating10 = MY_RATING_BY_ID.get(w.id); // null oder 0..10

    const myPli = MY_PLI_BY_ID.get(w.id);
    const avgPli = AVG_PLI_BY_ID.get(w.id);
    const cntPli = CNT_PLI_BY_ID.get(w.id);

    const cardClass =
      (w.provisional ? "provisional" : (w.collector ? "collector" : ""));

    const imgSrc = w.thumbnail_url || w.image_url || DEFAULT_IMAGE_URL;

    // Bestand-Balken:
    // - mein Bestand: gdb_cigar_user.stock für CURRENT_UID (Zigarren)
    // - sonstige Bestände: Summe gdb_cigar_user.stock aller anderen (Zigarren)
    const bottleMl = stockScaleMax;

    const myBarMl = Math.max(0, Math.round(Number(MY_STOCK_BY_ID.get(w.id) ?? 0)));
    const friendsBarMl = Math.max(0, Math.round(Number(OTHERS_STOCK_BY_ID.get(w.id) ?? 0)));

    // Prozent (0..100) bezogen auf Flaschenvolumen
    const myBarPct = bottleMl > 0 ? Math.min(100, Math.round((myBarMl / bottleMl) * 100)) : 0;
    const friendsBarPct = bottleMl > 0 ? Math.min(100, Math.round((friendsBarMl / bottleMl) * 100)) : 0;

    const price = (w.price_eur != null && w.price_eur !== "")
      ? (Number(w.price_eur).toFixed(2) + " €")
      : "";

    const pricePerL = price ? "je Zigarre" : "";

    const countryRegion =
      `${w.country || ""}${w.region ? " – " + w.region : ""}`;

    const flagHtml = `
      ${w.flag_url ? `<img src="${w.flag_url}" alt="${escapeHtml(w.country||"")}" style="height:1em;vertical-align:middle;margin-right:3px;">` : ""}
      ${w.region && w.region_flag_url ? `<img src="${w.region_flag_url}" alt="${escapeHtml(w.region||"")}" style="height:1em;vertical-align:middle;margin-right:3px;">` : ""}
    `;

    return `
      <div class="card ${cardClass}" data-cigar-id="${w.id}">
        <div class="row cigar-row">
          <div class="cigar-img-col">
            <div class="cigar-img-wrap">
              <img loading="lazy" decoding="async" src="${imgSrc}" class="cigar-img" alt="">
            </div>

            ${w.collector ? `
              <div class="collector-badge" title="Sammlerstück / Sonderedition">
                <img src="../../img/collectors_badge.png" alt="Sammlerstück / Sonderedition" class="collector-img">
              </div>
            ` : ""}
          </div>

          <div style="flex:1">
            <div class="card-infoblock">
              <strong>${escapeHtml(w.name || "")}</strong>
              ${w.brand ? `<br>${escapeHtml(w.brand)}` : ""}
              ${w.brand && w.manufacturer ? " • " : (w.manufacturer ? "<br>" : "")}
              ${w.manufacturer ? `${escapeHtml(w.manufacturer)}` : ""}
              <br>

              <span class="muted">
                ${flagHtml}
                ${escapeHtml(countryRegion)}
              </span><br>

              <span>${escapeHtml(w.vitola || "–")} | ${w.length_mm ?? "–"} mm | Ringmaß ${w.ring_gauge ?? "–"}</span><br>
              <span>${price} ${pricePerL}</span>
            </div>

            <hr class="block-divider">
            
            <div class="metrics-block metrics-3col">

              <!-- Eigener Bestand -->
              <div class="metric-row" title="Dein aktueller Bestand (Zigarren)">
                <div class="stockbar-label">Bestand</div>
                <div class="stockbar-track">
                  <div class="stockbar-fill" style="width:${100 - myBarPct}%;"></div>
                </div>
                <div class="stockbar-ml">${myBarMl} Stk.</div>
              </div>

              <!-- Sonstige Bestände -->
              <div class="metric-row" title="Bestand deiner Freunde (Summe ohne dich, Zigarren)">
                <div class="stockbar-label">
                  sonstige
                  <span class="info-link" data-stock-info="${w.id}" title="Alle Bestände">ⓘ</span>
                </div>
                <div class="stockbar-track">
                  <div class="stockbar-fill" style="width:${100 - friendsBarPct}%;"></div>
                </div>
                <div class="stockbar-ml">${friendsBarMl} Stk.</div>
              </div>

            </div>

            <hr class="block-divider">

            <div class="metrics-block metrics-3col">
              <!-- Zeile 1: meine Bewertung -->
              <div class="stockbar-label" style="line-height:1;">Bewertung</div>
              <div class="stars-wrap detail-metrics">
                ${renderStars(myRating10)}
              </div>
              <div class="rating-num">
                ${myRating10 != null ? `${myRating10}/10` : ""}
              </div>

              <!-- Zeile 2: Ø Bewertung -->
              <div class="stockbar-label">
                Bewertung ⌀ <span class="info-link" data-rating-info="${w.id}" title="Alle Bewertungen">ⓘ</span>
              </div>
              <div class="stars-wrap detail-metrics">
                ${renderStars(AVG_RATING_BY_ID.get(w.id))}
              </div>
              <div class="rating-num">
                ${AVG_RATING_BY_ID.get(w.id) != null ? `${AVG_RATING_BY_ID.get(w.id).toFixed(1)}` : ""}
                ${CNT_RATING_BY_ID.get(w.id) ? ` (${CNT_RATING_BY_ID.get(w.id)})` : ""}
              </div>
            </div>

            <hr class="block-divider">

            <div class="metrics-block metrics-3col">
              <!-- Zeile 1: PLI -->
              <div class="stockbar-label" style="line-height:1;">
                PLI <span class="info-link" data-pli-info title="Info">ⓘ</span>
              </div>
              <div class="pli-scale-wrap">
                ${renderPliScale(myPli)}
              </div>
              <div class="rating-num">
                ${myPli != null ? `${myPli.toFixed(2)}` : ""}
              </div>

              <!-- Zeile 2: PLI Durchschnitt -->
              <div class="stockbar-label">PLI ⌀</div>
              <div class="pli-scale-wrap">
                ${renderPliScale(avgPli)}
              </div>
              <div class="rating-num">
                ${avgPli != null ? `${avgPli.toFixed(2)}` : ""}
                ${cntPli ? ` (${cntPli})` : ""}
              </div>
            </div>

          </div>
        </div>
      </div>
    `;
  }).join("");
}

    // ==========================================================
    // 6) POPUPS (PLI + Bewertungen) werden im Parent gerendert
    //    -> iFrame sendet nur Events + Content via postMessage
    // ==========================================================
    (function initPopupBridge(){
      
      // PLI öffnen
      document.addEventListener("click", (e) => {
        const btn = e.target?.closest?.("[data-pli-info]");
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        window.parent?.postMessage({ type: "gdb-cigar-open-pli" }, "*");
      });

      // Bewertungen öffnen
      document.addEventListener("click", (e) => {
        const btn = e.target?.closest?.("[data-rating-info]");
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const id = btn.getAttribute("data-rating-info");
        if (!id) return;

        const rows = RATINGS_BY_ID.get(id) || [];
        let html = "";
        if (!rows.length) {
          html = `<p class="muted">Noch keine Bewertungen vorhanden.</p>`;
        } else {
          const sorted = [...rows].sort((a,b) => (b.rating ?? 0) - (a.rating ?? 0));
          html = `
            <div style="display:grid; grid-template-columns: 1fr auto; gap:8px 12px; align-items:center;">
              ${sorted.map(r => {
                const name = USER_NAME_BY_ID.get(r.user_id) || "Unbekannt";
                const val = (r.rating != null) ? Number(r.rating) : null;
                return `
                  <div>${escapeHtml(name)}</div>
                  <div style="display:flex; gap:10px; align-items:center; justify-content:flex-end;">
                    ${renderStars(val)}
                    <span class="rating-num">${val != null ? `${val}/10` : ""}</span>
                  </div>
                `;
              }).join("")}
            </div>
          `;
        }

        const cigarName = CIGAR_NAME_BY_ID.get(id) || "";
        window.parent?.postMessage({
          type: "gdb-cigar-open-ratings",
          cigarId: id,
          title: cigarName
            ? `Bewertungen<br><small>${escapeHtml(cigarName)}</small>`
            : "Bewertungen",
          html
        }, "*");
      });
    })();

    // Bestände öffnen
    document.addEventListener("click", (e) => {
      const btn = e.target?.closest?.("[data-stock-info]");
      if (!btn) return;

      e.preventDefault();
      e.stopPropagation();

      const cigarId = btn.getAttribute("data-stock-info");
      if (!cigarId) return;

      const rows = STOCKS_BY_ID.get(cigarId) || [];
      const vol = Math.max(1,...rows.map(r => Number(r.stock || 0)));

      let html = "";
      if (!rows.length) {
        html = `<p class="muted">Keine Bestände vorhanden.</p>`;
      } else {
        const sorted = [...rows].sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0));

        html = `
          <div class="metrics-block metrics-3col-popup">
            ${sorted.map(r => {
              const name = USER_NAME_BY_ID.get(r.user_id) || "Unbekannt";
              const ml = Number(r.stock ?? 0);

              const pct = (vol > 0) ? Math.max(0, Math.min(100, (ml / vol) * 100)) : 0;
              const empty = 100 - pct;

              return `
                <div class="metric-row">
                  <div class="stockbar-label">${escapeHtml(name)}</div>
                  <div class="stockbar-track">
                    <div class="stockbar-fill" style="width:${empty}%;"></div>
                  </div>
                  <div class="stockbar-ml">${Math.round(ml)} Stk.</div>
                </div>
              `;
            }).join("")}
          </div>
        `;
      }

      const cigarName = CIGAR_NAME_BY_ID.get(cigarId) || "";
      window.parent?.postMessage({
        type: "gdb-cigar-open-stocks",
        cigarId,
        title: cigarName
          ? `Bestände<br><small>${escapeHtml(cigarName)}</small>`
          : "Bestände",
        html
      }, "*");
    });

// ==========================================================
// 8) START: Sofort laden und rendern
// ==========================================================
async function boot(){
  console.time("boot_total");

  const content = document.getElementById("content");
  content.innerHTML = "<p class='muted'>Lade Zigarren …</p>";

  if (!supabase?.auth?.getSession || !CURRENT_UID ||
      !window.parent?.GdbPermissions?.hasPermission?.("cigar", "read")) {
    content.textContent = "Bitte über die Genussübersicht anmelden; Zigarren-Leserecht erforderlich.";
    notifyParentCigarCount(0);
    return;
  }
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !sessionData?.session || window.parent?.currentUser?.id !== CURRENT_UID) {
    content.textContent = "Keine gültige Supabase-Session. Bitte erneut anmelden.";
    notifyParentCigarCount(0);
    return;
  }

  // --- 1) Zigarren laden ---
  console.time("q_cigars");
  const { data, error } = await supabase
    .from("gdb_cigars")
    .select([
      "id",
      "name",
      "brand",
      "manufacturer",
      "country",
      "region",
      "wrapper",
      "vitola","binder","filler","strength","edition_batch", "series",
      "flag_url",
      "region_flag_url",
      "length_mm",
      "ring_gauge",
      "price_eur",
      "image_url",
      "thumbnail_url",
      "provisional",
      "collector",
      "created_at",
      "updated_at",
      "created_by",
      "updated_by",
    ].join(","))
    .order("created_at", { ascending: false });

  console.timeEnd("q_cigars");

  if (error) {
    content.innerHTML = `<p class="muted">Fehler: ${escapeHtml(error.message)}</p>`;
    console.timeEnd("boot_total");
    return;
  }

  // --- Bestände laden: mein Bestand (CURRENT_UID) + sonstige (Summe ohne mich) ---
  MY_STOCK_BY_ID = new Map();
  OTHERS_STOCK_BY_ID = new Map();

  // Wir definieren ids EINMAL sauber (wird mehrfach gebraucht)
  const ids = (data || []).map(w => w.id);
  CIGAR_CREATED_AT_BY_ID = new Map((data || []).map(w => [w.id, w.created_at || ""]));
  CIGAR_UPDATED_AT_BY_ID = new Map((data || []).map(w => [w.id, w.updated_at || ""]));
  CIGAR_CREATED_BY_BY_ID = new Map((data || []).map(w => [w.id, w.created_by || ""]));
  CIGAR_UPDATED_BY_BY_ID = new Map((data || []).map(w => [w.id, w.updated_by || ""]));

  // Promises vorbereiten (laufen parallel los)
  console.time("q_parallel_total");

  const myRowsPromise = (CURRENT_UID && ids.length)
    ? supabase
        .from("gdb_cigar_user")
        .select("cigar_id, stock, rating, pli, notes, t_color, t_nose, t_palate, t_finish, t_summary, t_trinkgelegenheit, t_band, t_draw, t_burn, t_smoke, t_strength, t_development, wishlist, created_at, updated_at")
        .eq("user_id", CURRENT_UID)
        .in("cigar_id", ids)
    : Promise.resolve({ data: [], error: null });

  const stockRowsAllPromise = (CURRENT_UID && ids.length)
    ? supabase
        .from("gdb_cigar_user")
        .select("cigar_id, user_id, stock")
        .in("cigar_id", ids)
        .not("stock", "is", null)
    : Promise.resolve({ data: [], error: null });

  const ratingRowsPromise = ids.length
    ? supabase
        .from("gdb_cigar_user")
        .select("cigar_id, user_id, rating")
        .in("cigar_id", ids)
        .not("rating", "is", null)
    : Promise.resolve({ data: [], error: null });

  const pliRowsAllPromise = ids.length
    ? supabase
        .from("gdb_cigar_user")
        .select("cigar_id, pli")
        .in("cigar_id", ids)
    : Promise.resolve({ data: [], error: null });

  // parallel abholen
  const [
    { data: myRows, error: myErr },
    { data: stockRowsAll, error: stockAllErr },
    { data: ratingRows, error: ratingErr },
    { data: pliRowsAll, error: pliErr },
  ] = await Promise.all([
    myRowsPromise,
    stockRowsAllPromise,
    ratingRowsPromise,
    pliRowsAllPromise,
  ]);

  console.timeEnd("q_parallel_total");

  // --- 2) Mein User-Block ---
  if (CURRENT_UID && ids.length) {

    if (!myErr && myRows) {
      for (const r of myRows) {
        MY_EXTRA_TASTING_BY_ID.set(r.cigar_id, Object.fromEntries(["t_band","t_draw","t_burn","t_smoke","t_strength","t_development"].map(key => [key,r[key] || null])));
        MY_STOCK_BY_ID.set(r.cigar_id, Number(r.stock ?? 0));
        MY_RATING_BY_ID.set(
          r.cigar_id,
          (r.rating === null || r.rating === undefined) ? null : Number(r.rating)
        );
        MY_PLI_BY_ID.set(
          r.cigar_id,
          (r.pli === null || r.pli === undefined) ? null : Number(r.pli)
        );
        MY_NOTES_BY_ID.set(r.cigar_id, (r.notes ?? "").toString());
        MY_COLOR_BY_ID.set(r.cigar_id, (r.t_color ?? "").toString());
        MY_NOSE_BY_ID.set(r.cigar_id, (r.t_nose ?? "").toString());
        MY_PALATE_BY_ID.set(r.cigar_id, (r.t_palate ?? "").toString());
        MY_FINISH_BY_ID.set(r.cigar_id, (r.t_finish ?? "").toString());
        MY_SUMMARY_BY_ID.set(r.cigar_id, (r.t_summary ?? "").toString());
        MY_TRINKGELEGENHEIT_BY_ID.set(r.cigar_id, (r.t_trinkgelegenheit ?? "").toString());
        MY_WISHLIST_BY_ID.set(r.cigar_id, !!r.wishlist);
        MY_CREATED_AT_BY_CIGAR_ID.set(r.cigar_id, r.created_at || "");
        MY_UPDATED_AT_BY_CIGAR_ID.set(r.cigar_id, r.updated_at || "");
      }
    }

    // --- 3) Alle Bestände (für Popup + sonstige Summe) ---
    STOCKS_BY_ID = new Map();

    if (!stockAllErr && stockRowsAll) {
      for (const r of stockRowsAll) {
        const ml = Number(r.stock ?? 0);
        if (ml <= 0) continue;

        const key = r.cigar_id;
        if (!STOCKS_BY_ID.has(key)) STOCKS_BY_ID.set(key, []);
        STOCKS_BY_ID.get(key).push({ user_id: r.user_id, stock: ml });
      }

      OTHERS_STOCK_BY_ID = new Map();
      for (const [cigarId, rows] of STOCKS_BY_ID.entries()) {
        let sum = 0;
        for (const r of rows) {
          if (r.user_id === CURRENT_UID) continue;
          sum += Number(r.stock ?? 0);
        }
        OTHERS_STOCK_BY_ID.set(cigarId, sum);
      }
    }
  } else {
    // wichtig: wenn CURRENT_UID fehlt, müssen diese Maps trotzdem existieren
    STOCKS_BY_ID = new Map();
  }

  // --- 4) Bewertungen (alle) für Ø + Popup ---
  AVG_RATING_BY_ID = new Map();
  CNT_RATING_BY_ID = new Map();
  RATINGS_BY_ID = new Map(); // wichtig: immer initialisieren, sonst knallt später USER-Loop

  if (ids.length) {

    if (!ratingErr && ratingRows) {
      const sum = new Map();
      const cnt = new Map();

      for (const r of ratingRows) {
        const k = r.cigar_id;
        const v = Number(r.rating);
        if (Number.isNaN(v)) continue;

        sum.set(k, (sum.get(k) || 0) + v);
        cnt.set(k, (cnt.get(k) || 0) + 1);

        if (!RATINGS_BY_ID.has(k)) RATINGS_BY_ID.set(k, []);
        RATINGS_BY_ID.get(k).push({ user_id: r.user_id, rating: v });
      }

      for (const [k, c] of cnt.entries()) {
        const s = sum.get(k) || 0;
        CNT_RATING_BY_ID.set(k, c);
        AVG_RATING_BY_ID.set(k, s / c);
      }
    }

    // --- 5) PLI (alle) für Ø + min/max ---
    AVG_PLI_BY_ID = new Map();
    CNT_PLI_BY_ID = new Map();

    if (!pliErr && pliRowsAll) {
      const sum = new Map();
      const cnt = new Map();

      let min = null;
      let max = null;

      for (const r of pliRowsAll) {
        const vRaw = r.pli;
        if (vRaw === null || vRaw === undefined || vRaw === "") continue;

        const k = r.cigar_id;
        const v = Number(vRaw);
        if (Number.isNaN(v)) continue;

        sum.set(k, (sum.get(k) || 0) + v);
        cnt.set(k, (cnt.get(k) || 0) + 1);

        if (min === null || v < min) min = v;
        if (max === null || v > max) max = v;
      }

      PLI_MIN = min;
      PLI_MAX = max;

      for (const [k, c] of cnt.entries()) {
        if (c > 0) {
          AVG_PLI_BY_ID.set(k, (sum.get(k) || 0) / c);
          CNT_PLI_BY_ID.set(k, c);
        }
      }
    }
  } else {
    AVG_PLI_BY_ID = new Map();
    CNT_PLI_BY_ID = new Map();
    PLI_MIN = null;
    PLI_MAX = null;
  }

  // --- 6) Display-Namen für alle User laden ---
  USER_NAME_BY_ID = new Map();

  const userIds = new Set();
  for (const arr of RATINGS_BY_ID.values()) {
    for (const r of arr) userIds.add(r.user_id);
  }
  for (const rows of STOCKS_BY_ID.values()) {
    for (const r of rows) userIds.add(r.user_id);
  }

  // zusätzlich: created_by / updated_by aus Stammdaten in den User-Pool aufnehmen
  for (const w of (data || [])) {
    if (w.created_by) userIds.add(w.created_by);
    if (w.updated_by) userIds.add(w.updated_by);
  }
  
  if (userIds.size) {
    console.time("q_users");
    const { data: users, error: usersErr } = await supabase
      .from("gdb_users")
      .select("id, display_name")
      .in("id", Array.from(userIds));
    console.timeEnd("q_users");

    if (!usersErr && users) {
      for (const u of users) {
        USER_NAME_BY_ID.set(u.id, u.display_name || "Unbekannt");
      }
    }
  }

  // Namen-Mapping für Popups im Parent
  CIGAR_NAME_BY_ID = new Map((data || []).map(w => [w.id, w.name || ""]));

  CIGAR_META_BY_ID = new Map((data || []).map(w => [w.id, {
    created_at: w.created_at || "",
    updated_at: w.updated_at || ""
  }]));

  console.time("renderList");
  ALL_CIGARS = data || [];
  rerenderCurrentList();
  console.timeEnd("renderList");

  console.timeEnd("boot_total");
}

    const overlay = document.getElementById("globalOverlay");
    const cigarFrame = document.getElementById("cigarFrame");

    window.addEventListener("message", (e) => {
      
      if (!e.data || !e.data.type) return;

      if (e.data.type === "gdb-cigar-popup-open") {
        overlay.classList.add("active");
        overlay.setAttribute("aria-hidden", "false");
      }

      if (e.data.type === "gdb-cigar-popup-close") {
        overlay.classList.remove("active");
        overlay.setAttribute("aria-hidden", "true");
      }

      if (e.data.type === "gdb-cigar-set-search") {
        CURRENT_SEARCH_TERM = (e.data.value || "").toString();
        rerenderCurrentList();
      }

      if (e.data.type === "gdb-cigar-set-sort") {
        CURRENT_SORT_MODE = (e.data.value?.mode || "name").toString();
        CURRENT_SORT_DIRECTION = (e.data.value?.dir || "asc").toString();
        rerenderCurrentList();
      }

      if (e.data.type === "gdb-cigar-set-filters") {
        CURRENT_FILTER_OWN_STOCK = !!e.data.value?.ownStock;
        CURRENT_FILTER_COLLECTOR = !!e.data.value?.collector;
        CURRENT_FILTER_INCOMPLETE = !!e.data.value?.incomplete;
        CURRENT_FILTER_WISHLIST = !!e.data.value?.wishlist;
        CURRENT_FILTER_WITHOUT_IMAGE = !!e.data.value?.withoutImage;
        rerenderCurrentList();
      }

      if (e.data.type === "gdb-cigar-set-compare-stock") {
        CURRENT_COMPARE_STOCK = !!e.data.value?.enabled;
        CURRENT_COMPARE_USER_ID = e.data.value?.userId || null;
        rerenderCurrentList();
      }
    });

    boot();

// Karten-Klick -> Parent-Navigation (Detailansicht kommt später)
document.addEventListener("click", (e) => {
  // nicht auslösen, wenn auf Buttons/Links innerhalb der Karte geklickt wird
  if (e.target.closest("button, a, .info-btn")) return;
  if (e.target.closest(".info-link")) return;

  const card = e.target.closest(".card[data-cigar-id]");
  if (!card) return;

  const cigarId = card.getAttribute("data-cigar-id");
  if (!cigarId) return;

  const avgRating = AVG_RATING_BY_ID.get(cigarId);
  const cntRating = CNT_RATING_BY_ID.get(cigarId) || 0;

  const avgPli = AVG_PLI_BY_ID.get(cigarId);
  const cntPli = CNT_PLI_BY_ID.get(cigarId) || 0;

  const pliMin = PLI_MIN;
  const pliMax = PLI_MAX;

  const myStockMl = MY_STOCK_BY_ID.get(cigarId) || 0;
  const myRating = MY_RATING_BY_ID.get(cigarId);
  const myPli    = MY_PLI_BY_ID.get(cigarId);

  const myNotes = MY_NOTES_BY_ID.get(cigarId) || "";
  const myColor = MY_COLOR_BY_ID.get(cigarId) || "";
  const myNose  = MY_NOSE_BY_ID.get(cigarId) || "";
  const myPalate = MY_PALATE_BY_ID.get(cigarId) || "";
  const myFinish = MY_FINISH_BY_ID.get(cigarId) || "";
  const mySummary = MY_SUMMARY_BY_ID.get(cigarId) || "";
  const myTrinkgelegenheit = MY_TRINKGELEGENHEIT_BY_ID.get(cigarId) || "";
  const myWishlist = MY_WISHLIST_BY_ID.get(cigarId) ? 1 : 0;

  const createdById = CIGAR_CREATED_BY_BY_ID.get(cigarId) || "";
  const updatedById = CIGAR_UPDATED_BY_BY_ID.get(cigarId) || "";

  const createdByName = (createdById && USER_NAME_BY_ID.get(createdById)) ? USER_NAME_BY_ID.get(createdById) : (createdById || "");
  const updatedByName = (updatedById && USER_NAME_BY_ID.get(updatedById)) ? USER_NAME_BY_ID.get(updatedById) : (updatedById || "");

  // console.log("NAV_PAYLOAD", cigarId, avgPli, cntPli);

  window.parent.postMessage(
  {
    type: "gdb-cigar-nav",
    view: "cigarDetail",
    id: cigarId,
    avgRating, 
    cntRating,
    avgPli, cntPli,
    pliMin, pliMax,
    myStockMl: myStockMl,
    myRating: (myRating == null ? "" : myRating),
    myPli: (myPli == null ? "" : myPli),
    myNotes: myNotes,
    myColor: myColor,
    myNose: myNose,
    myPalate: myPalate,
    myFinish: myFinish,
    mySummary: mySummary,
    myTrinkgelegenheit: myTrinkgelegenheit,
    myWishlist: myWishlist,
    extraTasting: MY_EXTRA_TASTING_BY_ID.get(cigarId) || {},
    created_at: CIGAR_CREATED_AT_BY_ID.get(cigarId) || "",
    updated_at: CIGAR_UPDATED_AT_BY_ID.get(cigarId) || "",

    created_by: createdByName,
    updated_by: updatedByName,

    my_created_at: MY_CREATED_AT_BY_CIGAR_ID.get(cigarId) || "",
    my_updated_at: MY_UPDATED_AT_BY_CIGAR_ID.get(cigarId) || "",

    // optional (für später Admin/Debug – kann drin bleiben)
    created_by_id: createdById,
    updated_by_id: updatedById,
  },
  "*"
);
  
});
