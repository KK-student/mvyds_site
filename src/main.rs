use std::{
    error::Error,
    fs,
    ops::Deref,
    path::{Path, PathBuf},
    str::FromStr,
    sync::{LazyLock, Mutex},
};

use axum::{
    Router,
    body::Body,
    extract::OptionalFromRequest,
    http::{Response, StatusCode, header::CONTENT_TYPE},
    response::IntoResponse,
    routing::get,
};
use mimetype_detector::detect;
use tokio::net::TcpListener;

use serde::Serialize;

mod misc;

use crate::misc::collections::*;

#[derive(Serialize)]
struct TextResponse {
    message: String,
}

impl IntoResponse for TextResponse {
    fn into_response(self) -> axum::response::Response {
        (StatusCode::OK, self.message).into_response()
    }
}

#[derive(Serialize)]
struct BinaryResponse {
    message: Vec<u8>,
}

impl IntoResponse for BinaryResponse {
    fn into_response(self) -> axum::response::Response {
        (StatusCode::OK, self.message).into_response()
    }
}

async fn index() -> impl IntoResponse {
    // let contents: TextResponse = TextResponse {
    //     message: get_webpage("index.html").unwrap(),
    // };
    let contents: BinaryResponse = BinaryResponse {
        message: get_web_file("index.html").unwrap(),
    };

    let mut res = axum::response::IntoResponse::into_response(contents);
    res.headers_mut()
        .insert(CONTENT_TYPE, "text/html".parse().unwrap());

    (StatusCode::OK, res)
}

// async fn get_script_endpoint(
//     axum::extract::Path(name): axum::extract::Path<String>,
// ) -> impl IntoResponse {
//     println!("Called get_script_endpoint!");
//     let contents: TextResponse = TextResponse {
//         message: match get_script(name.as_str()) {
//             Ok(val) => val,
//             Err(e) => return error_response(StatusCode::NOT_FOUND, e.to_string().as_str()),
//         },
//     };

//     let mut res = axum::response::IntoResponse::into_response(contents);
//     res.headers_mut()
//         .insert(CONTENT_TYPE, "text/javascript".parse().unwrap());

//     (StatusCode::OK, res)
// }

fn error_response(code: StatusCode, error_message: &str) -> (StatusCode, Response<Body>) {
    let contents = TextResponse {
        message: format!("Error src/main.rs/{{fn error_response}}: {error_message}"),
    };
    let mut res = axum::response::IntoResponse::into_response(contents);
    res.headers_mut()
        .insert(CONTENT_TYPE, "text/html".parse().unwrap());

    (code, res)
}

// fn get_local_file(relative_path: &str) -> Result<String, std::io::Error> {
//     let absolute_canon_path: PathBuf = match std::fs::canonicalize(format!("./{relative_path}")) {
//         Ok(val) => val,
//         Err(e) => return Err(e),
//     };
//     let contents: String = match fs::read_to_string(absolute_canon_path) {
//         Ok(val) => val,
//         Err(e) => return Err(e),
//     };
//     Ok(contents)
// }

fn get_local_binary_file(relative_path: &str) -> Result<Vec<u8>, std::io::Error> {
    let absolute_canon_path: PathBuf = match std::fs::canonicalize(format!("./{relative_path}")) {
        Ok(val) => val,
        Err(e) => return Err(e),
    };
    println!("Reading from file: {}", absolute_canon_path.display());
    let contents: Vec<u8> = match fs::read(absolute_canon_path) {
        Ok(val) => val,
        Err(e) => return Err(e),
    };
    Ok(contents)
}

fn get_web_file(relative_path: &str) -> Result<Vec<u8>, std::io::Error> {
    get_local_binary_file(format!("./webpages/{relative_path}").as_str())
}

