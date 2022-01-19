'use strict'
const root_url = 'https://congnghenhatrang.xyz';

document.getElementById('bt_logout').addEventListener('click',()=>{
    clearCookie();
    location.href = 'loginpage.html';
});
// const { json } = require("body-parser");
//ensure logout
function check_is_login(){
    try {
        let cr_u = JSON.parse(getCookie());
        //alert(cr_u);
        if(cr_u.token != undefined){
            return true;
        }else{
            return false;
        }
    } catch (error) {
        return false;
    }
}


async function set_cr_user(user) {
    if (user) {
        if (user.token) {
            setCookie(JSON.stringify(user));
        }
    }
}
function get_cr_user() {
    try {
        return JSON.parse(getCookie());
    } catch (error) {
        return {};
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
            return {error: error};
        });
    }
async function acc_logout() {
    //await check_authen();
    var user = get_cr_user('user');
    var url = `/api/logout`;
    var data = { user: user.id, token: user.token };
    let rs = await fetch(root_url + url, {
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
            console.error('Error:', error);
        });
    clearCookie();
    return true;
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
function setCookie(cvalue) {
    window.localStorage.setItem('a_n_id', cvalue);
}

function getCookie() {
    return window.localStorage.getItem('a_n_id');
}

function clearCookie() {
    window.localStorage.removeItem('a_n_id');
}
/* helper method - end */