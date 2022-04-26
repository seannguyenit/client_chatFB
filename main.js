'use strict'
// var cr_url = "";

var port = chrome.runtime.connect({ name: "connect_chat_app" });

port.postMessage({ type: 'data', name: 'init' });

async function init_event() {
    // console.log(port);
    var rs = await add_event();
    if (!rs) {
        alert('Không thể kết nối máy chủ !');
    } else {
        //console.log(rs);
        set_up_environment();
    }
}



async function add_event() {
    var count = 1;
    var err = 'none';
    // console.time();
    while (err.length > 0 && count < 10) {
        try {
            await waitingForNext(1000);
            console.log(`Kết nối lần ${count} ...`);
            // document.querySelector('[role=navigation]').querySelector('div').addEventListener('click', (e) => {
            //     force_to_setup();
            // });
            if (document.querySelectorAll('svg[role=presentation]')[4].parentElement) {
                document.querySelectorAll('svg[role=presentation]')[4].parentElement.click();
            }
            err = '';
        } catch (error) {
            err = 'next';
            console.log(`Lỗi kết nối lần ${count}`);
            count++;
        }
    }
    //force_to_setup();
    // console.timeLog();
    console.log(`done ! ${count}`);
    if (count == 10) {
        return false;
    } else {
        return true;
    }
}

async function force_to_setup() {
    on_loading();
    let w = await waitingForNext(1000);
    //if (location.href != cr_url) {
    if (!document.getElementById('a_send_guess') || !document.getElementById('table_product')) {
        let w1 = await waitingForNext(1000);
        set_up_environment();
    } else {
        stop_loading();
    }
    //}
}



async function set_up_ui() {

}

async function set_up_event() {

}

async function load_data_default() {

}