async fn get_file_endpoint(
    axum::extract::Path(name): axum::extract::Path<String>,
) -> impl IntoResponse {
    let data: Vec<u8> = match get_web_file(name.as_str()) {
        Ok(val) => val,
        Err(e) => return error_response(StatusCode::NOT_FOUND, e.to_string().as_str()),
    };
    let mime_type: String = get_data_mime_type(&data, {
        let filep = Path::new(name.as_str());
        match filep.extension() {
            Some(e_val) => match e_val.to_str() {
                Some(val) => Some(val.to_string()),
                None => None,
            },
            None => None,
        }
    });
    let contents_response: BinaryResponse = BinaryResponse { message: data };

    let mut res = axum::response::IntoResponse::into_response(contents_response);
    res.headers_mut()
        .insert(CONTENT_TYPE, mime_type.parse().unwrap());

    (StatusCode::OK, res)
}

fn get_data_mime_type(data: &Vec<u8>, file_extension: Option<String>) -> String {
    let unknown_detect = |d: &Vec<u8>| -> String { detect(d.as_slice()).to_string() };
    match file_extension {
        Some(ext) => match ext.to_lowercase().as_str() {
            "css" => "text/css".to_string(),
            _ => unknown_detect(data),
        },
        None => unknown_detect(data),
    }
}

// async fn get_image_endpoint(
//     axum::extract::Path(name): axum::extract::Path<String>,
// ) -> impl IntoResponse {
//     println!("Called get_image_endpoint!");
//     let contents: BinaryResponse = BinaryResponse {
//         message: match get_image(name.as_str()) {
//             Ok(val) => val,
//             Err(e) => return error_response(StatusCode::NOT_FOUND, e.to_string().as_str()),
//         },
//     };

//     let res = axum::response::IntoResponse::into_response(contents);
//     // res.headers_mut()
//     //     .insert(CONTENT_TYPE, "text/javascript".parse().unwrap());

//     (StatusCode::OK, res)
// }

// fn get_webpage(webpage_file_name: &str) -> Result<String, std::io::Error> {
//     get_local_file(format!("webpages/html/{webpage_file_name}").as_str())
// }

// fn get_script(script_file_name: &str) -> Result<String, std::io::Error> {
//     println!("Getting script file: \"webpages/js/{script_file_name}\"");
//     {
//         let full_path_res = std::fs::canonicalize(format!("webpages/js/{script_file_name}"));
//         match &full_path_res {
//             Ok(val) => println!(
//                 "Full script file path: \"{}\"",
//                 full_path_res.unwrap().display()
//             ),
//             Err(_) => {}
//         }
//     }
//     get_local_file(format!("webpages/js/{script_file_name}").as_str())
// }

// fn get_image(image_file_name: &str) -> Result<Vec<u8>, std::io::Error> {
//     let image_file: String = format!("webpages/img/{image_file_name}");
//     println!("Getting image file: \"{image_file}\". ");
//     get_local_binary_file(image_file.as_str())
// }

// async fn get_favicon() -> impl IntoResponse {
//     println!("Called get_favicon!");
//     let contents: BinaryResponse = BinaryResponse {
//         message: match get_image("favicon.ico") {
//             Ok(val) => val,
//             Err(e) => return error_response(StatusCode::NOT_FOUND, e.to_string().as_str()),
//         },
//     };

//     let res = axum::response::IntoResponse::into_response(contents);
//     // res.headers_mut()
//     //     .insert(CONTENT_TYPE, "text/javascript".parse().unwrap());

//     (StatusCode::OK, res)
// }

async fn get_router() -> Router {
    Router::new()
        // .route("/js/{*name}", get(get_script_endpoint))
        // .route("/img/{*name}", get(get_image_endpoint))
        // .route("/favicon.ico", get(get_favicon))
        // .route("/index.html", get(index))
        .route("/", get(index))
        .route("/{*path}", get(get_file_endpoint))
}

static HTTP_PORT_ARC: LazyLock<Mutex<MutableBox<u64>>> =
    LazyLock::new(|| -> Mutex<MutableBox<u64>> { Mutex::new(MutableBox::new(Some(8080))) });

#[tokio::main]
async fn main() {
    let router = get_router().await;

    let address = format!("127.0.0.1:{}", {
        let port_mutg = HTTP_PORT_ARC.lock().unwrap();
        let port_box = port_mutg.deref();
        port_box.get().unwrap()
    });
    let listener = TcpListener::bind(&address).await.unwrap();
    println!("Listening on: {address}");

    axum::serve(listener, router.into_make_service())
        .await
        .unwrap();
}
