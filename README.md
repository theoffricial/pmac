<p align="center">
  <a href="https://github.com/postman-as-code/pmac/" target="blank"><img src="./images/pmac-logo.svg" width="120" alt="pmac Logo" /></a>
</p>
<p align="center">A CLI tool to manage <a href="https://www.postman.com/" target="_blank">Postman</a> as code, together with <a href="https://www.openapis.org/">OpenAPI</a> for building well defined APIs that easy to well-specify, validate, and verify with API tests from your repository for scalable applications.</p>

 <p align="center">
  <a href="https://github.com/postman-as-code/pmac" target="_blank">
    <img src="https://img.shields.io/github/last-commit/postman-as-code/pmac" alt="Last Commit" />
  </a>
  <a href="https://npmjs.org/package/pmac" target="_blank">
    <img src="https://img.shields.io/npm/v/pmac.svg" alt="NPM Version" />
  </a>
  <a href="https://app.circleci.com/pipelines/github/postman-as-code/pmac?branch=main" target="_blank">
    <img src="https://img.shields.io/circleci/build/github/postman-as-code/pmac/main" alt="CircleCI" />
  </a>
  <a href="https://npmjs.org/package/pmac" target="_blank">
    <img src="https://img.shields.io/npm/dm/pmac.svg" alt="Downloads/Month" />
  </a>
  <a href="https://github.com/postman-as-code/pmac/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/npm/l/pmac.svg" alt="License" />
  </a>
  <a href="https://codecov.io/gh/postman-as-code/pmac">
    <img src="https://codecov.io/gh/postman-as-code/pmac/branch/main/graph/badge.svg?token=VQATYZJCCN" alt="CodeCov"/>
  </a>
  <a href="https://github.com/postman-as-code/pmac">
    <img src="https://img.shields.io/github/stars/postman-as-code/pmac?color=%23d3ab18&label=github%20stars" alt="GitHub Stars">
  </a>
  <br/>
  <a href="https://github.com/postman-as-code/pmac" target="_blank">
    <img src="https://forthebadge.com/images/badges/built-with-love.svg" alt="BuiltWithLove" />
  </a>
  <a href="https://blog.postman.com/making-the-postman-logo/" target="_blank">
    <img src="./images/inspired-by-postman.svg" alt="InspiredByPostman" />
  </a>
 </p>

## Disclosure 🙏

I just published this package, So I'm consistently working to improve it.
So if you have any suggestions or had a bad experience, I would be happy to hear - you can contact by using the [Discord](https://discord.gg/tPD99Z3A) channel, or contact with me via [LinkedIn](https://www.linkedin.com/in/itsofriperetz/).

### Roadmap 🗺 🧭

Transparency is an important key, especially for open sources, to help with your decision making wether to use a lib or not.
For this reason, I'm working on building a public [roadmap](https://github.com/orgs/postman-as-code/projects/1) for `pmac`.

## Description

pmac stands for "Postman as code", it is a CLI tool and a framework for building efficient and scalable APIs, by specifying your API following the OpenAPI standard that is giving you a set of tools out-of-the-box by itself, including validation based on the specification. Then, after having your specification pmac auto-generated your specification to postman collection, and manages the collection and other Postman entities as code in your repository while helping you to push changes from repository to Postman account, pull changes into the repository, and gives you the ability to manage Postman's entities automatically. pmac uses modern Javascript, is build with TypeScript, and centralize UX for easy and convenient usage.

## Philosophy 🧐

pmac built with the recognition of the advantage of using standards and widely known existing products to fit for many different use-cases scenarios, and also to be easy to migrate to.

In other words, not aiming for inventing the wheel, but for connecting the dots.

In today's competitive world, the number of requests grows exponentially, clients have a very high standard for digital products even unconsciously, and resources are expensive, APIs should be built with strong fundamentals for standing the demand for scaling up.

Having this understanding in mind, pmac aims to be the "glue" of 3 domains any API required to manage - Specification, Validation, Verification.

* Specification with OpenAPI (v3)
* Validation by using the specification
* Verification by auto-generating & managing API tests with postman as code in your repository

## Change log 🐾

View the [changelog](./CHANGELOG.md).

## Features 🦚

* Integrated with [Postman API](https://www.postman.com/), using an API key, you pass to pmac
* Priortizing user experience using
  * Supports auto-completion and help guides by using [oclif](https://github.com/oclif/oclif) CLI framework
  * Enables user inputs using [inquirer](https://github.com/SBoudrias/Inquirer.js/)
  * Indication of the step in a process using [listr2](https://github.com/cenk1cenk2/listr2)
* Postman Collections supported commands
  * Pull - into repository from your PM account
  * Push - into PM account from repository
  * Create and Update automatically from your OpenAPI spec yml
  * Delete - both local (repo), and remote (PM account)
  * Execute - run Postman collection fully integrated with [newman](https://github.com/postmanlabs/newman)
    * support all its feature, including [cli](https://github.com/postmanlabs/newman#cli-reporter), [html](https://github.com/postmanlabs/newman#html-reporter),[htmlextra](https://github.com/DannyDainton/newman-reporter-htmlextra),[json](https://github.com/postmanlabs/newman#html-reporter),[junit](https://github.com/postmanlabs/newman#html-reporter) reporters
* Postman Environments Commands
  * Create, Delete, Pull, and Push
* Postman Workspaces
  * Create - Create new workspace and push into PM account
  * Pull - Pulls a workspace into your repo
  * Delete
  * Fetch - fetch changes from the existing workspaces in repo
  * Pull all - pulls the whole postman account
* With Collection.Execute it is possible to run pmac in CI/CD pipelines
* Auto-generated Postman collections out from OpenAPI specification - Works with [openapi-to-postmanv2](https://github.com/postmanlabs/openapi-to-postman) under-the-hood
* By managing Postman entities you get all Postman features out-of-the-box, convenient UI, tests, pre-request-scripts, EVERYTHING.

## Getting Started

1. Installation, use `npm` or `yarn`

```
npm i -g pmac // or yarn global add pmac
```
1. Generate a Postman api key
    1. To create `pull` and `push` actions

1. Commands guide
    1. use `pmac help` and `pmac <command> --help` to see a guide for all commands.
    1. Also, you can use the generated commands docs [here](./docs/)

1. Write your API openapi specification
    1. Learn more about openapi with the official docs
    2. Use the Swagger Editor

1. How `pmac` manages its workpsaces
    1. By decoupling `pmac` workspaces from `pm` workspace, which means they are different things!
    1. Although the workspace resources, like `collection`, `environment`, etc., are currently similar.

1. See the [`pmac` file tree](https://tree.nathanfriend.io/?s=(%27optiMs!(%27fancyL~fullPath!false~trailingSlashL~rootDotL)~N(%27N%27.J97sQpersMalR3WA68V4A485*KQteamR3WA68V4A485__GQ__GFuser%22HG%20data%20%7Be.g.%20aHapi-key%7D%27)~versiM!%271%27)*%20%200Q**2-name_((JID))%5D3J-7F7%20includeHJ%20map4envirMment5mMitorE0mockE96collectiM7workspace8U0K09%5Cn*A2.postman_C*%5BEH%7BTBD..%7DFU%20%23%20GprivateHs%20JpmacK*...L!trueMonNsource!Os0CQ9*RQC720U.jsMVK04OW06O6%01WVURQONMLKJHGFECA987654320*) to understand better how `pmac` works! 

1. Use `pmac` official docs (very soon...)

## License

pmac is [MIT licensed](./LICENSE)
