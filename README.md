# sms ticket system security analysis

<p align="center" just>
<img src="docs/cat.jpg" alt="drawing" width="200" />
<img src="docs/bus.jpg" alt="drawing" width="200" /></p>
<br/>
a react native application that simulates the sms-based ticket purchasing system used in moldova's public transport network (buses and trolleybuses).

<br/>
this project demonstrates a critical security vulnerability in the ticketing system: ticket numbers are predictable and can be generated offline without completing a payment transaction.

## vulnerability

the official system appears to rely on a incremented ticket counter and does not adequately verify whether a payment was successfully completed before issuing a ticket.

- tickets can be generated without payment.
- the system does not reliably verify that the request originated from a paying subscriber.
- ticket inspectors typically perform only visual checks of ticket details.

as a result, an attacker can generate seemingly valid tickets without performing any financial transaction.

## context

this project was built to showcase reverse engineering, security analysis, and mobile development skills.
it highlights how seemingly simple systems can harbour serious vulnerabilities when they rely on weak authentication or predictable state.

## ⚠️ disclaimer ⚠️

this project is for educational and research purposes only.
It does not interact with, bypass, or target any real-world ticketing service.
