use std::path::PathBuf;
use crate::doc_split::document_type::DocumentType;
use crate::doc_split::splitter::Splitter;
use crate::doc_split::word_splitter::WordSplitter;

fn doc_split(path: &PathBuf) -> Option<()> {
    let path_buf = path.clone();
    println!("doc_splitter: {:?}", path_buf);
    let filename = path_buf.file_name()?.to_str()?;
    let document_type = DocumentType::of(filename)?;

    match document_type {
        DocumentType::TXT => {
            println!("TXT");
        },
        DocumentType::PDF => {
            println!("PDF");
        },
        DocumentType::HTML => {
            println!("HTML");
        },
        DocumentType::DOC => {
            let vec = WordSplitter::split(path);
        },
        DocumentType::XLS => {
            println!("XLS");
        },
        DocumentType::MD => {
            println!("MD");
        },
        DocumentType::PPT => {
            println!("PPT");
        },
    }

    Some(())
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;
    use crate::doc_split::doc_splitter::doc_split;
    use crate::infra::file_walker::FileWalker;

    #[test]
    fn test_doc_splitter() {
        let testdir = PathBuf::from("testdocs");
        let files = FileWalker::index_directory(testdir);
        println!("files: {:?}", files);

        for file in files {
            doc_split(&file);
        }
    }
}
