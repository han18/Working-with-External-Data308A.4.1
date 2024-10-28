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

// API base URL
const BASE_URL = "https://api.thecatapi.com/v1/";
// API key
const API_KEY = "live_NYBo3ZeybZMRN9jdZ4wOl1KeKn2EX19GmP1XJlbAN8LI61krwajRAWgnVwma4KUd";

// axios config and setting header to hold info of the request
axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common["x-api-key"] = API_KEY;

// this function to load breeds into the dropdown
let initialLoad = async () => {
  try {
    const res = await axios.get("breeds");
    // to hold the given api data
    const catBreeds = res.data;
    console.log(catBreeds);

    catBreeds.forEach(breed => {
      // creating a new element option for each breed
      const option = document.createElement("option");
      // getting each breed's id 
      option.value = breed.id;
      // geeting the breeds name
      option.textContent = breed.name;
      //appened the option element to the section
      breedSelect.appendChild(option);
    });

    // to load images for the first breed
    if (catBreeds.length > 0) {
      breedSelect.value = catBreeds[0].id;
      breedSelect.dispatchEvent(new Event("change"));
    }
  } catch (err) {
    console.error(err);
  }
};

// Event handler for breed selection, change since the event is not on a click but on a change of selection
breedSelect.addEventListener("change", async () => {
  // getting the breeds value on change
  const selectedBreedId = breedSelect.value;
  if (selectedBreedId) {
    // clearing the previous content to laod new selection 
    carouselInner.innerHTML = '';
    infoDump.innerHTML = '';
    progressBar.style.width = "0%"; // eesetting progress bar

    try {
      // fetching the breeds image
      const response = await axios.get(`images/search?breed_id=${selectedBreedId}&limit=3`, {
        onDownloadProgress: updateProgress,
      });

    // from the api response getting the images  
      const cats = response.data;
      // checking if the array is empty and also has images
      if (Array.isArray(cats) && cats.length > 0) {
        //looping in the array
        cats.forEach(cat => {
          // creating a function createCarouselItem
          const carouselItem = createCarouselItem(cat.url, cat.breeds[0]?.name || "Cat", cat.id);
          appendCarousel(carouselItem);
        });

        // displying the breeds info
        const breedInfo = `Breed Name: ${cats[0].breeds[0].name || "Unknown"}`;
        infoDump.innerHTML = `<h2>${breedInfo}</h2> Cats Info: <p>${cats[0].breeds[0].description || "No description available."}</p>`;
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