async function set_up_environment() {

    on_loading();

    let cr_group_detail = await get_detail_group_mess();

    if (!cr_group_detail) {
        stop_loading();
        return;
    }

    //await get_data_conversation();

    //load table product
    try {
        await create_tag_name_in_group();
        var left_section = document.querySelector('[role=navigation]').lastElementChild.lastElementChild.lastElementChild.children[2];

        createScrollStopListener(left_section, function () {
            create_tag_name_in_group();
        }, 1000);

        var right_sec_main = document.querySelector('[role=main]').querySelector('div').querySelector('div').querySelector('div').querySelector('div').querySelector('div').children[1];
        if (!right_sec_main) {
            document.querySelectorAll('svg[role=presentation]')[4].parentElement.click();
            let wf1 = await waitingForNext(1000);
            right_sec_main = document.querySelector('[role=main]').querySelector('div').querySelector('div').querySelector('div').querySelector('div').querySelector('div').children[1];
        }
        var right_sec = right_sec_main.querySelector('div').querySelector('div');
        if (right_sec && !document.getElementById('table_product')) {
            var div_new = document.createElement('div');
            div_new.id = "right_panel";
            div_new.style.width = "100%";
            div_new.style.height = "300px";
            right_sec.appendChild(div_new);
            div_new = document.getElementById('right_panel');
            div_new.innerHTML = '';
            div_new.innerHTML += `<div id="tag_user" style="width:100%"></div>`;
            var note_str = await create_note();
            div_new.innerHTML += note_str;
            var sl_p = await create_select_product();
            div_new.innerHTML += sl_p;
            div_new.innerHTML += `<hr/><table id="table_product" style="width: 100%">
            <thead>
            <tr>
            <th>Tên</th>
            <th>Giá</th>
            <th></th>
            </tr>
            </thead>
            <tbody></tbody>
            </table>`;
            div_new.innerHTML += create_button_panel();
            // div_new.innerHTML += `<div id="cus_full_name_content" style="width:100%"></div>`;
            div_new.innerHTML += `<div id="bill_table" style="width:100%"></div>`;
            var div_modal = document.createElement('div');
            div_modal.id = "myModal";
            div_modal.className = "modal";
            var str_modal = await create_modal_confirm_pro(cr_group_detail);
            div_modal.innerHTML += str_modal;
            document.querySelector('body').appendChild(div_modal);

            var div_modal_search = document.createElement('div');
            div_modal_search.id = "myModalSearch";
            div_modal_search.className = "modal";
            var search_modal = await create_modal_search_mess();
            div_modal_search.innerHTML += search_modal;
            document.querySelector('body').appendChild(div_modal_search);

            create_bill_list();
            init_tag_user(cr_group_detail.user_ids);
        }
        // Get the modal
        var modal = document.getElementById("myModal");
        var modal_search = document.getElementById("myModalSearch");

        // Get the button that opens the modal
        var btn = document.getElementById("a_send_guess");
        var btn_search_mess = document.getElementById("btn_search_mess");

        // Get the <span> element that closes the modal
        var span = document.getElementsByClassName("close")[0];

        var span_search = document.getElementsByClassName("close")[1];

        // When the user clicks the button, open the modal 
        btn.onclick = function () {
            modal.style.display = "block";
        }
        btn_search_mess.onclick = function () {
            modal_search.style.display = "block";
        }
        // When the user clicks on <span> (x), close the modal
        span.onclick = function () {
            modal.style.display = "none";
        }
        span_search.onclick = function () {
            modal_search.style.display = "none";
        }
        // When the user clicks anywhere outside of the modal, close it
        // window.addEventListener('click', (event) => {
        //     if (event.target == modal) {
        //         modal.style.display = "none";
        //     }
        //     if (event.target == modal_search) {
        //         modal_search.style.display = "none";
        //     }
        // });
        var bill_code_title_ele = document.getElementsByClassName('bill_code_title');
        if (bill_code_title_ele.length == 0) {
            var bill_code_title_element = document.createElement('h3');
            bill_code_title_element.className = "bill_code_title";
            bill_code_title_element.innerText = cr_group_detail.next_code;
            document.querySelector('[role="main"]').querySelectorAll('a[target="_blank"]')[1].parentElement.appendChild(bill_code_title_element);
        } else {
            bill_code_title_ele[0].innerText = cr_group_detail.next_code;
        }
        /**
         * Component event 
         */

        //document.getElementById('note').removeEventListener()
        document.getElementById('note').addEventListener('focusout', (e) => {
            //console.log(document.getElementById('note').value);
            save_chat_group({ note: document.getElementById('note').value });
        })

        var lst_product = document.getElementById('lst_product').children;

        document.getElementById('input_search_product').addEventListener('keydown', (ev, ip) => {
            if (ev.keyCode == 13) {
                var select = Array.prototype.find.call(lst_product, (f) => { return f.value == ev.currentTarget.value });
                if (select) {
                    var dt_table = document.getElementById('table_product').querySelector('tbody');
                    if (!dt_table.querySelector(`tr[id="row_${select.dataset.pid}"]`)) {
                        // lst_cr_product.push(select.id);
                        // save_product(select.id, cr_gr);
                        dt_table.innerHTML += `<tr id="row_${select.dataset.pid}">
                                <td scope="row">${select.dataset.name}</td>
                                <td scope="row">${get_format_VND(select.dataset.price)}</td>
                                <td data-proid="${select.dataset.pid}"></td>`;
                        add_del_bt_to_product();
                        // <button class="btn_del_row">X</button>
                        // document.querySelector(`button[data-proid="${select.dataset.pid}"]`).onclick = function () {
                        //     var a_ = this;
                        //     console.log(this);
                        //     var tr_ = a_.closest('tr');
                        //     var tb_ = a_.closest('tbody');
                        //     tb_.removeChild(tr_);
                        //     save_current_list_product();
                        // };
                        // dt_table.querySelector(`button[data-proid="${select.dataset.pid}"]`).addEventListener('click', (ev) => {
                        //     var a_ = ev.currentTarget;
                        //     var tr_ = a_.closest('tr');
                        //     dt_table.removeChild(tr_);
                        //     save_current_list_product();
                        // });
                        save_current_list_product();
                    } else {
                        alert(`${select.dataset.name} đã có trong danh sách !`)
                    }
                    ev.currentTarget.value = '';
                }
            }
        });


        /**
         * Component event - End
         */

        /**
         * Panel event
         */

        // event change real_name_sub :
        document.getElementById('real_name_sub').addEventListener('focusout', async () => {
            document.getElementById('real_name').value = document.getElementById('real_name_sub').value;
            var fb_id = get_id_from_url(location.href);
            var img_new = document.querySelector('[role=main]').querySelector('div').querySelector('div').querySelector('div').querySelector('div').querySelector('div').children[1].querySelector('img[referrerpolicy="origin-when-cross-origin"]').src;
            save_customer(fb_id, { real_name: document.getElementById('real_name_sub').value || '', ava_url: img_new || '../img/avatar.png' });
        });

        lock_customer();

        // clone_element(document.getElementById('a_send_guess'));
        document.getElementById('a_send_guess').addEventListener('click', async () => {
            var tb_checkout = document.getElementById('bill_checkout').querySelector('tbody');
            tb_checkout.innerHTML = '';
            var cus_info = await get_cus_info();
            if (!cus_info) cus_info = {};
            document.getElementById('real_name').value = cus_info.real_name || '';
            document.getElementById('real_name_sub').value = cus_info.real_name || '';
            document.getElementById('phone').value = cus_info.phone || '';
            document.getElementById('address').value = cus_info.address || '';
            document.getElementById('city').value = cus_info.city || '';
            // var lb_total = document.getElementById('lb_total');
            var current_pro = get_current_pro_list();
            // lst_product all product
            var lst_select = Array.prototype.filter.call(lst_product, (f) => { return current_pro.includes(f.dataset.pid) });
            lst_select.forEach((pro_item) => {
                tb_checkout.innerHTML += `
                        <tr data-id="${pro_item.dataset.pid}" data-price="${pro_item.dataset.price}">
                            <td scope="row">${pro_item.dataset.name}</td>
                            <td><input type="number" value="1" /></td>
                            <td><input class="vnd_convert" data-value="${pro_item.dataset.price}" value="${get_format_VND(pro_item.dataset.price)}" /></td>
                            <td class="money_t">${pro_item.dataset.price}</td>
                        </tr>
                    `;
            });
            Array.prototype.forEach.call(tb_checkout.getElementsByClassName('vnd_convert'), (el) => {
                el.addEventListener('input', () => {
                    el.value = get_format_VND(el.value.replaceAll(',', ''));
                    el.dataset.value = el.value.replaceAll(',', '');
                });
            });
            tb_checkout.querySelectorAll('input').forEach((ip) => {
                ip.addEventListener('change', () => {
                    calculator_total();
                });
            });
            calculator_total();
        })
        await clone_element(document.getElementById('btn_checkout'));
        document.getElementById('btn_checkout').addEventListener('click', async () => {
            on_loading();
            // console.log('check');
            var lst_row_data = document.getElementById('bill_checkout').querySelector('tbody').children;
            var data_save = [];
            Array.prototype.forEach.call(lst_row_data, (element) => {
                var id = element.dataset.id;
                var quantity = element.querySelectorAll('input')[0].value;
                var price = element.querySelectorAll('input')[1].dataset.value || 0;
                // var ck = element.dataset.ck;
                data_save.push({ id: id, quantity: quantity, price: price });
            });
            var cus_real_name = document.getElementById('real_name').value;
            var cus_phone = document.getElementById('phone').value;
            var cus_address = document.getElementById('address').value;
            var cus_city = document.getElementById('city').value;
            var img_new = document.querySelector('[role=main]').querySelector('div').querySelector('div').querySelector('div').querySelector('div').querySelector('div').children[1].querySelector('img[referrerpolicy="origin-when-cross-origin"]').src;
            var fb_id = get_id_from_url(location.href);
            var bill_code = document.getElementById('bill_code').value;
            var trade_code = document.getElementById('trade_code').value;
            var cmoney = document.getElementById('cmoney').dataset.value || 0;
            save_customer(fb_id, { real_name: cus_real_name, phone: cus_phone, address: cus_address, city: cus_city, ava_url: img_new })

            await checkout_bill({ js_data: data_save }, bill_code, trade_code, cmoney);
            document.getElementById("myModal").style.display = "none";
            alert('Tạo đơn hàng thành công !');
            load_data(cr_group_detail);
            create_bill_list();
            clear_current_pro();
            stop_loading();
        });
        /**Panel event - End */


        //load all tag_name
        var lst_tag = await tag_name_get_all();
        var tn_str = await create_select_tagname(lst_tag);
        var tag_p = document.querySelectorAll('[role=textbox]')[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        if (tag_p && !document.getElementById('tag_list')) {
            var new_d = document.createElement('div');
            new_d.innerHTML = tn_str;
            tag_p.insertBefore(new_d, tag_p.children[1]);
            load_tag_name(lst_tag, cr_group_detail.tags);
        }



        await load_data(cr_group_detail);
        await config_message();
        // document.querySelector('form').addEventListener('submit', async () => {
        //     await config_message_current();
        // });

        await init_button_search_mess();

        lazy_loading();

        Array.prototype.forEach.call(document.getElementsByClassName('vnd_convert'), (el) => {
            el.addEventListener('input', () => {
                el.value = get_format_VND(el.value.replaceAll(',', ''));
                el.dataset.value = el.value.replaceAll(',', '');
            });
        });

    } catch (error) {
        console.log(error);
    }

    stop_loading();

}

async function add_del_bt_to_product() {
    var lst_td = document.getElementById('table_product').querySelector('tbody').querySelectorAll('td[data-proid]');
    lst_td.forEach(item => {
        item.innerHTML = '';
        // if (item.children.length == 0) {
        var bt = document.createElement('button');
        bt.className = "btn_del_row";
        bt.innerText = "X";
        bt.onclick = function () {
            var a_ = this;
            var tr_ = a_.closest('tr');
            var tb_ = a_.closest('tbody');
            tb_.removeChild(tr_);
            save_current_list_product();
        };
        item.appendChild(bt);
        // }
    });
}

async function init_button_search_mess() {

    // var input_key = document.getElementById('keyword');
    // var tag_select = document.getElementById('tag_name');

    await clone_element(document.getElementById('keyword'));
    await clone_element(document.getElementById('tag_name'));

    document.getElementById('keyword').addEventListener('keydown', (ev, ip) => {
        if (ev.keyCode == 13) {
            // on_loading();
            var key_ = document.getElementById('keyword').value;
            add_search_result(key_, document.getElementById('tag_name').value);
        }
    });

    document.getElementById('tag_name').addEventListener('change', () => {
        var key_ = document.getElementById('keyword').value;
        add_search_result(key_, document.getElementById('tag_name').value);
    });

}

async function create_modal_search_mess() {
    if (!document.getElementById('btn_search_mess')) {
        var mainE = document.querySelector('input').parentElement.parentElement.parentElement.parentElement;
        mainE.innerHTML += `<a id="btn_search_mess" class="btn"> Tìm kiếm </a>`;
    }
    if (document.getElementById('modal_search_mess')) return '';
    var list_tag = await tag_name_get_all();
    return `
            <!-- Modal content -->
            <div id="modal_search_mess" class="modal-content">
                    <div class="modal-header">
                        <span class="close">&times;</span>
                        <div class="form_modal_content">
                        <div class="form_modal2">
                            <label for="key_search">Từ khóa: </label>
                            <input type="text" class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')}" name="keyword" id="keyword" value=""
                                placeholder="Nhập tin nhắn">
                        </div>
                        <div class="form_modal2">
                            <label for="phone">Tag: </label>
                            <select class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')}" name="tag_name" id="tag_name">
                                <option value="0" selected>Tất cả</option>
                                <option value ="-1" >Chưa tags</option>
                                ${list_tag.map((m) => { return `<option value="${m.id}" style="background-color: ${m.color};">${m.name}</option>` }).join('')}
                            </select>
                        </div>
                        </div>
                    </div>
                <div class="modal-body">
                
            <div class="h_scale">
                <table id="search_result" class="table table-bordered">
                        <tbody id="search_result">
                        
                        </tbody>
                </table>
            </div>
            </div>
                <div class="modal-footer">
                </div>
            </div>`;
}

async function add_search_result(key, tag_id) {
    on_loading();
    // if (key.length < 3) return;
    var main = document.getElementById('search_result');
    main.innerHTML = '';
    var lst_rs = await search_group(key, tag_id);
    var lst_tag = await tag_name_get_all();
    if (lst_rs) {
        lst_rs.forEach((item) => {
            var tags = item.tags.split(',');
            var lst_new_t = lst_tag.filter((f) => { return tags.indexOf(f.id.toString()) > -1 }).map((m) => {
                return `<div class="tags_details" style="background-color: ${m.color}"></div>`;
            }).join('');
            main.innerHTML += `<tr>
                <td width="60%">
                    <div class="search_title">
                        <div class="search_image">
                            <img src="${item.ava_url}" />
                        </div>
                        <div class="search_content_rs">
                           <div class="search_name">${item.real_name || item.nick_fb || 'Khách mới'}</div>
                            <div class="search_chat">${item.latest_mess}</div>
                        </div>
                    </div>
                </td>
                <td width="15%">    
                    <div class="tag_content">
                        ${lst_new_t}
                    </div>
                </td>
                <td width="25%">
                    <a href="${get_chat_url(item.cus_id)}" target="_blank" class="btn">Chat</a>
                </td>
            </tr>`
        });
    }
    stop_loading();
}

function get_chat_url(cus_id) {
    return `https://www.messenger.com/t/${cus_id}`;
}

async function search_group(key, tag_id) {
    key = removeVietnameseTones(key, false);
    let cr_u = await get_cr_user();
    var data = { user_id: cr_u.id, tag_id: tag_id, key: (key.length == 0 ? '0' : key) }
    const root_url = 'http://localhost:3000';
    return await fetch(`${root_url}/api/search_group`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    } /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            alert('Không thể kết nối máy chủ !')
        });
}

