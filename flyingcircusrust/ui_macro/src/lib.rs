//! UI Bindings Macro for Flying Circus Plane Builder
//!
//! This procedural macro generates UI binding structs and implementations from annotated Rust structs.
//! It's designed to work with the `ui_core` crate which defines the basic UI types.
//!
//! # Usage
//!
//! ```ignore
//! use ui_core::*;
//! use ui_macro::UIBindings;
//!
//! #[derive(UIBindings)]
//! pub struct Cockpit {
//!     types: Rc<Vec<CockpitType>>,
//!
//!     #[ui(select, source = "types", enabled_fn, enabled_opt_fn = "is_type_enabled")]
//!     selected_type: usize,
//!
//!     #[ui(check_list, source = "upgrades", enabled_fn = "is_upgrade_enabled")]
//!     selected_upgrades: Vec<bool>,
//!
//!     #[ui(number, name = "bombsight", enabled_fn)]
//!     bombsight: i16,
//! }
//! ```
//!
//! # Attribute Types
//!
//! - `select`: Creates a dropdown/select control
//!   - `source`: Field name containing the list of options
//!   - `enabled_fn`: Optional function name to check if the select is enabled (defaults to `is_{field}_enabled`)
//!   - `enabled_opt_fn`: Optional function name to check per-option enablement (defaults to `is_{field}_option_enabled`)
//!   - `set_fn`: Optional setter function name (e.g., `set_fn = "set_type"`) - called when value changes
//!
//! - `number`: Creates a number input control
//!   - `name`: Display name for the control (localization key)
//!   - `enabled_fn`: Optional function name to check if enabled
//!   - `set_fn`: Optional setter function name - called when value changes
//!
//! - `check`: Creates a checkbox control
//!   - `name`: Display name for the control (localization key)
//!   - `enabled_fn`: Optional function name to check if enabled
//!   - `set_fn`: Optional setter function name - called when value changes
//!
//! - `number_list`: Creates a list of number inputs
//!   - `source`: Field name containing the source list
//!   - `enabled_fn`: Optional function name returning Vec<bool> for per-item enablement
//!   - `set_fn`: Optional setter function name taking `(index: usize, value: i16)` - called when any item changes
//!
//! - `check_list`: Creates a list of checkboxes
//!   - `source`: Field name containing the source list
//!   - `enabled_fn`: Optional function name returning Vec<bool> for per-item enablement
//!   - `set_fn`: Optional setter function name taking `(index: usize, value: bool)` - called when any item changes
//!
//! # Generated Code
//!
//! The macro generates:
//! - A struct named `{StructName}Options` with fields for each UI control
//! - An implementation of `UIBindings` trait with:
//!   - `create_ui_options()` method - creates options from current state
//!   - `receive_ui_selections()` method - updates state from UI selections
//!
//! For the example above, it generates:
//! ```ignore
//! pub struct CockpitOptions {
//!     pub selected_type: Select,
//!     pub selected_upgrades: Vec<Check>,
//!     pub bombsight: Number,
//! }
//!
//! impl UIBindings for Cockpit {
//!     type OptionsType = CockpitOptions;
//!     fn create_ui_options(&self) -> CockpitOptions { /* ... */ }
//!     fn receive_ui_selections(&mut self, options: CockpitOptions) { /* ... */ }
//! }
//! ```
//!
//! # Setter Functions
//!
//! When `set_fn` is specified, the generated `receive_ui_selections` will call the setter
//! function instead of directly modifying the field. This allows for validation and side effects.
//!
//! - For scalar fields (`number`, `check`, `select`): setter takes the new value
//! - For list fields (`number_list`, `check_list`): setter takes `(index, value)`
//!
//! If `set_fn` is not specified, the field is directly updated with the new value.

use proc_macro::TokenStream;
use quote::quote;
use syn::{
    parse_macro_input, punctuated::Punctuated, spanned::Spanned, Attribute, Data, DeriveInput,
    Expr, Fields, Ident, Lit, Meta, Token,
};

fn get_attr_value(attrs: &Vec<(Ident, Option<String>)>, name: &str) -> Option<String> {
    let v = attrs.iter().find(|a| a.0 == name);
    if let Some(value) = v {
        value.clone().1
    } else {
        None
    }
}

fn has_attr_flag(attrs: &Vec<(Ident, Option<String>)>, name: &str) -> bool {
    attrs.iter().any(|a| a.0 == name)
}

