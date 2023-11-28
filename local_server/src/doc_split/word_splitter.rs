use std::fs::File;
use std::io::Read;
use std::path::PathBuf;

use docx_rs::{DocumentChild, ParagraphChild, read_docx, RunChild};
use inference_core::Document;
use tracing::error;

use crate::doc_split::splitter::Splitter;

pub struct WordSplitter {}

impl Splitter for WordSplitter {
    fn split(path: &PathBuf) -> Vec<Document> {
        let mut file = File::open(path).unwrap();
        let mut buf = vec![];
        file.read_to_end(&mut buf).unwrap();

        let mut documents: Vec<Document> = vec![];

        let mut text = String::new(); // Declare as mutable String

        match read_docx(&*buf) {
            Ok(content) => {
                content.document.children.iter().for_each(|child| {
                    match child {
                        DocumentChild::Paragraph(para) => {
                            para.children.iter().for_each(|child| {
                                match child {
                                    ParagraphChild::Run(run) => {
                                        text += &run.children.iter().map(|child| {
                                            match child {
                                                RunChild::Text(text) => text.text.clone(),
                                                _ => String::new(),
                                            }
                                        }).collect::<String>();
                                    }
                                    ParagraphChild::Insert(_) => {}
                                    ParagraphChild::Delete(_) => {}
                                    ParagraphChild::BookmarkStart(_) => {}
                                    ParagraphChild::Hyperlink(_) => {}
                                    ParagraphChild::BookmarkEnd(_) => {}
                                    ParagraphChild::CommentStart(_) => {}
                                    ParagraphChild::CommentEnd(_) => {}
                                    ParagraphChild::StructuredDataTag(_) => {}
                                }
                            });

                            text += "\n\n";
                        }
                        DocumentChild::Table(_) => {}
                        _ => {}
                    }
                });
            }
            Err(err) => {
                error!("read_docx error: {:?}", err);
            }
        }

        println!("text: {}", text);

        documents
    }
}