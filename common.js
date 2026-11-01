let params = new URLSearchParams(document.location.search)
const url = new URL(window.location)
let page = url.searchParams.get("z")

async function load() {
    document.addEventListener("script-loaded", () => {
        scriptsToExecute ++;
        // console.log("Scripts to execute: " + scriptsToExecute);
    })

    document.addEventListener("script-finish", () => {
        scriptsToExecute --;
        // console.log("Scripts to execute: " + scriptsToExecute);
        if (scriptsToExecute <= 0) afterLoad()
    })

    await loadHTML("title-box", "/loaf/title.html");
    afterMainLoad();
    await loadHTML("pageContainer", page);
}

load()

const getExpandButtons = document.getElementsByClassName("expand-button");
const root = document.documentElement;

let stuff = ",?!=+-_/ ";
let titleBase = "Rúster";
var writing = [];
let views = 0;

let scriptsToExecute = 0;
let scriptLoaded = new CustomEvent("script-loaded");
let scriptFinished = new CustomEvent("script-finish");

const items = [
    "Welcome to the mashed potatoverse",
    "Read the small text",
    "Always hungry",
    "The line above the U is called a fada",
    "Pronounced 'Roo-ster'",
    "ᚈᚐ ᚑᚌᚆᚐᚋ ᚔ ᚒᚅᚔᚉᚑᚇᚓ",
    "Cats *do* have feelings",
    "Crunchy peanutbutter is superior",
    "ò̧̦̥̬̩̤̣̮̯̱̰̭̗̖́̂̃̄̅̑̆̇̈̉̊̏̋̌̍̎̐̒̓̔̕͟͜͝͡͞o",
    "Regulated by me!",
    "Best viewed in lynx version 2.8.7 or below",
    "I'm Not Crazy I'm Not Crazy I'm Not Crazy I'm Not Crazy",
    "Yes you are",
    "42",
    "I have a headache :(",
    "Mind the gap",
    "Thankfully not gen Alpha",
    "Room temperature IQ (degrees celsius)",
    "For safety reasons, please avoid saying the name 3 times",
];

window.addEventListener("resize", () => {
    setRootStyleProperty("--banner-delay", "0s");
    setRootStyleProperty("--is-banner-start", "0");
    setUpScroll();
});

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\-]/g, "\\$&");
}

stuff = escapeRegex(stuff);

const splitR = new RegExp(`[^${stuff}]+[${stuff}]*|[${stuff}]+`, "g");

var mobile = /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

if (mobile) {
    if (viewCount == 0) alert("Hello mobile user! This website will be more mobile friendly in future, I promise.");
    console.log("Mobile device detected");
    const page = document.getElementsByClassName("pageContainer");
    for (let i=0; i<page.length; i++) {
        page[i].style.width = "90%";
    }
}

// Runs after html from other pages has loaded + some other stuff

function afterMainLoad() {
    views = viewCount();
    welcome(views)
    setTimeout(setUpScroll(), 2000);
}

function afterLoad() {
    // console.log("Afterload");
    setUpLinks();
    setUpContentBoxes();
}

/*----------- Functions -----------*/

function closeBox(elem) {
    elem.style = "-webkit-line-clamp: 1;";
}

const elems = document.getElementsByClassName("expand");
for (let i=0; i < elems.length; i++) {
    elems[i].setAttribute("onclick", "expand(this)");
}

function expand(elem) {
    if (elem.getAttribute("class").includes("open")) {
        elem.setAttribute("class", elem.getAttribute("class").replace("open", "closed"));
    }
    else {
        elem.setAttribute("class", elem.getAttribute("class").replace("closed", "open"));
    }
}

for (let i=0; i<getExpandButtons.length; i++) {
    getExpandButtons[i].style.width = document.querySelector(".page").style.width;
}

