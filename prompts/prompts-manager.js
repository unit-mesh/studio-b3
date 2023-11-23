import Handlebars from 'handlebars'

class PromptsManager {
  compile (string, data) {
    const template = Handlebars.compile(string)
    return template(data)
  }
}