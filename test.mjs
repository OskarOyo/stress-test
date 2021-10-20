import axios from 'axios';

const URL_FALLBACK = 'http://localhost:3001/campaign-banners?locale=ja';
const BATCHES_FALLBACK = 50;
const PARALLEL_REQUESTS_FALLBACK = 200;

const url = process.argv[2] || URL_FALLBACK;
console.log('url:', url);
const batches = Number(process.argv[3]) || BATCHES_FALLBACK;
console.log('batches:', batches);
const parallelRequests = Number(process.argv[4]) || PARALLEL_REQUESTS_FALLBACK;
console.log('parallelRequests:', parallelRequests);

const res = {};

async function gogo() {
  // First a single request to trigger any cache mechanism
  await axios.get(url);

  console.time('total time');
  for (let i = 0; i < batches; i++) {
    const log = `finished ${i + 1}/${batches}`;
    console.time(log);
    const promises = [];
    for (let j = 0; j < parallelRequests; j++) {
      const promise = axios.get(url);
      promises.push(promise);
    }
    try {
      const result = await Promise.allSettled(promises);
      result.forEach((x) => {
        if (x.status === 'fulfilled') {
          const currentCount = res[x.value.status] || 0;
          res[x.value.status] = currentCount + 1;
        } else {
          const currentCount = res[x.reason] || 0;
          res[x.reason] = currentCount + 1;
        }
      });
    } catch (error) {
      const currentCount = res[error.code] || 0;
      res[error.code] = currentCount + 1;
    }
    console.timeEnd(log);
  }

  console.log();
  console.log('DONE!', res);
  console.log('total requests expected', batches * parallelRequests);
  console.timeEnd('total time');
}

await gogo();
