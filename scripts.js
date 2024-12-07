document.addEventListener("DOMContentLoaded", async function () {
  // Load recipes from JSON file
  let recipesData;
  try {
    const response = await fetch("recipes.json");
    const data = await response.json();
    recipesData = data.recipes;
    renderRecipes(recipesData);
    attachTableRecipeListeners();
  } catch (error) {
    console.error("Error loading recipes:", error);
    return;
  }

  function renderRecipes(recipes) {
    const recipesGrid = document.querySelector(".recipes-grid");
    recipesGrid.innerHTML = ""; // Clear existing content

    Object.values(recipes).forEach((recipe) => {
      const recipeCard = `
        <div class="recipe-card" data-category="${
          recipe.category
        }" data-prep-time="${recipe.prepTime}">
            <div class="recipe-image-container">
                <div class="recipe-image">${recipe.image}</div>
                <div class="recipe-difficulty ${recipe.difficulty.toLowerCase()}">${
        recipe.difficulty
      }</div>
                <div class="recipe-category-badge">${getCategoryIcon(
                  recipe.category
                )}</div>
            </div>
            <div class="recipe-content">
                <h5>${recipe.name.he}</h5>
                <div class="recipe-quick-info">
                    <span class="prep-time">⏱️ ${recipe.prepTime} דקות</span>
                    <span class="servings">👥 ${recipe.servings} ${
        recipe.category === "dessert" ? "יחידות" : "מנות"
      }</span>
                    <span class="difficulty">⭐ ${recipe.difficulty}</span>
                </div>
                <div class="recipe-ingredients-preview">
                    <h6>מצרכים עיקריים:</h6>
                    <div class="main-ingredients">
                        ${recipe.ingredients
                          .slice(0, 3)
                          .map((ing) => `<span>${ing.emoji} ${ing.item}</span>`)
                          .join("")}
                        ${
                          recipe.ingredients.length > 3
                            ? `<span class="more-ingredients">+${
                                recipe.ingredients.length - 3
                              } נוספים...</span>`
                            : ""
                        }
                    </div>
                </div>
                <div class="recipe-tags">
                    ${recipe.tags
                      .map((tag) => `<span class="tag">#${tag}</span>`)
                      .join("")}
                </div>
                <div class="recipe-nutrition-preview">
                    <span title="קלוריות">🔥 ${
                      recipe.nutritionFacts.calories
                    } קל'</span>
                    <span title="חלבונים">🥩 ${
                      recipe.nutritionFacts.protein
                    }g</span>
                    <span title="פחמימות">🍚 ${
                      recipe.nutritionFacts.carbs
                    }g</span>
                    <span title="שומנים">🥑 ${recipe.nutritionFacts.fat}g</span>
                </div>
                <button class="view-recipe" data-recipe-name="${
                  recipe.name.he
                }">למתכון המלא</button>
            </div>
        </div>
      `;
      recipesGrid.insertAdjacentHTML("beforeend", recipeCard);
    });

    attachRecipeEventListeners();
  }

  // פונקציה עזר לקבלת אייקון קטגוריה
  function getCategoryIcon(category) {
    const icons = {
      breakfast: "🌅 ארוחת בוקר",
      lunch: "🌞 צהריים",
      dinner: "🌙 ערב",
      dessert: "🍪 קינוח",
      night: "🌛 לילה",
    };
    return icons[category] || category;
  }

  function attachRecipeEventListeners() {
    document.querySelectorAll(".view-recipe").forEach((button) => {
      button.addEventListener("click", function () {
        const recipeName = this.getAttribute("data-recipe-name");
        const recipe = recipesData[recipeName];

        if (recipe) {
          const modalContent = `
            <div class="recipe-header">
                <h3>${recipe.name.he}</h3>
                <span class="close-modal">&times;</span>
            </div>

            <div class="recipe-meta">
                <span>⏱️ זמן הכנה: ${recipe.prepTime} דקות</span>
                <span>👥 מספר מנות: ${recipe.servings}</span>
                <span>📊 רמת קושי: ${recipe.difficulty}</span>
                <span>🏷️ קטגוריה: ${recipe.category}</span>
            </div>

            <div class="recipe-tags">
                ${recipe.tags.map((tag) => `<span>#${tag}</span>`).join("")}
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="ingredients-section">
                    <h4>מצרכים 🛒</h4>
                    <ul class="ingredients-list">
                        ${formatIngredients(recipe.ingredients)}
                    </ul>
                </div>

                <div class="instructions-section">
                    <h4>אופן ההכנה 👩‍🍳</h4>
                    <ol class="instructions-list">
                        ${formatInstructions(recipe.instructions)}
                    </ol>
                </div>
            </div>

            <div class="nutrition-facts">
                <h4>ערכים תזונתיים</h4>
                <div class="nutrition-grid">
                    <div>🔥 קלוריות: ${recipe.nutritionFacts.calories}</div>
                    <div>🥩 חלבונים: ${recipe.nutritionFacts.protein}g</div>
                    <div>🍚 פחמימות: ${recipe.nutritionFacts.carbs}g</div>
                    <div>🥑 שומנים: ${recipe.nutritionFacts.fat}g</div>
                </div>
            </div>
          `;

          document.getElementById("recipe-details-content").innerHTML =
            modalContent;
          document.getElementById("recipe-modal").style.display = "block";
        }
      });
    });
  }

  function showLoadingAnimation(recipeCard) {
    recipeCard.style.opacity = "0.7";
    recipeCard.style.transform = "scale(0.98)";

    setTimeout(() => {
      recipeCard.style.opacity = "1";
      recipeCard.style.transform = "scale(1)";
    }, 300);
  }

  // Format ingredients for display
  function formatIngredients(ingredients) {
    return ingredients
      .map(
        (ing) => `<li>${ing.emoji} ${ing.amount} ${ing.unit} ${ing.item}</li>`
      )
      .join("");
  }

  // Format instructions for display
  function formatInstructions(instructions) {
    return instructions
      .map(
        (inst) =>
          `<li>
        ${inst.text}
        <div class="instruction-tip">💡 טיפ: ${inst.tip}</div>
      </li>`
      )
      .join("");
  }

  // Format nutrition facts
  function formatNutrition(nutrition) {
    return `
      <div class="nutrition-facts">
        <h4>ערכים תזונתיים</h4>
        <div class="nutrition-grid">
          <div>קלוריות: ${nutrition.calories}</div>
          <div>חלבונים: ${nutrition.protein}g</div>
          <div>פחמימות: ${nutrition.carbs}g</div>
          <div>שומנים: ${nutrition.fat}g</div>
        </div>
      </div>
    `;
  }

  // Filter recipes by category
  document.querySelectorAll(".category-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.dataset.category;

      // Update active button
      document
        .querySelectorAll(".category-btn")
        .forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Filter recipe cards
      document.querySelectorAll(".recipe-card").forEach((card) => {
        if (category === "all" || card.dataset.category === category) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  // Close Modal
  document.querySelector(".close-modal").addEventListener("click", function () {
    document.getElementById("recipe-modal").style.display = "none";
  });

  // Close Modal when clicking outside
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("recipe-modal");
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // עדכון פונקציונליות החיפוש והפילטרים
  const searchInput = document.getElementById("recipe-search");
  const difficultyFilter = document.getElementById("difficulty-filter");
  const timeFilter = document.getElementById("time-filter");
  const activeFilters = document.querySelector(".active-filters");
  const clearSearchBtn = document.querySelector(".clear-search");

  let currentFilters = {
    search: "",
    difficulty: "",
    time: "",
    category: "all",
  };

  // פונקציה לעדכון הפילטרים הפעילים
  function updateActiveFilters() {
    activeFilters.innerHTML = "";

    Object.entries(currentFilters).forEach(([key, value]) => {
      if (value && value !== "all") {
        const filterTag = document.createElement("span");
        filterTag.className = "active-filter";
        filterTag.innerHTML = `
          ${getFilterLabel(key, value)}
          <span class="remove-filter" data-filter-type="${key}">×</span>
        `;
        activeFilters.appendChild(filterTag);
      }
    });
  }

  // פונקציה להמרת סוג הפילטר לתווית בעברית
  function getFilterLabel(type, value) {
    switch (type) {
      case "search":
        return `חיפוש: ${value}`;
      case "difficulty":
        return `רמת קושי: ${value}`;
      case "time":
        return `זמן הכנה: עד ${value} דקות`;
      case "category":
        return `קטגוריה: ${value}`;
      default:
        return value;
    }
  }

  // אירועי שינוי בפילטרים
  searchInput.addEventListener("input", function (e) {
    currentFilters.search = this.value;
    if (this.value) {
      clearSearchBtn.style.display = "block";
    } else {
      clearSearchBtn.style.display = "none";
    }
    updateActiveFilters();
    filterRecipes();
  });

  clearSearchBtn.addEventListener("click", function () {
    searchInput.value = "";
    currentFilters.search = "";
    this.style.display = "none";
    updateActiveFilters();
    filterRecipes();
  });

  difficultyFilter.addEventListener("change", function () {
    currentFilters.difficulty = this.value;
    updateActiveFilters();
    filterRecipes();
  });

  timeFilter.addEventListener("change", function () {
    currentFilters.time = this.value;
    updateActiveFilters();
    filterRecipes();
  });

  // הסרת פילטרים בודדים
  activeFilters.addEventListener("click", function (e) {
    if (e.target.classList.contains("remove-filter")) {
      const filterType = e.target.dataset.filterType;

      switch (filterType) {
        case "search":
          searchInput.value = "";
          clearSearchBtn.style.display = "none";
          break;
        case "difficulty":
          difficultyFilter.value = "";
          break;
        case "time":
          timeFilter.value = "";
          break;
        case "category":
          document.querySelector('.category-btn[data-category="all"]').click();
          break;
      }

      currentFilters[filterType] = "";
      updateActiveFilters();
      filterRecipes();
    }
  });

  // פונקציית הפילטור
  function filterRecipes() {
    const recipes = document.querySelectorAll(".recipe-card");

    recipes.forEach((recipe) => {
      let shouldShow = true;

      // בדיקת חיפוש
      if (currentFilters.search) {
        const recipeText = recipe.textContent.toLowerCase();
        shouldShow = recipeText.includes(currentFilters.search.toLowerCase());
      }

      // בדיקת רמת קושי
      if (shouldShow && currentFilters.difficulty) {
        const recipeDifficulty =
          recipe.querySelector(".recipe-difficulty").textContent;
        shouldShow = recipeDifficulty === currentFilters.difficulty;
      }

      // בדיקת זמן הכנה
      if (shouldShow && currentFilters.time) {
        const prepTime = parseInt(recipe.dataset.prepTime);
        shouldShow = prepTime <= parseInt(currentFilters.time);
      }

      // בדיקת קטגוריה
      if (shouldShow && currentFilters.category !== "all") {
        shouldShow = recipe.dataset.category === currentFilters.category;
      }

      recipe.style.display = shouldShow ? "block" : "none";
    });
  }

  // עדכון הקטגוריות
  document.querySelectorAll(".category-btn, .filter-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const category = this.dataset.category;

      // עדכון כפתורים פעילים
      document.querySelectorAll(".category-btn, .filter-btn").forEach((btn) => {
        btn.classList.remove("active");
        if (btn.dataset.category === category) {
          btn.classList.add("active");
        }
      });

      currentFilters.category = category;
      updateActiveFilters();
      filterRecipes();
    });
  });

  // הוספת מאזיני לחיצה לכפתורי המתכונים
  document.querySelectorAll(".recipe-link").forEach((button) => {
    button.addEventListener("click", function (e) {
      e.stopPropagation(); // מניעת הפעלת אירועים נוספים
      const recipeName = this.dataset.recipe;
      showRecipeModal(recipeName);
    });
  });

  // פונקציה להצגת מודל מתכון
  function showRecipeModal(recipeName) {
    const recipe = recipesData[recipeName];
    if (recipe) {
      const modalContent = `
        <div class="recipe-header">
            <h3>${recipe.name.he}</h3>
            <span class="close-modal" title="לחץ ESC לסגירה">&times;</span>
        </div>

        <div class="recipe-meta">
            <span>⏱️ זמן הכנה: ${recipe.prepTime} דקות</span>
            <span>👥 מספר מנות: ${recipe.servings}</span>
            <span>📊 רמת קושי: ${recipe.difficulty}</span>
            <span>🏷️ קטגוריה: ${recipe.category}</span>
        </div>

        <div class="recipe-tags">
            ${recipe.tags.map((tag) => `<span>#${tag}</span>`).join("")}
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="ingredients-section">
                <h4>מצרכים 🛒</h4>
                <ul class="ingredients-list">
                    ${formatIngredients(recipe.ingredients)}
                </ul>
            </div>

            <div class="instructions-section">
                <h4>אופן ההכנה 👩‍🍳</h4>
                <ol class="instructions-list">
                    ${formatInstructions(recipe.instructions)}
                </ol>
            </div>
        </div>

        <div class="nutrition-facts">
            <h4>ערכים תזונתיים</h4>
            <div class="nutrition-grid">
                <div>🔥 קלוריות: ${recipe.nutritionFacts.calories}</div>
                <div>🥩 חלבונים: ${recipe.nutritionFacts.protein}g</div>
                <div>🍚 פחמימות: ${recipe.nutritionFacts.carbs}g</div>
                <div>🥑 שומנים: ${recipe.nutritionFacts.fat}g</div>
            </div>
        </div>
      `;

      const modal = document.getElementById("recipe-modal");
      document.getElementById("recipe-details-content").innerHTML =
        modalContent;
      modal.style.display = "block";

      // הוספת מאזין סגירה לכפתור X
      document
        .querySelector(".close-modal")
        .addEventListener("click", function () {
          modal.style.display = "none";
        });

      // הוספת מאזין לסגירה בלחיצה מחוץ למודל
      modal.addEventListener("click", function (e) {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    } else {
      console.error(`Recipe not found: ${recipeName}`);
    }
  }

  // פונקציה לסימון מתכונים זמינים בטבלאות
  function markAvailableRecipes() {
    document.querySelectorAll(".nutrition-table td div").forEach((div) => {
      const text = div.textContent.trim();
      const recipeName = text.split(" ")[1]; // הסרת האמוג'י
      if (recipesData[recipeName]) {
        div.classList.add("recipe-available");
      }
    });
  }

  // הוספת טיפים והמלצות תזונה
  function addNutritionTips() {
    document.querySelectorAll(".nutrition-table td").forEach((td) => {
      if (td.textContent.includes("טיפ")) {
        td.setAttribute("data-tip", "לחץ למידע נוסף");
        td.addEventListener("click", function () {
          showNutritionInfo(this.textContent);
        });
      }
    });
  }

  // פונקציה להצגת מידע תזונתי
  function showNutritionInfo(topic) {
    const nutritionModal = document.createElement("div");
    nutritionModal.className = "nutrition-info-modal";
    // הוספת תוכן רלוונטי בהתאם לנושא
    // ...
  }

  // קישור בין קטגוריות מזון למתכונים
  function linkFoodCategories() {
    document.querySelectorAll(".food-category").forEach((category) => {
      const categoryName = category.querySelector("h5").textContent;
      const relatedRecipes = findRelatedRecipes(categoryName);

      if (relatedRecipes.length > 0) {
        const recipesList = document.createElement("div");
        recipesList.className = "related-recipes";
        recipesList.innerHTML = `
          <h6>מתכונים מומלצים:</h6>
          ${relatedRecipes
            .map(
              (recipe) => `
            <button class="recipe-link" data-recipe="${recipe.name}">
              ${recipe.name} ${recipe.emoji}
            </button>
          `
            )
            .join("")}
        `;
        category.appendChild(recipesList);
      }
    });
  }

  // פונקציה למציאת מתכונים קשורים
  function findRelatedRecipes(category) {
    return Object.values(recipesData).filter(
      (recipe) => recipe.category === category || recipe.tags.includes(category)
    );
  }

  // פונקציה חדשה להוספת מאזיני לחיצה לכפתורי המתכונים בטבלה
  function attachTableRecipeListeners() {
    document.querySelectorAll(".recipe-link").forEach((button) => {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();
        const recipeName = this.getAttribute("data-recipe");
        showRecipeModal(recipeName);
      });
    });
  }

  // הוספת מאזין ללחיצה על ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      const modal = document.getElementById("recipe-modal");
      if (modal.style.display === "block") {
        modal.style.display = "none";
      }
    }
  });

  // הפעלת הפונקציות
  markAvailableRecipes();
  addNutritionTips();
  linkFoodCategories();
});
