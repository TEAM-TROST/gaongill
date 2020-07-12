$(window).on('load', () => {
    $('#eval_form').on('submit', function (evt) {
        const promise_content = $('#eval_form textarea[name="promise_content"]');
        promise_content.val(promise_content.val().replace(/\r\n|\r|\n/g, "<br />"));
        $('#eval_form textarea[name="eval_content"]').val($('#summernote').summernote('code'));
        // evt.preventDefault();
    });

    $('#eval_ref_add_btn').on('click', () => {
        $('#eval_ref_area').append(`
<div class="form-group input-group">
    <div class="input-group-prepend">
        <span class="input-group-text">제목</span>
    </div>
    <input type="text" class="form-control" name="eval_ref_title">
    <div class="input-group-prepend">
        <span class="input-group-text">URL</span>
    </div>
    <input type="text" class="form-control" name="eval_ref_href">
</div>
        `.trim())
    });
});