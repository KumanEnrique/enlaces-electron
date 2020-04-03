const formu = document.getElementById("formu")
const contenedor = document.getElementById("contenedor")
const input = document.getElementById("input")
const errorMessage = document.getElementById("error")
const boton = document.getElementById("boton")
const clearAll = document.getElementById("clearAll")

const parser = new DOMParser();
const {shell} = require("electron")

function parseResponse(texto){
    return parser.parseFromString(texto,"text/html")
}
function findTitle(nodes){
    return nodes.querySelector("title").innerText;
}
function storeLink(title,url){
    localStorage.setItem(url,JSON.stringify({title,url}))
}
function getLinks(){
    return Object.keys(localStorage).map(key => JSON.parse(localStorage.getItem(key)))
}
function createLinkElement(link){
    console.log(link)
    return `
    <div>
        <h2>${link.title}</h2>
        <h3>
            <a href="${link.url}">${link.url}</a>
        </h3>
    </div>
    <br>
    `
}
function renderLinks(){
    const linkElements = getLinks().map(createLinkElement).join(" ")
    contenedor.innerHTML = linkElements;
}
function handleError(error,url){
    errorMessage.setAttribute("class","alert alert-danger")
    errorMessage.innerHTML = `
        There was an issue adding "${url}" : "${error.message}"
    `.trim()
    setTimeout(() => {
        errorMessage.innerHTML = " "
        errorMessage.removeAttribute("class")
    }, 5000);
}
renderLinks()

/*  */
input.addEventListener("keyup",()=>{
    boton.disabled = !input.validity.valid;
})
formu.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const url = input.value;
    try {
        const response = await fetch(url);
        const result = await response.text();
        const html = parseResponse(result)
        const title = findTitle(html);
        storeLink(title,url)
        renderLinks()
    } catch (error) {
        handleError(error,url)
    }
    // console.log(html.title)
    formu.reset(); 
})
clearAll.addEventListener("click",(e)=>{
    localStorage.clear();
    contenedor.innerHTML = " ";
})
contenedor.addEventListener("click",(e)=>{
    if(e.target.href){
        e.preventDefault();
        shell.openExternal(e.target.href)
    }
})