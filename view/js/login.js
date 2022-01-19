_init();

async function _init(){
  if (check_is_login()) {
    // var bool_rs = await acc_logout();
    location.href = 'user_info.html';
  }else{
    document.getElementById('btn_login').addEventListener('click',()=>{
      login();
    });
    document.getElementById('pass').addEventListener('keypress', (e) => {
      if (e.which == 13 || e.keyCode == 13) {
        login();
      }
    });   
  }
}
async function login() {
  var user = document.getElementById('user').value;
  var pass = document.getElementById('pass').value;
  if (!validateField(user, 'Tên đăng nhập') || !validateField(pass, 'Mật khẩu')) {
    return;
  }
  let rs = await acc_login(user, pass);
  if(rs.error){
    alert('Không thể kết nối với máy chủ !');
    return;
  }
  if (rs.ok == 1) {
    location.href = 'user_info.html';
    var cr_u = rs.data;
    await set_cr_user(cr_u);
  } else {
    alert('Thông tin đăng nhập không chính xác !');
  }
}

function validateField(v, n) {
  if (v == undefined || v == null || v.length == 0) {
      alert(`${n} chưa được chọn !`);
      return false;
  }
  return true;
}

function validateSelect(v, n) {
  if (v == undefined || v == null || v.length == 0 || v == 0) {
      alert(`${n} chưa được chọn !`);
      return false;
  }
  return true;
}