fn get_enabled_fn(attrs: &Vec<(Ident, Option<String>)>, field_name: &str) -> Option<String> {
    if !has_attr_flag(attrs, "enabled_fn") {
        return None;
    }

    if let Some(value) = get_attr_value(attrs, "enabled_fn") {
        Some(value)
    } else {
        // Default: is_{field_name}_enabled
        Some(format!("is_{}_enabled", field_name))
    }
}

fn get_enabled_opt_fn(attrs: &Vec<(Ident, Option<String>)>, field_name: &str) -> Option<String> {
    if !has_attr_flag(attrs, "enabled_opt_fn") {
        return None;
    }

    if let Some(value) = get_attr_value(attrs, "enabled_opt_fn") {
        Some(value)
    } else {
        // Default: is_{field_name}_option_enabled
        Some(format!("is_{}_option_enabled", field_name))
    }
}

fn get_set_fn(attrs: &Vec<(Ident, Option<String>)>) -> Option<String> {
    get_attr_value(attrs, "set_fn")
}

fn generate_selects(
    selects: &Vec<(
        &syn::Ident,
        String,
        Option<String>,
        Option<String>,
        Option<String>,
    )>,
) -> (
    Vec<proc_macro2::TokenStream>,
    Vec<proc_macro2::TokenStream>,
    Vec<proc_macro2::TokenStream>,
) {
    // Build up the struct fields
    let mut struct_fields = Vec::new();
    let mut impl_fields = Vec::new();
    let mut receive_fields = Vec::new();

    // Process selects
    for (field_name, source_name, enabled_fn, enabled_opt_fn, set_fn) in selects {
        // Add to struct definition
        struct_fields.push(quote! {
            pub #field_name: Select
        });

        let source_ident = syn::Ident::new(source_name, field_name.span());
        let enabled_call = if let Some(func) = enabled_fn {
            let enabled_ident = syn::Ident::new(func, field_name.span());
            quote! { self.#enabled_ident() }
        } else {
            quote! { true }
        };
        if let Some(func) = enabled_opt_fn {
            let enabled_ident = syn::Ident::new(&func, field_name.span());
            // Add to impl
            impl_fields.push(quote! {
                #field_name: Select {
                    enabled: #enabled_call,
                    options: zip(self.#source_ident.iter(), self.#enabled_ident().iter()).map(|(item, enab)| {
                        SelectOpt {
                            name: item.name.clone(),
                            enabled: *enab,
                        }
                    }).collect(),
                    selected: self.#field_name,
                }
            });
        } else {
            // Add to impl
            impl_fields.push(quote! {
                #field_name: Select {
                    enabled: #enabled_call,
                    options: self.#source_ident.iter().map(|item| {
                        SelectOpt {
                            name: item.name.clone(),
                            enabled: true,
                        }
                    }).collect(),
                    selected: self.#field_name,
                }
            });
        };

        // Generate receive_ui_selections code
        if let Some(func) = set_fn {
            let set_ident = syn::Ident::new(&func, field_name.span());
            receive_fields.push(quote! {
                if self.#field_name != options.#field_name.selected {
                    self.#set_ident(options.#field_name.selected);
                }
            });
        } else {
            receive_fields.push(quote! {
                self.#field_name = options.#field_name.selected;
            });
        }
    }
    (struct_fields, impl_fields, receive_fields)
}

fn generate_numbers(
    numbers: &Vec<(&syn::Ident, String, Option<String>, Option<String>)>,
) -> (
    Vec<proc_macro2::TokenStream>,
    Vec<proc_macro2::TokenStream>,
    Vec<proc_macro2::TokenStream>,
) {
    // Build up the struct fields
    let mut struct_fields = Vec::new();
    let mut impl_fields = Vec::new();
    let mut receive_fields = Vec::new();

    // Process numbers
    for (field_name, name, enabled_fn, set_fn) in numbers {
        // Add to struct definition
        struct_fields.push(quote! {
            pub #field_name: Number
        });

        let enabled_call = if let Some(func) = enabled_fn {
            let enabled_ident = syn::Ident::new(func, field_name.span());
            quote! { self.#enabled_ident() }
        } else {
            quote! { true }
        };
        // Add to impl
        impl_fields.push(quote! {
            #field_name: Number {
                name: t!(#name).to_string(),
                enabled: #enabled_call,
                value: self.#field_name,
            }
        });

        // Generate receive_ui_selections code
        if let Some(func) = set_fn {
            let set_ident = syn::Ident::new(&func, field_name.span());
            receive_fields.push(quote! {
                if self.#field_name != options.#field_name.value {
                    self.#set_ident(options.#field_name.value);
                }
            });
        } else {
            receive_fields.push(quote! {
                self.#field_name = options.#field_name.value;
            });
        }
    }
    (struct_fields, impl_fields, receive_fields)
}