function randRange(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function title() {
    document.title = "Rúster";
}

function split(str) {
    return str.match(splitR);
}

function delay(timeMS) {
    return new Promise(resolve => {setTimeout(resolve, timeMS)});
}

async function loadHTML(id, file) {
    const el = document.getElementById(id);
    if (!el) {return}
    const thing = await fetch(file);
    if (thing.status == 404) {return}
    const html = await thing.text();
    el.innerHTML = html;
    const scripts = el.querySelectorAll("script");
    for (let i = 0; i < scripts.length; i++) {
        await loadScript(scripts[i]);
    }
}

async function loadScript(oldScript) {
    if (oldScript.src.includes("/___vscode_livepreview_injected_script")) return
    // console.log("Loading: " + oldScript.src);
    document.dispatchEvent(scriptLoaded);
    return new Promise(async (resolve, reject) => {
        let newScript = document.createElement("script");
        Array.from(oldScript.attributes).forEach((attr) => {
            newScript.setAttribute(attr.name, attr.value);
        });
        if (oldScript.src) {
            let newSrc = `${oldScript.src}?t=` + Date.now();
            newScript.setAttribute("src", newSrc)
            newScript.onload = resolve();
            newScript.onerror = reject();
        } else {
            newScript.textContent = oldScript.textContent;
            resolve()
        }
        oldScript.parentNode.replaceChild(newScript, oldScript);
    })
}

function createItems(list) {
    return list.map(item => {
        const span = document.createElement("span");
        span.className = "item";
        span.textContent = item;
        return span;
    })
}

function getWidth(el) {
    return el.scrollWidth;
}

function setRootStyleProperty(name, val) {
    root.style.setProperty(name, val);
}

// No longer used in favour of local storage.
function addCookie(name, value, path = false, exMillis = 34560000000) {
    // Unused code, but still useful to have
    // const ex  = new Date();
    // ex.setTime(ex.getTime() + (exdays*24*60*60*1000));
    // let expires = ex.toUTCString();
    // console.log(`${name}=${value} expires=${expires};`)
    document.cookie = `${name}=${value}; max-age=${exMillis}; ${path? "path="+path:""}`;
}

// No longer used in favour of local storage.
function checkCookie(cname, none = "") {
    let name = cname + "=";
    let cookies = decodeURIComponent(document.cookie);
    let cArray = cookies.split(';');
    // console.log(cArray);
    for (let i = 0; i < cArray.length; i++) {
        c = cArray[i]
        if (c.startsWith(" ")) {c = c.substring(1);}
        // console.log(c);

        if (c.startsWith(name)) {
            // console.log("starts with");
            // console.log(c.substring(0, name.length));
            return c.substring(name.length);
        }
    }

    return none
}

function onLinkClick(el) {
    // console.log("Clicked: " + el.getAttribute("title"));
    loadPage(el.getAttribute("href"));
}

function loadPage(page) {
    scriptsToExecute = 0;
    // console.log("Scripts to execute: " + scriptsToExecute);
    loadHTML("pageContainer", page);
    url.searchParams.set("z", page);
    let newUrl = url.toString().replace(/%2F/gi,"/");
    history.pushState({}, '', newUrl);
}

/*----------- Functions that run once and just do a thing -----------*/

function setUpContentBoxes() {
    const getContent = document.getElementsByClassName("content");
    for (let i=0; i < getContent.length; i++) {
        let x = getContent[i].scrollHeight + "px";
        // console.log(x);
        getContent[i].style.maxHeight = x;
    }
}

function setUpScroll() {
    const track = document.getElementById("scroll");
    const content = createItems(items).concat(createItems(items));
    track.innerHTML = "";
    content.forEach(el => track.appendChild(el));

    const scrollWidth = getWidth(document.getElementById("scroll"));
    setRootStyleProperty("--scroll-width", `-${scrollWidth / 2}px`);
    setRootStyleProperty("--scroll-speed", `${scrollWidth / 150}s`);
    track.classList.remove("on");
    void track.offsetWidth;
    track.classList.add("on");
}

function viewCount() {
    let viewCount = localStorage.getItem("visitCount");
    if (parseInt(viewCount)) {
        viewCount = parseInt(viewCount)
    }
    else {
        viewCount = 0;
    }
    localStorage.setItem("visitCount", String(viewCount + 1));
    return viewCount
}

function welcome(views) {
    const el = document.getElementById("welcome");
    let msg = "";
    switch (true) {
        case views == 0:
            msg = "Welcome! Are you new here?";
            break;
        case views == 1:
            msg = "You seem familiar. Have we met?";
            break;
        case views > 1:
            msg  = "I recognise you! Welcome back!";
    }
    el.innerText = msg;
}

function setUpLinks() {
    // console.log("Linking...")
    const links = Array.from(document.getElementsByClassName("link"));
    links.forEach(link => {
        // console.log("Linked: " + link);
        link.addEventListener("click", () => {
            onLinkClick(link)
        });
    })
}