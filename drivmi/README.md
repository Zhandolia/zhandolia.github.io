# DrivMi browser presentation

Live demo: https://zhandolia.github.io/drivmi/

A standalone, newly written browser adaptation of the DrivMi mobile concept. Only the project logo is reused. The original application's source and service configuration remain in its private repository.

## Presenting

1. Choose one of three sample routes in Rider view; request a sample ride.
2. Choose a sample driver, or switch to Driver view and accept the sample request.
3. Simulate arrival at pickup. Rider view shows code **4821**.
4. In Driver view, confirm that code and start the trip. An incorrect code is rejected.
5. Simulate arrival home. Switch to Rider view to submit a sample rating.
6. Reset to start over. Requests can also be cancelled before the trip starts.

People, places, fares, ratings, and times are fictional presentation data. The schematic map is an original illustration, not geographic navigation. No account, location permission, API key, payment, database, analytics, or external runtime is used. There are no network requests beyond the site's own static assets. Demo progress lasts only for the current page session.

## Hosting

Plain HTML, CSS, JavaScript modules, and SVG. GitHub Pages publishes this directory with the portfolio. All application links and assets are relative. Serve the portfolio repository root with any static HTTP server for local previews. Do not open the HTML directly using `file://`, because browsers restrict JavaScript modules there.

The original mobile prototype uses Expo / React Native, Firebase, and Google Maps. This demo is not a deployment of its backend and does not provide transportation or real driver verification.
