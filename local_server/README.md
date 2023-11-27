# Local Document Server

- [ ] Watch local directory for document changes
- [ ] Embedding the document, code
    - [ ] Markdown Documentation Splitter
    - [ ] Office, like Word Document Splitter
    - [ ] Code Splitter: TreeSitter
- [ ] Web Scrapper
    - [ ] Extract text from web page,
      like: [scraper](https://github.com/BloopAI/bloop/tree/main/server/bleep/src/scraper)
- [ ] Document version control
- [ ] Vector Search
    - [FANN: Vector Search in 200 Lines of Rust](https://fennel.ai/blog/vector-search-in-200-lines-of-rust/)
    - [tinyvector](https://github.com/m1guelpf/tinyvector)
- [ ] Search document by semantic

## HTTP API design

### Embedding Document/Code CRUD

CREATE: `POST /api/embedding-document`

```json
{
  "name": "README.md",
  "uri": "file:///path/to/README.md",
  "type": "markdown",
  "content": "..."
}
```

READ: `GET /api/embedding-document/:id`

```json
{
  "id": "xxx-xxxx-xxx",
  "uri": "http://localhost:8080/api/embedding-document/xxx-xxxx-xxx",
  "name": "README.md",
  "content": "...",
  "type": "markdown",
  "chunks": [
    {
      "id": "xxx-xxxx-xxx",
      "text": "...",
      "embedding": "..."
    },
    {
      "id": "xxx-xxxx-xxx",
      "text": "...",
      "embedding": "..."
    }
  ]
}
```

SEARCH: `GET /api/embedding-document/search?q=...`

```json
{
  "results": [
    {
      "id": "xxx-xxxx-xxx",
      "name": "README.md",
      "uri": "http://localhost:8080/api/embedding-document/xxx-xxxx-xxx",
      "content": "...",
      "type": "markdown",
      "chunks": [
        {
          "id": "xxx-xxxx-xxx",
          "text": "...",
          "embedding": "..."
        },
        {
          "id": "xxx-xxxx-xxx",
          "text": "...",
          "embedding": "..."
        }
      ]
    }
  ]
}
```

UPDATE: `PUT /api/embedding-document/:id`

```json
{
  "name": "README.md",
  "uri": "file:///path/to/README.md",
  "content": "..."
}
```

DELETE: `DELETE /api/embedding-document/:id`

### Web Scrapper

CREATE: `POST /api/web-scrapper`

```json
{
  "url": "https://www.example.com"
}
```

returns `embedding-document` object

DELETE: `DELETE /api/web-scrapper/:id`

REFRESH: `POST /api/web-scrapper/:id/refresh`
