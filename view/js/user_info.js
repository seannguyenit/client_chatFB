`use strict`

init();

async function init() {
    check_is_login((bool_vl) => {
        if (bool_vl == true) {
            get_cr_user((cru) => {
                document.getElementById('name').innerText = cru.real_name || '';
                document.getElementById('phone').innerText = cru.phone || '';
                document.getElementById('role').innerText = cru.role_name || '';
                document.getElementById('user').innerText = cru.user || '';
                // document.getElementById('name').innerText = cru.real_name;
            });
        }
    });
}