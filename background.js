'use strict'
let app_stt = 0;
var waiting_tag_id;
// var menu_context = [];


// chrome.tabs.onCreated.addListener((tab) => {
//     if (tab.url.includes('www.messenger.com') || tab.url.includes('www.facebook.com')) {
//         run(tab);
//     };
// });
chrome.runtime.onInstalled.addListener((details) => {
    init_menu();
});

chrome.action.onClicked.addListener(function (tab) {

    if (tab.url.includes('www.messenger.com/t') || tab.url.includes('www.facebook.com/t')) {
        createControlWindow();
        //run(tab);
    };

    //createControlWindow();
});
chrome.tabs.onUpdated.addListener(async (tab_id, change_info, tab) => {
    if (!change_info.url) return;
    if (change_info.url.includes('www.messenger.com/t') || change_info.url.includes('www.facebook.com/t')) {
        get_cr_user((cr_u) => {
            if (cr_u && cr_u.hasOwnProperty('id')) {
                run(tab);
            } else {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tab.id },
                        func: () => {
                            alert("Chưa đăng nhập vào tiện ích !")
                        }
                    });
            }
        });
    }
    if (change_info.url.includes('http://localhost:3000/home/user') || change_info.url.includes('http://localhost:3000/home/user')) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['support.js']
        });
    }
});

async function run(tab) {
    app_stt = 1;
    console.log('Web app chat start !');


    chrome.scripting.insertCSS(
        {
            target: { tabId: tab.id },
            files: ['view/css/mess.css']
        });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            files: ['view/js/loading.js']
        });
    chrome.scripting.executeScript(
        {
            target: { tabId: tab.id },
            files: ['main.js']
        });
}


function createControlWindow() {
    var ws = 600;
    var hs = 400;
    chrome.windows.create({ "type": "popup", "url": "view/loginpage.html", "width": ws, "height": hs });
    //chrome.windows.create({ "incognito": true, "type": "normal", "url": "https://www.facebook.com/" }, callbackCreate(window));
}


function init_menu() {
    try {
        var run_app = "ex_run_app";
        var show_control_window = "ex_control_window";
        var create_id = "ex_create";
        var syn_chat = "ex_syn_chat";
        // chrome.contextMenus.create({
        //     id: run_app,
        //     title: "Khởi động chương trình",
        //     contexts: ["all"]
        // });
        chrome.contextMenus.create({
            id: create_id,
            title: "Khách hàng mới",
            contexts: ["all"]
        });
        chrome.contextMenus.create({
            id: show_control_window,
            title: "Cửa sổ thông tin",
            contexts: ["all"]
        });



        // chrome.contextMenus.create({
        //     id: syn_chat,
        //     title: "Cập nhật chat",
        //     contexts: ["all"]
        // });
    } catch (error) {
        console.warn(error);
    }
}

chrome.contextMenus.onClicked.addListener((info, tab) => run_menu_command(info, tab))

async function run_menu_command(info, tab) {
    get_cr_user((cr_u) => {
        if (!cr_u.hasOwnProperty('id')) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tab.id },
                    func: () => {
                        alert("Chưa đăng nhập vào tiện ích !")
                    }
                });
            return;
        }
        switch (info.menuItemId) {
            case "ex_run_app":
                run_app(info, tab)
                break;
            case "ex_control_window":
                createControlWindow()
                break;
            case "ex_create":
                open_chat_with_cus(info, tab, cr_u)
                break;
            case "ex_syn_chat":
                syn_chat(info, tab)
                break;
            default:
                break;
        }
    });

}

async function run_app(info, tab) {
    run(tab);
}
async function open_chat_with_cus(info, tab, cr_u) {
    var url = info.pageUrl;
    if (url) {
        if (url.includes('www.messenger.com/t') || url.includes('www.facebook.com/t')) {
            var cus_obj = await get_id_from_url(url);
            cus_obj.img = '../img/avatar.png';
            //}
            let check_detail_rs = await create_detail_group_mess(cus_obj.userID, cus_obj.userVanity, '', '', cus_obj.img, cr_u);
            run(tab);
        }
    }
}

