$(window).on('load', () => {
    if (location.hash === '#_=_') location.replace(location.href.split('#')[0]);
});