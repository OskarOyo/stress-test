# Stress Tester

This is a simple node script for stress testing an API. It will hammer the API on a single URL **x batches** of **x parallel requests**.

A *batch* consists of *x* number of parallel requests. When all parallel requests are finished (successful or not) then the batch is finished.

*Parallel requests* are done by creating a `Promise` for each request. And then use `await Promise.allSettled` to fire all the requests at once and wait for all to finish.

## Usage

```sh
node test.mjs [url] [num of batches] [num of parallel request]

# e.g.
node test.mjs 'http://localhost:3001/campaign-banners?locale=ja' 20 100
```
