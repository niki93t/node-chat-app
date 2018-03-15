const expect = require("expect");

const {generateMessage} = require("./message");

describe("generateMessage", () => {
    it("should generate the correct message object", () => {
        var from = "From";
        var text = "Text";
        var message = generateMessage(from, text);

        expect(message.createdAt).toBeA('number');
        expect(message).toInclude({from, text});
    });
});