use super::*;
use crate::json::*;
use crate::serialization::JSSerializable;
use serde_json::Map;

impl JSSerializable for Section {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        self.frame = jsnum(js, "frame") as usize;
        self.geodesic = jsbool(js, "geodesic");
        self.monocoque = jsbool(js, "monocoque");
        self.lifting_body = jsbool(js, "lifting_body");
        self.internal_bracing = jsbool(js, "internal_bracing");

        // Handle old version compatibility and fix incompatible flags
        if self.monocoque && self.lifting_body {
            self.monocoque = false;
        }
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();
        map.insert("frame".to_string(), (self.frame as i64).into());
        map.insert("geodesic".to_string(), self.geodesic.into());
        map.insert("monocoque".to_string(), self.monocoque.into());
        map.insert("lifting_body".to_string(), self.lifting_body.into());
        map.insert("internal_bracing".to_string(), self.internal_bracing.into());
        serde_json::Value::Object(map)
    }
}

impl JSSerializable for Frames {
    fn from_json(&mut self, js: &serde_json::Value, json_version: f64) {
        // Deserialize main sections
        self.section_list.clear();
        if let Some(sections) = jsarr_opt(js, "sections") {
            for sec_js in sections {
                let mut sec = Section {
                    frame: jsnum(sec_js, "frame") as usize,
                    geodesic: jsbool(sec_js, "geodesic"),
                    monocoque: jsbool(sec_js, "monocoque"),
                    lifting_body: jsbool(sec_js, "lifting_body"),
                    internal_bracing: jsbool(sec_js, "internal_bracing"),
                };

                // Fix incompatible flags
                if sec.monocoque && sec.lifting_body {
                    sec.monocoque = false;
                }

                self.section_list.push(sec);

                // Handle old version with skin per-section (version < 10.25)
                if json_version < 10.25 {
                    self.sel_skin = jsnum(sec_js, "skin") as usize;
                }
            }
        }

        // Deserialize tail sections
        self.tail_section_list.clear();
        if let Some(tail_sections) = jsarr_opt(js, "tail_sections") {
            for sec_js in tail_sections {
                let mut sec = Section {
                    frame: jsnum(sec_js, "frame") as usize,
                    geodesic: jsbool(sec_js, "geodesic"),
                    monocoque: jsbool(sec_js, "monocoque"),
                    lifting_body: jsbool(sec_js, "lifting_body"),
                    internal_bracing: jsbool(sec_js, "internal_bracing"),
                };

                // Fix incompatible flags
                if sec.monocoque && sec.lifting_body {
                    sec.monocoque = false;
                }

                self.tail_section_list.push(sec);

                // Handle old version with skin per-section (version < 10.25)
                if json_version < 10.25 {
                    self.sel_skin = jsnum(sec_js, "skin") as usize;
                }
            }
        }

        // Deserialize configuration
        self.farman = jsbool(js, "use_farman");
        self.boom = jsbool(js, "use_boom");
        self.sel_tail = jsnum(js, "tail_index") as usize;
        self.flying_wing = jsbool(js, "flying_wing");

        // Skin selection (version >= 10.25)
        if json_version > 10.25 {
            self.sel_skin = jsnum(js, "sel_skin") as usize;
        }

        // Update internal bracing count
        self.internal_bracing_count = self.count_internal_bracing();
    }

    fn to_json(&self) -> serde_json::Value {
        let mut map = Map::new();

        // Serialize sections
        let sections: Vec<serde_json::Value> =
            self.section_list.iter().map(|s| s.to_json()).collect();
        map.insert("sections".to_string(), serde_json::Value::Array(sections));

        // Serialize tail sections
        let tail_sections: Vec<serde_json::Value> =
            self.tail_section_list.iter().map(|s| s.to_json()).collect();
        map.insert(
            "tail_sections".to_string(),
            serde_json::Value::Array(tail_sections),
        );

        // Serialize configuration
        map.insert("tail_index".to_string(), (self.sel_tail as i64).into());
        map.insert("use_farman".to_string(), self.farman.into());
        map.insert("use_boom".to_string(), self.boom.into());
        map.insert("flying_wing".to_string(), self.flying_wing.into());
        map.insert("sel_skin".to_string(), (self.sel_skin as i64).into());

        serde_json::Value::Object(map)
    }
}
