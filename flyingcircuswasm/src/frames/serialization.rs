use super::*;
use crate::serialization::{Deserializer, Error, Serializable, Serializer};

impl Serializable for Frames {
    fn serialize(&self, s: &mut Serializer) -> Result<(), Error> {
        // Serialize main sections
        s.push_num(self.section_list.len() as i16)?;
        for sec in &self.section_list {
            s.push_num(sec.frame as i16)?;
            s.push_bool(sec.geodesic)?;
            s.push_bool(sec.monocoque)?;
            s.push_bool(sec.lifting_body)?;
            s.push_bool(sec.internal_bracing)?;
        }

        // Serialize tail sections
        s.push_num(self.tail_section_list.len() as i16)?;
        for sec in &self.tail_section_list {
            s.push_num(sec.frame as i16)?;
            s.push_bool(sec.geodesic)?;
            s.push_bool(sec.monocoque)?;
            s.push_bool(sec.lifting_body)?;
            s.push_bool(sec.internal_bracing)?;
        }

        // Serialize configuration
        s.push_num(self.sel_tail as i16)?;
        s.push_bool(self.farman)?;
        s.push_bool(self.boom)?;
        s.push_bool(self.flying_wing)?;
        s.push_num(self.sel_skin as i16)?;

        Ok(())
    }

    fn deserialize(&mut self, d: &mut Deserializer) -> Result<(), Error> {
        // Deserialize main sections
        let slen = d.get_num()? as usize;
        self.section_list.clear();

        for _ in 0..slen {
            let frame = d.get_num()? as usize;

            // Handle old version with skin per-section (version < 10.25)
            if d.version < 10.25 {
                self.sel_skin = d.get_num()? as usize;
            }

            let geodesic = d.get_bool()?;
            let monocoque = d.get_bool()?;
            let mut lifting_body = d.get_bool()?;
            let internal_bracing = d.get_bool()?;

            // Fix incompatible flags
            let monocoque = if monocoque && lifting_body {
                lifting_body = false;
                false
            } else {
                monocoque
            };

            self.section_list.push(Section {
                frame,
                geodesic,
                monocoque,
                lifting_body,
                internal_bracing,
            });
        }

        // Deserialize tail sections
        let tlen = d.get_num()? as usize;
        self.tail_section_list.clear();

        for _ in 0..tlen {
            let frame = d.get_num()? as usize;

            // Handle old version with skin per-section (version < 10.25)
            if d.version < 10.25 {
                self.sel_skin = d.get_num()? as usize;
            }

            let geodesic = d.get_bool()?;
            let monocoque = d.get_bool()?;
            let mut lifting_body = d.get_bool()?;
            let internal_bracing = d.get_bool()?;

            // Fix incompatible flags
            let monocoque = if monocoque && lifting_body {
                lifting_body = false;
                false
            } else {
                monocoque
            };

            self.tail_section_list.push(Section {
                frame,
                geodesic,
                monocoque,
                lifting_body,
                internal_bracing,
            });
        }

        // Deserialize configuration
        self.sel_tail = d.get_num()? as usize;
        self.farman = d.get_bool()?;
        self.boom = d.get_bool()?;
        self.flying_wing = d.get_bool()?;

        // Skin selection (version >= 10.25)
        if d.version > 10.25 {
            self.sel_skin = d.get_num()? as usize;
        }

        // Update internal bracing count
        self.internal_bracing_count = self.count_internal_bracing();

        Ok(())
    }
}
