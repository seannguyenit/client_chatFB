'use strict'



// let start_load = true;

init_loading();


async function init_loading() {

    if (!document.getElementById("loader_001")) {
        const load_div_id = "loader_001";
        const load_img_id = "loader_img_001";
        var load_div = document.createElement('div');
        load_div.id = load_div_id;
        load_div.className = "loader_div";
        var load_img = document.createElement('img');
        load_img.id = load_img_id;
        load_img.className = "loader_img";
        load_img.src = "https://i.imgur.com/QJz5y9S.gif";
        document.body.appendChild(load_div);
        // document.body.appendChild(load_img);
        stop_loading();
    }
}

async function on_loading() {
    let d = document.getElementById("loader_001");
    let i = document.getElementById("loader_img_001");
    d.style.display = "block";
    //i.style.display = "block";
}
async function stop_loading() {
    let d = document.getElementById("loader_001");
    let i = document.getElementById("loader_img_001");
    d.style.display = "none";
    //i.style.display = "none";
}