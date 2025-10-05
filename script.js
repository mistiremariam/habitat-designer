// ---------- HABITAT MINI-GAME (LIVE SIM MODE) ----------
document.addEventListener("DOMContentLoaded", () => {
  const introScreen = document.getElementById("intro-screen");
  const introText = document.getElementById("intro-text");
  const launchBtn = document.getElementById("launch-btn");

  const briefing = [
    "Commander, welcome aboard the Orbital Habitat One.",
    "Your mission: Maintain life support systems for 24 space hours.",
    "Assign your crew wisely to balance oxygen, power, water, and temperature.",
    "Survive the void. Humanity depends on your success."
  ];

  let i = 0, j = 0;
  function typeEffect() {
    if (i < briefing.length) {
      if (j < briefing[i].length) {
        introText.textContent += briefing[i][j];
        j++;
        setTimeout(typeEffect, 30);
      } else {
        introText.textContent += "\n\n";
        i++;
        j = 0;
        setTimeout(typeEffect, 400);
      }
    } else {
      launchBtn.style.opacity = 1;
      launchBtn.style.pointerEvents = "auto";
    }
  }

  typeEffect();

  launchBtn.addEventListener("click", () => {
    document.getElementById("ui-click")?.play();
    introScreen.classList.add("fade-out");
    setTimeout(() => {
      introScreen.remove();
      // start ambient background sound or show crew bios
    }, 1500);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const hourDisplay = document.getElementById("hour-display");
  const eventText = document.getElementById("event-text");
  const overlay = document.getElementById("overlay");
  const endMessageTitle = document.getElementById("end-message-title");
  const endMessageText = document.getElementById("end-message-text");
  const restartBtn = document.getElementById("restart-btn");
  const nextBtn = document.getElementById("next-hour-btn");

  // System Elements
  const systems = {
    oxygen: document.getElementById("oxygen-bar"),
    power: document.getElementById("power-bar"),
    water: document.getElementById("water-bar"),
    temperature: document.getElementById("temperature-bar"),
  };

  const systemValues = {
    oxygen: 100,
    power: 100,
    water: 100,
    temperature: 100,
  };

  // Crew
  const crewMembers = document.querySelectorAll(".crew");
  const systemPanels = document.querySelectorAll(".system");
  let selectedCrew = null;
  let crewAssignments = {};

  // --- CREW SELECTION ---
  crewMembers.forEach(crew => {
    crew.addEventListener("click", () => {
      if (selectedCrew === crew) {
        crew.classList.remove("selected");
        selectedCrew = null;
        return;
      }
      crewMembers.forEach(c => c.classList.remove("selected"));
      crew.classList.add("selected");
      selectedCrew = crew;
    });
  });

  // --- ASSIGN CREW TO SYSTEM ---
  systemPanels.forEach(system => {
    system.addEventListener("click", () => {
      if (!selectedCrew) return;
      const systemName = system.dataset.system;
      const crewName = selectedCrew.querySelector("span").textContent;

      // Remove previous assignment
      for (let key in crewAssignments) {
        if (crewAssignments[key] === crewName) {
          delete crewAssignments[key];
        }
      }

      crewAssignments[systemName] = crewName;

      // Update UI
      const label = system.querySelector("h3");
      label.innerHTML = `${systemName[0].toUpperCase() + systemName.slice(1)} <span style="font-size:0.8rem; color:#7fffd4;">(${crewName})</span>`;

      selectedCrew.classList.remove("selected");
      selectedCrew = null;
    });
  });

  // --- SIMULATION VARIABLES ---
  let hour = 1;
  let interval = null;
  let running = false;
  const hourDuration = 4000; // 1 hour = 4 seconds

  // --- START / PAUSE BUTTON ---
  nextBtn.textContent = "Start Mission ▶️";
  nextBtn.addEventListener("click", () => {
    if (!running) {
      running = true;
      nextBtn.textContent = "Pause ⏸️";
      startSimulation();
    } else {
      running = false;
      nextBtn.textContent = "Resume ▶️";
      clearInterval(interval);
    }
  });

  // --- SIMULATION LOOP ---
  function startSimulation() {
    interval = setInterval(() => {
      if (hour >= 24) {
        clearInterval(interval);
        return endGame(true);
      }

      hour++;
      hourDisplay.textContent = hour;
      updateSystems();
      checkStatus();
    }, hourDuration);
  }

  // --- SYSTEM UPDATES ---
  function updateSystems() {
    let log = [];

    for (const system in systemValues) {
      let decay = Math.random() * 10 + 6;
      let bonus = 0;

      if (crewAssignments[system]) {
        bonus = 7;
        log.push(`🧑‍🚀 ${crewAssignments[system]} stabilized ${system}.`);
      } else {
        log.push(`⚠️ ${system} unattended, levels dropping.`);
      }

      systemValues[system] = Math.max(0, systemValues[system] - (decay - bonus));

      // Animate progress bars
      systems[system].style.width = `${systemValues[system]}%`;
      document.getElementById(`${system}-value`).textContent = `${Math.round(systemValues[system])}%`;
    }

    const events = [
      "☄️ A small meteor passed nearby.",
      "🌕 Solar radiation disrupted power.",
      "💧 Water recycler overloaded.",
      "🌬️ Oxygen filter repaired.",
      "🔋 Solar panels charging smoothly.",
      "🛰️ Communication relay aligned."
    ];
    log.push(events[Math.floor(Math.random() * events.length)]);
    eventText.innerHTML = log.join("<br>");
  }

  // --- STATUS CHECK ---
  function checkStatus() {
    const values = Object.values(systemValues);
    if (values.some(v => v <= 0)) {
      clearInterval(interval);
      endGame(false);
    } else if (hour === 24) {
      clearInterval(interval);
      endGame(true);
    }
  }

  // --- END GAME ---
  function endGame(success) {
    overlay.classList.remove("hidden");
    running = false;
    nextBtn.textContent = "Restart ▶️";

    if (success) {
      endMessageTitle.textContent = "🎉 Mission Success!";
      endMessageText.textContent = "Your crew survived 24 hours in orbit. Excellent management, Commander!";
    } else {
      endMessageTitle.textContent = "💀 Mission Failed!";
      endMessageText.textContent = "A system has collapsed... life support lost.";
    }
  }

  // --- RESTART ---
  restartBtn.addEventListener("click", resetGame);
  nextBtn.addEventListener("click", () => {
    if (nextBtn.textContent === "Restart ▶️") resetGame();
  });

  function resetGame() {
    overlay.classList.add("hidden");
    hour = 1;
    hourDisplay.textContent = hour;
    for (const key in systemValues) {
      systemValues[key] = 100;
      systems[key].style.width = "100%";
      document.getElementById(`${key}-value`).textContent = "100%";
    }
    crewAssignments = {};
    document.querySelectorAll(".system h3").forEach(el => {
      el.innerHTML = el.textContent.split(" ")[0];
    });
    eventText.textContent = "Mission restarted. Assign your crew and continue.";
    nextBtn.textContent = "Start Mission ▶️";
    running = false;
    clearInterval(interval);
  }

  // --- NASA BACKGROUND (SPACE VIBE) ---
  async function fetchEarthImage() {
    try {
      const response = await fetch('https://epic.gsfc.nasa.gov/api/natural');
      const data = await response.json();
      if (data.length > 0) {
        const date = data[0].date.split(' ')[0].replace(/-/g, '/');
        const image = data[0].image;
        const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date}/jpg/${image}.jpg`;
        document.body.style.backgroundImage = `url(${imageUrl})`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.transition = "background 2s ease";
      }
    } catch {
      console.log("NASA API unavailable, using default background.");
    }
  }

  fetchEarthImage();
});
