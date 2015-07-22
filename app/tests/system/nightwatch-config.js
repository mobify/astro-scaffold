var path = require('path');
var appPath = path.join(process.cwd(), '../ios/build/Build/Products/Debug-iphonesimulator/scaffold.app');

module.exports = {
    "src_folders": ["./tests/system"],
    "output_folder": "./reports",
    "custom_commands_path": "./node_modules/nightwatch-commands/commands",
    "custom_assertions_path": "./node_modules/nightwatch-commands/assertions",

    "selenium": {
        "start_process": true,
        "server_path": "./node_modules/nightwatch-commands/selenium/selenium-server.jar",
        "log_path": "./node_modules/nightwatch-commands/selenium/",
        "host": "127.0.0.1",
        "port": 4444,
        "cli_args": {
            "webdriver.chrome.driver": "./node_modules/nightwatch-commands/selenium/drivers/chromedriver"
        }
    },

    "test_settings": {
        "default": {
            "globals" : {
                "waitForConditionTimeout" : 60000
            },
            "launch_url": "http://localhost:4723/wd/hub",
            "selenium_host": "localhost",
            "selenium_port": 4723,
            "silent": true,
            "output": true,
            "screenshots": {
                "enabled": false,
                "path": ""
            },
            "desiredCapabilities": {
                "fullReset": false,
                "app": appPath,
                "platformName": "iOS",
                "platformVersion": "8.4",
                "deviceName": "iPhone 6"
            }
        },

        "ios-sim": {
            "desiredCapabilities": {
                "fullReset": false,
                "app": appPath,
                "platformName": "iOS",
                "platformVersion": "8.4",
                "deviceName": "iPhone 6"
            }
        }
    }
};
