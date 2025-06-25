We're creating a new launcher (like Spotlight on MacOS, Raycast, Rofi, etc.). This will be a multiplatform launcher that works on Windows, MacOS, and Linux. It will be based on Tauri, Typescript, and Rust. The goal is to create a performant, batteries included, customizable and extensible open source launcher, with a viable business model. If it succeeds, I hope for it to be the gold standard for launchers, possibly beating all the stuff that's on Linux (even for ricers who mostly use Rofi).

First, we want to create a dancing skeleton of the app, which will be a basic Tauri app with all the necessary components required to build it, run it, contribute to it, and test it. This will include:
The goal for now:

- Initialize a basic Tauri app with Typescript and Rust
- Allow it to be opened with a global shortcut. We will need to figure out if this should be achieved by setting up a lightweight server that keeps the app running in the background at all times, or if we can use a different approach.
- It needs to open within 50-100ms to be usable.
- The launcher needs to run at a minimum of 60fps.
- Set up Github Action pipelines for CI/CD on all platforms.
  - Create a pipeline that will run tests and build
  - Create a pipeline that will collect code coverage
  - Create a pipeline that will create a release on Github on tag
  - Create a debug pipeline that can create a debug build for testing at any time
- Initialize pull request and issue templates
- Set up a basic README with instructions on how to run the app, and contribute to it

Create an implementation plan for all this in the `docs` folder which will let you satisfy the requirements. DO NOT ADD ANY ADDITIONAL REQUIREMENTS, unless they are sub-requirements of the above. THIS IS VERY IMPORTANT. NO EXTRA FEATURES.

Use Markdown for all documentation. Create a single document with an implementation plan, and then STOP.
