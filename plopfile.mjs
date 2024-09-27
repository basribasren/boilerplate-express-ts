export default function (plop) {
	// Register a custom helper to convert to camelCase
	plop.setHelper('toCamelCase', function (text) {
		const words = text.split('-')
		return words
			.map((word, index) =>
				index === 0
					? word.toLowerCase()
					: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
			)
			.join('')
	})
	// create your generators here
	plop.setGenerator('basics', {
		description: 'Generate a new Express.js module',
		prompts: [
			{
				type: 'input',
				name: 'name',
				message: 'input your module name (e.g., task-list)',
			},
		], // array of inquirer prompts
		actions: [
			{
				type: 'add',
				path: 'src/modules/{{name}}/{{name}}.controller.ts',
				templateFile: 'src/templates/modules/controller.template.hbs',
			},
			{
				type: 'add',
				path: 'src/modules/{{name}}/{{name}}.interface.ts',
				templateFile: 'src/templates/modules/interface.template.hbs',
			},
			{
				type: 'add',
				path: 'src/modules/{{name}}/{{name}}.routes.ts',
				templateFile: 'src/templates/modules/routes.template.hbs',
			},
			{
				type: 'add',
				path: 'src/modules/{{name}}/{{name}}.service.ts',
				templateFile: 'src/templates/modules/service.template.hbs',
			},
		], // array of actions
	})
}
