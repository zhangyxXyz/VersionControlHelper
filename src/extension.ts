// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Define Git command list
const gitCommands = ["pull", "commit", "push", "log", "diff", "revert", "blame"];

// Define SVN command list
const svnCommands = ["update", "commit", "log", "diff", "rename", "revert", "blame"];

// Get current platform
function getPlatform(): 'win32' | 'darwin' {
	return os.platform() as 'win32' | 'darwin';
}

// Check if client is available on current platform
function isClientAvailable(client: string): boolean {
	const platform = getPlatform();
	if (client === 'snailgit' || client === 'snailsvn') {
		return platform === 'darwin';
	} else if (client === 'tortoisegit' || client === 'tortoisesvn') {
		return platform === 'win32';
	}
	return false;
}

// Get file path
function getPath(uri?: vscode.Uri): string {
	if (uri && uri.fsPath) {
		return uri.fsPath;
	} else if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document) {
		return vscode.window.activeTextEditor.document.fileName;
	} else {
		return vscode.workspace.rootPath || '';
	}
}

// Execute Git command
async function doGitCommand(cmd: string, path: string) {
	const gitClient = vscode.workspace.getConfiguration('versioncontrolhelper').get('gitClient', 'tortoisegit') as string;
	
	if (gitClient === 'none') {
		vscode.window.showInformationMessage('Git features are disabled. Please select a Git client in settings to enable them.');
		return;
	}
	
	// Check if the selected client is available on current platform
	if (!isClientAvailable(gitClient)) {
		const platform = getPlatform();
		const message = platform === 'win32' 
			? "SnailGit/SnailGit Lite is only available on macOS. Please use TortoiseGit on Windows."
			: "TortoiseGit is only available on Windows. Please use SnailGit or SnailGit Lite on macOS.";
		vscode.window.showErrorMessage(message);
		return;
	}
	
	if (gitClient === 'tortoisegit') {
		console.log(`tortoise git do command -> TortoiseGitProc.exe /command:${cmd} /path:"${path}"`);
		childProcess.exec(`TortoiseGitProc.exe /command:${cmd} /path:"${path}"`, (error, stdout, stderr) => {
			if (error) {
				console.warn(`tortoise git error -> ${error}`);
			}
			if (stdout) {
				console.log(`tortoise git stdout -> ${stdout}`);
			}
			if (stderr) {
				console.error(`tortoise git stderr -> ${stderr}`);
			}
		});
	} else if (gitClient === 'snailgit') {
		const uri = vscode.Uri.parse(path);
		const stat = await vscode.workspace.fs.stat(uri);
		if (stat.type === vscode.FileType.File) {
			path = path.substring(0, path.lastIndexOf('/'));
		}
		
		let snailcmd = "";
		if (fs.existsSync("/Applications/SnailGit.app")) {
			snailcmd = "snailgit";
		} else if (fs.existsSync("/Applications/SnailGitLite.app")) {
			snailcmd = "snailgitfree";
		}
		
		if (snailcmd !== "") {
			console.log(`snail git do command -> open ${snailcmd}://git-${cmd}${path}`);
			childProcess.exec(`open ${snailcmd}://git-${cmd}${path}`, (error, stdout, stderr) => {
				if (error) {
					console.warn(`snail git error -> ${error}`);
				}
				if (stdout) {
					console.log(`snail git stdout -> ${stdout}`);
				}
				if (stderr) {
					console.error(`snail git stderr -> ${stderr}`);
				}
			});
		} else {
			vscode.window.showErrorMessage("You need to install 'SnailGit' or 'SnailGit Lite' first!");
		}
	}
}

// Execute SVN command
async function doSvnCommand(cmd: string, path: string) {
	const svnClient = vscode.workspace.getConfiguration('versioncontrolhelper').get('svnClient', 'tortoisesvn') as string;
	
	if (svnClient === 'none') {
		vscode.window.showInformationMessage('SVN features are disabled. Please select an SVN client in settings to enable them.');
		return;
	}
	
	// Check if the selected client is available on current platform
	if (!isClientAvailable(svnClient)) {
		const platform = getPlatform();
		const message = platform === 'win32' 
			? "SnailSVN/SnailSVN Lite is only available on macOS. Please use TortoiseSVN on Windows."
			: "TortoiseSVN is only available on Windows. Please use SnailSVN or SnailSVN Lite on macOS.";
		vscode.window.showErrorMessage(message);
		return;
	}
	
	if (svnClient === 'tortoisesvn') {
		console.log(`tortoise svn do command -> TortoiseProc.exe /command:${cmd} /path:"${path}"`);
		childProcess.exec(`TortoiseProc.exe /command:${cmd} /path:"${path}"`, (error, stdout, stderr) => {
			if (error) {
				console.warn(`tortoise svn error -> ${error}`);
			}
			if (stdout) {
				console.log(`tortoise svn stdout -> ${stdout}`);
			}
			if (stderr) {
				console.error(`tortoise svn stderr -> ${stderr}`);
			}
		});
	} else if (svnClient === 'snailsvn') {
		const uri = vscode.Uri.parse(path);
		const stat = await vscode.workspace.fs.stat(uri);
		if (stat.type === vscode.FileType.File) {
			path = path.substring(0, path.lastIndexOf('/'));
		}
		
		let snailcmd = "";
		if (fs.existsSync("/Applications/SnailSVN.app")) {
			snailcmd = "snailsvn";
		} else if (fs.existsSync("/Applications/SnailSVNLite.app")) {
			snailcmd = "snailsvnfree";
		}
		
		if (snailcmd !== "") {
			console.log(`snail svn do command -> open ${snailcmd}://svn-${cmd}${path}`);
			childProcess.exec(`open ${snailcmd}://svn-${cmd}${path}`, (error, stdout, stderr) => {
				if (error) {
					console.warn(`snail svn error -> ${error}`);
				}
				if (stdout) {
					console.log(`snail svn stdout -> ${stdout}`);
				}
				if (stderr) {
					console.error(`snail svn stderr -> ${stderr}`);
				}
			});
		} else {
			vscode.window.showErrorMessage("You need to install 'SnailSVN' or 'SnailSVN Lite' first!");
		}
	}
}

