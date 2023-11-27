pub mod scraper;

use std::ops::Deref;
use std::sync::Arc;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder};
use sqlx::{Executor, Pool, Sqlite, SqlitePool};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {

    let sql = Arc::new(initialize().await);
    sql.deref().execute("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT NOT NULL)").await.unwrap();

    HttpServer::new(|| {
        App::new()
            .service(hello)
            .service(echo)
            .route("/hey", web::get().to(manual_hello))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

#[tracing::instrument(skip_all)]
pub async fn initialize() -> Pool<Sqlite> {
    let url = format!("sqlite://./3b.db?mode=rwc");

    let pool = SqlitePool::connect(&*url);
    return pool.await.unwrap();
}
