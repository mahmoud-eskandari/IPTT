function toEnglish(val) {
    var num_dic = {
        '۰': '0',
        '۱': '1',
        '۲': '2',
        '۳': '3',
        '۴': '4',
        '۵': '5',
        '۶': '6',
        '۷': '7',
        '۸': '8',
        '۹': '9'
    };
    return parseInt(val.replace(/[۰-۹]/g, function (w) {
        return num_dic[w];
    }));
}

function toPersian(val) {
    var num_dic = {
        '0': '۰',
        '1': '۱',
        '2': '۲',
        '3': '۳',
        '4': '۴',
        '5': '۵',
        '6': '۶',
        '7': '۷',
        '8': '۸',
        '9': '۹'
    };
    val = val.toString();
    if (val < 10) {
        val = "0" + val;
    }
    return val.replace(/[0-9]/g, function (w) {
        return num_dic[w];
    });
}

/**
 *
 * @param Toman
 * @param Rate
 * @returns {string}
 * @constructor
 */
TomanToHour = function (Toman, Rate, DailyHours, Daily) {
    if (Toman.indexOf(',') < 0) {
        return Toman;
    }
    price = toEnglish(Toman.replace(/[, ]/g, ''));
    hour = Math.floor(price / Rate);
    minute = (price / Rate) - hour;
    if (Daily == 1) {
        return toPersian(Math.round((price / Rate)/DailyHours * 100)/100) + "عمر";    
    }
    return toPersian(hour) + ":" + toPersian(Math.round(minute * 60))+ "عمر";
};

/**
 *
 * @param Rial
 * @param Rate
 * @returns {string}
 * @constructor
 */
RialToHour = function (Rial, Rate, DailyHours, Daily) {
    if (Rial.indexOf(',') < 0) {
        return Rial;
    }
    price = parseInt(toEnglish(Rial.replace(/[, ]/g, '')))/10;
    hour = Math.floor(price / Rate);
    minute = (price / Rate) - hour;
    if (Daily == 1) {
        return toPersian(Math.round((price / Rate)/DailyHours * 100)/100) + "عمر";    
    }
    return toPersian(hour) + ":" + toPersian(Math.round(minute * 60))+ "عمر";
};

ConvertTohourly = function () {
    chrome.storage.sync.get(['hourly_wages', 'daily_hours', 'is_active', 'daily'], function (result) {
        if (result.is_active !== undefined && result.is_active === 0) {
            return false;
        }
        if (result.hourly_wages !== undefined) {

            /**
             * DigiKala
             */

            if (window.location.href.indexOf('www.digikala.com') > -1) {

                //Ware pages
                $('.js-price-value,del').each(function () {
                    $(this).html(TomanToHour($(this).html(), result.hourly_wages, result.daily_hours, result.daily));
                });

                //Sub Slider
                $('.c-price__value:not(.js-variant-price)').each(function () {
                    $(this).html(TomanToHour($(this).html(), result.hourly_wages, result.daily_hours, result.daily));
                });

                //Main Slider
                $('.c-discount__price--original,.c-discount__price--now').each(function () {
                    $(this).find('span').remove();
                    $(this).html(TomanToHour($(this).text(), result.hourly_wages, result.daily_hours, result.daily));
                });

                //Special Slider
                $('.c-promo-single__price,.c-promo-single__discount').each(function () {
                    $(this).html(TomanToHour($(this).text(), result.hourly_wages, result.daily_hours, result.daily));
                });

                //Clear Toman
                $('.c-price__currency').each(function () {
                    $(this).remove()
                });
            }

            /**
             * Bamilo
             */

            if (window.location.href.indexOf('www.bamilo.com') > -1) {
                setTimeout(function () {
                    //Group 1
                    $('[data-price],._6oBb.aVuo._3QXu.aiK9,._22Qe._9JX9._3Fln.e4Ka._7ppA').each(function () {
                        $(this).html(RialToHour($(this).html(), result.hourly_wages, result.daily_hours, result.daily));
                    });
                    //Clear Rial
                    $('[data-currency-iso],span').each(function () {
                        if($(this).html() == 'ریال'){
                            $(this).remove()
                        }
                        if($(this).html().indexOf(',') > -1){
                            if(toEnglish($(this).html()) > 0){
                                $(this).html(RialToHour($(this).html(), result.hourly_wages, result.daily_hours, result.daily));
                            }
                        }
                    });
                },4000);

            }

        }
    });
};
$(document).ready(function () {

    $('body').delegate('[data-event=config_change]', 'click', function () {
        setTimeout(ConvertTohourly, 1200)
    });
    $('body').delegate('.c-pager__item', 'click', function () {
        setTimeout(ConvertTohourly, 1200)
    });
	
	if (window.location.href.indexOf('www.bamilo.com') > -1) {
		$('body').delegate('span,a','click',function () {
			setTimeout(ConvertTohourly, 1200)
		});
	}
    setTimeout(ConvertTohourly, 1200)
});
