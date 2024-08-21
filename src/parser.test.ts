import {StreamingJsonParser} from "./parser";

describe('StreamingJsonParser', () => {
  it('should read and parse a string to JSON', () => {
    // Arrange
    const parser = new StreamingJsonParser();

    // Act
    parser.consume('{"foo": "ba r"}');

    // Assert
    expect(parser.get()).toMatchObject({
      "foo": "ba r",
    });
  });

  it('should read and parse a string to JSON with multiple keys', () => {
    // Arrange
    const parser = new StreamingJsonParser();

    // Act
    parser.consume('{"foo": "bar", "fooo": "baar"}');

    // Assert
    expect(parser.get()).toMatchObject({
      "foo": "bar",
    });
  });

  it('should read and parse a string to JSON as chunk', () => {
    // Arrange
    const parser = new StreamingJsonParser();

    // Act
    parser.consume('{"foo":');
    parser.consume('"bar');

    // Assert
    expect(parser.get()).toMatchObject({
      "foo": "bar",
    });
  });

  it('should read and parse a partial string as JSON', () => {
    // Arrange
    const parser = new StreamingJsonParser();

    // Act
    parser.consume('{"foo": "bar');

    // Assert
    expect(parser.get()).toMatchObject({
      "foo": "bar",
    });
  });

  it('should read and parse recursive object', () => {
    // Arrange
    const parser = new StreamingJsonParser();

    // Act
    parser.consume('{"foo": "bar", "fooo": {"foooo": "baar"}, "qux": {"quux": "quxx"}');

    // Assert
    expect(parser.get()).toMatchObject({
      "foo": "bar",
      "fooo": {
        "foooo": "baar"
      },
      "qux": {
        "quux": "quxx"
      }
    });
  });

  it('should read and parse recursive partial recursive object', () => {
    // Arrange
    const parser = new StreamingJsonParser();

    // Act
    parser.consume('{"foo": "bar", "fooo": {"foooo": "ba');

    // Assert
    expect(parser.get()).toMatchObject({
      "foo": "bar",
      "fooo": {
        "foooo": "ba"
      },
    });
  });

  it('should read and parse deeply nested object in chunk', () => {
    // Arrange
    const parser = new StreamingJsonParser();

    // Act
    parser.consume('{"foo": "bar", "fooo": {"foooo": "baar", "qux": {"quux": "qu');
    parser.consume('xx"}}, "bar": "baar", "qux": {"quux": "quxx"}}');

    // Assert
    expect(parser.get()).toMatchObject({
      "foo": "bar",
      "fooo": {
        "foooo": "baar",
        "qux": {
          "quux": "quxx"
        }
      },
      "bar": "baar",
      "qux": {
        "quux": "quxx"
      }
    });
  });
});
