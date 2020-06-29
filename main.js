var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
        
var server = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathName = url.parse(_url, true).pathname;
    var title = queryData.id;

    function templateHTML(title, list, control, body) {
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
               ${control}
               ${body}
               </body>
               </html>
               `;
    }
    function templateList(fileList) {
        var i = 0;
        var list = ``;
        for (i; i < fileList.length; i++){
            list = list + `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
        }
        list = `<ol>${list}</ol>`;
        return list;
    }
    function templateControl(create, update, del) {
        return `
        <div sytle="text-align:center">
        <input type="button" onclick="location.href='/create'" value="create" style="display:inline-block" ${create} />
        <input type="button" onclick="location.href='/update?id=${title}'" value="update" style="display:inline-block" ${update} />
        <form action="/process_delete" method="post" style="display:inline-block">
        <input type="hidden" name="id" value="${title}" />
        <input type="submit" value="delete" ${del} />
        </form>
        </div>
        `
    }
   
    if(pathName === '/'){
        // [fs.readdir]
        // Read all files at a specific address and return the values in array.
        fs.readdir('./data', 'utf8', function(err, fileList){
            if(err) throw err;
            var list = templateList(fileList);
            // [fs.readFile]
            // Read the text from each file and reflect it on the main page.
            fs.readFile(`./data/${title}`, function(err, description){
                if(description === undefined){
                    title = "Welcome";
                    description = "Welcome!";
                    control = templateControl('', 'disabled', 'disabled');
                    var template = templateHTML(title, list, control, `<h2>${title}</h2><p>${description}</p>`);
                    response.writeHead(200);
                    response.end(template);
                } else {
                    var control = templateControl();
                    var template = templateHTML(title, list, control, `<h2>${title}</h2><p>${description}</p>`);
                    response.writeHead(200);
                    response.end(template);
                }
            });
        });
    } else if(pathName === '/create'){
        fs.readdir('./data', 'utf8', function(err, fileList){
            // if(err) throw err;
            var list = templateList(fileList);
            var title = 'CREATE';
            var control = templateControl('', 'disabled', 'disabled');
            var template = templateHTML(title, list, control, `
            <p>
            <form action="/process_create" method="post">
            <label for="txtbox">Title: </label>
            <input type="text" id="txtbox" name="title" placeholder="insert title" />
            <br />
            <label for="txtarea">Description: </label>
            <textarea id="txtarea" name="description" placeholder="insert description"></textarea>
            <br />
            <input type="submit" value="Submit" />
            </form>
            </p>
            `);
            response.writeHead(200);
            response.end(template);
        });
    } else if (pathName === "/process_create"){
        var body ='';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            // [fs.appendFile]
            // Same as writeFile. The function is to literally to create a file.
            fs.appendFile(`./data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${qs.escape(title)}`});
                response.end();
            });
        });
    } else if(pathName === "/update"){
        // var title= queryData.id
        fs.readdir(`./data`, 'utf8', function(err, fileList){
            fs.readFile(`./data/${title}`, function(err, description){
            var list = templateList(fileList);
            var control = templateControl('disabled', '', 'disabled');
            var template = templateHTML(title, list, control, `
            <p>
            <form action="/process_update" method="post">
            <input type="hidden" name="id" value="${title}"  />
            <lable for="txtbox">Title: </label>
            <input type="text" id="txtbox" name="title" value="${title}" />
            <br />
            <label for="txtarea">Description: </label>
            <textarea id="txtarea" name="description">${description}</textarea>
            <br />
            <input type="submit" value="Submit" />
            </form>
            </p>
            `);
            response.writeHead(200);
            response.end(template);
            });
        });
    } else if(pathName === "/process_update"){
        var body ='';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`./data/${id}`, `./data/${title}`, function(err){
                fs.writeFile(`./data/${title}`, description, function(err){
                    response.writeHead(302, {Location: `/?id=${qs.escape(title)}`});
                    response.end();
                });
            });
        });
    } else if(pathName === "/process_delete"){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`./data/${id}`, function(err){
                response.writeHead(302, {Location: '/'});
                response.end();
            })
        });
    } else {
        response.writeHead(404);
        response.end('Page Error');
    }
});
server.listen(3000);
