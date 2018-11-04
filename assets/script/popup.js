/* eslint-disable no-useless-escape */
/* global browser, chrome */
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

function sepereteDigit (_number) {
  var input = _number.toString().replace(/[\D\s\._\-]+/g, '');
  input = input ? parseInt(input, 10) : 0;
  return input === 0 ? '' : input.toLocaleString('en-US');
} // @function: sepereteDigit()

PopupController.prototype = {
  /**
   *
   * @private
   */
  addListeners_: function () {
    this.hourly_wages.addEventListener(
      'change',
      this.handlehourly_wages_.bind(this)
    );
    this.daily_hours.addEventListener(
      'change',
      this.handledaily_hours_.bind(this)
    );
    this.switch_.addEventListener('change', this.handleSwitch_.bind(this));
    this.daily_.addEventListener('change', this.handleDaily_.bind(this));
    this.hourly_wages.addEventListener(
      'keyup',
      this.handlehourly_wages_digit.bind(this)
    );
  },

  handlehourly_wages_digit: function (_el) {
    var val = _el.srcElement.value;
    _el.srcElement.value = sepereteDigit(val);
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
  handlehourly_wages_: function (_el) {
    browser.storage.sync.set({
      hourly_wages: _el.srcElement.value.replace(/[\D\s\._\-]+/g, '')
    });
  },

  /**
   *
   * @private
   */
  handledaily_hours_: function (_el) {
    browser.storage.sync.set({ daily_hours: _el.srcElement.value });
  },

  /**
   *
   * @private
   */
  handleSwitch_: function () {
    browser.storage.sync.set({ is_active: this.switch_.checked ? 1 : 0 });
  },

  /**
   *
   * @private
   */
  handleDaily_: function () {
    browser.storage.sync.set({ daily: this.daily_.checked ? 1 : 0 });
  }
};

document.addEventListener('DOMContentLoaded', function () {
  browser.storage.sync
    .get(['hourly_wages', 'daily_hours', 'is_active', 'daily'])
    .then(function (result) {
      document.getElementById('switch').checked = result.is_active !== 0;
      document.getElementById('daily').checked = result.daily !== 0;

      if (result.daily === undefined) {
        browser.storage.sync.set({ daily: true });
      }
      if (result.hourly_wages === undefined) {
        browser.storage.sync.set({ hourly_wages: 12000 });
        document.getElementById('hourly_wages').value = sepereteDigit(12000);
      } else {
        document.getElementById('hourly_wages').value = sepereteDigit(
          result.hourly_wages
        );
      }

      if (result.daily_hours === undefined) {
        browser.storage.sync.set({ daily_hours: 8 });
        document.getElementById('daily_hours').value = 8;
      } else {
        document.getElementById('daily_hours').value = result.daily_hours;
      }
    });

  window.PC = new PopupController();
});

// MDN: This API is based on Chromium's chrome.tabs API. so in firefox and chrome work.
chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
  if (
    tabs[0].url.indexOf('https://www.digikala.com/') > -1 ||
    tabs[0].url.indexOf('https://www.bamilo.com/') > -1 ||
    tabs[0].url.indexOf('https://www.reyhoon.com/') > -1 ||
    tabs[0].url.indexOf('https://emalls.ir/') > -1 ||
    tabs[0].url.indexOf('https://torob.com/') > -1 ||
    tabs[0].url.indexOf('https://snappfood.ir/') > -1
  ) {
    document.querySelector('.header').classList.add('active');
    document.querySelector('._blank').classList.add('active');
    document.querySelector('.input_wrap.form').classList.remove('_blure');
  } else {
    document.querySelector('.header').classList.remove('active');
    document.querySelector('._blank').classList.remove('active');
    document.querySelector('.input_wrap.form').classList.add('_blure');
  }
});
