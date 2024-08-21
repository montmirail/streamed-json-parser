import { StreamingJsonParser } from './parser';

const parser = new StreamingJsonParser();
parser.consume('{"foo": "bar", "fooo": {"foooo": "baar", "qux": {"quux": "qu');
parser.consume('xx"}}, "bar": "baar", "qux": {"quux": "quxx"}}');

console.log(parser.get());
