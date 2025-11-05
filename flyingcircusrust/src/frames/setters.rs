use super::*;

impl Frames {
    /// Duplicate a section at the given index
    pub fn duplicate_section(&mut self, num: usize, count: usize) {
        if num >= self.section_list.len() {
            return;
        }

        let sec = self.section_list[num].clone();
        for _ in 0..count {
            if sec.internal_bracing {
                if self.count_sections() + self.tail_section_list.len()
                    == self.internal_bracing_count
                {
                    return;
                }
                self.internal_bracing_count += 1;
            }
            self.section_list.insert(num, sec.clone());
        }
    }

    /// Duplicate a tail section at the given index (private)
    fn duplicate_tail_section(&mut self, num: usize, count: usize) {
        if num >= self.tail_section_list.len() {
            return;
        }

        let sec = self.tail_section_list[num].clone();
        for _ in 0..count {
            if sec.internal_bracing
                && self.count_sections() + self.tail_section_list.len()
                    == self.internal_bracing_count
            {
                return;
            }
            self.tail_section_list.insert(num, sec.clone());
        }
    }

    /// Delete a section at the given index
    pub fn delete_section(&mut self, num: usize) {
        if num >= self.section_list.len() {
            return;
        }

        if self.required_sections == self.count_sections()
            && !self.section_list[num].internal_bracing
        {
            return;
        }

        if self.section_list[num].internal_bracing {
            self.internal_bracing_count -= 1;
        }

        self.section_list.remove(num);

        // Remove excess internal bracing if needed
        while self.internal_bracing_count > self.count_sections() + self.tail_section_list.len() {
            if let Some(idx) = self.section_list.iter().rposition(|s| s.internal_bracing) {
                self.internal_bracing_count -= 1;
                self.section_list.remove(idx);
            } else {
                break;
            }
        }
    }

    /// Set the required number of sections
    pub fn set_required_sections(&mut self, num: usize) {
        self.required_sections = num;

        if self.required_sections > self.count_sections() {
            if self.section_list.is_empty() {
                self.section_list.push(Self::default_section());
            }

            let needed = self.required_sections - self.count_sections();
            if needed > 0 {
                // Find last non-internal-bracing section to duplicate
                if let Some(idx) = self.section_list.iter().rposition(|s| !s.internal_bracing) {
                    self.duplicate_section(idx, needed);
                }
            }
        }
    }

    /// Set the required number of tail sections
    pub fn set_required_tail_sections(&mut self, num: usize) {
        if num > self.tail_section_list.len() {
            if self.tail_section_list.is_empty() {
                self.tail_section_list.push(Self::default_section());
            }

            let needed = num - self.tail_section_list.len();
            if needed > 0 {
                let idx = self.tail_section_list.len() - 1;
                self.duplicate_tail_section(idx, needed);
            }
        }

        // Remove excess tail sections
        while num < self.tail_section_list.len() {
            self.tail_section_list.pop();
        }

        // Remove excess internal bracing
        while self.count_sections() + num < self.internal_bracing_count {
            if let Some(idx) = self.section_list.iter().rposition(|s| s.internal_bracing) {
                self.delete_section(idx);
            } else {
                break;
            }
        }
    }

    /// Set the frame type for a section
    pub fn set_frame(&mut self, num: usize, frame_type: usize) {
        if num >= self.section_list.len() || frame_type >= self.frame_list.len() {
            return;
        }

        self.section_list[num].frame = frame_type;
        if !self.frame_list[frame_type].geodesic {
            self.section_list[num].geodesic = false;
        }
    }

    /// Set geodesic for a section
    pub fn set_geodesic(&mut self, num: usize, use_geodesic: bool) {
        if num >= self.section_list.len() {
            return;
        }

        if self.frame_list[self.section_list[num].frame].geodesic {
            self.section_list[num].geodesic = use_geodesic;
        }
    }

    /// Set monocoque for a section
    pub fn set_monocoque(&mut self, num: usize, use_monocoque: bool) {
        if num >= self.section_list.len() {
            return;
        }

        if self.skin_list[self.sel_skin].monocoque {
            self.section_list[num].monocoque = use_monocoque;
        }
    }

    /// Set lifting body for a section
    pub fn set_lifting_body(&mut self, num: usize, use_lifting_body: bool) {
        if num >= self.section_list.len() {
            return;
        }

        if self.skin_list[self.sel_skin].monocoque {
            self.section_list[num].lifting_body = use_lifting_body;
        }
    }

