
get_img_script();

async function get_img_script() {
    let w = await waitingForNext(1000);
    var url = document.querySelector('[role="img"]').querySelector('image').href.animVal;
    if (!url) {
        url = `../img/avatar.png`;
    }
    chrome.runtime.sendMessage({ "type": "data", "name": 'get_img', "data": url });
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