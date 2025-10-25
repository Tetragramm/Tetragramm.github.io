use proc_macro::TokenStream;
use quote::quote;
use std::collections::HashMap;
use syn::{
    Attribute, Data, DeriveInput, Expr, Fields, Ident, Lit, Meta, Token, parse_macro_input,
    punctuated::Punctuated, spanned::Spanned,
};

#[derive(Debug)]
enum UiParam {
    Flag(String),             // Just "source" or "select"
    KeyValue(String, String), // "source" = "types"
}

fn get_attr_value(attrs: &Vec<(Ident, Option<String>)>, name: &str) -> Option<String> {
    let v = attrs.iter().find(|a| a.0 == name);
    if let Some(value) = v {
        value.clone().1
    } else {
        None
    }
}

fn generate_selects(
    selects: &Vec<(&syn::Ident, String, Option<String>, Option<String>)>,
) -> (Vec<proc_macro2::TokenStream>, Vec<proc_macro2::TokenStream>) {
    // Build up the struct fields
    let mut struct_fields = Vec::new();
    let mut impl_fields = Vec::new();

    // Process selects
    for (field_name, source_name, enabled_fn, enabled_opt_fn) in selects {
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
        let enabled_opt_call = if let Some(func) = enabled_opt_fn {
            let enabled_ident = syn::Ident::new(&func, field_name.span());
            // Add to impl
            impl_fields.push(quote! {
                #field_name: Select {
                    enabled: #enabled_call,
                    options: zip(self.#source_ident.iter(), self.#enabled_ident().iter()).enumerate().map(|(i, (item, enab))| {
                        SelectOpt {
                            name: item.name,
                            enabled: enab,
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
                    options: self.#source_ident.iter().enumerate().map(|(i, item)| {
                        SelectOpt {
                            name: item.name,
                            enabled: true,
                        }
                    }).collect(),
                    selected: self.#field_name,
                }
            });
        };
    }
    (struct_fields, impl_fields)
}

fn generate_numbers(
    numbers: &Vec<(&syn::Ident, String, Option<String>)>,
) -> (Vec<proc_macro2::TokenStream>, Vec<proc_macro2::TokenStream>) {
    // Build up the struct fields
    let mut struct_fields = Vec::new();
    let mut impl_fields = Vec::new();

    // Process selects
    for (field_name, name, enabled_fn) in selects {
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
                name: lu!(#name),
                enabled: #enabled_call,
                value: self.#field_name,
            }
        });
    }
    (struct_fields, impl_fields)
}

fn generate_checks(
    checks: &Vec<(&syn::Ident, String, Option<String>)>,
) -> (Vec<proc_macro2::TokenStream>, Vec<proc_macro2::TokenStream>) {
    // Build up the struct fields
    let mut struct_fields = Vec::new();
    let mut impl_fields = Vec::new();

    // Process selects
    for (field_name, name, enabled_fn) in checks {
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
            #field_name: Check {
                name: lu!(#name),
                enabled: #enabled_call,
                selected: self.#field_name,
            }
        });
    }
    (struct_fields, impl_fields)
}

fn generate_number_lists(
    number_lists: &Vec<(&syn::Ident, String, Option<String>, Option<String>)>,
) -> (Vec<proc_macro2::TokenStream>, Vec<proc_macro2::TokenStream>) {
    // Build up the struct fields
    let mut struct_fields = Vec::new();
    let mut impl_fields = Vec::new();

    // Process selects
    for (field_name, source_name, enabled_fn, enabled_opt_fn) in number_lists {
        // Add to struct definition
        struct_fields.push(quote! {
            pub #field_name: Select
        });

        let source_ident = syn::Ident::new(source_name, field_name.span());
        impl_fields.push(quote! {
            #field_name: zip(this.#source_name.iter(), this.#enabled_opt_fn().iter()).map(
                |sname:, enabled|
            )
            #field_name: Number {
                name: lu!(#name),
                enabled: #enabled_call,
                value: self.#field_name,
            }
        });
    }
    (struct_fields, impl_fields)
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
    //(source, select)
    let mut selects: Vec<(&syn::Ident, String, Option<String>, Option<String>)> = Vec::new();
    let mut numbers: Vec<(&syn::Ident, String, Option<String>)> = Vec::new();
    let mut checks: Vec<(&syn::Ident, String, Option<String>)> = Vec::new();
    let mut number_lists: Vec<(&syn::Ident, String, Option<String>)> = Vec::new();
    let mut check_lists: Vec<(&syn::Ident, String, Option<String>)> = Vec::new();

    for field in fields {
        let field_name = field.ident.as_ref().unwrap();
        eprintln!("Found field: {}", field_name);

        if let Some(ui_attr) = find_ui_attribute(&field.attrs) {
            let attrs = parse_ui_attribute(ui_attr).unwrap();
            match attrs[0].0.to_string().as_ref() {
                "select" => {
                    selects.push((
                        field_name,
                        get_attr_value(&attrs, "source").unwrap(),
                        get_attr_value(&attrs, "enabled_fn"),
                        get_attr_value(&attrs, "enabled_opt_fn"),
                    ));
                }
                "number" => {
                    numbers.push((
                        field_name,
                        get_attr_value(&attrs, "name").unwrap(),
                        get_attr_value(&attrs, "enabled_fn"),
                    ));
                }
                "check" => {
                    checks.push((
                        field_name,
                        get_attr_value(&attrs, "name").unwrap(),
                        get_attr_value(&attrs, "enabled_fn"),
                    ));
                }
                "number_list" => {
                    number_lists.push((
                        field_name,
                        get_attr_value(&attrs, "source").unwrap(),
                        get_attr_value(&attrs, "enabled_fn"),
                    ));
                }
                "check_list" => {
                    check_lists.push((
                        field_name,
                        get_attr_value(&attrs, "source").unwrap(),
                        get_attr_value(&attrs, "enabled_fn"),
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

    let (mut sfs, mut ifs) = generate_selects(&selects);
    struct_fields.append(&mut sfs);
    impl_fields.append(&mut ifs);

    let (mut sfs, mut ifs) = generate_numbers(&numbers);
    struct_fields.append(&mut sfs);
    impl_fields.append(&mut ifs);

    let (mut sfs, mut ifs) = generate_checks(&checks);
    struct_fields.append(&mut sfs);
    impl_fields.append(&mut ifs);

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
        }
    };

    TokenStream::from(expanded)
    // TokenStream::new()
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

fn debug_ui_attribute(attr: &Attribute) {
    let parsed = parse_ui_attribute(attr).unwrap();
    eprintln!("Found {} results", parsed.len());
    for (key, value) in parsed {
        match value {
            Some(val) => eprintln!("  {} = \"{}\"", key, val),
            None => eprintln!("  {}", key),
        }
    }
}
// fn has_ui_type(attr: &Attribute, ui_type: &str) -> bool {
//     match &parse_ui_attribute(attr)[0] {
//         UiParam::Flag(name) => name == ui_type,
//         UiParam::KeyValue(_, _) => false,
//     }
// }
