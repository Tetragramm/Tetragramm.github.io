use wasm_bindgen::prelude::*;
use flyingcircusrust::aircraft::Aircraft;
use flyingcircusrust::serialization::{Deserializer, Serializer};
use flyingcircusrust::types::DerivedStats;
use ui_core::UIBindings;

// Set up panic hook for better error messages in console
#[wasm_bindgen(start)]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}

/// Localization API for managing translations
#[wasm_bindgen]
pub struct Localization;

#[wasm_bindgen]
impl Localization {
    /// Get list of available languages
    #[wasm_bindgen(js_name = getAvailableLanguages)]
    pub fn get_available_languages() -> Vec<String> {
        vec!["en".to_string(), "de".to_string()]
    }

    /// Set the current locale
    #[wasm_bindgen(js_name = setLocale)]
    pub fn set_locale(locale: &str) {
        rust_i18n::set_locale(locale);
    }

    /// Get current locale
    #[wasm_bindgen(js_name = getLocale)]
    pub fn get_locale() -> String {
        rust_i18n::locale().to_string()
    }

    /// Translate a single key
    #[wasm_bindgen(js_name = translate)]
    pub fn translate(key: &str) -> String {
        t!(key).to_string()
    }
}

/// Main Aircraft wrapper for WASM
#[wasm_bindgen]
pub struct AircraftWasm {
    inner: Aircraft,
}

#[wasm_bindgen]
impl AircraftWasm {
    /// Create a new aircraft
    #[wasm_bindgen(constructor)]
    pub fn new() -> Result<AircraftWasm, JsValue> {
        Ok(AircraftWasm {
            inner: Aircraft::new(),
        })
    }

    /// Get aircraft name
    #[wasm_bindgen(js_name = getName)]
    pub fn get_name(&self) -> String {
        self.inner.name.clone()
    }

    /// Set aircraft name
    #[wasm_bindgen(js_name = setName)]
    pub fn set_name(&mut self, name: String) {
        self.inner.name = name;
    }

    /// Get Era UI bindings (includes localized strings)
    #[wasm_bindgen(js_name = getEraBindings)]
    pub fn get_era_bindings(&self) -> JsValue {
        let options = self.inner.era.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Era from UI bindings
    #[wasm_bindgen(js_name = setEraBindings)]
    pub fn set_era_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.era.receive_ui_selections(options);
            self.inner.calculate_stats();
        }
    }

    /// Calculate all aircraft statistics
    #[wasm_bindgen(js_name = calculateStats)]
    pub fn calculate_stats(&mut self) {
        self.inner.calculate_stats();
    }

    /// Get derived stats (performance characteristics)
    #[wasm_bindgen(js_name = getDerivedStats)]
    pub fn get_derived_stats(&self) -> JsValue {
        let stats = self.inner.get_derived_stats();
        serde_wasm_bindgen::to_value(&stats).unwrap()
    }

    /// Get base stats
    #[wasm_bindgen(js_name = getStats)]
    pub fn get_stats(&self) -> JsValue {
        serde_wasm_bindgen::to_value(&self.inner.stats).unwrap()
    }

    /// Serialize aircraft to bytes
    #[wasm_bindgen(js_name = serialize)]
    pub fn serialize(&self) -> Vec<u8> {
        let mut s = Serializer::new();
        self.inner.serialize(&mut s).unwrap();
        s.get_bytes().to_vec()
    }

    /// Deserialize aircraft from bytes
    #[wasm_bindgen(js_name = deserialize)]
    pub fn deserialize(data: &[u8]) -> Result<AircraftWasm, JsValue> {
        let mut d = Deserializer::new(data);
        let mut aircraft = Aircraft::new();
        aircraft
            .deserialize(&mut d)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        Ok(AircraftWasm { inner: aircraft })
    }

    /// Serialize to LZ-compressed string (for URLs)
    #[wasm_bindgen(js_name = serializeToLZString)]
    pub fn serialize_to_lz_string(&self) -> Result<String, JsValue> {
        let mut s = Serializer::new();
        self.inner
            .serialize(&mut s)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        s.compress_to_lz_string()
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))
    }

    /// Deserialize from LZ-compressed string (for URLs)
    #[wasm_bindgen(js_name = deserializeFromLZString)]
    pub fn deserialize_from_lz_string(lz_str: &str) -> Result<AircraftWasm, JsValue> {
        let mut d = Deserializer::from_lz_string(lz_str)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        let mut aircraft = Aircraft::new();
        aircraft
            .deserialize(&mut d)
            .map_err(|e| JsValue::from_str(&format!("{:?}", e)))?;
        Ok(AircraftWasm { inner: aircraft })
    }

    /// Get Cockpits UI bindings (includes localized strings)
    #[wasm_bindgen(js_name = getCockpitsBindings)]
    pub fn get_cockpits_bindings(&self) -> JsValue {
        let options = self.inner.cockpits.create_ui_options();
        serde_wasm_bindgen::to_value(&options).unwrap()
    }

    /// Update Cockpits from UI bindings
    #[wasm_bindgen(js_name = setCockpitsBindings)]
    pub fn set_cockpits_bindings(&mut self, js_options: JsValue) {
        if let Ok(options) = serde_wasm_bindgen::from_value(js_options) {
            self.inner.cockpits.receive_ui_selections(options);
            self.inner.calculate_stats();
        }
    }
}
