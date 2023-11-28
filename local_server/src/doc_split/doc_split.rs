use std::path::PathBuf;
use crate::doc_split::document_type::DocumentType;

fn doc_splitter(path: &PathBuf) -> Option<()> {
    let filename = path.file_name()?.to_str()?;
    println!("doc_splitter: {}", filename);
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
            println!("DOC");
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
    use crate::doc_split::file_walker::FileWalker;
    use crate::doc_split::doc_split::doc_splitter;

    #[test]
    fn test_doc_splitter() {
        let testdir = PathBuf::from("testdocs");
        let files = FileWalker::index_directory(testdir);

        for file in files {
            doc_splitter(&file);
        }
    }
}
