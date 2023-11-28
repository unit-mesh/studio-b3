use actix_web::{HttpResponse, post, Responder, web};
use actix_web::http::header::ContentType;
use serde::{Deserialize, Serialize};

use crate::app_state::AppState;

#[post("/tickets/{id}")]
async fn create_embedding_document(
    req: web::Json<ReqDocument>,
    data: web::Data<AppState>,
) -> impl Responder {
    let response = serde_json::to_string(&req).unwrap();

    HttpResponse::Created()
        .content_type(ContentType::json())
        .body(response)
}

#[derive(Serialize, Deserialize)]
pub struct ReqDocument {
    pub name: String,
    pub uri: String,
    #[serde(rename = "type")]
    pub doc_type: String,
    pub content: String,
}