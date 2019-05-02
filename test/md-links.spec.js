const mdLinks = require('../index');

describe('mdLinks', () => {
  it('should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });

  it('should return a promise', () => {
    expect(mdLinks('./test/test-dir') instanceof Promise).toBe(true);
  });

  it('promise should resolve an array', () => {
    return mdLinks('./test/test-dir').then(result => {
      expect(result instanceof Array).toBe(true);
    });
  });

  test("file './test/test-dir/A/archivoA.md' should find 3 links.", async () => {
    let result = await mdLinks('./test/test-dir/A/archivoA.md');
    expect(result.length).toEqual(3);
    // .then(result => {
    //   expect(result.length).toEqual(3);
    // }).catch(error => {});
  });

  test("directory './test/test-dir/' should find 9 links.", async () => {
    let result = await mdLinks('./test/test-dir/');
    expect(result.length).toEqual(9);
    //  .then(result => {
    //     expect(result.length === 6).toBe(true);
    //   }).catch(error => {});
  });

  test("file './test/test-dir/A/archivoA.txt' should fail with 'Invalid file extension'.", () => {
    expect.assertions(1);
    return mdLinks('./test/test-dir/A/archivoA.txt').catch(error => expect(error).toEqual('Invalid file extension'));
  });

  test("Empty path fails with 'Invalid path'. ", () => {
    expect.assertions(1);
    return mdLinks('').catch(error => expect(error).toEqual('Invalid path'));
  });

  test("file './test/test-dir/A/archivoC.md' finds 0 links", async () => {
    let result = await mdLinks('./test/test-dir/A/archivoC.md');
    expect(result.length).toEqual(0);
    //  .then(result => {
    //     expect(result.length === 0).toBe(true);
    //   }).catch(error => {});
  });

  test("file './test/test-dir/A/archivoB.md' finds 3 broken links", async () => {
    let result = await mdLinks('./test/test-dir/A/archivoB.md');
    expect(!result[0].ok && !result[1].ok && !result[2].ok).toEqual(true);
  });
});

//mdLinks('./test/test-dir/', { validate: true })
