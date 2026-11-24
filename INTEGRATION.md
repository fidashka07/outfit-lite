# Outfit Lite — Outfit Board integration

## File structure

```text
outfit-lite/
├── src/
│   ├── app.py
│   ├── app_size_recommendation.py
│   ├── templates/
│   │   └── studio.html
│   └── static/
│       ├── css/
│       │   └── studio.css
│       └── js/
│           └── studio.js
└── tests/
    └── test_size_recommendation.py
```

## Integration

1. Copy the files into the matching paths in your existing repository.
2. The supplied `app.py` preserves the existing `/`, `/products`, `/products/<id>`,
   `/studio`, `/api/outfit-price`, `/health`, and `/version` routes and adds the
   size recommendation route. If your current app has additional routes or
   configuration, merge those into this file rather than deleting them.
3. Keep your existing home/product templates. This studio template is standalone
   and does not depend on `base.html`.
4. Product photos are optional. Add an `image` key to any product dictionary,
   for example `"image": "/static/images/products/white-tee.webp"`. Use a
   transparent PNG or WebP with the product isolated on a transparent background.
   The front end automatically uses that image in both the product card and board.
5. The SVG illustrations are selected by product name keywords. Use names that
   include T-shirt/tee, shirt/blouse, hoodie, sweater/knit, jeans, trousers,
   shorts, skirt, sneakers, boots, heels, or sandals. Add a `style` field and
   change `styleFor()` if you prefer explicit product type metadata.

## Run locally

From Git Bash:

```bash
cd "/c/Software Project/outfit-lite"
source .venv/Scripts/activate
pip install Flask pytest
pytest -q
python src/app.py
```

Open `http://127.0.0.1:5000/studio`.

Check the API:

```text
http://127.0.0.1:5000/api/size-recommendation?chest=96&waist=80&hips=100
http://127.0.0.1:5000/api/outfit-price?items=1,4,7
```

## How the board works

- There is no human model, mannequin, body geometry or garment-fitting logic.
- The three fixed slots are independent flat-lay display areas.
- `svgFor(product)` returns a simple inline SVG based on the product category and
  detected garment type. The selected product's `color_hex` becomes the SVG's
  `--garment` variable; a darker derived tone is used for gradient shading.
- `previewMarkup(product)` checks `product.image` first. If present, the image
  replaces the SVG without changing the slot layout.
- `selected` stores one product per category. `updateBoard()` updates the three
  slots, count and total. Reset clears all slots; Random outfit selects one item
  from each category.

To add a new illustration, add a product and extend `styleFor()` and the relevant
shape branch in `svgFor()`. Keep the SVG centred in its 240 × 180 viewBox.

## Manual test checklist

- [ ] `/studio` loads without console errors.
- [ ] Board starts with three empty placeholders.
- [ ] Tops tab shows T-shirt, shirt, hoodie, blouse and sweater options.
- [ ] Bottoms tab shows jeans, wide trousers, shorts and skirt options.
- [ ] Shoes tab shows sneakers, boots, heels and sandals options.
- [ ] Selecting one item fills only its matching slot.
- [ ] Selecting a different item in the same category replaces the previous one.
- [ ] Total price updates and selected card receives an active state.
- [ ] Reset clears all three slots and total.
- [ ] Random outfit selects one product per category.
- [ ] Adding a product `image` path displays the image instead of its SVG.
- [ ] Measurement sliders and number inputs stay synchronized.
- [ ] Changing chest, waist or hips updates the recommended size badge.
- [ ] Missing, non-numeric, decimal and out-of-range API values return HTTP 400.
- [ ] `/api/outfit-price?items=1,4,7` still returns the selected products and total.
- [ ] Keyboard tab navigation works with arrow keys, Home and End.
- [ ] Layout remains usable at 360px, 768px and 1280px widths.
- [ ] Reduced-motion preference disables transitions.