async function clear_current_pro() {
    var dt_table = document.getElementById('table_product').querySelector('tbody');
    dt_table.innerHTML = '';
    document.getElementById('trade_code').value = '';
    document.getElementById('cmoney').value = '0';
    document.getElementById('cmoney').dataset.value = '0';
    save_current_list_product();
}

function calculator_total(tb_checkout, lb_total) {
    var tb_checkout = document.getElementById('bill_checkout').querySelector('tbody');
    var lb_total = document.getElementById('lb_total');
    var all = tb_checkout.querySelectorAll('tr');
    var tt = 0;
    all.forEach((row) => {
        var this_ip = row.querySelectorAll('input')[0];
        var this_ip_price = row.querySelectorAll('input')[1];
        var mn = (parseInt(this_ip.value) * parseInt(this_ip_price.dataset.value));
        row.children[3].innerText = mn;
        tt += mn;
    });
    lb_total.innerText = get_format_VND(tt);
}

async function create_modal_confirm_pro(group_info) {
    if (document.getElementById('modal_checkout')) return '';
    let cus_info = group_info;
    return `
            <!-- Modal content -->
            <div id="modal_checkout" class="modal-content">
                    <div class="modal-header">
                        <span class="close">&times;</span>
                        <div class="form_modal_content">
                        <div class="form_modal">
                            <label for="real_name">Tên khách hàng: </label>
                            <input type="text" class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')}" name="real_name" id="real_name" value="${cus_info.real_name || ''}"
                                placeholder="Nhập tên khách hàng">
                        </div>
                        <div class="form_modal">
                            <label for="phone">SĐT: </label>
                            <input type="text" class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')}" name="phone" id="phone" value="${cus_info.phone || ''}"
                                placeholder="Nhập SĐT">
                        </div>
                        <div class="form_modal">
                            <label for="address">Địa chỉ: </label>
                            <input type="text" class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')}" name="address" id="address" value="${cus_info.address || ''}"
                                placeholder="Nhập địa chỉ">
                        </div>
                        <div class="form_modal">
                            <label for="city">Thành phố: </label>
                            <input type="text" class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')}" name="city" id="city" value="${cus_info.city || ''}"
                                placeholder="Nhập thành phố">
                        </div>
                        <div class="form_modal">
                        <label for="city">Cọc tiền: </label>
                        <input type="text" class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')} vnd_convert" name="cmoney" id="cmoney" value="0"
                            placeholder="Cọc tiền">
                        </div>
                        <div class="form_modal">
                        <label for="city">Mã GD: </label>
                        <input type="text" class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')}" name="trade_code" id="trade_code" value=""
                        placeholder="Mã giao dịch">
                        </div>
                        <div class="form_modal">
                        <label for="city">Mã đơn hàng: </label>
                        <input type="text" class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')}" name="bill_code" id="bill_code" value="${cus_info.next_code || ''}"
                        placeholder="Mã đơn hàng">
                        </div>
                        </div>
                    </div>
                <div class="modal-body">
                

            <table id="bill_checkout" class="table table-bordered">
                <thead>
                    <tr>
                        <th colspan="4">
                            <label>Tổng tiền :</label> <label id="lb_total"></label>
                        </th></tr>
                    <tr>
                        <th>SP</th>
                        <th width="10%">SL</th>
                        <th width="20%">Giá</th>
                        <th width="20%">TT</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- <tr>
                        <td scope="row"></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr> -->
                </tbody>
            </table>

                </div>
                    <div class="modal-footer">
                    <button id="btn_checkout" type="button" class="btn">Lưu</button>
                    </div>
                </div>`;
}

