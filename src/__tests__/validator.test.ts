import { ChatMessage } from "../messages/message";
import { isValid } from "../messages/validator";

test("Validator should reject messages that are too long", () =>{
    const message: ChatMessage = {
        sender: "Lorembot",
        message: "facilisis volutpat est velit egestas dui id ornare arcu odio ut sem nulla pharetra diam sit amet nisl suscipit adipiscing bibendum est ultricies integer quis auctor elit sed vulputate mi sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc consequat interdum"
    }
    let result: boolean = isValid(message)
    expect(result).toBe(false);
});

test("Validator should reject messages that contain forbidden words", () =>{
    const message: ChatMessage = {
        sender: "A Spammer",
        message: "spam"
    }
    let result: boolean = isValid(message)
    expect(result).toBe(false);
});

test("Validator should NOT reject messages that are fine", () =>{
    const message: ChatMessage = {
        sender: "Sender",
        message: "Hello there"
    }
    let result: boolean = isValid(message)
    expect(result).toBe(true);
});