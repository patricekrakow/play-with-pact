# How to use the `--provider-state-header-name` option of the `pact-stub-server` in order to select one specific _provider state_ in case multiple matching _interactions_ are found

Let's consider a _pact file_ with the following _interactions_:

```json
[
  {
    "description": "Get an hello message in English.",
    "providerState": "The provider is configured in English.",
    "request": {
      "method": "GET",
      "path": "/hello"
    },
    "response": {
      "status": 200,
      "headers": {
        "Content-Type": "application/json; charset=utf-8"
      },
      "body": {
        "message": "Hello World!"
      }
    }
  },
  {
    "description": "Get an hello message in French.",
    "providerState": "The provider is configured in French.",
    "request": {
      "method": "GET",
      "path": "/hello"
    },
    "response": {
      "status": 200,
      "headers": {
        "Content-Type": "application/json; charset=utf-8"
      },
      "body": {
        "message": "Bonjour le Monde!"
      }
    }
  }
]
```

Let's start a `pact-stub-server` with such a _pact file_:

```text
pact-stub-server --file pact.json --port 3000
```

If we send the API request `GET http://localhost:3000/hello`, the `pact-stub-server` will not be able to make the difference between the two _interactions_, and it will just select the first one that matches:

```text
curl localhost:3000/hello
```

```json
{"message":"Hello World!"}
```

You can verify that it actually select the **first** one by inverting the two _interactions_ in the _pact file_ and restarting the _Pact Stub Server_.

You can also select a particular _interaction_ with the `--provider-state` option of the `pact-stub-server` when starting it:

```text
pact-stub-server --file pact.json --port 3000 --provider-state French
```

Then,

```text
curl localhost:3000/hello
```

will give

```json
{"message":"Bonjour le Monde!"}
```

However, this is not really convenient to re-start the `pact-stub-server` with a different value for the `--provider-state` option each time you want to test a specific _interaction_, having a specific _provider state_. It would be nice if you could communicate the specific  _provider state_ you want when sending the API request. You can actually do that via an HTTP header you can define using the `--provider-state-header-name` option of the `pact-stub-server` when starting it. Let's test it using, for instance, the `X-Provider-State` header:

```text
pact-stub-server --file pact.json --port 3000 --provider-state-header-name X-Provider-State
```

Then,

```text
curl localhost:3000/hello --header: "X-Provider-State: French"
```

will give

```json
{"message":"Bonjour le Monde!"}
```

while

```text
curl localhost:3000/hello --header: "X-Provider-State: English"
```

will give

```text
{"message":"Hello World!"}
```

Yeah!
