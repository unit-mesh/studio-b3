import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

const mainPlaceholder = `# Studio B3

Hi there, B3 is editor for Unit Mesh architecture paradigms, the next-gen software architecture.

1. Click toolbar's AI button to trigger AI commands.
2. Press \`/\` to trigger AI commands.
3. Press \`Control\` + \`/\` (Windows/Linux) or \`Command\` + \`/\` (macOS) to show custom AI input box.
4. Select text and see the select-relative bubble menu.
5. Press  \`Control\` + \`\\\` (Windows/Linux) or \`Command\` + \`\\\` to trigger inline completion.

Scenarios: professional article, blog, user stories, daily reports, weekly reports, etc.

## Inline AI

> Testing grammar and spellings, select long text to see the menu.

永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右，引以为流觞曲水，
列坐其次。虽无丝竹管弦之盛，一觞一咏，亦足以畅叙幽情。

是日也，天朗气清，惠风和畅。仰观宇宙之大，俯察品类之盛，所以游目骋怀，足以极视听之娱，信可乐也。

夫人之相与，俯仰一世，或取诸怀抱，悟言一室之内；或因寄所托，放浪形骸之外。虽趣舍万殊，静躁不同，当其欣于所遇，暂得于己，快然自足，不知老之将至。
及其所之既倦，情随事迁，感慨系之矣。向之所欣，俯仰之间，已为陈迹，犹不能不以之兴怀。况修短随化，终期于尽。古人云：“死生亦大矣。”岂不痛哉！

每览昔人兴感之由，若合一契，未尝不临文嗟悼，不能喻之于怀。固知一死生为虚诞，齐彭殇为妄作。后之视今，亦犹今之视昔。悲夫！故列叙时人，录其所述，
虽世殊事异，所以兴怀，其致一也。后之览者，亦将有感于斯文。

`

const zhPlaceholder = `# B3 编辑器

B3 是一个 AI 原生文本编辑器，适合于 Unit Mesh 架构范式的编辑器，以探索下一代软件架构。

1. 点击工具栏上的 AI 按钮以触发 AI 指令。
2. 按 \`/\` 键以触发 AI 指令。
3. 按 \`Control\` + \`/\`（Windows/Linux）或 \`Command\` + \`/\`（macOS）以显示自定义 AI 输入框。
4. 选择文本并查看选择相对泡泡菜单。
5. 按 \`Control\` + \`\\\`（Windows / Linux）或 \`Command\` + \`\\\` 以触发行内补全。

适用场景：专业领域文章、博客、用户故事、日报、周报等。

## 内联 AI 支持

> 测试语法和拼写，选择长文本以查看菜单。

永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。群贤毕至，少长咸集。此地有崇山峻岭，茂林修竹；又有清流激湍，映带左右，引以为流觞曲水，
列坐其次。虽无丝竹管弦之盛，一觞一咏，亦足以畅叙幽情。

是日也，天朗气清，惠风和畅。仰观宇宙之大，俯察品类之盛，所以游目骋怀，足以极视听之娱，信可乐也。

夫人之相与，俯仰一世，或取诸怀抱，悟言一室之内；或因寄所托，放浪形骸之外。虽趣舍万殊，静躁不同，当其欣于所遇，暂得于己，快然自足，不知老之将至。
及其所之既倦，情随事迁，感慨系之矣。向之所欣，俯仰之间，已为陈迹，犹不能不以之兴怀。况修短随化，终期于尽。古人云：“死生亦大矣。”岂不痛哉！

每览昔人兴感之由，若合一契，未尝不临文嗟悼，不能喻之于怀。固知一死生为虚诞，齐彭殇为妄作。后之视今，亦犹今之视昔。悲夫！故列叙时人，录其所述，
虽世殊事异，所以兴怀，其致一也。后之览者，亦将有感于斯文。

`

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      'Editor Placeholder': mainPlaceholder,
      'Custom Related Resource Link': 'Custom Related Resource Link',
      'Article Context': 'Article Context',
      'Grammarly': 'Grammarly',
      'Text Prediction': 'Text Prediction',
      'Text Similarity': 'Text Similarity',
      'Web Search': 'Web Search',
      'Model Setting': 'Model Setting',
      'Continue writing': 'Continue writing',
      'Help Me Write': 'Help Me Write',
      'Spelling and Grammar': 'Spelling and Grammar',
      'Summarize': 'Summarize',
      'Polish': 'Polish',
      'Similar Chunk': 'Similar Content Chunk',
      'Simplify Content': 'Simplify Content',
      'Translate': 'Translate',
      'Generate Outline': 'Generate Outline',
      'Look up': 'Look up',
    }
  },
  zh: {
    translation: {
      'Editor Placeholder': zhPlaceholder,
      'Custom Related Resource Link': '自定义相关资源链接',
      'Article Context': '文章背景',
      'Grammarly': '语法检查',
      'Text Prediction': '文本预测',
      'Text Similarity': '文本相似度',
      'Web Search': '网页搜索',
      'Model Setting': '模型设置',
      'Continue writing': '续写',
      'Help Me Write': '帮助我写作',
      'Spelling and Grammar': '拼写和语法检查',
      'Summarize': '生成摘要',
      'Polish': '润色',
      'Similar Chunk': '相似内容块',
      'Simplify Content': '精简内容',
      'Translate': '翻译',
      'Generate Outline': '生成大纲',
      'Look up': '检索',
    }
  }
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .init({
    resources,
    fallbackLng: 'en',
    // debug: true,
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