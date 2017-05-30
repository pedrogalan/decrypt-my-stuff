$(document).ready(function(){init()});
var credentials = "";

init = function() {
    $("#decrypt").click(function(){decrypt();});
    $("#services").change(function(){showSelectedService();});
    $(window).blur(function(){deselectText();})
}

decrypt = function() {

    try {
        var decrypted = CryptoJS.AES.decrypt($("#encrypted").val(), $("#passphrase").val()).toString(CryptoJS.enc.Utf8);
        // console.log('Decrypted message: ' + decrypted);

        credentials = jQuery.parseJSON(decrypted);
        credentials.entries = sortByKey(credentials.entries, 'title');

        populateServices();

        hide('main');
        show('result');
    } catch (e) {
        shake('box');
    }
}

shake = function(divId) {
    var div = $('#' + divId);
    for (i = 0; i < 4; i++) {
        div.animate({"left": "-=20px"}, 50);
        div.animate({"left": "+=20px"}, 50);
    }
}

deselectText = function() {
    if (document.selection) {
        document.selection.empty();
    } else if (window.getSelection) {
        window.getSelection().removeAllRanges();
    }
}

selectText = function(containerId) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerId));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerId));
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }

    showBubble(containerId);
}

showBubble = function(containerId) {
    var bubble = $('#bubble');
    var containerOffset = $('#' + containerId).offset();

    bubble.css('top', containerOffset.top);
    bubble.css('left', containerOffset.left);
    bubble.css('opacity', '1.0');
    bubble.css('z-index', '1');
    bubble.css('visibility', 'visible')
    bubble.animate({opacity: 0.0, top: '-=50px', 'z-index': -1}, 500);
}

searchCredentials = function(id) {
    $.each(credentials.entries, function(key, value) {
        if (value.id == id) {
            result = value;
        }
    });
    return result;
}

registerTableEvents = function() {
    $(".button").each(function(index) {
        $(this).click(function(){switchHideShow(this); return false;});
    });
    $(".value div").each(function(index) {
        $(this).click(function(){selectText($(this).attr('id'));});
    });
}

buildTableRow = function(key, keyWithoutSpaces, value) {
    if (key == "id" || key == "title") {
        return "";
    }

    var row = "";
    row += "<tr>";
    row += "    <td class='key'>" + key + "</td>";
    row += "    <td class='value'><div id='value-" + keyWithoutSpaces + "' class='obfuscated'>" + value + "</div></td>";
    row += "    <td class='op'><a id='hideShow-" + keyWithoutSpaces + "' class='button show' href='#'>Show</a>";
    row += "</tr>";

    return row;
}

switchHideShow = function(linkId) {
    link = $(linkId);

    var tdId = link.attr('id').replace("hideShow", "value");

    if (link.text() == "Show") {
        link.text("Hide");
        link.addClass("hide");
        link.removeClass("show");
        showText(tdId);
    } else if (link.text() == "Hide") {
        link.text("Show");
        link.addClass("show");
        link.removeClass("hide");
        hideText(tdId);
    }
}

populateServices = function() {
    var services = $('#services');
    services.html('');
    services.append('<option value = "0">Select service</option>');
    $.each(credentials.entries, function(key, value) {
        services.append('<option value = "' + value.id + '">' + value.title + '</option>');
    });
}

sortByKey = function(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x.toLowerCase() < y.toLowerCase()) ? -1 : ((x.toLowerCase() > y.toLowerCase()) ? 1 : 0));
    });
}

showSelectedService = function() {
    showService($('#services').val());
}

showService = function(id) {
    var info = searchCredentials(id);

    var table = $('#detail');
    table.html('');
    for (var key in info) {
        var keyWithoutSpaces = key.replace(/ /g, "-");
        table.append(buildTableRow(key, keyWithoutSpaces, info[key]));
    }
    show('detail')
    registerTableEvents();
}

hideText = function(id) {
    deselectText();
    $('#' + id).addClass('obfuscated');
}

showText = function(id) {
    deselectText();
    $('#' + id).removeClass('obfuscated');
}

show = function(id) {
    $('#' + id).removeClass('hidden');
}

hide = function(id) {
    $('#' + id).addClass('hidden');
}
