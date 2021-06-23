# appbuilder-ci

Continuous Integration workflow for [appdevdesigns/app_builder](https://github.com/appdevdesigns/app_builder)

- End to End tests using cypress

## Github Action

The github action 'ci' can be triggered with a repistory_dispatch event and expects a commit to use for building the [ab-production-image](https://github.com/appdevdesigns/ab-production-image).
After to building the image it gets deployed using [ab-production stack](https://github.com/appdevdesigns/ab-production-stack) using `docker-compose.test.yml`.
Then the Cypress End-2-End test are run.

### Usage

Recommend using [workflow-dispatcher](https://github.com/marketplace/actions/workflow-dispatcher)

```y
- name: Build and Run E2E Tests
   uses: adityakar/workflow-dispatcher
   with:
     owner: appdevdesigns
     repo: travis-appbuilder
     token: ${{ secrets.PAT }}
     event_type: ab-ci
     client_payload: '{"commit": "${{ GITHUB_SHA }}"}'
     wait_time: 20
     max_time: 1800
```

## Run Tests Locally

Assumes app_builder is running locally on 1337

```bash
git clone https://github.com/appdevdesigns/travis-appbuilder.git

cd travis-appbuilder

 # Running interactively
npm run interactive

# Running headlessly
npm run headless
```
