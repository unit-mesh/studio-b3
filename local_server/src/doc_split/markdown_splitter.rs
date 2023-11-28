use std::path::PathBuf;

use inference_core::Document;

use crate::doc_split::splitter::{SplitOptions, Splitter};

pub struct MarkdownSplitter {}

impl Splitter for MarkdownSplitter {
    fn split(path: &PathBuf, options: &SplitOptions) -> Vec<Document> {
        println!("MarkdownSplitter::split() not implemented yet");
        vec![]
    }
}