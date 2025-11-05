pub fn transform<'a, T, U>(v: &'a Vec<T>) -> Vec<U>
where
    &'a T: Into<U>,
{
    v.into_iter().map(Into::into).collect()
}
