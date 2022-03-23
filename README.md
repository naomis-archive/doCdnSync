# DigitalOcean CDN Sync

This is a simple CDN tool to create a "syncable" directory locally and connect it to a DigitalOcean Spaces instance.

To get started, install this package globally with `npm i -g do-cdn-sync`. Then, navigate to the directory you'd like to hold your Spaces files and create a `.env` file with the following values:

```txt
SPACES_KEY=""
SPACES_SECRET=""
SPACES_NAME=""
SPACES_REGION=""
```

Then, follow these instructions to fill in those values:

You'll need to create a Spaces key set. Log in to your DigitalOcean dashboard, and select `API` from the sidebar. Under "Spaces access keys", generate your new key. The `SPACES_KEY` will be your new key, and the `SPACES_SECRET` will be your new secret. Your `SPACES_NAME` value will be the name of your DigitalOcean Space, and your `SPACES_REGION` will be the region your Space is hosted in (such as `sfo3`).

Once you have prepared your environment variables, you can run the following commands to use the tool:

`do-cdn-sync setup`: This will create a `content` directory and automatically download all of your Spaces files to your local file system.

`do-cdn-sync sync`: This will sync your local file system with your Spaces file system.

The `content` directory serves as the "single source of truth", and the `sync` command will ensure that your Spaces files are always up to date with this directory based on the following rules:

- Check if your Spaces files exist locally, and delete any that have been deleted locally.
- Check if your local files exist on the Space, and:
  - If the local file does NOT exist on the Space, upload it.
  - If the file DOES exist on the space, check if it has changed and:
    - If it HAS changed, delete the Spaces file and upload the local file.
    - If it HAS NOT changed, do nothing.

## Feedback and Bugs

If you have feedback or a bug report, please feel free to open a GitHub issue!

## Contributing

If you would like to contribute to the project, you may create a Pull Request containing your proposed changes and we will review it as soon as we are able! Please review our [contributing guidelines](CONTRIBUTING.md) first.

## Code of Conduct

Before interacting with our community, please read our [Code of Conduct](CODE_OF_CONDUCT.md).

## Licensing

Copyright (C) 2022 Naomi Carrigan

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details.

The full license terms may be viewed in the [LICENSE.md file](./LICENSE.md)

## Contact

We may be contacted through our [Chat Server](http://chat.nhcarrigan.com) or via email at `contact@nhcarrigan.com`.
