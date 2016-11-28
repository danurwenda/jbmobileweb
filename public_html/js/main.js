function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}

$(document).on(
    'pageshow',
    '#index',
    function(e, data) {
        console.log('wh ' + $(window).height())
        console.log('oh ' + $('#index-content').outerHeight())
        $('#index-content')
            .css('margin-top', ($(window).height() - $('#index-content').outerHeight()) / 2);
    }
);

$(document).on(
    'tap',
    '#submit',
    function(e, data) {
        /*verify email*/
        var email = $('#email').val();
        if (!ValidateEmail(email)) {
            e.preventDefault();
        } else {
          console.log(email);
            var regis_url = 'http://mobile.jbatik.com/back/index.php/register/register';
            $.post(regis_url, {
                email: email
            }, function(d) {
                console.log(d)
                console.log(email);
            });
        }
    }
);
