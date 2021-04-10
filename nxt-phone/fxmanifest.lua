fx_version 'cerulean'
game 'gta5'

author 'Flakey'
description 'Custom-made phone by Flakey'
version '1.0.0'

ui_page 'ui/index.html'

server_scripts {
    '@mysql-async/lib/MySQL.lua',
    'server/*.lua',
}

client_scripts {
    'client/*.lua'
}

files({
    'ui/index.html',
    'ui/app.js',
    'ui/style.css',
    'ui/img/background.jpg',
    'ui/img/shell.png', 
    'ui/img/appearance-preview.png', 
})