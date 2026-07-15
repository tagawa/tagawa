const PAGE_NAME = 'window-position-properties';

const startButton = document.querySelector('#start');
const downloadButton = document.querySelector('#download');

const testsDiv = document.querySelector('#tests');
const testsSummaryDiv = document.querySelector('#tests-summary');
const testsDetailsDiv = document.querySelector('#tests-details');

// One entry per property. run() returns the current value; re-running after
// scrolling/moving/resizing recaptures that state.
const tests = [
    // Window position on screen
    { id: 'window.screenX', run: () => window.screenX },
    { id: 'window.screenY', run: () => window.screenY },
    { id: 'window.screenLeft', run: () => window.screenLeft },
    { id: 'window.screenTop', run: () => window.screenTop },

    // Viewport size
    { id: 'window.innerWidth', run: () => window.innerWidth },
    { id: 'window.innerHeight', run: () => window.innerHeight },
    { id: 'window.outerWidth', run: () => window.outerWidth },
    { id: 'window.outerHeight', run: () => window.outerHeight },
    { id: 'documentElement.clientWidth', run: () => document.documentElement.clientWidth },
    { id: 'documentElement.clientHeight', run: () => document.documentElement.clientHeight },

    // Scroll position
    { id: 'window.scrollX', run: () => window.scrollX },
    { id: 'window.scrollY', run: () => window.scrollY },
    { id: 'window.pageXOffset', run: () => window.pageXOffset },
    { id: 'window.pageYOffset', run: () => window.pageYOffset },
    { id: 'documentElement.scrollTop', run: () => document.documentElement.scrollTop },
    { id: 'body.scrollTop', run: () => document.body.scrollTop },

    // Screen
    { id: 'screen.width', run: () => screen.width },
    { id: 'screen.height', run: () => screen.height },
    { id: 'screen.availWidth', run: () => screen.availWidth },
    { id: 'screen.availHeight', run: () => screen.availHeight },
    { id: 'screen.colorDepth', run: () => screen.colorDepth },
    { id: 'screen.orientation.type', run: () => (screen.orientation ? screen.orientation.type : 'n/a') },

    // Pixel ratio
    { id: 'window.devicePixelRatio', run: () => window.devicePixelRatio }
];

// Results object, downloaded as JSON for cross-browser comparison.
const results = {
    page: `${PAGE_NAME}-test`,
    date: null,
    results: []
};

function runTests () {
    downloadButton.removeAttribute('disabled');
    testsDiv.removeAttribute('hidden');

    results.results.length = 0;
    results.date = (new Date()).toUTCString();
    testsDetailsDiv.innerHTML = '';

    for (const test of tests) {
        // A property that throws (e.g. missing in this browser) is itself a
        // finding, so record the error as the value instead of stopping.
        let value;
        try {
            value = test.run();
        } catch (e) {
            value = `error: ${e.message ? e.message : e}`;
        }
        if (value === undefined) value = null; // keep the key in the JSON

        results.results.push({ id: test.id, value });

        const li = document.createElement('li');
        li.id = `test-${test.id}`;
        li.innerHTML = `${test.id} - <span class='value'>${value}</span>`;
        testsDetailsDiv.appendChild(li);
    }

    testsSummaryDiv.innerText = `Captured ${tests.length} properties.`;
}

function downloadTheResults () {
    const data = JSON.stringify(results, null, 2);
    const a = document.createElement('a');
    const url = window.URL.createObjectURL(new Blob([data], { type: 'application/json' }));
    a.href = url;
    a.download = `${PAGE_NAME}-results.json`;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
    a.remove();
}

downloadButton.addEventListener('click', downloadTheResults);
startButton.addEventListener('click', runTests);

// Run once on load so values are visible immediately; the button re-runs to
// recapture after scrolling/moving/resizing. (A harness appending ?run still
// gets a run, since the page always runs on load.)
runTests();
