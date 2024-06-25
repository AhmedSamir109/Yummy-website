/// <reference path="../typings/globals/jquery/index.d.ts" />

const loading = document.querySelector('.loadingPage');
const searchBox= document.querySelector('#searchBox')
const displayContainer = document.querySelector('#displayContainer')
let rowData = document.getElementById("rowData");


//loading Page
$(document).ready(function(){

    getSearchMeal().then(function(){

        $('.loadingPage').fadeOut(500 , function(){

            $('body').css('overflow' , 'auto')
        })
    })
   
});



//Side Bar 
let navTapsWidth = $('.navTaps').outerWidth();

function closeSideBar(){

    $('.sideBar').animate({left : -navTapsWidth} , 700 )

        $('#close-openBtn').addClass('fa-bars')
        $('#close-openBtn').removeClass('fa-x')

}


function openSideBar(){

    $('.sideBar').animate({left : '0px' } , 700)

    $('#close-openBtn').removeClass('fa-bars')
    $('#close-openBtn').addClass('fa-x')
}



$('#close-openBtn').on('click' , function(){

    let leftValue = $('.sideBar').css('left');

    if(leftValue == '0px'){
        
        closeSideBar()

    }else{

        openSideBar()
    }

})



//start page

$('.logo').on('click' , function(){
    searchBox.innerHTML = ""
    getSearchMeal();

})


async function getSearchMeal(){

    loading.classList.remove('d-none')

    var response = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s');
    
    var data = await response.json();


    displaySearchMeal(data);

    loading.classList.add('d-none');

}

// getSearchMeal()

function displaySearchMeal(data){

    let meals = data.meals ;
    // console.log(meals)
    var divs = ''

    for(let i =0 ; i<meals.length ; i++){

        divs += `
        
            <div class="col-md-3 rounded-3 overflow-hidden p-2" id="mealImg">

                <div onclick="getMealDetails('${meals[i].idMeal}')" class="position-relative overflow-hidden" >
                    <img src="${meals[i].strMealThumb}" class="w-100 rounded-3" alt="">
                    
                    <div onclick="getMealDetails('${meals[i].idMeal}')" class="overlay rounded-3 d-flex align-items-center ">
                        <h5 class="p-2 text-black fs-3" id="mealName">${meals[i].strMeal}</h5>
                    </div>
                </div>

             </div>
        `

    }

    $('#displayContainer').html(divs);
}




// meal Details 

async function getMealDetails(mealId){

    loading.classList.remove('d-none')

    console.log(mealId)

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)

    let mealDetails = await response.json()

    displayMealDetails(mealDetails)

    loading.classList.add('d-none')

};


function displayMealDetails(mealDetails){
    displayContainer.innerHTML = ""
    
    let details = mealDetails.meals;
    console.log(details)

    let ingredients = '';
    


//to display Ingredient in li 
    for (let i = 1; i <= 20; i++) {

        if (details[0][`strIngredient${i}`]) {
           
            ingredients += `<li>${details[0][`strMeasure${i}`]} ${details[0][`strIngredient${i}`]}</li>`
        }

    }



//to display tags in li

    let tags = details[0].strTags?.split(",")     //array 
    if (!tags) tags = []                          // (!tags) --> null / undefiend / 0 
    console.log(tags)

    let tagStr = ''
    for (let i = 0 ; i<tags.length ; i++){
        tagStr += `<li>${tags[i]}</li>` ;
    }

    console.log(tagStr);

    console.log(ingredients)

    let div = `<div class="col-md-4 text-white">
                    <div>
                        <img src="${details[0].strMealThumb}" class="w-100 rounded-3" alt="">
                        <h2>${details[0].strMeal}</h2>
                    </div>
                 </div>

                <div class="col-md-8 text-white">
                <div>
                            <h2>Instructions</h2>
                            <p>${details[0].strInstructions}</p>

                            <h2>Area : ${details[0].strArea}</h2>
                            <h2>Category : ${details[0].strCategory} </h2>

                            <h2 class="mt-4">Recipes :</h2>

                            <ul class="list-unstyled d-flex flex-wrap recipes text-black mb-4">
                                
                                ${ingredients}
                            </ul>

                            <h2 >Tags :</h2>
                            <ul class="list-unstyled d-flex tags text-black mb-4">
                                ${tagStr}
                            </ul>

                           <a href="${details[0].strSource}" target="_blank"> <button class="btn btn-success">source</button></a>
                           <a href="${details[0].strYoutube}" target="_blank"><button class="btn btn-danger">youtube</button></a>
                        </div>
                </div>`


               $('#displayContainer').html(div)
}






// get meals by name

$('#navSearch').on('click' , function(){
    displayContainer.innerHTML = "";
    rowData.innerHTML ="";
    displaySearchBox()
    closeSideBar()
})

