To update the packages follow the steps below:

Step 1: Install the 'npm-check-updates' tool
$ sudo npm install -g npm-check-updates

Step 2: Update the package.json (you may want to take a backup first)
$ ncu --upgrade
After the command, validate the changes to your package.json

Step 3: Edit package.json to revert the following packages to the specified
        versions below (otherwise you will need to modify the code in
        MarkdownBlock.tsx which will break):
        "react-markdown": "^8.0.7",
        "remark-gfm": "^3.0.1"

Step 4: Install the new packages
$ sudo npm install --force
