use std::collections::HashMap;
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;
use std::ptr;

use docx_rs::{DocumentChild, ParagraphChild, read_docx, RunChild};
use inference_core::{Document, Metadata};
use tracing::error;
use unicode_segmentation::UnicodeSegmentation;

use crate::doc_split::splitter::{SplitOptions, Splitter};

pub struct OfficeSplitter {}

impl Splitter for OfficeSplitter {
    fn split(path: &PathBuf, options: &SplitOptions) -> Vec<Document> {
        let mut documents: Vec<Document> = vec![];
        let document = Self::read(path).expect("docx_to_markdown error");
        let pure_file_name = path.file_stem().unwrap().to_str().unwrap();
        let mut map = HashMap::new();
        map.insert("file_name".to_string(), pure_file_name.to_string());
        map.insert("file_path".to_string(), path.to_str().unwrap().to_string());

        let metadata: Metadata = Metadata {
            metadata: map,
        };

        let buf_size = options.chunk_size * 4;
        let mut buffer = String::with_capacity(buf_size);
        for word in document.split_sentence_bounds() {
            if buffer.len() + word.len() <= buf_size {
                buffer.push_str(word);
            } else {
                documents.push(Document::from_with_metadata(buffer.clone(), metadata.clone()));
                for i in buffer.len() .. buf_size {
                    unsafe{ ptr::write(buffer.as_mut_ptr().add(i), 0x20); };
                }
                buffer.clear();
            }
        }

        documents
    }
}

impl OfficeSplitter {
    pub(crate) fn read(path: &PathBuf) -> Result<String, anyhow::Error> {
        let mut file = File::open(path)?;

        let mut buf = vec![];
        file.read_to_end(&mut buf)?;

        let mut text = String::new();

        match read_docx(&*buf) {
            Ok(content) => {
                content.document.children.iter().for_each(|child| {
                    match child {
                        DocumentChild::Paragraph(para) => {
                            let heading = match &para.property.style {
                                None => "",
                                Some(style) => {
                                    match style.val.as_str() {
                                        "Heading1" => "# ",
                                        "Heading2" => "## ",
                                        "Heading3" => "### ",
                                        "Heading4" => "#### ",
                                        "Heading5" => "##### ",
                                        "Heading6" => "###### ",
                                        _ => ""
                                    }
                                }
                            };

                            let mut para_text = String::new();
                            para.children.iter().for_each(|child| {
                                match child {
                                    ParagraphChild::Run(run) => {
                                        para_text += &run.children.iter().map(|child| {
                                            match child {
                                                RunChild::Text(text) => text.text.clone(),
                                                _ => String::new(),
                                            }
                                        }).collect::<String>();
                                    }
                                    _ => {}
                                }
                            });

                            text = format!("{}{}{}\n", text, heading, para_text);
                        }
                        _ => {}
                    }
                });
            }
            Err(err) => {
                error!("read_docx error: {:?}", err);
            }
        }

        Ok(text)
    }
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use crate::doc_split::office_splitter::OfficeSplitter;
    use crate::infra::file_walker::FileWalker;

    #[test]
    fn test_word_splitter() {
        let testdir = PathBuf::from("_fixtures").join("header.docx");
        let files = FileWalker::index_directory(testdir);

        let file = files.first().unwrap();
        let documents = OfficeSplitter::read(file);

        assert_eq!(documents, "# Heading 1

## Heading 2

Normal Context


");
    }
}