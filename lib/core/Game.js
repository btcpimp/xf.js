'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Game = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _SceneManager = require('./managers/SceneManager');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @author - Isuru Kusumal Rajapakse (xxfast)
 * @description - Represents a single game instance
*/

var Game = exports.Game = function () {
  /*
    * creates the game instance
    *   @returns {Game} itself
  */
  function Game() {
    _classCallCheck(this, Game);

    this.managers = { scenes: new _SceneManager.SceneManager() };
    this.states = [];
    this.canvas = null;
    this.display = { options: {
        fullscreen: false,
        framerate: 60
      },
      context: null,
      container: null
    };
  }

  /*
    * builds the game instance
    *   @returns {Game} itself
  */


  _createClass(Game, [{
    key: 'build',
    value: function build() {
      var container = null,
          dpr = window.devicePixelRatio;
      this.canvas = document.createElement('canvas');
      /* if no container is specified, then the game will be attached to the root
         root document body, otherwise will be attached to the given node
      */
      if (this.display.container == null) {
        this.display.container = window;
        container = this.display.container;
        console.log("container is set to " + container);
      }

      var w = this.canvas.width = container.innerWidth;
      var h = this.canvas.height = container.innerHeight;
      var scale = Math.min(container.innerHeight / h, container.innerWidth / w);

      if (this.display.container == null) {
        if (this.display.options.fullscreen) {
          this.canvas.style.position = "absolute";
          this.canvas.style.width = w * scale + "px";
          this.canvas.style.height = h * scale + "px";
          this.canvas.style.left = window.innerWidth * 0.5 - w * scale * 0.5 + "px";
          this.canvas.style.top = window.innerHeight * 0.5 - h * scale * 0.5 + "px";
        }
        document.body.appendChild(this.canvas);
      } else {
        this.display.container.appendChild(this.canvas);
      }
      this.display.context = this.canvas.getContext("2d");
      return this;
    }

    /*
      * run the game loop
      *   @returns {Game} itself
    */

  }, {
    key: 'start',
    value: function start() {
      var callback = this;
      window.onload = function (callback) {
        setInterval(callback.update, callback.display.options.framerate);
      };
    }

    /*
      * gets the scene manager of this game
      *   @returns {SceneManager} sceneManager
    */

  }, {
    key: 'scenes',
    value: function scenes() {
      return this.managers.scenes;
    }

    /*
      * updates the current scene of this game
    */

  }, {
    key: 'update',
    value: function update() {
      this.managers.scenes.process();
      this.render();
    }

    /*
      * renders the current scene of this game
    */

  }, {
    key: 'render',
    value: function render() {
      this.managers.scenes.render(this.display.context);
    }
  }]);

  return Game;
}();