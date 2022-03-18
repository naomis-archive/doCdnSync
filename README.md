# DigitalOcean CDN Sync

This is a simple CDN tool to create a "syncable" directory locally and connect it to a DigitalOcean Spaces instance.

To get started, clone this project locally (somewhere convenient, as the project will also hold your CDN files). Then run `npm ci` to install the dependencies, and `npm run build` to compile the TypeScript.

You'll need to create a Spaces key set. Log in to your DigitalOcean dashboard, and select `API` from the sidebar. Under "Spaces access keys", generate your new key. Now, copy the `sample.env` file to a `.env` file in your cloned project, and fill in the values. The `SPACES_KEY` will be your new key, and the `SPACES_SECRET` will be your new secret. Your `SPACES_NAME` value will be the name of your DigitalOcean Space.

---

**IF YOU ALREADY HAVE FILES UPLOADED IN YOUR SPACE**: Run `npm run setup` to prepare your cloned project. This will create a `content` directory and automatically download all of your Spaces files to your local project.

**IF YOU DO NOT HAVE FILES UPLOADED IN YOUR SPACE**: Create a `content` directory in the root directory of your cloned project.

---

The `content` directory serves as the "single source of truth", and this tool will ensure that your Spaces files are always up to date with this directory. To sync your files, use `npm run sync`. This will do the following:

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
