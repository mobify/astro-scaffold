var path = require('path');
var appPath = path.join(process.cwd(), '../ios/build/Build/Products/Debug-iphonesimulator/scaffold.app');
var apkPath = path.join(process.cwd(), '../android/scaffold/build/outputs/apk/scaffold-debug.apk');

module.exports = {
    'src_folders': ['./tests/system'],
    'output_folder': '${CIRCLE_TEST_REPORTS}',
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
                'path': '${CIRCLE_ARTIFACTS}',
                'on_failure': true
            },
            'desiredCapabilities': {
                'app': appPath,
                'platformName': 'iOS',
                'platformVersion': '9.2',
                'deviceName': 'iPhone 6'
            },
            'exclude': ['nightwatch-config.js', 'pageObjects', 'assertions']
        },

        'android': {
            'desiredCapabilities': {
                'app': apkPath,
                'platformName': 'Android',
                'platformVersion': '',
                'deviceName': 'DEVICE NAME',
                'appPackage': 'com.mobify.astro.scaffold',
                'browserName': '',
                'recreateChromeDriverSessions': true
            }
        },

    }
};
