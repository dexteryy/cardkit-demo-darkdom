
require.config({
    baseUrl: 'bower_components/',
    aliases: {
        dollar: 'dollar/dollar/'
    }
});

define('dollar', 'dollar/dollar.js');
define('soviet', 'soviet/soviet.js');
define('darkdom', 'darkdom/darkdom.js');
