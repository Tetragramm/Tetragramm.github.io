use wasm_bindgen::prelude::*;

mod aircraft;
mod cockpit;
mod cockpits;
mod disp;
// mod engine;
// mod engines;
mod era;
mod json;
mod localization;
mod part;
mod part_list;
mod passengers;
// mod radiator;
mod serialization;
mod stats;
mod utils;

#[wasm_bindgen]
pub fn update_state(_: &str) -> bool {
    true
}

#[cfg(test)]
mod tests {

    use serde_json::Value;

    use crate::serialization::{Deserializer, Serializer};

    // Note this useful idiom: importing names from outer (for mod tests) scope.
    use super::*;

    #[test]
    fn test_serialize() {
        let manual: Vec<u8> = vec![
            0, 11, 72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 0, 69, 64, 73, 15, 208, 1,
        ];
        let mut s = Serializer::new();
        s.push_string("Hello World").unwrap();
        s.push_num(69).unwrap();
        s.push_float(3.14159).unwrap();
        s.push_bool(true).unwrap();
        let arr = s.into_inner();
        assert_eq!(arr, manual);
        let mut d = Deserializer::new(&arr).unwrap();
        assert_eq!(d.get_string().unwrap(), "Hello World");
        assert_eq!(d.get_num().unwrap(), 69);
        assert_eq!(d.get_float().unwrap(), 3.14159);
        assert_eq!(d.get_bool().unwrap(), true);
        assert_eq!(d.get_remaining(), 0);
    }
}
