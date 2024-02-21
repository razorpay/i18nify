# i18nify-data Package Versioning

The i18nify-data repo is not tagged or versioned overall. Individual Country Attributes within the package are versioned directly and independently.

## Developer How To

### 1. Scheme Updation

* Pull the latest master and checkout to a new branch
* Inside the country attribute folder in which you want to update the scheme, make a new version folder.
* While versioning make sure the version new version is updated from `1.0` to `2.0`
* Inside that version Add the description file and give a brief about the updation.
* Add the updated scheme.json file and corresponding data.json file.
* Raise the PR.
* It will be reviewed, based on the data source, along with cross checking the data to the schema

### 2. Data Addition / Updation

* Pull the latest master and checkout to a new branch
* Inside the country attribute folder in which you want to update the scheme, make a new version folder.
* While versioning make sure the version new version is updated from `1.0` to `1.1`
* Inside that version Add the description file and give a brief about the updation.
* Add the updated scheme.json file and corresponding data.json file.
* Raise the PR.
* It will be reviewed, based on the data source, along with cross checking the data to the schema

### Patching older versions

versions `1.0.0` and `2.0.0` exist. If `1.0.0` needs an update to `1.0.1`, branch out from `1.0.0` and create `1.0.1`. Your new commits need to be merged to master branch, when applicable.

