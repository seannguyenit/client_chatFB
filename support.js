

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    try {
        if (request.type == "fb_info") {
            set_fb_info(request.data);
        } else if (request.type == "fb_img") {
            set_fb_img(request.data);
        }
    } catch (error) {
        console.log(error);
        // sendResponse({ result: "Fail" });
    }
});

document.getElementById('get_fb_info').addEventListener('click', async () => {
    await get_fb_info();
});

async function set_fb_info(info) {
    if (!info) return;
    document.getElementById('id_fb').value = info.userID;
    document.getElementById('nick_fb').value = info.userVanity;
    document.getElementById('fb_ava').src = info.img;
}
async function set_fb_img(info) {
    if (!info) return;
    document.getElementById('fb_ava').src = info;
}
async function get_fb_info() {
    var url = document.getElementById('link_fb').value;
    if (url.length == 0) {
        alert('Vui lòng nhập link !');
    }
    call_ex_data('get_fb_info', { url: url });
    // {viewerID:100067863644324,userVanity:lyn.nguyen.908,userID:100003804766446}
}

async function call_ex_data(name, data) {
    chrome.runtime.sendMessage({ "type": "data", "name": name, "data": data });
}


async function delay(delayInms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(2);
        }, delayInms);
    });
}
async function waitingForNext(time) {
    // console.log('waiting...')
    let delayres = await delay(time);
}