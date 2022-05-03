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
};

export { init };