async function init_tag_user(user_ids) {
    var str = '';
    var main = document.getElementById('tag_user');
    var lst_acc = await get_acc_same_group();
    if (!lst_acc || lst_acc.length == 0) return;
    var lst_u = user_ids.split(',');
    str += `<hr/><input list="lst_user" name="search_user" class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')}" id="input_search_user" placeholder="thêm user" />`;
    str += `<datalist id="lst_user">`
    lst_acc.forEach((p) => {
        str += `<option value="${p.user}" data-user_id="${p.id}">${p.user}</option>`;
    });
    str += `</datalist>`;
    str += `<div id="user_data_content">`
    if (user_ids && user_ids.length > 0) {
        lst_acc.filter(f => { return lst_u.indexOf(f.id.toString()) != -1 }).forEach(item => {
            str += `<div data-uid="${item.id}">${item.user} <span data-useruid="${item.id}"></span></div>`;
        });
    }
    str += `</div>`;
    main.innerHTML = str;

    document.getElementById('input_search_user').addEventListener('keydown', (ev, ip) => {
        if (ev.keyCode == 13) {
            var lst_data_user = document.getElementById('lst_user').children;
            var select = Array.prototype.find.call(lst_data_user, (f) => { return f.value == ev.currentTarget.value });
            if (select) {
                var dt_table = document.getElementById('user_data_content');
                if (!dt_table.querySelector(`[data-uid]`)) {
                    // lst_cr_product.push(select.id);
                    // save_product(select.id, cr_gr);
                    dt_table.innerHTML += `<div data-uid="${select.dataset.user_id}">${select.value} <span data-useruid="${select.dataset.user_id}"></span></div>`;
                    init_event_remove_user();
                    save_user_tag();
                } else {
                    alert(`Chỉ được chỉ định 1 người !`);
                }
                ev.currentTarget.value = '';
            }
        }
    });

    init_event_remove_user();

}

async function init_event_remove_user() {
    var dt_table = document.getElementById('user_data_content');
    dt_table.querySelectorAll('span[data-useruid]').forEach((item) => {
        item.innerHTML = '';
        var a_ = document.createElement('a');
        a_.innerText = 'Xóa';
        a_.onclick = function () {
            var row_ = this.parentElement.parentElement;
            row_.parentElement.removeChild(row_);
            save_user_tag();
        };
        item.appendChild(a_);
    });
}

// function remove_user(ele) {
//     var main = document.getElementById('user_data_content');
//     main.removeChild(ele.parentElement);
//     save_user_tag();
// }

async function save_user_tag() {
    var main = document.getElementById('user_data_content');
    var lst_content = main.children;
    var data = Array.prototype.map.call(lst_content, m => {
        return m.dataset.uid
    }).join(',');
    save_chat_group({ user_ids: data || '' });
}

