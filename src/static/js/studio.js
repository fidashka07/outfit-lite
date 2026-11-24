(() => {
  "use strict";

  const products = JSON.parse(document.getElementById("products-data").textContent);
  const selected = { tops: null, bottoms: null, shoes: null };
  const categoryInfo = {
    tops: ["THE TOP EDIT", "Choose a top", "T-shirts, shirts and layers for your look."],
    bottoms: ["THE BOTTOM EDIT", "Choose a bottom", "Find the shape that completes your outfit."],
    shoes: ["THE SHOE EDIT", "Choose shoes", "Finish the look from the ground up."]
  };
  const $ = (selector) => document.querySelector(selector);
  const money = (value) => `$${Number(value).toFixed(2)}`;

  function styleFor(product) {
    const name = product.name.toLowerCase();
    if (product.category === "tops") {
      if (name.includes("hoodie")) return "hoodie";
      if (name.includes("sweater") || name.includes("knit")) return "sweater";
      if (name.includes("shirt") || name.includes("blouse")) return "shirt";
      return "tee";
    }
    if (product.category === "bottoms") {
      if (name.includes("skirt")) return "skirt";
      if (name.includes("short")) return "shorts";
      if (name.includes("jean")) return "jeans";
      return "trousers";
    }
    if (name.includes("boot")) return "boots";
    if (name.includes("heel")) return "heels";
    if (name.includes("sandal")) return "sandals";
    return "sneakers";
  }

  function svgFor(product, extraClass = "") {
    const fill = product.color_hex || "#a18b7b";
    const common = `class="${extraClass}" viewBox="0 0 240 180" role="img" aria-label="${product.name.replaceAll('"', '&quot;')}" xmlns="http://www.w3.org/2000/svg" style="--garment:${fill};--shade:${shade(fill)}"`;
    const start = `<svg ${common}><defs><linearGradient id="fabric-${product.id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--garment)" /><stop offset="1" stop-color="var(--shade)" /></linearGradient></defs>`;
    const end = `</svg>`;
    const seam = `<g fill="none" stroke="rgba(45,42,38,.25)" stroke-width="1.5" stroke-linecap="round">`;
    const close = `</g>`;
    let art = "";
    const type = styleFor(product);

    if (["tee", "shirt", "hoodie", "sweater"].includes(type)) {
      let body = "M82 35 L101 23 Q120 15 139 23 L158 35 L190 57 L169 82 L153 70 L157 151 Q120 160 83 151 L87 70 L71 82 L50 57 Z";
      if (type === "hoodie") body = "M82 39 L101 25 Q120 17 139 25 L158 39 L190 58 L169 84 L153 71 L157 151 Q120 160 83 151 L87 71 L71 84 L50 58 Z";
      art = `<path d="${body}" fill="url(#fabric-${product.id})" stroke="rgba(42,39,35,.25)" stroke-width="1.5" stroke-linejoin="round"/>`;
      if (type === "shirt") art += `<path d="M101 24 L120 49 L139 24 L131 62 L120 54 L109 62 Z" fill="#f7f5f0" opacity=".9"/><path d="M120 49 V151" stroke="rgba(45,42,38,.3)" stroke-width="1.5"/><g fill="#f5f2eb"><circle cx="120" cy="75" r="1.8"/><circle cx="120" cy="96" r="1.8"/><circle cx="120" cy="117" r="1.8"/></g>`;
      if (type === "hoodie") art += `<path d="M98 29 Q120 -1 142 29 L137 54 Q120 68 103 54 Z" fill="var(--shade)" stroke="rgba(42,39,35,.25)" stroke-width="1.5"/><path d="M101 117 Q120 109 139 117 L138 142 Q120 149 102 142 Z" fill="none" stroke="rgba(42,39,35,.28)" stroke-width="1.5"/><path d="M111 55 L113 80 M129 55 L127 80" stroke="rgba(42,39,35,.35)" stroke-width="1.4"/>`;
      if (type === "sweater") art += `<path d="M85 75 H155 M86 88 H154 M86 101 H154" stroke="rgba(255,255,255,.25)" stroke-width="2"/>`;
      art += `${seam}<path d="M82 35 L71 82 M158 35 L169 82 M87 70 L83 151 Q120 160 157 151 L153 70"/><path d="M105 27 Q120 40 135 27" />${close}`;
      if (type === "tee") art += `<path d="M105 26 Q120 42 135 26" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3"/>`;
    } else if (["jeans", "trousers", "shorts"].includes(type)) {
      const hem = type === "shorts" ? "L151 105 L153 73 L120 78 L87 73 L89 105 L89 105 L116 109 L120 80 L124 109 Z" :
        "L151 165 L145 83 L120 86 L95 83 L89 165 L111 165 L120 100 L129 165 Z";
      art = `<path d="M82 22 Q120 29 158 22 L151 165 L129 165 L120 91 L111 165 L89 165 Z" fill="url(#fabric-${product.id})" stroke="rgba(42,39,35,.28)" stroke-width="1.5" stroke-linejoin="round"/>`;
      art += `<path d="M82 22 Q120 29 158 22 L156 42 Q120 49 84 42 Z" fill="var(--shade)" stroke="rgba(42,39,35,.25)" stroke-width="1.3"/>`;
      if (type === "jeans") art += `<path d="M120 43 V91 M92 54 L94 75 M148 54 L146 75" fill="none" stroke="rgba(255,255,255,.38)" stroke-width="2"/><path d="M98 49 Q120 55 142 49" fill="none" stroke="rgba(42,39,35,.25)" stroke-width="1.3"/>`;
      if (type === "shorts") art += `<path d="M120 45 V105 M89 105 Q103 111 116 109 M124 109 Q139 111 151 105" fill="none" stroke="rgba(42,39,35,.28)" stroke-width="1.5"/>`;
      if (type === "trousers") art += `<path d="M120 44 V90 M93 58 L97 153 M147 58 L143 153" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1.5"/>`;
      art += `${seam}<path d="M84 42 Q120 49 156 42 M120 44 V91 M89 165 H111 M129 165 H151"/>${close}`;
    } else if (type === "skirt") {
      art = `<path d="M93 24 Q120 30 147 24 L177 158 Q120 170 63 158 Z" fill="url(#fabric-${product.id})" stroke="rgba(42,39,35,.28)" stroke-width="1.5" stroke-linejoin="round"/><path d="M93 24 Q120 30 147 24 L151 43 Q120 50 89 43 Z" fill="var(--shade)" stroke="rgba(42,39,35,.22)" stroke-width="1.3"/>${seam}<path d="M89 43 Q120 50 151 43 M76 155 Q120 164 164 155 M105 52 L91 151 M135 52 L149 151"/>${close}`;
    } else {
      if (type === "boots") {
        art = `<path d="M70 20 H116 V105 Q116 120 137 124 L177 135 Q190 140 187 153 Q185 161 173 161 H70 Q58 156 62 143 L74 112 Z" fill="url(#fabric-${product.id})" stroke="rgba(42,39,35,.3)" stroke-width="1.5"/><path d="M70 20 H116 V42 H70 Z" fill="var(--shade)"/><path d="M69 143 H185" stroke="rgba(255,255,255,.45)" stroke-width="3"/>`;
      } else if (type === "heels") {
        art = `<path d="M60 102 Q82 90 111 105 L149 129 Q165 138 190 139 L188 151 H82 Q61 148 55 133 Z" fill="url(#fabric-${product.id})" stroke="rgba(42,39,35,.3)" stroke-width="1.5"/><path d="M150 137 L160 167 H171 L169 139" fill="var(--shade)" stroke="rgba(42,39,35,.3)" stroke-width="1.5"/><path d="M75 105 Q96 111 113 124" fill="none" stroke="rgba(255,255,255,.5)" stroke-width="3"/>`;
      } else if (type === "sandals") {
        art = `<path d="M83 23 Q116 10 145 28 Q167 49 171 105 Q171 148 145 157 Q111 166 83 147 Q65 126 68 81 Q70 42 83 23Z" fill="url(#fabric-${product.id})" stroke="rgba(42,39,35,.3)" stroke-width="1.5"/><path d="M75 69 Q120 93 164 69 M79 105 Q120 126 166 105" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="9" stroke-linecap="round"/>`;
      } else {
        art = `<path d="M52 105 Q70 91 99 98 L137 116 Q157 125 185 126 Q198 130 194 145 Q191 157 174 159 H75 Q51 155 47 138 Q44 119 52 105Z" fill="url(#fabric-${product.id})" stroke="rgba(42,39,35,.3)" stroke-width="1.5"/><path d="M60 133 Q119 146 189 136" fill="none" stroke="rgba(255,255,255,.48)" stroke-width="3"/><path d="M99 103 L118 127 M116 110 L134 132 M133 118 L150 135" stroke="rgba(255,255,255,.65)" stroke-width="3" stroke-linecap="round"/>`;
      }
    }
    return `${start}${art}${end}`;
  }

  function shade(hex) {
    const clean = hex.replace("#", "");
    if (clean.length !== 6) return "#8b8175";
    const n = parseInt(clean, 16);
    const r = Math.max(0, ((n >> 16) & 255) - 28);
    const g = Math.max(0, ((n >> 8) & 255) - 28);
    const b = Math.max(0, (n & 255) - 28);
    return `#${[r,g,b].map(v => v.toString(16).padStart(2,"0")).join("")}`;
  }

  function previewMarkup(product) {
    if (!product) return "";
    if (product.image) {
      return `<img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy">`;
    }
    return svgFor(product);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
    }[char]));
  }

  function updateBoard() {
    ["tops", "bottoms", "shoes"].forEach(category => {
      const slot = $(`#slot-${category}`);
      const product = selected[category];
      slot.classList.add("is-changing");
      window.setTimeout(() => {
        slot.innerHTML = product ? previewMarkup(product) :
          `<div class="empty-slot"><span class="empty-plus">+</span><span>Choose ${category === "tops" ? "a top" : category === "bottoms" ? "a bottom" : "shoes"}</span></div>`;
        slot.classList.remove("is-changing");
      }, 110);
    });
    const chosen = Object.values(selected).filter(Boolean);
    $("#item-count").textContent = `${chosen.length} / 3 pieces`;
    $("#total-price").textContent = money(chosen.reduce((sum, item) => sum + item.price, 0));
    document.querySelectorAll(".product-card").forEach(card => {
      const active = selected[card.dataset.category]?.id === Number(card.dataset.id);
      card.setAttribute("aria-pressed", String(Boolean(active)));
    });
  }

  function renderProducts(category) {
    const grid = $("#product-grid");
    const list = products.filter(product => product.category === category);
    grid.innerHTML = list.map(product => `
      <button class="product-card" type="button" data-id="${product.id}" data-category="${category}"
        aria-pressed="${selected[category]?.id === product.id}" aria-label="Select ${escapeHtml(product.name)}, ${money(product.price)}">
        <span class="product-visual">${previewMarkup(product)}</span>
        <span class="product-name">${escapeHtml(product.name)}</span>
        <span class="product-price">${money(product.price)}</span>
        <span class="product-swatch" style="background:${product.color_hex || "#a18b7b"}" aria-hidden="true"></span>
      </button>`).join("");
    grid.querySelectorAll(".product-card").forEach(card => {
      card.addEventListener("click", () => {
        const product = products.find(item => item.id === Number(card.dataset.id));
        selected[category] = product;
        updateBoard();
      });
    });
    $("#category-eyebrow").textContent = categoryInfo[category][0];
    $("#category-title").textContent = categoryInfo[category][1];
    $("#category-description").textContent = categoryInfo[category][2];
  }

  function switchTab(tabName) {
    document.querySelectorAll(".tab").forEach(tab => {
      const active = tab.dataset.tab === tabName;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    const measurements = tabName === "measurements";
    $("#panel-measurements").hidden = !measurements;
    $("#panel-products").hidden = measurements;
    if (!measurements) renderProducts(tabName);
  }

  async function updateSize() {
    const names = ["chest", "waist", "hips"];
    const values = {};
    for (const name of names) {
      const input = $(`#${name}-number`);
      const value = Number(input.value);
      if (!input.value || !Number.isFinite(value)) return;
      values[name] = value;
    }
    const query = new URLSearchParams(values);
    try {
      const response = await fetch(`/api/size-recommendation?${query}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Check your measurements.");
      $("#size-badge").textContent = data.size;
      $("#result-size").textContent = data.size;
      $("#result-copy").textContent = "Based on your chest, waist and hip measurements.";
    } catch (error) {
      $("#size-badge").textContent = "—";
      $("#result-size").textContent = "—";
      $("#result-copy").textContent = error.message;
    }
  }

  function bindMeasurements() {
    document.querySelectorAll("[data-measurement]").forEach(input => {
      input.addEventListener("input", () => {
        const key = input.dataset.measurement;
        const number = $(`#${key}-number`);
        const range = $(`#${key}-range`);
        if (input.type === "range") number.value = input.value;
        else if (input.value !== "") range.value = input.value;
        if (["chest", "waist", "hips"].includes(key)) updateSize();
      });
    });
  }

  $("#reset-button").addEventListener("click", () => {
    selected.tops = selected.bottoms = selected.shoes = null;
    updateBoard();
    const active = document.querySelector(".tab.is-active")?.dataset.tab;
    if (active && active !== "measurements") renderProducts(active);
  });

  $("#random-button").addEventListener("click", () => {
    ["tops", "bottoms", "shoes"].forEach(category => {
      const list = products.filter(product => product.category === category);
      selected[category] = list[Math.floor(Math.random() * list.length)];
    });
    updateBoard();
    const active = document.querySelector(".tab.is-active")?.dataset.tab;
    if (active && active !== "measurements") renderProducts(active);
  });

  document.querySelectorAll(".tab").forEach((tab, index, tabs) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    tab.addEventListener("keydown", event => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      let next = index;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      tabs[next].focus();
      switchTab(tabs[next].dataset.tab);
    });
  });

  bindMeasurements();
  updateBoard();
  updateSize();
})();