const searchField = document.querySelector(".search__input-body");
const input = searchField.querySelector(".search__input-field");
const autocomplete = searchField.querySelector(".search__autocomplete-list");
const savedResultsList = document.querySelector('.search__results-list')

const debounce = (fn, debounceTime) => {
    let timer

    return function (...args) {
        clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, debounceTime)
    }
};
let searchFn = debounce(fetchRepos, 600)

let searchTimeout
input.addEventListener('keyup', (evt) => {

    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
        const userData = evt.target.value;

        if (userData.trim()) {
            searchFn(userData)
        } else {
            autocomplete.innerHTML = ''
        }
    }, 400)
    
})

async function fetchRepos(searchText) {
    autocomplete.innerHTML = ''
    return await fetch(`https://api.github.com/search/repositories?q=${searchText}`).then(result => {
        if (result.ok) {
            result.json().then(data => data.items.slice(0, 5).forEach(createAutocompleteItem))
        } else {
            console.error('Ошибка запроса:', result.status);
        }
    })
}

function createAutocompleteItem(repoData) {
    const repoElement = document.createElement('li')
    repoElement.classList.add('search__autocomplete-item')

    repoElement.textContent = repoData.name

    repoElement.addEventListener('click', () => {
        repoElement.remove()
        autocomplete.innerHTML = ''

        const savedRepoElement = document.createElement('li')
        savedRepoElement.classList.add('repository-item')

        const repoInfo = document.createElement('div')
        repoInfo.classList.add('repository-item__info')

        const repoInfoName = document.createElement('p')
        const repoInfoOwner = document.createElement('p')
        const repoInfoStars = document.createElement('p')
        repoInfoName.classList.add('repository-item__text')
        repoInfoOwner.classList.add('repository-item__text')
        repoInfoStars.classList.add('repository-item__text')

        repoInfoName.textContent = `Name: ${repoData.name}`
        repoInfoOwner.textContent = `Owner: ${repoData.owner.login}`
        repoInfoStars.textContent = `Stars: ${repoData.stargazers_count}`

        repoInfo.append(repoInfoName, repoInfoOwner, repoInfoStars)

        const repoDeleteButton = document.createElement('button')
        repoDeleteButton.classList.add('button')
        repoDeleteButton.addEventListener('click', () => {
            savedRepoElement.remove()
        })


        savedRepoElement.append(repoInfo)
        savedRepoElement.append(repoDeleteButton)
        savedResultsList.append(savedRepoElement)
    })
    autocomplete.append(repoElement)
}