async function get_acc_same_group() {
    const root_url = 'http://localhost:3000';
    let cr_u = await get_cr_user();
    return await fetch(`${root_url}/api/acc_same/${cr_u.id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            if (data != undefined) {
                return data;
            }
            //covertTrueFalse(tb, 6, 'Hiện', 'Ẩn');
        })
        .catch((error) => {
            console.log(error);
            alert('Không thể kết nối máy chủ !')
        });
}

function save_current_list_product() {
    var pro_data = get_current_pro_list();
    //save_chat_group({ pro_ids: pro_data.join(',') });
}

function get_current_pro_list() {
    var dt_table = document.getElementById('table_product').querySelector('tbody');
    var pro_data = [];
    dt_table.querySelectorAll('button').forEach((r) => {
        pro_data.push(r.parentElement.dataset.proid);
    });
    return pro_data;
}

function create_button_panel() {
    return `<div style="width:100%;display:flex;">
    <a id="a_send_guess" class="btn"> Chốt đơn </a> 
    <input type="text" class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')}" style="margin-top:20px" name="real_name_sub" id="real_name_sub" value=""
    placeholder="Nhập tên khách hàng"></div>`;
}

async function create_bill_list() {
    let wd = waitingForNext(2000);
    let lst_bill = await get_all_bill();
    var tb = document.getElementById('bill_table');
    // if (!tb) return;
    tb.innerHTML = '';
    var str = '';
    str += `<div style="width:100%;">
    <div class="bill_title">Đơn chốt gần đây</div>
   <table id="bill_table"> 
        <thead>
            <tr>
                <th>Thời gian</th>
                <th>Tổng (VNĐ)</th>
                <th>Trạng thái</th>
                <th></th>
            </tr>
        </thead>
        <tbody>`;
    lst_bill.forEach((item) => {
        str += `<tr>
                    <td>${format_time(item.time)}</td>
                    <td>${get_format_VND(item.total_bill)}</td>
                    <td>${get_bill_stt(item.stt)}</td>
                    <td><a target="_blank" href="http://localhost:3000/bill/details?id=${item.id}">Xem</a></td>
                </tr>`;
    });
    str += `</tbody>
   </table> 
</div>`;
    tb.innerHTML = str;
}

async function load_data(group_details) {

    var lst_all_tags_name = await tag_name_get_all();
    var lst_pro = await product_get_all();

    load_product(lst_pro, (group_details.pro_ids || '').split(','));
    load_note(group_details.note);




}

async function load_product(list_all, pro_ids) {
    if (!document.getElementById('table_product')) return;
    var table_dt = document.getElementById('table_product').querySelector('tbody');
    // // var lst_exist = Array.prototype.map.call(table_dt.querySelectorAll('button'),(f)=>{return f.dataset.id});
    // var lst_pr = list_all.filter((f) => { return pro_ids.includes(f.id.toString()) });
    // lst_pr.forEach((item) => {
    //     table_dt.innerHTML += `<tr><td>${item.name}</td><td>${get_format_VND(item.price)}</td><td data-proid="${item.id}"></td></tr>`;
    // });
    //<button class="btn_del_row">X</button>
    add_del_bt_to_product();
    table_dt.querySelectorAll('button').forEach((ele) => {
        ele.addEventListener('click', async (e) => {
            var cu_ele = e.currentTarget;
            pro_ids = pro_ids.filter((f) => {
                return (f.toString() != cu_ele.dataset.id);
            });
            await save_chat_group({ pro_ids: pro_ids.join(',') });

        });
    });
}

function load_tag_name(list_all, tags) {
    if (!tags) tags = '';
    var cr_tags = tags.split(',');
    var tab_list = document.getElementById('tag_list').children;
    Array.prototype.forEach.call(tab_list, (t) => {
        if (cr_tags.includes(t.dataset.tid)) {
            if (!t.classList.contains('active')) {
                t.classList.add('active');
            }
        } else {
            t.classList.remove('active');
        }
        //add event tag_name click
        t.addEventListener('click', (ev) => {
            var this_ele = ev.currentTarget;
            var tid = this_ele.dataset.tid;
            var group_id = get_id_from_url(location.href);
            var tag_info = Array.prototype.find.call(list_all, (f) => { return f.id.toString() == tid });

            //config center section
            if (this_ele.classList.contains('active')) {
                this_ele.classList.remove('active');
            } else {
                this_ele.classList.add('active');
            }

            // config left section
            var ele = document.querySelector(`[data-tag_id="${group_id}_${tid}"]`);
            if (ele) {
                ele.parentElement.removeChild(ele);
            } else {
                var div_p = document.querySelector(`[data-gid="${group_id}"]`);
                if (div_p) {
                    div_p.innerHTML += `<div class="tags_details" data-tag_id="${group_id}_${tid}" style="background-color:${tag_info.color}"></div>`;
                }
            }
            var current_tags = Array.prototype.filter.call(document.getElementById('tag_list').children, (fi) => { return fi.classList.contains('active') });
            var data_tag = Array.prototype.map.call(current_tags, (m) => { return m.dataset.tid }).join(',');
            save_chat_group({ tags: data_tag });
        });
    });

}
function load_note(note) {
    if (!document.getElementById('note')) return;
    document.getElementById('note').value = note || '';
}


async function create_select_product() {
    var str = '';
    var lst_pro = await product_get_all();
    // setCookie('lst_pro',JSON.stringify(lst_pro));
    str += `<hr/><input list="lst_product" name="search_product" class="${Array.prototype.join.call(document.querySelector('input').classList, ' ')}" id="input_search_product" placeholder="thêm hàng hóa" />`;
    str += `<datalist id="lst_product">`
    lst_pro.forEach((p) => {
        str += `<option value="${p.code}" data-pid="${p.id}" data-name="${p.name}" data-price="${p.price}">${p.name}</option>`;
    });
    str += `</datalist>`;
    return str;
}

async function create_select_tagname(lst_tag) {
    var str = '';
    str += `<div id="tag_list">`
    lst_tag.forEach((p) => {
        str += `<div class="tag_chat_select" data-tid="${p.id}" style="background-color: ${p.color};">${p.name}</div>`;
    });
    str += `</div>`
    return str;
}

async function create_note() {
    var str = `<hr/><div style="width:100%">
    <label for="note">Note</label>
    <textarea class="form-control" style="width:95%;margin:auto;" name="note" id="note" rows="3"></textarea>
</div>`;
    return str;
}

async function create_tag_name_in_group() {
    var all_a = document.querySelector('[role=navigation]').querySelectorAll('[role=link]');
    if (!all_a) return;
    var lst_all_tag_name = await tag_name_get_all();
    //document.querySelector('[role=navigation]').querySelectorAll('a')[1].children[0].children[1].children[0].children[0].children[0].children[0]
    var lst_a = Array.prototype.filter.call(all_a, (f) => { return f.href.includes('.com/t/') });
    var lst_a2 = Array.prototype.filter.call(lst_a, (f2) => { return !f2.querySelector('[data-gid]'); });
    var lst_ = Array.prototype.map.call(lst_a2, (m) => { return get_id_from_url(m.href) });
    // console.log(lst_);
    if (lst_.length == 0) return;
    var arr_group_tags = await get_group_tags_name(lst_.join(','));

    lst_a2.forEach((item) => {
        // if (item.children[0].children[1]) {
        var div_ = item.querySelector('[data-gid]');
        if (!div_) {
            var id_g = get_id_from_url(item.href);
            var place_ = item.children[0].children[0]
            div_ = document.createElement('div');
            div_.dataset.gid = `${id_g}`;
            div_.classList.add('chat_group_tags');
            place_.appendChild(div_);
        }
        div_.innerHTML = '';
        var cr_id = get_id_from_url(item.href);
        var cr_group = Array.prototype.find.call(arr_group_tags, (f) => { return f.cus_id.toString() == cr_id.toString() });
        if (cr_group && cr_group.tags != null && cr_group.tags.length > 0) {
            var lst_tag = (cr_group.tags || '').split(',');
            lst_tag.forEach((t) => {
                var cr_t = Array.prototype.find.call(lst_all_tag_name, (c) => { return c.id.toString() == t })
                div_.innerHTML += `<div class="tags_details" data-tag_id="${cr_group.cus_id}_${t}" style="background-color:${cr_t.color}"></div>`
            });
        }
        // }
    });
}

// document.addEventListener('load',()=>{
//     set_up_environment();
// });


/**
 * Get all product
 * @returns list all product
 */
async function product_get_all() {
    const root_url = 'http://localhost:3000';
    return await fetch(`${root_url}/api/product` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.log(error);
            alert('Không thể kết nối máy chủ !')
        });
}

async function get_all_bill() {
    let url = location.href;
    var cus_id = get_id_from_url(url);
    const root_url = 'http://localhost:3000';
    return await fetch(`${root_url}/api/bill/${cus_id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data;
        })
        .catch((error) => {
            console.log(error);
            alert('Không thể kết nối máy chủ !')
        });
}

async function tag_name_get_all() {
    const root_url = 'http://localhost:3000';
    return await fetch(`${root_url}/api/tag_name` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            if (data != undefined) {
                return data;
            }
            //covertTrueFalse(tb, 6, 'Hiện', 'Ẩn');
        })
        .catch((error) => {
            console.log(error);
            alert('Không thể kết nối máy chủ !')
        });
}