function displaySearchBox(){
    
    let div = ` <div class="row pt-3 ">
       
    <div class="col-md-6 text-white my-md-4">
       <input onkeyup="getMealByName(this.value)" type="text" placeholder="Search By Meal Name" class="form-control border-white bg-transparent text-white mb-3" id="searchByName">

   </div>

     <div class="col-md-6 text-white my-md-4">
         <input onkeyup="getMealByFirstLetter(this.value)" type="text" placeholder="Search By Meal First letter" class="form-control border-white bg-transparent text-white" id="searchByFirstLetter">
     </div>
   


   </div>`


   $('#searchBox').html(div)
}

// let mealName = $('#searchByName').val();
// $('#searchByName').on('keyup' , function(){

//     getMealByName(mealName)
// })




async function getMealByName(mealName){

    loading.classList.remove('d-none')

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`)
    let data = await response.json();

    displayMealByName(data)
    
    loading.classList.add('d-none')


}



function displayMealByName(data){
    let meals = data.meals ;
    console.log(meals)
    
    let div = ` <div class="col-md-3 rounded-3 overflow-hidden p-2" id="mealImg">

                        <div  onclick="getMealDetails('${meals[0].idMeal}')" class="position-relative overflow-hidden" >
                            <img src="${meals[0].strMealThumb}" class="w-100 rounded-3" alt="">
                            
                            <div onclick="getMealDetails('${meals[0].idMeal}')" class="overlay rounded-3 d-flex align-items-center ">
                                <h5 class="p-2 text-black fs-3" id="mealName">${meals[0].strMeal}</h5>
                            </div>
                        </div>

               </div>`

    
    displayContainer.innerHTML = div ;

}


// get meal by first letter


async function getMealByFirstLetter(firstLetter){
    loading.classList.remove('d-none')


    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${firstLetter}`)
    let data = await response.json();

    displayMealByFirstLetter(data)

    loading.classList.add('d-none')

}


function displayMealByFirstLetter(data){
    let meals = data.meals ; 

    let divs = ''

    for(let i = 0 ; i<meals.length ; i++){

    divs += ` <div class="col-md-3 rounded-3 overflow-hidden p-2" id="mealImg">

                    <div  onclick="getMealDetails('${meals[i].idMeal}')" class="position-relative overflow-hidden" >
                        <img src="${meals[i].strMealThumb}" class="w-100 rounded-3" alt="">
                        
                        <div onclick="getMealDetails('${meals[i].idMeal}')" class="overlay rounded-3 d-flex align-items-center ">
                            <h5 class="p-2 text-black fs-3" id="mealName">${meals[i].strMeal}</h5>
                        </div>
                    </div>

              </div>`

    }

displayContainer.innerHTML = divs ;
}



                                        // categories section

// meal categories 

$('#navCategory').on('click' , function(){
    displayContainer.innerHTML = "";
    searchBox.innerHTML = ""
    closeSideBar()
    getMealCategories()

})

async function getMealCategories(){

    loading.classList.remove('d-none')


    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let data = await response.json();

    displayMealCategories(data)

    loading.classList.add('d-none')


}

function displayMealCategories(data){
    let mealCategries = data.categories;

    let divs =``;

        //onclick="getMealDetails('${mealCategries[i].idCategory}')"


    for(let i = 0 ; i< mealCategries.length ; i++){

    divs += `

    <div class="col-md-3 rounded-3 overflow-hidden p-2" id="mealImg">

                    <div  onclick="getcategory('${mealCategries[i].strCategory}')" class="position-relative overflow-hidden" >
                        <img src="${mealCategries[i].strCategoryThumb}" class="w-100 rounded-3" alt="">
                        
                        <div onclick="getcategory('${mealCategries[i].strCategory}')" class="overlay rounded-3  text-center">

                            <h5 class=" text-black fs-3" id="mealName">${mealCategries[i].strCategory}</h5>
                            <p class="text-black">${mealCategries[i].strCategoryDescription.slice(0, 180)}</p>

                        </div>
                    </div>

    </div> `

    }

    displayContainer.innerHTML = divs;
}



// Filter by Category


