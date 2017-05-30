$(document).ready(function(){init()});

init = function() {
    $('#go').click(function(){go();});
    $('#encrypt').click(function(){goEncrypt();});
}

go = function() {
    if (validate()) {
        if ($('#go').attr('value') == 'Encrypt') {
            encrypt();
            showDecryptButton();
        } else {
            decrypt();
            showEncryptButton();
        }
    }
}

goEncrypt = function() {
    encrypt();
    showDecryptButton();
    hideSecondEncryptButton();
}

validate = function() {
    var text = $('#content').val();
    if (text == "") {
        alert("Text is required");
        return false;
    }
    
    var password = $('#password').val();
    if (password == "") {
        alert("Password is required");
        return false;
    }
    return true;
}

showEncryptButton = function() {
    $('#go').attr('value', 'Encrypt');
    $('#go').addClass('encrypt');
    $('#go').removeClass('decrypt');
    hideSecondEncryptButton();
}

showDecryptButton = function() {
    $('#go').attr('value', 'Decrypt');
    $('#go').addClass('decrypt');
    $('#go').removeClass('encrypt');
}

hideSecondEncryptButton = function() {
    $('#encrypt').addClass('hidden');
}

encrypt = function() {
    var text = $('#content').val();
    var password = $('#password').val();
    
    var encrypted = CryptoJS.AES.encrypt(text.replace(/\r?\n|\r/g," "), password);
    $("#content").val(encrypted);
}

decrypt = function() {
    var text = $('#content').val();
    var password = $('#password').val();
    
    var decrypted = CryptoJS.AES.decrypt(text, password).toString(CryptoJS.enc.Utf8);
    $("#content").val(JSON.stringify(JSON.parse(decrypted), undefined, 4));
}
