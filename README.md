# KnotLab

Knot selector and working-load calculator. Static, no build, no dependencies. Open `app.html` or visit the GitHub Pages site.

## What it does

- **Recommend**: describe the task ("climbing tie in", "mooring a boat", "lash cargo") and get ranked knot suggestions with efficiency and difficulty.
- **Working load**: rope minimum breaking strength (MBS) x knot efficiency / safety factor = working load limit in kg.
- **Head to head**: compare any two of the 12 knots on the same rope.

## The knots

Figure-8 Loop, Bowline, Alpine Butterfly, Double Fisherman, Sheet Bend, Clove Hitch, Taut-Line Hitch, Prusik, Trucker's Hitch, Cleat Hitch, Figure-8 Stopper, Barrel Knot.

## Data and limits

Efficiency values (residual rope strength at the knot) are widely cited approximations from climbing and sailing references. Real results vary with rope construction, dressing, and loading dynamics. This is an educational tool - always inspect knots and follow the rope manufacturer's working-load guidance.

## Development

Pure JS engine (`engine.js`), browser and Node compatible. Tests run the engine against a python oracle (`tests/build_corpus.py` generates `tests/expected.json`):

```
python3 tests/build_corpus.py
node tests/run_tests.js
```

Built as app #394 of the app factory.
