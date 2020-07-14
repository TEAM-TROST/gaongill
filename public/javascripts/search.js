$(window).on('load', () => {
    $('.search-action-form').on('submit', function (evt) {
        const queryTmpElement = $(evt.target).children('input[name="query-tmp"]');
        const queryElement = $(evt.target).children('input[name="query"]');
        queryElement.val(encodeURI(queryTmpElement.val().toString()));
        queryTmpElement.attr('disabled', 'disabled');
        // evt.preventDefault();
    });
});