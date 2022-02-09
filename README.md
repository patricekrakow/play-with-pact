# Let's Play with Pact

## Abstract

This is an attempt to create the **simplest** scenario to describe a _Consumer-Driven Contract Testing_ workflow with _Pact_.

## Prerequisites

This scenario has been developed on Windows.

This scenario is using [`node`](https://nodejs.org/), [`curl`](https://curl.se/) and [`jq`](https://stedolan.github.io/jq/).

This scenario is using [`pact-stub-server`](https://github.com/pact-foundation/pact-stub-server/releases/tag/v0.4.4) and [`pact_verifier_cli`](https://github.com/pact-foundation/pact-reference/releases/tag/pact_verifier_cli-v0.9.7).

## Workflow

1\. The _consumer_ gets (via a developer portal) the OpenAPI (f.k.a. Swagger) document of the "Thingies API", [`thingies-api.oas2.yaml`](./thingies-api.oas2.yaml).

2\. The _consumer_ wants to use the "Thingies API" with her/his own test data, she/he sends:

```text
GET localhost:8001/thingies/123
```

and expects to receive:

```json
{
  "id": "123",
  "name": "stuff"
}
```

3\. The _consumer_ creates a Pact file that follows her/his scenario, [`consumer.pact.json`](./consumer.pact.json).

4\. The _consumer_ start a Pact Stub Server using the `pact-stub-server` command:

```text
pact-stub-server --file consumer.pact.json --port 8000
```

and then run her/his [`consumer.test.cmd`](./consumer.test.cmd) script, which run successfully:

```text
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    27  100    27    0     0     27      0  0:00:01 --:--:--  0:00:01   114
  "name": "stuff"
Passed.
```

5\. Then, the _consumer_ passes her/his Pact file, [`consumer.pact.json`](./consumer.pact.json), to the _provider_ so she/he can verify it.

6\. The _provider_ runs her/his implementation of the "Thingies API", [`app.js`](./app.js):

```text
node provider.app
```

7\. The _provider_ verifies the consumer Pact file, [`consumer.pact.json`](./consumer.pact.json), using the `pact_verifier_cli` command:

```text
pact_verifier_cli --file consumer.pact.json --url http://localhost --port 3000
```

```text
  Given has one thingy with '123' as an thingyId
    WARNING: State Change ignored as there is no state change URL provided
17:47:23 [ERROR] Failed to load pact - Failed to load pact 'http://localhost' - Request failed - error sending request for url (http://localhost/): error trying to connect: tcp connect error: No connection could be made because the target machine actively refused it. (os error 10061)
17:47:23 [WARN]

Please note:
We are tracking events anonymously to gather important usage statistics like Pact version and operating system. To disable tracking, set the 'PACT_DO_NOT_TRACK' environment variable to 'true'.



Verifying a pact between Thingies Consumer Example and Thingies Provider Example

  get one thingy
    returns a response which
      has status code 200 (FAILED)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (FAILED)
      has a matching body (FAILED)


Failures:

1) Verifying a pact between Thingies Consumer Example and Thingies Provider Example Given has one thingy with '123' as an thingyId - get one thingy
    1.1) has a matching body
           expected 'application/json;charset=utf-8' body but was 'text/html;charset=utf-8'
    1.2) has status code 200
           expected 200 but was 404
    1.3) includes header 'Content-Type' with value 'application/json; charset=utf-8'
           Expected header 'Content-Type' to have value 'application/json; charset=utf-8' but was 'text/html; charset=utf-8'
2) Failed to load pact - Failed to load pact 'http://localhost' - Request failed - error sending request for url (http://localhost/): error trying to connect: tcp connect error: No connection could be made because the target machine actively refused it. (os error 10061)


There were 2 pact failures
```

The verification fails as the test data invented by the _consumer_ does not match the test/real data used by the _provider_.

QUESTION: How can I let the `pact_verifier_cli` set the _Provider State_?
ANSWER: Haha, I found the `--state-change-url <state-change-url>` option of the `pact_verifier_cli` command.

(to be continued...)
