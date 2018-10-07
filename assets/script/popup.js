/**
 * @constructor
 */
var PopupController = function () {
    this.hourly_wages = document.getElementById('hourly_wages');
    this.daily_hours = document.getElementById('daily_hours');
    this.switch_ = document.getElementById('switch');
    this.daily_ = document.getElementById('daily');
    this.addListeners_();
};

/**
 * Comma seperator
 * @param _number
 * @returns {string}
 */
function SeparateDigit(_number) {
    var input = _number.toString().replace(/[\D\s\._\-]+/g, "");
    input = input ? parseInt(input, 10) : 0;
    return (input === 0) ? "" : input.toLocaleString("en-US");
}


PopupController.prototype = {

    /**
     *
     * @private
     */
    addListeners_: function () {
        this.hourly_wages.addEventListener('input', this.handlehourly_wages_.bind(this));
        this.hourly_wages.addEventListener('change', this.handlehourly_wages_.bind(this));
        this.daily_hours.addEventListener('input', this.handledaily_hours_.bind(this));
        this.daily_hours.addEventListener('change', this.handledaily_hours_.bind(this));
        this.switch_.addEventListener('change', this.handleSwitch_.bind(this));
        this.daily_.addEventListener('change', this.handleDaily_.bind(this));
        this.hourly_wages.addEventListener('keyup', this.handlehourly_wages_digit.bind(this))
    },

    handlehourly_wages_digit: function (_el) {
        var val = _el.srcElement.value;
        _el.srcElement.value = SeparateDigit(val);
    },

    /**
     *
     * @private
     * @depercated
     * handleCallback_: function () {
        console.log('handleCallback_');
    },*/

    /**
     *
     * @private
     */
    handlehourly_wages_: function (_el) {
        chrome.storage.sync.set({hourly_wages: _el.srcElement.value.replace(/[\D\s\._\-]+/g, "")});
    },

    /**
     *
     * @private
     */
    handledaily_hours_: function (_el) {
        chrome.storage.sync.set({daily_hours: _el.srcElement.value});
    },

    /**
     *
     * @private
     */
    handleSwitch_: function () {
        chrome.storage.sync.set({is_active: this.switch_.checked ? 1 : 0});
    },

    /**
     *
     * @private
     */
    handleDaily_: function () {
        chrome.storage.sync.set({daily: this.daily_.checked ? 1 : 0})
    }
};

document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.sync.get(['hourly_wages', 'daily_hours', 'is_active', 'daily'], function (result) {
        document.getElementById('switch').checked = result.is_active !== 0;
        document.getElementById('daily').checked = result.daily !== 0;
        if (result.daily === undefined) {
            chrome.storage.sync.set({daily: true});
        }
        if (result.hourly_wages === undefined) {
            chrome.storage.sync.set({hourly_wages: 12000});
            document.getElementById('hourly_wages').value = SeparateDigit(12000);
        } else {
            document.getElementById('hourly_wages').value = SeparateDigit(result.hourly_wages);
        }

        if (result.daily_hours === undefined) {
            chrome.storage.sync.set({daily_hours: 8});
            document.getElementById('daily_hours').value = 8;
        } else {
            document.getElementById('daily_hours').value = result.daily_hours;
        }
    });
    window.PC = new PopupController();
});


chrome.tabs.query({currentWindow: true, active: true}, function (tabs) {
    var SupportedLifetimeWebsites = [
        "https://www.bamilo.com",
        "https://torob.com",
        "https://emalls.ir",
        "https://www.reyhoon.com",
        "https://www.banimode.com",
        "https://www.digikala.com",
        "https://www.digistyle.com",
        "https://www.modiseh.com",
        "https://snappfood.ir"
    ];
    var _is_supported = false;
    for(var i=SupportedLifetimeWebsites.length;i>0;i--){
        if(tabs[0].url.indexOf(SupportedLifetimeWebsites[i]) > -1){
            _is_supported = true;
            break;
        }
    }

    //Check current page is supported or no!
    if(_is_supported){
        document.querySelector(".header").classList.add("active");
        document.querySelector("._blank").classList.add("active");
        document.querySelector(".btn_supported").classList.remove("active");
        document.querySelector(".input_wrap.form").classList.remove("_blure");
    } else {
        document.querySelector(".header").classList.remove("active");
        document.querySelector("._blank").classList.remove("active");
        document.querySelector(".btn_supported").classList.add("active");
        document.querySelector(".input_wrap.form").classList.add("_blure");
    }
});
