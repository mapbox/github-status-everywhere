GitHub Commit Status Coloration
========

![](screenshot.png)

A fork of [Mike Dougherty's extension](https://github.com/mikedougherty/chrome-commit-status).

* Vastly simplified
* Doesn't work with GHE
* Simpler display
* Shows status, description, and links to target_url

# Install

```sh
$ git clone git@github.com:tmcw/chrome-commit-status.git
```

* open [chrome://extensions](chrome://extensions/)
* hit "Load Unpacked Extension" and select the folder you cloned into.
* go to [settings/applications](https://github.com/settings/applications) on github, create a new personal access token with only `repo:status` permissions
* click 'options' under the Status extension in chrome://extensions, paste that token in, and save it.
