use std::path::PathBuf;
use crate::doc_split::document_type::DocumentType;
use crate::doc_split::office_splitter::OfficeSplitter;

pub struct DocReader {}

impl DocReader {
    pub fn read(path: &PathBuf) -> Result<String, anyhow::Error> {
        let extension = path.extension()
            .ok_or(anyhow::anyhow!("No extension found for file: {:?}", path))?
            .to_str()
            .ok_or(anyhow::anyhow!("Failed to convert extension to string: {:?}", path))?;

        let document_type = match DocumentType::of(extension) {
            None => return Ok(String::new()),
            Some(doc) => doc
        };

        return match document_type {
            DocumentType::MD | DocumentType::TXT => {
                std::fs::read_to_string(path).map_err(|e| e.into())
            }
            DocumentType::PDF => {
                Ok("".to_string())
            }
            DocumentType::HTML => {
                Ok("".to_string())
            }
            DocumentType::DOC | DocumentType::XLS | DocumentType::PPT => {
                OfficeSplitter::read(path)
            }
        };
    }
}
