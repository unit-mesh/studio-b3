import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { EditorProvider, Extension, FloatingMenu, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import { MenuBar } from './menu-bar'

const AiPlugin = Extension.create({
  // @ts-ignore
  addKeyboardShortcuts () {
    return {
      '/': (props) => {
        const editor = props.editor
        //
        if (editor.isActive('paragraph')) {
          console.log('paragraph')
        }
        // editor.isActive('heading', {level: 3})
        if (editor.isActive('heading')) {
          console.log('heading')
        }
      }
    }
  }
})

const extensions = [
  AiPlugin,
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  // @ts-ignore
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
]

const content = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you’d probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That’s a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn’t that great? And all of that is editable. But wait, there’s more. Let’s try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It’s only the tip of the iceberg though. Give it a try and click a little bit around. Don’t forget to check the other examples too.
</p>
<blockquote>
  Wow, that’s amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`

const LiveEditor = () => {
  const editor = useEditor({
    extensions: extensions,
    content: content,
  })

  return (
    <>
      <EditorProvider
        extensions={extensions}
        content={content}
        slotBefore={<MenuBar/>}
      >

      </EditorProvider>
    </>
  )
}

export default LiveEditor
