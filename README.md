# Lunchbox-Web-Catering-Theme-1

## Overview

The React application for the catering platform. This is separate from the ordering platform because catering has separate requirements. (Not every restaurant offers catering.)

## Installation

Requirements:

- **Node v14**. We recommend installing [nvm](https://github.com/nvm-sh/nvm).
- **NPM access**. Talk to your manager if you haven't been added to our organization. After getting access, run `npm login`.

To install dependencies, run `npm install`.

### Environment Variables

Get environment variables from any teammate.

## Scripts

### `npm install`

Will install the latest dependencies.

### `npm run start <client> <environment>`

`<client>` will be the slug of the client.

`<environment>` can be one of:

- `local`: Will open the application on localhost with hot-reloading
- `development`: Will build and deploy the application to `<client>.catering.lunchbox.dev`
- `stage`: Will build and deploy the application to `<client>.catering.lunchbox.pub`
- `test`: Will build and deploy the application to `<client>catering.lunchbox.rip`
- `qualityAssurance`: Will build and deploy the application to `<client>.catering.lunchbox.wtf`
- `production`: Will build and deploy the application to production. **Take the appropriate caution when doing this.**

When you visit any environment _except_ for production, you'll see the most-recently deployed branch in the bottom-right of the screen.

<img width="230" alt="Screen Shot 2021-06-25 at 2 12 13 PM" src="https://user-images.githubusercontent.com/3719099/123468145-5cf59400-d5bf-11eb-90ec-5e2d9bbcfdac.png">

### `npm run lint`/`npm run fix`

`lint` will run eslint against the project. `fix` will automatically clean up any errors that can be fixed automatically. (At the moment, the project includes quite a few lint errors.)

## Branching

- **Hotfixes** should be branched from and opened against `master`.
- **All other branches** should be branched from and opened against `develop`.

## Processes

### Pull Requests

This project supports different PR templates depending on the type of change. When opening a PR, please add one of the following to the end of the URL:

- `?template=feature.md`: Branches submitted against `develop`
- `?template=hotfix.md`: Bugfixes submitted against `master`
- `?template=release.md`: Release branches
- `?template=releasefix.md`: Bugfixes submitted against a release branch

### CI overview

This project has no CI pipeline at the moment.

### Branch protections

This project isn't configured with branch protections at the moment.

### Releases

Releases are done manually with the `npm run start` script described above. Releases to production should be handled by experienced team members; if you're unsure what you're doing, please ask for help.

Before releasing, **make sure** that you've installed the latest dependencies with `npm install` and you have your environment variables set to the correct values.

To run a release, run `npm run build <client> <environment>`.
