use inference_core::Document;

use crate::doc_split::splitter::{SplitOptions, TextSplitter};

pub struct HtmlSplitter {}

impl TextSplitter for HtmlSplitter {
    fn split(text: &str, options: &SplitOptions) -> Vec<Document> {
        let document = Document::from(text.to_string());

        // todo: implement it

        let mut documents: Vec<Document> = vec![];

        documents
    }
}
