import * as functions from 'firebase-functions';
import * as cors from 'cors';

export const configuration = functions.https.onRequest((req, res) => {
    if (req.method === 'PUT') {
        res.status(403).send('Forbidden!');
        return;
    }

    // res.set('Access-Control-Allow-Origin', '*');
    // OR

    cors({ origin: true })(req, res, () => {
        res.status(200).json({
            key1: 'value1',
            key2: true,
            key3: 100,
            key4: ['a', 'b'],
            app: {
                name: 'ng-config-demo',
                lang: 'en',
                logEnabled: true,
                logLevel: 4,
                num: new Date().getMinutes(),
                arr: ['hello', 'world'],
                child: {
                    key1: 'a',
                    key2: false
                }
            }
        });
    });
});
