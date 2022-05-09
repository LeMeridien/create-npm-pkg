const chalk = require('chalk');
const commander = require('commander');
const envinfo = require('envinfo');

const packageJson = require('./package.json');

let projectName;

const init = async () => {
	console.log('Hello Npm');

	const program = new commander.Command(packageJson.name)
		.version(packageJson.version)
		.arguments('<project-directory>')
		.usage(`${chalk.green('<project-directory>')} [options]`)
		.action((name) => {
			projectName = name;
		})
		.option('--verbose', 'print additional logs')
		.option('--info', 'print environment debug info')
		.option(
			'--template <path-to-template>',
			'specify a template for the created project'
		)
		.option('--use-pnp')
		.allowUnknownOption()
		.on('--help', () => {
			console.log(
				`    Only ${chalk.green('<project-directory>')} is required.`
			);
			console.log();
			console.log(`    A custom ${chalk.cyan('--template')} can be one of:`);
			console.log(
				`      - a custom template published on npm: ${chalk.green(
					'@cru/npm-package-template'
				)}`
			);
			console.log(
				`      - a local path relative to the current working directory: ${chalk.green(
					'file:../my-custom-template'
				)}`
			);
			console.log(`      - a .tgz archive: ${chalk.green()}`);
			console.log(`      - a .tar.gz archive: ${chalk.green()}`);
			console.log();
			console.log(
				`    If you have any problems, do not hesitate to file an issue:`
			);
			console.log(`      ${chalk.cyan()}`);
			console.log();
		})
		.parse(process.argv);

	if (program.info) {
		console.log(chalk.bold('\nEnvironment Info:'));

		console.log(
			`\n  current version of ${packageJson.name}: ${packageJson.version}`
		);

		console.log(`  running from ${__dirname}`);

		const message = await envinfo.run(
			{
				System: ['OS', 'CPU'],
				Binaries: ['Node', 'npm', 'Yarn'],
				Browsers: ['Chrome', 'Edge', 'Internet Explorer', 'Firefox', 'Safari'],
				npmPackages: ['react', 'react-dom', 'react-scripts'],
				npmGlobalPackages: ['create-react-app']
			},
			{
				duplicates: true,
				showNotFound: true
			}
		);

		return console.log(message);
	}

	if (typeof projectName === 'undefined') {
		console.error('Please specify the project directory:');
		console.log(
			`  ${chalk.cyan(program.name())} ${chalk.green('<project-directory>')}`
		);
		console.log();
		console.log('For example:');
		console.log(
			`  ${chalk.cyan(program.name())} ${chalk.green('my-npm-package')}`
		);
		console.log();
		console.log(
			`Run ${chalk.cyan(`${program.name()} --help`)} to see all options.`
		);
		process.exit(1);
	}

	createPkg(
		projectName,
		program.verbose,
		program.scriptsVersion,
		program.template
	);
};

const createPkg = (name, verbose, version, template) => {
	const root = path.resolve(name);
	const pkgName = path.basename(root);

	const packageJson = {
		name: pkgName,
		version: '0.1.0',
		private: true
	};

	fs.writeFileSync(
		path.join(root, 'package.json'),
		JSON.stringify(packageJson, null, 2) + os.EOL
	);

	const originalDirectory = process.cwd();
	process.chdir(root);

	run(root, pkgName, version, verbose, originalDirectory, template);
};

const run = (root, pkgName, version, verbose, originalDirectory, template) => {
	console.log('run app');
};

const getInstallPackage = (version, originalDirectory) => {
	let packageToInstall = 'test';

	return Promise.resolve(packageToInstall);
};

const getTemplateInstallPackage = (template, originalDirectory) => {
	let templateToInstall = '@cru/npm-package-template';
	if (template) {
		if (template.match(/^file:/)) {
			templateToInstall = `file:${path.resolve(
				originalDirectory,
				template.match(/^file:(.*)?$/)[1]
			)}`;
		} else if (
			template.includes('://') ||
			template.match(/^.+\.(tgz|tar\.gz)$/)
		) {
			// for tar.gz or alternative paths
			templateToInstall = template;
		} else {
			// Add prefix 'cra-template-' to non-prefixed templates, leaving any
			// @scope/ and @version intact.
			const packageMatch = template.match(/^(@[^/]+\/)?([^@]+)?(@.+)?$/);
			const scope = packageMatch[1] || '';
			const templateName = packageMatch[2] || '';
			const version = packageMatch[3] || '';

			if (
				templateName === templateToInstall ||
				templateName.startsWith(`${templateToInstall}-`)
			) {
				// Covers:
				// - cra-template
				// - @SCOPE/cra-template
				// - cra-template-NAME
				// - @SCOPE/cra-template-NAME
				templateToInstall = `${scope}${templateName}${version}`;
			} else if (version && !scope && !templateName) {
				// Covers using @SCOPE only
				templateToInstall = `${version}/${templateToInstall}`;
			} else {
				// Covers templates without the `cra-template` prefix:
				// - NAME
				// - @SCOPE/NAME
				templateToInstall = `${scope}${templateToInstall}-${templateName}${version}`;
			}
		}
	}

	return Promise.resolve(templateToInstall);
};

export { init };
