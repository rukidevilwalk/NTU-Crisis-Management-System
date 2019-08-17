/* Author(s): Neo Kee Pin */
const input = {
    'name': "Tim",
    'email': "test@test.com",
    'contact': "123456778",
    'location': "Singapore",
    'description': "Singaore",
    'crisis_input': "others",
    'others': "testing"
};

test('name validation should not match special charater', () => {
    if (input['name'] != "") {
        expect(input['name']).toMatch(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/);
    }
});

test('email has to seem legit', () => {
    if (input['email'] != "") {
        expect(input['email']).toMatch(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
    }
});

test('contact validation should only take in numbers', () => {
    if (input['contact'] != "") {
        expect(input['contact']).toMatch(/^([0-9]+)$/);
    }
});

test('location cannot be empty', () => {
    expect(input['location']).not.toBe('');
});

test('description cannot be empty', () => {
    expect(input['description']).not.toBe('');
});

test('crisis_input cannot be empty', () => {
    expect(input['crisis_input']).not.toBe('');
});

test('others cannot be empty if crisis input is being set to others', () => {
    if (input['crisis_input'] == "others") {
        expect(input['others']).not.toBe('');
    }
});
