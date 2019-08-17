import fastXmlParser from "fast-xml-parser";

const parserOptions = {
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : true,
    parseNodeValue : true,
    parseAttributeValue : true,
    trimValues: false
};

export const JsonToXmlParser = (data: string | object) => {
    var parser = new fastXmlParser.j2xParser(parserOptions);
    return parser.parse(data);
}
export const XmlToJsonParser = (data: string) => {
    return fastXmlParser.parse(data, parserOptions);
}