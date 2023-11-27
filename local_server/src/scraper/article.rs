use std::borrow::Cow;
use std::time::Duration;

use anyhow::Result;
use reqwest::IntoUrl;
use select::document::Document;
use url::Url;

#[derive(Debug)]
pub struct Article {
    pub url: Url,
    pub doc: Document,
    pub content: ArticleContent<'static>,
    pub language: &'static str,
}

impl Article {
    pub fn builder<T: IntoUrl>(url: T) -> Result<ArticleBuilder> {
        ArticleBuilder::new(url)
    }
}


#[derive(Debug, Clone)]
pub struct ArticleContent<'a> {
    pub title: Option<Cow<'a, str>>,
    pub icon: Option<Cow<'a, str>>,
    pub language: Option<str>,
    pub description: Option<Cow<'a, str>>,
    pub text: Option<Cow<'a, str>>,
}

pub struct ArticleBuilder {
    url: Option<Url>,
    timeout: Option<Duration>,
    language: Option<String>,
    browser_user_agent: Option<String>,
}

impl ArticleBuilder {
    fn new<T: IntoUrl>(url: T) -> Result<Self> {
        let url = url.into_url()?;

        Ok(ArticleBuilder {
            url: Some(url),
            timeout: None,
            language: None,
            browser_user_agent: None,
        })
    }
}