fn generate_checks(
    checks: &Vec<(&syn::Ident, String, Option<String>, Option<String>)>,
) -> (
    Vec<proc_macro2::TokenStream>,
    Vec<proc_macro2::TokenStream>,
    Vec<proc_macro2::TokenStream>,
) {
    // Build up the struct fields
    let mut struct_fields = Vec::new();
    let mut impl_fields = Vec::new();
    let mut receive_fields = Vec::new();

    // Process checks
    for (field_name, name, enabled_fn, set_fn) in checks {
        // Add to struct definition
        struct_fields.push(quote! {
            pub #field_name: Check
        });

        let enabled_call = if let Some(func) = enabled_fn {
            let enabled_ident = syn::Ident::new(func, field_name.span());
            quote! { self.#enabled_ident() }
        } else {
            quote! { true }
        };
        // Add to impl
        impl_fields.push(quote! {
            #field_name: Check {
                name: t!(#name).to_string(),
                enabled: #enabled_call,
                selected: self.#field_name,
            }
        });

        // Generate receive_ui_selections code
        if let Some(func) = set_fn {
            let set_ident = syn::Ident::new(&func, field_name.span());
            receive_fields.push(quote! {
                if self.#field_name != options.#field_name.selected {
                    self.#set_ident(options.#field_name.selected);
                }
            });
        } else {
            receive_fields.push(quote! {
                self.#field_name = options.#field_name.selected;
            });
        }
    }
    (struct_fields, impl_fields, receive_fields)
}

fn generate_number_lists(
    number_lists: &Vec<(&syn::Ident, String, Option<String>, Option<String>)>,
) -> (
    Vec<proc_macro2::TokenStream>,
    Vec<proc_macro2::TokenStream>,
    Vec<proc_macro2::TokenStream>,
) {
    // Build up the struct fields
    let mut struct_fields = Vec::new();
    let mut impl_fields = Vec::new();
    let mut receive_fields = Vec::new();

    // Process number lists
    for (field_name, source_name, enabled_fn, set_fn) in number_lists {
        // Add to struct definition
        struct_fields.push(quote! {
            pub #field_name: Vec<Number>
        });

        let source_ident = syn::Ident::new(source_name, field_name.span());

        // Add to impl
        if let Some(func) = enabled_fn {
            let enabled_ident = syn::Ident::new(func, field_name.span());
            impl_fields.push(quote! {
                #field_name: zip(
                    zip(self.#source_ident.iter(), self.#field_name.iter()),
                    self.#enabled_ident().iter()
                ).map(|((item, value), enabled)| Number {
                    name: item.name.clone(),
                    enabled: *enabled,
                    value: *value,
                })
                .collect()
            });
        } else {
            impl_fields.push(quote! {
                #field_name: zip(self.#source_ident.iter(), self.#field_name.iter())
                    .map(|(item, value)| Number {
                        name: item.name.clone(),
                        enabled: true,
                        value: *value,
                    })
                    .collect()
            });
        }

        // Generate receive_ui_selections code
        if let Some(func) = set_fn {
            let set_ident = syn::Ident::new(&func, field_name.span());
            receive_fields.push(quote! {
                for (i, (old_val, new_val)) in zip(self.#field_name.iter(), options.#field_name.iter().map(|n| n.value)).enumerate() {
                    if *old_val != new_val {
                        self.#set_ident(i, new_val);
                    }
                }
            });
        } else {
            receive_fields.push(quote! {
                for (old_val, new_val) in zip(self.#field_name.iter_mut(), options.#field_name.iter().map(|n| n.value)) {
                    *old_val = new_val;
                }
            });
        }
    }
    (struct_fields, impl_fields, receive_fields)
}

