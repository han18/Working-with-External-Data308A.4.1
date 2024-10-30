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

// the base URL
const BASE_URL = "https://api.thecatapi.com/v1/";
// Step 0: Store your API key here for reference and easy access.
// I set my API KEY
const API_KEY =
  "live_NYBo3ZeybZMRN9jdZ4wOl1KeKn2EX19GmP1XJlbAN8LI61krwajRAWgnVwma4KUd";
//==============================================================

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

// using FETCH in this example than axios
// let response = async function () {
//     try {
//       const res = await fetch(`${BASE_URL}breeds`, {
//         method: 'GET',
//         headers: {
//           "x-api-key": API_KEY,
//         },
//       });

//       // Checking if the response data is ok
//       if (!res.ok) {
//         throw new Error(`HTTP error!`);
//       }

//       const catBreeds = await res.json();
//       console.log(catBreeds);

//       for (let i = 0; i < catBreeds.length; i++) {
//         breedSelect.innerHTML += `<option id=${catBreeds[i].id}> ${catBreeds[i].name} </option>`;
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   // calling the function
//   response();

// ======================== the axios code ==================
// using axios as an alternitive to fetch
// 4. Change all of your fetch() functions to axios!

// axios config and setting headers to hold info of the request
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

    // to load images of the first breed
    // if (catBreeds.length > 0) {
    //   breedSelect.value = catBreeds[0].id;
    //   breedSelect.dispatchEvent(new Event("change"));
    // }
  } catch (err) {
    console.error(err);
  }
};

/**
 * PART TWO: Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */

// Event handler for breed selection, change since the event is not a click event but on a change of selection
breedSelect.addEventListener("change", async () => {
  // getting the breeds value on change
  const selectedBreedId = breedSelect.value;
  if (selectedBreedId) {
    // clearing the previous content to laod new selection 
    carouselInner.innerHTML = '';
    infoDump.innerHTML = '';
    progressBar.style.width = "0%"; // setting the progress bar

    try {
      // fetching the breeds image
      const response = await axios.get(`images/search?breed_id=${selectedBreedId}&limit=3`, {
        onDownloadProgress: updateProgressBar,
      });

    // from the api response getting the images url 
      const cats = response.data;
      // checking if the array is empty and also has images
      if (Array.isArray(cats) && cats.length > 0) {
        //looping in the array
        cats.forEach(cat => {
          // creating a function createCarouselItem === // Stoped HERE===== 
          const carouselItem = createCarouselItem(cat.url, cat.breeds[0]?.name || "Cat", cat.id);
          appendCarousel(carouselItem);
        });

        // displying the breeds info
        const breedInfo = `Breed Name: ${cats[0].breeds[0].name || "Unknown"}`;
        infoDump.innerHTML = `<h2>${breedInfo}</h2> <p>Cats Info: ${cats[0].breeds[0].description || "No description of cats are available."}</p>`;
      }
    } catch (error) {
      console.error("Error fetching breed images:", error);
    }
  }
});

/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */


// ============ updating the progress bar 
function updateProgressBar(progressEvent) {
  const percentLoad = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  progressBar.style.width = percentLoad + "%";
}

// Function to create a carousel item
function createCarouselItem(imgSrc, imgAlt, imgId) {
  const template = document.querySelector("#carouselItemTemplate");
  // to create a new carouselItem element. creates a deep copy of the template
  // copied code from carousel.js
  const clone = template.content.firstElementChild.cloneNode(true);
  
  // to hold the images
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

// calling the function to load breeds
initialLoad();




