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

PopupController.prototype = {

    /**
     *
     * @private
     */
    addListeners_: function () {
        this.hourly_wages.addEventListener('change', this.handlehourly_wages_.bind(this));
        this.daily_hours.addEventListener('change', this.handledaily_hours_.bind(this));
        this.switch_.addEventListener('change', this.handleSwitch_.bind(this));
        this.daily_.addEventListener('change', this.handleDaily_.bind(this));
    },


    /**
     *
     * @private
     */
    handleCallback_: function () {
        console.log('handleCallback_');
    },

    /**
     *
     * @private
     */
    handlehourly_wages_: function () {
        chrome.storage.sync.set({hourly_wages: document.getElementById('hourly_wages').value});
    },

    /**
     *
     * @private
     */
    handledaily_hours_: function () {
        chrome.storage.sync.set({daily_hours: document.getElementById('daily_hours').value});
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

        if (result.hourly_wages === undefined) {
            chrome.storage.sync.set({hourly_wages: 12000});
            document.getElementById('hourly_wages').value = 12000; 
        } else {
            document.getElementById('hourly_wages').value = result.hourly_wages; 
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
