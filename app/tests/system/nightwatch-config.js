var path = require('path');
// Customize these for your project.
var appPath = path.join(process.cwd(), '../ios/build/Build/Products/Release-iphonesimulator/scaffold.app');
var apkPath = path.join(process.cwd(), '../android/scaffold/build/outputs/apk/scaffold-release.apk');
var reportsPath = process.env.CIRCLE_TEST_REPORTS || './tests/reports';
var screenshotsPath = process.env.CIRCLE_ARTIFACTS || './tests/screenshots';
var appPackage = 'com.mobify.astro.scaffold';

// Device desired capabilities
var iOSVersion = process.env.IOS_VERSION || '9.2';
var iOSDeviceName = process.env.IOS_DEVICE_NAME || 'iPhone 6';
var androidDeviceName = 'DEVICE_NAME';

module.exports = {
    'src_folders': ['./tests/system'],
    'output_folder': reportsPath,
    'custom_commands_path': './node_modules/nightwatch-commands/commands',
    'custom_assertions_path': './node_modules/nightwatch-commands/assertions',

    'selenium': {
        'start_process': true,
        'server_path': './node_modules/nightwatch-commands/selenium/selenium-server.jar',
        'log_path': './node_modules/nightwatch-commands/selenium/',
        'host': '127.0.0.1',
        'port': 4444,
        'cli_args': {
            'webdriver.chrome.driver': './node_modules/nightwatch-commands/selenium/drivers/chromedriver'
        }
    },

    'test_settings': {
        'default': {
            'globals' : {
                'waitForConditionTimeout' : 60000,
                'waitForConditionPollInterval': 500
            },
            'end_session_on_fail': false,
            'launch_url': 'http://localhost:4723/wd/hub',
            'selenium_host': 'localhost',
            'selenium_port': 4723,
            'silent': true,
            'output': true,
            'screenshots': {
                'enabled': true,
                'path': screenshotsPath,
                'on_failure': true
            },
            'desiredCapabilities': {
                'app': appPath,
                'platformName': 'iOS',
                'platformVersion': iOSVersion,
                'deviceName': iOSDeviceName
            },
            'exclude': ['nightwatch-config.js', 'setup', 'pageObjects', 'assertions']
        },

        'android': {
            'desiredCapabilities': {
                'app': apkPath,
                'platformName': 'Android',
                'platformVersion': '',
                'deviceName': androidDeviceName,
                'appPackage': appPackage,
                'browserName': '',
                'recreateChromeDriverSessions': true
            }
        },

    }
};
