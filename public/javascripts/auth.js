$(window).on('load', () => {
   $('.signup-form, .signin-form').on('submit', function(evt){
       // evt.preventDefault();
       console.log(evt.target);
   });
});