fn generate_check_lists(
    check_lists: &Vec<(&syn::Ident, String, Option<String>, Option<String>)>,
) -> (
    Vec<proc_macro2::TokenStream>,
    Vec<proc_macro2::TokenStream>,
    Vec<proc_macro2::TokenStream>,
) {
    // Build up the struct fields
    let mut struct_fields = Vec::new();
    let mut impl_fields = Vec::new();
    let mut receive_fields = Vec::new();

    // Process check lists
    for (field_name, source_name, enabled_fn, set_fn) in check_lists {
        // Add to struct definition
        struct_fields.push(quote! {
            pub #field_name: Vec<Check>
        });

        let source_ident = syn::Ident::new(source_name, field_name.span());

        // Add to impl
        if let Some(func) = enabled_fn {
            let enabled_ident = syn::Ident::new(func, field_name.span());
            impl_fields.push(quote! {
                #field_name: zip(
                    zip(self.#source_ident.iter(), self.#field_name.iter()),
                    self.#enabled_ident().iter()
                ).map(|((item, selected), enabled)| Check {
                    name: item.name.clone(),
                    enabled: *enabled,
                    selected: *selected,
                })
                .collect()
            });
        } else {
            impl_fields.push(quote! {
                #field_name: zip(self.#source_ident.iter(), self.#field_name.iter())
                    .map(|(item, selected)| Check {
                        name: item.name.clone(),
                        enabled: true,
                        selected: *selected,
                    })
                    .collect()
            });
        }

        // Generate receive_ui_selections code
        if let Some(func) = set_fn {
            let set_ident = syn::Ident::new(&func, field_name.span());
            receive_fields.push(quote! {
                for (i, (old_val, new_val)) in zip(self.#field_name.iter(), options.#field_name.iter().map(|c| c.selected)).enumerate() {
                    if *old_val != new_val {
                        self.#set_ident(i, new_val);
                    }
                }
            });
        } else {
            receive_fields.push(quote! {
                for (old_val, new_val) in zip(self.#field_name.iter_mut(), options.#field_name.iter().map(|c| c.selected)) {
                    *old_val = new_val;
                }
            });
        }
    }
    (struct_fields, impl_fields, receive_fields)
}

#[proc_macro_derive(UIBindings, attributes(ui))]
pub fn ui_bindings_derive(input: TokenStream) -> TokenStream {
    let input = parse_macro_input!(input as DeriveInput);
    let struct_name = &input.ident;

    let fields = match &input.data {
        Data::Struct(data_struct) => match &data_struct.fields {
            Fields::Named(fields) => &fields.named,
            _ => panic!("UIBindings only works on structs with named fields"),
        },
        _ => panic!("UIBindings only works on structs"),
    };

    // Find the source and selection fields
    //(field_name, source, enabled_fn, enabled_opt_fn, set_fn)
    let mut selects: Vec<(
        &syn::Ident,
        String,
        Option<String>,
        Option<String>,
        Option<String>,
    )> = Vec::new();
    //(field_name, name, enabled_fn, set_fn)
    let mut numbers: Vec<(&syn::Ident, String, Option<String>, Option<String>)> = Vec::new();
    let mut checks: Vec<(&syn::Ident, String, Option<String>, Option<String>)> = Vec::new();
    let mut number_lists: Vec<(&syn::Ident, String, Option<String>, Option<String>)> = Vec::new();
    let mut check_lists: Vec<(&syn::Ident, String, Option<String>, Option<String>)> = Vec::new();

    for field in fields {
        let field_name = field.ident.as_ref().unwrap();

        if let Some(ui_attr) = find_ui_attribute(&field.attrs) {
            let attrs = parse_ui_attribute(ui_attr).unwrap();
            let field_name_str = field_name.to_string();
            match attrs[0].0.to_string().as_ref() {
                "select" => {
                    selects.push((
                        field_name,
                        get_attr_value(&attrs, "source").unwrap(),
                        get_enabled_fn(&attrs, &field_name_str),
                        get_enabled_opt_fn(&attrs, &field_name_str),
                        get_set_fn(&attrs),
                    ));
                }
                "number" => {
                    numbers.push((
                        field_name,
                        get_attr_value(&attrs, "name").unwrap(),
                        get_enabled_fn(&attrs, &field_name_str),
                        get_set_fn(&attrs),
                    ));
                }
                "check" => {
                    checks.push((
                        field_name,
                        get_attr_value(&attrs, "name").unwrap(),
                        get_enabled_fn(&attrs, &field_name_str),
                        get_set_fn(&attrs),
                    ));
                }
                "number_list" => {
                    number_lists.push((
                        field_name,
                        get_attr_value(&attrs, "source").unwrap(),
                        get_enabled_fn(&attrs, &field_name_str),
                        get_set_fn(&attrs),
                    ));
                }
                "check_list" => {
                    check_lists.push((
                        field_name,
                        get_attr_value(&attrs, "source").unwrap(),
                        get_enabled_fn(&attrs, &field_name_str),
                        get_set_fn(&attrs),
                    ));
                }
                _ => {}
            }
        }
    }

    // Generate the options struct name
    let options_struct_name = format!("{}Options", struct_name);
    let options_struct_ident = syn::Ident::new(&options_struct_name, struct_name.span());

    // Build up the struct fields
    let mut struct_fields: Vec<proc_macro2::TokenStream> = Vec::new();
    let mut impl_fields: Vec<proc_macro2::TokenStream> = Vec::new();
    let mut receive_fields: Vec<proc_macro2::TokenStream> = Vec::new();

    let (mut sfs, mut ifs, mut rfs) = generate_selects(&selects);
    struct_fields.append(&mut sfs);
    impl_fields.append(&mut ifs);
    receive_fields.append(&mut rfs);

    let (mut sfs, mut ifs, mut rfs) = generate_numbers(&numbers);
    struct_fields.append(&mut sfs);
    impl_fields.append(&mut ifs);
    receive_fields.append(&mut rfs);

    let (mut sfs, mut ifs, mut rfs) = generate_checks(&checks);
    struct_fields.append(&mut sfs);
    impl_fields.append(&mut ifs);
    receive_fields.append(&mut rfs);

    let (mut sfs, mut ifs, mut rfs) = generate_number_lists(&number_lists);
    struct_fields.append(&mut sfs);
    impl_fields.append(&mut ifs);
    receive_fields.append(&mut rfs);

    let (mut sfs, mut ifs, mut rfs) = generate_check_lists(&check_lists);
    struct_fields.append(&mut sfs);
    impl_fields.append(&mut ifs);
    receive_fields.append(&mut rfs);

    // Generate the final code
    let expanded = quote! {
        pub struct #options_struct_ident {
            #(#struct_fields,)*
        }

        impl UIBindings for #struct_name {
            type OptionsType = #options_struct_ident;

            fn create_ui_options(&self) -> #options_struct_ident {
                #options_struct_ident {
                    #(#impl_fields,)*
                }
            }

            fn receive_ui_selections(&mut self, options: #options_struct_ident) {
                use std::iter::zip;
                #(#receive_fields)*
            }
        }
    };

    TokenStream::from(expanded)
}

