'use strict'
const root_url = 'https://congnghenhatrang.xyz';

document.getElementById('bt_logout').addEventListener('click', () => {
    clearCookie();
    location.href = 'loginpage.html';
});
// const { json } = require("body-parser");
//ensure logout
function check_is_login(callback) {
    getCookie((cr_u) => {
        if (cr_u) {
            let c = JSON.parse(cr_u);
            if (c.token != undefined) {
                if (callback) {
                    callback(true);
                }
                return;
            }
        }
        callback(false);
    });
}


async function set_cr_user(user) {
    if (user) {
        if (user.token) {
            setCookie(JSON.stringify(user));
        }
    }
}
function get_cr_user(callback) {
    try {
        getCookie((value) => {
            callback(JSON.parse(value));
        });
    } catch (error) {
        callback({});
    }
}

/*  call api method */

/* account */

async function acc_login(user, pass) {
    var url = `/api/login`;
    var data = { user: user, pass: pass };
    return await fetch(root_url + url, {
        method: 'POST', // or 'PUT'
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
            console.warn('Error:', error);
            return { error: error };
        });
}

async function acc_logout() {
    get_cr_user((user) => {
        log_out_syn(user);
    });
    return true;
}
async function log_out_syn(user) {
    var url = `/api/logout`;
    var data = { user: user.id, token: user.token };
    let rs = await fetch(root_url + url, {
        method: 'POST',
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
    clearCookie();
}

/* account - end */


/* product */
async function product_get_all() {
    return await fetch(`/api/product` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            if (data != undefined) {
                return data;
            }
            //covertTrueFalse(tb, 6, 'Hiện', 'Ẩn');
        })
        .catch((error) => {
            console.warn(error);
        });
}
/* product - end */

/* call api method - end */

/* helper method */
function setCookie(value) {
    chrome.storage.local.set({ a_n_id: value }, function () {
        console.log('Value is set to ' + value);
    });


}

function getCookie(callback) {
    chrome.storage.local.get(['a_n_id'], function (result) {
        callback(result.a_n_id);
    });
}

function clearCookie() {
    chrome.storage.local.clear(() => {
        console.log('clear cookies !');
    });
}
/* helper method - end */