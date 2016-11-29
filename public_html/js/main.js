function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}


var dictionary = {
    'signup': {
        'id': 'Daftarkan email anda untuk mendapatkannya GRATIS!',
        'en': 'Sign up for FREE jBatik Mobile'
    }
    , 'submit': {
        'id': 'Daftar',
        'en': 'Submit'
    }
    , 'thank': {
        'id': 'Terima kasih!',
        'en': 'Thank you!'
    }
    , 'msg': {
        'id': 'Aplikasi ini dalam proses penyelesaian. Kami akan mengirimkannya lewat email Anda.',
        'en': 'The apps is in the making. We\'ll let you know when it\'s ready.'
    }
}, current_lang = 'id';
$(function () {
    $("[data-role='header'], [data-role='footer']").toolbar();
    translate()
});
function translate() {
    $("[data-translate]").each(function () {
        var key = $(this).data('translate');
        $(this).html(dictionary[key][current_lang] || "N/A");
    });
}
$(document).on('tap', '[data-lang]', function () {
    current_lang = $(this).data('lang');
    translate()
})



$(document).on(
        'pageshow',
        '#index',
        function (e, data) {
            console.log('wh ' + $(window).height())
            console.log('oh ' + $('#index-content').outerHeight())
            $('#index-content')
                    .css('margin-top', ($(window).height() - $('#index-content').outerHeight()) / 2);
        }
);

$(document).on(
        'tap',
        '#submit',
        function (e, data) {
            /*verify email*/
            var email = $('#email').val();
            if (!ValidateEmail(email)) {
                e.preventDefault();
            } else {
                var regis_url = 'http://mobile.jbatik.com/back/index.php/register/register';
                $.post(regis_url, {
                    email: email
                }, function (d) {
                    console.log(d)
                    console.log(email);
                });
            }
        }
);

