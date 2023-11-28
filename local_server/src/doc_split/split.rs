use std::path::PathBuf;

use inference_core::Document;

use crate::doc_split::document_type::DocumentType;
use crate::doc_split::splitter::Splitter;
use crate::doc_split::office_splitter::OfficeSplitter;

fn split(path: &PathBuf) -> Option<Vec<Document>> {
    let path_buf = path.clone();

    let filename = path_buf.file_name()?.to_str()?;
    let document_type = DocumentType::of(filename)?;

    let documents = match document_type {
        DocumentType::TXT => vec![],
        DocumentType::PDF => vec![],
        DocumentType::HTML => vec![],
        DocumentType::MD => vec![],
        DocumentType::DOC => OfficeSplitter::split(path),
        DocumentType::XLS => OfficeSplitter::split(path),
        DocumentType::PPT => OfficeSplitter::split(path),
    };

    Some(documents)
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use crate::doc_split::split::split;
    use crate::infra::file_walker::FileWalker;

    #[test]
    fn test_doc_splitter() {
        let testdir = PathBuf::from("testdocs");
        let files = FileWalker::index_directory(testdir);

        for file in files {
            split(&file);
        }
    }
}
