# e2e-tests

## Setup

To install required packages, run

```bash
npm install
```

Then install the necessary browsers for Playwright

```bash
npx playwright install
```

## Running tests

To run the tests, run

```bash
npx playwright test
```

By default tests will be run on all 3 browsers, chromium, firefox and webkit using 3 workers. Tests run in *headless* mode by default, meaning no browser is opened. To run tests in *headed* mode, use the `--headed` flag. This will open browser so you can see what tests are doing. Documentation says you can also run in UI mode which has "time travel debugging"
```bash
npx playwright test --ui
```
## Test results
After tests are run, a report will be generated. Here you can view what passed and what failed (and why).
