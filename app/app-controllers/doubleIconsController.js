import Promise from 'bluebird';
import Astro from 'astro/astro-full';
import BackboneEvents from 'vendor/backbone-events';
import DoubleIconsPlugin from '../app-plugins/doubleIconsPlugin';

const DoubleIconsController = function(headerId, generateLeftIcon, generateRightIcon) {
    this.headerId = headerId;
    this.generateLeftIcon = generateLeftIcon;
    this.generateRightIcon = generateRightIcon;
};

const _setLeftIcon = function(doubleIcons, address) {
    doubleIcons.setLeftIcon(address);
};

const _setRightIcon = function(doubleIcons, address) {
    doubleIcons.setRightIcon(address);
};

DoubleIconsController.prototype._createDoubleIcons = async function(doubleIcons) {
    // The double icons controller is responsible for managing
    // many instances of the left and right icons. To ensure that all
    // instances of the icons stay in sync each instance of the icon
    // registers for an event which gets triggered when the function for
    // generating new plugins for that icon changes
    // (ie. icon is being changed to display a different image)
    this.on('updateLeftIcon', (param) => _setLeftIcon(doubleIcons, param.generateLeftIcon()));
    this.on('updateRightIcon', (param) => _setRightIcon(doubleIcons, param.generateRightIcon()));

    const [
        leftIcon,
        rightIcon
    ] = await Promise.all([
        this.generateLeftIcon(),
        this.generateRightIcon()
    ]);

    _setLeftIcon(doubleIcons, leftIcon);
    _setRightIcon(doubleIcons, rightIcon);
};

DoubleIconsController.prototype._createDoubleIconHeaderContent = function(doubleIcons) {
    return {
        id: this.headerId,
        pluginAddress: doubleIcons.toMethodArg()
    };
};

DoubleIconsController.prototype.generateContent = async function() {
    const doubleIcons = await DoubleIconsPlugin.init();

    doubleIcons.on('click:doubleIcons_left', (param) => this.trigger('click:doubleIcons_left', param));
    doubleIcons.on('click:doubleIcons_right', (param) => this.trigger('click:doubleIcons_right', param));
    return this._createDoubleIcons(doubleIcons).then(() => this._createDoubleIconHeaderContent(doubleIcons));
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
    let doubleIconsController = new DoubleIconsController(headerId, generateLeftIcon, generateRightIcon);
    doubleIconsController = Astro.Utils.extend(doubleIconsController, BackboneEvents);

    return Promise.resolve(doubleIconsController);
};

export default DoubleIconsController;
