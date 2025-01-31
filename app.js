import apiHandler from "./apiHandler.js";
import pagination from "./pagination.js";
import characters from "./characters.js";

pageSetup();

function pageSetup() {
  fetchCharacters();
  paginationSetup();

  document
    .querySelector("#searchInput")
    .addEventListener("input", updateAutoCompleteList);
}
import apiHandler from "./apiHandler.js";
import pagination from "./pagination.js";
import characters from "./characters.js";

async function fetchCharacters() {
  let nextUrl = "https://swapi.dev/api/people/";

  while (nextUrl) {
    const data = await apiHandler.fetchData(nextUrl);

    data.results.forEach((character) => {
      characters.pushCharacter(character);
    });

    nextUrl = data.next;
  }

  pagination.setNmbrOfPosts(characters.getCharacters().length);
  renderCharacters();
}

function paginationSetup() {
  const prevRef = document.querySelector("#prevPageBtn");
  const nextRef = document.querySelector("#nextPageBtn");

  prevRef.addEventListener("click", () => {
    pagination.previousPage();
    renderCharacters();
  });

  nextRef.addEventListener("click", () => {
    pagination.nextPage();
    renderCharacters();
  });
}

function renderCharacters() {
  const currentPage = pagination.getCurrentPage();
  const itemsPerPage = 8;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedCharacters = characters
    .getCharacters()
    .slice(startIndex, endIndex);

  const listRef = document.querySelector("#charactersList");
  listRef.innerHTML = "";

  let counter = itemsPerPage;
  if (currentPage === 11) {
    counter = 2;
  }

  for (let i = 0; i < counter; i++) {
    const listItemRef = document.createElement("li");
    listItemRef.textContent = displayedCharacters[i].name;
    listItemRef.classList.add("characters__list-item");
    listRef.appendChild(listItemRef);

    listItemRef.addEventListener("click", (event) => {
      const listItemRefs = document.querySelectorAll(".characters__list-item");
      listItemRefs.forEach((ref) => {
        ref.classList.remove("active");
      });

      event.target.classList.add("active");

      renderPersonDetails(displayedCharacters[i].url);
      renderHomeworldDetails(displayedCharacters[i].homeworld);
    });
  }
  pagination.updatePaginationDisplay();
}
