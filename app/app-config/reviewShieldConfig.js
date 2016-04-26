define(['config/baseConfig'], function(BaseConfig) {
/* eslint-enable max-statements */

    // App Id
    var appId = BaseConfig.appId;

    // Number of points gained until eligible for
    // displaying Review Shield
    var threshold = 200;

    // The maximum number of feedback a user can give
    var feedbackLimit = 5;

    // The minimum number of days between showings of reviewShield
    var daysUntilShownAgain = 30;

    var negativeOptions = [
        'Bad 1',
        'Bad 2',
        'Bad 3',
        'Bad 4'
    ];

    var positiveOptions = [
        'Good 1',
        'Good 2',
        'Good 3',
        'Good 4'
    ];

    return {
        appId: appId,
        threshold: threshold,
        feedbackLimit: feedbackLimit,
        daysUntilShownAgain: daysUntilShownAgain,
        negativeOptions: negativeOptions,
        positiveOptions: positiveOptions
    };
});
