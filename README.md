# VersionControlHelper

A Visual Studio Code extension that adds menu items to quickly launch external version control programs. It works both in the editor context menu and the file/folder explorer context menu.

## Features

- Adds context menu items for Git and SVN operations in:
  - File Explorer (right-click on files/folders)
  - Editor (right-click in text editor)
- Integrates with [TortoiseGit](https://tortoisegit.org/) and [TortoiseSVN](https://tortoisesvn.net/) on Windows
- Integrates with [SnailGit](https://www.langui.net/snailgit/) / [SnailGit Lite](https://www.langui.net/snailgitlite/) and [SnailSVN](https://www.langui.net/snailsvn/) / [SnailSVN Lite](https://www.langui.net/snailsvnlite/) on macOS
- Supports keyboard shortcuts for quick access
- Automatically detects the appropriate client based on your platform

## Requirements

### Windows
- [TortoiseGit](https://tortoisegit.org/) for Git operations
- [TortoiseSVN](https://tortoisesvn.net/) for SVN operations

### macOS
- [SnailGit](https://www.langui.net/snailgit/) or [SnailGit Lite](https://www.langui.net/snailgitlite/) for Git operations
- [SnailSVN](https://www.langui.net/snailsvn/) or [SnailSVN Lite](https://www.langui.net/snailsvnlite/) for SVN operations

## Installation

1. Open [VS Code](https://code.visualstudio.com/)
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "VersionControlHelper"
4. Click Install
5. Reload VS Code

## Usage

Right-click on a file or folder in the Explorer or in the editor to access the context menu. Select the Git or SVN operation you want to perform, and the extension will launch the appropriate external program.

### Git Commands
- Show log
- Pull
- Commit
- Push
- Diff
- Revert
- Blame

### SVN Commands
- Show log
- Update
- Commit
- Diff with previous version
- Rename
- Revert
- Blame

## Keyboard Shortcuts

### Git Commands
- Show log: `Ctrl+Alt+L`
- Pull: `Ctrl+Alt+P`
- Commit: `Ctrl+Alt+C`
- Push: `Ctrl+Alt+S`
- Diff: `Ctrl+Alt+D`
- Revert: `Ctrl+Alt+R`
- Blame: `Ctrl+Alt+B`

### SVN Commands
- Show log: `Alt+L`
- Update: `Alt+U`
- Commit: `Alt+C`
- Diff: `Alt+D`
- Blame: `Alt+B`

## Extension Settings

This extension contributes the following settings:

- `versioncontrolhelper.gitClient`: Select Git client (select 'none' to disable Git menu)
  - `none`: Disable Git menu
  - `tortoisegit`: [TortoiseGit](https://tortoisegit.org/) (Windows only)
  - `snailgit`: [SnailGit](https://www.langui.net/snailgit/) or [SnailGit Lite](https://www.langui.net/snailgitlite/) (macOS only)

- `versioncontrolhelper.svnClient`: Select SVN client (select 'none' to disable SVN menu)
  - `none`: Disable SVN menu
  - `tortoisesvn`: [TortoiseSVN](https://tortoisesvn.net/) (Windows only)
  - `snailsvn`: [SnailSVN](https://www.langui.net/snailsvn/) or [SnailSVN Lite](https://www.langui.net/snailsvnlite/) (macOS only)

## Known Issues

- [SnailGit](https://www.langui.net/snailgit/)/[SnailGit Lite](https://www.langui.net/snailgitlite/) and [SnailSVN](https://www.langui.net/snailsvn/)/[SnailSVN Lite](https://www.langui.net/snailsvnlite/) are only available on macOS
- [TortoiseGit](https://tortoisegit.org/)/[TortoiseSVN](https://tortoisesvn.net/) are only available on Windows
- If you select a client that's not available on your platform, you'll receive a warning but the configuration will remain as selected

## License

[MIT](LICENSE)