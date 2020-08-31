document.addEventListener("DOMContentLoaded", () => {
    const baseUrl = "http://localhost:3000/pups/"
    const dogInfo = document.getElementById("dog-info")
    const dogBar = document.getElementById("dog-bar")

    const getDogs = () => {
        fetch(baseUrl)
        .then(resp => resp.json())
        .then(dogs => renderDogs(dogs))
    }
    
    const renderDogs = (dogs) => {
        for (let dog of dogs) {
            (createDog(dog))
        }
    }

    function createDog(dogObj) {
        const dogSpan = document.createElement("span")
        const dogDiv = document.createElement("div")

        dogSpan.dataset.dogId = dogObj.id
        dogSpan.innerText = dogObj.name
        dogSpan.dataset.goodDog = dogObj.isGoodDog
      //  dogSpan.style.display = "block"

        if (dogObj.isGoodDog) {
            dogDiv.dataset.dogId = dogObj.id
            dogDiv.insertAdjacentHTML("beforeend", `
            <img src="${dogObj.image}" alt="dog-pic">
            <h2>${dogObj.name}</h2>
            <button id="good" class="good-dog">Good Dog!</button>`)
            dogDiv.style.display = "none"
        } else {
            dogDiv.dataset.dogId = dogObj.id
            dogDiv.insertAdjacentHTML("beforeend", `
            <img src="${dogObj.image}" alt="dog-pic">
            <h2>${dogObj.name}</h2>
            <button id="bad" class="bad-dog">Bad Dog!</button>`)
            dogDiv.style.display = "none"
        }

        dogBar.append(dogSpan)
        dogInfo.append(dogDiv)
    }

    function clickHandler() {
        document.addEventListener('click', (e) => {
            let clicked = e.target
            let clickedDog = document.querySelector(`div#dog-info [data-dog-id='${clicked.dataset.dogId}']`)

            if (clicked.matches("span")) {
                if (clicked.dataset.dogId === clickedDog.dataset.dogId) {
                    for (let dog of dogInfo.children) {
                        dog.style.display = "none"
                    }
                    clickedDog.style.display = "block"
                }  
            }

            
            if ((clicked.matches(".bad-dog")) || (clicked.matches(".good-dog"))) {
                if (clicked.innerText == "Bad Dog!") {
                    clicked.innerText = "Good Dog!"
                    clicked.className = "good-dog"
                    let doggoId = parseInt(clicked.parentElement.dataset.dogId)

                    const options = {
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json",
                            "accept": "application/json"
                        },
                        body: JSON.stringify({isGoodDog: true})
                    }
                    fetch(baseUrl + doggoId, options)

                    let dogStatus = clicked.parentElement.parentElement.parentElement.previousElementSibling.children[doggoId - 1]
                    
                    console.log(dogStatus) // checking to see if dog status changed

                    dogStatus.dataset.goodDog = "true"

                } else if (clicked.innerText == "Good Dog!") {
                    clicked.innerText = "Bad Dog!"
                    clicked.className = "bad-dog"

                    let doggoId = parseInt(clicked.parentElement.dataset.dogId)
                    let dogStatus = clicked.parentElement.parentElement.parentElement.previousElementSibling.children[doggoId - 1]
                    
                    console.log(dogStatus) // checking to see if dog status changed

                    dogStatus.dataset.goodDog = "false"

                    const options = {
                        method: "PATCH",
                        headers: {
                            "content-type": "application/json",
                            "accept": "application/json"
                        },
                        body: JSON.stringify({isGoodDog: false})
                    }
                    fetch(baseUrl + doggoId, options)
                }
            }

            if (clicked.matches("#good-dog-filter")) {
                if (clicked.innerText === "Filter good dogs: OFF") {
                    console.log(clicked)
                    clicked.innerText = "Filter good dogs: ON"
                    searchGood();
                    // WHEN FILTERED -- ONCE A DOG IS TURNED BAD, ITS SPAN NEEDS TO BE REMOVED 
                    // if (clicked.innerText === "Good Dog!") {
                    //     console.log(clicked)
                    //    // clicked.parentElement.style.display = "none"
                    //     let currentDogId = parseInt(clicked.parentElement.dataset.dogId)
                    //     let dogSpan = clicked.parentElement.parentElement.parentElement.previousElementSibling.children[currentDogId + 1]
                    //     dogSpan.style.display = 'none'
                    //     console.log(dogSpan)
                    //     console.log(currentDogId)
                    // }
                } else if (clicked.innerText === "Filter good dogs: ON") {
                    console.log(clicked)
                    clicked.innerText = "Filter good dogs: OFF"
                    const allDog = document.getElementById('dog-bar')
                    allDog.innerHTML = ""
                    getDogs()
                
                }
            }

        })
    }

    function searchGood() {
        //dogBar.innerHTML = ""
        let dogSpan = document.querySelectorAll('div#dog-bar [data-good-dog="false"]')
        dogSpan.forEach(dog => { 
           // if (dog.dataset.goodDog === "true") {
           //     dog.style.display = "block"
               // console.log(dog)
          //  } else if (dog.dataset.goodDog === "false") {
                dog.style.display = "none"
               // console.log(dog)
           // }
        })
    }

    getDogs()
    clickHandler()
})