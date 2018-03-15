const expect = require("expect");

const {generateMessage, generateLocationMessage} = require("./message");

describe("generateMessage", () => {
    it("should generate the correct message object", () => {
        var from = "From";
        var text = "Text";
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text});
    });
});

describe("generateLocationMessage", () => {
    it("should generate the correct location object", () => {
        var from = "From";
        var latitude = 123;
        var longitude = 321;
        var url = "https://www.google.rs/maps?q=123,321";
        var message = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, url});
    });
});