import chalk from 'chalk';

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split('.');
const major = semver[0];

if (major < 14) {
	console.error(
		'You are running Node ' +
			currentNodeVersion +
			'.\n' +
			'Create React App requires Node 14 or higher. \n' +
			'Please update your version of Node.'
	);
	process.exit(1);
}

const showEnvInfo = async () => {
	console.log(chalk.bold('\nEnvironment Info:'));
	const result = await envinfo.run({
		System: ['OS', 'CPU'],
		Binaries: ['Node', 'Yarn', 'npm'],
		Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
		npmGlobalPackages: ['@epranka/create-package']
	});
	console.log(result);
	process.exit(1);
};

const { init } = require('./createNpmPackage');

init();