// Check if Git menu is enabled
function isGitMenuEnabled(): boolean {
	const gitClient = vscode.workspace.getConfiguration('versioncontrolhelper').get('gitClient', 'tortoisegit') as string;
	return gitClient !== 'none';
}

// Check if SVN menu is enabled
function isSvnMenuEnabled(): boolean {
	const svnClient = vscode.workspace.getConfiguration('versioncontrolhelper').get('svnClient', 'tortoisesvn') as string;
	return svnClient !== 'none';
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "VersionControlHelper" is now active!');

	// Set appropriate client based on platform, but don't force it
	const platform = getPlatform();
	const config = vscode.workspace.getConfiguration('versioncontrolhelper');
	
	// Only set default client when user hasn't manually set it
	const currentGitClient = config.get('gitClient', '') as string;
	const currentSvnClient = config.get('svnClient', '') as string;
	
	if (currentGitClient === '') {
		if (platform === 'win32') {
			config.update('gitClient', 'tortoisegit', true);
		} else if (platform === 'darwin') {
			config.update('gitClient', 'snailgit', true);
		}
	}
	
	if (currentSvnClient === '') {
		if (platform === 'win32') {
			config.update('svnClient', 'tortoisesvn', true);
		} else if (platform === 'darwin') {
			config.update('svnClient', 'snailsvn', true);
		}
	}

	// Register all Git commands
	for (const command of gitCommands) {
		context.subscriptions.push(
			vscode.commands.registerCommand(`versioncontrolhelper.${command}`, (uri?: vscode.Uri) => {
				if (!isGitMenuEnabled()) {
					vscode.window.showInformationMessage('Git menu is disabled. Please enable it in settings.');
					return;
				}
				const path = getPath(uri);
				console.log(`git ${command} -> ${path}`);
				doGitCommand(command, path);
			})
		);
	}

	// Register all SVN commands
	for (const command of svnCommands) {
		context.subscriptions.push(
			vscode.commands.registerCommand(`versioncontrolhelper.svn.${command}`, (uri?: vscode.Uri) => {
				if (!isSvnMenuEnabled()) {
					vscode.window.showInformationMessage('SVN menu is disabled. Please enable it in settings.');
					return;
				}
				const path = getPath(uri);
				console.log(`svn ${command} -> ${path}`);
				doSvnCommand(command, path);
			})
		);
	}

	// Listen for configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(e => {
			if (e.affectsConfiguration('versioncontrolhelper.enableGitMenu')) {
				const enabled = isGitMenuEnabled();
				vscode.window.showInformationMessage(
					enabled ? 'Git menu is now enabled.' : 'Git menu is now disabled.'
				);
			}
			if (e.affectsConfiguration('versioncontrolhelper.enableSvnMenu')) {
				const enabled = isSvnMenuEnabled();
				vscode.window.showInformationMessage(
					enabled ? 'SVN menu is now enabled.' : 'SVN menu is now disabled.'
				);
			}
			if (e.affectsConfiguration('versioncontrolhelper.gitClient')) {
				const gitClient = vscode.workspace.getConfiguration('versioncontrolhelper').get('gitClient') as string;
				
				// Show menu status change message
				if (gitClient === 'none') {
					vscode.window.showInformationMessage('Git menu is now disabled.');
				} else {
					// Check client availability, but don't force fallback
					if (!isClientAvailable(gitClient) && gitClient !== 'none') {
						const platform = getPlatform();
						const message = platform === 'win32' 
							? "SnailGit/SnailGit Lite is only available on macOS. TortoiseGit is recommended for Windows."
							: "TortoiseGit is only available on Windows. SnailGit or SnailGit Lite is recommended for macOS.";
						vscode.window.showWarningMessage(message);
					} else {
						vscode.window.showInformationMessage(`Git client changed to ${gitClient === 'snailgit' ? 'SnailGit/SnailGit Lite' : 'TortoiseGit'}. Reload window to apply changes`, 'Reload Window').then(selection => {
							if (selection === 'Reload Window') {
								vscode.commands.executeCommand('workbench.action.reloadWindow');
							}
						});
					}
				}
			}
			if (e.affectsConfiguration('versioncontrolhelper.svnClient')) {
				const svnClient = vscode.workspace.getConfiguration('versioncontrolhelper').get('svnClient') as string;
				
				// Show menu status change message
				if (svnClient === 'none') {
					vscode.window.showInformationMessage('SVN menu is now disabled.');
				} else {
					// Check client availability, but don't force fallback
					if (!isClientAvailable(svnClient) && svnClient !== 'none') {
						const platform = getPlatform();
						const message = platform === 'win32' 
							? "SnailSVN/SnailSVN Lite is only available on macOS. TortoiseSVN is recommended for Windows."
							: "TortoiseSVN is only available on Windows. SnailSVN or SnailSVN Lite is recommended for macOS.";
						vscode.window.showWarningMessage(message);
					} else {
						vscode.window.showInformationMessage(`SVN client changed to ${svnClient === 'snailsvn' ? 'SnailSVN/SnailSVN Lite' : 'TortoiseSVN'}. Reload window to apply changes`, 'Reload Window').then(selection => {
							if (selection === 'Reload Window') {
								vscode.commands.executeCommand('workbench.action.reloadWindow');
							}
						});
					}
				}
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
