const mealData = {
  favorites: {
    limit: 1,
    min: 1,
    items: [
      { name: "Pizza", image: "images/pizza.jpg", emoji: "🍕" },
      { name: "Chicken Nuggets", image: "images/chicken-nuggets.jpg", emoji: "🍗" },
    ],
  },
  others: {
    limit: 4,
    min: 0,
    items: [
      { name: "Sushi", image: "images/sushi.jpg", emoji: "🍣" },
      { name: "Rotisserie chicken", image: "images/rotisserie-chicken.jpg", emoji: "🍗" },
      { name: "Pulled Pork", image: "images/pulled-pork.jpg", emoji: "🥪" },
      { name: "Quesadilla", image: "images/quesadilla.jpg", emoji: "🫓" },
      { name: "Baked Beans", image: "images/baked-beans.jpg", emoji: "🫘" },
      { name: "Ham Biscuit", image: "images/ham-biscuit.jpg", emoji: "🥐" },
      { name: "Turkey", image: "images/turkey.jpg", emoji: "🦃" },
      { name: "Steak", image: "images/steak.jpg", emoji: "🥩" },
      { name: "Chicken tikka masala", image: "images/chicken-tikka-masala.jpg", emoji: "🍛" },
      { name: "Peanut butter and jelly", image: "images/pbj.jpg", emoji: "🥪" },
      { name: "Burger", image: "images/burger.jpg", emoji: "🍔" },
      { name: "Pancake and sausage on stick", image: "images/pancake-sausage.jpg", emoji: "🥞" },
    ],
  },
  veggies: {
    limit: 3,
    min: 3,
    items: [
      { name: "Edamame", image: "images/edamame.jpg", emoji: "🫛" },
      { name: "Broccoli", image: "images/broccoli.jpg", emoji: "🥦" },
      { name: "Carrots", image: "images/carrots.jpg", emoji: "🥕" },
      { name: "Mixed vegetables", image: "images/mixed-vegetables.jpg", emoji: "🥗" },
      { name: "Corn", image: "images/corn.jpg", emoji: "🌽" },
      { name: "Green beans", image: "images/green-beans.jpg", emoji: "🫘" },
    ],
  },
  fruits: {
    limit: 3,
    min: 2,
    items: [
      { name: "Apple", image: "images/apple.jpg", emoji: "🍎" },
      { name: "Banana", image: "images/banana.jpg", emoji: "🍌" },
      { name: "Strawberry", image: "images/strawberry.jpg", emoji: "🍓" },
      { name: "Mango", image: "images/mango.jpg", emoji: "🥭" },
      { name: "Blueberries", image: "images/blueberries.jpg", emoji: "🫐" },
      { name: "Grapes", image: "images/grapes.jpg", emoji: "🍇" },
    ],
  },
};

const gridIds = {
  favorites: "favorites-grid",
  others: "others-grid",
  veggies: "veggies-grid",
  fruits: "fruits-grid",
};

const selections = {
  favorites: new Set(),
  others: new Set(),
  veggies: new Set(),
  fruits: new Set(),
};

const statusMessage = document.getElementById("status-message");
const reviewButton = document.getElementById("review-button");
const summarySection = document.getElementById("summary");
const backButton = document.getElementById("back-button");

function buildCard(groupKey, item) {
  const card = document.createElement("label");
  card.className = "meal-card";
  card.setAttribute("data-group", groupKey);

  const input = document.createElement("input");
  input.type = groupKey === "favorites" ? "radio" : "checkbox";
  input.name = groupKey;
  input.value = item.name;
  input.addEventListener("change", () => handleSelection(groupKey, item.name, input.checked));

  const imageWrap = document.createElement("div");
  imageWrap.className = "image-wrap";

  const img = document.createElement("img");
  img.src = item.image;
  img.alt = item.name;
  img.loading = "lazy";
  img.addEventListener("error", () => {
    img.remove();
    const emoji = document.createElement("span");
    emoji.className = "emoji";
    emoji.textContent = item.emoji;
    imageWrap.appendChild(emoji);
  });

  imageWrap.appendChild(img);

  const label = document.createElement("div");
  label.className = "meal-label";
  label.textContent = item.name;

  card.appendChild(input);
  card.appendChild(imageWrap);
  card.appendChild(label);

  return card;
}

function renderCards() {
  Object.keys(mealData).forEach((groupKey) => {
    const grid = document.getElementById(gridIds[groupKey]);
    mealData[groupKey].items.forEach((item) => {
      grid.appendChild(buildCard(groupKey, item));
    });
  });
}

function handleSelection(groupKey, itemName, isChecked) {
  const group = mealData[groupKey];
  const selectedItems = selections[groupKey];

  if (groupKey === "favorites") {
    selectedItems.clear();
    if (isChecked) {
      selectedItems.add(itemName);
    }
  } else if (isChecked) {
    if (selectedItems.size < group.limit) {
      selectedItems.add(itemName);
    }
  } else {
    selectedItems.delete(itemName);
  }

  updateCardStates(groupKey);
  updateStatus();
}

function updateCardStates(groupKey) {
  const group = mealData[groupKey];
  const selectedItems = selections[groupKey];
  const cards = document.querySelectorAll(`.meal-card[data-group="${groupKey}"]`);

  cards.forEach((card) => {
    const input = card.querySelector("input");
    const isSelected = selectedItems.has(input.value);
    card.classList.toggle("selected", isSelected);
    input.checked = isSelected;
  });

  if (groupKey !== "favorites") {
    const atLimit = selectedItems.size >= group.limit;
    cards.forEach((card) => {
      const input = card.querySelector("input");
      const shouldDisable = atLimit && !selectedItems.has(input.value);
      card.classList.toggle("disabled", shouldDisable);
      input.disabled = shouldDisable;
    });
  }
}

function updateStatus() {
  const favoriteCount = selections.favorites.size;
  const veggieCount = selections.veggies.size;
  const fruitCount = selections.fruits.size;

  const hasFavorites = favoriteCount === mealData.favorites.min;
  const hasVeggies = veggieCount === mealData.veggies.min;
  const fruitOk =
    fruitCount >= mealData.fruits.min && fruitCount <= mealData.fruits.limit;

  const allReady = hasFavorites && hasVeggies && fruitOk;

  reviewButton.disabled = !allReady;

  if (allReady) {
    statusMessage.textContent = "All set! Tap Show My Meals.";
  } else {
    statusMessage.textContent = "Keep picking food!";
  }
}

function fillSummary(listId, items) {
  const list = document.getElementById(listId);
  list.innerHTML = "";
  if (items.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No picks yet";
    list.appendChild(empty);
    return;
  }
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

reviewButton.addEventListener("click", () => {
  fillSummary("summary-favorites", [...selections.favorites]);
  fillSummary("summary-others", [...selections.others]);
  fillSummary("summary-veggies", [...selections.veggies]);
  fillSummary("summary-fruits", [...selections.fruits]);
  summarySection.hidden = false;
  summarySection.scrollIntoView({ behavior: "smooth" });
});

backButton.addEventListener("click", () => {
  summarySection.hidden = true;
  document.querySelector("header").scrollIntoView({ behavior: "smooth" });
});

renderCards();
updateStatus();
