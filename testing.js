// import axios from "./axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element to diaplay info of the cats.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");
// getting the carousel items to display images
const carouselInner = document.getElementById("carouselInner");

// API configuration
const BASE_URL = "https://api.thecatapi.com/v1/";
const API_KEY = "live_NYBo3ZeybZMRN9jdZ4wOl1KeKn2EX19GmP1XJlbAN8LI61krwajRAWgnVwma4KUd";

// Axios configuration
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common["x-api-key"] = API_KEY;

// Function to load breeds into the dropdown
let initialLoad = async () => {
  try {
    const res = await axios.get("breeds");
    const catBreeds = res.data;

    catBreeds.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    // Optionally, you can trigger a change event here to load images for the first breed
    if (catBreeds.length > 0) {
      breedSelect.value = catBreeds[0].id;
      breedSelect.dispatchEvent(new Event("change"));
    }
  } catch (err) {
    console.error(err);
  }
};

// Event handler for breed selection
breedSelect.addEventListener("change", async () => {
  const selectedBreedId = breedSelect.value;
  if (selectedBreedId) {
    // Clear previous content
    carouselInner.innerHTML = '';
    infoDump.innerHTML = '';
    progressBar.style.width = "0%"; // Reset progress bar

    try {
      // Fetch breed images
      const response = await axios.get(`images/search?breed_id=${selectedBreedId}&limit=5`, {
        onDownloadProgress: updateProgress,
      });

      const cats = response.data;
      if (Array.isArray(cats) && cats.length > 0) {
        cats.forEach(cat => {
          const carouselItem = createCarouselItem(cat.url, cat.breeds[0]?.name || "Cat", cat.id);
          appendCarousel(carouselItem);
        });

        // Display breed information
        const breedInfo = `Breed Name: ${cats[0].breeds[0].name || "Unknown"}`;
        infoDump.innerHTML = `<h2>${breedInfo}</h2><p>${cats[0].breeds[0].description || "No description available."}</p>`;
        start(); // Start the carousel
      }
    } catch (error) {
      console.error("Error fetching breed images:", error);
    }
  }
});

// Update progress function
function updateProgress(progressEvent) {
  const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  progressBar.style.width = percentCompleted + "%";
}

// Function to create a carousel item
function createCarouselItem(imgSrc, imgAlt, imgId) {
  const template = document.querySelector("#carouselItemTemplate");
  const clone = template.content.firstElementChild.cloneNode(true);
  
  const img = clone.querySelector("img");
  img.src = imgSrc;
  img.alt = imgAlt;

  const favBtn = clone.querySelector(".favourite-button");
  favBtn.addEventListener("click", () => {
    favourite(imgId);
  });

  return clone;
}

// Function to append carousel item
function appendCarousel(element) {
  const activeItem = document.querySelector(".carousel-item.active");
  if (!activeItem) element.classList.add("active");

  carouselInner.appendChild(element);
}

// Initial call to load breeds
initialLoad();




