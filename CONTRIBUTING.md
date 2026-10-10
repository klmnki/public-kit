# Contributing

Report an outdated request, improve an instruction or share a question you answered with real data. A small, reproducible example helps us understand the change.

## Source corrections

Include the official documentation URL, date checked, request parameters and observed response. Explain the access conditions and any limitation that affects interpretation. Keep the source route in `SKILL.md` and its entry in `data/catalogue.json` consistent.

The directory covers institution-operated services with free routes. Check the operator, terms and limits before proposing a source. Keep credentials and private records out of issues, examples and commits. Include third-party responses only when their terms permit redistribution, with attribution and a retrieval date.

## Skill improvements

Start with a user's question. Show what the current instructions missed and how the change improves retrieval or the answer. Keep `SKILL.md` usable on its own. Distinguish a successful API request from evidence that an assistant followed the workflow well.

Useful checks include correct geography and units, complete pagination, preserved missing values and source notes, or an honest explanation of a failed request. Avoid adding a mandatory analytical framework to a question that needs a simple lookup.

## Website changes

Run `npm test` and `npm run build`. Check affected interactions and the mobile layout. Keep the population example consistent with `data/verified-example.json`, retain its footnotes, and label the saved response with its retrieval date. Verify the website's download matches the root `SKILL.md`.

Contribute original code and instructions under the project's MIT licence. Provider data and referenced materials retain their own terms; see [NOTICE](NOTICE.md).