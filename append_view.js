/**
 * Convert Persian Digits to English Digits
 * @param val
 * @returns {number}
 */
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

/**
 * Convert English Digits to Persian Digits
 * @param val
 * @returns {string}
 */
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
 * @param Unit
 * @param Rate
 * @param DailyHours
 * @param Daily
 * @returns {*}
 * @constructor
 */
LifeTimeCalculator = function (Toman, Unit, Rate, DailyHours, Daily) {
    if (Toman.indexOf(',') < 0) {
        return Toman;
    }
    var price = toEnglish(Toman.replace(/[, ]/g, ''));
    //Affect Rial Calculator
    if (Unit === "Rial") {
        price /= 10;
    }
    var hour = Math.floor(price / Rate);
    var minute = (price / Rate) - hour;
    if (Daily === 1) {
        var CalculatedDays = Math.round((price / Rate) / DailyHours * 100) / 100;
        if(CalculatedDays > 30){
            return toPersian(Math.floor(CalculatedDays/30))+" ماه و "+toPersian(Math.round(CalculatedDays%30)) + "روز";
        }
        return toPersian(CalculatedDays) + "روز";
    }
    return toPersian(hour) + ":" + toPersian(Math.round(minute * 60)) + "ساعت کار";
};

CalculateLifeTime = function () {
    chrome.storage.sync.get(['hourly_wages', 'daily_hours', 'is_active', 'daily'], function (result) {
        if (result.is_active !== undefined && result.is_active === 0) {
            return false;
        }
        if (result.hourly_wages !== undefined) {

            /**
             * DigiKala Actions
             */

            if (window.location.href.indexOf('www.digikala.com') > -1) {

                //Ware pages
                $('.js-price-value,del').each(function () {
                    $(this).html(LifeTimeCalculator($(this).html(), "Toman", result.hourly_wages, result.daily_hours, result.daily));
                });

                //Sub Slider
                $('.c-price__value:not(.js-variant-price)').each(function () {
                    $(this).html(LifeTimeCalculator($(this).html(), "Toman", result.hourly_wages, result.daily_hours, result.daily));
                });

                //Main Slider
                $('.c-discount__price--original,.c-discount__price--now').each(function () {
                    $(this).find('span').remove();
                    $(this).html(LifeTimeCalculator($(this).text(), "Toman", result.hourly_wages, result.daily_hours, result.daily));
                });

                //Special Slider
                $('.c-promo-single__price,.c-promo-single__discount').each(function () {
                    $(this).html(LifeTimeCalculator($(this).text(), "Toman", result.hourly_wages, result.daily_hours, result.daily));
                });

                //Clear Toman
                $('.c-price__currency').each(function () {
                    $(this).remove()
                });
            }

            /**
             * Bamilo Actions
             */

            if (window.location.href.indexOf('www.bamilo.com') > -1) {
                setTimeout(function () {
                    //Group 1
                    $('[data-price],._6oBb.aVuo._3QXu.aiK9,._22Qe._9JX9._3Fln.e4Ka._7ppA').each(function () {
                        $(this).html(LifeTimeCalculator($(this).html(), "Rial", result.hourly_wages, result.daily_hours, result.daily));
                    });
                    //Clear Rial
                    $('[data-currency-iso],span').each(function () {
                        if ($(this).html() == 'ریال') {
                            $(this).remove()
                        }
                        if ($(this).html().indexOf(',') > -1) {
                            if (toEnglish($(this).html()) > 0) {
                                $(this).html(LifeTimeCalculator($(this).html(), "Rial", result.hourly_wages, result.daily_hours, result.daily));
                            }
                        }
                    });
                }, 4000);

            }

        }
    });
};
$(document).ready(function () {
    var Body = $('body');

    //Digikala event listeners
    if (window.location.href.indexOf('www.digikala.com') > -1) {
        Body.delegate('[data-event=config_change]', 'click', function () {
            setTimeout(CalculateLifeTime, 1200)
        });
        Body.delegate('.c-pager__item', 'click', function () {
            setTimeout(CalculateLifeTime, 1200)
        });
        Body.delegate('input[type=checkbox]', 'change', function () {
            setTimeout(CalculateLifeTime, 2000)
        });
        Body.delegate('[data-sort]', 'click', function () {
            setTimeout(CalculateLifeTime, 2000)
        });
    }

    //Digikala event listeners
    if (window.location.href.indexOf('www.bamilo.com') > -1) {
        Body.delegate('span,a', 'click', function () {
            setTimeout(CalculateLifeTime, 1200)
        });
    }
    setTimeout(CalculateLifeTime, 1200)
});
