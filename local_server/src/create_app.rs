use actix_web::{App, get, HttpResponse, post, Responder, web};
use actix_web::body::MessageBody;
use actix_web::{Error};
use actix_web::dev::{ServiceFactory, ServiceRequest, ServiceResponse};


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

pub fn create_app() -> App<impl ServiceFactory<
    ServiceRequest,
    Response=ServiceResponse<impl MessageBody>,
    Config=(),
    InitError=(),
    Error=Error,
>, > {
    App::new()
        .service(hello)
        .service(echo)
        .route("/hey", web::get().to(manual_hello))
}