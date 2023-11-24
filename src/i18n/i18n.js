import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      'Custom Related Resource Link': 'Custom Related Resource Link',
      'Article Context': 'Article Context',
      'Grammarly': 'Grammarly',
      'Text Prediction': 'Text Prediction',
      'Text Similarity': 'Text Similarity',
      'Web Search': 'Web Search',
    }
  },
  zh: {
    translation: {
      'Custom Related Resource Link': '自定义相关资源链接',
      'Article Context': '文章背景',
      'Grammarly': '语法检查',
      'Text Prediction': '文本预测',
      'Text Similarity': '文本相似度',
      'Web Search': '网页搜索',
    }
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    debug: true,
    // lng: 'zh', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  }, (err, t) => {
    if (err) return console.log('something went wrong loading', err)
    console.log('i18n loaded successfully')
  })

export default i18n