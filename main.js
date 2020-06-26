var http = require('http');
var fs = require('fs');
var url =require('url');

var server = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    var title = queryData.id;
    console.log(_url);
    console.log(url.parse(_url, true));

    function templateHTML(title, list, body) {
        return `
               <!DOCTYPE html>
               <html>
               <head>
               <link rel="icon" href="https://lh3.googleusercontent.com/idcprs0e8h6Uk3DqnD4tRsAiQqIrqp7bLHGeL2C1b8pzgHpurmYoVZTbJrsVoQwuFOmPpIGyJH3DC_KFpxfK4mDU_61xXdvXFjuG6X6YCFJQxygnOMhUyW8nVqgkCzx3nbzCoU8J3Dhc_vzAXBKMv6kcT26Gq2K5P-CMWFhRLpN1ve1ABCcUJZekeE1OKKY6-QTnSftYdkgk9qYgTy6RzNIzQ3PHN5ORhhJJFpL19rYTGVtOH96FAhC3eLTbfzPcO21tik14WwLV534evjkQy0r5fCG7siiqk1zDYm-3rEdaTuZpj_wMWtskftFacuMULOuYGAmnyrcB_I8V2uFYeKZuV4V-Ky1l_nUaDtgkeTEVyPMXWEovkqmSFMGai5-diGetPd6ZTqq2hffn2SQqpy_L4hHzd1pPo8GrekMuta3fm8TD17V5fMpbsOaax-u1dPVqwwuTei0IaI3kzzrRVJEh6DnIkC2B1ypD9GueC7GGv_3eoPUthYkieIzEpG1iqZujZB3_eulyHz7VrDou2LKvaKf3oMNl4ZCEaeKFVmjGswgH5IyZ6t6wrAUOhTATdVqWK8fW9Wao1Cw_t6_CV6cRVy_yemPlh3PKTO8VeDf0nmVQV8WIpc6kVOPxGLtLGRacpFPXsBUIoY9BEvq1z1jgB0EENXi4KnMl5fZDgdo3vLyr2yGQ-L9CkWCg=s16-no?authuser=0" />
               <meta charset="utf-8" />
               <title>WEB - ${title}</title>
               </head>
               <body>
               <h1>
               <a href="/">WEB</a>
               </h1>
               ${list}
               <input type="button" id="btn_create" value="create" />
               <input type="button" id="btn_update" value="update" />
               <input type="button" id="btn_delete" value="delete" />
               ${body}
               </body>
               </html>
               `;
    }
    function templateList(fileList) {
        var i = 0;
        var list = ``;
        for (i; i < fileList.length; i++){
            list = list + `<li><a href="?id=${fileList[i]}">${fileList[i]}</a></li>`;
        }
        list = `<ol>${list}</ol>`;
        return list;
    }
   
    if(pathName === '/'){
        // [fs.readdir]
        // Read all files at a specific address and return the values in array.
        fs.readdir('./data', 'utf8', function(err, fileList){
            if(err) throw err;
            list = templateList(fileList);
        });
        // [fs.readFile]
        // Read the text from each file and reflect it on the main page.
        fs.readFile(`./data/${title}`, "utf8", function(err, description){
            if(description === undefined){
                title = "Welcome";
                description = "Welcome!";
            }
            var template = templateHTML(title, list, `<h2>${title}</h2><p>${description}</p>`);
            response.writeHead(200);
            response.end(template);
        });
    } else {
        response.writeHead(404);
        response.end('Page Error');
    }
});
server.listen(3000);
