use std::path::PathBuf;

use inference_core::Document;

use crate::doc_split::splitter::{SplitOptions, Splitter};

pub struct PdfSplitter {}

impl Splitter for PdfSplitter {
    fn split(path: &PathBuf, options: &SplitOptions) -> Vec<Document> {
        println!("PdfSplitter::split() not implemented yet");
        vec![]
    }
}