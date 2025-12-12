use super::*;

impl Frames {
    /// Get the frame list
    pub fn get_frame_list(&self) -> &Rc<Vec<FrameEntry>> {
        &self.frame_list
    }

    /// Get the skin list
    pub fn get_skin_list(&self) -> &Rc<Vec<SkinEntry>> {
        &self.skin_list
    }

    /// Get the tail list
    pub fn get_tail_list(&self) -> &Rc<Vec<TailEntry>> {
        &self.tail_list
    }

    /// Get the section list (main fuselage)
    pub fn get_section_list(&self) -> &Vec<Section> {
        &self.section_list
    }

    /// Get the tail section list
    pub fn get_tail_section_list(&self) -> &Vec<Section> {
        &self.tail_section_list
    }

    /// Get selected skin index
    pub fn get_skin(&self) -> usize {
        self.sel_skin
    }

    /// Get selected tail type
    pub fn get_tail_type(&self) -> usize {
        self.sel_tail
    }

    /// Check if using farman tail
    pub fn get_use_farman(&self) -> bool {
        self.farman
    }

    /// Check if using boom tail
    pub fn get_use_boom(&self) -> bool {
        self.boom
    }

    /// Check if using flying wing configuration
    pub fn get_flying_wing(&self) -> bool {
        self.flying_wing
    }

    /// Check if aircraft is tailless
    pub fn get_is_tailless(&self) -> bool {
        self.tail_section_list.is_empty()
    }

    /// Check if using farman or boom
    pub fn get_farman_or_boom(&self) -> bool {
        self.farman || self.boom
    }

    /// Check if has tractor nacelles
    pub fn get_has_tractor_nacelles(&self) -> bool {
        self.has_tractor_nacelles
    }

    /// Count non-internal-bracing sections
    pub(super) fn count_sections(&self) -> usize {
        self.section_list.len() - self.internal_bracing_count
    }

    /// Get total number of frames (sections + tail sections)
    pub fn get_num_frames(&self) -> usize {
        self.count_sections() + self.tail_section_list.len()
    }

    /// Count internal bracing sections
    pub(super) fn count_internal_bracing(&self) -> usize {
        self.section_list
            .iter()
            .filter(|s| s.internal_bracing)
            .count()
    }

    /// Determine base frame type (most common)
    pub(super) fn base_type(&self) -> usize {
        let mut hist = vec![0; self.frame_list.len()];

        for sec in &self.section_list {
            if !sec.internal_bracing {
                hist[sec.frame] += 1;
            }
        }

        for sec in &self.tail_section_list {
            if !sec.internal_bracing {
                hist[sec.frame] += 1;
            }
        }

        // Find max, prioritizing later indices (like TypeScript)
        let mut max_index = 0;
        let mut max = 0;
        for (i, &count) in hist.iter().enumerate().rev() {
            if count > max {
                max = count;
                max_index = i;
            }
        }

        max_index
    }

    /// Count main fuselage lifting body sections
    pub(super) fn count_main_lifting_body(&self) -> usize {
        self.section_list.iter().filter(|s| s.lifting_body).count()
    }

    /// Count tail lifting body sections
    pub(super) fn count_tail_lifting_body(&self) -> usize {
        self.tail_section_list
            .iter()
            .filter(|s| s.lifting_body)
            .count()
    }

    /// Count total lifting body sections
    pub(super) fn count_lifting_body(&self) -> usize {
        self.count_main_lifting_body() + self.count_tail_lifting_body()
    }

    /// Check if can use flying wing configuration
    pub fn can_flying_wing(&self) -> bool {
        for s in &self.section_list {
            if s.lifting_body {
                return true;
            }
        }
        for s in &self.tail_section_list {
            if s.lifting_body {
                return true;
            }
        }
        false
    }

    /// Check if internal bracing is possible
    pub fn possible_internal_bracing(&self, convert_sec_to_brace: bool) -> bool {
        let mut allowed = self.count_sections();
        if !self.farman {
            allowed += self.tail_section_list.len();
        }
        if convert_sec_to_brace {
            allowed -= 1;
        }
        self.internal_bracing_count + 1 <= allowed
    }

    /// Check if geodesic is possible for a section
    pub fn possible_geodesic(&self, num: usize) -> bool {
        if num >= self.section_list.len() {
            return false;
        }
        self.frame_list[self.section_list[num].frame].geodesic && !self.section_list[num].monocoque
    }

    /// Check if monocoque is possible for a section
    pub fn possible_monocoque(&self, num: usize) -> bool {
        if num >= self.section_list.len() {
            return false;
        }
        self.skin_list[self.sel_skin].monocoque
            && !self.section_list[num].internal_bracing
            && !self.section_list[num].lifting_body
    }

    /// Check if lifting body is possible for a section
    pub fn possible_lifting_body(&self, num: usize) -> bool {
        if num >= self.section_list.len() {
            return false;
        }
        self.skin_list[self.sel_skin].monocoque
            && !self.section_list[num].internal_bracing
            && !self.section_list[num].monocoque
    }

    /// Check if geodesic is possible for a tail section
    pub fn possible_tail_geodesic(&self, num: usize) -> bool {
        if num >= self.tail_section_list.len() {
            return false;
        }
        self.frame_list[self.tail_section_list[num].frame].geodesic
            && !self.tail_section_list[num].monocoque
    }

    /// Check if monocoque is possible for a tail section
    pub fn possible_tail_monocoque(&self, num: usize) -> bool {
        if num >= self.tail_section_list.len() {
            return false;
        }
        self.skin_list[self.sel_skin].monocoque
            && !self.farman
            && !self.tail_section_list[num].lifting_body
    }

    /// Check if lifting body is possible for a tail section
    pub fn possible_tail_lifting_body(&self, num: usize) -> bool {
        if num >= self.tail_section_list.len() {
            return false;
        }
        self.skin_list[self.sel_skin].monocoque
            && !self.farman
            && !self.tail_section_list[num].monocoque
    }

    /// Check if sections can be removed
    pub fn possible_remove_sections(&self) -> bool {
        self.count_sections() > self.required_sections
    }

    /// Get armor value
    pub fn get_armor(&self) -> i16 {
        if self.skin_list[self.sel_skin].name == "Dragon Skin" {
            5
        } else {
            0
        }
    }

    /// Check if skin is flammable
    pub fn get_is_flammable(&self) -> bool {
        self.skin_list[self.sel_skin].flammable
    }

    /// Check if cutout is possible
    pub fn can_cutout(&self) -> bool {
        let mut vcount =
            self.section_list.len() as f32 * self.skin_list[self.sel_skin].stats.visibility;

        if self.farman {
            vcount += self.tail_section_list.len() as f32;
        } else {
            vcount += self.tail_section_list.len() as f32
                * self.skin_list[self.sel_skin].stats.visibility;
        }

        vcount < 3.0
    }
}