    /// Set internal bracing for a section
    pub fn set_internal_bracing(&mut self, num: usize, use_bracing: bool) {
        if num >= self.section_list.len() {
            return;
        }

        // Setting internal bracing
        if use_bracing
            && !self.section_list[num].internal_bracing
            && self.possible_internal_bracing(true)
            && self.count_sections() > self.required_sections
        {
            self.section_list[num].internal_bracing = true;
            self.section_list[num].monocoque = false;
            self.section_list[num].lifting_body = false;
            self.internal_bracing_count += 1;
        }
        // Unsetting internal bracing
        else if !use_bracing && self.section_list[num].internal_bracing {
            self.section_list[num].internal_bracing = false;
            self.internal_bracing_count -= 1;
        }
    }

    /// Set tail type
    pub fn set_tail_type(&mut self, mut num: usize) {
        if num >= self.tail_list.len() {
            return;
        }

        // Adjust for tandem rotor helicopters
        if self.tail_list[num].stats.reqsections == 0.0 && self.is_tandem {
            num += 1;
            if num >= self.tail_list.len() {
                return;
            }
        }

        self.sel_tail = num;
        self.set_required_tail_sections(self.tail_list[num].stats.reqsections as usize);
    }

    /// Set is tandem rotor helicopter
    pub fn set_is_tandem(&mut self, use_tandem: bool) {
        if self.is_tandem != use_tandem {
            self.is_tandem = use_tandem;
            self.set_tail_type(self.sel_tail);
        }
    }

    /// Set use farman tail
    pub fn set_use_farman(&mut self, use_farman: bool) {
        self.farman = use_farman;
        if use_farman && self.boom {
            self.boom = false;
        }

        if self.farman {
            for sec in &mut self.tail_section_list {
                sec.monocoque = false;
                sec.lifting_body = false;
            }
        }
    }

    /// Set use boom tail
    pub fn set_use_boom(&mut self, use_boom: bool) {
        self.boom = use_boom;
        if use_boom && self.farman {
            self.farman = false;
        }
    }

    /// Set tail frame type
    pub fn set_tail_frame(&mut self, num: usize, frame_type: usize) {
        if num >= self.tail_section_list.len() || frame_type >= self.frame_list.len() {
            return;
        }

        self.tail_section_list[num].frame = frame_type;
        if !self.frame_list[frame_type].geodesic {
            self.tail_section_list[num].geodesic = false;
        }
    }

    /// Set tail geodesic
    pub fn set_tail_geodesic(&mut self, num: usize, use_geodesic: bool) {
        if num >= self.tail_section_list.len() {
            return;
        }

        if self.frame_list[self.tail_section_list[num].frame].geodesic {
            self.tail_section_list[num].geodesic = use_geodesic;
        }
    }

    /// Set tail monocoque
    pub fn set_tail_monocoque(&mut self, num: usize, use_monocoque: bool) {
        if num >= self.tail_section_list.len() {
            return;
        }

        if self.skin_list[self.sel_skin].monocoque && !self.farman {
            self.tail_section_list[num].monocoque = use_monocoque;
        }
    }

    /// Set tail lifting body
    pub fn set_tail_lifting_body(&mut self, num: usize, use_lifting_body: bool) {
        if num >= self.tail_section_list.len() {
            return;
        }

        if self.skin_list[self.sel_skin].monocoque && !self.farman {
            self.tail_section_list[num].lifting_body = use_lifting_body;
        }
    }

    /// Set has tractor nacelles
    pub fn set_has_tractor_nacelles(&mut self, has_nacelles: bool) {
        self.has_tractor_nacelles = has_nacelles;
    }

    /// Set flying wing configuration
    pub fn set_flying_wing(&mut self, use_flying_wing: bool) {
        self.flying_wing = if use_flying_wing && self.can_flying_wing() {
            true
        } else {
            false
        };
    }

    /// Set all frames to the same type
    pub fn set_all_frame(&mut self, frame_type: usize) {
        if frame_type >= self.frame_list.len() {
            return;
        }

        for sec in &mut self.section_list {
            sec.frame = frame_type;
            if !self.frame_list[frame_type].geodesic {
                sec.geodesic = false;
            }
        }

        for sec in &mut self.tail_section_list {
            sec.frame = frame_type;
            if !self.frame_list[frame_type].geodesic {
                sec.geodesic = false;
            }
        }
    }

    /// Set all skin to the same type
    pub fn set_all_skin(&mut self, skin_type: usize) {
        if skin_type >= self.skin_list.len() {
            return;
        }

        self.sel_skin = skin_type;

        for sec in &mut self.section_list {
            if !sec.internal_bracing && !self.skin_list[skin_type].monocoque {
                sec.monocoque = false;
                sec.lifting_body = false;
            }
        }

        for sec in &mut self.tail_section_list {
            if !sec.internal_bracing && !self.skin_list[skin_type].monocoque {
                sec.monocoque = false;
                sec.lifting_body = false;
            }
        }
    }
}
