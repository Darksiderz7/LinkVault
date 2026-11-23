const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');

let server;
let baseUrl;

test.before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

test.after(() => server.close());

test('health endpoint reports healthy', async () => {
  const response = await fetch(`${baseUrl}/api/health`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'healthy');
});

test('creates, searches, and deletes a link', async () => {
  const create = await fetch(`${baseUrl}/api/links`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title:'Rize', url:'https://app.rize.education', category:'School', description:'Course platform' })
  });
  assert.equal(create.status, 201);
  const link = await create.json();

  const search = await fetch(`${baseUrl}/api/links?search=Rize`);
  assert.equal((await search.json()).length, 1);

  const remove = await fetch(`${baseUrl}/api/links/${link.id}`, { method:'DELETE' });
  assert.equal(remove.status, 204);
});

test('rejects invalid and duplicate links', async () => {
  const invalid = await fetch(`${baseUrl}/api/links`, {
    method:'POST', headers:{ 'Content-Type':'application/json' },
    body:JSON.stringify({ title:'Bad', url:'not-a-url', category:'Personal' })
  });
  assert.equal(invalid.status, 400);

  const duplicate = await fetch(`${baseUrl}/api/links`, {
    method:'POST', headers:{ 'Content-Type':'application/json' },
    body:JSON.stringify({ title:'GitHub copy', url:'https://github.com', category:'Development' })
  });
  assert.equal(duplicate.status, 409);
});
