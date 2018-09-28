/**
 * @constructor
 */
var PopupController = function () {
    this.hourly_wages = document.getElementById('hourly_wages');
    this.switch_ = document.getElementById('switch');
    this.addListeners_();
};

PopupController.prototype = {

    /**
     *
     * @private
     */
    addListeners_: function () {
        this.hourly_wages.addEventListener('change', this.handlehourly_wages_.bind(this));
        this.switch_.addEventListener('change', this.handleSwitch_.bind(this));
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
    handleSwitch_: function () {
        chrome.storage.sync.set({is_active: this.switch_.checked ? 1 : 0});
    }
};

document.addEventListener('DOMContentLoaded', function () {

    chrome.storage.sync.get(['hourly_wages', 'is_active'], function (result) {
        document.getElementById('switch').checked = result.is_active !== 0;
        if (result.hourly_wages === undefined) {
            chrome.storage.sync.set({hourly_wages: 12000});
            document.getElementById('hourly_wages').value = 12000;
        } else {
            document.getElementById('hourly_wages').value = result.hourly_wages;
        }
    });

    window.PC = new PopupController();
});