async function get_group_tags_name(ids) {
    let cr_u = await get_cr_user();
    if (cr_u && cr_u.id) {
        const root_url = 'http://localhost:3000';
        return await fetch(`${root_url}/api/chat_group_tags_name/${ids}` /*, options */)
            .then((response) => response.json())
            .then((data) => {
                if (data != undefined) {
                    return data;
                }
                //covertTrueFalse(tb, 6, 'Hiện', 'Ẩn');
            })
            .catch((error) => {
                console.log('Không có dữ liệu !');
                // alert('Không thể kết nối máy chủ !')
            });
    }
}

async function get_detail_group_mess() {
    let cr_u = await get_cr_user();
    let url = location.href;
    var cus_id = get_id_from_url(url);
    if (cr_u && cr_u.id) {
        const root_url = 'http://localhost:3000';
        return await fetch(`${root_url}/api/chat_group_details/${cr_u.id}/${cus_id}` /*, options */)
            .then((response) => response.json())
            .then((data) => {
                if (data != undefined) {
                    return data[0];
                }
                //covertTrueFalse(tb, 6, 'Hiện', 'Ẩn');
            })
            .catch((error) => {
                console.log('Không có dữ liệu !');
                // alert('Không thể kết nối máy chủ !')
            });
    }
}

async function save_customer(fb_id, data) {
    call_data_no_waiting('save_cus', { fb_id: fb_id, obj: data });
}

async function save_chat_group(data) {
    let cr_u = await get_cr_user();
    let url = location.href;
    var cus_id = get_id_from_url(url);
    if (cr_u && cr_u.id) {
        const root_url = 'http://localhost:3000';
        return await fetch(`${root_url}/api/chat_group_details/${cr_u.id}/${cus_id}`, {
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
                console.log('Error:', error);
            });
    }
}

async function checkout_bill(data, bill_code, trade_code, cmoney) {
    let cr_u = await get_cr_user();
    let url = location.href;
    var cus_id = get_id_from_url(url);
    if (cr_u && cr_u.id) {
        const root_url = 'http://localhost:3000';
        return await fetch(`${root_url}/api/chat_group_details/${cr_u.id}/${cus_id}/${bill_code}/${trade_code}/${cmoney}`, {
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
                console.log('Error:', error);
            });
    }
}

async function tag_name_get_all() {
    const root_url = 'http://localhost:3000';
    return await fetch(`${root_url}/api/tag_name` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            if (data != undefined) {
                return data;
            }
            //covertTrueFalse(tb, 6, 'Hiện', 'Ẩn');
        })
        .catch((error) => {
            console.log(error);
            alert('Không thể kết nối máy chủ !')
        });
}
async function sync_message(data_param) {
    var data = data_param.js_data;
    const max_ = 100;
    let cr_u = await get_cr_user();
    let url = location.href;
    var cus_id = get_id_from_url(url);
    if (cr_u && cr_u.id) {
        // var arr_data = [];
        // var max_t = Math.floor(data.length / max_);
        // for (let i = 0; i < max_t + 1; i++) {
        //     var temp_arr = Array.prototype.slice.call(data, max_ * i, (max_ * i) + max_);
        //     arr_data.push(temp_arr);
        // }
        // arr_data.forEach(async (d) => {
        // await save_message_after_syn(cus_id, cr_u, { js_data: d });
        // });
        await save_message_after_syn(cus_id, cr_u, { js_data: data });

    }
}

async function save_message_after_syn(cus_id, cr_u, data) {
    console.log(data);
    const root_url = 'http://localhost:3000';
    // const root_url = 'http://localhost:3000';
    return await fetch(`${root_url}/api/chat_group_mess/${cus_id}/${cr_u.id}`, {
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
            console.log('Error:', error);
        });
}

async function get_cus_info() {
    let url = location.href;
    var cus_id = get_id_from_url(url);
    const root_url = 'http://localhost:3000';
    return await fetch(`${root_url}/api/customer/0/${cus_id}` /*, options */)
        .then((response) => response.json())
        .then((data) => {
            return data[0];
        })
        .catch((error) => {
            console.log(error);
            alert('Không thể kết nối máy chủ !')
        });
}

async function get_latest_mess() {
    let cr_u = await get_cr_user();
    let url = location.href;
    var cus_id = get_id_from_url(url);
    if (cr_u && cr_u.id) {
        const root_url = 'http://localhost:3000';
        return await fetch(`${root_url}/api/chat_group_mess/${cus_id}/${cr_u.id}` /*, options */)
            .then((response) => response.json())
            .then((data) => {
                if (data != undefined) {
                    return data[0];
                }
                //covertTrueFalse(tb, 6, 'Hiện', 'Ẩn');
            })
            .catch((error) => {
                console.log('Không có dữ liệu !');
                // alert('Không thể kết nối máy chủ !')
            });
    }
}

async function config_message(i_scroll = false) {
    var lst_mess = [];
    var lst_old = await get_list_chat();
    var lst_new = [];
    var scroll_space = document.querySelector('[data-testid="mw_message_list"]').parentElement.parentElement;
    let latest_mess = await get_latest_mess();
    if (latest_mess) {
        console.log('da co tin nhan');
        var existed = lst_old.findIndex((f) => { return (f.group_time == latest_mess.group_time && f.order == latest_mess.order) });
        var group_time_existed = lst_old.findIndex((f) => { return (f.group_time == latest_mess.group_time) }) > -1;
        while (existed < 0 && existed != (lst_old.length - 1) && group_time_existed == false) {
            let cr_group_detail = await get_detail_group_mess();

            if (!cr_group_detail) {
                return;
            }
            scroll_space.scrollTop = 0;
            let w = await waitingForNext(2000);
            lst_old = await get_list_chat();
            existed = lst_old.findIndex((f) => { return (f.group_time == latest_mess.group_time && f.order == latest_mess.order) });
            // console.log(existed);
        }
        if (i_scroll == false) {
            scroll_space.scrollTop = scroll_space.scrollHeight;
        }
        lst_new = lst_old.slice(existed + 1);
        lst_new.forEach((fe) => {
            if (fe.group_time == latest_mess.group_time) {
                fe.order = fe.order + latest_mess.order;
                fe.mess_index = latest_mess.mess_index + lst_new.indexOf(fe) + 1;
            }
        });
    } else {
        console.log('chua co tin nhan');
        // var lst_mess = await get_list_chat();
        while (lst_old.length != lst_new.length) {
            let cr_group_detail = await get_detail_group_mess();

            if (!cr_group_detail) {
                return;
            }
            scroll_space.scrollTop = 0;
            let w2 = await waitingForNext(2000);
            lst_old = lst_new;
            lst_new = await get_list_chat();
            // console.log(`${lst_old.length} - ${lst_new.length}`)
        }
        if (i_scroll == false) {
            scroll_space.scrollTop = scroll_space.scrollHeight;
        }
    }
    lst_mess = lst_new;
    //console.log(lst_mess);
    if (lst_mess && lst_mess.length > 0) {
        let cr_group_detail = await get_detail_group_mess();

        if (!cr_group_detail) {
            return;
        }
        await sync_message({ js_data: lst_mess });
    }
}

