import Handlebars from 'handlebars'

class PromptsManager {
	compile(string: string, data: object) {
		const template = Handlebars.compile(string)
		return template(data)
	}
}