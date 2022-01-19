`use strict`

init();

async function init(){
    let rs_stt = check_is_login();
    if(rs_stt == true){
        var cru = get_cr_user();
        document.getElementById('name').innerText = cru.real_name||'';
        document.getElementById('phone').innerText = cru.phone||'';
        document.getElementById('role').innerText = cru.role_name||'';
        document.getElementById('user').innerText = cru.user||'';
        // document.getElementById('name').innerText = cru.real_name;
    }
}