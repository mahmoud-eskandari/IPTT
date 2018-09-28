/**
 * @constructor
 */
var PopupController = function () {
    this.button_ = document.getElementById('button');
  this.addListeners_();
};

PopupController.prototype = {

  /**
   *
   * @private
   */
  addListeners_: function () {
      console.log('addListeners_48');
    this.button_.addEventListener('click', this.handleClick_.bind(this));
  },


  /**
   * Handle a success/failure callback from the `browsingData` API methods,
   * updating the UI appropriately.
   *
   * @private
   */
  handleCallback_: function () {
      console.log('handleCallback_');
  },

  /**
   * When a user clicks the button, this method is called: it reads the current
   * state of `timeframe_` in order to pull a timeframe, then calls the clearing
   * method with appropriate arguments.
   *
   * @private
   */
  handleClick_: function () {
      chrome.storage.sync.set({hourly_wages: document.getElementById('hourly_wages').value}, function() {
          console.log('Value is set!');
      });
  }
};

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOMContentLoaded');
    chrome.storage.sync.get(['hourly_wages'], function(result) {
      if(typeof  result.hourly_wages === undefined){
          chrome.storage.sync.set({hourly_wages: 12000});
          document.getElementById('hourly_wages').value = 12000;
      }else{
          console.log('Value currently is ' + result.hourly_wages);
          document.getElementById('hourly_wages').value = result.hourly_wages;
      }
    });

    window.PC = new PopupController();
});
