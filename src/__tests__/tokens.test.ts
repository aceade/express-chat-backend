import { createToken, getTokenEntry, removeExpiredTokens, removeToken, setSocket } from "../tokens/tokens";

afterEach(() => {
    jest.resetAllMocks();
})

test("Creating tokens", () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => 1000);

    const token = createToken();
    const result = getTokenEntry(token);
    expect(result).toStrictEqual({
        token: token,
        socketId: "",
        created: 1000
    });
});

test("Setting socketId for a token entry", () => {
    const socketId = "asiuydghuiay";
    const token = createToken();
    setSocket(token, socketId);
    const result = getTokenEntry(token);
    expect(result?.socketId).toBe(socketId)
});

test("Removing specific tokens", () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => 1000);

    const token = createToken();
    const result = getTokenEntry(token);
    expect(result).toStrictEqual({
        token: token,
        socketId: "",
        created: 1000
    });
    removeToken(token);
    expect(getTokenEntry(token)).toBe(undefined);
});

test("Removing expired tokens", () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => 1000);

    const token = createToken();

    // this should be an hour
    jest.spyOn(Date, 'now').mockImplementationOnce(() => 60_000_000);
    removeExpiredTokens();
    expect(getTokenEntry(token)).toBe(undefined);
});