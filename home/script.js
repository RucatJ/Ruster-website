async function load() {
    try {
    await loadHTML("menu", "/loaf/menu.html");
    } finally {document.dispatchEvent(scriptFinished);}
}
load()
 
window.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        writeText( titleBase, false, false, " - Where'd ya go?");
    }
    else {
        writeText(titleBase, true, true);
    }
});

async function writeText(base, remove = false, lbl, text, target) {
    while (writing.includes(target)) {await delay(50)};
    writing.push(target);
    // console.log("writing", remove, lbl);
    let sets = lbl? document.title.replace(base, "").split("") : split(text);

    for (let i = 0; i - (remove? 2:0) < sets.length; i++) {
        let add = sets.slice(
            0,
            remove? sets.length - i + 1 : i + 1
        ).join("");

        if (target="title") {
            document.title = base + add;
        }
        else {
            document.getElementById(target).textContent = base + add
        }
        (i+1<sets.length)? await delay(lbl? 250:(sets[i+1].length * 80)) :0;
    }

    writing.splice(writing.indexOf(target), 1);
}

function delay(timeMS) {
    return new Promise(resolve => {setTimeout(resolve, timeMS)});
}