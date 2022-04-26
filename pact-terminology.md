# Pact Terminology

## Service Consumer

The _service consumer_ is a component/deployable-unit that initiates HTTP requests to another component/deployable-unit, called the _service provider_.

## Service Provider

The _service provider_ is a compoenent/deployable-unit that responds to HTTP requests from the _service provider_.

## Interaction

An _interaction_ is a single request and response pair.

## Pact File or Pact Contract

A _pact file_, also called a _pact contract_, is a JSON file that contains a collection of _interactions_ for a _service consumer_ and _service provider_ pair, representing the way the _service consumer_ expects the _service provider_ to behave in some specific situations.

## Mock Service Provider

The _mock service provider_ is a component/application/service/deployable-unit that responds to an HTTP request from the _service consumer that mock out the actual _service provider_ using a _pact contract_. It means that integration-like tests initiated from the _service consumer_ can be run without requiring the actual _service provider_ to be available.

## Pact Verification

The _pact verification_ is the process by which the _service provider_ receives and verify the _pact file_ created by the _service consumer_. The _service provider_ verifies a _pact file_ by replaying all the _interactions_ against its actual implementation and checking that the actual responses match those expected in the _pact file_.

## Provider State

...

## Pact Specification

...