async function getcategory(category){
    loading.classList.remove('d-none')


    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`)
    let data = await response.json();

    displayCategory(data);

    loading.classList.add('d-none')

}

function displayCategory(data){

    let mealCategory = data.meals ;
    console.log(mealCategory)
    
    let divs = ``;

    for(let i = 0 ; i<mealCategory.length ; i++){

        divs +=`

             <div class="col-md-3 rounded-3 overflow-hidden p-2" id="mealImg">

                <div onclick="getMealDetails('${mealCategory[i].idMeal}')" class="position-relative overflow-hidden" >
                    <img src="${mealCategory[i].strMealThumb}" class="w-100 rounded-3" alt="">
                    
                    <div onclick="getMealDetails('${mealCategory[i].idMeal}')" class="overlay rounded-3 d-flex align-items-center ">
                        <h5 class="p-2 text-black fs-3" id="mealName">${mealCategory[i].strMeal}</h5>
                    </div>
                </div>

             </div>
        `
    }

    displayContainer.innerHTML = divs ; 
    

}



                           // end of categories section





                           // Areas section


$('#navArea').on('click' , function(){
    displayContainer.innerHTML = "";
    searchBox.innerHTML = ""
    closeSideBar()
    getAreas()

})


async function getAreas(){
    loading.classList.remove('d-none')

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let data = await response.json();

    disblayAreas(data);

    loading.classList.add('d-none')

}



function disblayAreas(data){
    let areas = data.meals;
    let divs = ``;

    for(let i=0 ; i<areas.length ; i++){

        divs +=`
        <div onclick="getAreaMeals('${areas[i].strArea}')" class="col-md-3 text-center p-3 cursor">
                    <i class="fa-solid fa-house-flag fa-4x"></i>
                    <h3>${areas[i].strArea}</h3>
        </div>`

    }

    displayContainer.innerHTML = divs ;
}


// display areas meals

async function getAreaMeals(area){
    loading.classList.remove('d-none')

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`);
    let data = await response.json();

    displayAreaMeals(data);

    loading.classList.add('d-none')

}



function displayAreaMeals(data){

    let araeMeals = data.meals ; 

    let divs = ``;

    for(let i = 0 ; i<araeMeals.length ; i++){
      
        divs += `
        <div class="col-md-3 rounded-3 overflow-hidden p-2" id="mealImg">

                    <div onclick="getMealDetails('${araeMeals[i].idMeal}')" class="position-relative overflow-hidden" >
                        <img src="${araeMeals[i].strMealThumb}" class="w-100 rounded-3" alt="">
                        
                        <div onclick="getMealDetails('${araeMeals[i].idMeal}')" class="overlay rounded-3 d-flex align-items-center ">
                            <h5 class="p-2 text-black fs-3" id="mealName">${araeMeals[i].strMeal}</h5>
                        </div>
                    </div>

        </div>`
    }

    displayContainer.innerHTML = divs ;

}


                    // end of cats Section



// ingredients Section


$('#navIngredients').on('click' , function(){
    displayContainer.innerHTML = "";
    searchBox.innerHTML = ""
    closeSideBar()
    getIngredients()
})

async function getIngredients(){
    loading.classList.remove('d-none')

    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    let data = await response.json();

    displayIngredients(data)

    loading.classList.add('d-none')

}

function displayIngredients(data){
    let ingredients = data.meals ;
    let divs =``;


    for(let i=0 ; i<ingredients.length ; i++ ){

        divs +=`
        <div onclick="getMealsbyIngredients('${ingredients[i].strIngredient}')" class="col-md-3 text-center p-3 mb-2 cursor text-white text-center ">
                <i class="fa-solid fa-utensils fa-4x"></i>
                <h3>${ingredients[i].strIngredient}</h3>
                <p>${ingredients[i].strDescription?.slice(0,105)}</p>
        
        </div>`
        
    }

    displayContainer.innerHTML = divs ;
    
}


// to get every ingerdients meals

async function getMealsbyIngredients(meals){

    loading.classList.remove('d-none')

    let response = await fetch(`https://themealdb.com/api/json/v1/1/filter.php?i=${meals}`)
    let data = await response.json();

    displayMealsbyIngredients(data)

    loading.classList.add('d-none')

}


function displayMealsbyIngredients(data){

    let meals = data.meals ; 
    let divs = ``;


    for(let i=0 ; i<meals.length ; i++){
        divs += `
        <div class="col-md-3 rounded-3 overflow-hidden p-2" id="mealImg">

        <div onclick="getMealDetails('${meals[i].idMeal}')" class="position-relative overflow-hidden" >
            <img src="${meals[i].strMealThumb}" class="w-100 rounded-3" alt="">
            
            <div onclick="getMealDetails('${meals[i].idMeal}')" class="overlay rounded-3 d-flex align-items-center ">
                <h5 class="p-2 text-black fs-3" id="mealName">${meals[i].strMeal}</h5>
            </div>
        </div>

     </div> `
    }

    displayContainer.innerHTML = divs ;
}


//end if ingredient section



$('#navContact').on('click' , function(){
    displayContainer.innerHTML = "";
    searchBox.innerHTML = ""
    closeSideBar()
    showContacts()
})



function showContacts() {
    rowData.innerHTML = `<div class="contact min-vh-100 d-flex justify-content-center mt-5 pt-5 ">
    <div class="container w-75 text-center">
        <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input  id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input  id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
        <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
    </div>
</div> `
    submitBtn = document.getElementById("submitBtn")


    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true
    })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
    if (emailInputTouched) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }


    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}6