// use wasm_bindgen::prelude::*;
#[macro_use]
extern crate std;
use flyingcircusrust::{aircraft::Aircraft, serialization::*};
use wasm_minimal_protocol::*;

initiate_protocol!();
#[wasm_func]
pub fn catalog_json(lz_buf: &[u8], locale: &[u8]) -> Vec<u8> {
    match str::from_utf8(locale) {
        Ok(locale) => rust_i18n::set_locale(locale),
        Err(fail) => return format!("Utf8Error valid up to {}", fail.valid_up_to()).into_bytes(),
    }

    match str::from_utf8(lz_buf) {
        Ok(lzstr) => {
            if let Ok(mut deserialize) = Deserializer::from_lz_string(lzstr) {
                let mut acft = Aircraft::new();
                acft.deserialize(&mut deserialize)
                    .expect("Err: Failed to Deserialize");
                acft.catalog_json().to_string().as_bytes().to_vec()
            } else {
                "Err: From LZ String Failed".as_bytes().to_vec()
            }
        }
        Err(fail) => format!("Utf8Error valid up to {}", fail.valid_up_to()).into_bytes(),
    }
}
