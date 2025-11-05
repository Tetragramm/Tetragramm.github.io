pub fn jsnum(js: &serde_json::Value, key: &str) -> f32 {
    if let Some(v) = js.get(key) {
        v.as_f64().unwrap() as f32
    } else {
        0.0
    }
}

pub fn jsobj<'a>(js: &'a serde_json::Value, key: &str) -> &'a serde_json::Value {
    js.get(key).unwrap()
}

pub fn jsarr<'a>(js: &'a serde_json::Value, key: &str) -> &'a Vec<serde_json::Value> {
    js.get(key).unwrap().as_array().unwrap()
}

pub fn jsarr_opt<'a>(js: &'a serde_json::Value, key: &str) -> Option<&'a Vec<serde_json::Value>> {
    js.get(key).and_then(|v| v.as_array())
}

pub fn vstr(js: &serde_json::Value) -> String {
    js.as_str().unwrap().to_owned()
}

pub fn jsstr(js: &serde_json::Value, key: &str) -> String {
    vstr(js.get(key).unwrap())
}

pub fn jsbool(js: &serde_json::Value, key: &str) -> bool {
    js.get(key).unwrap().as_bool().unwrap()
}

pub fn jsboolarr(js: &serde_json::Value, key: &str) -> Vec<bool> {
    jsarr(js, key)
        .iter()
        .map(|v| v.as_bool().unwrap())
        .collect()
}
