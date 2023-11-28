#[derive(Debug, PartialEq)]
pub enum DocumentType {
    TXT,
    PDF,
    HTML,
    DOC,
    XLS,
    MD,
    PPT,
}

impl DocumentType {
    fn supported_extensions(&self) -> Vec<&'static str> {
        match self {
            DocumentType::TXT => vec!["txt"],
            DocumentType::PDF => vec!["pdf"],
            DocumentType::HTML => vec!["html", "htm", "xhtml"],
            DocumentType::DOC => vec!["doc", "docx"],
            DocumentType::XLS => vec!["xls", "xlsx"],
            DocumentType::MD => vec!["md", "markdown"],
            DocumentType::PPT => vec!["ppt", "pptx"],
        }
    }

    pub(crate) fn of(file_name: &str) -> Option<DocumentType> {
        for document_type in [
            DocumentType::TXT,
            DocumentType::PDF,
            DocumentType::HTML,
            DocumentType::DOC,
            DocumentType::XLS,
            DocumentType::MD,
            DocumentType::PPT,
        ] {
            for supported_extension in document_type.supported_extensions() {
                if file_name.ends_with(supported_extension) {
                    return Some(document_type);
                }
            }
        }

        None
    }
}
