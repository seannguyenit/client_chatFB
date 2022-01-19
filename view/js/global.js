'use strict'


set_up_page();

async function set_up_page(){
    insert_script('main_function.js');
}

async function insert_script(name){
    const root_url = 'https://arthurtech.xyz/client/'
    var script = document.createElement('script');
    script.src = `${root_url + name}`;
    document.body.appendChild(script);
}

async function insert_css(name){
    const root_url = 'https://arthurtech.xyz/client/'
    var css = document.createElement('link');
    css.href = `${root_url + name}`;
    document.head.appendChild(css);
}