async function get_id_from_url(url) {
    var str = '';
    if (url.lastIndexOf('/t/') > 0) {
        str = url.substring(url.lastIndexOf('/t/') + 3, url.length);
    } else {
        if (url.lastIndexOf('/') + 1 == url.length) {
            url = url.replaceAll('/', '');
            str = url.substring(url.lastIndexOf('com') + 3, url.length);
        } else {
            str = url.substring(url.lastIndexOf('/') + 1, url.length);
        }
    }
    str = str.replaceAll('/', '').replaceAll('#', '');
    var link_profile = `https://www.facebook.com/${str}`;
    var link_img_profile = `https://mbasic.facebook.com/${str}`;
    try {
        var id = await fetch(link_profile).then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(async function (html) {

            var str_find = html.substring(html.indexOf('props'), html.indexOf('props') + 300);
            var from = str_find.indexOf('{');
            var to = str_find.indexOf('}') + 1;
            var obj = str_find.substr(from, (to - from));
            //{viewerID:100067863644324,userVanity:lyn.nguyen.908,userID:100003804766446}
            return JSON.parse(obj);

        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
        var img = await fetch(link_img_profile).then(function (response) {
            // The API call was successful!
            return response.text();
        }).then(async function (html) {

            var str_find = html.substr(html.indexOf('/p74x74') - 100, html.indexOf('/p74x74') + 100);
            var from = str_find.indexOf('https');
            var to = str_find.indexOf('class') - 2;
            var src = str_find.substr(from, (to - from)).replaceAll('amp;', '');
            //{viewerID:100067863644324,userVanity:lyn.nguyen.908,userID:100003804766446}
            return src;

        }).catch(function (err) {
            // There was an error
            console.warn('Something went wrong.', err);
        });
        id.img = img;
        return id;
    } catch (error) {
        console.log(error);
        return str;
    }
}


async function syn_chat(info, tab) {
    var url = info.pageUrl;
    var id = url.substring(url.lastIndexOf('/') + 1, url.length);

    // console.log(tab);
    // console.log(info);
}

async function create_detail_group_mess(cus_id, cus_name, send_id, send_name, cus_ava, cr_u) {
    var obj = { user_id: cr_u.id, cus_id: cus_id, cus_name: cus_name, send_id: send_id, send_name: send_name, cus_ava: cus_ava };
    const root_url = 'http://localhost:3000';
    var dt_gr = await fetch(`${root_url}/api/chat_group_create`, {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    } /*, options */)
        .then((response) => response.json())
        .then((data) => {
            if (data != undefined) {
                return data;
            }
        })
        .catch((error) => {
            console.log(error);
            alert('Không thể kết nối máy chủ !')
        });
    return dt_gr;
}

async function save_customer(fb_id, data) {
    const root_url = 'http://localhost:3000';
    return await fetch(`${root_url}/api/customer_details/${fb_id}`, {
        method: 'PUT', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => {
            return result;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getCookie(cb) {
    chrome.storage.local.get(['a_n_id'], function (result) {
        cb(result.a_n_id);
    });
}


function get_cr_user(callback) {
    getCookie((value) => {
        if (value) {
            callback(JSON.parse(value));
        } else {
            callback({});
        }
    });
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    try {
        switch (request.type) {
            case "data":
                if (request.name == 'current_user') {
                    // var data = await getCookie();
                    // sendResponse({ result: "OK", data: data });
                } else if (request.name == 'save_cus') {
                    let fb_id = request.data.fb_id;
                    let data = request.data.obj;
                    save_customer(fb_id, data);
                } else if (request.name == 'get_fb_info') {
                    get_fb_info_action(request, sender);
                } else if (request.name == 'get_img') {
                    let data = request.data;
                    if (waiting_tag_id) {
                        chrome.tabs.sendMessage(waiting_tag_id, { type: 'fb_img', data: data });
                    }
                    chrome.tabs.remove(sender.tab.id);
                }
                break;
            case "command":
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
        sendResponse({ result: "Fail" });
    }
});

async function get_fb_info_action(request, sender) {
    let url = request.data.url;
    let data = await get_id_from_url(url);
    if (!data.img) {
        prepare_to_get_img_in_open_direct(url, sender.tab.id);
    }
    chrome.tabs.sendMessage(sender.tab.id, { type: 'fb_info', data: data });
}

function prepare_to_get_img_in_open_direct(url, tag_id) {
    waiting_tag_id = tag_id;
    chrome.tabs.create(
        {
            url: url,
            active: false,
            selected: false
        },
        function callback(tab) {
            run_get_img(tab.id);
        }
    );
}

async function run_get_img(id) {
    await waitingForNext(2000);
    chrome.scripting.executeScript(
        {
            target: { tabId: id },
            files: ['get_img.js']
        });
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

chrome.runtime.onConnect.addListener(function (port) {
    var res = { type: '', ok: 0, data: undefined, error: '' };
    console.assert(port.name === "connect_chat_app");
    port.onMessage.addListener(function (msg) {
        var request = msg;
        try {
            switch (request.type) {
                case "data":
                    if (request.name == 'init') {
                        getCookie((d) => {
                            res.ok = 1;
                            res.data = d;
                            res.type = 'init'
                            port.postMessage(res);
                        });
                    } else if (request.name == 'save_cus') {
                        let fb_id = request.data.fb_id;
                        let data = request.data.obj;
                        save_customer(fb_id, data);
                    } else if (request.name == 'get_fb_info') {
                        get_fb_info_action(request, sender);
                    } else if (request.name == 'get_img') {
                        let data = request.data;
                        if (waiting_tag_id) {
                            chrome.tabs.sendMessage(waiting_tag_id, { type: 'fb_img', data: data });
                        }
                        chrome.tabs.remove(sender.tab.id);
                    }
                    break;
                case "command":
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log(error);
            port.postMessage({ result: "Fail" });
        }
        // if (msg.joke === "Knock knock")
        //     port.postMessage({ question: "Who's there?" });
        // else if (msg.answer === "Madame")
        //     port.postMessage({ question: "Madame who?" });
        // else if (msg.answer === "Madame... Bovary")
        //     port.postMessage({ question: "I don't get it." });
    });
});