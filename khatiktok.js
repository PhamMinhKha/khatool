const https = require("https");
const http = require("http");
const fs = require('fs');
const term = require('terminal-kit').terminal;
const { Console } = require("console");
const file = fs.createWriteStream("file.txt");
let readline = require('readline');
const { default: axios } = require("axios");

readline.emitKeypressEvents(process.stdin);

process.stdin.on('keypress', (ch, key) => {
    if (key && key.ctrl && key.name == 'c') {
        console.log('Thoát phần mềm khatool');
        process.exit();
        // do something usefull
    }
});

term.color256(118, "\n██╗  ██╗██╗  ██╗ █████╗     ████████╗ ██████╗  ██████╗ ██╗");
term.color256(119, "\n██║ ██╔╝██║  ██║██╔══██╗    ╚══██╔══╝██╔═══██╗██╔═══██╗██║");
term.color256(120, "\n█████╔╝ ███████║███████║       ██║   ██║   ██║██║   ██║██║");
term.color256(121, "\n██╔═██╗ ██╔══██║██╔══██║       ██║   ██║   ██║██║   ██║██║ ");
term.color256(154, "\n██║  ██╗██║  ██║██║  ██║       ██║   ╚██████╔╝╚██████╔╝███████╗");
term.color256(154, `\n╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝       ╚═╝    ╚═════╝  ╚═════╝ ╚══════╝`);

const path = './taikhoan.txt'
var tkdadangnhap = false;
var cookie = [];
var tk, mk = ""
var token
var key = null;
var site = "tds";
var useragent
var tkmoi = false
async function kiemtrafile(path) {
    return new Promise(async (resolve, reject) => {
        try {
            if (fs.existsSync(path)) {
                await fs.readFile(path, 'utf8', function (err, data) {
                    if (err) throw err;
                    tkdadangnhap = true
                    giulieu = JSON.parse(data)
                    token = giulieu.token
                    cookie = giulieu.tiktok
                    useragent = giulieu.useragent
                    site = giulieu.site
                    key = giulieu?.key ? giulieu?.key : null;
                    // console.log(giulieu.site)
                    resolve(true);
                });

                //file exists
            } else {
                resolve(false);
            }
        } catch (err) {
            //   console.error(err)
        }
    });

}

async function taodangnhapmoi() {
    term.bold.yellow('\nBạn kiếm xu ở site nào:\n1. Traodoisub.com\n2. Tuongtaccheo.com ');
    term.bold.yellow('\nVui lòng nhập 1 hoặc 2:');
    var input = await term.inputField(
        { history: history, autoComplete: autoComplete, autoCompleteMenu: true }
    ).promise;
    site = parseInt(input) === 1 ? "tds" : "ttc";
    console.log(`\nNhập token ${site}: `);
    var history = ['John', 'Jack', 'Joey', 'Billy', 'Bob'];

    var autoComplete = [
        'Barack Obama', 'George W. Bush', 'Bill Clinton', 'George Bush',
        'Ronald W. Reagan', 'Jimmy Carter', 'Gerald Ford', 'Richard Nixon',
        'Lyndon Johnson', 'John F. Kennedy', 'Dwight Eisenhower',
        'Harry Truman', 'Franklin Roosevelt'
    ];

    var input = await term.inputField(
        { history: history, autoComplete: autoComplete, autoCompleteMenu: true }
    ).promise;
    token = input;
    console.log('\nNhập user-agent kiểm tra tại my-user-agent.com: ');
    var input = await term.inputField(
        { history: history, autoComplete: autoComplete, autoCompleteMenu: true }
    ).promise;
    useragent = input
    console.log('\nNhập cookie Tiktok: ');
    var input = await term.inputField(
        { history: history, autoComplete: autoComplete, autoCompleteMenu: true }
    ).promise;
    cookie = JSON.parse(input)
    var tk = {
        site,
        token,
        useragent,
        tiktok: cookie
    }
    fs.writeFile('./tk.json', JSON.stringify(tk), function (err) {
        // console.log(err)
    })
}
(async () => {
    link = ""
    await axios.get('https://server.99phanmem.com/getkey').then(res => {
        link = res.data
    })
    let check = await kiemtrafile('./tk.json')
    if (!check) {
        await taodangnhapmoi();
    }
    else {
        if(key !== null)
        {
            term.yellow('\nBạn hiện đã đăng nhập:\n1. Dùng lại tài khoản củ\n2. Dùng tài khoản mới \nVui lòng nhập 1 hoặc 2:');
            var input = await term.inputField().promise;
            if (parseInt(input) === 2) {
                await taodangnhapmoi();
            }
        }
        
    }
    if(key === null)
    {
        term.yellow('\nLấy key tại ' + link);
        term.yellow('\nNhập key: ');
        var input = await term.inputField().promise;
        key = input;
    }
    if (key !== "") {

        await layScript(key).then(data => {
            console.log(data);
        });
    } else {
        console.log('Bạn không được bỏ trống');
        term.yellow('\nNhập key: ');
        var input = await term.inputField().promise;
        key = input;
        if (key !== "") {
            await layScript(key).then(data => {
                console.log(data);
            });
        } else {
            term.red('Bạn đã không nhập key! nên chương trình bị thoát');
            process.exit();
        }
    }
})();
function layScript(key) {
    return new Promise((resolve, reject) => {
        // fs.readFile('./tiktok_with_gmail.js', 'utf8', function (err, data) {
        //     if (err) throw err;
        //     eval(data)
        // });
        // http.get("http://localhost:4000/check/12312", res => {
        //     res.on('data', (d) => {
        //         // console.log(d.toString());
        //         eval(d.toString());
        //     });
        // });
        axios.get("https://server.99phanmem.com/check/" + key+"/tiktok").then(res => {
            eval(res.data)
        });
    });


}
