// $(document).ready(function(){
//     $.getJSON('http://www.geoplugin.net/json.gp?jsoncallback=?', function(data) {
//         const countryCode = data.geoplugin_countryCode;
//         if(countryCode === 'CN'){
//             let s = document.createElement("script");
//
//             s.type = "text/javascript";
//
//             //Local
//             s.src = "http://www.google.cn/maps/api/js?region=KR&key=AIzaSyDmkJ8gIsSaSMACE2oFXBkJbuMAs-8Jvcs&v=3.exp&libraries=geometry,drawing,places";
//             //Server
//             // s.src = "http://www.google.cn/maps/api/js?region=KR&key=AIzaSyDOh8D1GMQ_Uxq3NwSXIkvM-ZUS8PgI-Ts&v=3.exp&libraries=geometry,drawing,places";
//
//             $("body").append(s);
//
//             //Local
//             $('html').find('script').filter(function(){
//                 return $(this).attr('src') === 'https://maps.googleapis.com/maps/api/js?region=KR&key=AIzaSyDmkJ8gIsSaSMACE2oFXBkJbuMAs-8Jvcs&v=3.exp&libraries=geometry,drawing,places'
//             }).remove();
//             //Server
//             // $('html').find('script').filter(function(){
//             //     return $(this).attr('src') === 'https://maps.googleapis.com/maps/api/js?region=KR&key=AIzaSyDOh8D1GMQ_Uxq3NwSXIkvM-ZUS8PgI-Ts&v=3.exp&libraries=geometry,drawing,places'
//             // }).remove();
//         }
//     });
// });

$(document).ready(function () {
    if ("geolocation" in navigator) {
        /* geolocation is available */
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            var GOOGLE_MAP_KEY = "AIzaSyDOh8D1GMQ_Uxq3NwSXIkvM-ZUS8PgI-Ts"; // server
            // var GOOGLE_MAP_KEY = "AIzaSyDmkJ8gIsSaSMACE2oFXBkJbuMAs-8Jvcs"; // test
			getAddress(latitude, longitude, GOOGLE_MAP_KEY);
        });
    }
    // else {
    //     /* geolocation IS NOT available */
    // }

    // "http://extreme-ip-lookup.com/json/"
    function getAddress(latitude, longitude, GOOGLE_MAP_KEY) {
        $.ajax('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&key=' + GOOGLE_MAP_KEY)
            .then(function (response) {
                //can get -> !CN
            }).catch(function (err) {
            //cannot get -> CN
            let s = document.createElement("script");
            s.type = "text/javascript";
            s.defer = true;
            s.async = true;
            //Local
            s.src = "http://www.google.cn/maps/api/js?region=KR&key=" + GOOGLE_MAP_KEY + "&v=3.exp&libraries=geometry,drawing,places";

            $("body").append(s);
            //Local
            $('html').find('script').filter(function () {
                return $(this).attr('src') === 'https://maps.googleapis.com/maps/api/js?region=KR&key=' + GOOGLE_MAP_KEY + '&v=3.exp&libraries=geometry,drawing,places'
            }).remove();
        })
    }
});
