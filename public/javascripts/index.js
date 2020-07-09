const thousandsSeparators = num => {
    let numParts = num.toString().split('.');
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return numParts.join('.');
};

const fetchAvatarInfo = (item) => {
    const info = $('.army-avatar-info');
    info.find('.name > h5').text(item.itmnm);
    info.find('.unit > h5').text(item.unit);
    info.find('.unit_price > h5').text(thousandsSeparators(item.unit_price) + '원');
    info.find('.total_price > h5').text(thousandsSeparators(item.total_price) + '원');
    info.css('display', 'block');
};

$(window).on('load', () => {
    $.ajax({
        type: 'GET',
        url: '/dataset/personal_clothing_for_soldier_2019.json',
        dataType: 'JSON'
    }).then((jsonData) => {
        $('.army-avatar-section #army-head, .army-avatar-section #army-suite, .army-avatar-section #army-boots').on('click', function (evt) {
            const targetElementID = evt.target.attributes.id.value;

            switch (targetElementID) {
                case 'army-head':
                    fetchAvatarInfo(jsonData[2]);
                    break;
                case 'army-top':
                case 'army-bottom':
                    fetchAvatarInfo(jsonData[0]);
                    break;
                case 'army-boots-left':
                case 'army-boots-right':
                    fetchAvatarInfo(jsonData[3]);
                    break;
            }
        });
    });

    $.ajax({
        type: 'GET',
        url: '/api/kookbangIlbo',
        dataType: 'JSON'
    }).then((jsonData) => {
        for (let i = 0; i < 9; i++) {
            $('.news > ul').append(`<li><a href='${jsonData[i].url}' target="_blank">${jsonData[i].title}</a></li>`.trim());
        }
    });
    $('#kookbangCarousel > .carousel-inner > .carousel-item:first-child').addClass('active');

    $('.army-avatar-info').on('click', function (evt) {
        $('.army-avatar-info').css('display', 'none');
    });

});