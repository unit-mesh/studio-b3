import { EditorProvider } from '@tiptap/react'
import React from 'react'
import StarterKit from '@tiptap/starter-kit'

export const AiBlockEditor = ({ content }) => {
  const extensions = [
    StarterKit,
  ]

  return (
    <EditorProvider extensions={extensions} content={content}>
    </EditorProvider>
  )
}

