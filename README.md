# Webmention POC

A very rudimentary implementation of the webmention protocol using
deno.

See [W3C Recommendation](https://www.w3.org/TR/webmention/).

## Development

```sh
deno task dev
```

Do not forget to add a `SECRET` variable to the `.env` file and
calculate they correct key for your hostname.

## Usage

**POST** a webmention request containing source and target as per the
specification.  
Additionally, you need to add the key parameter to the
URLSearchParams.

The key must be equal to the hash of the target's hostname and a
`SECRET` `.env` variable in order to work.

You can use the same key to target multiple pages, as long as they
share the same hostname.

**GET** the number of webmentions per hostname by sending a GET
request with the key parameter.

The key must be equal to the hash of the target's hostname and a
`SECRET` `.env` variable in order to work.

There's an optional second **target** parameter to only get the number
of webmentions for a specific target URL.

