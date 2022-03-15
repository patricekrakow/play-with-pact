# Let's Play with Pact

## Abstract

This is an attempt to create the **simplest** demo to describe _Consumer-Driven Contract Testing with Pact_.

[Pact](https://docs.pact.io/) introduces a (new) way to test the interactions (over the network) between different components **without** the need to run these components together within the same (shared) environment! In other words, it's an alternative to _end-to-end testing_, which is called _consumer-driven contract testing_.

In addition to that, it unambiguously addresses the problematic of **test data**. I do think that (traditional) tools that are supposed to help performing end-to-end testing, such as _[service virtualization](https://en.wikipedia.org/wiki/Service_virtualization)_, leave the question of test data - or more precisely the question of how to set the right test data at the right moment in order to correctly perform the testing of a specific interaction -  as "the elephant in the room".

Pact addresses the problematic of **test data** with the key notion of _**Provider State**_. I do see this notion of _Provider State_ as the cornerstone of Pact! But, first, with Pact, you have to understand that one (and only one) interaction - a single request-response pair - is tested at a time, independently. You never (ever) test any sequences of interactions! That means that for each interaction you have to define precisely in which _**state**_ the provider is, and that's what is called the _**Provider State**_.

[To be continued...]

## Prerequisites

This scenario has been developed on Windows.

This scenario is using [`node`](https://nodejs.org/), [`curl`](https://curl.se/) and [`jq`](https://stedolan.github.io/jq/).

This scenario is also using [`pact-stub-server`](https://github.com/pact-foundation/pact-stub-server/releases/tag/v0.4.4) and [`pact_verifier_cli`](https://github.com/pact-foundation/pact-reference/releases/tag/pact_verifier_cli-v0.9.7).

### Node.js

```text
node --version
```

```text
v16.13.2
```

### cURL

```text
curl --version
```

```text
curl 7.79.1 (Windows) libcurl/7.79.1 Schannel
Release-Date: 2021-09-22
Protocols: dict file ftp ftps http https imap imaps pop3 pop3s smtp smtps telnet tftp
Features: AsynchDNS HSTS IPv6 Kerberos Largefile NTLM SPNEGO SSL SSPI UnixSockets
```

### jq

```text
jq --version
```

```text
jq-1.6
```

### Standalone Pact Stub Server

```text
pact-stub-server --version
```

```text
pact-stub-server v0.4.4
pact stub server version  : v0.4.4
pact specification version: v3.0.0
```

### Pact Verifier CLI

```text
pact_verifier_cli --version
```

```text
pact_verifier_cli 0.9.7
pact verifier version   : v0.9.7
pact specification      : v4.0
models version          : v0.2.7
```

## Workflow

1\. The _consumer_ gets (typically via a developer portal) the OpenAPI (f.k.a. Swagger) document of an API. For this demo, we will use the "Thingies API", [`thingies-api.oas2.yaml`](./thingies-api.oas2.yaml).

2\. The _consumer_ wants to use the "Thingies API" with **her/his** own test data. For instance when she/he sends the request:

```text
GET localhost:8000/thingies/123
```

she/he expects to receive the following response:

```json
{
  "id": "123",
  "name": "stuff"
}
```

3\. Therefore, the _consumer_ creates a _Pact file_ that follows **her/his** scenario/interaction, [`consumer.pact.json`](./consumer.pact.json).

> **_Warning._** There is, of course, a risk that the _consumer_ does not respect the actual behavior of the API when defining her/his scenario/interaction, that's why there is a **_verification_** step afterwards.

4\. And then, the _consumer_ can start a _Pact Stub Server_ using the `pact-stub-server` command with the _Pact file_:

```text
pact-stub-server --file consumer.pact.json --port 8000
```

in order to run her/his test script, e.g.[`consumer.test.cmd`](./consumer.test.cmd):

```text
consumer.test.cmd
```

```text
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100    27  100    27    0     0     27      0  0:00:01 --:--:--  0:00:01   114
  "name": "stuff"
Passed.
```

> **_Remark._** At this stage, this test will obviously work as it is the same _consumer_ that decides, within the test script, what the response should be, but also decides, within the _Pact file_ run by the _Pact Stub Server_, what the response will be. This test is like a self-fulfilling prophecy! Again, that's why there is a **_verification_** step afterwards, during which the _provider_ will verify that the _Pact file_ created by the _consumer_ makes sense or not.

5\. Now, the _consumer_ passes her/his Pact file, [`consumer.pact.json`](./consumer.pact.json), to the _provider_ so she/he can verify it.

6\. The _provider_ runs her/his implementation of the "Thingies API", e.g. [`provider.app.v1.js`](./provider.app.v1.js):

```text
node provider.app.v1
```

```text
Provider service is running at localhost:3000...
```

7\. The _provider_ can then verify the consumer Pact file, [`consumer.pact.json`](./consumer.pact.json), with the _Pact Verifier CLI_ using the `pact_verifier_cli` command. This tool will read the _Pact file_ the other way around: it will send the `request` of the `interaction` to the actual implementation of the "Thingies API" and check if the actual response corresponds to the `response` defined by the _consumer_ in the _Pact file_.

```text
pact_verifier_cli --file consumer.pact.json --hostname localhost --port 3000
```

```text
  Given has one thingy with '123' as an thingyId
    WARNING: State Change ignored as there is no state change URL provided
09:15:55 [WARN]

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
           / -> Expected body Present(27 bytes) but was empty
    1.2) has status code 200
           expected 200 but was 404
    1.3) includes header 'Content-Type' with value '"application/json; charset=utf-8"'
           Expected header 'Content-Type' to have value '"application/json; charset=utf-8"' but was ''

There were 1 pact failures
```

The verification obviously fails as the test data invented by the _consumer_ does not match the test/real data used by the _provider_.

This is where the _Provider States_ come to the rescue by **_"allowing you to set up data on the provider by injecting it straight into the data source before the interaction is run, so that it can make a response that matches what the consumer expects."_** But, how does this **_"injection"_** work? No magic, just before sending the request of an interaction the `pact_verifier_cli` sends the _Provider State_, i.e. the free text representing the _Provider State_, to the _provider_ using a `POST /` endpoint with the following JSON structure:

```json
{
  "action": "setup",
  "params": {},
  "state": "has one thingy with '123' as an thingyId"
}
```

So, it means that, as a _provider_ you have to **manually** map (by writing some new specific code) this long string representing the _Provider State_ invented by the _consumer_ with the **injection of some specific test data**. Something like this, implemented in [`provider.app.v2.js`](./provider.app.v2.js):

```javascript
app.post('/', (req, res) => {
  const providerState = req.body.state
  switch(providerState) {
    case "has one thingy with '123' as an thingyId":
      thingies.push({
        id: "123",
        name: "stuff"
      })
      break
    default:
      res.status(404).end()
      return
  }
  res.status(201).end()
})
````

> **_Warning._** This is not production-ready code ;-)

So, you can see that this technique can be error-prone and maybe difficult to scale when a _provider_ has a lot of _customers_, but this effort needed must be put in perspective with the work needed to maintain and prepare "connected test environment(s)" in order to perform valuable end-to-end testing. As a reminder, the goal of _Consumer-Driven Contract Testing with Pact_ is to remove the need of end-to-end testing!

Running the updated version of implementation of the "Thingies API", [`provider.app.v2.js`](./provider.app.v2.js):

```text
node provider.app.v2
```

We can re-run the `pact_verifier_cli` command specifying the URL of the `POST` endpoint using the `--state-change-url` option:

```text
pact_verifier_cli --file consumer.pact.json --hostname localhost --port 3000 --state-change-url http://localhost:3000
```

```text
  Given has one thingy with '123' as an thingyId
09:18:15 [WARN]

Please note:
We are tracking events anonymously to gather important usage statistics like Pact version and operating system. To disable tracking, set the 'PACT_DO_NOT_TRACK' environment variable to 'true'.



Verifying a pact between Thingies Consumer Example and Thingies Provider Example

  get one thingy
    returns a response which
      has status code 200 (OK)
      includes headers
        "Content-Type" with value "application/json; charset=utf-8" (OK)
      has a matching body (OK)
```

Yeah!

## References

* Skurrie, B. (2014, December 5). _Enter the Pact Matrix. Or, how to decouple the release cycles of your microservices._ REA Group Blog. <https://www.rea-group.com/about-us/news-and-insights/blog/enter-the-pact-matrix-or-how-to-decouple-the-release-cycles-of-your-microservices/>
