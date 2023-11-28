pub mod file_walker;

use std::path::PathBuf;
fn doc_splitter(filename: &PathBuf) {
    println!("doc_splitter: {}", filename.display());
}

#[cfg(test)]
mod tests {
    use crate::doc_split::file_walker::FileWalker;
    use super::*;

    #[test]
    fn test_doc_splitter() {
        let testdir = PathBuf::from("testdocs");
        let files = FileWalker::index_directory(testdir);

        for file in files {
            doc_splitter(&file);
        }
    }
}