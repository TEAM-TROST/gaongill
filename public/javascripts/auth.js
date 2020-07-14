$(window).on('load', () => {
    $('.signup-form, .signin-form').on('submit', function (evt) {
        // evt.preventDefault();
        console.log(evt.target);
    });

    $('#pw-change-btn').on('click', function (evt) {
        evt.preventDefault();
        $('#pw_change_field').val(($('#pw_change_field').val()==='false').toString());
        if ($(evt.target).html() === '(닫기)') {
            $(evt.target).html('(비밀번호 변경)');
            $('.pw-change').remove();
        } else {
            $(evt.target).html('(닫기)');
            $('#pw-group').append(`
<div class="form-group input-group pw-change">
    <div class="input-group-prepend">
        <span class="input-group-text"><i class="fa fa-lock"></i></span>
    </div>
    <input type="password" name="password-change" placeholder="변경 비밀번호 입력" class="form-control">
</div>
<div class="form-group input-group pw-change">
    <div class="input-group-prepend">
        <span class="input-group-text"><i class="fa fa-lock"></i></span>
    </div>
    <input type="password" name="password-change-repeat" placeholder="변경 비밀번호 재입력" class="form-control">
</div>
        `.trim());
        }
    });
});