async function config_message_current() {
    let w = await waitingForNext(5000);
    var lst_mess = [];
    var lst_old = await get_list_chat_current_group_time();
    var lst_new = [];
    let latest_mess = await get_latest_mess();
    if (latest_mess) {
        var existed = 0;
        //lst_old = await get_list_chat_current_group_time();
        existed = lst_old.findIndex((f) => { return (f.group_time == latest_mess.group_time && f.order == latest_mess.order) });
        // if(existed == -1){
        //     lst_new = lst_old;
        // }else{
        lst_new = lst_old.slice(existed + 1);
        // }
        lst_new.forEach((fe) => {
            if (fe.group_time == latest_mess.group_time) {
                fe.order = fe.order + latest_mess.order;
                fe.mess_index = latest_mess.mess_index + lst_new.indexOf(fe) + 1;
                fe.mess_key = removeVietnameseTones(fe.mes, false);
            }
        });
        lst_mess = lst_new;
        if (lst_mess) {
            await sync_message({ js_data: lst_mess });
            document.querySelectorAll('[data-is_checking]').forEach((ele) => {
                ele.dataset.is_checking = '0';
            });
        }
    }
}

/**
 * Get list chat
 * @returns list all chat mess (can be change after scroll)
 */
async function get_list_chat() {
    // let cr_group_detail = await get_detail_group_mess();

    // if (!cr_group_detail) {
    //     return;
    // }
    // var cus_is_str = get_id_from_url(window.location.href);
    // var cr_stt = await get_current_stt_lazyLoading(cus_is_str);
    if (!document.querySelector('[data-testid="mw_message_list"]')) {
        return [];
    }
    while (true) {

        //list chat (change after scroll)
        var list_chat = document.querySelector('[data-testid="mw_message_list"]').querySelectorAll('[role=row]');

        var lst_mess = [];

        var gr = "";
        var order = 0;

        for (var i = 0; i < list_chat.length; i++) {
            var sl_row = list_chat[i];
            var new_item = {};
            if (sl_row.querySelector('[data-scope=date_break]')) {
                gr = sl_row.querySelector('[data-scope=date_break]').innerText;
                order = 0;
                // console.log(sl_row.innerText);
            } else {
                // new_item.mess_index = i;
                new_item.group_time = replace_day_with_date(gr);
                new_item.group_name = removeVietnameseTones(gr || '');
                var text_container = sl_row.querySelector('[data-testid=message-container]');
                if (text_container) {

                    if (text_container.classList.contains('rl25f0pe')) {
                        new_item.sender = "1";
                    } else {
                        new_item.sender = "0";
                    }
                    new_item.mes = text_container.children[0].innerText;
                    new_item.mess_key = removeVietnameseTones(new_item.mes, false);
                    if (text_container.querySelector('img')) {
                        var lst_img = [];
                        text_container.querySelectorAll('img').forEach((f) => {
                            lst_img.push(f.src);
                        });
                        new_item.img_src = lst_img.join(',');
                    }
                    if (text_container.querySelector('a') && text_container.querySelector('a').hasAttribute('download')) {
                        new_item.file = text_container.querySelector('a').href;
                    }
                    new_item.order = order;
                    // console.log(text_container);
                    if (new_item.mes.length > 0 || (new_item.img_src && new_item.img_src.length > 0) || (new_item.file && new_item.file.length > 0)) {
                        lst_mess.push(new_item);
                        order++;
                    }
                }
            }
        }
        var lst_err = lst_mess.filter((f) => { return (f.img_src) && (f.img_src.indexOf('blob:') > -1) });
        if (lst_mess.length == 0 || lst_err.length == 0) {
            lst_mess.forEach(r => { r.mess_index = lst_mess.indexOf(r) + 1 });
            return lst_mess;
        }
        let wt_img = await waitingForNext(1000);
    }

    //get date_break
    //.querySelector('[data-scope=date_break]')

    // get message container
    //.querySelector('[data-testid=message-container]')

    //rl25f0pe from me

}

async function get_list_chat_current_group_time() {
    if (!document.querySelector('[data-testid="mw_message_list"]')) {
        return [];
    }
    //list chat (change after scroll)
    var list_chat = document.querySelector('[data-testid="mw_message_list"]').querySelectorAll('[role=row]');
    var current_group_element = Array.prototype.slice.call(document.querySelector('[data-testid="mw_message_list"]').querySelectorAll('[data-scope=date_break]'), -1)[0];
    var select = current_group_element.closest('[role=row]');
    var index_select = Array.prototype.indexOf.call(list_chat, select);
    list_chat = Array.prototype.slice.call(list_chat, index_select);

    var order_l = Array.prototype.filter.call(list_chat, (ft) => { return ft.dataset.is_checking == '1' }).length;
    list_chat = Array.prototype.filter.call(list_chat, (ft) => { return ft.dataset.is_checking != '1' });
    var lst_mess = [];

    var gr = "";
    var order = order_l || 0;

    for (var i = 0; i < list_chat.length; i++) {
        var sl_row = list_chat[i];
        sl_row.dataset.is_checking = '1';
        var new_item = {};
        if (sl_row.querySelector('[data-scope=date_break]')) {
            gr = sl_row.querySelector('[data-scope=date_break]').innerText;
            // console.log(sl_row.innerText);
            order = 0;
        } else {
            new_item.group_time = replace_day_with_date(gr);
            new_item.group_name = removeVietnameseTones(gr || '');
            var text_container = sl_row.querySelector('[data-testid=message-container]');
            if (text_container.classList.contains('rl25f0pe')) {
                new_item.sender = "1";
            } else {
                new_item.sender = "0";
            }
            new_item.mes = text_container.children[0].innerText;
            if (text_container.querySelector('img')) {
                var lst_img = [];
                text_container.querySelectorAll('img').forEach((f) => {
                    lst_img.push(f.src);
                });
                new_item.img_src = lst_img.join(',');
            }
            if (text_container.querySelector('a') && text_container.querySelector('a').hasAttribute('download')) {
                new_item.file = text_container.querySelector('a').href;
            }
            new_item.order = order;
            // console.log(text_container);
            lst_mess.push(new_item);
            order++;
        }
    }


    return lst_mess;

}

async function lock_customer() {
    var name_default = document.querySelector('[role=main]').querySelector('div').querySelector('div').querySelector('div').querySelector('div').querySelector('div').children[1].querySelector('a[target="_blank"]').innerText;
    document.getElementById('real_name').value = name_default;
    document.getElementById('real_name_sub').value = name_default;
    var fb_id = get_id_from_url(location.href);
    var img_new = document.querySelector('[role=main]').querySelector('div').querySelector('div').querySelector('div').querySelector('div').querySelector('div').children[1].querySelector('image').src;
    save_customer(fb_id, { real_name: document.getElementById('real_name_sub').value || '', ava_url: img_new || '../img/avatar.png' });
}