/// Parses a `#[ui(...)]` attribute and extracts the arguments.
///
/// # Arguments
///
/// * `attr` - A reference to the `syn::Attribute` to parse.
///
/// # Returns
///
/// A `syn::Result` containing a vector of key-value pairs.
/// For `#[ui(key1, key2 = "value2")]`, the result would be:
/// `Ok(vec![("key1".to_string(), None), ("key2".to_string(), Some("value2".to_string()))])`
fn parse_ui_attribute(attr: &syn::Attribute) -> syn::Result<Vec<(Ident, Option<String>)>> {
    if !attr.path().is_ident("ui") {
        // Not a `#[ui(...)]` attribute, so we can ignore it.
        // Depending on your use case, you might want to return an empty Vec
        // or an error if the attribute is unknown.
        return Ok(Vec::new());
    }

    let nested = attr.parse_args_with(Punctuated::<Meta, Token![,]>::parse_terminated)?;

    let mut result: Vec<(Ident, Option<String>)> = Vec::new();

    for meta in nested {
        match meta {
            // This handles `key` style arguments, e.g., `select`
            Meta::Path(path) => {
                if let Some(ident) = path.get_ident() {
                    result.push((ident.clone(), None));
                } else {
                    return Err(syn::Error::new(path.span(), "Expected an identifier"));
                }
            }
            // This handles `key = "value"` style arguments, e.g., `source = "types"`
            Meta::NameValue(mnv) => {
                if let Some(ident) = mnv.path.get_ident() {
                    if let Expr::Lit(lit) = &mnv.value
                        && let Lit::Str(lit_str) = &lit.lit
                    {
                        result.push((ident.clone(), Some(lit_str.value())));
                    } else {
                        return Err(syn::Error::new(
                            mnv.value.span(),
                            "Expected a string literal",
                        ));
                    }
                } else {
                    return Err(syn::Error::new(mnv.path.span(), "Expected an identifier"));
                }
            }
            // Other forms like `#[ui(key(...))]` or `#[ui("literal")]` can be handled here
            // but are considered errors for this specific case.
            _ => {
                return Err(syn::Error::new(meta.span(), "Unsupported attribute format"));
            }
        }
    }

    Ok(result)
}

// Helper functions
fn find_ui_attribute(attrs: &[Attribute]) -> Option<&Attribute> {
    attrs.iter().find(|attr| attr.path().is_ident("ui"))
}
