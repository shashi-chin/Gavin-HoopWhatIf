# HoopWhatIf 🏀

**Compare legends. Build your dream team. Change history.**

A fun NBA "What If" lab built for curious minds who love basketball stats and history.

---

## What is this?

HoopWhatIf lets you explore NBA greats from different eras, simulate matchups between any two players, and tweak how the game is played (more 3s? More physical? Faster pace?).

It was built as a starting point — something cool you can play with immediately, but also something you can open up, understand, and make your own.

## Try it right now

**Live demo:** *(coming soon after first deploy)*

### Run it locally (easiest way to play)

1. Make sure you have Node.js installed (version 18 or higher)
2. Open a terminal in this folder
3. Run:

```bash
npm install
npm run dev
```

4. Open the link it gives you (usually http://localhost:5173)

---

## What you can do right now

### 1. Player Explorer
Browse 28+ players from the 70s all the way to today. Filter by era or position, or search by name. Click any card to see career stats, peak season numbers, and fun facts.

### 2. Matchup Simulator (the best part)
Pick any two players and simulate a game. Then use the three sliders to change the rules of basketball:

- **3-Point Emphasis** — How valuable are threes in this version of the game?
- **Pace of Play** — How fast is the game played?
- **Physicality** — How much does tough defense matter?

Change the sliders and re-run the simulation. You'll see the results shift in interesting ways. This is where the real debates start.

---

## For the builder (you)

This project was made so you can mess with it.

The most important file for quick changes is:

```
src/data/players.json
```

You can add new players, change stats, edit fun facts — and see your changes instantly when you refresh.

The simulation logic lives in:

```
src/utils/simulation.js
```

That's where the "magic" happens. It's written to be readable on purpose.

---

## Next Steps (for Dad + Son)

### Quick Deploy to Azure (Free)

This app is designed to deploy easily to **Azure Static Web Apps** (completely free for this kind of project).

**Steps:**

1. Create a free GitHub account if you don't have one
2. Create a new repository on GitHub and push this folder to it
3. Go to https://portal.azure.com
4. Search for "Static Web Apps" → Create
5. Connect your GitHub repo
6. Use these settings:
   - Build preset: **Custom**
   - App location: `/`
   - Output location: `dist`
7. Click Create

Azure will automatically build and deploy your app every time you push changes.

Once deployed, you'll get a public URL you can send to friends, grandparents, or anyone.

---

## Want to make it even cooler?

Here are some fun ideas to try:

- Add your favorite player to `players.json`
- Change the simulation rules in `simulation.js`
- Make the colors match your favorite team
- Add a "My All-Time Starting Five" feature

The code is intentionally written to be hackable.

---

## Built with ❤️ for the next generation of builders

This started as a simple project to spark curiosity. The goal isn't perfection — it's getting you excited enough to open the code and start changing things.

Go make it yours.

---

**Current version:** Early playable MVP (Explorer + Matchup Simulator with era sliders)

More features (Dream Team Builder, deeper remix guides) can be added next.