function removeVietnameseTones(str, includes_sp = true) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    if (includes_sp == true) {
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    }
    return str;
}

function replace_day_with_date(str) {
    var now = new Date();
    var day_t = 0;
    var time;
    var d = now.getDay();
    // var h = now.getHours();
    // var m = now.getMinutes();
    if (str.includes('T2')) {
        str = str.replace('T2 ', '');
        day_t = 7 + d - 1;
    } else if (str.includes('T3')) {
        str = str.replace('T3 ', '');
        day_t = 7 + d - 2;
    } else if (str.includes('T4')) {
        str = str.replace('T4 ', '');
        day_t = 7 + d - 3;
    } else if (str.includes('T5')) {
        str = str.replace('T5 ', '');
        day_t = 7 + d - 4;
    } else if (str.includes('T6')) {
        str = str.replace('T6 ', '');
        day_t = 7 + d - 5;
    } else if (str.includes('T7')) {
        str = str.replace('T7 ', '');
        day_t = 7 + d - 6;
    } else if (str.includes('CN')) {
        str = str.replace('CN ', '');
        day_t = 7 + d - 0;
    } else if (str.includes('Tháng')) {
        time = str.substring(0, 5);
        str = str.substring(str.indexOf(',') + 2, str.length).replace(' Tháng ', '-').replace(', ', '-') + ' ' + time;
        return convert_to_timestam(str);
    }
    if (day_t > 7) day_t = day_t - 7;
    now = addDays(now, (0 - day_t));
    var y = now.getFullYear();
    var mm = now.getMonth() + 1;
    d = now.getDate();
    if (str.length == 5) {
        time = str;
    } else {
        time = str.substring(str.length - 5, str.length);
    }
    return convert_to_timestam(`${d}-${mm}-${y} ${str}`);
}


function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
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

async function on_loading() {
    // save_user_cr();
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

// async function save_user_cr() {
//     var st_u = await get_storage_user();
//     if (!st_u) {
//         var cr_u = await get_cr_user();
//         window.localStorage.setItem('a_n_id', JSON.stringify(cr_u));
//     }
// }

/* helper method */

function createScrollStopListener(element, callback, timeout) {
    var handle = null;
    var onScroll = function () {
        if (handle) {
            clearTimeout(handle);
        }
        handle = setTimeout(callback, timeout || 200); // default 200 ms
    };
    element.addEventListener('scroll', onScroll);
    return function () {
        element.removeEventListener('scroll', onScroll);
    };
}

async function wait_to_get_data_user() {
    port.postMessage({ type: 'data', name: 'current_user' });
    await waitingForNext(1000);
    var data = await get_storage_user();
    var count = 1;
    while (!data || count < 5) {
        await waitingForNext(1000);
        count++;
    }
    return data;
}

async function call_data_no_waiting(name, data) {
    chrome.runtime.sendMessage({ "type": "data", "name": name, "data": data });
}

async function get_cr_user() {
    try {
        var st_u = await get_storage_user();
        if (st_u && st_u != 'null' && st_u.id != 0) {
            return st_u;
        } else {
            let dt_u = await wait_to_get_data_user();
            return dt_u;
        }
    } catch (error) {
        return {};
    }
}

function get_id_from_url(url) {
    var str = url.substring(url.lastIndexOf('/t/') + 3, url.length);
    str = str.replaceAll('/', '');
    return str;
}

function format_time(time) {
    try {
        var m = time;
        var dateString = m.toLocaleDateString();
        return dateString;
    } catch (error) {
        return time;
    }
}

async function clone_element(old_e) {
    if (!old_e) return;
    var new_element = old_e.cloneNode(true);
    await old_e.parentNode.replaceChild(new_element, old_e);
}

function get_bill_stt(id) {
    let rs = 'MỚi'
    switch (id) {
        case -1:
            rs = 'HỦY'
            break;
        case -1:
            rs = 'HỦY'
            break;
        case 1:
            rs = 'KẾ TOÁN DUYỆT'
            break;
        case 2:
            rs = 'KẾ TOÁN THU TIỀN'
            break;
        case 3:
            rs = 'THỦ QUỸ THU TIỀN'
            break;
        default:
            break;
    }
    return rs;
}

function get_format_VND(str) {
    if (isNaN(str)) return str;
    if (str.toString().indexOf(',') > -1) return str;
    var rs = '';
    var co = 1;
    for (let i = str.toString().length - 1; i >= 0; i--) {
        var ch = str.toString()[i];
        rs = ch + rs;
        if (co % 3 == 0 && i != 0) {
            rs = ',' + rs;
        }
        co++;
    }
    return rs;
}

async function lazy_loading() {
    let cr_group_detail = await get_detail_group_mess();

    if (!cr_group_detail) {
        return;
    }
    while (true) {
        let cr_group_detail = await get_detail_group_mess();

        if (!cr_group_detail) {
            return;
        }
        var w = await waitingForNext(5000);
        await config_message(true);
    }
}

async function get_storage_user() {
    var str = JSON.parse(window.localStorage.getItem('a_n_id'));
    return JSON.parse(str);
}

async function get_current_stt_lazyLoading(cus_id) {
    var str_id = `stt_${cus_id}`;
    return JSON.parse(window.localStorage.getItem(str_id));
}

async function set_current_stt_lazyLoading(stt = 1) {
    var str = `stt_${get_id_from_url()}`
    return window.localStorage.setItem('str', JSON.stringify({ stt: stt, url: window.location.href }));
}

function convert_to_timestam(new_str) {
    //'20-1-2022 17:45' new_str
    new_str = new_str.split(', ')[0];
    return new Date(new_str.split(' ')[0].split('-')[2], new_str.split(' ')[0].split('-')[1] - 1, new_str.split(' ')[0].split('-')[0], new_str.split(' ')[1].split(':')[0], new_str.split(' ')[1].split(':')[1], 0, 0).getTime() / 1000;
}
/* helper method - end */

// port.postMessage({joke: "Knock knock"});
port.onMessage.addListener(function (msg) {
    var request = msg;
    switch (request.type) {
        case "init":
            if (request.ok == 1) {
                window.localStorage.setItem('a_n_id', JSON.stringify(request.data));
                init_event();
            } else {
                alert('Vui lòng đăng nhập !');
            }
            break;
        case "authen":
            break;
        default:
            break;
    }
    //   if (msg.question === "Who's there?")
    //     port.postMessage({answer: "Madame"});
    //   else if (msg.question === "Madame who?")
    //     port.postMessage({answer: "Madame... Bovary"});
});