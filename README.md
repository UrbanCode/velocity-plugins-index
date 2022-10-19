# velocity-plugins-index

This repository hosts the index for UrbanCode Velocity plugins which instances of UrbanCode velocity reach out to for plugin installs/updates.

## Repository Structure

* `plugins`: A directory containing a list of directories of plugins by `pluginId`. Each plugin directory should have an `info.json` and `releases.json` file.

  * `info.json`: A file containing a JSON object of general information about the plugin that will help users identify if they want to install the plugin to their instance of UrbanCode Velocity.
  * `releases.json`: A file containing a JSON array of release objects, each release object containing the information necessary to install the release and some optional notes to help users identify if they should upgrade to that plugin version in their instance of UrbanCode Velocity.

* `index.json`: A file generated based on the `plugins` directory contents, containing a JSON object with keys for each `pluginId` and values containing the plugin general information and latest release information.

* `src`: A directory containing the scripts required to generate the `index.json` file, as well as lint that file and the `plugins` directory contents to ensure everything is in sync.

* `test`: A directory containing files to test the `src` directory scripts.

## JSON Structures

There are 2 main file types that must abide by strict guidelines:

* `info.json`: A JSON object contains the following fields:

    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | name | string | yes | The display name of the plugin. This is how users will identify the plugin in UrbanCode Velocity. |
    | url | string | yes | A URL to a website containing information about the plugin. A user would use this information to find out more about the plugin. |
    | description | string | yes | A short description about what the plugin does. This should provide enough context for a user to determine whether the plugin is right for their needs. |
    | author | object | yes | Who is responsible for creating/updating the plugin. This will let a user know who is responsible for maintaining the plugin. |
    | author.name | string | yes | The name of the author. If the plugin is tied to an organization, this should be the name of the organization. A user might check this name to ensure the plugin is written by a reliable source. |
    | author.email | string | yes | The email of the author. If the plugin is tied to an organization, this should be an email within the organization. A user might reach out to this email for support or to report a bug. |

* `releases.json`: A JSON array whose objects have the following fields:

    | Field | Type | Required | Description |
    | ----- | ---- | -------- | ----------- |
    | semver | string | yes | The version of the release, adhering to the [Semantic Versioning](https://semver.org/) standard. Must be unique per release object. |
    | date | string | yes | The date and time of the release, adhering to the [ISO 8601](https://web.archive.org/web/20171020085148/https://www.loc.gov/standards/datetime/ISO_DIS%208601-2.pdf) format. Must occur later than the previous release. |
    | image | string | yes | The docker image of the plugin. Must exist in [DockerHub](https://hub.docker.com/). |
    | notes | array | yes | An array of strings containing notes of what the new release introduces for the plugin (bug fixes, features, etc). May be an empty array to omit notes. |
    | supports | string | no | The minimum version of Velocity that the release is compilable with, adhering to the [Semantic Versioning](https://semver.org/) standard. |

## Install Dependencies

This repository uses [Nodejs](https://nodejs.org). The scripts in the `package.json` file require dependencies to run. To install dependencies required for this repository, run the following in the root directory of this repository:

```sh
npm ci
```

## Generate index.json

The `index.json` file should never be manually edited. Instead, it should be automatically generated based on the contents of the `plugins` directory. To update the `index.json` file, run the following in the root directory of this repository:

```sh
npm run generate-index
```

## Linting

To prevent errors and regressions, there are several lint scripts. These can be run by executing the following in the root directory of this repository:

* `npm run lint-sripts`: This will lint the `src` directory to make sure all the scripts abide by valid [es6](https://es6.io/]) syntax and are compilable.
* `npm run lint-plugins`: This will lint the `plugins` directory to make sure all plugins have the correct contents and required fields in their JSON files.
* `npm run lint-index`: This will lint the `index.json` file to make sure all the required fields are present and in sync with the `plugins` directory.

You can run all lint checks at once by executing the following in the root directory of this repository:

```sh
npm run lint
```

## Adding A New Plugin

To add a new plugin to the `index.json`, follow these steps:

1. Create a new directory under the `plugins` directory with the name of the `pluginId` of the new plugin.

2. Create an `info.json` file in that new directory containing a JSON object following the structure defined in [JSON Structures](#jSON-structures)

3. Create a `releases.json` file in that new directory containing a JSON array, whose objects have the structure defined in [JSON Structures](#jSON-structures)

4. [Generate the index.json file](#generate-index.json)

5. Create a Pull Request to this repository with your changes.

## Releasing A New Plugin Version

To add a new released version of a plugin to the `index.json`, follow these steps:

1. Run the following in the root directory of this repository:

    ```sh
    npm run add-release -- --pluginId=<pluginId> --semver=<semver> --image=<image> --date=<date> --notes=<notes> --supports=<supports>
    ```

    where `<pluginId>` is the `pluginId` for the plugin with the new release, `<semver>` is the new version being released, `<image>` is the Docker image that corresponds to the new plugin for the release, `<date>` is the date that the plugin is being released (as an ISO string), `<notes>` is an array containing strings of features/bug-fixes introduced in the new plugin version, and `<supports>` is the minimum version of velocity that the release can be installed on. Note that `<date>`, `<notes>`, and `<supports>` are optional and can be omitted.

2. [Generate the index.json file](#generate-index.json)

3. Create a Pull Request to this repository with your changes.