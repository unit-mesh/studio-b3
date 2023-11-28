use std::fs::File;
use std::io::Read;
use std::path::PathBuf;

use docx_rs::{DocumentChild, ParagraphChild, read_docx, RunChild};
use inference_core::Document;
use tracing::error;

use crate::doc_split::splitter::{SplitOptions, Splitter};

pub struct OfficeSplitter {}

impl Splitter for OfficeSplitter {
    fn split(path: &PathBuf, options: &SplitOptions) -> Vec<Document> {
        let mut documents: Vec<Document> = vec![];
        let document = Self::docx_to_markdown(path);

        documents
    }
}

impl OfficeSplitter {
    fn docx_to_markdown(path: &PathBuf) -> String {
        let mut file = File::open(path).unwrap();
        let mut buf = vec![];
        file.read_to_end(&mut buf).unwrap();

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

        text
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
        let documents = OfficeSplitter::docx_to_markdown(file);

        assert_eq!(documents, "# Heading 1

## Heading 2

Normal Context


");
    }
}