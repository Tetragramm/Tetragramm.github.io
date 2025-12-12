use super::Alter;

impl Alter {
    /// Check if all custom parts have zero quantity
    /// TypeScript: IsDefault()
    pub fn is_default(&self) -> bool {
        for part in &self.custom_parts {
            if part.qty > 0 {
                return false;
            }
        }
        true
    }

    /// Get reference to custom parts list
    /// TypeScript: GetParts()
    pub fn get_parts(&self) -> &[super::CustomPart] {
        &self.custom_parts
    }

    /// Check if custom parts list is empty
    pub fn is_empty(&self) -> bool {
        self.custom_parts.is_empty()
    }

    /// Get number of custom parts defined
    pub fn len(&self) -> usize {
        self.custom_parts.len()
    }
}
