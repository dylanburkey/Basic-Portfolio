
/**
 * main.js
 */
// Web Fonts
WebFontConfig = {
    custom: {
        families: [
            'Gugi',
            'PT Serif'
        ],
        urls: [
            'https://fonts.googleapis.com/css?family=Gugi|PT+Serif'
        ]
    },
    timeout: 2000,
    active: function() {
        sessionStorage.fonts = true;
    }
};




console.log('This is week one homework');