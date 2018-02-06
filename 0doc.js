/*
# 0Doc is a documentation writing tool.
# author:  Joseph Ernest (twitter: @JosephErnest)
# url:     https://github.com/josephernest/0Doc/
# license: MIT license
*/

(function() {

    // Insert includes
    $('#content file').each(function(index) {
        var filename = $(this).attr('src');
        var element = this;
        var client = new XMLHttpRequest();
        client.open('GET', filename, true);
        client.onreadystatechange = function() {
            if (client.readyState === 4) {
                element.outerHTML = client.responseText;
                if ($('#content file').length === 0)    // no more external file <file src="..."></file> to be loaded
                    render();
            }
        };
        client.send();
    });

    if ($('#content file').length === 0)
        render();

    function render() {
        console.log("Rendering markdown");
        // Render Markdown
        marked.Lexer.rules.gfm.heading = marked.Lexer.rules.normal.heading;  // fix to allow ##title as well as ## title (see https://github.com/chjj/marked/issues/642#issuecomment-130213790)
        marked.Lexer.rules.tables.heading = marked.Lexer.rules.normal.heading;
        $('#content').html(marked($('#content').text())).show();

        // Build TOC, inspired of http://stackoverflow.com/a/40946392/1422096
        var toc = document.getElementById('toc_ul');
        var list = document.querySelectorAll("h1,h2");
        var tocArr = [], cur;
        for (var i = 0; i < list.length; i++) {
            var e = list[i];
            if (e.tagName == "H1") {
                tocArr.push({text:e.textContent, children:(cur=[])});
            } else {
                cur.push(e.textContent);
            }
        }
        for (var i in tocArr) {
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.appendChild(document.createTextNode(tocArr[i].text));
            a.href = '#' + tocArr[i].text.toLowerCase().replace(/[^\w]+/g, '-');     // this is how marked produces an id from h1 text
            li.appendChild(a);
            var ch = tocArr[i].children;
            if (ch.length > 0) {
                var ul = document.createElement("ul");
                for (var j in ch) {
                    var li2 = document.createElement("li");
                    var a = document.createElement("a");
                    a.appendChild(document.createTextNode(ch[j]));
                    a.href = '#' + ch[j].toLowerCase().replace(/[^\w]+/g, '-');
                    li2.appendChild(a);
                    ul.appendChild(li2);
                }
                li.appendChild(ul);
            }
            toc.appendChild(li);
        }

    }

    initSearch();
})();
