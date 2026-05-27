# HoopWhatIf 🏀

**Compare legends. Build your dream team. Change history.**

A fun NBA "What If" lab for basketball fans who love stats, history, and debates.

---

## What is this?

HoopWhatIf lets you explore NBA players from different eras, simulate matchups between any two players, and tweak how the game is played (more 3s? Slower pace? More physical?).

It’s built to be fun to play with immediately, but also easy to open, understand, and modify.

---

## Try it right now

**Live demo:** https://www.gavinwhatif.com

### Run it locally

1. Make sure you have Node.js 18+ installed
2. Open a terminal in this folder
3. Run:

```bash
npm install
npm run dev
```

4. Open the link shown in your terminal (usually http://localhost:5173)

---

## What you can do

### Player Explorer
Browse 35+ players across different eras. Many are excellent but often overlooked players (Draymond Green, Jrue Holiday, Tony Allen, Shane Battier, Bam Adebayo, Mikal Bridges, and more). Filter by era or position, search by name, and click any card to see career stats, peak numbers, and fun facts.

### Matchup Simulator
Pick any two players and run a simulation. Use the three sliders to change the rules of the game:

- **3-Point Emphasis** — How much are threes valued?
- **Pace of Play** — How fast is the game?
- **Physicality** — How much does tough defense matter?

The results shift in interesting ways depending on the era adjustments.

---

## For the builder

This project is designed to be easy to tinker with.

The most important file for quick changes is:

```
src/data/players.json
```

You can add new players, update stats, or edit fun facts — changes appear instantly when you refresh the page.

The simulation logic lives in:

```
src/utils/simulation.js
```

This file controls how the era sliders affect the outcomes. It’s written to be readable and hackable.

---

## Deploy to Azure (Free)

This project is set up to deploy easily to **Azure Static Web Apps**.

### Quick steps:

1. Push this project to a GitHub repository
2. In the Azure Portal, create a new **Static Web App**
3. Connect your GitHub repo
4. Use these build settings:
   - Build preset: **Custom**
   - App location: `/`
   - Output location: `dist`

Azure will automatically build and deploy every time you push to the main branch.

---

## Ideas to extend it

Some fun things you can try:

- Add more underrated players to `players.json`
- Adjust the simulation logic in `simulation.js`
- Add a Dream Team Builder feature
- Create new era presets or simulation modes
- Style the app around your favorite team

The code is intentionally kept simple so it’s easy to modify.

---

**Current version:** MVP with Player Explorer + Matchup Simulator (with era sliders)

More features (Dream Team Builder, better remix guides, etc.) can be added later.

---

Made for people who love basketball and like to tinker. Go make it yours.