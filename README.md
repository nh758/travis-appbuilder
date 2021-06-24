# appbuilder-ci

Continuous Integration workflow for [appdevdesigns/app_builder](https://github.com/appdevdesigns/app_builder)

- End to End tests using cypress

## Github Action

The github action 'CI' can be triggered with a workflow_dispatch event and expects a commit to use for building the [ab-production-image](https://github.com/appdevdesigns/ab-production-image).
After to building the image it gets deployed using [ab-production stack](https://github.com/appdevdesigns/ab-production-stack) using `docker-compose.test.yml`.
Then the Cypress End-2-End test are run.

### Usage

[Run the action](https://docs.github.com/en/actions/managing-workflow-runs/manually-running-a-workflow) from GitHub

Trigger from another workflow using [aurelien-baudet/workflow-dispatch@v2](https://github.com/marketplace/actions/workflow-dispatch-and-wait) or similiar.

```yml
- name: run ci
    id: test
    uses: aurelien-baudet/workflow-dispatch@v2
    with:
      workflow: CI
      token: ${{ secrets.PAT }}
      repo: appdevdesigns/travis-appbuilder
      inputs: '{"commit": "${{ GITHUB_SHA }}"}'
      wait-for-completion: true
      wait-for-completion-timeout: 30m
  - name: result
    run: echo "Result - ${{ steps.test.outputs.workflow-conclusion }}"
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
