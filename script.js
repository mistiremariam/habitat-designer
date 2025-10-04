document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".item");
  const habitat = document.getElementById("habitat");
  const message = document.getElementById("message");

  let placedItems = new Set();

  // Enable dragging
  items.forEach(item => {
    item.addEventListener("dragstart", dragStart);
  });

  // Habitat drop area
  habitat.addEventListener("dragover", dragOver);
  habitat.addEventListener("drop", dropItem);

  function dragStart(e) {
    e.dataTransfer.setData("text", e.target.id);
  }

  function dragOver(e) {
    e.preventDefault();
  }

  function dropItem(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text");
    const dragged = document.getElementById(id);

    // Clone the element (so it stays in the menu too)
    const clone = dragged.cloneNode(true);
    clone.classList.add("placed");
    clone.removeAttribute("draggable");
    clone.style.position = "absolute";

    // Random position inside the habitat
    const rect = habitat.getBoundingClientRect();
    const x = e.clientX - rect.left - 25;
    const y = e.clientY - rect.top - 25;
    clone.style.left = `${x}px`;
    clone.style.top = `${y}px`;

    habitat.appendChild(clone);

    placedItems.add(id);
    checkCompletion();
  }

  function checkCompletion() {
    const required = ["tree", "water", "shelter"];
    const done = required.every(item => placedItems.has(item));

    if (done) {
      message.textContent = "🌎 Great job! Your habitat is complete!";
      message.classList.add("show");
    }
  }

  // Reset button
  document.getElementById("reset").addEventListener("click", () => {
    habitat.innerHTML = "";
    placedItems.clear();
    message.textContent = "";
    message.classList.remove("show");
  });
});
// --- NASA API Integration Example ---
// Fetch real-time Earth imagery from NASA EPIC API

async function fetchEarthImage() {
  const response = await fetch('https://epic.gsfc.nasa.gov/api/natural');
  const data = await response.json();
  if (data.length > 0) {
    const date = data[0].date.split(' ')[0].replace(/-/g, '/');
    const image = data[0].image;
    const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date}/jpg/${image}.jpg`;
    document.body.style.backgroundImage = `url(${imageUrl})`;
  }
}

// Fetch current Mars weather
async function fetchMarsWeather() {
  const response = await fetch('https://api.maas2.apollorion.com/');
  const data = await response.json();
  if (data && data.min_temp) {
    document.getElementById('mars-data').innerText =
      `Mars Weather: ${data.min_temp}°C to ${data.max_temp}°C, Wind: ${data.wind_speed} m/s`;
  }
}

// Call the APIs when relevant modules are activated
document.getElementById('btn-earth').addEventListener('click', fetchEarthImage);
document.getElementById('btn-mars').addEventListener('click', fetchMarsWeather);
