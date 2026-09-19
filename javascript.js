/* ================= SMART SEARCH ================= */

function cleanSearchText(text){
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .trim();
}

function levenshteinDistance(a, b){

    const matrix = [];

    for(let i = 0; i <= b.length; i++){
        matrix[i] = [i];
    }

    for(let j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }

    for(let i = 1; i <= b.length; i++){

        for(let j = 1; j <= a.length; j++){

            if(b.charAt(i - 1) === a.charAt(j - 1)){

                matrix[i][j] =
                    matrix[i - 1][j - 1];

            }else{

                matrix[i][j] = Math.min(

                    matrix[i - 1][j - 1] + 1,

                    matrix[i][j - 1] + 1,

                    matrix[i - 1][j] + 1

                );

            }
        }
    }

    return matrix[b.length][a.length];
}


function spellingMatch(input, target){

    input = cleanSearchText(input);
    target = cleanSearchText(target);

    if(!input || !target){
        return false;
    }

    if(
        target.includes(input) ||
        input.includes(target)
    ){
        return true;
    }

    const distance =
        levenshteinDistance(input, target);

    let allowed = 1;

    if(input.length >= 5){
        allowed = 2;
    }

    if(input.length >= 9){
        allowed = 3;
    }

    return distance <= allowed;
}


/* HOME SEARCH */

function homeSearchFood(){

    const input =
        document.getElementById("homeSearch").value.trim();

    if(!input){
        return;
    }

    const results = foods.filter(food =>

        spellingMatch(input, food.name) ||

        spellingMatch(input, food.category)

    );

    console.log("Search results:", results);
}


/* MENU SEARCH */

function searchMenu(){

    const input =
        document.getElementById("menuSearch").value.trim();

    const grid =
        document.getElementById("menuGrid");

    if(!input){

        renderMenu();

        return;
    }

    const results = foods.filter(food =>

        spellingMatch(input, food.name) ||

        spellingMatch(input, food.category)

    );


    if(!results.length){

        grid.innerHTML = `

            <div class="empty-state">

                <div>😕</div>

                <h2>No food found</h2>

                <p>
                    Try another spelling.
                </p>

            </div>

        `;

        return;
    }


    grid.innerHTML = results.map(food => `

        <article class="food-card">

            <div class="food-image">

                <img
                    src="${food.image}"
                    alt="${food.name}"
                    loading="lazy"
                >

                <span class="rating">
                    ⭐ ${food.rating}
                </span>

            </div>

            <div class="food-content">

                <span class="food-category">
                    ${food.category}
                </span>

                <h3>${food.name}</h3>

                <div class="food-bottom">

                    <strong>
                        ₹${food.price}
                    </strong>

                    <button
                        class="add-btn"
                        onclick="addToCart(${food.id})"
                    >
                        <i class="fa-solid fa-plus"></i>
                        Add
                    </button>

                </div>

            </div>

        </article>

    `).join("");
}