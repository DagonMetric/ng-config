import * as functions from 'firebase-functions';

export const configuration = functions.https.onRequest((_, response) => {
    response.json({
        key1: 'value1',
        key2: true,
        key3: 100,
        key4: ['a', 'b'],
        app: {
            name: 'ng-config-demo',
            lang: 'en',
            logEnabled: true,
            logLevel: 4
        }
    });
});
