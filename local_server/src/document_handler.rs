use actix_web::{get, HttpResponse, post, Responder, web};
use actix_web::http::header::ContentType;
use serde::{Deserialize, Serialize};

use crate::app_state::AppState;

#[post("/embedding-document")]
async fn create_embedding_document(
    form: web::Form<ReqDocument>,
    _data: web::Data<AppState>,
) -> impl Responder {
    let response = serde_json::to_string(&form).unwrap();

    HttpResponse::Created()
        .content_type(ContentType::json())
        .body(response)
}

#[get("/embedding-document/search")]
async fn search_embedding_document(
    query: web::Query<SearchQuery>,
    data: web::Data<AppState>,
) -> impl Responder {
    let embedding = data.semantic.embed(&query.q).unwrap();
    let document_match = data.storage.find_relevant(embedding, 5, 0.0);

    let documents: Vec<DocumentResult> = document_match
        .into_iter()
        .map(|doc| DocumentResult {
            id: doc.embedding_id,
            score: doc.score,
            text: doc.embedded.text,
        })
        .collect();

    let response = serde_json::to_string(&documents).unwrap();

    HttpResponse::Ok()
        .content_type(ContentType::json())
        .body(response)
}

#[derive(Serialize, Deserialize)]
pub struct DocumentResult {
    pub id: String,
    pub score: f32,
    pub text: String,
}

#[derive(Serialize, Deserialize)]
pub struct ReqDocument {
    pub name: String,
    pub uri: String,
    #[serde(rename = "type")]
    pub doc_type: String,
    pub content: String,
}

#[derive(Serialize, Deserialize)]
pub struct SearchQuery {
    pub q: String,
}
