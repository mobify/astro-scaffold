import Promise from 'bluebird';
import Astro from 'astro/astro-full';
import BackboneEvents from 'vendor/backbone-events';
import DoubleIconsPlugin from '../app-plugins/doubleIconsPlugin';

var DoubleIconsController = function(headerId, generateLeftIcon, generateRightIcon) {
    this.headerId = headerId;
    this.generateLeftIcon = generateLeftIcon;
    this.generateRightIcon = generateRightIcon;
};

var _setLeftIcon = function(doubleIcons, address) {
    doubleIcons.setLeftIcon(address);
};

var _setRightIcon = function(doubleIcons, address) {
    doubleIcons.setRightIcon(address);
};

DoubleIconsController.prototype._createDoubleIcons = function(doubleIcons) {
    // The double icons controller is responsible for managing
    // many instances of the left and right icons. To ensure that all
    // instances of the icons stay in sync each instance of the icon
    // registers for an event which gets triggered when the function for
    // generating new plugins for that icon changes
    // (ie. icon is being changed to display a different image)
    this.on('updateLeftIcon', function(param) {
        _setLeftIcon(doubleIcons, param.generateLeftIcon());
    });

    this.on('updateRightIcon', function(param) {
        _setRightIcon(doubleIcons, param.generateRightIcon());
    });

    return Promise.join(this.generateLeftIcon(),
                        this.generateRightIcon(),
        function(leftIcon, rightIcon) {
            _setLeftIcon(doubleIcons, leftIcon);
            _setRightIcon(doubleIcons, rightIcon);
        });
};

DoubleIconsController.prototype._createDoubleIconHeaderContent = function(doubleIcons) {
    return {
        id: this.headerId,
        pluginAddress: doubleIcons.toMethodArg()
    };
};

DoubleIconsController.prototype.generateContent = function() {
    var self = this;

    return DoubleIconsPlugin.init().then(
        function(doubleIcons) {
            doubleIcons.on('click:doubleIcons_left', function(param) {
                self.trigger('click:doubleIcons_left', param);
            });

            doubleIcons.on('click:doubleIcons_right', function(param) {
                self.trigger('click:doubleIcons_right', param);
            });

            return self._createDoubleIcons(doubleIcons).then(function() {
                return self._createDoubleIconHeaderContent(doubleIcons);
            });
        }
   );
};

DoubleIconsController.prototype.updateGenerateLeftIcon = function(generateLeftIcon) {
    this.generateLeftIcon = generateLeftIcon;

    this.trigger('updateLeftIcon', {generateLeftIcon: this.generateLeftIcon});
};

DoubleIconsController.prototype.updateGenerateRightIcon = function(generateRightIcon) {
    this.generateRightIcon = generateRightIcon;

    this.trigger('updateRightIcon', {generateRightIcon: this.generateRightIcon});
};

DoubleIconsController.init = function(headerId, generateLeftIcon, generateRightIcon) {
    var doubleIconsController = new DoubleIconsController(headerId, generateLeftIcon, generateRightIcon);
    doubleIconsController = Astro.Utils.extend(doubleIconsController, BackboneEvents);

    return Promise.resolve(doubleIconsController);
};

module.exports = DoubleIconsController;
