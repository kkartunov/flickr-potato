casper.test.begin('Flickr Potato App tests', function (test) {
    casper.start('http://localhost:8000', function () {

        test.assertHttpStatus(200, 'Webserver is up, running and responds');
        test.assertTitle('Flickr - potato');
        test.assertExists('.page-header h1  small', 'Prints version in title');
        test.assertEvalEquals(function () {
            return __utils__.findOne('.page-header h1  small').textContent;
        }, '0.1.0', 'Sets the correct version # in title');

        casper.waitForSelector('.feed-item', function () {

            test.pass('E2E Tests wait for Angular and feed results');
            test.assertEvalEquals(function () {
                return __utils__.findOne('.breadcrumb .badge').textContent;
            }, '20', 'Results List has length index 20 in breadcrumb');
            test.assertExists('a.thumbnail[ui-sref]', 'Feed items should have clickable thumbnails');
            test.assertExists('.feed-item .panel-body h3 a[ui-sref]', 'Feed items should have clickable titles');

            casper.click('a.thumbnail[ui-sref]');

            casper.waitForSelector('.detail-view', function () {
                test.pass('When a thumbnail was clicked I should be able to see the feed item\'s detail view');
                test.assertExists('.the_tags', '...which has a tag cloud area');
                test.assertEvalEquals(function () {
                    return __utils__.findOne('.panel-heading a[ui-sref]').textContent;
                }, 'Back', '...and `Back` button in the heading');

                casper.click('.panel-heading a[ui-sref]');

                casper.waitForSelector('.feed-item', function () {
                    test.pass('...which if clicked should return me to the feed');
                });
            });
        });
    });

    casper.run(function () {
        test.done();
    });
});
