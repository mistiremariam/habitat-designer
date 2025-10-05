// ---------- HABITAT MINI-GAME (LIVE SIM MODE) ----------
document.addEventListener("DOMContentLoaded", () => {
  // --- INTRO SCREEN ---
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
        setTimeout(typeEffect, 25);
      } else {
        introText.textContent += "\n\n";
        i++;
        j = 0;
        setTimeout(typeEffect, 400);
      }
    } else {
      launchBtn.style.opacity = "1";
      launchBtn.style.pointerEvents = "auto";
    }
  }

  typeEffect();

  launchBtn.addEventListener("click", () => {
    document.getElementById("ui-click")?.play();
    introScreen.classList.add("fade-out");
    setTimeout(() => {
      introScreen.remove();
      // You could start ambient sound or open crew briefing here
    }, 1500);
  });

  // --- MAIN SIMULATION SETUP ---
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
      } else {
        crewMembers.forEach(c => c.classList.remove("selected"));
        crew.classList.add("selected");
        selectedCrew = crew;
      }
    });
  });

  // --- ASSIGN CREW TO SYSTEM ---
  systemPanels.forEach(panel => {
    panel.addEventListener("click", () => {
      if (!selectedCrew) return;
      const systemName = panel.dataset.system;
      const crewName = selectedCrew.querySelector("span").textContent;

      // Remove any previous assignment of this crew
      for (const key in crewAssignments) {
        if (crewAssignments[key] === crewName) delete crewAssignments[key];
      }

      // Assign
      crewAssignments[systemName] = crewName;

      // Update UI label
      const label = panel.querySelector("h3");
      label.innerHTML = `${systemName[0].toUpperCase() + systemName.slice(1)} 
        <span style="font-size:0.8rem; color:#7fffd4;">(${crewName})</span>`;

      selectedCrew.classList.remove("selected");
      selectedCrew = null;
    });
  });

  // --- SIMULATION VARIABLES ---
  let hour = 1;
  let interval = null;
  let running = false;
  const hourDuration = 4000; // 1 hour = 4 seconds

  // --- CONTROL BUTTON ---
  nextBtn.textContent = "Start Mission ▶️";
  nextBtn.addEventListener("click", () => {
    if (nextBtn.textContent.includes("Restart")) return resetGame();

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
      if (hour >= 24) return endGame(true);
      hour++;
      hourDisplay.textContent = hour;
      updateSystems();
      checkStatus();
    }, hourDuration);
  }

  // --- SYSTEM UPDATES ---
  function updateSystems() {
    const log = [];

    for (const system in systemValues) {
      const decay = Math.random() * 10 + 6;
      const assignedCrew = crewAssignments[system];
      const bonus = assignedCrew ? 7 : 0;

      systemValues[system] = Math.max(0, systemValues[system] - (decay - bonus));
      systems[system].style.width = `${systemValues[system]}%`;
      document.getElementById(`${system}-value`).textContent = `${Math.round(systemValues[system])}%`;

      if (assignedCrew)
        log.push(`🧑‍🚀 ${assignedCrew} stabilized ${system}.`);
      else
        log.push(`⚠️ ${system} unattended, levels dropping.`);
    }

    const randomEvents = [
      "☄️ A small meteor passed nearby.",
      "🌕 Solar radiation disrupted power.",
      "💧 Water recycler overloaded.",
      "🌬️ Oxygen filter repaired.",
      "🔋 Solar panels charging smoothly.",
      "🛰️ Communication relay aligned."
    ];
    log.push(randomEvents[Math.floor(Math.random() * randomEvents.length)]);

    eventText.innerHTML = log.join("<br>");
  }

  // --- STATUS CHECK ---
  function checkStatus() {
    if (Object.values(systemValues).some(v => v <= 0)) {
      endGame(false);
    } else if (hour >= 24) {
      endGame(true);
    }
  }

  // --- END GAME ---
  function endGame(success) {
    clearInterval(interval);
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

  function resetGame() {
    clearInterval(interval);
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
  }

  
  fetchEarthImage();
});
